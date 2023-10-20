export type AbilitiesTypeMap =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "charisma";

export interface CreatureBase {
  _isCreatureBase: true;
  getAbility(ability: AbilitiesTypeMap): number;
  getHP(): number;
  getMaxHP(): number;
}
