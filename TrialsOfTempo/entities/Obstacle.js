/* 
  FILE: entities/Obstacle.js
  PURPOSE:
    - Defines how obstacles are created, drawn, and updated.
    - Handles obstacle types (single, double, wave, laser, etc.)
    - Used by gameplay logic during rhythm spawning.

  WHY THIS FILE EXISTS:
    Originally obstacle code lived in sketch.js, making it
    difficult to reuse or locate. This separates obstacles
    from game logic so artists can edit design without touching
    core logic.

  DEPENDENCIES:
    - uses global: cameraX, playerSpeed, obstacles, width, height, stage patterns
    - spawnObstacle() called in onBeat()
*/

class Obstacle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 40;
    this.height = 40;
    this.rotation = 0;
    this.speed = playerSpeed;

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
  let x = cameraX + width + 50;
  let y = random(80, height - 80);

  if (type === "double") {
    obstacles.push(new Obstacle(x, height / 3, type));

  } else if (type === "triple") {
    obstacles.push(new Obstacle(x, height / 2, type));

  } else if (type === "wave") {
    obstacles.push(new Obstacle(x, height / 2, type));

  } else if (type === "laser") {
    obstacles.push(new Obstacle(x, height / 2, type));

  } else if (type === "barrier") {
    let topY = random(100, 200);
    obstacles.push(new Obstacle(x, topY, type));

  } else {
    obstacles.push(new Obstacle(x, y, type));
  }
}
