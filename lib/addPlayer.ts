import Civilization from '@civ-clone/core-civilization/Civilization';
import { Game } from '@civ-clone/core-game';
import Leader from '@civ-clone/core-civilization/Leader';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import World from '@civ-clone/core-world/World';

// The parts of a game a new player needs. A `Game` has them all.
export type AddPlayerGame = Pick<
  Game,
  | 'attributes'
  | 'cityNames'
  | 'civilizations'
  | 'engine'
  | 'leaders'
  | 'players'
  | 'playerWorlds'
  | 'rng'
  | 'rules'
  | 'traits'
>;

export type AddPlayerOptions = {
  // The civilization and leader to play, from those not yet taken. Left out, one is drawn from the game's random
  //  numbers, and the civilization's first leader leads it.
  civilization?: typeof Civilization;
  leader?: typeof Leader;
};

/**
 * Bring a new player into a game that's already running (civ-clone/web-renderer#168): barbarians, a civil war and a
 * destroyed civilization coming back all need it.
 *
 * The player's `Added` rules set up its research, government, treasury and trade rates as they do at the start. It
 * claims a civilization and a leader, as `world/built/choose-start-tiles` does, gets its own view of `world`, and joins
 * `game.players`, so it takes its first turn from the next turn. It has no units: spawn them with the `Spawn` rules.
 *
 * `player:spawned` is emitted last, for the host to give the player a client: the engine never makes one itself.
 */
export const addPlayer = (
  game: AddPlayerGame,
  world: World,
  { civilization, leader }: AddPlayerOptions = {}
): Player => {
  const available = game.civilizations.entries(),
    CivilizationType =
      civilization ??
      available[Math.floor(game.rng() * available.length)] ??
      null;

  if (CivilizationType === null || !available.includes(CivilizationType)) {
    throw new TypeError('There is no civilization left for a new player.');
  }

  const [LeaderType = null] = leader
    ? [leader]
    : game.leaders.getByCivilization(CivilizationType);

  if (
    LeaderType === null ||
    !game.leaders.getByCivilization(CivilizationType).includes(LeaderType)
  ) {
    throw new TypeError(
      `${CivilizationType.name} has no leader left${
        leader ? ` called ${leader.name}` : ''
      }.`
    );
  }

  const player = new Player(game.rules),
    playerCivilization = new (CivilizationType as unknown as new (
      ...args: ConstructorParameters<typeof Civilization>
    ) => Civilization)(game.attributes, game.cityNames),
    playerLeader = new (LeaderType as unknown as new (
      ...args: ConstructorParameters<typeof Leader>
    ) => Leader)(game.traits);

  player.setCivilization(playerCivilization);
  playerCivilization.setLeader(playerLeader);

  game.civilizations.unregister(CivilizationType);
  game.leaders.unregister(LeaderType);

  game.playerWorlds.register(new PlayerWorld(player, world, game.rules));
  game.players.register(player);

  game.engine.emit('player:spawned', player);

  return player;
};

export default addPlayer;
