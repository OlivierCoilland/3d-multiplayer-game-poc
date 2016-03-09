# 3d-multiplayer-game-poc

A 3D multiplayer game PoC with [Node.js](https://nodejs.org/), [Socket.IO](http://socket.io/) and [Three.js](http://threejs.org/)

![Screenshot](https://rawgit.com/OlivierCoilland/3d-multiplayer-game-poc/master/screenshot.png)

## Features

- Instant communication between client and server
- Authoritative server synchronizing players positions about every second
- Client-side prediction of movement and collisions on walls
- Targeting of players

And yet to come:

- Collisions between players
- Adding commands for players

## How to use

Install the dependencies

```
npm install
```

Start the server

```
node index.js
```

Browse to `http://localhost:3000`
