/*
  FILE: systems/Stage.js
  PURPOSE:
    - Handles progression between stages and stage transitions.
    - Handles stage resets when game starts.
    - Triggers final boss stage and difficulty scaling.

  WHY THIS FILE EXISTS:
    Stage logic was buried inside sketch.js, making it hard to locate
    where difficulty changes and transitions happen. This separation
    lets level designers adjust pacing without touching rendering code.

  DEPENDENCIES:
    - currentStage, patternIndex, stageProgress
    - beatInterval, flashAlpha, screenShake
    - score, gameState
    - initBoss()
*/

// Call this when starting a new game:
function initStage() {
  currentStage = 1;
  stageProgress = 0;
  patternIndex = 0;
}

// Move to next stage
function nextStage() {
  currentStage++;
  patternIndex = 0;

  // --- VICTORY CONDITION ---
  if (currentStage > 8) {
    gameState = "victory";
    return;
  }

  // --- STAGE TRANSITION FX ---
  flashAlpha = 255;
  screenShake = 10;
  score += 500;

  // --- MID-GAME DIFFICULTY RAMP ---
  if (currentStage > 4) {
    beatInterval = floor(beatInterval * 0.95);
  }

  // --- FINAL BOSS TRIGGER ---
  if (currentStage === 8) {
    initBoss();
  }
}
