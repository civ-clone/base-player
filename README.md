# base-player

A player's lifecycle, as a library for a ruleset's player rules:

- `lib/addPlayer`: `addPlayer(game, world, { civilization?, leader? })` brings a new player into a running game: its
  `Added` rules run, it claims a civilization and leader (drawn from those left when not given), gets a `PlayerWorld`
  and joins `game.players`, so it moves from the next turn. It has no units until a `Spawn` rule gives it some. It
  emits `player:spawned` for the host to give the player a client.
- `lib/startTiles`: `rankStartTiles(world, TerrainTypes, weights)`, the tiles a player could start on, best first, by
  the score of the area around each.
- `lib/seatPlayers`: `seatPlayers(world, clientRegistry, civilizationRegistry, leaderRegistry, attributeRegistry,
  cityNameRegistry, traitRegistry, ruleRegistry)` seats each client's player in turn: a civilization and leader
  (kept when chosen beforehand), a start tile from the `PickStartTile` rules, and its units from the `Spawn` rules.
- `lib/spawnUnits`: `spawnUnits(player, tile, UnitTypes, ruleRegistry)`, the starting units, as a list.
- `lib/revealTile`: `revealTile(tile, player, playerWorldRegistry)`, a player sees a tile as it is now.
- `lib/updatePlayerTiles`: `updatePlayerTiles(playerRegistry?, playerWorldRegistry?)`, an `Effect` for a tile whose
  yields changed: its cached yields are dropped for everyone and for each player who knows it.
- `lib/isDefeated`: `isDefeated(player, cityRegistry, unitRegistry, leaving, keepsInGame)`, whether a player is out of
  the game once `leaving` (a city or unit) goes: no cities left and, when `keepsInGame` is given, no unit it accepts.
- `lib/defeat`: `defeat(player, defeatingPlayer, playerRegistry, ruleRegistry)` runs the `Defeated` rules for a player
  still in the game, and `destroyUnits(player, defeatingPlayer, ruleRegistry, unitRegistry)` destroys its units with
  the `Defeated` rules off.

- `lib/turns`: `startTurn(players, currentPlayerRegistry, engine)` starts a turn with `players` (in the ruleset's
  order) still to move; `startPlayerTurn(player, clientRegistry, engine, ruleRegistry)` runs a player's `TurnStart`
  rules, then its client's turn, then ends its turn; `endPlayerTurn(player, currentPlayerRegistry, ruleRegistry,
  engine)` runs its `TurnEnd` rules and starts the next player, or ends the turn.
- `lib/processCityYields`: `processCityYields(player, YieldTypes, cityRegistry, ruleRegistry)`: each city's yields of
  `YieldTypes` (the ruleset's base yields, in order) are totalled and processed by the `ProcessYield` rules, and none
  of a city's are once it is destroyed.
- `lib/resetUnits`: `resetUnits(player, unitRegistry)` gives each unit its moves and wakes it, or lets it carry on with
  what it's busy with.
- `lib/endTurn`: `hasNoOtherMandatoryActions(player, endTurnRule)`, asked with the end-turn rule switched off, and
  `endTurnActions(player)`, the `EndTurn` action.
- `lib/leaveGame`: `isStillToMove`/`stopMoving` (this turn's players) and `isInGame`/`leaveGame` (the game's).
- `lib/events`: `emitAdded(player, engine)`, `emitVisibilityChanged(tile, player, engine)` and
  `emitDefeated(player, defeatingPlayer, engine)`, for clients.

A library: it registers no rules. The ruleset decides the start terrains and weights, the starting units, which unit
keeps a player in the game, the order players move in, its base yields, and when each of these runs. See
`civ1-player` for Civilization's.
