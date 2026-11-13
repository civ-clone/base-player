"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPlayerTurn = exports.startPlayerTurn = exports.startTurn = void 0;
const TurnEnd_1 = require("@civ-clone/core-player/Rules/TurnEnd");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
/**
 * A new turn starts: `players`, in the order given (the ruleset's), are the players still to move this turn, and the
 *  first of them starts its turn (`player:turn-start`).
 */
const startTurn = (players, currentPlayerRegistry, engine) => {
    currentPlayerRegistry.register(...players);
    const [currentPlayer] = currentPlayerRegistry.entries();
    engine.emit('player:turn-start', currentPlayer);
};
exports.startTurn = startTurn;
/**
 * `player` starts its turn: its `TurnStart` rules run (an error in one is logged, not thrown), then its client takes
 *  its turn, and once that settles, either way, the player's turn ends (`player:turn-end`).
 */
const startPlayerTurn = (player, clientRegistry, engine, ruleRegistry) => {
    try {
        ruleRegistry.process(TurnStart_1.default, player);
    }
    catch (e) {
        console.error(e);
    }
    const client = clientRegistry.getByPlayer(player);
    client
        .takeTurn()
        .catch((error) => console.error(error))
        .finally(() => {
        engine.emit('player:turn-end', player);
    });
};
exports.startPlayerTurn = startPlayerTurn;
/**
 * `player`'s turn ends: it has moved this turn, its `TurnEnd` rules run, and the next player still to move starts its
 *  turn (`player:turn-start`), or, when there is none, the turn ends (`turn:end`).
 */
const endPlayerTurn = (player, currentPlayerRegistry, ruleRegistry, engine) => {
    currentPlayerRegistry.unregister(player);
    ruleRegistry.process(TurnEnd_1.default, player);
    const [nextPlayer] = currentPlayerRegistry.entries();
    if (!nextPlayer) {
        engine.emit('turn:end');
        return;
    }
    engine.emit('player:turn-start', nextPlayer);
};
exports.endPlayerTurn = endPlayerTurn;
//# sourceMappingURL=turns.js.map