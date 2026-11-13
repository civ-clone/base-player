import Player from '@civ-clone/core-player/Player';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
/**
 * At the start of `player`'s turn, each of its units gets its full moves. One with nothing to do is active and no
 *  longer waiting; one that is busy carries on with what it is doing, if that is still valid, and it is the busy
 *  action's job to make the unit active again (otherwise actions that chain one busy action after another would be
 *  cleared here).
 */
export declare const resetUnits: (
  player: Player,
  unitRegistry: UnitRegistry
) => void;
export default resetUnits;
