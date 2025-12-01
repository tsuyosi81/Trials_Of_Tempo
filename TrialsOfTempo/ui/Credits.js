/*
  FILE: ui/Credits.js
  PURPOSE:
    Handles the scrolling end-credit scene.

  WHY THIS FILE EXISTS:
    Credits used to be inside sketch.js, mixed with core logic.
    Now UI designers can modify credits separately without breaking gameplay.

  DEPENDENCIES (Global):
    frameCount, creditStartFrame
    drawParallaxBG(), width, height
    text(), fill(), push(), pop()
*/

function drawCredits() {
  background(280, 60, 15);
  drawParallaxBG();

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
