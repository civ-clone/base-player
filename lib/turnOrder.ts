import Player from '@civ-clone/core-player/Player';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

/** `players` in the order they move each turn: the barbarians first, then everyone else in the order given. */
export const barbariansFirst = (players: Player[]): Player[] => [
  ...players.filter((player: Player): boolean => isBarbarian(player)),
  ...players.filter((player: Player): boolean => !isBarbarian(player)),
];

export default barbariansFirst;
