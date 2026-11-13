"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUnits = void 0;
/**
 * At the start of `player`'s turn, each of its units gets its full moves. One with nothing to do is active and no
 *  longer waiting; one that is busy carries on with what it is doing, if that is still valid, and it is the busy
 *  action's job to make the unit active again (otherwise actions that chain one busy action after another would be
 *  cleared here).
 */
const resetUnits = (player, unitRegistry) => unitRegistry.getByPlayer(player).forEach((unit) => {
    if (unit.destroyed()) {
        return;
    }
    unit.moves().set(unit.movement());
    const busyAction = unit.busy();
    if (!busyAction) {
        unit.setActive();
        unit.setWaiting(false);
        return;
    }
    if (!busyAction.validate()) {
        return;
    }
    busyAction.process();
});
exports.resetUnits = resetUnits;
exports.default = exports.resetUnits;
//# sourceMappingURL=resetUnits.js.map