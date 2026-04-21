// ── Data ──
const QUESTIONS = [
  { q: "What should you do if you see a spill on the floor?", a: ["Clean it up or report it immediately", "Walk around it", "Ignore it", "Cover it with paper"], c: 0 },
  { q: "What does a yellow warning sign typically indicate?", a: ["Caution - potential hazard", "All clear", "Emergency exit", "Break room ahead"], c: 0 },
  { q: "What is the first thing to do in a fire emergency?", a: ["Activate the fire alarm", "Open windows", "Gather belongings", "Continue working"], c: 0 },
  { q: "When should you wear PPE?", a: ["Whenever the task requires it", "Only on Mondays", "When the boss is watching", "Never"], c: 0 },
  { q: "What does OSHA stand for?", a: ["Occupational Safety and Health Administration", "Office of Safety Hazard Assessment", "Organization for Safe Handling Activities", "Operational Standards for Health Assurance"], c: 0 },
  { q: "What should you do before using a ladder?", a: ["Inspect it for damage", "Just climb it", "Ask someone to hold it only", "Use it as-is"], c: 0 },
  { q: "How often should fire extinguishers be inspected?", a: ["Monthly", "Every 5 years", "Only after use", "Never"], c: 0 },
  { q: "What is the correct way to lift heavy objects?", a: ["Bend your knees, keep back straight", "Bend at the waist", "Twist and pull", "Use one hand"], c: 0 },
  { q: "What should you do if you find damaged electrical equipment?", a: ["Tag it out and report it", "Keep using it carefully", "Fix it yourself", "Ignore it"], c: 0 },
  { q: "What is an SDS?", a: ["Safety Data Sheet", "Standard Danger Signal", "Safety Detection System", "Secure Data Storage"], c: 0 },
  { q: "Where should emergency exits be?", a: ["Clearly marked and unobstructed", "Locked for security", "Hidden from visitors", "Near heavy equipment only"], c: 0 },
  { q: "What color is typically used for fire equipment?", a: ["Red", "Blue", "Green", "Yellow"], c: 0 },
];

const HAZARD_TYPES = [
  { name: "Wet Floor", emoji: "💧", color: "#3498db", sprite: "hazard-wetfloor" },
  { name: "Electrical", emoji: "⚡", color: "#f1c40f", sprite: "hazard-electrical" },
  { name: "Chemical Spill", emoji: "☣️", color: "#2ecc71", sprite: "hazard-chemical" },
  { name: "Fire", emoji: "🔥", color: "#e74c3c", sprite: "hazard-fire" },
];

const POWERUP_TYPES = [
  { name: "Hard Hat", emoji: "⛑️", color: "#f39c12", effect: "shield" },
  { name: "Safety Boots", emoji: "🥾", color: "#2980b9", effect: "doublejump" },
  { name: "First Aid", emoji: "🩹", color: "#e74c3c", effect: "heal" },
  { name: "Safety Vest", emoji: "🦺", color: "#e67e22", effect: "points" },
  { name: "Gloves", emoji: "🧤", color: "#8e44ad", effect: "magnet" },
];

// ── Canvas ──
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const W = 832, H = 468;

// ── Sprite Loading ──
// Place your sprites in the sprites/ folder. Supported player sprites:
//   sprites/player-idle.png   — standing still
//   sprites/player-run.png    — sprite sheet: frames side by side, each frame 56x72
//   sprites/player-jump.png   — in the air
//   sprites/player-shield.png — with hard hat (optional, falls back to idle + shield glow)
// All sprites are drawn at 28x36 in-game. Use 56x72 or 112x144 for crisp art.

const sprites = {};
const SPRITE_DEFS = {
  "player-idle":   { src: "sprites/player-idle.png",   cols: 5, rows: 5, fw: 252, fh: 520, frames: 25 },
  "player-run":    { src: "sprites/player-run.png",    cols: 5, rows: 5, fw: 396, fh: 534, frames: 25 },
  "player-jump":   { src: "sprites/player-jump.png",   cols: 5, rows: 5, fw: 324, fh: 610, frames: 25 },
  "player-shield": { src: "sprites/player-shield.png", cols: 5, rows: 5, fw: 252, fh: 520, frames: 25 },
  "hazard-wetfloor": { src: "sprites/hazard-wetfloor.png", cols: 1, rows: 1, fw: 120, fh: 120, frames: 1, drawH: 140, offsetY: 63 },
  "hazard-fire": { src: "sprites/hazard-fire.png", cols: 5, rows: 5, fw: 339, fh: 404, frames: 25, drawH: 90, offsetY: 5, noFlip: true },
  "hazard-electrical": { src: "sprites/hazard-electrical.png", cols: 3, rows: 3, fw: 120, fh: 120, frames: 9, drawH: 90, offsetY: 5, noFlip: true },
  "hazard-chemical": { src: "sprites/hazard-chemical.png", cols: 1, rows: 1, fw: 791, fh: 791, frames: 1, drawH: 110, offsetY: 54, noFlip: true },
  "manager": { src: "sprites/manager.png", cols: 1, rows: 1, fw: 120, fh: 120, frames: 1 },
  "safety-jd": { src: "sprites/safety-jd.png", cols: 1, rows: 1, fw: 120, fh: 120, frames: 1 },
  "jd-profile": { src: "sprites/jd-profile.png", cols: 1, rows: 1, fw: 375, fh: 666, frames: 1 },
};
const ANIM_SPEED = 0.4; // frames per game tick

function loadSprite(name) {
  const def = SPRITE_DEFS[name];
  if (!def) return;
  const img = new Image();
  img.src = def.src;
  img.onload = () => { sprites[name] = img; };
}

Object.keys(SPRITE_DEFS).forEach(loadSprite);

// ── Tile Loading ──
const tiles = {};
const TILE_SIZE = 32;
const TILE_NAMES = {
  wallDark: "IndustrialTile_01", wallPanel: "IndustrialTile_02", wallSolid: "IndustrialTile_03",
  floorCornerL: "IndustrialTile_04", floorTop: "IndustrialTile_05", floorCornerR: "IndustrialTile_06",
  beam1: "IndustrialTile_07", beam2: "IndustrialTile_08", hazardStripe: "IndustrialTile_09",
  platLeft: "IndustrialTile_31", platMid: "IndustrialTile_32", platRight: "IndustrialTile_33",
  floorFill: "IndustrialTile_34", floorFill2: "IndustrialTile_35",
  platformA: "Platform A",
  pillarMid: "IndustrialTile_61",
  pillarBase: "IndustrialTile_70",
  railing: "Railing A",
};
const OBJ_NAMES = ["Locker1", "Locker2", "Barrel1", "Barrel2", "Box1", "Box2", "Fire-extinguisher1", "Fence1", "Fall indicator", "Box3", "Box4"];
const objImages = {};

function loadTile(key, name) {
  const img = new Image();
  img.src = "sprites/Industrial Tileset/" + name + ".png";
  img.onload = () => { tiles[key] = img; };
}
function loadObj(name) {
  const img = new Image();
  img.src = "sprites/Objects/" + name + ".png";
  img.onload = () => { objImages[name] = img; };
}
Object.entries(TILE_NAMES).forEach(([k, v]) => loadTile(k, v));
OBJ_NAMES.forEach(loadObj);

// ── State ──
let gameState = "menu";
let player, platforms, hazards, powerups, coins, particles, questionTriggers, fallingBoxes, railings;
let score, lives, level, cameraX, playerName, activeEffects, usedQuestions;
let currentQuestion = null;
let lastBoxSpawn = 0;
const keys = {};

// ── UI ──
const screens = {
  menu: document.getElementById("menu-screen"),
  question: document.getElementById("question-screen"),
  gameover: document.getElementById("gameover-screen"),
  leaderboard: document.getElementById("leaderboard-screen"),
};
const $hud = document.getElementById("hud");
const $score = document.getElementById("score-display");
const $lives = document.getElementById("lives-display");
const $level = document.getElementById("level-display");
const $effects = document.getElementById("effects");

function showScreen(name) {
  // Hide all overlays
  Object.values(screens).forEach(el => el.classList.add("hidden"));
  // Show HUD only during play/question
  if (name === "playing" || name === "question") {
    $hud.classList.remove("hidden");
  } else {
    $hud.classList.add("hidden");
  }
  // Show the requested overlay
  if (screens[name]) {
    screens[name].classList.remove("hidden");
  }
  gameState = name;
}

// ── Input ──
document.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
  if (gameState === "cinematic" && cinematicTimer > 30) advanceLevel();
});
document.addEventListener("keyup", e => keys[e.code] = false);

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
document.getElementById("leaderboard-btn").addEventListener("click", () => renderLeaderboard());
document.getElementById("go-leaderboard-btn").addEventListener("click", () => renderLeaderboard());
document.getElementById("go-menu-btn").addEventListener("click", () => showScreen("menu"));
document.getElementById("back-btn").addEventListener("click", () => showScreen("menu"));

// ── Level Generation ──
// Max jump height ~110px (vy=-11, gravity=0.55). Keep step heights ≤90px so everything is reachable.
const MAX_STEP = 85;

function generateLevel(lvl) {
  platforms = []; hazards = []; powerups = []; coins = []; questionTriggers = []; fallingBoxes = [];
  const groundY = H - 40;
  const levelWidth = 3000 + lvl * 1000;

  const goalX = levelWidth - 100;

  // Ground segments
  for (let x = 0; x < levelWidth; x += 200) {
    if (Math.random() > 0.15 || x < 400) {
      platforms.push({ x, y: groundY, w: 200, h: 40, type: "ground" });
    }
  }

  // Floating platforms — placed as reachable chains from ground level
  let lastY = groundY;
  for (let x = 300; x < goalX - 150; x += 120 + Math.random() * 160) {
    const dir = Math.random() < 0.6 ? -1 : 1;
    let y = lastY + dir * (40 + Math.random() * (MAX_STEP - 40));
    y = Math.max(groundY - 260, Math.min(groundY - 60, y));
    if (y < groundY - MAX_STEP) {
      if (lastY - y > MAX_STEP) y = lastY - MAX_STEP;
    }
    const w = 80 + Math.random() * 80;
    platforms.push({ x, y, w, h: 16, type: "float" });
    if (Math.random() > 0.4) {
      coins.push({ x: x + w / 2 - 8, y: y - 25, w: 22, h: 22, collected: false });
    } else if (Math.random() < 0.3) {
      const ht = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
      hazards.push({ x: x + w / 2 - 20, y: y - 50, w: 40, h: 40, type: ht, timer: Math.random() * 6 });
    }
    lastY = y;
    if (Math.random() < 0.3) lastY = groundY;
  }

  // Helper: check if x position has ground beneath it
  const grounds = platforms.filter(p => p.type === "ground");
  function hasGround(x) {
    return grounds.some(p => x >= p.x && x + 30 <= p.x + p.w);
  }

  // Helper: check if position overlaps any placed object
  const placedObjects = [];
  const MIN_SPACING = 80;
  function tooClose(x) {
    return placedObjects.some(px => Math.abs(px - x) < MIN_SPACING);
  }
  function placeAt(x) { placedObjects.push(x); }

  // Hazards on ground
  for (let x = 500; x < goalX - 100; x += 200 + Math.random() * 300) {
    if (!hasGround(x) || tooClose(x)) continue;
    const ht = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
    const h = { x, y: groundY - 42, w: 40, h: 40, type: ht, timer: Math.random() * 6, facing: 1 };
    if (ht.patrols) {
      h.originX = x;
      h.patrolRange = 60 + Math.random() * 60;
      h.patrolSpeed = 0.5 + Math.random() * 0.5;
    }
    hazards.push(h);
    placeAt(x);
  }

  // Power-ups — only on solid ground or above floating platforms, not over pitfalls
  const floats = platforms.filter(p => p.type === "float");
  for (let x = 400; x < goalX - 100; x += 400 + Math.random() * 400) {
    if (tooClose(x)) continue;
    // Must have ground or a nearby float platform
    const nearFloat = floats.find(f => Math.abs(f.x + f.w / 2 - x) < 80);
    if (!hasGround(x) && !nearFloat) continue;
    const pt = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    let anchorY = groundY;
    if (nearFloat) anchorY = nearFloat.y;
    const py = anchorY - 30 - Math.random() * 40;
    powerups.push({ x, y: Math.max(40, py), w: 36, h: 36, type: pt, collected: false, bob: Math.random() * Math.PI * 2 });
    placeAt(x);
  }

  // Question triggers
  for (let x = 600; x < goalX - 100; x += 500 + Math.random() * 400) {
    if (!hasGround(x) || tooClose(x)) continue;
    questionTriggers.push({ x, y: groundY - 50, w: 46, h: 46, used: false });
    placeAt(x);
  }

  // Railings — decorative foreground objects on solid ground, not near hazards/pitfalls
  railings = [];
  for (let x = 300; x < goalX - 200; x += 300 + Math.random() * 400) {
    if (!hasGround(x) || tooClose(x)) continue;
    const count = 1 + Math.floor(Math.random() * 3); // 1-3 units
    railings.push({ x, y: groundY, count });
    placeAt(x);
  }

  // Manager goal — ensure ground exists beneath
  // Add ground under goal if missing
  if (!hasGround(goalX)) {
    platforms.push({ x: goalX - 50, y: groundY, w: 200, h: 40, type: "ground" });
  }
  platforms.push({ x: goalX, y: groundY - 60, w: 60, h: 60, type: "goal" });
}

// ── Start Game ──
function startGame() {
  bgCanvas = null; // reset cached background
  playerName = document.getElementById("player-name").value.trim() || "Player";
  score = 0; lives = 3; level = 1; cameraX = 0;
  activeEffects = {}; usedQuestions = new Set(); particles = [];
  player = { x: 50, y: H - 120, w: 40, h: 72, vx: 0, vy: 0, onGround: false, facing: 1, shielded: false, frame: 0 };
  lastBoxSpawn = 0;
  generateLevel(level);
  showScreen("playing");
}

// ── Collision ──
function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ── Update ──
function update() {
  if (gameState !== "playing") return;

  const spd = 5;
  const now = Date.now();

  // Movement
  if (keys["ArrowLeft"] || keys["KeyA"]) { player.vx = -spd; player.facing = -1; }
  else if (keys["ArrowRight"] || keys["KeyD"]) { player.vx = spd; player.facing = 1; }
  else { player.vx *= 0.8; }

  const jumpPressed = keys["ArrowUp"] || keys["KeyW"] || keys["Space"];
  if (jumpPressed && !player.jumpHeld) {
    if (player.onGround) {
      player.vy = -11.9;
      player.onGround = false;
      player.canDoubleJump = !!activeEffects.doublejump;
    } else if (player.canDoubleJump) {
      player.vy = -10;
      player.canDoubleJump = false;
    }
  }
  player.jumpHeld = jumpPressed;

  player.vy += 0.48;
  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;
  player.frame += Math.abs(player.vx) * 0.1;

  // Platform collision
  for (const p of platforms) {
    if (p.type === "goal") {
      if (overlap(player, p)) { nextLevel(); return; }
      continue;
    }
    if (player.vy >= 0 &&
        player.x + player.w > p.x && player.x < p.x + p.w &&
        player.y + player.h >= p.y && player.y + player.h <= p.y + 14 + player.vy) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // Fall death
  if (player.y > H + 50) { loseLife(); return; }

  // Camera
  cameraX += (player.x - W / 3 - cameraX) * 0.1;
  if (cameraX < 0) cameraX = 0;

  // Coin magnet
  if (activeEffects.magnet && now < activeEffects.magnet) {
    for (const c of coins) {
      if (c.collected) continue;
      const dx = player.x - c.x, dy = player.y - c.y;
      if (Math.sqrt(dx * dx + dy * dy) < 120) { c.x += dx * 0.08; c.y += dy * 0.08; }
    }
  }

  // Coin pickup
  for (const c of coins) {
    if (!c.collected && overlap(player, c)) {
      c.collected = true; score += 10;
      burst(c.x, c.y, "#f1c40f", 5);
    }
  }

  // Power-up pickup
  for (const p of powerups) {
    p.bob += 0.05;
    if (!p.collected && overlap(player, p)) {
      p.collected = true;
      applyPowerup(p.type);
      burst(p.x, p.y, p.type.color, 8);
    }
  }

  // Hazard collision
  for (let i = hazards.length - 1; i >= 0; i--) {
    const h = hazards[i];
    h.timer += 0.05;
    // Patrol movement
    if (h.originX !== undefined) {
      h.x += h.patrolSpeed * h.facing;
      if (h.x > h.originX + h.patrolRange) h.facing = -1;
      if (h.x < h.originX - h.patrolRange) h.facing = 1;
    }
    if (overlap(player, h)) {
      if (player.shielded) {
        player.shielded = false;
        burst(h.x, h.y, h.type.color, 6);
        hazards.splice(i, 1);
        score += 25;
      } else { loseLife(); return; }
    }
  }

  // Question triggers
  for (const qt of questionTriggers) {
    if (!qt.used && overlap(player, qt)) {
      qt.used = true;
      triggerQuestion();
    }
  }

  // Falling boxes — spawn rate increases with level
  const spawnInterval = Math.max(400, 2000 - level * 200);
  if (now - lastBoxSpawn > spawnInterval) {
    lastBoxSpawn = now;
    const bx = player.x - 100 + Math.random() * (W + 200);
    const speed = 1.5 + Math.random() * 1.5 + level * 0.3;
    // Spawn warning indicator first, box drops after warning
    const boxSprites = ["Box1", "Box3", "Box4"];
    const boxSpr = boxSprites[Math.floor(Math.random() * boxSprites.length)];
    fallingBoxes.push({ x: bx, y: -30, w: 34, h: 34, vy: 0, dropSpeed: speed, warning: 60, sprite: boxSpr });
  }

  // Update falling boxes
  for (let i = fallingBoxes.length - 1; i >= 0; i--) {
    const b = fallingBoxes[i];
    // Warning phase — flash at top before dropping
    if (b.warning > 0) {
      b.warning--;
      if (b.warning === 0) b.vy = b.dropSpeed;
      continue;
    }
    b.vy += 0.08;
    b.y += b.vy;
    // Remove if off screen
    if (b.y > H + 40) { fallingBoxes.splice(i, 1); continue; }
    // Hit player
    if (overlap(player, b)) {
      fallingBoxes.splice(i, 1);
      if (player.shielded) {
        player.shielded = false;
        burst(b.x, b.y, "#e67e22", 6);
        score += 25;
      } else { loseLife(); return; }
    }
    // Land on platform — stop and become static debris briefly then vanish
    for (const p of platforms) {
      if (p.type === "goal") continue;
      if (b.vy > 0 && b.x + b.w > p.x && b.x < p.x + p.w &&
          b.y + b.h >= p.y && b.y + b.h <= p.y + 10 + b.vy) {
        burst(b.x, b.y, "#e67e22", 4);
        fallingBoxes.splice(i, 1);
        break;
      }
    }
  }

  // Expire effects
  for (const k of Object.keys(activeEffects)) {
    if (now > activeEffects[k]) delete activeEffects[k];
  }

  // Particles
  particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; return p.life > 0; });

  // HUD
  $score.textContent = "Score: " + score;
  $lives.textContent = "❤️".repeat(lives);
  $level.textContent = "Level " + level;

  // Effects display
  const fx = [];
  if (player.shielded) fx.push("⛑️ Shield");
  if (activeEffects.doublejump) fx.push("🥾 Double Jump");
  if (activeEffects.magnet) fx.push("🧤 Coin Magnet");
  $effects.textContent = fx.join("  ");
}

function applyPowerup(type) {
  switch (type.effect) {
    case "shield": player.shielded = true; score += 15; break;
    case "doublejump": activeEffects.doublejump = Date.now() + 10000; score += 10; break;
    case "heal": lives = Math.min(lives + 1, 3); score += 10; break;
    case "points": score += 50; break;
    case "magnet": activeEffects.magnet = Date.now() + 8000; score += 10; break;
  }
}

function loseLife() {
  lives--;
  if (lives <= 0) { gameOver(); return; }
  player.x = 50; player.y = H - 120; player.vx = 0; player.vy = 0; cameraX = 0;
  burst(player.x, player.y, "#e74c3c", 10);
}

// ── Level Complete Cinematic ──
const LEVEL_MESSAGES = [
  "Great work! Safety will take care of all those hazards!",
  "Well done! Keep up the great work and remember to work safe!",
  "Thank you for reporting all those hazards! We will get to work making this site the safest place to work!",
];
let cinematicTimer = 0;
let cinematicSlideX = W; // starts off-screen right

function nextLevel() {
  score += 100;
  // Show cinematic for levels 1-3
  if (level <= 3) {
    gameState = "cinematic";
    cinematicTimer = 0;
    cinematicSlideX = W;
  } else {
    advanceLevel();
  }
}

function advanceLevel() {
  level++;
  player.x = 50; player.y = H - 120; player.vx = 0; player.vy = 0; cameraX = 0;
  generateLevel(level);
  burst(player.x, player.y, "#2ecc71", 15);
  gameState = "playing";
}

function updateCinematic() {
  cinematicTimer++;
  // Slide portrait in from right
  const portraitH = H - 40;
  const portraitW = portraitH * (375 / 666);
  const targetX = W - portraitW - 20;
  cinematicSlideX += (targetX - cinematicSlideX) * 0.08;
  // Auto-advance after 4 seconds
  if (cinematicTimer > 240) {
    advanceLevel();
  }
}

function drawCinematic() {
  // Draw the game frozen in background
  draw();
  // Dark overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, W, H);

  // Message box
  ctx.fillStyle = "rgba(15, 52, 96, 0.95)";
  ctx.strokeStyle = "#e94560";
  ctx.lineWidth = 3;
  const boxY = H / 2 - 60;
  ctx.fillRect(30, boxY, W - 60, 120);
  ctx.strokeRect(30, boxY, W - 60, 120);

  // Level complete header
  ctx.fillStyle = "#e94560";
  ctx.font = "bold 22px 'Segoe UI', sans-serif";
  ctx.fillText("Level " + level + " Complete!", 50, boxY + 30);

  // Message text — wrap within box
  const msg = LEVEL_MESSAGES[(level - 1) % LEVEL_MESSAGES.length];
  ctx.fillStyle = "#fff";
  ctx.font = "16px 'Segoe UI', sans-serif";
  const maxWidth = W - 280;
  const words = msg.split(" ");
  let line = "";
  let lineY = boxY + 58;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), 50, lineY);
      line = word + " ";
      lineY += 22;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), 50, lineY);

  // JD profile portrait sliding in from right — large, overlapping message box
  const portrait = sprites["jd-profile"];
  if (portrait) {
    const pH = H - 40; // nearly full height
    const pW = pH * (375 / 666);
    const pX = cinematicSlideX;
    const pY = 20;
    ctx.drawImage(portrait, pX, pY, pW, pH);
  }

  // Skip hint
  ctx.fillStyle = "#888";
  ctx.font = "12px sans-serif";
  ctx.fillText("Press any key to continue...", W / 2 - 80, H - 20);
}

function gameOver() {
  document.getElementById("final-score").textContent = playerName + " scored " + score + " points on Level " + level + "!";
  saveScore(playerName, score);
  showScreen("gameover");
}

function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4, color, life: 20 + Math.random() * 15 });
  }
}

// ── Questions ──
function triggerQuestion() {
  let pool = QUESTIONS.filter((_, i) => !usedQuestions.has(i));
  if (!pool.length) { usedQuestions.clear(); pool = QUESTIONS; }
  const idx = QUESTIONS.indexOf(pool[Math.floor(Math.random() * pool.length)]);
  usedQuestions.add(idx);
  currentQuestion = QUESTIONS[idx];

  document.getElementById("question-text").textContent = currentQuestion.q;
  const div = document.getElementById("answers");
  div.innerHTML = "";
  currentQuestion.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => answerQuestion(i, btn));
    div.appendChild(btn);
  });
  showScreen("question");
}

function answerQuestion(idx, btn) {
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);
  if (idx === currentQuestion.c) {
    btn.classList.add("correct");
    score += 50;
    burst(player.x, player.y, "#2ecc71", 10);
  } else {
    btn.classList.add("wrong");
    buttons[currentQuestion.c].classList.add("correct");
    score = Math.max(0, score - 10);
  }
  setTimeout(() => showScreen("playing"), 1200);
}

// ── Drawing ──
// ── Cached background ──
let bgCanvas = null;
function drawCachedBackground() {
  if (!bgCanvas) {
    bgCanvas = document.createElement("canvas");
    bgCanvas.width = W;
    bgCanvas.height = H;
    const bg = bgCanvas.getContext("2d");

    const grad = bg.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#2a2a2a");
    grad.addColorStop(0.1, "#3a3a3a");
    grad.addColorStop(0.3, "#353535");
    grad.addColorStop(1, "#252525");
    bg.fillStyle = grad;
    bg.fillRect(0, 0, W, H);

    // Ceiling beams with bolts
    for (let i = 0; i < 25; i++) {
      const bx = i * 130;
      bg.fillStyle = "#383838";
      bg.fillRect(bx, 0, 10, 34);
      bg.fillStyle = "#404040";
      bg.fillRect(bx - 24, 30, 58, 5);
      bg.fillStyle = "#555";
      bg.fillRect(bx - 18, 31, 3, 3);
      bg.fillRect(bx + 24, 31, 3, 3);
    }

    // Ceiling lights
    for (let i = 0; i < 8; i++) {
      const lx = 80 + i * 140;
      bg.fillStyle = "#666";
      bg.fillRect(lx, 34, 40, 4);
      bg.fillStyle = "rgba(255, 255, 200, 0.04)";
      bg.beginPath();
      bg.moveTo(lx, 38);
      bg.lineTo(lx + 40, 38);
      bg.lineTo(lx + 80, H - 50);
      bg.lineTo(lx - 40, H - 50);
      bg.closePath();
      bg.fill();
    }

    // Back wall brick texture
    bg.fillStyle = "rgba(60, 60, 60, 0.3)";
    for (let y = 50; y < H - 50; y += 20) {
      const offset = (Math.floor(y / 20) % 2) * 30;
      for (let x = offset; x < W; x += 60) {
        bg.fillRect(x, y, 56, 18);
      }
    }

    // Floor hazard stripes
    bg.fillStyle = "#e8c840";
    bg.fillRect(0, H - 42, W, 3);
    for (let x = 0; x < W; x += 40) {
      bg.fillStyle = (x / 40) % 2 === 0 ? "#e8c840" : "#333";
      bg.fillRect(x, H - 39, 20, 3);
    }
  }
  ctx.drawImage(bgCanvas, 0, 0);
  return true;
}

function draw() {
  drawCachedBackground();

  // Back wall — far racking (slow parallax)
  for (let i = 0; i < 12; i++) {
    const rx = i * 140 - (cameraX * 0.1) % 140;
    ctx.fillStyle = "#444";
    ctx.fillRect(rx, 60, 6, H - 100);
    ctx.fillRect(rx + 80, 60, 6, H - 100);
    for (let s = 0; s < 3; s++) {
      const sy = 80 + s * 100;
      ctx.fillStyle = "#555";
      ctx.fillRect(rx, sy, 86, 5);
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(rx + 8 + (s * 17 % 25), sy - 20, 24, 18);
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(rx + 42 + (s * 11 % 15), sy - 16, 18, 14);
      ctx.fillStyle = "#7a5c2e";
      ctx.fillRect(rx + 65, sy - 12, 12, 10);
    }
  }

  // Mid racking (medium parallax)
  for (let i = 0; i < 10; i++) {
    const rx = i * 160 - (cameraX * 0.25) % 160;
    ctx.fillStyle = "#d35400";
    ctx.fillRect(rx, 90, 8, H - 130);
    ctx.fillRect(rx + 100, 90, 8, H - 130);
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx + 4, 120); ctx.lineTo(rx + 104, 220);
    ctx.moveTo(rx + 104, 120); ctx.lineTo(rx + 4, 220);
    ctx.stroke();
    ctx.fillStyle = "#2c6fbb";
    for (let s = 0; s < 3; s++) {
      const sy = 130 + s * 110;
      ctx.fillRect(rx, sy, 108, 6);
      ctx.fillStyle = "#c8a96e";
      ctx.fillRect(rx + 10, sy - 28, 38, 26);
      ctx.fillStyle = "#ddd";
      ctx.fillRect(rx + 58, sy - 24, 30, 22);
      ctx.fillStyle = "#2c6fbb";
    }
  }

  // Safety signs (slow parallax)
  for (let i = 0; i < 5; i++) {
    const sx = 200 + i * 280 - (cameraX * 0.15) % 280;
    if (i % 2 === 0) {
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(sx, 55, 36, 18);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("EXIT", sx + 4, 68);
    } else {
      ctx.fillStyle = "#2980b9";
      ctx.fillRect(sx, 52, 28, 34);
      ctx.fillStyle = "#fff";
      ctx.font = "7px sans-serif";
      ctx.fillText("SAFE", sx + 3, 72);
      ctx.fillText("WORK", sx + 2, 80);
    }
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Platforms
  const ts = TILE_SIZE;
  for (const p of platforms) {
    if (p.type === "goal") {
      const goalSprite = level <= 3 ? sprites["safety-jd"] : sprites["manager"];
      if (goalSprite) {
        const drawH = 80;
        const drawW = drawH;
        ctx.drawImage(goalSprite, p.x + p.w / 2 - drawW / 2, p.y + p.h - drawH - 2, drawW, drawH);
      } else {
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.font = "28px serif";
        ctx.fillText("🚩", p.x + 14, p.y + 36);
      }
    } else if (p.type === "ground") {
      // Tiled ground platform
      const tTop = tiles.floorTop;
      const tFill = tiles.floorFill;
      if (tTop && tFill) {
        for (let x = p.x; x < p.x + p.w; x += ts) {
          const tw = Math.min(ts, p.x + p.w - x);
          ctx.drawImage(tTop, x, p.y, tw, ts);
          if (p.h > ts) ctx.drawImage(tFill, x, p.y + ts, tw, p.h - ts);
        }
      } else {
        ctx.fillStyle = "#5a5a5a";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = "#e8c840";
        ctx.fillRect(p.x, p.y, p.w, 3);
      }
    } else {
      // Platform A on top of stacked pillar tiles (61) with base (70)
      const platImg = tiles.platformA;
      const pillarMid = tiles.pillarMid;
      const pillarBase = tiles.pillarBase;
      if (platImg && pillarMid && pillarBase) {
        const ts = 32;
        // Platform A on top — whole units, doubled for width
        const platH = 24; // draw height for platform top
        const platW = platH * (96 / 47);
        const count = Math.max(1, Math.round(p.w / platW));
        const totalW = count * platW;
        const startX = p.x + (p.w - totalW) / 2;
        // Pillar columns from platform down to ground
        const groundY = H - 40;
        const pillarTop = p.y + 4;
        const pillarBottom = groundY;
        const colSpacing = Math.max(totalW, ts); // one column per platform unit
        for (let i = 0; i < count; i++) {
          const cx = startX + i * platW + platW / 2 - ts / 2;
          // Stack tile 61 from top to bottom
          for (let y = pillarTop; y < pillarBottom - ts; y += ts) {
            ctx.drawImage(pillarMid, cx, y, ts, ts);
          }
          // Base tile 70 at bottom
          ctx.drawImage(pillarBase, cx, pillarBottom - ts, ts, ts);
        }
        // Draw Platform A on top
        for (let i = 0; i < count; i++) {
          ctx.drawImage(platImg, startX + i * platW, p.y - platH + 4, platW, platH);
        }
      } else {
        ctx.fillStyle = "#6a6a6a";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = "#888";
        ctx.fillRect(p.x, p.y, p.w, 2);
      }
    }
  }

  // Coins
  for (const c of coins) {
    if (c.collected) continue;
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(c.x + 11, c.y + 11, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f39c12";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("$", c.x + 5, c.y + 16);
  }

  // Hazards
  for (const h of hazards) {
    const def = h.type.sprite ? SPRITE_DEFS[h.type.sprite] : null;
    const spr = h.type.sprite ? sprites[h.type.sprite] : null;

    if (spr && def) {
      const frameIdx = Math.floor(h.timer * 8) % def.frames;
      const col = frameIdx % def.cols;
      const row = Math.floor(frameIdx / def.cols);
      const aspect = def.fw / def.fh;
      const drawH = def.drawH || 70;
      const drawW = drawH * aspect;
      const anchorY = h.y + h.h + (def.offsetY || 0);
      ctx.save();
      ctx.translate(h.x + h.w / 2, anchorY);
      const frameFacing = (!def.noFlip && def.frames > 1) ? (frameIdx < def.frames / 2 ? 1 : -1) : 1;
      ctx.scale(frameFacing, 1);
      ctx.drawImage(spr,
        col * def.fw, row * def.fh, def.fw, def.fh,
        -drawW / 2, -drawH, drawW, drawH);
      ctx.restore();
    } else {
      // Emoji fallback
      ctx.font = "24px serif";
      ctx.fillText(h.type.emoji, h.x, h.y + 24);
      const pulse = Math.sin(h.timer * 3) * 0.3 + 0.7;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = h.type.color;
      ctx.beginPath();
      ctx.moveTo(h.x + 15, h.y - 10);
      ctx.lineTo(h.x + 5, h.y + 2);
      ctx.lineTo(h.x + 25, h.y + 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Power-ups
  for (const p of powerups) {
    if (p.collected) continue;
    const bobY = Math.sin(p.bob) * 5;
    ctx.font = "30px serif";
    ctx.fillText(p.type.emoji, p.x, p.y + 28 + bobY);
  }

  // Falling boxes
  const fallIndicator = objImages["Fall indicator"];
  for (const b of fallingBoxes) {
    // Warning phase — flash indicator at top of screen
    if (b.warning > 0) {
      const flash = Math.floor(b.warning / 6) % 2 === 0;
      if (flash) {
        if (fallIndicator) {
          ctx.drawImage(fallIndicator, b.x, 4, 34, 34);
        } else {
          ctx.fillStyle = "#e74c3c";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText("⚠", b.x + 4, 28);
        }
      }
      continue;
    }
    const boxImg = objImages[b.sprite];
    if (boxImg) {
      ctx.drawImage(boxImg, b.x, b.y, b.w, b.h);
    } else {
      ctx.fillStyle = "#e67e22";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    // Warning shadow on ground
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.ellipse(b.x + b.w / 2, H - 42, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Question triggers
  for (const qt of questionTriggers) {
    if (qt.used) continue;
    ctx.font = "36px serif";
    ctx.fillText("⚠️", qt.x, qt.y + 34);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("?", qt.x + 14, qt.y + 22);
  }

  // Player
  const pl = player;
  ctx.save();
  ctx.translate(pl.x + pl.w / 2, pl.y + pl.h / 2);
  ctx.scale(pl.facing, 1);

  // Shield glow (drawn regardless of sprite mode)
  if (pl.shielded) {
    ctx.strokeStyle = "rgba(52, 152, 219, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Pick the right sprite
  let spriteKey = "player-idle";
  if (!pl.onGround) spriteKey = "player-jump";
  else if (Math.abs(pl.vx) > 0.5) spriteKey = "player-run";
  if (pl.shielded && sprites["player-shield"]) spriteKey = "player-shield";

  const spr = sprites[spriteKey];
  const def = SPRITE_DEFS[spriteKey];
  if (spr && def) {
    // Animated grid sprite sheet
    const frameIdx = Math.floor(pl.frame * ANIM_SPEED) % def.frames;
    const col = frameIdx % def.cols;
    const row = Math.floor(frameIdx / def.cols);
    // Draw scaled to player size, preserving aspect ratio
    const aspect = def.fw / def.fh;
    const drawH = pl.h * 1.1;
    const drawW = drawH * aspect;
    ctx.drawImage(spr,
      col * def.fw, row * def.fh, def.fw, def.fh,
      -drawW / 2, -drawH / 2, drawW, drawH);
  } else {
    // Fallback: original canvas drawing
    ctx.fillStyle = "#e94560";
    ctx.fillRect(-pl.w / 2, -pl.h / 2 + 10, pl.w, pl.h - 10);
    ctx.fillStyle = "#ffeaa7";
    ctx.beginPath();
    ctx.arc(0, -pl.h / 2 + 6, 10, 0, Math.PI * 2);
    ctx.fill();
    if (pl.shielded) {
      ctx.fillStyle = "#f39c12";
      ctx.fillRect(-10, -pl.h / 2 - 6, 20, 8);
      ctx.fillRect(-13, -pl.h / 2 + 1, 26, 3);
    }
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(2, -pl.h / 2 + 3, 3, 3);
    const legSwing = Math.sin(pl.frame) * 4;
    ctx.fillStyle = "#0f3460";
    ctx.fillRect(-8, pl.h / 2 - 4, 7, 8 + legSwing);
    ctx.fillRect(2, pl.h / 2 - 4, 7, 8 - legSwing);
  }

  ctx.restore();

  // Railings — drawn in front of player
  const railImg = tiles.railing;
  if (railImg) {
    for (const r of railings) {
      const rH = 36; // half player height
      const rW = rH * (96 / 16); // preserve aspect ratio
      for (let i = 0; i < r.count; i++) {
        ctx.drawImage(railImg, r.x + i * rW, r.y - rH, rW, rH);
      }
    }
  }

  // Particles
  for (const p of particles) {
    ctx.globalAlpha = p.life / 35;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 4, 4);
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

// ── Leaderboard ──
const useFirebase = typeof db !== "undefined";

function saveScore(name, sc) {
  if (useFirebase) {
    // Each play is a separate entry, ranked by score
    db.ref("leaderboard").push({ name, score: sc, timestamp: Date.now() });
  } else {
    const lb = JSON.parse(localStorage.getItem("safetyHeroScores") || "[]");
    lb.push({ name, score: sc });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem("safetyHeroScores", JSON.stringify(lb.slice(0, 10)));
  }
}

function renderLeaderboard() {
  const medals = ["🥇", "🥈", "🥉"];
  const list = document.getElementById("leaderboard-list");

  function displayScores(entries) {
    console.log("Leaderboard entries:", entries.length);
    let html = "";
    for (let i = 0; i < entries.length; i++) {
      const prefix = i < 3 ? medals[i] + " " : (i + 1) + ". ";
      html += "<li><span>" + prefix + entries[i].name + "</span><span>" + entries[i].score + " pts</span></li>";
    }
    list.innerHTML = html || "<li>No scores yet!</li>";
  }

  if (useFirebase) {
    list.innerHTML = "<li>Loading...</li>";
    showScreen("leaderboard");
    db.ref("leaderboard").orderByChild("score").limitToLast(10).once("value", function(snap) {
      const entries = [];
      snap.forEach(function(child) { entries.push(child.val()); });
      entries.sort(function(a, b) { return b.score - a.score; });
      displayScores(entries);
    });
  } else {
    const lb = JSON.parse(localStorage.getItem("safetyHeroScores") || "[]").slice(0, 10);
    displayScores(lb);
    showScreen("leaderboard");
  }
}

// ── Game Loop ──
function loop() {
  update();
  if (gameState === "playing" || gameState === "question") {
    draw();
  } else if (gameState === "cinematic") {
    updateCinematic();
    drawCinematic();
  }
  requestAnimationFrame(loop);
}

showScreen("menu");
loop();
