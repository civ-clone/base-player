import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';

/**
 * A new turn starts: `players`, in the order given (the ruleset's), are the players still to move this turn, and the
 *  first of them starts its turn (`player:turn-start`).
 */
export const startTurn = (
  players: Player[],
  currentPlayerRegistry: CurrentPlayerRegistry,
  engine: Engine
): void => {
  currentPlayerRegistry.register(...players);

  const [currentPlayer] = currentPlayerRegistry.entries();

  engine.emit('player:turn-start', currentPlayer);
};

/**
 * `player` starts its turn: its `TurnStart` rules run (an error in one is logged, not thrown), then its client takes
 *  its turn, and once that settles, either way, the player's turn ends (`player:turn-end`).
 */
export const startPlayerTurn = (
  player: Player,
  clientRegistry: ClientRegistry,
  engine: Engine,
  ruleRegistry: RuleRegistry
): void => {
  try {
    ruleRegistry.process(TurnStart, player);
  } catch (e) {
    console.error(e);
  }

  const client = clientRegistry.getByPlayer(player);

  client
    .takeTurn()
    .catch((error) => console.error(error))
    .finally((): void => {
      engine.emit('player:turn-end', player);
    });
};

/**
 * `player`'s turn ends: it has moved this turn, its `TurnEnd` rules run, and the next player still to move starts its
 *  turn (`player:turn-start`), or, when there is none, the turn ends (`turn:end`).
 */
export const endPlayerTurn = (
  player: Player,
  currentPlayerRegistry: CurrentPlayerRegistry,
  ruleRegistry: RuleRegistry,
  engine: Engine
): void => {
  currentPlayerRegistry.unregister(player);

  ruleRegistry.process(TurnEnd, player);

  const [nextPlayer] = currentPlayerRegistry.entries();

  if (!nextPlayer) {
    engine.emit('turn:end');

    return;
  }

  engine.emit('player:turn-start', nextPlayer);
};
