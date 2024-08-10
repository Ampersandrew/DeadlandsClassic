// import modules
import { ActorModEdgeModel } from './data/actor-mod-edge-data.mjs';
import { ActorModHindranceModel } from './data/actor-mod-hindrance-data.mjs';
import { ActorModSpellLikeModel } from './data/actor-mod-spelllike-data.mjs';
import { CharacterHoeDataModel } from './data/character-hoe-data.mjs';
import { CharacterLcDataModel } from './data/character-lc-data.mjs';
import { CharacterWwDataModel } from './data/character-ww-data.mjs';
import { GunDataModel } from './data/gun-data.mjs';
import { MeleeDataModel } from './data/melee-data.mjs';
import { MiscItemDataModel } from './data/misc-item-data.mjs';
import { NPCDataModel } from './data/npc-data.mjs';
import { OtherRangedDataModel } from './data/other-ranged-data.mjs';
import { DeadlandsDie } from './dice/dlc-die.mjs';
import { DeadlandsRollParser } from './dice/dlc-parser.mjs';
import { DeadlandsRoll } from './dice/dlc-rolls.mjs';
import { DeadlandsActor } from './documents/dlc-actor.mjs';
import { DeadlandsCombat } from './documents/dlc-combat.mjs';
import { DeadlandsCombatant } from './documents/dlc-combatant.mjs';
import { DeadlandsItem } from './documents/dlc-item.mjs';
import { CanonicalCards } from './helpers/canonicalcards.mjs';
import { Chips } from './helpers/chips.mjs';
import { addChipTab } from './init/add-chip-tab.mjs';
import { preloadTemplates } from './init/preloads.mjs';
import { registerItemSheets } from './init/register-item-sheets.mjs';
import { createGameSettings } from './init/settings.mjs';
import { registerSocketFunctions } from './init/socket-functions.mjs';
import { DLCActorSheet } from './sheets/actor-sheet.mjs';
import { ChipManager } from './sidebar/chip-manager.mjs';
import { DeadlandsActorDirectory } from './sidebar/dlc-actors-directory.mjs';
import { DeadlandsCombatTracker } from './sidebar/dlc-combat-tracker.mjs';
import { DeadlandsItemDirectory } from './sidebar/dlc-items-directory.mjs';
import { DlcSocketManager } from './sockets/dlc-socket-manager.mjs';
import { dlcConfig } from './config.mjs';

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

// Socket for socketlib
let socket;

// Remove Comment and activate next line for Production
// CONFIG.debug.hooks = false;
// Temporary Setting for debugging
CONFIG.debug.hooks = true;

/**
 * Init hook.
 */
Hooks.once('init', async () => {
  CONFIG.dlcConfig = dlcConfig;

  // eslint-disable-next-line no-console
  console.log(dlcConfig.Ascii);

  // eslint-disable-next-line no-console
  console.log('Deadlands Classic | Initalising');

  // Define custom Document classes
  CONFIG.Actor.documentClass = DeadlandsActor;
  CONFIG.Combat.documentClass = DeadlandsCombat;
  CONFIG.Combatant.documentClass = DeadlandsCombatant;
  CONFIG.Item.documentClass = DeadlandsItem;

  // Define custom ui classes
  CONFIG.ui.combat = DeadlandsCombatTracker;
  CONFIG.ui.actors = DeadlandsActorDirectory;
  CONFIG.ui.chips = ChipManager;
  CONFIG.ui.items = DeadlandsItemDirectory;

  /* -------------------------------------------- */

  /* global dlcSocketManager */
  globalThis.DlcSocketManager = new DlcSocketManager();
  socket = globalThis.DlcSocketManager.registerSystem('deadlands-classic');

  if (!('deadlands-classic' in globalThis.game)) {
    game['deadlands-classic'] = {};
    game['deadlands-classic'].socket = socket;
  }

  registerSocketFunctions(socket);

  /* -------------------------------------------- */
  if (!('chips' in globalThis.game)) {
    game.chips = {};
    game.chips.apps = {};
  }

  CONFIG.Actor.dataModels.characterhoe = CharacterHoeDataModel;
  CONFIG.Actor.dataModels.characterlc = CharacterLcDataModel;
  CONFIG.Actor.dataModels.characterww = CharacterWwDataModel;

  CONFIG.Actor.dataModels.npc = NPCDataModel;

  CONFIG.Item.dataModels.edge = ActorModEdgeModel;
  CONFIG.Item.dataModels.hindrance = ActorModHindranceModel;
  CONFIG.Item.dataModels.spellLike = ActorModSpellLikeModel;

  CONFIG.Item.dataModels.gun = GunDataModel;
  CONFIG.Item.dataModels.melee = MeleeDataModel;
  CONFIG.Item.dataModels.miscItem = MiscItemDataModel;
  CONFIG.Item.dataModels.otherRanged = OtherRangedDataModel;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('deadlands-classic', DLCActorSheet, {
    types: ['characterhoe'],
    makeDefault: true,
    label: 'DLC.sheet-type.characterhoe',
  });
  Actors.registerSheet('deadlands-classic', DLCActorSheet, {
    types: ['characterlc'],
    makeDefault: true,
    label: 'DLC.sheet-type.characterlc',
  });

  Actors.registerSheet('deadlands-classic', DLCActorSheet, {
    types: ['characterww'],
    makeDefault: true,
    label: 'DLC.sheet-type.characterww',
  });

  // Make the parser recognise and construct a DeadlandsDie
  CONFIG.Dice.parser = DeadlandsRollParser;
  CONFIG.Dice.rolls = [DeadlandsRoll];

  if (!('l' in CONFIG.Dice.terms)) {
    CONFIG.Dice.terms.l = DeadlandsDie;
  }

  registerItemSheets();
  createGameSettings();

  globalThis.CanonicalCards = new CanonicalCards();

  await preloadTemplates();
});

Hooks.once('setup', async () => {
  // eslint-disable-next-line no-console
  console.log('Deadlands Classic | Setting Up');
  Chips.buildCurrentChipPool();
});

Hooks.once('ready', async () => {
  // eslint-disable-next-line no-console
  console.log('Deadlands Classic | Readying');
});

Hooks.on('renderSidebar', async (app, html) => {
  // add the partyTab
  addChipTab(app, html);
});
