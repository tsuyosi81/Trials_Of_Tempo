/*
  FILE: systems/MenuHandlers.js
  PURPOSE:
    Handles UI click logic broken away from raw mousePressed().
*/

function handleTitleClick() {
  // Start button
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
    if (mouseY > height / 2 + 0 && mouseY < height / 2 + 40) {
      startGame();
    } else if (mouseY > height / 2 + 50 && mouseY < height / 2 + 90) {
      gameState = "levelSelect";
    } else if (mouseY > height / 2 + 100 && mouseY < height / 2 + 140) {
      gameState = "customize";
    }
  }
}

function handleLevelSelectClick() {
  if (dist(mouseX, mouseY, width / 2, 200) < 60) {
    currentLevel = 1;
    startGame();
  }

  if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
      mouseY > height - 98 && mouseY < height - 62) {
    gameState = "title";
  }
}

function handleCustomizeClick() {
  let startX = width / 2 - 180;

  for (let i = 0; i < 4; i++) {
    let x = startX + i * 120;
    if (dist(mouseX, mouseY, x, height / 2) < 50) {
      selectedCharacter = i;
    }
  }

  if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
      mouseY > height - 98 && mouseY < height - 62) {
    gameState = "title";
  }
}
