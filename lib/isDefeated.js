"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefeated = void 0;
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is `leaving`: it has no cities left, and, when
 *  `keepsInGame` is given, none of its units still in play is one that `keepsInGame` (a unit that can found a city,
 *  say). With `keepsInGame` `null`, a player with no cities is out whatever units it has.
 */
const isDefeated = (player, cityRegistry, unitRegistry, leaving, keepsInGame) => cityRegistry.getByPlayer(player).every((city) => city === leaving) &&
    (keepsInGame === null ||
        unitRegistry
            .getByPlayer(player)
            .every((unit) => unit === leaving || unit.destroyed() || !keepsInGame(unit)));
exports.isDefeated = isDefeated;
exports.default = exports.isDefeated;
//# sourceMappingURL=isDefeated.js.map