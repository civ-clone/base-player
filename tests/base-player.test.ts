import { defeat, destroyUnits } from '../lib/defeat';
import { describe, it } from 'mocha';
import Added from '@civ-clone/core-player/Rules/Added';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Client from '@civ-clone/core-client/Client';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Leader from '@civ-clone/core-civilization/Leader';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import addPlayer from '../lib/addPlayer';
import { expect } from 'chai';
import { generateWorld } from '@civ-clone/core-world/tests/lib/buildWorld';
import isDefeated from '../lib/isDefeated';
import rankStartTiles from '../lib/startTiles';
import revealTile from '../lib/revealTile';
import seatPlayers from '../lib/seatPlayers';
import spawnUnits from '../lib/spawnUnits';
import updatePlayerTiles from '../lib/updatePlayerTiles';

class Testers extends Civilization {}
class Tester extends Leader {
  static civilization(): typeof Civilization {
    return Testers;
  }
}
class Others extends Civilization {}
class Other extends Leader {
  static civilization(): typeof Civilization {
    return Others;
  }
}

class Founder extends Unit {}
class Fighter extends Unit {}

class Meadow extends Terrain {}
class Desert extends Terrain {}

const unitsOf = (units: Unit[]) =>
    ({
      getByPlayer: () => units,
    } as any),
  citiesOf = (cities: unknown[]) =>
    ({
      getByPlayer: () => cities,
    } as any),
  standInUnit = (UnitType: typeof Unit, destroyed = false): Unit =>
    Object.assign(Object.create(UnitType.prototype), {
      destroyed: () => destroyed,
    }) as Unit;

describe('addPlayer', (): void => {
  const setUp = async () => {
    const game = new Game(),
      world = await generateWorld(undefined, game.rules),
      added: Player[] = [],
      spawned: Player[] = [];

    game.civilizations.register(Testers);
    game.leaders.register(Tester);
    game.rules.register(
      new Added(new Effect((player: Player) => added.push(player)))
    );
    game.engine.on('player:spawned', (player: Player) => spawned.push(player));

    return { added, game, spawned, world };
  };

  it('brings a player into the game, with a civilization, a leader and a view of the world', async (): Promise<void> => {
    const { added, game, spawned, world } = await setUp(),
      player = addPlayer(game, world);

    expect(player.civilization()).instanceOf(Testers);
    expect(player.civilization().leader()).instanceOf(Tester);
    expect(game.players.entries()).eql([player]);
    expect(game.playerWorlds.getByPlayer(player)).not.equal(undefined);
    expect(added).eql([player]);
    expect(spawned).eql([player]);
    expect(game.civilizations.entries()).eql([]);
    expect(game.leaders.entries()).eql([]);
    expect(() => addPlayer(game, world)).throw(TypeError);
  });

  it("won't take a leader who is already taken", async (): Promise<void> => {
    const { game, world } = await setUp();

    game.leaders.unregister(Tester);

    expect(() =>
      addPlayer(game, world, { civilization: Testers, leader: Tester })
    ).throw(TypeError);
    expect(game.players.length).equal(0);
  });
});

describe('isDefeated', (): void => {
  const player = new Player(new RuleRegistry()),
    city = {},
    keepsInGame = (unit: Unit): boolean => unit instanceof Founder;

  it('is out with no cities left but the one leaving, whatever units it has, without keepsInGame', (): void => {
    expect(isDefeated(player, citiesOf([city]), unitsOf([]), city as any, null))
      .true;
    expect(isDefeated(player, citiesOf([city]), unitsOf([]), null, null)).false;
    expect(
      isDefeated(
        player,
        citiesOf([]),
        unitsOf([standInUnit(Founder)]),
        null,
        null
      )
    ).true;
  });

  it('stays in while a unit that keeps it in the game is left', (): void => {
    const founder = standInUnit(Founder);

    expect(
      isDefeated(
        player,
        citiesOf([]),
        unitsOf([founder, standInUnit(Fighter)]),
        null,
        keepsInGame
      )
    ).false;
    expect(
      isDefeated(
        player,
        citiesOf([]),
        unitsOf([founder, standInUnit(Fighter)]),
        founder,
        keepsInGame
      )
    ).true;
    expect(
      isDefeated(
        player,
        citiesOf([]),
        unitsOf([standInUnit(Founder, true), standInUnit(Fighter)]),
        null,
        keepsInGame
      )
    ).true;
  });
});

describe('defeat', (): void => {
  it('defeats a player still in the game, once', (): void => {
    const ruleRegistry = new RuleRegistry(),
      playerRegistry = new PlayerRegistry(),
      player = new Player(ruleRegistry),
      by = new Player(ruleRegistry),
      defeated: [Player, Player | null][] = [];

    ruleRegistry.register(
      new Defeated(
        new Effect((player: Player, by: Player | null) => {
          defeated.push([player, by]);
          playerRegistry.unregister(player);
        })
      )
    );
    playerRegistry.register(player);

    defeat(player, by, playerRegistry, ruleRegistry);
    defeat(player, null, playerRegistry, ruleRegistry);

    expect(defeated).eql([[player, by]]);
  });

  it("destroys a player's units with the Defeated rules off, then turns back on only those that were on", (): void => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      by = new Player(ruleRegistry),
      on = new Defeated(new Effect(() => {})),
      off = new Defeated(new Effect(() => {})),
      destroyed: [Player | null, boolean, boolean][] = [],
      unit = Object.assign(Object.create(Unit.prototype), {
        destroy: (player: Player | null) =>
          destroyed.push([player, on.enabled(), off.enabled()]),
      });

    off.disable();
    ruleRegistry.register(on, off);

    destroyUnits(player, by, ruleRegistry, unitsOf([unit, unit]));

    expect(destroyed).eql([
      [by, false, false],
      [by, false, false],
    ]);
    expect(on.enabled()).true;
    expect(off.enabled()).false;
  });
});

describe('spawnUnits', (): void => {
  it('gives the player one of each listed unit, in order, on the tile and supported by no city', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      world = await generateWorld(undefined, ruleRegistry),
      tile = world.get(1, 1),
      player = new Player(ruleRegistry),
      units = spawnUnits(
        player,
        tile,
        [Founder, Fighter, Founder],
        ruleRegistry
      );

    expect(units.map((unit) => unit.constructor)).eql([
      Founder,
      Fighter,
      Founder,
    ]);
    units.forEach((unit) => {
      expect(unit.player()).equal(player);
      expect(unit.tile()).equal(tile);
      expect(unit.city()).equal(null);
    });
  });
});

describe('revealTile and updatePlayerTiles', (): void => {
  it("puts the tile in the player's view and clears its yields for them", (): void => {
    const player = new Player(new RuleRegistry()),
      calls: string[] = [],
      playerTile = { update: () => calls.push('update') },
      tile = {
        clearYieldCache: (asked: Player | null) =>
          calls.push(`clear ${asked === player ? 'player' : asked}`),
      } as unknown as Tile,
      playerWorldRegistry = {
        getByPlayer: () => ({
          register: (registered: Tile) =>
            calls.push(`register ${registered === tile}`),
          getByTile: () => playerTile,
        }),
      } as any;

    revealTile(tile, player, playerWorldRegistry);

    expect(calls).eql(['clear player', 'register true', 'update']);
  });

  it('clears the yields for everyone, then for each player who knows the tile', (): void => {
    const knows = new Player(new RuleRegistry()),
      doesNot = new Player(new RuleRegistry()),
      cleared: (Player | null)[] = [],
      tile = {
        clearYieldCache: (player: Player | null) => cleared.push(player),
      } as unknown as Tile,
      playerRegistry = new PlayerRegistry(),
      playerWorldRegistry = {
        getByPlayer: (player: Player) => ({
          getByTile: () => (player === knows ? {} : null),
        }),
      } as any;

    playerRegistry.register(doesNot, knows);

    updatePlayerTiles(playerRegistry, playerWorldRegistry).apply(tile);

    expect(cleared).eql([null, knows]);
  });
});

describe('rankStartTiles', (): void => {
  it('ranks tiles of the listed terrains by the score of their area, keeping the order of equal scores', (): void => {
    const weights: any[] = [],
      scores = new Map<string, number>(),
      tiles: Tile[] = [],
      makeTile = (
        name: string,
        TerrainType: typeof Terrain,
        score: number,
        area: () => Tile[]
      ): Tile => {
        scores.set(name, score);

        const tile = {
          name,
          terrain: () => Object.create(TerrainType.prototype),
          score: (player: Player | null, asked: unknown) => {
            expect(player).equal(null);
            expect(asked).equal(weights);

            return scores.get(name)!;
          },
          getSurroundingArea: () => ({ entries: area }),
        } as unknown as Tile;

        tiles.push(tile);

        return tile;
      },
      a = makeTile('a', Meadow, 1, () => [a]),
      b = makeTile('b', Desert, 9, () => [b]),
      c = makeTile('c', Meadow, 2, () => [c, b]),
      d = makeTile('d', Meadow, 10, () => [d]),
      e = makeTile('e', Meadow, 1, () => [e]),
      world = { entries: () => tiles } as unknown as World;

    expect(rankStartTiles(world, [Meadow], weights)).eql([c, d, a, e]);
  });
});

describe('seatPlayers', (): void => {
  it('lets each player choose, keeping a choice already made, then picks start tiles and spawns, in turn', async (): Promise<void> => {
    const game = new Game(),
      world = await generateWorld(undefined, game.rules),
      chooser = new Player(game.rules),
      preset = new Player(game.rules),
      presetCivilization = new Others(game.attributes, game.cityNames),
      events: string[] = [],
      clientFor = (player: Player, name: string): Client => {
        const client = new Client(player, () => 0),
          choose = client.chooseFromList.bind(client);

        client.chooseFromList = (async (meta: any) => {
          events.push(
            `${name} ${meta.key()} ${meta
              .choices()
              .map((choice: any) => choice.value().name)
              .join(',')}`
          );

          return choose(meta);
        }) as any;

        return client;
      };

    presetCivilization.setLeader(new Other(game.traits));
    preset.setCivilization(presetCivilization);

    game.civilizations.register(Testers, Others);
    game.leaders.register(Tester, Other);
    game.clients.register(
      clientFor(chooser, 'chooser'),
      clientFor(preset, 'preset')
    );
    game.rules.register(
      new PickStartTile(
        new Effect(
          (world: World, player: Player, used: Tile[]): Tile =>
            world.get(used.length, 0)
        )
      ),
      new Spawn(
        new Effect((player: Player, tile: Tile) =>
          events.push(
            `spawn ${player === chooser ? 'chooser' : 'preset'} ${tile.x()}`
          )
        )
      )
    );

    await seatPlayers(
      world,
      game.clients,
      game.civilizations,
      game.leaders,
      game.attributes,
      game.cityNames,
      game.traits,
      game.rules
    );

    expect(events).eql([
      'chooser choose-civilization Testers',
      'chooser choose-leader Tester',
      'spawn chooser 0',
      'spawn preset 1',
    ]);
    expect(chooser.civilization()).instanceOf(Testers);
    expect(preset.civilization()).equal(presetCivilization);
    expect(game.civilizations.entries()).eql([]);
    expect(game.leaders.entries()).eql([]);
  });
});
