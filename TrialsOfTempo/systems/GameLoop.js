/*
  FILE: systems/GameLoop.js
  PURPOSE:
    Handles game logic updates while playing:
    - camera movement
    - obstacle updates and collisions
    - powerups
    - boss logic
*/

function updateGame() {
  cameraX += playerSpeed;
  stageProgress = (cameraX % 2000) / 2000;

  if (stageProgress > 0.95 && obstacles.length === 0) {
    nextStage();
  }

  updatePlayer();

  if (playerInvincible > 0) playerInvincible--;

  // --- Obstacle update loop ---
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();

    if (obs.x < cameraX - 100) {
      obstacles.splice(i, 1);
      score += 10 * comboMultiplier;
      continue;
    }

    if (playerInvincible === 0 && checkCollision(player, obs)) {
      if (activePowerup === "shield") {
        activePowerup = null;
        powerupDuration = 0;
        flashAlpha = 100;
        score += 50;
      } else {
        onPlayerHit();
      }
      obstacles.splice(i, 1);
    }
  }

  // Powerups, boss, particles unchanged...
}
