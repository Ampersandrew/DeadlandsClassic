/* eslint-disable no-underscore-dangle */
import { Chips } from '../helpers/chips.mjs';

function _addToChipCollection(chip, collection) {
  const newCollection = collection.toObject();
  switch (chip) {
    case Chips.type.White:
      newCollection.white += 1;
      break;
    case Chips.type.Red:
      newCollection.red += 1;
      break;
    case Chips.type.Blue:
      newCollection.blue += 1;
      break;
    case Chips.type.Green:
      newCollection.green += 1;
      break;
    case Chips.type.TemporaryGreen:
      newCollection.temporaryGreen += 1;
      break;
    default:
  }
  return newCollection;
}

function _chatMessage(
  speaker = ChatMessage.getSpeaker(),
  title = 'Message',
  message = 'Forgot something...'
) {
  const chatData = {
    title,
    content: `<div><h2>${title}</h2>${message}</div>`,
    user: game.user.id,
    speaker,
    type: globalThis.CONST.CHAT_MESSAGE_TYPES.OTHER,
  };

  ChatMessage.create(chatData);
}

function socketLogCombatant(combatId, combatantId, index) {
  const combat = game.combats.get(combatId);
  const combatant = combat.combatants.get(combatantId);
  // eslint-disable-next-line no-console
  console.log('Found ', combatant.name, ' ', index);
}

function socketDiscardCard(combatId, combatantId, index) {
  const combat = game.combats.get(combatId);
  const combatant = combat.combatants.get(combatantId);

  combatant.discardCard(index);
}

function socketDrawCard(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.draw(combatantId);
}

function socketNextTurn(combatId) {
  const combat = game.combats.get(combatId);
  return combat.nextTurn();
}

function socketSleeveHighest(combatId) {
  const combat = game.combats.get(combatId);
  return combat.sleeveHighest();
}

function socketToggleRedJoker(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.toggleRedJoker(combatantId);
}

function socketToggleBlackJoker(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.toggleBlackJoker(combatantId);
}

function socketToggleSleeved(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.toggleSleeved(combatantId);
}

function socketToggleHostility(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.toggleHostility(combatantId);
}

function socketUndiscardCard(combatId, combatantId, index) {
  const combat = game.combats.get(combatId);
  const combatant = combat.combatants.get(combatantId);

  combatant.undiscardCard(index);
}

function socketVamoose(combatId, combatantId) {
  const combat = game.combats.get(combatId);
  return combat.vamoose(combatantId);
}

async function socketAddChipsActor(actorId, chips) {
  // extract the valid data from chips
  let { white, red, blue, green, temporaryGreen } = chips;

  white = typeof white === 'number' ? Math.floor(white) : 0;
  red = typeof red === 'number' ? Math.floor(red) : 0;
  blue = typeof blue === 'number' ? Math.floor(blue) : 0;
  green = typeof green === 'number' ? Math.floor(green) : 0;
  temporaryGreen =
    typeof temporaryGreen === 'number' ? Math.floor(temporaryGreen) : 0;

  const total = white + red + blue + green + temporaryGreen;

  // If we aren't actually adding any chips
  if (total <= 0) return;

  const actor = game.actors.get(actorId);

  // Adding at least one chip.
  const message = await actor.addMultipleChips({
    white,
    red,
    blue,
    green,
    temporaryGreen,
  });

  _chatMessage(ChatMessage.getSpeaker(), actor.name, message);
}

async function socketDrawChipActor(actorId, num = 1) {
  const actor = game.actors.get(actorId);

  let chipobject = {
    white: 0,
    red: 0,
    blue: 0,
    green: 0,
    temporaryGreen: 0,
  };

  for (let step = 0; step < num; step += 1) {
    const chip = Chips.randomDraw(true);
    chipobject = _addToChipCollection(chip, chipobject);
  }

  // Adding the randomly drawn chip.
  const message = await actor.addMultipleChips(chipobject);

  _chatMessage(ChatMessage.getSpeaker(), 'Chips drawn', message);
}

async function socketDrawChipMarshal() {
  const chip = Chips.randomDraw(false);

  const marshal = game.settings.get('deadlands-classic', 'marshal-chips');
  const newMarshal = marshal.toObject();

  if (chip === Chips.type.White) {
    newMarshal.chips.white += 1;
  } else if (chip === Chips.type.Red) {
    newMarshal.chips.red += 1;
  } else if (chip === Chips.type.Blue) {
    newMarshal.chips.blue += 1;
  }

  await game.settings.set('deadlands-classic', 'marshal-chips', newMarshal);
}

export function registerSocketFunctions(socket) {
  socket.register('socketLogCombatant', socketLogCombatant);
  socket.register('socketDiscardCard', socketDiscardCard);
  socket.register('socketDrawCard', socketDrawCard);
  socket.register('socketNextTurn', socketNextTurn);
  socket.register('socketSleeveHighest', socketSleeveHighest);
  socket.register('socketToggleBlackJoker', socketToggleBlackJoker);
  socket.register('socketToggleHostility', socketToggleHostility);
  socket.register('socketToggleRedJoker', socketToggleRedJoker);
  socket.register('socketToggleSleeved', socketToggleSleeved);
  socket.register('socketUndiscardCard', socketUndiscardCard);
  socket.register('socketVamoose', socketVamoose);
  socket.register('socketAddChipsActor', socketAddChipsActor);
  socket.register('socketDrawChipActor', socketDrawChipActor);
  socket.register('socketDrawChipMarshal', socketDrawChipMarshal);
}
