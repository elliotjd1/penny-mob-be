# penny-mobs

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

## Socket API

### Subscribed
#### createRoom
Create a new lobby for a game. Player will automatically join the newly created lobby.
```
{room: 'roomName', password: 'a password'}
```
#### joinRoom
Join an already created room.
```
{room: 'roomName'}
```
#### leaveRoom
Leave the room you are currently in.

#### startGame
Start the game for the room you are currently in. Must have the minimum number of required players as specified for that room (2 by default).

#### restartGame
Restart the current game.

#### locationSelect
Used in order to get data on a specified location.
```
{location: 'locationName'}
```
#### locationAction
Perform an action at the specified location
```
{location: 'locationName', action: 'actionName'}
```
#### endTurn
When no more actions are to be taken, tell the server you want to end your turn so another player can go.


### Emits
#### notification
Used to send messages to a player
```
{payload: 'Message string to display to the user'}
```
#### locationServe
Used to send messages to a player
```
{
  status: 'success',
  payload: {
    id: 'location id',
    name: 'location name',
    description: 'location description',
    requiredInfluence: 14,
    ownedBy: 'playerId',
    availableActions: [],
    allActions: [],
    influences: []
  }
}
```
#### state
Used to send messages to a player
```
{
  status: 'success/failure',
  state: 'game/lobby/lobbyBrowser',
  payload: {}
}
```
