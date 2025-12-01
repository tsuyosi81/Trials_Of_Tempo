/*
  FILE: systems/GameRender.js
  PURPOSE:
    Handles all drawing that occurs during the main gameplay state.
    - Background rendering
    - Player + obstacles + powerups + boss
    - UI overlay
*/

function drawGame() {
  // Background color
  background(240, 80, 10);

  // Background visual layers
  drawParallaxBG();
  drawAnimatedGrid();

  push();
  translate(-cameraX, 0);

  // Draw obstacles
  for (let obs of obstacles) {
    obs.draw();
  }

  // Draw powerups
  for (let pow of powerups) {
    drawPowerup(pow);
  }

  // Draw boss
  if (boss) {
    drawBoss();
  }

  // Draw player
  drawPlayer();

  // Draw particles
  for (let p of particles) {
    p.draw();
  }

  pop();

  // UI overlay
  drawGameUI();
}
