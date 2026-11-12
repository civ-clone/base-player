import Civilization from '@civ-clone/core-civilization/Civilization';
import { Game } from '@civ-clone/core-game';
import Leader from '@civ-clone/core-civilization/Leader';
import Player from '@civ-clone/core-player/Player';
import World from '@civ-clone/core-world/World';
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
export declare const addPlayer: (
  game: AddPlayerGame,
  world: World,
  { civilization, leader }?: AddPlayerOptions
) => Player;
export default addPlayer;
