/*
  FILE: systems/Collision.js
  PURPOSE:
    - Detects collisions between player & obstacles.
    - Applies damage, invincibility, camera shake, score/reset effects.

  WHY THIS FILE EXISTS:
    Damage logic was buried deep in sketch.js, making it hard
    to tweak without breaking gameplay. Now collision behavior
    can be balanced or modified separately.

  DEPENDENCIES:
    - playerHealth, playerInvincible
    - flashAlpha, screenShake
    - comboMultiplier, comboTimer
    - gameState
*/

function checkCollision(p, obs) {
  return (
    abs(p.x - obs.x) < (p.width + obs.width) / 2 &&
    abs(p.y - obs.y) < (p.height + obs.height) / 2
  );
}

function onPlayerHit() {
  playerHealth -= 25;
  playerInvincible = 60;

  // Visual feedback
  flashAlpha = 200;
  screenShake = 15;

  // Reset combo
  comboMultiplier = 1;
  comboTimer = 0;

  // Check for death
  if (playerHealth <= 0) {
    gameState = "gameOver";
  }
}
