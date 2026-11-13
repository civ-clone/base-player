import EndTurn from '@civ-clone/base-player-action-end-turn/EndTurn';
import Player from '@civ-clone/core-player/Player';

/**
 * What a player's end-turn `Action` rule is asked to switch itself off and on again.
 */
export type Switchable = { disable(): void; enable(): void };

/**
 * Whether `player` has no mandatory action left but ending its turn. `endTurnRule` (the rule offering `EndTurn`) is
 *  switched off while the player is asked, so that it doesn't ask itself, and on again afterwards. Only whether there
 *  is one is asked: listing them all would make each `actions()` cost two full passes.
 */
export const hasNoOtherMandatoryActions = (
  player: Player,
  endTurnRule: Switchable
): boolean => {
  endTurnRule.disable();

  const hasOtherActions = player.hasMandatoryActions();

  endTurnRule.enable();

  return !hasOtherActions;
};

/**
 * The `EndTurn` action for `player`.
 */
export const endTurnActions = (player: Player): EndTurn[] => [
  new EndTurn(player, null),
];
