/*
  FILE: entities/Powerup.js
  PURPOSE:
    - Controls how powerups spawn, look, and affect gameplay.
    - Supports shield & speed powerups.
    
  WHY THIS FILE EXISTS:
    Powerup logic used to live inside sketch.js, making it hard to
    maintain. Moving it here allows artists and designers to modify
    powerup behavior without touching main gameplay code.

  DEPENDENCIES:
    - uses global variables: powerups, playerSpeed, cameraX, width, height,
      activePowerup, comboMultiplier, comboTimer, flashAlpha
*/

function spawnPowerup() {
  let type = random() < 0.5 ? "shield" : "speed";
  powerups.push({
    x: cameraX + width + 50,
    y: random(100, height - 100),
    type: type,
    rotation: 0,
  });
}

function drawPowerup(pow) {
  push();
  translate(pow.x, pow.y);
  rotate(radians(pow.rotation));
  rectMode(CENTER);
  noStroke();

  if (pow.type === "shield") {
    fill(180, 80, 100);
    rect(0, 0, 25, 25, 5);

    noFill();
    stroke(180, 80, 100);
    strokeWeight(2);
    ellipse(0, 0, 30, 30);

  } else if (pow.type === "speed") {
    fill(60, 90, 100);
    triangle(-12, 12, 12, 12, 0, -12);
  }

  pop();
}

function activatePowerup(type) {
  activePowerup = type;
  powerupDuration = 300;

  if (type === "speed") {
    playerSpeed = 6;

    setTimeout(() => {
      playerSpeed = 4;
    }, 5000);
  }

  flashAlpha = 120;
  comboMultiplier++;
  comboTimer = 180;
}
