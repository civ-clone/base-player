"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefeatedWithFounders = void 0;
const FoundsCities_1 = require("@civ-clone/base-unit-trait-founds-cities/FoundsCities");
const isDefeated_1 = require("./isDefeated");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is `leaving`, with units that found cities
 * keeping some players in it. With `foundersKeepAlive` (by default, when a person plays `player`), a player with no
 * cities is out only once it has no unit that `FoundsCities` either, asked of each unit, so of its own game's rules.
 * Without it, a player with no cities is out whatever units it has. A ruleset passes `true` when a unit is lost, so a
 * computer player that hasn't founded its first city yet isn't out with the first unit it loses.
 */
const isDefeatedWithFounders = (player, cityRegistry, unitRegistry, clientRegistry, leaving = null, foundersKeepAlive = (0, isHuman_1.default)(player, clientRegistry)) => (0, isDefeated_1.default)(player, cityRegistry, unitRegistry, leaving, foundersKeepAlive
    ? (unit) => unit.hasTrait(FoundsCities_1.default)
    : null);
exports.isDefeatedWithFounders = isDefeatedWithFounders;
exports.default = exports.isDefeatedWithFounders;
//# sourceMappingURL=isDefeatedWithFounders.js.map