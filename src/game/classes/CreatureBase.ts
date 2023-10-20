export type AbilitiesTypeMap =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";
export type CreateBaseTypeMap = AbilitiesTypeMap | "HP" | "maxHP";

export class CreatureBase {
  constructor(
    private strength: number,
    private dexterity: number,
    private constitution: number,
    private intelligence: number,
    private wisdom: number,
    private charisma: number,
    private HP: number,
    private maxHP: number
  ) {}

  public get(attr: CreateBaseTypeMap) {
    return this[attr];
  }

  public getModifier(ability: AbilitiesTypeMap) {
    const abilityValue = this[ability];
    return Math.ceil((abilityValue - 10) / 2);
  }
}
