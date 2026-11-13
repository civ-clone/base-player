"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveGame = exports.isInGame = exports.stopMoving = exports.isStillToMove = void 0;
/**
 * Whether `player` is still to move this turn.
 */
const isStillToMove = (player, currentPlayerRegistry) => currentPlayerRegistry.includes(player);
exports.isStillToMove = isStillToMove;
/**
 * `player` no longer moves this turn.
 */
const stopMoving = (player, currentPlayerRegistry) => currentPlayerRegistry.unregister(player);
exports.stopMoving = stopMoving;
/**
 * Whether `player` is in the game.
 */
const isInGame = (player, playerRegistry) => playerRegistry.includes(player);
exports.isInGame = isInGame;
/**
 * `player` leaves the game: it takes no more turns.
 */
const leaveGame = (player, playerRegistry) => playerRegistry.unregister(player);
exports.leaveGame = leaveGame;
//# sourceMappingURL=leaveGame.js.map