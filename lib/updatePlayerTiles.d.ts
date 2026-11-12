import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Effect from '@civ-clone/core-rule/Effect';
/**
 * The effect shared by the built, removed and pillaged tile improvement rules: the tile's yields have changed, so drop
 *  the cached yields for everyone, and for each player who knows the tile.
 */
export declare const updatePlayerTiles: (
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry
) => Effect;
export default updatePlayerTiles;
