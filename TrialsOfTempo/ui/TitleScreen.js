/* ───────────────────────────────────────────────
   FILE: ui/TitleScreen.js
   PURPOSE:
     Contains all rendering for the title/main menu,
     including button visuals.

   WHY THIS EXISTS:
     Title UI was mixed into sketch.js, making the
     main draw() switch case hard to read.

   NOTES FOR TEAMMATES:
     - Only handles visuals (no state changes here)
     - Button clicks are still processed in mousePressed()
     - Uses global color vars and parallax BG
──────────────────────────────────────────────*/

function drawTitle() {
  background(240, 80, 10);
  drawParallaxBG();
  drawAnimatedGrid();

  // Main title
  push();
  translate(width / 2, height / 3);
  scale(pulseScale);
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("TRIALS OF TEMPO");
  pop();

  // Subtitle
  fill(0, 0, 90);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("A Rhythm-Based Jetpack Adventure", width / 2, height / 2 - 40);

  // Menu buttons
  drawMenuButton("START", width / 2, height / 2 + 20, 200, 40, mouseX, mouseY);
  drawMenuButton("LEVEL SELECT", width / 2, height / 2 + 70, 200, 40, mouseX, mouseY);
  drawMenuButton("CUSTOMIZE", width / 2, height / 2 + 120, 200, 40, mouseX, mouseY);

  // Footer
  fill(0, 0, 60);
  textSize(12);
  text("Music by Cacola 140 bpm  |  Trials of Tempo", width / 2, height - 30);

  drawBeatIndicator();
}

function drawMenuButton(label, x, y, w, h, mx, my) {
  let hover = (mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2);

  push();
  rectMode(CENTER);
  noStroke();

  fill(rgbHue, hover ? 80 : 60, hover ? 90 : 40);
  rect(x, y, hover ? w + 10 : w, hover ? h + 4 : h, 8);

  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(label, x, y);
  pop();
}
