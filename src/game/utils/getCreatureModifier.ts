import { AbilitiesTypeMap, CreatureBase } from "../classes/CreatureBase";

export function getCreatureModifier(creature: CreatureBase, ability: AbilitiesTypeMap) {
  const abilityValue = creature.getAbility(ability);
  return Math.floor((abilityValue - 10) / 2);
}
