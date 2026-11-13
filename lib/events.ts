import { Engine } from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';

/**
 * Tells clients that `player` has joined the game.
 */
export const emitAdded = (player: Player, engine: Engine): void => {
  engine.emit('player:added', player);
};

/**
 * Tells clients that what `player` sees of `tile` has changed.
 */
export const emitVisibilityChanged = (
  tile: Tile,
  player: Player,
  engine: Engine
): void => {
  engine.emit('player:visibility-changed', tile, player);
};

/**
 * Tells clients that `player` is out of the game, defeated by `defeatingPlayer` (or no one).
 */
export const emitDefeated = (
  player: Player,
  defeatingPlayer: Player | null,
  engine: Engine
): void => {
  engine.emit('player:defeated', player, defeatingPlayer);
};
