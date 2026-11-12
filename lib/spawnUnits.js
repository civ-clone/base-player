"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnUnits = void 0;
/**
 * Give `player` its starting units on `tile`, one of each of `UnitTypes` in order (list a type twice for two), supported
 *  by no city. A ruleset's start units are data: the list is all it decides.
 */
const spawnUnits = (player, tile, UnitTypes, ruleRegistry) => UnitTypes.map((UnitType) => new UnitType(null, player, tile, ruleRegistry));
exports.spawnUnits = spawnUnits;
exports.default = exports.spawnUnits;
//# sourceMappingURL=spawnUnits.js.map