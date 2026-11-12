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

A library: it registers no rules. The ruleset decides the start terrains and weights, the starting units, which unit
keeps a player in the game, and when each of these runs. See `civ1-player` for Civilization's.
