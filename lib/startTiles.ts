import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile, { IYieldMap } from '@civ-clone/core-world/Tile';
import Player from '@civ-clone/core-player/Player';
import World from '@civ-clone/core-world/World';

/**
 * The tiles of `world` a player could start on, best first: those whose terrain is one of `TerrainTypes`, ranked by the
 *  score of the area around each, every tile in it scored with `weights`. Equal scores keep the world's order.
 */
export const rankStartTiles = (
  world: World,
  TerrainTypes: (typeof Terrain)[],
  weights: IYieldMap[]
): Tile[] => {
  const tileCache: Map<Tile, number> = new Map(),
    areaCache: Map<Tile, number> = new Map(),
    tileScore = (tile: Tile, player: Player | null = null): number => {
      if (!tileCache.has(tile)) {
        tileCache.set(tile, tile.score(player, weights));
      }

      return tileCache.get(tile)!;
    },
    areaScore = (tile: Tile, player: Player | null = null): number => {
      if (!areaCache.has(tile)) {
        areaCache.set(
          tile,
          tile
            .getSurroundingArea()
            .entries()
            .reduce(
              (total: number, tile: Tile): number =>
                total + tileScore(tile, player),
              0
            )
        );
      }

      return areaCache.get(tile)!;
    };

  return world
    .entries()
    .filter((tile: Tile) =>
      TerrainTypes.some((TerrainType) => tile.terrain() instanceof TerrainType)
    )
    .map((tile: Tile) => ({
      tile,
      score: areaScore(tile),
    }))
    .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
    .map(({ tile }) => tile);
};

export default rankStartTiles;
