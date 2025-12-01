// ═══════════════════════════════════════════════════════════════════════════
// TRIALS OF TEMPO - A Rhythm-Based Jetpack Platformer
// Genre: Rhythm-Action / Auto-Scrolling Platformer
// Controls: Arrow Keys/WASD (movement), Space (powerup)
// Objective: Survive 8 rhythm-synced stages & defeat the final boss
//
// Members: Saturn A, Frankie S, Tsuyoshi H (ART151 Project)
//
// NOTE:
// Most gameplay logic is modularized into /systems and /entities.
// This file now mainly:
//   - Initializes global state
//   - Handles setup() and draw()
//   - Routes to modules based on gameState
// ═══════════════════════════════════════════════════════════════════════════


// ═══ GAME STATE VARIABLES ══════════════════════════════════════════════════
let gameState = "title";   // 'title', 'levelSelect', 'customize', 'playing', 'gameOver', 'victory', 'credits'
let currentLevel = 1;
let currentStage = 1;
let stageProgress = 0;


// ═══ PLAYER STATE ══════════════════════════════════════════════════════════
let player;
let playerHealth = 100;
let playerMaxHealth = 100;
let playerSpeed = 4;
let jetpackFuel = 100;
let jetpackActive = false;
let playerInvincible = 0;


// ═══ CHARACTER CUSTOMIZATION ═══════════════════════════════════════════════
let selectedCharacter = 0;
const characterColors = [
  { body: "#E493B3", scarf: "#7BC8E2" },
  { body: "#E493B3", scarf: "#7BC8E2" },
  { body: "#E6157E", scarf: "#F4D03F" },
  { body: "#E6157E", scarf: "#F4D03F" },
];


// ═══ RHYTHM SYSTEM ═════════════════════════════════════════════════════════
let bpm = 140;
let beatInterval;
let lastBeatFrame = 0;
let beatCounter = 0;
let currentBeatPattern = [];
let patternIndex = 0;


// ═══ ENTITIES & OBJECTS ════════════════════════════════════════════════════
let obstacles = [];
let powerups = [];
let particles = [];
let boss = null;


// ═══ CAMERA & VISUALS ══════════════════════════════════════════════════════
let cameraX = 0;
let parallaxLayers = [];

let screenShake = 0;
let flashAlpha = 0;
let rgbHue = 0;
let pulseScale = 1;


// ═══ UI & SCORE SYSTEM ═════════════════════════════════════════════════════
let score = 0;
let comboMultiplier = 1;
let comboTimer = 0;


// ═══ STAGE PATTERNS (USED BY Stage.js) ═════════════════════════════════════
const stagePatterns = {
  1: ["single", "single", "gap", "double", "gap", "single", "triple", "gap"],
  2: ["double", "single", "wave", "gap", "double", "wave", "gap", "triple"],
  3: ["wave", "triple", "gap", "laser", "double", "gap", "wave", "laser"],
  4: ["laser", "wave", "triple", "gap", "barrier", "gap", "laser", "wave"],
  5: ["barrier", "laser", "gap", "wave", "triple", "laser", "gap", "wave"],
  6: ["wave", "barrier", "laser", "triple", "gap", "laser", "barrier", "gap"],
  7: ["laser", "barrier", "wave", "triple", "laser", "gap", "barrier", "wave"],
  8: ["boss"]
};


// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(960, 540);
  colorMode(HSB, 360, 100, 100, 255);
  textFont("monospace");

  beatInterval = floor(60 / (bpm / 60));

  initParallax();
  resetPlayer();
  initStage();
  initBeatSystem();
}

function initParallax() {
  parallaxLayers = [
    { speed: 0.1, y: 0, color: [220, 60, 20] },
    { speed: 0.3, y: 100, color: [240, 70, 30] },
    { speed: 0.6, y: 200, color: [260, 80, 40] },
  ];
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN DRAW LOOP
// ═══════════════════════════════════════════════════════════════════════════

function draw() {
  updateBeatSystem();
  rgbHue = (rgbHue + 0.5) % 360;

  if (screenShake > 0) screenShake *= 0.85;

  push();
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
  }

  // State Routing
  switch (gameState) {
    case "title":       drawTitle(); break;
    case "levelSelect": drawLevelSelect(); break;
    case "customize":   drawCustomize(); break;
    case "playing":     updateGame(); drawGame(); break;
    case "gameOver":    drawGameOver(); break;
    case "victory":     drawVictory(); break;
    case "credits":     drawCredits(); break;
  }

  pop();

  // Screen flash effect
  if (flashAlpha > 0) {
    push();
    noStroke();
    fill(0, 90, 100, flashAlpha);
    rect(0, 0, width, height);
    flashAlpha *= 0.85;
    pop();
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// GAME CONTROL FLOW
// ═══════════════════════════════════════════════════════════════════════════

function startGame() {
  gameState = "playing";
  currentStage = 1;
  stageProgress = 0;
  patternIndex = 0;
  
  score = 0;
  comboMultiplier = 1;
  comboTimer = 0;

  cameraX = 0;
  obstacles = [];
  powerups = [];
  particles = [];
  activePowerup = null;
  powerupDuration = 0;
  boss = null;

  resetPlayer();

  bpm = 140;
  beatInterval = floor(60 / (bpm / 60));
  lastBeatFrame = frameCount;
}
