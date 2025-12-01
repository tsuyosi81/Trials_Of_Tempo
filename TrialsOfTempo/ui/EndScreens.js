/*
  FILE: ui/EndScreens.js
  PURPOSE:
    Holds all end-of-run UI screens:
    - Game Over screen
    - Victory screen

  WHY THIS FILE EXISTS:
    These screens cluttered sketch.js and mixed UI with logic.
    Having a separate file lets UI artists update layout/text
    without affecting gameplay code.

  DEPENDENCIES (Global):
    score, currentStage, pulseScale
    drawParallaxBG(), rgbHue, width, height
*/

function drawGameOver() {
  background(0, 0, 10);
  drawParallaxBG();

  push();
  translate(width / 2, height / 2);
  scale(pulseScale);

  fill(0, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("TRIAL FAILED", 0, -40);
  pop();

  fill(0, 0, 80);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 30);
  text("Stage Reached: " + currentStage + "/8", width / 2, height / 2 + 65);

  fill(0, 0, 60);
  textSize(16);
  text("Press R to retry | Press M for menu", width / 2, height / 2 + 120);
}

function drawVictory() {
  background(120, 80, 20);
  drawParallaxBG();

  push();
  translate(width / 2, height / 3);
  scale(pulseScale);

  fill(60, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("TRIAL COMPLETE!", 0, 0);

  fill(60, 90, 100, 150);
  textSize(66);
  text("TRIAL COMPLETE!", 0, 0);
  pop();

  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Final Score: " + score, width / 2, height / 2);

  fill(0, 0, 80);
  textSize(18);
  text("You have proven mastery over tempo", width / 2, height / 2 + 50);

  fill(0, 0, 60);
  textSize(14);
  text("Press C for credits | Press M for menu", width / 2, height / 2 + 100);
}
