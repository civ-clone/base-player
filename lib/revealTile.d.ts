import Player from '@civ-clone/core-player/Player';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Tile from '@civ-clone/core-world/Tile';
/**
 * `player` sees `tile`: its yields are worked out afresh for them, and their view of the world takes it in as it is now.
 */
export declare const revealTile: (
  tile: Tile,
  player: Player,
  playerWorldRegistry: PlayerWorldRegistry
) => void;
export default revealTile;
