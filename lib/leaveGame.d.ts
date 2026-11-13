import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import Player from '@civ-clone/core-player/Player';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
/**
 * Whether `player` is still to move this turn.
 */
export declare const isStillToMove: (
  player: Player,
  currentPlayerRegistry: CurrentPlayerRegistry
) => boolean;
/**
 * `player` no longer moves this turn.
 */
export declare const stopMoving: (
  player: Player,
  currentPlayerRegistry: CurrentPlayerRegistry
) => void;
/**
 * Whether `player` is in the game.
 */
export declare const isInGame: (
  player: Player,
  playerRegistry: PlayerRegistry
) => boolean;
/**
 * `player` leaves the game: it takes no more turns.
 */
export declare const leaveGame: (
  player: Player,
  playerRegistry: PlayerRegistry
) => void;
