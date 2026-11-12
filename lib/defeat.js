"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyUnits = exports.defeat = void 0;
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
/**
 * Defeat `player`, by `defeatingPlayer` (or no one), unless it is already out of the game.
 *
 * Meant to be checked inside an `Effect` rather than as a `Criterion`: every `Criterion` of a rule set is evaluated
 *  before any `Effect` runs, and an earlier `Effect` of the same rule set can be what defeats the player (the units a
 *  lost city supported going with it, say). Defeating it again would run the `Defeated` rules twice.
 */
const defeat = (player, defeatingPlayer, playerRegistry, ruleRegistry) => {
    if (!playerRegistry.includes(player)) {
        return;
    }
    ruleRegistry.process(Defeated_1.default, player, defeatingPlayer);
};
exports.defeat = defeat;
/**
 * Destroy every unit `player` has, by `defeatingPlayer`, with the `Defeated` rules switched off while they go, so that
 *  losing the last of them doesn't defeat the player again. The rules that were enabled are enabled again afterwards.
 */
const destroyUnits = (player, defeatingPlayer, ruleRegistry, unitRegistry) => {
    const defeatedRules = ruleRegistry
        .get(Defeated_1.default)
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
exports.destroyUnits = destroyUnits;
//# sourceMappingURL=defeat.js.map