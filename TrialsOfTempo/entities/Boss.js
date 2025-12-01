/* 
  FILE: entities/Boss.js
  PURPOSE:
    - Handles boss creation, movement, attacks, phase logic, drawing.
    - Activated only in Stage 8.

  WHY THIS FILE EXISTS:
    Boss logic used to be mixed with obstacles and gameplay,
    making sketch.js hard to read. Now boss design and balance
    can be modified without touching core gameplay.

  DEPENDENCIES:
    Uses global values:
      boss, bossHealth, bossPhase, cameraX, player, stagePatterns,
      spawnObstacle(), score, gameState
*/

function initBoss() {
  boss = {
    x: cameraX + width / 2,
    y: height / 2,
    width: 80,
    height: 100,
    vx: 2,
    vy: 1,
    phase: 1,
    attackTimer: 0,
  };

  bossHealth = 100;
  bossPhase = 1;
}

function updateBoss() {
  // Movement
  boss.x += boss.vx;
  boss.y += boss.vy;

  // Bounce y-axis
  if (boss.y < 80 || boss.y > height - 80) {
    boss.vy *= -1;
  }

  // Float forward-back
  boss.x = cameraX + width / 2 + sin(frameCount * 0.05) * 100;

  // Attack on beat pattern
  boss.attackTimer++;
  if (boss.attackTimer % 80 === 0) {
    if (bossPhase === 1) {
      spawnObstacle("double");
    } else if (bossPhase === 2) {
      spawnObstacle("laser");
      spawnObstacle("wave");
    } else {
      spawnObstacle("barrier");
      spawnObstacle("laser");
      spawnObstacle("triple");
    }
  }

  // Phase logic
  if (bossHealth < 66 && bossPhase === 1) {
    bossPhase = 2;
    boss.vx *= 1.5;
  } else if (bossHealth < 33 && bossPhase === 2) {
    bossPhase = 3;
    boss.vx *= 1.5;
  }

  // Damage boss if near player
  if (frameCount % 60 === 0 && dist(player.x, player.y, boss.x, boss.y) < 150) {
    bossHealth -= 2;
    score += 50;
  }

  // Boss defeated
  if (bossHealth <= 0) {
    boss = null;
    setTimeout(() => {
      gameState = "victory";
    }, 1000);
  }
}

function drawBoss() {
  if (!boss) return;

  push();
  translate(boss.x, boss.y);

  rectMode(CENTER);
  noStroke();
  fill(320, 90, 100);
  rect(0, 0, boss.width, boss.height, 10);

  // Eyes
  fill(0);
  ellipse(-15, -10, 8, 12);
  ellipse(15, -10, 8, 12);

  // Health bar
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

  // Phase text
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("PHASE " + bossPhase, 0, -75);

  pop();
}
