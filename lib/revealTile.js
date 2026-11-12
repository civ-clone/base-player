"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revealTile = void 0;
/**
 * `player` sees `tile`: its yields are worked out afresh for them, and their view of the world takes it in as it is now.
 */
const revealTile = (tile, player, playerWorldRegistry) => {
    tile.clearYieldCache(player);
    const playerWorld = playerWorldRegistry.getByPlayer(player);
    playerWorld.register(tile);
    const playerTile = playerWorld.getByTile(tile);
    playerTile.update();
};
exports.revealTile = revealTile;
exports.default = exports.revealTile;
//# sourceMappingURL=revealTile.js.map