import { describe, it } from 'mocha';
import { emitAdded, emitDefeated, emitVisibilityChanged } from '../lib/events';
import { endPlayerTurn, startPlayerTurn, startTurn } from '../lib/turns';
import { endTurnActions, hasNoOtherMandatoryActions } from '../lib/endTurn';
import {
  isInGame,
  isStillToMove,
  leaveGame,
  stopMoving,
} from '../lib/leaveGame';
import Action from '@civ-clone/core-player/Rules/Action';
import Criterion from '@civ-clone/core-rule/Criterion';
import CurrentPlayerRegistry from '@civ-clone/core-player/CurrentPlayerRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import EndTurn from '@civ-clone/base-player-action-end-turn/EndTurn';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import processCityYields from '../lib/processCityYields';
import resetUnits from '../lib/resetUnits';

class Grain extends Yield {}
class Ore extends Yield {}
class Coin extends Yield {}
class Other extends Yield {}

const recordingEngine = () => {
    const emitted: unknown[][] = [];

    return {
      emitted,
      engine: {
        emit: (...args: unknown[]): void => {
          emitted.push(args);
        },
      } as any,
    };
  },
  settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));

describe('startTurn', (): void => {
  it('makes the players, in the order given, the ones still to move, and starts the first one', (): void => {
    const ruleRegistry = new RuleRegistry(),
      [a, b, c] = [1, 2, 3].map(() => new Player(ruleRegistry)),
      currentPlayerRegistry = new CurrentPlayerRegistry(),
      { emitted, engine } = recordingEngine();

    startTurn([c, a, b], currentPlayerRegistry, engine);

    expect(currentPlayerRegistry.entries()).to.eql([c, a, b]);
    expect(emitted).to.eql([['player:turn-start', c]]);
  });
});

describe('startPlayerTurn', (): void => {
  it("runs the player's TurnStart rules, then its client's turn, then ends its turn", async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      log: string[] = [],
      { emitted, engine } = recordingEngine();

    ruleRegistry.register(
      new TurnStart(
        new Effect((who: Player) => log.push(`start ${who === player}`))
      )
    );

    startPlayerTurn(
      player,
      {
        getByPlayer: (who: Player) => ({
          takeTurn: () => {
            log.push(`client ${who === player}`);

            return Promise.resolve();
          },
        }),
      } as any,
      engine,
      ruleRegistry
    );

    expect(log).to.eql(['start true', 'client true']);
    expect(emitted).to.eql([]);

    await settle();

    expect(emitted).to.eql([['player:turn-end', player]]);
  });

  it("logs an error in a TurnStart rule or the client's turn, and still ends the turn", async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      { emitted, engine } = recordingEngine(),
      errors: unknown[] = [],
      consoleError = console.error;

    ruleRegistry.register(
      new TurnStart(
        new Effect(() => {
          throw new Error('rule');
        })
      )
    );

    console.error = (error: unknown): void => {
      errors.push(error);
    };

    try {
      startPlayerTurn(
        player,
        {
          getByPlayer: () => ({
            takeTurn: () => Promise.reject(new Error('client')),
          }),
        } as any,
        engine,
        ruleRegistry
      );

      await settle();
    } finally {
      console.error = consoleError;
    }

    expect(errors.map((error) => (error as Error).message)).to.eql([
      'rule',
      'client',
    ]);
    expect(emitted).to.eql([['player:turn-end', player]]);
  });
});

describe('endPlayerTurn', (): void => {
  it('takes the player out of those still to move, runs its TurnEnd rules and starts the next player', (): void => {
    const ruleRegistry = new RuleRegistry(),
      [a, b] = [1, 2].map(() => new Player(ruleRegistry)),
      currentPlayerRegistry = new CurrentPlayerRegistry(),
      { emitted, engine } = recordingEngine(),
      ended: [Player, boolean][] = [];

    ruleRegistry.register(
      new TurnEnd(
        new Effect((who: Player) =>
          ended.push([who, currentPlayerRegistry.includes(who)])
        )
      )
    );

    currentPlayerRegistry.register(a, b);

    endPlayerTurn(a, currentPlayerRegistry, ruleRegistry, engine);

    expect(ended).to.eql([[a, false]]);
    expect(currentPlayerRegistry.entries()).to.eql([b]);
    expect(emitted).to.eql([['player:turn-start', b]]);

    endPlayerTurn(b, currentPlayerRegistry, ruleRegistry, engine);

    expect(currentPlayerRegistry.entries()).to.eql([]);
    expect(emitted).to.eql([['player:turn-start', b], ['turn:end']]);
  });
});

describe('processCityYields', (): void => {
  const standInCity = (yields: Yield[], destroyedAfter = Infinity) => {
    let processed = 0;

    return {
      city: {
        yields: () => yields,
        destroyed: () => processed >= destroyedAfter,
      },
      processed: () => processed++,
    };
  };

  it("totals each city's yields of the given types, in that order, and processes each total with the city and its yields", (): void => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      yields = [
        new Ore(2),
        new Grain(3),
        new Other(7),
        new Ore(4),
        new Grain(-1),
      ],
      { city } = standInCity(yields),
      processed: [string, number, string[], unknown, unknown][] = [];

    ruleRegistry.register(
      new ProcessYield(
        new Effect((cityYield: Yield, forCity: unknown, cityYields: unknown) =>
          processed.push([
            cityYield.constructor.name,
            cityYield.value(),
            cityYield.values().map(([, provider]) => provider),
            forCity,
            cityYields,
          ])
        )
      )
    );

    processCityYields(
      player,
      [Grain, Ore, Coin],
      { getByPlayer: (who: Player) => (who === player ? [city] : []) } as any,
      ruleRegistry
    );

    expect(processed).to.eql([
      ['Grain', 2, ['Consolidated'], city, yields],
      ['Ore', 6, ['Consolidated'], city, yields],
      ['Coin', 0, ['Consolidated'], city, yields],
    ]);
  });

  it('processes none of the rest of a city once it is destroyed', (): void => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      { city, processed } = standInCity([new Grain(1)], 1),
      types: string[] = [];

    ruleRegistry.register(
      new ProcessYield(
        new Effect((cityYield: Yield) => {
          types.push(cityYield.constructor.name);
          processed();
        })
      )
    );

    processCityYields(
      player,
      [Grain, Ore, Coin],
      { getByPlayer: () => [city] } as any,
      ruleRegistry
    );

    expect(types).to.eql(['Grain']);
  });
});

describe('resetUnits', (): void => {
  const standInUnit = (
    log: string[],
    name: string,
    { destroyed = false, busy = null as null | { valid: boolean } } = {}
  ) => ({
    destroyed: () => destroyed,
    movement: () => 3,
    moves: () => ({
      set: (moves: number) => log.push(`${name} moves ${moves}`),
    }),
    busy: () =>
      busy && {
        validate: () => busy.valid,
        process: () => log.push(`${name} busy`),
      },
    setActive: () => log.push(`${name} active`),
    setWaiting: (waiting: boolean) => log.push(`${name} waiting ${waiting}`),
  });

  it('gives each unit its moves, and makes it active or lets it carry on with what it is busy with', (): void => {
    const log: string[] = [],
      units = [
        standInUnit(log, 'idle'),
        standInUnit(log, 'gone', { destroyed: true }),
        standInUnit(log, 'busy', { busy: { valid: true } }),
        standInUnit(log, 'stale', { busy: { valid: false } }),
      ];

    resetUnits(new Player(new RuleRegistry()), {
      getByPlayer: () => units,
    } as any);

    expect(log).to.eql([
      'idle moves 3',
      'idle active',
      'idle waiting false',
      'busy moves 3',
      'busy busy',
      'stale moves 3',
    ]);
  });
});

describe('end turn', (): void => {
  it('asks whether the player has another mandatory action with the end-turn rule off, then turns it back on', (): void => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      seen: boolean[] = [],
      endTurnRule: Action = new Action(
        new Criterion((who: Player) => {
          seen.push(endTurnRule.enabled());

          return hasNoOtherMandatoryActions(who, endTurnRule);
        }),
        new Effect((who: Player) => endTurnActions(who))
      );

    ruleRegistry.register(endTurnRule);

    expect(player.hasMandatoryActions()).to.true;
    expect(seen).to.eql([true]);
    expect(endTurnRule.enabled()).to.true;

    const other = new Action(
      new Criterion(() => true),
      new Effect((who: Player) => endTurnActions(who))
    );

    ruleRegistry.register(other);

    expect(hasNoOtherMandatoryActions(player, endTurnRule)).to.false;
    expect(endTurnRule.enabled()).to.true;

    other.disable();

    expect(hasNoOtherMandatoryActions(player, endTurnRule)).to.true;
    expect(endTurnRule.enabled()).to.true;
  });

  it('offers the player one EndTurn', (): void => {
    const player = new Player(new RuleRegistry()),
      [action, ...rest] = endTurnActions(player);

    expect(rest).to.eql([]);
    expect(action).to.instanceOf(EndTurn);
    expect(action.player()).to.equal(player);
  });
});

describe('events and leaving', (): void => {
  it('tells clients a player joined, saw a tile change or was defeated, with just those arguments', (): void => {
    const ruleRegistry = new RuleRegistry(),
      [player, by] = [1, 2].map(() => new Player(ruleRegistry)),
      tile = {} as any,
      { emitted, engine } = recordingEngine();

    emitAdded(player, engine);
    emitVisibilityChanged(tile, player, engine);
    emitDefeated(player, by, engine);
    emitDefeated(player, null, engine);

    expect(emitted).to.eql([
      ['player:added', player],
      ['player:visibility-changed', tile, player],
      ['player:defeated', player, by],
      ['player:defeated', player, null],
    ]);
  });

  it('takes a player out of those still to move, and out of the game', (): void => {
    const ruleRegistry = new RuleRegistry(),
      [player, other] = [1, 2].map(() => new Player(ruleRegistry)),
      currentPlayerRegistry = new CurrentPlayerRegistry(),
      playerRegistry = new PlayerRegistry();

    currentPlayerRegistry.register(player, other);
    playerRegistry.register(player, other);

    expect(isStillToMove(player, currentPlayerRegistry)).to.true;
    stopMoving(player, currentPlayerRegistry);
    expect(isStillToMove(player, currentPlayerRegistry)).to.false;
    expect(currentPlayerRegistry.entries()).to.eql([other]);

    expect(isInGame(player, playerRegistry)).to.true;
    leaveGame(player, playerRegistry);
    expect(isInGame(player, playerRegistry)).to.false;
    expect(playerRegistry.entries()).to.eql([other]);
  });
});
