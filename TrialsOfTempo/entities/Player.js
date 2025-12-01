/*
  FILE: entities/Player.js
  PURPOSE:
    Handles visual rendering of the player character including:
    - Invincibility flicker
    - Shield powerup overlay
    - Jetpack trail animation

  WHY THIS FILE EXISTS:
    Player drawing code was mixed into sketch.js, making it difficult
    for artists to swap sprites. Now designers can replace visuals
    here without touching game logic.

  DEPENDENCIES (Global):
    - player (position, size)
    - characterColors[], selectedCharacter
    - jetpackActive
    - activePowerup, playerInvincible
*/

function drawPlayer() {
  let char = characterColors[selectedCharacter];

  push();
  translate(player.x, player.y);

  // Flicker effect while invincible
  if (playerInvincible > 0 && frameCount % 6 < 3) {
    tint(0, 0, 100);
  }

  // Powerup: shield outline
  if (activePowerup === "shield") {
    noFill();
    stroke(180, 80, 100, 150);
    strokeWeight(3);
    ellipse(0, 0, 50, 50);
  }

  // Placeholder character body
  noStroke();
  fill(char.body);
  ellipse(0, 0, 30, 40); // Replace later with sprite image

  // Eyes
  fill(0);
  ellipse(-6, -5, 4, 8);
  ellipse(6, -5, 4, 8);

  // Jetpack effect
  if (jetpackActive) {
    fill(char.scarf);
    triangle(-10, 15, 10, 15, 0, 25 + random(5, 15));
  }

  pop();
}
