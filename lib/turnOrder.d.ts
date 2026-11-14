import Player from '@civ-clone/core-player/Player';
/** `players` in the order they move each turn: the barbarians first, then everyone else in the order given. */
export declare const barbariansFirst: (players: Player[]) => Player[];
export default barbariansFirst;
