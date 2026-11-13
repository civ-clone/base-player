import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import Player from '@civ-clone/core-player/Player';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';

/**
 * Whether `player` is still to move this turn.
 */
export const isStillToMove = (
  player: Player,
  currentPlayerRegistry: CurrentPlayerRegistry
): boolean => currentPlayerRegistry.includes(player);

/**
 * `player` no longer moves this turn.
 */
export const stopMoving = (
  player: Player,
  currentPlayerRegistry: CurrentPlayerRegistry
): void => currentPlayerRegistry.unregister(player);

/**
 * Whether `player` is in the game.
 */
export const isInGame = (
  player: Player,
  playerRegistry: PlayerRegistry
): boolean => playerRegistry.includes(player);

/**
 * `player` leaves the game: it takes no more turns.
 */
export const leaveGame = (
  player: Player,
  playerRegistry: PlayerRegistry
): void => playerRegistry.unregister(player);
