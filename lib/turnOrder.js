"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barbariansFirst = void 0;
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
/** `players` in the order they move each turn: the barbarians first, then everyone else in the order given. */
const barbariansFirst = (players) => [
    ...players.filter((player) => (0, isBarbarian_1.default)(player)),
    ...players.filter((player) => !(0, isBarbarian_1.default)(player)),
];
exports.barbariansFirst = barbariansFirst;
exports.default = exports.barbariansFirst;
//# sourceMappingURL=turnOrder.js.map