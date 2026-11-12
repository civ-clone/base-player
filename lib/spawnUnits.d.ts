import Player from '@civ-clone/core-player/Player';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * Give `player` its starting units on `tile`, one of each of `UnitTypes` in order (list a type twice for two), supported
 *  by no city. A ruleset's start units are data: the list is all it decides.
 */
export declare const spawnUnits: (
  player: Player,
  tile: Tile,
  UnitTypes: (typeof Unit)[],
  ruleRegistry: RuleRegistry
) => Unit[];
export default spawnUnits;
