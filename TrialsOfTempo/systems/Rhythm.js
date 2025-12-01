/*
  FILE: systems/Rhythm.js
  PURPOSE:
    - Handles beat timing & spawning obstacles/powerups based on BPM.
    - Draws UI pulse indicator synced to audio beat.

  WHY THIS FILE EXISTS:
    The beat system was mixed into sketch.js, making timing logic
    hard to find and modify. Now rhythm logic is isolated for
    easier music syncing and pattern editing.

  DEPENDENCIES:
    - beatInterval, lastBeatFrame, frameCount
    - stagePatterns, patternIndex
    - spawnObstacle(), spawnPowerup()
    - boss, initBoss()
    - currentStage, gameState
*/

function onBeat() {
  // Only trigger beat logic during gameplay
  if (gameState !== "playing") return;

  // Boss stage has unique beat handling
  if (currentStage === 8 && !boss) {
    initBoss();
    return;
  }

  // Boss controls its own spawning
  if (boss) return;

  // Pull current pattern
  let pattern = stagePatterns[currentStage];
  let beatType = pattern[patternIndex % pattern.length];

  // Spawn obstacle if pattern says so
  if (beatType !== "gap") {
    spawnObstacle(beatType);
  }

  // Chance to spawn powerups
  if (random() < 0.15) {
    spawnPowerup();
  }

  // Move to next beat in pattern
  patternIndex++;
}

function drawBeatIndicator() {
  let beatProgress = (frameCount - lastBeatFrame) / beatInterval;
  let size = 20 + sin(beatProgress * PI) * 15;

  push();
  noStroke();

  fill(rgbHue, 90, 100, 150);
  ellipse(width - 50, height - 50, size, size);

  noFill();
  stroke(rgbHue, 90, 100);
  strokeWeight(2);
  ellipse(width - 50, height - 50, 40, 40);

  pop();
}
