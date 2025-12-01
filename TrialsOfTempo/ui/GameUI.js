/*
  FILE: ui/GameUI.js
  PURPOSE:
    Handles all in-game HUD elements:
    - Health bar
    - Fuel bar
    - Score, combo
    - Stage progress bar
    - Powerup indicator
    - Beat indicator overlay

  WHY THIS FILE EXISTS:
    UI code was mixed into sketch.js, making logic hard to read.
    Separating UI means artists can change visuals without touching gameplay.

  DEPENDENCIES (Global):
    score, comboMultiplier, comboTimer
    playerHealth, playerMaxHealth, jetpackFuel
    currentStage, stageProgress
    activePowerup, powerupDuration
    rgbHue, width, height
    drawBeatIndicator()
*/

function drawGameUI() {
  push();
  fill(0, 0, 0, 100);
  noStroke();
  rect(0, 0, width, 80);

  // ───────────── HEALTH BAR ─────────────
  fill(0, 0, 90);
  textAlign(LEFT, TOP);
  textSize(14);
  text("HEALTH", 20, 15);

  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(20, 35, 200, 12, 6);

  noStroke();
  fill(0, 90, 100);
  let healthWidth = map(playerHealth, 0, playerMaxHealth, 0, 200);
  rect(20, 35, healthWidth, 12, 6);

  // ───────────── FUEL BAR ─────────────
  text("FUEL", 240, 15);
  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(240, 35, 120, 12, 6);

  noStroke();
  fill(60, 90, 100);
  let fuelWidth = map(jetpackFuel, 0, 100, 0, 120);
  rect(240, 35, fuelWidth, 12, 6);

  // ───────────── SCORE ─────────────
  fill(50, 90, 100);
  textAlign(RIGHT, TOP);
  textSize(18);
  text("SCORE: " + score, width - 20, 15);

  // ───────────── COMBO ─────────────
  if (comboMultiplier > 1) {
    fill(320, 90, 100);
    textSize(16);
    text("x" + comboMultiplier + " COMBO!", width - 20, 40);
  }

  // ───────────── STAGE PROGRESS ─────────────
  fill(0, 0, 90);
  textAlign(CENTER, TOP);
  textSize(16);
  text("STAGE " + currentStage + "/8", width / 2, 15);

  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(width / 2 - 80, 40, 160, 8, 4);

  noStroke();
  fill(rgbHue, 80, 100);
  rect(width / 2 - 80, 40, stageProgress * 160, 8, 4);

  // ───────────── POWERUP ─────────────
  if (activePowerup) {
    fill(0, 0, 90);
    textAlign(LEFT, TOP);
    textSize(14);
    text("POWERUP: " + activePowerup.toUpperCase(), 20, 60);

    noFill();
    stroke(180, 80, 100);
    strokeWeight(2);
    rect(120, 60, 100, 8, 4);

    noStroke();
    fill(180, 80, 100);
    rect(120, 60, (powerupDuration / 300) * 100, 8, 4);
  }

  pop();

  // Beat indicator stays separate
  drawBeatIndicator();
}
