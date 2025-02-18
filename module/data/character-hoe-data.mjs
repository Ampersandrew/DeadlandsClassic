import { BaseActorDataModel } from './base-actor-data.mjs';

const { fields } = foundry.data;

export class CharacterHoeDataModel extends BaseActorDataModel {
  static defineSchema() {
    return {
      ...this.makeAptitudes('HE'),
      ...this.makeChipData(true),
      ...this.makeTraits(),
      ...this.makeWoundLocations(),

      biography: new fields.HTMLField(),
      cards: new fields.StringField({ required: false, initial: '' }),
      notes: new fields.HTMLField(),
    };
  }
}
