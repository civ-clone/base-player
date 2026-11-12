"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayerTiles = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
/**
 * The effect shared by the built, removed and pillaged tile improvement rules: the tile's yields have changed, so drop
 *  the cached yields for everyone, and for each player who knows the tile.
 */
const updatePlayerTiles = (playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance) => new Effect_1.default((tile) => {
    tile.clearYieldCache(null);
    playerRegistry.forEach((player) => {
        const playerWorld = playerWorldRegistry.getByPlayer(player), playerTile = playerWorld.getByTile(tile);
        if (playerTile === null) {
            return;
        }
        tile.clearYieldCache(player);
    });
});
exports.updatePlayerTiles = updatePlayerTiles;
exports.default = exports.updatePlayerTiles;
//# sourceMappingURL=updatePlayerTiles.js.map