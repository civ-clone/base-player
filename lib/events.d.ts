import { Engine } from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
/**
 * Tells clients that `player` has joined the game.
 */
export declare const emitAdded: (player: Player, engine: Engine) => void;
/**
 * Tells clients that what `player` sees of `tile` has changed.
 */
export declare const emitVisibilityChanged: (
  tile: Tile,
  player: Player,
  engine: Engine
) => void;
/**
 * Tells clients that `player` is out of the game, defeated by `defeatingPlayer` (or no one).
 */
export declare const emitDefeated: (
  player: Player,
  defeatingPlayer: Player | null,
  engine: Engine
) => void;
