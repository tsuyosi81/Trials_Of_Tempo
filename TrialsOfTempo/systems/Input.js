/*
  FILE: systems/Input.js
  PURPOSE:
    Handles all keyboard and mouse input for:
      - Menus (title, level select, customize)
      - Restarting game
      - Navigation during end screens

  WHY THIS FILE EXISTS:
    Input code was mixed into sketch.js, making the file crowded.
    Separating input allows UI designers to modify menu interactions
    without touching game logic or rendering.
*/

function mousePressed() {
  if (gameState === "title") {
    handleTitleClick();
  } else if (gameState === "levelSelect") {
    handleLevelSelectClick();
  } else if (gameState === "customize") {
    handleCustomizeClick();
  }
}

function keyPressed() {
  if (gameState === "gameOver") {
    if (key === "r" || key === "R") startGame();
    if (key === "m" || key === "M") gameState = "title";
  }

  if (gameState === "victory") {
    if (key === "c" || key === "C") {
      gameState = "credits";
      creditStartFrame = frameCount;
    }
    if (key === "m" || key === "M") gameState = "title";
  }

  if (gameState === "credits" && (key === "m" || key === "M")) {
    gameState = "title";
  }
}
