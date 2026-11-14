import City from '@civ-clone/core-city/City';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import FoundsCities from '@civ-clone/base-unit-trait-founds-cities/FoundsCities';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import isDefeated from './isDefeated';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

/**
 * Whether `player` is out of the game, leaving aside a city or unit that is `leaving`, with units that found cities
 * keeping some players in it. With `foundersKeepAlive` (by default, when a person plays `player`), a player with no
 * cities is out only once it has no unit that `FoundsCities` either, asked of each unit, so of its own game's rules.
 * Without it, a player with no cities is out whatever units it has. A ruleset passes `true` when a unit is lost, so a
 * computer player that hasn't founded its first city yet isn't out with the first unit it loses.
 */
export const isDefeatedWithFounders = (
  player: Player,
  cityRegistry: CityRegistry,
  unitRegistry: UnitRegistry,
  clientRegistry: ClientRegistry,
  leaving: City | Unit | null = null,
  foundersKeepAlive: boolean = isHuman(player, clientRegistry)
): boolean =>
  isDefeated(
    player,
    cityRegistry,
    unitRegistry,
    leaving,
    foundersKeepAlive
      ? (unit: Unit): boolean => unit.hasTrait(FoundsCities)
      : null
  );

export default isDefeatedWithFounders;
