/*
  FILE: systems/PlayerControl.js
  PURPOSE:
    Handles player movement, gravity, jetpack fuel, and physics.

  WHY THIS FILE EXISTS:
    Player.js only handles drawing. This file keeps gameplay logic
    separate so teammates can modify movement without touching art.

  DEPENDENCIES:
    player, jetpackFuel, jetpackActive
    selectedCharacter, characterColors
    spawnParticle(), cameraX
*/

function updatePlayer() {
  // Check jetpack controls
  jetpackActive =
    keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32);

  // Apply jetpack thrust
  if (jetpackActive && jetpackFuel > 0) {
    player.vy -= 0.6;
    jetpackFuel -= 0.8;

    // Jetpack particle trail
    if (frameCount % 3 === 0) {
      spawnParticle(
        player.x - 10,
        player.y + 15,
        characterColors[selectedCharacter].scarf
      );
    }
  } else {
    // Slow fuel regeneration when idle
    jetpackFuel = min(100, jetpackFuel + 0.2);
  }

  // Gravity
  player.vy += 0.4;

  // Horizontal movement inputs
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= 0.3;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += 0.3;
  }

  // Natural friction
  player.vx *= 0.95;

  // Apply velocity
  player.x += player.vx;
  player.y += player.vy;

  // Constrain vertical position
  player.y = constrain(player.y, 20, height - 20);
  if (player.y === 20 || player.y === height - 20) {
    player.vy *= -0.3;
  }

  // Constrain player to forward camera window
  player.x = constrain(player.x, cameraX + 100, cameraX + 400);
}
