import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import Player from '@civ-clone/core-player/Player';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * Each of `player`'s cities works out its yields for the turn: they are totalled into one yield of each of
 *  `YieldTypes` (the ruleset's base yields, in the order they are processed), and each total goes to the
 *  `ProcessYield` rules, with the city and all of its yields.
 *
 * The types are given rather than found among the city's yields: processing whatever yields a city has would process
 *  the wrong values. Once a city is destroyed (by its own food running out, say), none of the rest of its yields are
 *  processed, so nothing is built in a city that no longer exists.
 */
export declare const processCityYields: (
  player: Player,
  YieldTypes: (typeof Yield)[],
  cityRegistry: CityRegistry,
  ruleRegistry: RuleRegistry
) => void;
export default processCityYields;
