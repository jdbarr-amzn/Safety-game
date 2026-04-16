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
  { name: "Wet Floor", emoji: "💧", color: "#3498db" },
  { name: "Electrical", emoji: "⚡", color: "#f1c40f" },
  { name: "Chemical Spill", emoji: "☣️", color: "#2ecc71" },
  { name: "Falling Objects", emoji: "📦", color: "#e67e22" },
  { name: "Fire", emoji: "🔥", color: "#e74c3c" },
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
const W = 800, H = 500;

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

// ── State ──
let gameState = "menu";
let player, platforms, hazards, powerups, coins, particles, questionTriggers, fallingBoxes;
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
      coins.push({ x: x + w / 2 - 8, y: y - 25, w: 16, h: 16, collected: false });
    } else if (Math.random() < 0.3) {
      const ht = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
      hazards.push({ x: x + w / 2 - 15, y: y - 30, w: 30, h: 30, type: ht, timer: Math.random() * 6 });
    }
    lastY = y;
    if (Math.random() < 0.3) lastY = groundY;
  }

  // Helper: check if x position has ground beneath it
  const grounds = platforms.filter(p => p.type === "ground");
  function hasGround(x) {
    return grounds.some(p => x >= p.x && x + 30 <= p.x + p.w);
  }

  // Hazards on ground
  for (let x = 500; x < goalX - 100; x += 200 + Math.random() * 300) {
    if (!hasGround(x)) continue;
    const ht = HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)];
    hazards.push({ x, y: groundY - 30, w: 30, h: 30, type: ht, timer: Math.random() * 6 });
  }

  // Power-ups
  const floats = platforms.filter(p => p.type === "float");
  for (let x = 400; x < goalX - 100; x += 400 + Math.random() * 400) {
    const pt = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    let anchorY = groundY;
    for (const f of floats) {
      if (Math.abs(f.x - x) < 150) { anchorY = Math.min(anchorY, f.y); }
    }
    const py = anchorY - 30 - Math.random() * 40;
    powerups.push({ x, y: Math.max(40, py), w: 28, h: 28, type: pt, collected: false, bob: Math.random() * Math.PI * 2 });
  }

  // Question triggers
  for (let x = 600; x < goalX - 100; x += 500 + Math.random() * 400) {
    if (!hasGround(x)) continue;
    questionTriggers.push({ x, y: groundY - 50, w: 36, h: 36, used: false });
  }

  // Goal flag
  platforms.push({ x: goalX, y: groundY - 60, w: 60, h: 60, type: "goal" });
}

// ── Start Game ──
function startGame() {
  playerName = document.getElementById("player-name").value.trim() || "Player";
  score = 0; lives = 3; level = 1; cameraX = 0;
  activeEffects = {}; usedQuestions = new Set(); particles = [];
  player = { x: 50, y: H - 120, w: 30, h: 56, vx: 0, vy: 0, onGround: false, facing: 1, shielded: false, frame: 0 };
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
      player.vy = -11;
      player.onGround = false;
      player.canDoubleJump = !!activeEffects.doublejump;
    } else if (player.canDoubleJump) {
      player.vy = -10;
      player.canDoubleJump = false;
    }
  }
  player.jumpHeld = jumpPressed;

  player.vy += 0.55;
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
  const spawnInterval = Math.max(400, 2000 - level * 200); // ms between spawns
  if (now - lastBoxSpawn > spawnInterval) {
    lastBoxSpawn = now;
    // Spawn near the player's visible area with some randomness
    const bx = player.x - 100 + Math.random() * (W + 200);
    fallingBoxes.push({ x: bx, y: -30, w: 26, h: 26, vy: 1.5 + Math.random() * 1.5 + level * 0.3 });
  }

  // Update falling boxes
  for (let i = fallingBoxes.length - 1; i >= 0; i--) {
    const b = fallingBoxes[i];
    b.vy += 0.08; // slight acceleration
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

function nextLevel() {
  level++; score += 100;
  player.x = 50; player.y = H - 120; player.vx = 0; player.vy = 0; cameraX = 0;
  generateLevel(level);
  burst(player.x, player.y, "#2ecc71", 15);
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
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Warehouse ceiling/wall gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#3a3a3a");
  grad.addColorStop(0.15, "#4a4a4a");
  grad.addColorStop(1, "#2a2a2a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Ceiling beams
  ctx.fillStyle = "#333";
  for (let i = 0; i < 20; i++) {
    const bx = i * 160 - (cameraX * 0.05) % 160;
    ctx.fillRect(bx, 0, 8, 30);
    ctx.fillRect(bx - 20, 28, 48, 4);
  }

  // Back wall — far racking (slow parallax)
  ctx.fillStyle = "#444";
  for (let i = 0; i < 16; i++) {
    const rx = i * 140 - (cameraX * 0.1) % 140;
    // Upright posts
    ctx.fillRect(rx, 60, 6, H - 100);
    ctx.fillRect(rx + 80, 60, 6, H - 100);
    // Shelves
    ctx.fillStyle = "#555";
    for (let s = 0; s < 4; s++) {
      const sy = 80 + s * 80;
      ctx.fillRect(rx, sy, 86, 5);
      // Boxes on shelves
      ctx.fillStyle = "#8B6914";
      const bw = 18 + (i * 7 + s * 13) % 12;
      ctx.fillRect(rx + 10 + (s * 17 % 30), sy - bw + 2, bw, bw - 2);
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(rx + 45 + (s * 11 % 20), sy - 14, 16, 12);
      ctx.fillStyle = "#555";
    }
    ctx.fillStyle = "#444";
  }

  // Mid racking (medium parallax)
  for (let i = 0; i < 12; i++) {
    const rx = i * 180 - (cameraX * 0.25) % 180;
    // Orange upright posts
    ctx.fillStyle = "#d35400";
    ctx.fillRect(rx, 100, 8, H - 140);
    ctx.fillRect(rx + 100, 100, 8, H - 140);
    // Blue shelf beams
    ctx.fillStyle = "#2c6fbb";
    for (let s = 0; s < 3; s++) {
      const sy = 140 + s * 100;
      ctx.fillRect(rx, sy, 108, 6);
      // Pallets/boxes
      ctx.fillStyle = "#c8a96e";
      ctx.fillRect(rx + 12, sy - 30, 35, 28);
      ctx.fillStyle = "#a0522d";
      ctx.fillRect(rx + 55, sy - 22, 28, 20);
      ctx.fillStyle = "#2c6fbb";
    }
  }

  // Warehouse floor line
  ctx.fillStyle = "#e8c840";
  ctx.fillRect(0, H - 42, W, 3);

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Platforms
  for (const p of platforms) {
    if (p.type === "goal") {
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.font = "28px serif";
      ctx.fillText("🚩", p.x + 14, p.y + 36);
    } else if (p.type === "ground") {
      ctx.fillStyle = "#5a5a5a";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      // Yellow safety line on floor edge
      ctx.fillStyle = "#e8c840";
      ctx.fillRect(p.x, p.y, p.w, 3);
    } else {
      // Metal grate platforms
      ctx.fillStyle = "#6a6a6a";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "#888";
      ctx.fillRect(p.x, p.y, p.w, 2);
    }
  }

  // Coins
  for (const c of coins) {
    if (c.collected) continue;
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(c.x + 8, c.y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f39c12";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("$", c.x + 4, c.y + 13);
  }

  // Hazards
  for (const h of hazards) {
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

  // Power-ups
  for (const p of powerups) {
    if (p.collected) continue;
    const bobY = Math.sin(p.bob) * 5;
    ctx.font = "22px serif";
    ctx.fillText(p.type.emoji, p.x, p.y + 22 + bobY);
  }

  // Falling boxes
  for (const b of fallingBoxes) {
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = "#d35400";
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    // Cross tape on box
    ctx.strokeStyle = "#f39c12";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + b.w, b.y + b.h);
    ctx.moveTo(b.x + b.w, b.y); ctx.lineTo(b.x, b.y + b.h);
    ctx.stroke();
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
    ctx.font = "28px serif";
    ctx.fillText("⚠️", qt.x, qt.y + 28);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("?", qt.x + 11, qt.y + 18);
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
    // Use player name as key — only keep their best score
    const ref = db.ref("leaderboard/" + encodeURIComponent(name).replace(/\./g, "_"));
    ref.once("value", snap => {
      const existing = snap.val();
      if (!existing || sc > existing.score) {
        ref.set({ name, score: sc, timestamp: Date.now() });
      }
    });
  } else {
    const lb = JSON.parse(localStorage.getItem("safetyHeroScores") || "[]");
    const idx = lb.findIndex(e => e.name === name);
    if (idx >= 0) {
      if (sc > lb[idx].score) lb[idx].score = sc;
    } else {
      lb.push({ name, score: sc });
    }
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem("safetyHeroScores", JSON.stringify(lb.slice(0, 10)));
  }
}

function renderLeaderboard() {
  const medals = ["🥇", "🥈", "🥉"];
  const list = document.getElementById("leaderboard-list");

  function displayScores(entries) {
    list.innerHTML = entries.length
      ? entries.map((e, i) => {
          const prefix = i < 3 ? medals[i] + " " : (i + 1) + ". ";
          return "<li><span>" + prefix + e.name + "</span><span>" + e.score + " pts</span></li>";
        }).join("")
      : "<li>No scores yet!</li>";
  }

  if (useFirebase) {
    list.innerHTML = "<li>Loading...</li>";
    showScreen("leaderboard");
    db.ref("leaderboard").orderByChild("score").limitToLast(10).once("value", snap => {
      const entries = [];
      snap.forEach(child => entries.push(child.val()));
      entries.sort((a, b) => b.score - a.score);
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
  }
  requestAnimationFrame(loop);
}

showScreen("menu");
loop();
