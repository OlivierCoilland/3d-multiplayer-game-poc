'use strict';

// Size of the world.
const SIZE = 40;

// Speed of the game.
const SPEED = 2;

// Max number of players.
const MAX_PLAYERS = 42;

// The players.
const players = [];

// Initialization of the players.
for (var i = 0; i < MAX_PLAYERS; i++) {
  players.push({
    id: i,
    x: Math.random() * SIZE,
    y: Math.random() * SIZE,
    z: Math.random() * SIZE,
    vx: Math.random() * plusMinus(),
    vy: Math.random() * plusMinus(),
    vz: Math.random() * plusMinus()
  });
}

// Starts the game.
var start = function(io) {
  var start = now();
  setInterval(loop, 1000); // Updates the game about every second.

  // The Game Loop.
  function loop() {
    var end = now();
    var tick = end - start; // ms since last update.
    start = end;

    // Updates every players.
    players.forEach(function(player) {
      ['x', 'y', 'z'].forEach(function(axis) {
        // Updates position.
        player[axis] += SPEED * tick / 1000 * player['v' + axis];

        // Handles collision with walls.
        if (player[axis] < 0) {
          player[axis] = - player[axis];
          player['v' + axis] *= -1;
        }
        if (player[axis] > SIZE) {
          player[axis] = 2 * SIZE - player[axis];
          player['v' + axis] *= -1;
        }
      });
    });

    // Emit positions to every players.
    io.emit('players', players);
  }
};

module.exports = {
  start: start
};

// Returns current timestamp in ms.
function now() {
  return Date.now();
}

// Returns 1 or -1.
function plusMinus() {
  return 2 * Math.floor(2 * Math.random()) - 1;
}
