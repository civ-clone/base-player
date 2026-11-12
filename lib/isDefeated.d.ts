import City from '@civ-clone/core-city/City';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is `leaving`: it has no cities left, and, when
 *  `keepsInGame` is given, none of its units still in play is one that `keepsInGame` (a unit that can found a city,
 *  say). With `keepsInGame` `null`, a player with no cities is out whatever units it has.
 */
export declare const isDefeated: (
  player: Player,
  cityRegistry: CityRegistry,
  unitRegistry: UnitRegistry,
  leaving: City | Unit | null,
  keepsInGame: ((unit: Unit) => boolean) | null
) => boolean;
export default isDefeated;
