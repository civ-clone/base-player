import { describe, it } from 'mocha';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Barbarian from '@civ-clone/base-civilization-barbarian/Barbarian';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import FoundsCities from '@civ-clone/base-unit-trait-founds-cities/FoundsCities';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import barbariansFirst from '../lib/turnOrder';
import { expect } from 'chai';
import isDefeatedWithFounders from '../lib/isDefeatedWithFounders';
import isUnattended from '../lib/unattended';

// A unit that founds cities or not, as its game's `UnitTraits` rules would say.
const standInUnit = (founds: boolean, destroyed = false): Unit =>
    ({
      destroyed: () => destroyed,
      hasTrait: (Trait: unknown) => founds && Trait === FoundsCities,
    } as unknown as Unit),
  registryOf = <T>(entries: T[]) =>
    ({
      getByPlayer: () => entries,
    } as any),
  barbarian = (): Player =>
    ({
      civilization: () => new Barbarian(),
    } as unknown as Player),
  civilization = (): Player =>
    ({
      civilization: () => ({}),
    } as unknown as Player);

describe('isDefeatedWithFounders', (): void => {
  const setUp = () => {
    const clientRegistry = new ClientRegistry(),
      human = new Player(),
      computer = new Player();

    clientRegistry.register(new Client(human), new AIClient(computer));

    return { clientRegistry, computer, human };
  };

  it('keeps a human with no cities in the game while they have a unit that founds cities', (): void => {
    const { clientRegistry, human } = setUp(),
      founder = standInUnit(true);

    expect(
      isDefeatedWithFounders(
        human,
        registryOf([]),
        registryOf([founder]),
        clientRegistry
      )
    ).false;
    // The founder going, or already destroyed, leaves them with nothing.
    expect(
      isDefeatedWithFounders(
        human,
        registryOf([]),
        registryOf([founder]),
        clientRegistry,
        founder
      )
    ).true;
    expect(
      isDefeatedWithFounders(
        human,
        registryOf([]),
        registryOf([standInUnit(true, true), standInUnit(false)]),
        clientRegistry
      )
    ).true;
  });

  it('puts a computer player with no cities out, founders or not, unless told founders count', (): void => {
    const { clientRegistry, computer } = setUp(),
      founder = standInUnit(true);

    expect(
      isDefeatedWithFounders(
        computer,
        registryOf([]),
        registryOf([founder]),
        clientRegistry
      )
    ).true;
    expect(
      isDefeatedWithFounders(
        computer,
        registryOf([]),
        registryOf([founder]),
        clientRegistry,
        null,
        true
      )
    ).false;
  });

  it('keeps anyone with a city other than the one leaving', (): void => {
    const { clientRegistry, computer } = setUp(),
      city = {},
      other = {};

    expect(
      isDefeatedWithFounders(
        computer,
        registryOf([city, other]),
        registryOf([]),
        clientRegistry,
        city as any
      )
    ).false;
    expect(
      isDefeatedWithFounders(
        computer,
        registryOf([city]),
        registryOf([]),
        clientRegistry,
        city as any
      )
    ).true;
  });

  it('treats a player with no client as a computer player', (): void => {
    expect(
      isDefeatedWithFounders(
        new Player(),
        registryOf([]),
        registryOf([standInUnit(true)]),
        new ClientRegistry()
      )
    ).true;
  });
});

describe('barbariansFirst', (): void => {
  it('moves the barbarians first, everyone else in the order given', (): void => {
    const a = civilization(),
      b = barbarian(),
      c = civilization(),
      d = barbarian();

    expect(barbariansFirst([a, b, c, d])).eql([b, d, a, c]);
    expect(barbariansFirst([])).eql([]);
  });
});

describe('isUnattended', (): void => {
  it('is true only when every client is a computer player, or there are none', (): void => {
    const clientRegistry = new ClientRegistry();

    expect(isUnattended(clientRegistry)).true;

    clientRegistry.register(new AIClient(new Player()));

    expect(isUnattended(clientRegistry)).true;

    clientRegistry.register(new Client(new Player()));

    expect(isUnattended(clientRegistry)).false;
  });
});
