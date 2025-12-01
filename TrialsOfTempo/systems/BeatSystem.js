/*
  FILE: systems/BeatSystem.js
  PURPOSE:
    Controls timing based on BPM and triggers rhythm events every beat.
    Used to sync obstacles, movement, and effects to music.

  WHY THIS FILE EXISTS:
    Beat logic was mixed into sketch.js. Now level designers can
    adjust difficulty and timing from a single file.

  DEPENDENCIES:
    - bpm, beatInterval, lastBeatFrame
    - stagePatterns, patternIndex, currentStage
    - spawnObstacle()
    - pulseScale, screenShake
*/

function initBeatSystem() {
  beatInterval = floor(60 / (bpm / 60));  // frames per beat
  lastBeatFrame = frameCount;
  beatCounter = 0;
}

function updateBeatSystem() {
  // Check if new beat happened
  if (frameCount - lastBeatFrame >= beatInterval) {
    onBeat();
    lastBeatFrame = frameCount;
    beatCounter++;
  }

  // Beat-based screen pulse effect
  let beatProgress = (frameCount - lastBeatFrame) / beatInterval;
  pulseScale = 1 + sin(beatProgress * PI) * 0.05;
}

// Called every beat
function onBeat() {
  let pattern = stagePatterns[currentStage];
  if (!pattern) return;

  // Get current pattern step
  let type = pattern[patternIndex];

  // Spawn obstacle based on step
  if (type && type !== "boss") {
    spawnObstacle(type);
  }

  // Cycle to next beat in pattern
  patternIndex = (patternIndex + 1) % pattern.length;
}
