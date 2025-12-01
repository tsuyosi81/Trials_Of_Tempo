/*
  FILE: visual/Particles.js
  PURPOSE:
    - Handles jetpack + explosion particle effects.
    - Stores particle objects, movement, fading, drawing.

  WHY THIS FILE EXISTS:
    Particle code was mixed with gameplay and UI, making
    sketch.js huge. Now visual effects are isolated so
    artists/programmers can modify trails without breaking logic.

  REQUIRES:
    - global array: particles
    - global functions: random(), ellipse(), fill()
*/

function spawnParticle(x, y, colorStr) {
  particles.push({
    x: x,
    y: y,
    vx: random(-2, 2),
    vy: random(2, 4),
    life: 30,
    maxLife: 30,
    color: colorStr,

    update: function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2; // gravity
      this.life--;
    },

    draw: function () {
      push();
      noStroke();

      // Fade-out effect
      let alpha = map(this.life, 0, this.maxLife, 0, 200);
      fill(red(this.color), green(this.color), blue(this.color), alpha);
      ellipse(this.x, this.y, 6, 6);

      pop();
    },
  });
}
