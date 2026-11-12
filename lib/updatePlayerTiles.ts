import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';

/**
 * The effect shared by the built, removed and pillaged tile improvement rules: the tile's yields have changed, so drop
 *  the cached yields for everyone, and for each player who knows the tile.
 */
export const updatePlayerTiles = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Effect =>
  new Effect((tile: Tile) => {
    tile.clearYieldCache(null);

    playerRegistry.forEach((player) => {
      const playerWorld = playerWorldRegistry.getByPlayer(player),
        playerTile = playerWorld.getByTile(tile);

      if (playerTile === null) {
        return;
      }

      tile.clearYieldCache(player);
    });
  });

export default updatePlayerTiles;
