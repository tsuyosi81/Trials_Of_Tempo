/*
  FILE: visual/Background.js
  PURPOSE:
    - Draws parallax environment blocks.
    - Draws neon grid overlays synced to motion.
  
  WHY THIS FILE EXISTS:
    These rendering functions cluttered sketch.js. Moving them
    here makes it easier for artists to customize the visual theme
    without touching gameplay or input code.

  DEPENDENCIES:
    - parallaxLayers[]
    - cameraX
    - rgbHue (for visual rhythm color cycling)
*/

function drawParallaxBG() {
  for (let layer of parallaxLayers) {
    push();
    noStroke();

    fill(layer.color[0], layer.color[1], layer.color[2], 50);

    let offsetX = (cameraX * layer.speed) % 200;

    for (let x = -200; x < width + 200; x += 200) {
      rect(x - offsetX, layer.y, 180, 150, 20);
    }

    pop();
  }
}

function drawAnimatedGrid() {
  push();
  stroke(rgbHue, 40, 60, 80);
  strokeWeight(1);

  let gridSize = 60;
  let offset = (frameCount * 2 + cameraX * 0.3) % gridSize;

  // Vertical lines
  for (let x = -gridSize; x < width + gridSize; x += gridSize) {
    line(x - offset, 0, x - offset, height);
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }

  pop();
}
