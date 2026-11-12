import { AttributeRegistry } from '@civ-clone/core-civilization/AttributeRegistry';
import { CityNameRegistry } from '@civ-clone/core-civilization/CityNameRegistry';
import { CivilizationRegistry } from '@civ-clone/core-civilization/CivilizationRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { LeaderRegistry } from '@civ-clone/core-civilization/LeaderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import World from '@civ-clone/core-world/World';
/**
 * Seat each client's player in a new `world`, one after another in the order the clients were registered: the player
 *  chooses a civilization and a leader (unless they were chosen already), a `PickStartTile` rule picks its start tile
 *  and the `Spawn` rules give it its units there. The promise settles once every player is seated.
 */
export declare const seatPlayers: (
  world: World,
  clientRegistry: ClientRegistry,
  civilizationRegistry: CivilizationRegistry,
  leaderRegistry: LeaderRegistry,
  attributeRegistry: AttributeRegistry,
  cityNameRegistry: CityNameRegistry,
  traitRegistry: TraitRegistry,
  ruleRegistry: RuleRegistry
) => Promise<void>;
export default seatPlayers;
