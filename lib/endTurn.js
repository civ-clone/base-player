"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTurnActions = exports.hasNoOtherMandatoryActions = void 0;
const EndTurn_1 = require("@civ-clone/base-player-action-end-turn/EndTurn");
/**
 * Whether `player` has no mandatory action left but ending its turn. `endTurnRule` (the rule offering `EndTurn`) is
 *  switched off while the player is asked, so that it doesn't ask itself, and on again afterwards. Only whether there
 *  is one is asked: listing them all would make each `actions()` cost two full passes.
 */
const hasNoOtherMandatoryActions = (player, endTurnRule) => {
    endTurnRule.disable();
    const hasOtherActions = player.hasMandatoryActions();
    endTurnRule.enable();
    return !hasOtherActions;
};
exports.hasNoOtherMandatoryActions = hasNoOtherMandatoryActions;
/**
 * The `EndTurn` action for `player`.
 */
const endTurnActions = (player) => [
    new EndTurn_1.default(player, null),
];
exports.endTurnActions = endTurnActions;
//# sourceMappingURL=endTurn.js.map