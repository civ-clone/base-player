import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Player from '@civ-clone/core-player/Player';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';

/**
 * Defeat `player`, by `defeatingPlayer` (or no one), unless it is already out of the game.
 *
 * Meant to be checked inside an `Effect` rather than as a `Criterion`: every `Criterion` of a rule set is evaluated
 *  before any `Effect` runs, and an earlier `Effect` of the same rule set can be what defeats the player (the units a
 *  lost city supported going with it, say). Defeating it again would run the `Defeated` rules twice.
 */
export const defeat = (
  player: Player,
  defeatingPlayer: Player | null,
  playerRegistry: PlayerRegistry,
  ruleRegistry: RuleRegistry
): void => {
  if (!playerRegistry.includes(player)) {
    return;
  }

  ruleRegistry.process(Defeated, player, defeatingPlayer);
};

/**
 * Destroy every unit `player` has, by `defeatingPlayer`, with the `Defeated` rules switched off while they go, so that
 *  losing the last of them doesn't defeat the player again. The rules that were enabled are enabled again afterwards.
 */
export const destroyUnits = (
  player: Player,
  defeatingPlayer: Player | null,
  ruleRegistry: RuleRegistry,
  unitRegistry: UnitRegistry
): void => {
  const defeatedRules: [Defeated, boolean][] = ruleRegistry
    .get(Defeated)
    .map((rule) => [rule, rule.enabled()]);

  defeatedRules.forEach(([rule]) => rule.disable());

  unitRegistry
    .getByPlayer(player)
    .forEach((unit) => unit.destroy(defeatingPlayer));

  defeatedRules.forEach(([rule, enabled]) => {
    if (!enabled) {
      return;
    }

    rule.enable();
  });
};
