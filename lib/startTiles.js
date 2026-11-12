"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankStartTiles = void 0;
/**
 * The tiles of `world` a player could start on, best first: those whose terrain is one of `TerrainTypes`, ranked by the
 *  score of the area around each, every tile in it scored with `weights`. Equal scores keep the world's order.
 */
const rankStartTiles = (world, TerrainTypes, weights) => {
    const tileCache = new Map(), areaCache = new Map(), tileScore = (tile, player = null) => {
        if (!tileCache.has(tile)) {
            tileCache.set(tile, tile.score(player, weights));
        }
        return tileCache.get(tile);
    }, areaScore = (tile, player = null) => {
        if (!areaCache.has(tile)) {
            areaCache.set(tile, tile
                .getSurroundingArea()
                .entries()
                .reduce((total, tile) => total + tileScore(tile, player), 0));
        }
        return areaCache.get(tile);
    };
    return world
        .entries()
        .filter((tile) => TerrainTypes.some((TerrainType) => tile.terrain() instanceof TerrainType))
        .map((tile) => ({
        tile,
        score: areaScore(tile),
    }))
        .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
        .map(({ tile }) => tile);
};
exports.rankStartTiles = rankStartTiles;
exports.default = exports.rankStartTiles;
//# sourceMappingURL=startTiles.js.map