import Player from '@civ-clone/core-player/Player';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Tile from '@civ-clone/core-world/Tile';

/**
 * `player` sees `tile`: its yields are worked out afresh for them, and their view of the world takes it in as it is now.
 */
export const revealTile = (
  tile: Tile,
  player: Player,
  playerWorldRegistry: PlayerWorldRegistry
): void => {
  tile.clearYieldCache(player);

  const playerWorld = playerWorldRegistry.getByPlayer(player);

  playerWorld.register(tile);

  const playerTile = playerWorld.getByTile(tile)!;

  playerTile.update();
};

export default revealTile;
