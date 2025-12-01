/* ───────────────────────────────────────────────
   FILE: systems/player.js
   PURPOSE:
     Handles player physics, movement, jetpack logic,
     and resets player state when a new run starts.

   WHY THIS EXISTS:
     Keeps gameplay logic separate from UI and rendering,
     making future sprite swaps easier.

   TEAM NOTES:
     - This file does NOT draw the player (see ui/PlayerUI.js)
     - Functions here are called from updateGame()
──────────────────────────────────────────────*/

// ───────── Initialize Player ─────────
function resetPlayer() {
  player = {
    x: 200,
    y: height / 2,
    vx: 0,
    vy: 0,
    width: 30,
    height: 40,
    alive: true,
  };

  playerHealth = playerMaxHealth;
  jetpackFuel = 100;
  playerInvincible = 0;
}

// ───────── Update Player Movement & Physics ─────────
function updatePlayer() {
  // Jetpack input
  jetpackActive = keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32);

  if (jetpackActive && jetpackFuel > 0) {
    player.vy -= 0.6;
    jetpackFuel -= 0.8;

    // Jetpack particles
    if (frameCount % 3 === 0) {
      spawnParticle(
        player.x - 10,
        player.y + 15,
        characterColors[selectedCharacter].scarf
      );
    }
  } else {
    jetpackFuel = min(100, jetpackFuel + 0.2);
  }

  // Gravity
  player.vy += 0.4;

  // Horizontal drift movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= 0.3;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += 0.3;
  }

  player.vx *= 0.95;

  // Apply velocity
  player.x += player.vx;
  player.y += player.vy;

  // Constrain boundaries
  player.y = constrain(player.y, 20, height - 20);
  if (player.y === 20 || player.y === height - 20) {
    player.vy *= -0.3;
  }

  // Horizontal bounds move with camera
  player.x = constrain(player.x, cameraX + 100, cameraX + 400);

  // Invincibility decay
  if (playerInvincible > 0) {
    playerInvincible--;
  }
}
