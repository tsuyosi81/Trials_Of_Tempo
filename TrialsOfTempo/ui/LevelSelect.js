/* ───────────────────────────────────────────────
   FILE: ui/LevelSelect.js
   PURPOSE:
     Handles rendering of level select screen and 
     level preview cards.

   WHY THIS EXISTS:
     Keeps UI separate from game logic to reduce clutter
     and make menu editing easier for teammates.

   NOTES FOR TEAMMATES:
     - This only draws UI.
     - Clicking logic remains in mousePressed().
     - Replace rectangles with actual level thumbnail art later.
──────────────────────────────────────────────*/

function drawLevelSelect() {
  background(240, 80, 10);
  drawParallaxBG();

  // Title
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("SELECT LEVEL", width / 2, 80);

  // Level cards (only Level 1 unlocked in demo)
  drawLevelCard(1, width / 2, 200, true);

  // Locked message
  fill(0, 0, 60);
  textSize(14);
  text("Additional levels available in full version", width / 2, 320);

  // Back button
  drawMenuButton("BACK", width / 2, height - 80, 160, 36, mouseX, mouseY);
}

function drawLevelCard(levelNum, x, y, unlocked) {
  push();
  rectMode(CENTER);

  let hover = unlocked && dist(mouseX, mouseY, x, y) < 60;

  // Background
  noStroke();
  if (unlocked) {
    fill(hover ? (rgbHue + 60) % 360 : rgbHue, 70, 50);
  } else {
    fill(0, 0, 20);
  }
  rect(x, y, 120, 120, 12);

  // Level number
  fill(0, 0, unlocked ? 100 : 40);
  textAlign(CENTER, CENTER);
  textSize(32);
  textStyle(BOLD);
  text(levelNum, x, y - 20);

  // Level label
  textSize(12);
  textStyle(NORMAL);
  if (levelNum === 1) {
    text("Yellow & Purple", x, y + 20);
  } else {
    text("LOCKED", x, y + 20);
  }

  pop();
}
