# Trials_Of_Tempo

### **Group Members**

- Tsuyoshi Harayama (Yoshi)
- Frankie Salud
- Saturn Amarbat

---

### **Game Title**

**Trials of Tempo**

---

### **Game Concept**

A **rhythm-based platformer** with **jetpack gameplay** where the player controls a character that moves forward automatically through a world of music-driven obstacles.

Each movement, jump, and dodge is timed to the beat of the soundtrack.

---

### **Genre**

Rhythm-Action / Platformer

---

### **Core Mechanics**

- Dodge obstacles in sync with the beat of the song.
- Use jetpack or powerups (Shield, Speed Boost) to survive rhythm-based challenges.
- Timing and reaction are key to progressing through levels.

---

### **Player Mode**

Single Player

---

### **Narrative**

You play as a small test subject placed inside experimental “Tempo Chambers,” where each stage is synchronized to a different song.

Your mission: **survive the Trials of Tempo** and prove that rhythm and precision can overcome chaos.

---

## ⚙️ **TECHNICAL SPECS**

### **Controls**

**Keyboard**

- Arrow Keys / WASD → Move
- Spacebar → Activate Powerup (Shield / Speed)

---

### **View**

2D Side-Scrolling with **Parallax Backgrounds** for depth and motion.

---

### **Objective**

Avoid obstacles, stay on-beat, and reach the end of each chamber without failing.

---

### **UI Design**

- Minimalist neon interface (RGB aesthetic).
- Rhythm-synced visual cues and effects.
- Each level visually themed after its song’s mood and tempo.

---

### **Soundtrack (by Cacola)**

1. Unused Assets (Title Screen)
2. Yellow and Purple (Level 1)
3. Birds (Level 2: FULL GAME ONLY)
4. Ur Dragging Me Down With You (Level 3: FULL GAME ONLY)
5. Family Friendly Montage (Level 4: FULL GAME ONLY)
6. Segassem Lanimilbus (Level 5: FULL GAME ONLY)
7. How to Take Complete Control of Everything and Everyone (Level 6: FULL GAME ONLY)
8. Death (Credits)

---

## 🕹️ **GAMEPLAY FLOW**

When you start *The Trials of Tempo*, you find yourself inside a glowing chamber where every surface moves to the beat. Your character launches forward automatically, the sound of each drum kick syncing with bursts of light and motion. As synth waves rise, platforms lift, lasers flash, and the floor pulses beneath your feet. You must time your jumps, dashes, and shields perfectly to match the rhythm. A mistimed move sends your avatar crashing into a glowing barrier, resetting your momentum. Each song brings new visual themes—a storm of violet energy, shifting geometric walls, or rippling waves of sound—and the challenge grows more intense as you near the end. When you finally reach the boss chamber, the screen vibrates with color and rhythm, demanding flawless timing to survive the ultimate test of tempo.

---

### Gameplay Outline:

1. **Opening the Game:** Player starts the application and reaches a neon main menu with options for “Start,” “Levels,” and “Customize.”
2. **Game Options:** Choose character design and difficulty level.
3. **Story Synopsis:** The player is a test subject entering rhythm-based chambers created to test reaction and synchronization.
4. **Game Elements:** Beat-synced obstacles, powerups, parallax effects, reactive backgrounds.
5. **Game Levels:** Each level corresponds to a different song and visual theme; difficulty increases with tempo.
6. **Player Controls:** Move with Arrow Keys/WASD; Space activates Powerup.
7. **Winning:** Complete all chambers and defeat the final rhythm boss.
8. **Losing:** Collide with obstacles or fall out of sync too many times.
9. **End:** Unlock the final cutscene revealing the experiment’s true purpose.
10. **Why is this fun?** The thrill comes from matching rhythm, movement, and visuals into one flowing experience—like *playing* the music itself.
    - + For those who enjoy the music details while also playing the game.

---

### Reference Art

- *Just Shapes & Beats*
- *Geometry Dash*
- *Rez Infinite*
- Jetpack Joyride
- Subway surfers?

## Project timeline and strategy:

**Currently we are at**: *Phase-1 (Last updated: 11/05/25 By Saturn)*

Notes: We are tasked with creating our first things by using sprites during the class time on Wednesday.

                            **Strategy and overall guidance for ART151 project (Game creation):**

We will be working in phases and during each phase we would approach the concept for our game from topdown type of approach. Meaning, I think we should figure out the general bigger ideas and implement them, and then towards the finalization of the project we can start to focus more on details and tweaking stuff here and there. And ultimately produce the end product, which is our game.

### Phase 1: Design the game characters and objects:

(NPC, Main character, collectible objects, items and powerups)

- Find out how to implement these in p5.play and look at other examples available online (Needs research on our own end)
- Experiment how we can bring our own designs into the game using p5.play library functions available to us.

### **Tasks:**

- [ ]  🎨 Create final animated **character GIF sprites** (Frankie)
    - Replace placeholder character art (`drawPlayer()`).
    - Test GIF animations inside p5.js using `loadImage()`.
- [ ]  🧱 Design and import **obstacle sprites**
    - Replace placeholder rectangles (`Obstacle.draw()` ).
- [ ]  ⚡ Design **powerup animations**
    - Replace placeholder powerup shapes (`drawPowerup()`).
- [ ]  👾 Create and import **boss sprite + attack animations**
    - Replace placeholder boss rectangle (`drawBoss()` ).
- [ ]  🎶 Confirm final **soundtrack file imports** (Cacola tracks) and match with the stage.
    - Decide which songs loop and which fade at transitions.
- [ ]  🪩 Update title screen & menu visuals to match final aesthetic.

### Phase 2: Level design

Due to the time constraint I think having one very well built level with eight stages for now is good idea. Since we have a due date to submit the assignment on time. And we also don't know yet how long this process could take.

- Do our own research on how we can implement these efficiently and correctly. Possibly, look at the examples online.
- The layout for Level 1 is currently the works (Done by Frankie).

### **Tasks:**

- [ ]  🗺️ Review Frankie’s Level 1 layout sketch and match with in-game camera movement.
- [ ]  🔀 Add distinct **visual changes per stage** (color shifts or background parallax tweaks).
- [ ]  🎵 Sync each stage pattern to the correct BPM (start at 140 BPM).
- [ ]  💡 Add tutorial hints in early beats (“Press ↑ to fly,” etc.).
- [ ]  🔒 Plan out locked stages (Level 2–6 placeholders ready but hidden for now).

### Phase 3: Implement the game mechanics

At this stage we would start writing the functions and other code so that our characters can interact with the levels we have made.

Also at this stage I think it is now good idea to actually start figuring our what types of abilities and items would have effect on our overall gameplay. Then, implement that in code to make it work.

### **Tasks:**

- [ ]  ⚙️ Integrate rhythm-based obstacle spawns (`onBeat()` confirmed working).
- [ ]  💨 Refine jetpack control and fuel depletion rate.
- [ ]  🛡️ Balance **shield/speed** powerups and their durations.
- [ ]  💥 Add hit effects when colliding with obstacles.
- [ ]  🧠 Add simple AI behavior for boss (multi-phase attacks already scaffolded).
- [ ]  🔊 Add beat pulse visuals (screen flashes, camera shake tied to BPM).

### Phase 4: Test and improve

After the we have the levels and characters as well as the game functions working. We can now start to polish the details of the game such as more fancy graphics (animations), fix any bugs, implement other functions that would overall improve the look and feel of the game.

These are the tiny details that actually make the product (our game) more nicer looking and give nicer gameplay experience for the player. 

### **Tasks:**

- [ ]  🧪 Test collision logic (`checkCollision()` – Line ~1450).
- [ ]  🐞 Verify health, score, and combo systems.
- [ ]  ✨ Add visual polish — particle trails, glow effects, smoother transitions.
- [ ]  🎧 Sync soundtrack transitions perfectly between title → level → boss → credits.
- [ ]  🎮 Adjust difficulty curve per stage (increase obstacle spawn rate slightly each level).
- [ ]  🕹️ Confirm game state transitions (`title`, `playing`, `victory`, etc.) have no soft locks.

### Phase 5: Finalize

Towards the end, we can do a final check of all the components and fix any remaining bugs and other small details we might've missed along the way.

As at this point we would have the overall game running and something to work with and look at. So it should be easy to see how things are going at this point and adjust anything as needed.

### **Tasks:**

- [ ]  ✅ Insert final credits (update `drawCredits()` with team roles + real names).
- [ ]  📜 Clean code comments, remove placeholders, and ensure clarity.
- [ ]  📁 Organize project folder: `/assets/sprites/`, `/assets/music/`, `/scripts/`.
- [ ]  🖥️ Test in full-screen mode and adjust scaling for 1920×1080 displays.
- [ ]  🧾 Create short “How to Play” text for presentation slide or UI overlay.
- [ ]  📦 Export playable `.zip` version or online p5.js share link.

# Currently working on as of 11/12:
__________________________________________________
Saturn:

Home screen design + character choosing functionality 

My version of gameplay that can be changed and combined when we all have ours.

# Frankie:

Character design and level

![Artboard 1.png](attachment:8d147af4-cda5-484e-8d61-46906eadaee8:Artboard_1.png)

Level1 layout sketch is complete (features 8 stages; enough for at least 2-5 minutes).

![Level1 Layout.png](attachment:e6814884-96b8-4eaf-b6c0-147fe6c2a788:Level1_Layout.png)

# Link to code we have so far:

(feel free to change stuff and experiment with it) 

Make sure to duplicate the code before editing so we have our checkpoint saved in case we get some weird bugs.

Link:  (Read the comments to understand the logic of the code better and figure out what each part is for) 

Additonally, there are design related code parts we need to update with our final gifs or animated character designs when ready. Feel free to upload those. 

https://editor.p5js.org/Saturn_A/sketches/ySWKm_4vM

# Tsuyoshi:

Cleaned and turned Saturn’s code into reusable components.

https://editor.p5js.org/tsuyosi81/sketches/-dYIafUx7


