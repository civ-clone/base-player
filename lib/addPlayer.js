"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlayer = void 0;
const Player_1 = require("@civ-clone/core-player/Player");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
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
const addPlayer = (game, world, { civilization, leader } = {}) => {
    var _a;
    const available = game.civilizations.entries(), CivilizationType = (_a = civilization !== null && civilization !== void 0 ? civilization : available[Math.floor(game.rng() * available.length)]) !== null && _a !== void 0 ? _a : null;
    if (CivilizationType === null || !available.includes(CivilizationType)) {
        throw new TypeError('There is no civilization left for a new player.');
    }
    const [LeaderType = null] = leader
        ? [leader]
        : game.leaders.getByCivilization(CivilizationType);
    if (LeaderType === null ||
        !game.leaders.getByCivilization(CivilizationType).includes(LeaderType)) {
        throw new TypeError(`${CivilizationType.name} has no leader left${leader ? ` called ${leader.name}` : ''}.`);
    }
    const player = new Player_1.default(game.rules), playerCivilization = new CivilizationType(game.attributes, game.cityNames), playerLeader = new LeaderType(game.traits);
    player.setCivilization(playerCivilization);
    playerCivilization.setLeader(playerLeader);
    game.civilizations.unregister(CivilizationType);
    game.leaders.unregister(LeaderType);
    game.playerWorlds.register(new PlayerWorld_1.default(player, world, game.rules));
    game.players.register(player);
    game.engine.emit('player:spawned', player);
    return player;
};
exports.addPlayer = addPlayer;
exports.default = exports.addPlayer;
//# sourceMappingURL=addPlayer.js.map