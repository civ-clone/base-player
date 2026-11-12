"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatPlayers = void 0;
const ChoiceMeta_1 = require("@civ-clone/core-client/ChoiceMeta");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const Spawn_1 = require("@civ-clone/core-player/Rules/Spawn");
/**
 * Seat each client's player in a new `world`, one after another in the order the clients were registered: the player
 *  chooses a civilization and a leader (unless they were chosen already), a `PickStartTile` rule picks its start tile
 *  and the `Spawn` rules give it its units there. The promise settles once every player is seated.
 */
const seatPlayers = (world, clientRegistry, civilizationRegistry, leaderRegistry, attributeRegistry, cityNameRegistry, traitRegistry, ruleRegistry) => {
    const usedStartSquares = [];
    // A civilization or leader chosen before the world is built (a game set up seat by seat, civ-clone/web-renderer#604)
    //  is kept, and taken out of the choice before anyone else picks, so that a player choosing at random can't take
    //  it. `Player#civilization` throws while unset, so this is the only way to ask. A preset leader is trusted to be
    //  one of its civilization's: whoever set it chose it from that list.
    const chosenCivilization = (player) => {
        try {
            return player.civilization();
        }
        catch (_a) {
            return null;
        }
    };
    clientRegistry.entries().forEach((client) => {
        const civilization = chosenCivilization(client.player());
        if (civilization === null) {
            return;
        }
        civilizationRegistry.unregister(civilization.sourceClass());
        const leader = civilization.leader();
        if (leader !== null) {
            leaderRegistry.unregister(leader.sourceClass());
        }
    });
    return clientRegistry.entries().reduce((promise, client) => promise.then(async () => {
        const player = client.player();
        let civilization = chosenCivilization(player);
        if (civilization === null) {
            const CivilizationChoice = await client.chooseFromList(new ChoiceMeta_1.default(civilizationRegistry.entries(), 'choose-civilization'));
            civilization = new CivilizationChoice(attributeRegistry, cityNameRegistry);
            player.setCivilization(civilization);
            civilizationRegistry.unregister(civilization.sourceClass());
        }
        if (civilization.leader() === null) {
            const LeaderChoice = await client.chooseFromList(new ChoiceMeta_1.default(leaderRegistry.getByCivilization(civilization.sourceClass()), 'choose-leader')), leader = new LeaderChoice(traitRegistry);
            civilization.setLeader(leader);
            leaderRegistry.unregister(leader.sourceClass());
        }
        const [startingSquare] = ruleRegistry.process(PickStartTile_1.default, world, player, usedStartSquares);
        if (!startingSquare) {
            throw new TypeError('Not enough `startingSquare`s.');
        }
        usedStartSquares.push(startingSquare);
        ruleRegistry.process(Spawn_1.default, player, startingSquare);
    }), Promise.resolve());
};
exports.seatPlayers = seatPlayers;
exports.default = exports.seatPlayers;
//# sourceMappingURL=seatPlayers.js.map