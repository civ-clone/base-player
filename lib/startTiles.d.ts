import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile, { IYieldMap } from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
/**
 * The tiles of `world` a player could start on, best first: those whose terrain is one of `TerrainTypes`, ranked by the
 *  score of the area around each, every tile in it scored with `weights`. Equal scores keep the world's order.
 */
export declare const rankStartTiles: (
  world: World,
  TerrainTypes: (typeof Terrain)[],
  weights: IYieldMap[]
) => Tile[];
export default rankStartTiles;
