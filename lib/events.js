"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitDefeated = exports.emitVisibilityChanged = exports.emitAdded = void 0;
/**
 * Tells clients that `player` has joined the game.
 */
const emitAdded = (player, engine) => {
    engine.emit('player:added', player);
};
exports.emitAdded = emitAdded;
/**
 * Tells clients that what `player` sees of `tile` has changed.
 */
const emitVisibilityChanged = (tile, player, engine) => {
    engine.emit('player:visibility-changed', tile, player);
};
exports.emitVisibilityChanged = emitVisibilityChanged;
/**
 * Tells clients that `player` is out of the game, defeated by `defeatingPlayer` (or no one).
 */
const emitDefeated = (player, defeatingPlayer, engine) => {
    engine.emit('player:defeated', player, defeatingPlayer);
};
exports.emitDefeated = emitDefeated;
//# sourceMappingURL=events.js.map