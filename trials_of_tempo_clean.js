// Trials of Tempo - Cleaned Version (unused/redundant code removed)

// ─── ASSETS ───
let playerSprites = []; // Only used if useOriginalCharacter = false
let coinSprites = [];
let powerupShield, powerupSpeed;
let explosionSprite, smokeFX;
let shadowSprite, highlightSprite;

// ─── GAME STATE ───
let gameState = "title"; // 'title','levelSelect','customize','playing','paused','gameOver','victory','credits'
let currentStage = 1;
let stageProgress = 0; // 0..1 within stage

// ─── PLAYER ───
let player;
let playerHealth = 100;
let playerMaxHealth = 100;
let playerSpeed = 4;
const basePlayerSpeed = 4;
let playerInvincible = 0;
let hurtTimer = 0;
let accel = 0.35;
let maxVel = 2.5;
let drag = 0.9;
// Dash
let dashCooldown = 0;
let dashDuration = 0;
let dashPower = 8;
let dashCooldownMax = 90;
let dashDurationMax = 12;

// ─── CUSTOMIZATION ───
let selectedCharacter = 0;
const characterColors = [
  { body: "#E493B3", scarf: "#7BC8E2" },
  { body: "#E493B3", scarf: "#7BC8E2" },
  { body: "#E6157E", scarf: "#F4D03F" },
  { body: "#E6157E", scarf: "#F4D03F" },
];
let useOriginalCharacter = true;

// ─── RHYTHM ───
let bpm = 140;
let beatInterval; // frames per beat
let lastBeatFrame = 0;
let patternIndex = 0;

// ─── DIFFICULTY ───
let difficulty = "normal"; // 'easy' | 'normal' | 'hard'
const difficulties = {
  easy: { damage: 15, dashCooldownMax: 70, speedGain: 1.5, beatAccel: 1 },
  normal: { damage: 25, dashCooldownMax: 90, speedGain: 2, beatAccel: 1 },
  hard: { damage: 35, dashCooldownMax: 110, speedGain: 2.5, beatAccel: 0.93 },
};

function framesPerBeat(bpmValue) {
  // 60fps -> frames per beat = 3600 / bpm
  return floor(3600 / bpmValue);
}

// Parse difficulty from URL query (?difficulty=hard)
function applyDifficultyFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const d = (params.get("difficulty") || "").toLowerCase();
    if (d && difficulties[d]) {
      difficulty = d;
      console.log("[TrialsOfTempo] Difficulty set from URL:", difficulty);
    }
  } catch (e) {
    console.warn("Difficulty parse failed", e);
  }
}
applyDifficultyFromURL();

// ─── SYSTEM ARRAYS ───
let obstacles = [];
let powerups = [];
let activePowerup = null;
let powerupDuration = 0;
let queuedPowerup = null;
let collectibles = [];

// ─── CAMERA & STAGE ───
let cameraY = 0;
let parallaxLayers = [];
const STAGE_LENGTH = 14400; // ~60s per stage
let stageStartY = 0;
let sessionStartFrame = 0;

// ─── EFFECTS ───
let screenShake = 0;
let flashAlpha = 0;
let rgbHue = 0;
let pulseScale = 1;
let particles = [];

// ─── BOSS ───
let boss = null;
let bossPhase = 1;
let bossHealth = 100;

// ─── UI / SCORE ───
let score = 0;
let comboMultiplier = 1;
let comboTimer = 0;
let displayedHealth = 100;
let displayedStageProgress = 0;

// ─── STAGE PATTERNS ───
const stagePatterns = {
  1: ["single", "single", "gap", "double", "gap", "single", "triple", "gap"],
  2: ["double", "single", "wave", "gap", "double", "wave", "gap", "triple"],
  3: ["wave", "triple", "gap", "laser", "double", "gap", "wave", "laser"],
  4: ["laser", "wave", "triple", "gap", "barrier", "gap", "laser", "wave"],
  5: ["barrier", "laser", "gap", "wave", "triple", "laser", "gap", "wave"],
  6: ["wave", "barrier", "laser", "triple", "gap", "laser", "barrier", "gap"],
  7: ["laser", "barrier", "wave", "triple", "laser", "gap", "barrier", "wave"],
  8: ["boss"],
};

// ─── PRELOAD ───
function preload() {
  safeLoad(playerSprites, 0, "assets/PixelPlanes_Art/Planes/BluePlane.png");
  safeLoad(playerSprites, 1, "assets/PixelPlanes_Art/Planes/PinkPlane.png");
  safeLoad(playerSprites, 2, "assets/PixelPlanes_Art/Planes/YellowPlane.png");
  safeLoad(playerSprites, 3, "assets/PixelPlanes_Art/Planes/OrangePlane.png");

  safeLoad(coinSprites, 0, "assets/PixelPlanes_Art/Collectables/Coin_One.png");
  safeLoad(coinSprites, 1, "assets/PixelPlanes_Art/Collectables/Coin_Two.png");
  safeLoad(
    coinSprites,
    2,
    "assets/PixelPlanes_Art/Collectables/Coin_Three.png"
  );
  safeLoad(coinSprites, 3, "assets/PixelPlanes_Art/Collectables/Coin_Four.png");

  powerupShield = safeLoad(
    null,
    "shield",
    "assets/PixelPlanes_Art/Collectables/Shield_Activated%20(1).png"
  );
  powerupSpeed = safeLoad(
    null,
    "speed",
    "assets/PixelPlanes_Art/Collectables/Bolt_SpriteSheet.png"
  );

  explosionSprite = safeLoad(
    null,
    "explosion",
    "assets/PixelPlanes_Art/Planes/Explosion_16x16.png"
  );
  smokeFX = safeLoad(
    null,
    "smoke",
    "assets/PixelPlanes_Art/Planes/SmokeFX.png"
  );
  shadowSprite = safeLoad(
    null,
    "shadow",
    "assets/PixelPlanes_Art/Planes/Shadow.png"
  );
  highlightSprite = safeLoad(
    null,
    "highlight",
    "assets/PixelPlanes_Art/Planes/Highlight.png"
  );
}

// Graceful image loader (avoids hard failure if asset missing)
function safeLoad(targetArray, key, path) {
  try {
    const img = loadImage(
      path,
      () => {},
      () => {
        console.warn("[TrialsOfTempo] Missing asset:", path);
      }
    );
    if (targetArray) targetArray[key] = img;
    return img;
  } catch (e) {
    console.warn("[TrialsOfTempo] loadImage error for", path, e);
    return null;
  }
}

function setup() {
  createCanvas(960, 540);
  colorMode(HSB, 360, 100, 100, 255);
  textFont("monospace");
  beatInterval = framesPerBeat(bpm);
  initParallax();
  resetPlayer();
}

function draw() {
  if (frameCount - lastBeatFrame >= beatInterval) {
    onBeat();
    lastBeatFrame = frameCount;
  }

  let beatProgress = (frameCount - lastBeatFrame) / beatInterval;
  pulseScale = 1 + sin(beatProgress * PI) * 0.05;
  rgbHue = (rgbHue + 0.5) % 360;
  if (screenShake > 0) screenShake *= 0.85;

  push();
  if (screenShake > 0) {
    translate(
      random(-screenShake, screenShake),
      random(-screenShake, screenShake)
    );
  }

  switch (gameState) {
    case "title":
      drawTitle();
      break;
    case "levelSelect":
      drawLevelSelect();
      break;
    case "customize":
      drawCustomize();
      break;
    case "playing":
      updateGame();
      drawGame();
      break;
    case "paused":
      drawGame();
      drawPausedOverlay();
      break;
    case "gameOver":
      drawGameOver();
      break;
    case "victory":
      drawVictory();
      break;
    case "credits":
      drawCredits();
      break;
  }
  pop();

  if (flashAlpha > 0) {
    push();
    noStroke();
    fill(0, 0, 100, flashAlpha * 0.3);
    rect(0, 0, width, height);
    fill(60, 90, 100, flashAlpha * 0.1);
    rect(0, 0, width, height);
    flashAlpha *= 0.85;
    pop();
  }
}

// ─── TITLE ───
function drawTitle() {
  background(240, 80, 10);
  drawParallaxBG();
  drawAnimatedGrid();

  push();
  translate(width / 2, height / 3);
  scale(pulseScale);
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("TRIALS OF TEMPO", 0, 0);
  fill(rgbHue, 90, 100, 100);
  textSize(66);
  text("TRIALS OF TEMPO", 0, 0);
  pop();

  fill(0, 0, 90);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("A Rhythm-Based Jetpack Adventure", width / 2, height / 2 - 40);

  drawMenuButton("START", width / 2, height / 2 + 20, 200, 40, mouseX, mouseY);
  drawMenuButton(
    "LEVEL SELECT",
    width / 2,
    height / 2 + 70,
    200,
    40,
    mouseX,
    mouseY
  );
  drawMenuButton(
    "CUSTOMIZE",
    width / 2,
    height / 2 + 120,
    200,
    40,
    mouseX,
    mouseY
  );

  fill(0, 0, 60);
  textSize(12);
  text("Music by Cacola 140 bpm  |  Trials of Tempo", width / 2, height - 30);

  drawBeatIndicator();
}

function drawMenuButton(label, x, y, w, h, mx, my) {
  let hover =
    mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2;
  push();
  rectMode(CENTER);
  noStroke();
  fill(hover ? rgbHue : rgbHue, hover ? 80 : 60, hover ? 90 : 40);
  rect(x, y, hover ? w + 10 : w, hover ? h + 4 : h, 8);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(label, x, y);
  pop();
}

// ─── LEVEL SELECT ───
function drawLevelSelect() {
  background(240, 80, 10);
  drawParallaxBG();
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("SELECT LEVEL", width / 2, 80);
  drawLevelCard(1, width / 2, 200, true);
  fill(0, 0, 60);
  textSize(14);
  text("Additional levels available in full version", width / 2, 320);
  drawMenuButton("BACK", width / 2, height - 80, 160, 36, mouseX, mouseY);
}

function drawLevelCard(levelNum, x, y, unlocked) {
  push();
  rectMode(CENTER);
  let hover = unlocked && dist(mouseX, mouseY, x, y) < 60;
  noStroke();
  fill(
    unlocked ? (hover ? (rgbHue + 60) % 360 : rgbHue) : 0,
    unlocked ? 70 : 0,
    unlocked ? 50 : 20
  );
  rect(x, y, 120, 120, 12);
  fill(0, 0, unlocked ? 100 : 40);
  textAlign(CENTER, CENTER);
  textSize(32);
  textStyle(BOLD);
  text(levelNum, x, y - 20);
  textSize(12);
  textStyle(NORMAL);
  text(levelNum === 1 ? "Yellow & Purple" : "LOCKED", x, y + 20);
  pop();
}

// ─── CUSTOMIZE ───
function drawCustomize() {
  background(240, 80, 10);
  drawParallaxBG();
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("CUSTOMIZE", width / 2, 80);
  fill(0, 0, 90);
  textSize(16);
  text("Select your character design", width / 2, 130);
  let startX = width / 2 - 180;
  for (let i = 0; i < 4; i++) {
    let x = startX + i * 120;
    let y = height / 2;
    let selected = i === selectedCharacter;
    let hover = dist(mouseX, mouseY, x, y) < 50;
    drawCharacterPreview(i, x, y, selected || hover);
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
  if (highlighted) {
    noFill();
    stroke(rgbHue, 90, 100);
    strokeWeight(3);
    ellipse(0, 0, 90, 90);
  }
  noStroke();
  rectMode(CENTER);
  fill(char.body);
  rect(0, -10, 30, 40, 15, 15, 5, 5);
  fill(0);
  rect(-6, -15, 3, 8);
  rect(6, -15, 3, 8);
  fill(char.scarf);
  triangle(-8, 10, 8, 10, 0, 30);
  pop();
}

// ─── UPDATE & DRAW GAME ───
function updateGame() {
  cameraY += playerSpeed;
  let t = (frameCount - sessionStartFrame) / (60 * 480);
  t = constrain(t, 0, 1);
  let targetSpeed = basePlayerSpeed + difficulties[difficulty].speedGain * t;
  playerSpeed = lerp(playerSpeed, targetSpeed, 0.01);
  stageProgress = (cameraY - stageStartY) / STAGE_LENGTH;
  if (stageProgress >= 1 && obstacles.length === 0 && !boss) nextStage();

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) player.vy -= accel;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) player.vy += accel;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) player.vx -= accel;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.vx += accel;

  if (dashDuration > 0) {
    dashDuration--;
    player.vx *= 1.08;
    player.vy *= 1.08;
  }
  if (dashCooldown > 0) dashCooldown--;

  player.vx = constrain(player.vx, -maxVel, maxVel);
  player.vy = constrain(player.vy, -maxVel, maxVel);
  player.vx *= drag;
  player.vy *= drag;
  player.x += player.vx;
  player.y += player.vy;
  player.x = constrain(player.x, 30, width - 30);
  player.y = constrain(player.y, cameraY + 60, cameraY + height - 60);

  if (playerInvincible > 0) playerInvincible--;
  if (hurtTimer > 0) hurtTimer--;

  // Obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();
    if (obs.y < cameraY - 120) {
      obstacles.splice(i, 1);
      score += 10 * comboMultiplier;
      continue;
    }
    if (playerInvincible === 0 && checkCollision(player, obs)) {
      if (activePowerup === "shield") {
        activePowerup = null;
        powerupDuration = 0;
        flashAlpha = 100;
        score += 50;
      } else {
        onPlayerHit();
      }
      obstacles.splice(i, 1);
    }
  }

  // Powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    let pow = powerups[i];
    pow.rotation += 3;
    if (pow.y < cameraY - 120) {
      powerups.splice(i, 1);
      continue;
    }
    if (dist(player.x, player.y, pow.x, pow.y) < 30) {
      if (!queuedPowerup && !activePowerup) queuedPowerup = pow.type;
      else score += 150;
      powerups.splice(i, 1);
      score += 100;
    }
  }

  // Collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    let gem = collectibles[i];
    gem.spin += 5;
    if (gem.y < cameraY - 120) {
      collectibles.splice(i, 1);
      continue;
    }
    let d = dist(player.x, player.y, gem.x, gem.y);
    if (d < 120) {
      gem.x += (player.x - gem.x) * 0.03;
      gem.y += (player.y - gem.y) * 0.03;
    }
    if (d < 26) {
      score += 50 * comboMultiplier;
      comboMultiplier = min(comboMultiplier + 0.05, 5);
      comboTimer = 180;
      collectibles.splice(i, 1);
      for (let k = 0; k < 6; k++)
        spawnParticle(player.x, player.y, color(50, 90, 100));
    }
  }

  if (powerupDuration > 0) {
    powerupDuration--;
    if (powerupDuration === 0) {
      if (activePowerup === "speed") playerSpeed = basePlayerSpeed;
      activePowerup = null;
    }
  }

  if (boss) updateBoss();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) comboMultiplier = max(1, comboMultiplier - 0.25);
  }

  displayedHealth = lerp(displayedHealth, playerHealth, 0.15);
  displayedStageProgress = lerp(displayedStageProgress, stageProgress, 0.15);
  if (particles.length > 200) particles.splice(0, particles.length - 200);
}

function drawGame() {
  background(240, 80, 10);
  drawParallaxBG();
  drawAnimatedGrid();
  push();
  translate(0, -cameraY);
  for (let obs of obstacles) obs.draw();
  for (let pow of powerups) drawPowerup(pow);
  for (let gem of collectibles) drawCollectible(gem);
  if (boss) drawBoss();
  drawPlayer();
  for (let p of particles) p.draw();
  pop();
  drawGameUI();
}

function drawCollectible(gem) {
  let coinIndex = floor((frameCount / 8) % 4);
  push();
  translate(gem.x, gem.y);
  if (shadowSprite) {
    imageMode(CENTER);
    tint(0, 0, 0, 80);
    image(shadowSprite, 2, 2, 32, 32);
    noTint();
  }
  if (coinSprites[coinIndex]) {
    imageMode(CENTER);
    rotate(radians(gem.spin * 0.5));
    image(coinSprites[coinIndex], 0, 0, 28, 28);
  } else {
    rotate(radians(gem.spin));
    noStroke();
    fill(50, 90, 100);
    quad(-10, 0, 0, -14, 10, 0, 0, 14);
  }
  pop();
}

function drawPlayer() {
  let planeSprite = useOriginalCharacter
    ? null
    : playerSprites[selectedCharacter];
  push();
  translate(player.x, player.y);
  if (shadowSprite) {
    imageMode(CENTER);
    tint(0, 0, 0, 100);
    image(shadowSprite, 3, 3, 48, 48);
    noTint();
  }
  if (
    (abs(player.vx) > 1 || abs(player.vy) > 1) &&
    smokeFX &&
    frameCount % 3 === 0
  ) {
    imageMode(CENTER);
    tint(255, 255, 255, 120);
    image(smokeFX, 0, 0, 24, 24);
    noTint();
  }
  if (playerInvincible > 0 && frameCount % 6 < 3) {
    pop();
    return;
  }
  if (activePowerup === "shield" && highlightSprite) {
    imageMode(CENTER);
    push();
    rotate(frameCount * 0.05);
    tint(180, 255, 255, 180);
    image(highlightSprite, 0, 0, 56, 56);
    noTint();
    pop();
  }
  if (hurtTimer > 0) tint(255, 100, 100);
  if (planeSprite) {
    imageMode(CENTER);
    let angle = abs(player.vx) > 0.5 ? map(player.vx, -4, 4, -15, 15) : 0;
    rotate(radians(angle));
    image(planeSprite, 0, 0, 48, 48);
  } else {
    let char = characterColors[selectedCharacter];
    noStroke();
    rectMode(CENTER);
    fill(char.body);
    rect(0, -6, 28, 36, 12, 12, 6, 6);
    fill(0, 0, 10);
    rect(-6, -14, 3, 7);
    rect(6, -14, 3, 7);
    fill(char.scarf);
    let sway = sin(frameCount * 0.2) * 3;
    triangle(-8 + sway, 10, 8 + sway, 10, 0, 28);
  }
  noTint();
  pop();
}

function drawGameUI() {
  push();
  fill(0, 0, 0, 120);
  noStroke();
  rect(0, 0, width, 100);
  fill(0, 0, 90);
  textAlign(LEFT, TOP);
  textSize(14);
  text("HEALTH", 20, 18);
  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(20, 40, 200, 12, 6);
  noStroke();
  fill(0, 90, 100);
  let healthWidth = map(displayedHealth, 0, playerMaxHealth, 0, 200);
  rect(20, 40, healthWidth, 12, 6);
  fill(50, 90, 100);
  textAlign(RIGHT, TOP);
  textSize(18);
  text("SCORE: " + score, width - 20, 18);
  if (comboMultiplier > 1) {
    fill(320, 90, 100);
    textSize(16);
    text("x" + comboMultiplier + " COMBO!", width - 20, 44);
  }
  fill(0, 0, 90);
  textAlign(CENTER, TOP);
  textSize(16);
  text("STAGE " + currentStage + "/8", width / 2, 18);
  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(width / 2 - 80, 48, 160, 8, 4);
  noStroke();
  fill(rgbHue, 80, 100);
  rect(width / 2 - 80, 48, displayedStageProgress * 160, 8, 4);
  if (activePowerup) {
    fill(0, 0, 90);
    textAlign(LEFT, TOP);
    textSize(14);
    text("POWERUP: " + activePowerup.toUpperCase(), 20, 72);
    noFill();
    stroke(180, 80, 100);
    strokeWeight(2);
    rect(120, 72, 100, 8, 4);
    noStroke();
    fill(180, 80, 100);
    rect(120, 72, (powerupDuration / 300) * 100, 8, 4);
  } else if (queuedPowerup) {
    fill(0, 0, 90);
    textAlign(LEFT, TOP);
    textSize(14);
    text("POWERUP READY: " + queuedPowerup.toUpperCase() + " (SPACE)", 20, 72);
  }
  noFill();
  stroke(300, 60, 80);
  strokeWeight(2);
  rect(width - 140, 72, 120, 8, 4);
  noStroke();
  fill(300, 60, 80);
  let dashMax = difficulties[difficulty].dashCooldownMax;
  let dashReady = 1 - dashCooldown / dashMax;
  rect(width - 140, 72, dashReady * 120, 8, 4);
  fill(0, 0, 80);
  textAlign(RIGHT, TOP);
  textSize(10);
  text(dashCooldown === 0 ? "Dash Ready (Shift)" : "Dash", width - 16, 58);
  // Difficulty indicator
  fill(0, 0, 75);
  textAlign(LEFT, TOP);
  textSize(12);
  text("DIFFICULTY: " + difficulty.toUpperCase(), 20, 4);
  pop();
  drawBeatIndicator();
  let sessionTime = (frameCount - sessionStartFrame) / 60;
  if (sessionTime < 10) {
    push();
    fill(0, 0, 90, map(sessionTime, 8, 10, 200, 0));
    textAlign(RIGHT, BOTTOM);
    textSize(12);
    text("WASD/ARROWS: Move in all directions", width - 20, height - 40);
    text("SPACE: Activate powerup", width - 20, height - 25);
    text("P: Pause", width - 20, height - 10);
    pop();
  }
}

// ─── OBSTACLES ───
class Obstacle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 40;
    this.height = 40;
    this.rotation = 0;
    if (type === "laser") {
      this.width = 10;
      this.height = height;
      this.y = height / 2;
    } else if (type === "barrier") {
      this.width = 20;
      this.height = 200;
    }
  }
  update() {
    this.rotation += 2;
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    rectMode(CENTER);
    noStroke();
    if (this.type === "single") {
      fill(0, 90, 100);
      rect(0, 0, this.width, this.height, 5);
    } else if (this.type === "double") {
      fill(30, 90, 100);
      rect(0, -30, this.width, this.height, 5);
      rect(0, 30, this.width, this.height, 5);
    } else if (this.type === "triple") {
      fill(60, 90, 100);
      rect(0, -60, 35, 35, 5);
      rect(0, 0, 35, 35, 5);
      rect(0, 60, 35, 35, 5);
    } else if (this.type === "wave") {
      fill(180, 90, 100);
      for (let i = 0; i < 5; i++) {
        let offsetY = sin((frameCount + i * 20) * 0.1) * 40;
        ellipse(0, -80 + i * 40 + offsetY, 30, 30);
      }
    } else if (this.type === "laser") {
      fill(320, 90, 100);
      rect(0, 0, this.width, this.height);
      if (frameCount % 20 < 10) {
        fill(320, 90, 100, 100);
        rect(0, 0, this.width + 10, this.height);
      }
    } else if (this.type === "barrier") {
      fill(280, 90, 100);
      rect(0, 0, this.width, this.height, 5);
    }
    pop();
  }
}

function spawnObstacle(type) {
  let y = cameraY + height + 120;
  let x = type === "laser" ? width / 2 : random(60, width - 60);
  obstacles.push(new Obstacle(x, y, type));
}

function spawnPowerup() {
  let type = random() < 0.5 ? "shield" : "speed";
  powerups.push({
    x: random(60, width - 60),
    y: cameraY + height + 140,
    type,
    rotation: 0,
  });
}

function spawnGem() {
  collectibles.push({
    x: random(60, width - 60),
    y: cameraY + height + 100,
    spin: 0,
  });
}

function drawPowerup(pow) {
  push();
  translate(pow.x, pow.y);
  if (shadowSprite) {
    imageMode(CENTER);
    tint(0, 0, 0, 80);
    image(shadowSprite, 2, 2, 36, 36);
    noTint();
  }
  let pulseSize = 36 + sin(frameCount * 0.1) * 4;
  if (pow.type === "shield" && powerupShield) {
    imageMode(CENTER);
    tint(180, 255, 255, 150);
    image(powerupShield, 0, 0, pulseSize, pulseSize);
    noTint();
    image(powerupShield, 0, 0, 32, 32);
  } else if (pow.type === "speed" && powerupSpeed) {
    imageMode(CENTER);
    tint(255, 255, 100, 150);
    image(powerupSpeed, 0, 0, pulseSize, pulseSize);
    noTint();
    image(powerupSpeed, 0, 0, 32, 32);
  } else {
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
    } else {
      fill(60, 90, 100);
      triangle(-12, 12, 12, 12, 0, -12);
    }
  }
  pop();
}

function activatePowerup(type) {
  activePowerup = type;
  powerupDuration = 300;
  if (type === "speed") playerSpeed = basePlayerSpeed + 2;
  flashAlpha = 120;
  comboMultiplier++;
  comboTimer = 180;
}

// ─── BOSS ───
function initBoss() {
  boss = {
    x: width / 2,
    y: cameraY + height + 220,
    width: 80,
    height: 100,
    vx: 2,
    vy: 1,
    attackTimer: 0,
  };
  bossHealth = 100;
  bossPhase = 1;
}

function updateBoss() {
  boss.x += boss.vx;
  boss.y += boss.vy;
  if (boss.y < cameraY + 120 || boss.y > cameraY + height - 120) boss.vy *= -1;
  boss.x = width / 2 + sin(frameCount * 0.05) * 100;
  boss.attackTimer++;
  if (boss.attackTimer % 80 === 0) {
    if (bossPhase === 1) spawnObstacle("double");
    else if (bossPhase === 2) {
      spawnObstacle("laser");
      spawnObstacle("wave");
    } else {
      spawnObstacle("barrier");
      spawnObstacle("laser");
      spawnObstacle("triple");
    }
  }
  if (bossHealth < 66 && bossPhase === 1) {
    bossPhase = 2;
    boss.vx *= 1.5;
  } else if (bossHealth < 33 && bossPhase === 2) {
    bossPhase = 3;
    boss.vx *= 1.5;
  }
  if (frameCount % 60 === 0 && dist(player.x, player.y, boss.x, boss.y) < 150) {
    bossHealth -= 2;
    score += 50;
  }
  if (bossHealth <= 0) {
    boss = null;
    setTimeout(() => {
      gameState = "victory";
    }, 1000);
  }
}

function drawBoss() {
  push();
  translate(boss.x, boss.y);
  rectMode(CENTER);
  noStroke();
  fill(320, 90, 100);
  rect(0, 0, boss.width, boss.height, 10);
  fill(0);
  ellipse(-15, -10, 8, 12);
  ellipse(15, -10, 8, 12);
  fill(0, 0, 0, 150);
  rect(0, -60, boss.width + 20, 10, 5);
  fill(0, 90, 100);
  rect(
    -boss.width / 2 - 10,
    -60,
    (bossHealth / 100) * (boss.width + 20),
    10,
    5
  );
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("PHASE " + bossPhase, 0, -75);
  pop();
}

// ─── BEAT ───
function onBeat() {
  if (gameState !== "playing") return;
  flashAlpha = max(flashAlpha, 15);
  screenShake = max(screenShake, 1.5);
  if (currentStage === 8 && !boss) {
    initBoss();
    return;
  }
  if (boss) return;
  let pattern = stagePatterns[currentStage];
  let beatType = pattern[patternIndex % pattern.length];
  if (beatType !== "gap") spawnObstacle(beatType);
  if (random() < 0.12) spawnPowerup();
  if (random() < 0.25) spawnGem();
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
  let pulseAlpha = 40 + 40 * sin(beatProgress * PI);
  stroke(rgbHue, 60, 80, pulseAlpha);
  strokeWeight(4);
  rect(4, 4, width - 8, height - 8, 10);
  pop();
}

// ─── STAGE PROGRESSION ───
function nextStage() {
  currentStage++;
  patternIndex = 0;
  stageStartY = cameraY;
  if (currentStage > 8) {
    gameState = "victory";
    return;
  }
  flashAlpha = 255;
  screenShake = 10;
  score += 500;
  playerInvincible = 90;
  if (currentStage > 4) {
    beatInterval = max(
      8,
      floor(beatInterval * 0.95 * difficulties[difficulty].beatAccel)
    );
  }
}

// ─── COLLISION / DAMAGE ───
function checkCollision(p, obs) {
  return (
    abs(p.x - obs.x) < (p.width + obs.width) / 2 &&
    abs(p.y - obs.y) < (p.height + obs.height) / 2
  );
}

function onPlayerHit() {
  playerHealth -= difficulties[difficulty].damage;
  playerInvincible = 60;
  hurtTimer = 15;
  flashAlpha = 255;
  screenShake = 25;
  comboMultiplier = 1;
  comboTimer = 0;
  for (let i = 0; i < 12; i++) spawnExplosionParticle(player.x, player.y);
  if (playerHealth <= 0) {
    gameState = "gameOver";
    for (let i = 0; i < 24; i++) spawnExplosionParticle(player.x, player.y);
  }
}

// ─── PARTICLES ───
function spawnParticle(x, y, colorStr) {
  particles.push({
    x,
    y,
    vx: random(-2, 2),
    vy: random(2, 4),
    life: 30,
    maxLife: 30,
    color: colorStr,
    update: function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2;
      this.life--;
    },
    draw: function () {
      push();
      noStroke();
      let alpha = map(this.life, 0, this.maxLife, 0, 200);
      fill(red(this.color), green(this.color), blue(this.color), alpha);
      ellipse(this.x, this.y, 6, 6);
      pop();
    },
  });
}

function spawnExplosionParticle(x, y) {
  particles.push({
    x,
    y,
    vx: random(-4, 4),
    vy: random(-4, 4),
    life: 25,
    maxLife: 25,
    sprite: explosionSprite,
    frame: floor(random(4)),
    update: function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life--;
    },
    draw: function () {
      if (this.sprite) {
        push();
        let alpha = map(this.life, 0, this.maxLife, 0, 255);
        tint(255, 255, 255, alpha);
        imageMode(CENTER);
        image(this.sprite, this.x, this.y, 24, 24);
        noTint();
        pop();
      } else {
        push();
        noStroke();
        let alpha = map(this.life, 0, this.maxLife, 0, 200);
        fill(0, 90, 100, alpha);
        ellipse(this.x, this.y, 10, 10);
        pop();
      }
    },
  });
}

// ─── BACKGROUND ───
function drawParallaxBG() {
  for (let layer of parallaxLayers) {
    push();
    noStroke();
    fill(layer.color[0], layer.color[1], layer.color[2], 50);
    let offsetY = (cameraY * layer.speed) % 200;
    for (let y = -200; y < height + 200; y += 200) {
      rect(layer.x || 0, y - offsetY, width, 180, 20);
    }
    pop();
  }
}

function initParallax() {
  parallaxLayers = [
    { speed: 0.15, color: [rgbHue, 30, 15], x: 0 },
    { speed: 0.3, color: [rgbHue, 40, 20], x: 0 },
    { speed: 0.5, color: [rgbHue, 60, 25], x: 0 },
  ];
}

function drawAnimatedGrid() {
  push();
  stroke(rgbHue, 40, 60, 80);
  strokeWeight(1);
  let gridSize = 60;
  let offset = (frameCount * 2 + cameraY * 0.3) % gridSize;
  for (let y = -gridSize; y < height + gridSize; y += gridSize)
    line(0, y - offset, width, y - offset);
  for (let x = 0; x < width; x += gridSize) line(x, 0, x, height);
  pop();
}

function resetPlayer() {
  player = {
    x: width / 2,
    y: cameraY + height - 120,
    vx: 0,
    vy: 0,
    width: 26,
    height: 34,
  };
  playerHealth = playerMaxHealth;
  playerInvincible = 60;
  hurtTimer = 0;
}

// ─── END SCREENS ───
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

function drawCredits() {
  background(280, 60, 15);
  let scrollY = height - (frameCount - creditStartFrame) * 2;
  push();
  translate(0, scrollY);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("TRIALS OF TEMPO", width / 2, 100);
  textSize(24);
  text("A Rhythm-Action Game", width / 2, 180);
  textSize(18);
  fill(0, 0, 80);
  text("━━━ Trials of TEMPO ━━━", width / 2, 280);
  text("Saturn - Project Lead", width / 2, 320);
  text("Frankie - Level Design", width / 2, 350);
  text("[Your Name] - Character Design", width / 2, 380);
  text("[Your Name] - Art & Animation", width / 2, 410);
  text("━━━ MUSIC ━━━", width / 2, 500);
  text("All tracks by Cacola", width / 2, 540);
  text("1. Unused Assets", width / 2, 580);
  text("2. Yellow and Purple", width / 2, 610);
  text("8. Death", width / 2, 640);
  text("━━━ INSPIRATION ━━━", width / 2, 730);
  text("Just Shapes & Beats", width / 2, 770);
  text("Geometry Dash", width / 2, 800);
  text("Rez Infinite", width / 2, 830);
  text("Jetpack Joyride", width / 2, 860);
  text("━━━ THANK YOU ━━━", width / 2, 950);
  text("Built with p5.js & p5.play", width / 2, 990);
  text("ART151 Final Project", width / 2, 1020);
  textSize(16);
  fill(0, 0, 60);
  text("Press M to return to menu", width / 2, 1120);
  pop();
}
let creditStartFrame = 0;

// ─── INPUT ───
function mousePressed() {
  if (gameState === "title") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > height / 2 + 0 && mouseY < height / 2 + 40) startGame();
      else if (mouseY > height / 2 + 50 && mouseY < height / 2 + 90)
        gameState = "levelSelect";
      else if (mouseY > height / 2 + 100 && mouseY < height / 2 + 140)
        gameState = "customize";
    }
  } else if (gameState === "levelSelect") {
    if (dist(mouseX, mouseY, width / 2, 200) < 60) startGame();
    if (
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > height - 98 &&
      mouseY < height - 62
    )
      gameState = "title";
  } else if (gameState === "customize") {
    let startX = width / 2 - 180;
    for (let i = 0; i < 4; i++) {
      let x = startX + i * 120;
      if (dist(mouseX, mouseY, x, height / 2) < 50) selectedCharacter = i;
    }
    if (
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > height - 98 &&
      mouseY < height - 62
    )
      gameState = "title";
  }
}

function keyPressed() {
  if (gameState === "gameOver") {
    if (key === "r" || key === "R") startGame();
    else if (key === "m" || key === "M") gameState = "title";
  } else if (gameState === "victory") {
    if (key === "c" || key === "C") {
      gameState = "credits";
      creditStartFrame = frameCount;
    } else if (key === "m" || key === "M") gameState = "title";
  } else if (gameState === "credits") {
    if (key === "m" || key === "M") gameState = "title";
  } else if (gameState === "playing") {
    if (key === "p" || key === "P") gameState = "paused";
    else if (keyCode === 32) {
      if (queuedPowerup && !activePowerup) {
        activatePowerup(queuedPowerup);
        queuedPowerup = null;
      }
    } else if (keyCode === SHIFT) {
      if (dashCooldown === 0) {
        dashDuration = dashDurationMax;
        dashCooldown = difficulties[difficulty].dashCooldownMax;
        let ix = 0,
          iy = 0;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) ix -= 1;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) ix += 1;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) iy -= 1;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) iy += 1;
        if (ix !== 0 || iy !== 0) {
          let mag = sqrt(ix * ix + iy * iy);
          ix /= mag;
          iy /= mag;
          player.vx += ix * dashPower;
          player.vy += iy * dashPower;
        }
        flashAlpha = 120;
        screenShake = max(screenShake, 8);
      }
    } else if (key === "r" || key === "R") startGame();
    else if (key === "m" || key === "M") gameState = "title";
  } else if (gameState === "paused") {
    if (key === "p" || key === "P") gameState = "playing";
    else if (key === "m" || key === "M") gameState = "title";
    else if (key === "r" || key === "R") startGame();
  }
}

function startGame() {
  gameState = "playing";
  currentStage = 1;
  stageProgress = 0;
  stageStartY = 0;
  patternIndex = 0;
  score = 0;
  comboMultiplier = 1;
  comboTimer = 0;
  cameraY = 0;
  sessionStartFrame = frameCount;
  obstacles = [];
  powerups = [];
  collectibles = [];
  particles = [];
  activePowerup = null;
  powerupDuration = 0;
  queuedPowerup = null;
  boss = null;
  resetPlayer();
  playerSpeed = basePlayerSpeed;
  bpm = 140;
  beatInterval = framesPerBeat(bpm);
  lastBeatFrame = frameCount;
  displayedHealth = playerMaxHealth;
  displayedStageProgress = 0;
}

function drawPausedOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("PAUSED", width / 2, height / 2 - 20);
  textSize(16);
  fill(0, 0, 80);
  text(
    "Press P to resume | R to restart | M for menu",
    width / 2,
    height / 2 + 20
  );
  pop();
}
