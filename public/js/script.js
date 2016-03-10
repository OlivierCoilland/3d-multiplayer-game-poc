;(function() {

'use strict';

// Size of the renderer.
const WIDTH = 400; // window.innerWidth for full width.
const HEIGHT = 300; // window.innerHeight for full height.

// Size of the world.
const SIZE = 40;
const HALF_SIZE = SIZE / 2;

// Speed of the game.
const SPEED = 2;

// The players.
const players = [];
// The meshes of the players.
const meshes = [];

// Creating the scene.
var container = document.getElementById( 'container' );
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( WIDTH, HEIGHT );
container.appendChild( renderer.domElement );

// Adding the stats.
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
stats.domElement.style.zIndex = 100;
container.appendChild( stats.domElement );

// Adding the "world": a simple big box.
var geometry = new THREE.BoxGeometry( SIZE, SIZE, SIZE );
var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
var mesh = new THREE.Mesh( geometry, material );
mesh.position.set( HALF_SIZE, HALF_SIZE, HALF_SIZE );
scene.add( mesh );

// Adding the camera.
var camera = new THREE.PerspectiveCamera( 90, WIDTH / HEIGHT, 0.5, 200 );
camera.position.set( HALF_SIZE - 1, HALF_SIZE, HALF_SIZE );

// Adding the controls.
var geometry = new THREE.SphereGeometry( 0.1 );
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set( HALF_SIZE, HALF_SIZE, HALF_SIZE );
scene.add( sphere );
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
controls.enablePan = false;
controls.target = sphere.position.clone();
controls.update();

// The animation loop.
var start = null;
function animate(timestamp) {
  requestAnimationFrame( animate );

  if (!start) start = timestamp;
  var progress = timestamp - start;
  start = timestamp;

  // Updates every players.
  players.forEach(function(player) {
    ['x', 'y', 'z'].forEach(function(axis) {
      // Updates position.
      player[axis] += SPEED * progress / 1000 * player['v' + axis];

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

    // Updates the player mesh.
    meshes[player.id].position.set(player.x, player.y, player.z);
  });

  stats.update();
  renderer.render( scene, camera );
}
animate();

var playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );

// Use only websocket protocol.
var socket = io({ transports: [ 'websocket' ] });

// 'players' message updates the positions.
socket.on('players', function (data) {
  data.forEach(function(player) {
    // Creates the player mesh if necessary.
    if ( !players[player.id] ) {
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      var mesh = new THREE.Mesh( playerGeometry, material );
      scene.add( mesh );
      meshes[player.id] = mesh;
    }

    // The server is authoritative over the client !
    // The client computes the position for smooth rendering.
    // But every now and then, the server takes over.
    players[player.id] = player;
  });
});

// Handles selection of player.
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
document.addEventListener( 'dblclick', function(event) {
  mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
  mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( meshes );
  if (intersects.length) {
    var target = intersects[0].object;
    target.material.color.set( Math.random() * 0xffffff );
  }
}, false );

})();
