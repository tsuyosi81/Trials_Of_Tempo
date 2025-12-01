/* ───────────────────────────────────────────────
   FILE: ui/CustomizeScreen.js
   PURPOSE:
     Draws character selection screen & character 
     preview icons.

   WHY THIS EXISTS:
     Separates UI from gameplay logic so artists can 
     swap sprites without touching game code.

   NOTES FOR TEAMMATES:
     - Replace shapes with sprites in drawCharacterPreview()
     - Selection logic remains in mousePressed()
──────────────────────────────────────────────*/

function drawCustomize() {
  background(240, 80, 10);
  drawParallaxBG();

  // Title
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("CUSTOMIZE", width / 2, 80);

  // Instructions
  fill(0, 0, 90);
  textSize(16);
  text("Select your character design", width / 2, 130);

  // Preview row
  let startX = width / 2 - 180;
  for (let i = 0; i < characterColors.length; i++) {
    let x = startX + i * 120;
    let y = height / 2;
    let highlighted = dist(mouseX, mouseY, x, y) < 50 || i === selectedCharacter;

    drawCharacterPreview(i, x, y, highlighted);
  }

  fill(0, 0, 70);
  textSize(14);
  text("Click to select", width / 2, height / 2 + 100);

  drawMenuButton("BACK", width / 2, height - 80, 160, 36, mouseX, mouseY);
}

function drawCharacterPreview(charIndex, x, y, highlighted) {
  let char = characterColors[charIndex];

  push();
  translate(x, y);

  // Highlight outline
  if (highlighted) {
    noFill();
    stroke(rgbHue, 90, 100);
    strokeWeight(3);
    ellipse(0, 0, 90, 90);
  }

  // Placeholder character sprite
  noStroke();
  fill(char.body);
  rectMode(CENTER);
  rect(0, -10, 30, 40, 15);

  // Eyes
  fill(0);
  rect(-6, -15, 3, 8);
  rect(6, -15, 3, 8);

  // Jetpack scarf
  fill(char.scarf);
  triangle(-8, 10, 8, 10, 0, 30);

  pop();
}
