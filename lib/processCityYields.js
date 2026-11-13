"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCityYields = void 0;
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
/**
 * Each of `player`'s cities works out its yields for the turn: they are totalled into one yield of each of
 *  `YieldTypes` (the ruleset's base yields, in the order they are processed), and each total goes to the
 *  `ProcessYield` rules, with the city and all of its yields.
 *
 * The types are given rather than found among the city's yields: processing whatever yields a city has would process
 *  the wrong values. Once a city is destroyed (by its own food running out, say), none of the rest of its yields are
 *  processed, so nothing is built in a city that no longer exists.
 */
const processCityYields = (player, YieldTypes, cityRegistry, ruleRegistry) => cityRegistry.getByPlayer(player).forEach((city) => {
    const cityYields = city.yields();
    (0, reduceYields_1.reduceYields)(cityYields, ...YieldTypes)
        .reduce((yields, yieldValue, index) => {
        yields[index].set(yieldValue, 'Consolidated');
        return yields;
    }, YieldTypes.map((YieldType) => new YieldType(0, 'Consolidated')))
        .forEach((cityYield) => {
        if (city.destroyed()) {
            return;
        }
        ruleRegistry.process(ProcessYield_1.default, cityYield, city, cityYields);
    });
});
exports.processCityYields = processCityYields;
exports.default = exports.processCityYields;
//# sourceMappingURL=processCityYields.js.map