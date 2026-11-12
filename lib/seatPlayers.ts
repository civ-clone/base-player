import { AttributeRegistry } from '@civ-clone/core-civilization/AttributeRegistry';
import { CityNameRegistry } from '@civ-clone/core-civilization/CityNameRegistry';
import { CivilizationRegistry } from '@civ-clone/core-civilization/CivilizationRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { LeaderRegistry } from '@civ-clone/core-civilization/LeaderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import ChoiceMeta from '@civ-clone/core-client/ChoiceMeta';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Client from '@civ-clone/core-client/Client';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';

/**
 * Seat each client's player in a new `world`, one after another in the order the clients were registered: the player
 *  chooses a civilization and a leader (unless they were chosen already), a `PickStartTile` rule picks its start tile
 *  and the `Spawn` rules give it its units there. The promise settles once every player is seated.
 */
export const seatPlayers = (
  world: World,
  clientRegistry: ClientRegistry,
  civilizationRegistry: CivilizationRegistry,
  leaderRegistry: LeaderRegistry,
  attributeRegistry: AttributeRegistry,
  cityNameRegistry: CityNameRegistry,
  traitRegistry: TraitRegistry,
  ruleRegistry: RuleRegistry
): Promise<void> => {
  const usedStartSquares: Tile[] = [];

  // A civilization or leader chosen before the world is built (a game set up seat by seat, civ-clone/web-renderer#604)
  //  is kept, and taken out of the choice before anyone else picks, so that a player choosing at random can't take
  //  it. `Player#civilization` throws while unset, so this is the only way to ask. A preset leader is trusted to be
  //  one of its civilization's: whoever set it chose it from that list.
  const chosenCivilization = (player: Player): Civilization | null => {
    try {
      return player.civilization();
    } catch {
      return null;
    }
  };

  (clientRegistry.entries() as Client[]).forEach((client: Client): void => {
    const civilization = chosenCivilization(client.player());

    if (civilization === null) {
      return;
    }

    civilizationRegistry.unregister(civilization.sourceClass());

    const leader = civilization.leader();

    if (leader !== null) {
      leaderRegistry.unregister(leader.sourceClass());
    }
  });

  return (clientRegistry.entries() as Client[]).reduce(
    (promise: Promise<void>, client: Client): Promise<void> =>
      promise.then(async () => {
        const player = client.player();

        let civilization = chosenCivilization(player);

        if (civilization === null) {
          const CivilizationChoice = await client.chooseFromList(
            new ChoiceMeta(
              civilizationRegistry.entries(),
              'choose-civilization'
            )
          );

          civilization = new CivilizationChoice(
            attributeRegistry,
            cityNameRegistry
          );

          player.setCivilization(civilization);

          civilizationRegistry.unregister(civilization.sourceClass());
        }

        if (civilization.leader() === null) {
          const LeaderChoice = await client.chooseFromList(
              new ChoiceMeta(
                leaderRegistry.getByCivilization(civilization.sourceClass()),
                'choose-leader'
              )
            ),
            leader = new LeaderChoice(traitRegistry);

          civilization.setLeader(leader);

          leaderRegistry.unregister(leader.sourceClass());
        }

        const [startingSquare] = ruleRegistry.process(
          PickStartTile,
          world,
          player,
          usedStartSquares
        );

        if (!startingSquare) {
          throw new TypeError('Not enough `startingSquare`s.');
        }

        usedStartSquares.push(startingSquare);

        ruleRegistry.process(Spawn, player, startingSquare);
      }),
    Promise.resolve()
  );
};

export default seatPlayers;
