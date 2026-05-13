// ── Data ──
const QUESTIONS = [
  { q: "What does PPE stand for?", a: ["Personal Protective Equipment", "Process Path Engineering", "Preventive Protection Evaluation", "Personal Process Equipment"], c: 0 },
  { q: "What should you do when you hear the fire alarm?", a: ["Continue working until your manager tells you to stop", "Immediately evacuate to your designated assembly point", "Call your manager first", "Wait for the strobe lights to activate"], c: 1 },
  { q: "What color is a high-visibility safety vest?", a: ["Blue", "Red", "Yellow/Orange (high-vis)", "White"], c: 2 },
  { q: "What is the purpose of 5S floor markings in the facility?", a: ["Decoration", "To indicate safe zones, walkways, and hazard areas", "To show where to store personal items", "To mark break areas only"], c: 1 },
  { q: "What is the Andon system used for?", a: ["Tracking packages", "Alerting leadership to issues, including safety concerns", "Clocking in and out", "Ordering supplies"], c: 1 },
  { q: "What type of footwear is required on the warehouse floor?", a: ["Open-toed shoes", "Safety footwear (slip-resistant, closed-toe)", "Any comfortable sneakers", "Steel-toed boots only"], c: 1 },
  { q: "What should you do if you find a leaking or damaged product?", a: ["Ignore it and keep working", "Clean it up yourself without PPE", "Stop, do not touch it, and use the Andon to alert leadership", "Put it back on the shelf"], c: 2 },
  { q: "What does 'STF' stand for in safety?", a: ["Standard Task Function", "Slip, Trip, Fall", "Safety Training Form", "Shift Transfer Form"], c: 1 },
  { q: "What is the 'Power Zone' for lifting?", a: ["The area near electrical panels", "The zone between your mid-thigh and mid-chest where lifting is safest", "The highest shelf on a rack", "The area closest to the conveyor belt"], c: 1 },
  { q: "What is the first thing you should do if you get hurt at work?", a: ["Post about it on social media", "Wait until your next break to tell someone", "Report it immediately to your manager or AM", "Go home and rest"], c: 2 },
  { q: "What does MSD stand for?", a: ["Material Safety Document", "Musculoskeletal Disorder", "Machine Safety Deficiency", "Management Safety Directive"], c: 1 },
  { q: "When lifting a box from the floor, what is the correct body position?", a: ["Bend at the waist with straight legs", "Bend your knees, keep your back straight, and lift with your legs", "Twist your body to grab the item quickly", "Reach as far as possible to avoid stepping closer"], c: 1 },
  { q: "What does a red floor marking or red tape typically indicate?", a: ["Pedestrian walkway", "Hazard zone, danger, or fire equipment location", "Storage area for totes", "Break area boundary"], c: 1 },
  { q: "When working near PIT equipment, what PPE is required?", a: ["Hard hat only", "High-visibility safety vest", "Ear plugs", "Safety goggles"], c: 1 },
  { q: "What is the purpose of a PMV (Process Method Visual)?", a: ["To track associate productivity", "To provide visual step-by-step instructions for safe standard work", "To display break schedules", "To show building evacuation routes"], c: 1 },
  { q: "What is the primary purpose of machine guarding on conveyors?", a: ["To keep packages from falling off", "To prevent associates from contacting moving parts (pinch points)", "To reduce noise levels", "To improve package flow"], c: 1 },
  { q: "What should you do if you notice peeling or damaged 5S tape on the floor?", a: ["Ignore it — maintenance will find it eventually", "Report it as a hazard because it can cause a trip/fall", "Peel it off yourself", "Cover it with a box"], c: 1 },
  { q: "What should a PIT operator do when approaching a crosswalk?", a: ["Speed up to clear the area quickly", "Honk the horn and keep going", "Stop, observe surroundings, and give pedestrians the right of way", "Flash the lights and proceed"], c: 2 },
  { q: "You're picking items from a tote below your knee level. What should you do?", a: ["Bend at the waist and reach down quickly", "Use a staggered stance, bend your knees, and bring the item into your power zone", "Ask someone else to do it", "Lift with one hand to save time"], c: 1 },
  { q: "What is the main reason repetitive motion injuries happen in pick and pack?", a: ["Associates don't drink enough water", "Frequent lifting/lowering and gripping outside the power zone combined with awkward postures", "The building is too cold", "Associates work too few hours"], c: 1 },
  { q: "An associate feels a sharp pain in their back while lifting. What should they do FIRST?", a: ["Finish the task and report it at end of shift", "Stop the task immediately and report the injury to their manager/AM right away", "Take ibuprofen and keep working", "Switch to a different station without telling anyone"], c: 1 },
  { q: "Why is it important to report even minor injuries or near misses?", a: ["So you can leave work early", "It helps identify hazards before they cause a serious injury and creates a record for your protection", "It's only important for recordable injuries", "It doesn't matter unless you need medical treatment"], c: 1 },
  { q: "You notice a coworker lifting with their back bent and legs straight. What's the best action?", a: ["Mind your own business", "Politely coach them on proper lifting technique or alert your AM/WHSS", "Report them to HR immediately", "Start doing it the same way so you match their pace"], c: 1 },
  { q: "What is the purpose of job rotation in physically demanding process paths?", a: ["To confuse associates", "To reduce cumulative strain on the same muscle groups and provide recovery time", "To increase productivity metrics", "To punish underperformers"], c: 1 },
  { q: "What is the weight limit for a single person to carry without mechanical assistance?", a: ["75 lbs", "50 lbs", "100 lbs", "35 lbs"], c: 1 },
  { q: "What is the correct way to handle a box that is too heavy or awkward to lift alone?", a: ["Try harder and use momentum", "Drag it across the floor", "Ask for a team lift or use mechanical assistance (dolly, cart, EPJ)", "Lift it above your head to get better leverage"], c: 2 },
  { q: "What information should you provide when reporting a workplace injury?", a: ["Just your name", "Your name, what happened, where it happened, when it happened, and what body part is affected", "Only the date", "Nothing — your manager will figure it out"], c: 1 },
  // Additional questions
  { q: "What should you do before entering a PIT operating area as a pedestrian?", a: ["Just walk in carefully", "Make eye contact with the operator and wait for acknowledgment", "Wave your hand and enter", "Enter only from the left side"], c: 1 },
  { q: "What is the correct action if you see a blocked emergency exit?", a: ["Use a different exit if there's a fire", "Report it immediately — exits must remain clear at all times", "Move the obstruction yourself even if it's heavy", "Ignore it since fires rarely happen"], c: 1 },
  { q: "How far should you stay from the edge of a loading dock?", a: ["No specific distance required", "At least 6 feet unless protected by a barrier or performing dock work", "1 foot is fine", "Only matters when trucks are present"], c: 1 },
  { q: "What is the safest way to carry a box with limited visibility?", a: ["Peek around the side while walking fast", "Use a cart, or ask for help so you can see your path clearly", "Walk backwards", "Carry it above your head"], c: 1 },
  { q: "What does LOTO stand for?", a: ["Lock Out Tag Out — used to secure equipment during maintenance", "Lights Out Turn Off — used during evacuations", "Load Out Transfer Order — used for shipping", "Log Out Time Off — used for breaks"], c: 0 },
];

const HAZARD_TYPES = [
  { name: "Wet Floor", emoji: "💧", color: "#3498db", sprite: "hazard-wetfloor" },
  { name: "Electrical", emoji: "⚡", color: "#f1c40f", sprite: "hazard-electrical" },
  { name: "Chemical Spill", emoji: "☣️", color: "#2ecc71", sprite: "hazard-chemical" },
  { name: "Fire", emoji: "🔥", color: "#e74c3c", sprite: "hazard-fire" },
];

const POWERUP_TYPES = [
  { name: "Hard Hat", emoji: "⛑️", color: "#f39c12", effect: "shield", sprite: "powerup-hardhat" },
  { name: "Safety Boots", emoji: "🥾", color: "#2980b9", effect: "doublejump", sprite: "powerup-boots" },
  { name: "First Aid", emoji: "🩹", color: "#e74c3c", effect: "heal", sprite: "powerup-bandage" },
  { name: "Safety Vest", emoji: "🦺", color: "#e67e22", effect: "points", sprite: "powerup-vest" },
  { name: "Gloves", emoji: "🧤", color: "#8e44ad", effect: "magnet", sprite: "powerup-gloves" },
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
  "hazard-wetfloor": { src: "sprites/hazard-wetfloor.png", cols: 1, rows: 1, fw: 120, fh: 120, frames: 1, drawH: 140, offsetY: 67 },
  "hazard-fire": { src: "sprites/Fire Hazard.png", cols: 8, rows: 1, fw: 32, fh: 48, frames: 8, drawH: 91, offsetY: 5, noFlip: true },
  "hazard-electrical": { src: "sprites/hazard-electrical.png", cols: 3, rows: 3, fw: 120, fh: 120, frames: 9, drawH: 90, offsetY: 5, noFlip: true },
  "hazard-chemical": { src: "sprites/hazard-chemical.png", cols: 1, rows: 1, fw: 791, fh: 791, frames: 1, drawH: 110, offsetY: 58, noFlip: true },
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
  raisedPlat3: "Raised platform 3",
  raisedPlat4: "Raised Platform 4",
  raisedPlatDouble: "Raised Platform Double",
  railing: "Railing medium",
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

// Background images
const bgWallImg = new Image();
bgWallImg.src = "backgrounds/Warehouse wall B-1.png (1).png";
const bgRackImg = new Image();
bgRackImg.src = "sprites/Racking A-1.png.png";

// Guru sprites
const guruImg = new Image();
guruImg.src = "sprites/Guru.png";
const guruShopImg = new Image();
guruShopImg.src = "sprites/Guru Shop.png";

// Money sprite (animated, 6 frames, 24x24 each)
const moneyImg = new Image();
moneyImg.src = "sprites/Objects/Money.png";

// Drone sprites
const droneWithBoxImg = new Image();
droneWithBoxImg.src = "sprites/Objects/Forward with box.png";
const droneEmptyImg = new Image();
droneEmptyImg.src = "sprites/Objects/Forward empty.png";
const amazonBoxImg = new Image();
amazonBoxImg.src = "sprites/Objects/Amazon Box.png";

// Box stack parallax sprites
const boxStack1 = new Image();
boxStack1.src = "sprites/Objects/Boxes-removebg-preview.png";
const boxStack2 = new Image();
boxStack2.src = "sprites/Objects/Boxes_2-removebg-preview.png";

// Closest background layer
const boxBG2 = new Image();
boxBG2.src = "sprites/Objects/Box BG2.png";

// HUD frame
const uiFrameImg = new Image();
uiFrameImg.src = "sprites/UI Frame A.png";

// Checkpoint sprites
const checkpointAImg = new Image();
checkpointAImg.src = "sprites/Objects/Checkpoint A.png";
const checkpointBImg = new Image();
checkpointBImg.src = "sprites/Objects/Checkpoint B.png";
const checkpointFlashImg = new Image();
checkpointFlashImg.src = "sprites/Objects/Checkpoint flash.png";

// Power-up sprites
const powerupSprites = {};
const POWERUP_SPRITE_MAP = {
  "powerup-hardhat": "sprites/Objects/Hard hat.png",
  "powerup-boots": "sprites/Objects/Boots.png",
  "powerup-vest": "sprites/Objects/Vest.png",
  "powerup-gloves": "sprites/Objects/Gloves.png",
  "powerup-bandage": "sprites/Objects/Bandage.png",
};
for (const [key, src] of Object.entries(POWERUP_SPRITE_MAP)) {
  const img = new Image(); img.src = src; powerupSprites[key] = img;
}

// PIT crossing sprites
const crossingBeamImg = new Image();
crossingBeamImg.src = "sprites/Objects/Crossing Beam.png";
const pitVehicleImg = new Image();
pitVehicleImg.src = "sprites/Objects/PIT.png";
const aSafeImg = new Image();
aSafeImg.src = "sprites/Objects/A-safe.png";

// Conveyor sprites (8 frames, 97x23 each, vertical sheet)
const conveyLeftImg = new Image();
conveyLeftImg.src = "sprites/Objects/Conveyer levels/conveyance left.png";
const conveyRightImg = new Image();
conveyRightImg.src = "sprites/Objects/Conveyer levels/Conveyance right.png";

// Direction post sprites
const postLeftImg = new Image();
postLeftImg.src = "sprites/Objects/Post left.png";
const postRightImg = new Image();
postRightImg.src = "sprites/Objects/Post right.png";

// Elevated conveyor sprite (3 frames, 291x120 each, vertical sheet)
const elevConveyImg = new Image();
elevConveyImg.src = "sprites/Objects/Conveyer levels/Elevated Conveyance Right.png";

// Robot sprites (5 frames per direction, 64x128)
// 0=stationary, 1=start moving, 2-3=moving cycle, 4=stopping
const robotLeftFrames = [];
const robotRightFrames = [];
for (let i = 0; i < 5; i++) {
  const l = new Image(); l.src = "sprites/Objects/Robot left " + i + ".png"; robotLeftFrames.push(l);
  const r = new Image(); r.src = "sprites/Objects/Robot Right " + i + ".png"; robotRightFrames.push(r);
}

// ── Sound ──
const SFX = {};
function loadSound(name, src, vol) {
  const a = new Audio(src);
  a.volume = vol || 0.5;
  SFX[name] = a;
}
function playSound(name) {
  const s = SFX[name];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}
loadSound("coin", "sounds/Coin.wav", 0.4);
loadSound("hit", "sounds/Hit.ogg", 0.6);
loadSound("powerup", "sounds/Power up.wav", 0.5);
loadSound("correct", "sounds/correct.wav", 0.5);
loadSound("wrong", "sounds/wrong.mp3", 0.5);
loadSound("crash", "sounds/crash.wav", 0.4);
loadSound("levelcomplete", "sounds/Level complete.wav", 0.6);
loadSound("gameover", "sounds/game over.wav", 0.6);
loadSound("jump", "sounds/Jump.wav", 0.4);

// Background music
const bgMusic = new Audio("sounds/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Menu music
const menuMusic = new Audio("Title screen/backgroundmusicmaster-gamer-menu-431351.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.3;

// Start menu music on first user interaction (browser requires this)
document.getElementById("lets-play-btn").addEventListener("click", () => {
  document.getElementById("splash-screen").classList.add("hidden");
  screens.menu.classList.remove("hidden");
  gameState = "menu";
  menuMusic.play().catch(() => {});
});

// ── State ──
let gameState = "menu";
let player, platforms, hazards, powerups, coins, particles, questionTriggers, fallingBoxes, railings;
let score, lives, level, cameraX, playerName, activeEffects, usedQuestions;
let eswag = 0; // E-Swag Bucks currency (from collecting money pickups)
let currentQuestion = null;
let lastBoxSpawn = 0;
let lastDroneSpawn = 0;
let drones = []; // { x, y, targetX, state: "carrying"|"warning"|"dropping"|"leaving", warning, box: {x,y,vy} }
let robots = []; // { x, y, w, h, facing, speed, originX, patrolRange, animTimer }
let pitfalls = [];
let checkpoint = null; // { x, y, activated, flashTimer }
let conveyors = []; // { x, y, w, h, dir } — dir: 1=right, -1=left
let conveyorDir = 1; // current global direction
let conveyorTimer = 0; // ticks since last flip
let conveyorAnimTimer = 0;
let goalZooming = false, goalZoomTimer = 0, goalZoomScale = 1, goalTarget = null, goalZoomCamX = 0;

// ── Shop State ──
let guruNPC = null; // { x, y, w, h } placed in level
let shopOpen = false;
let shopSlideX = -400; // guru shop sprite slides in from left
let shopSelection = 0;
let shopVisitedThisLevel = false;
const SHOP_UPGRADES = [
  { name: "Steel Boots",   desc: "Permanent double jump",    cost: 150, effect: "permDoubleJump", icon: "🥾" },
  { name: "Hard Hat+",     desc: "Start each level shielded", cost: 200, effect: "permShield",     icon: "⛑️" },
  { name: "Magnet Gloves", desc: "Wider coin pickup range",   cost: 100, effect: "permMagnet",     icon: "🧲" },
  { name: "Extra Life",    desc: "+1 life",                   cost: 120, effect: "extraLife",       icon: "❤️" },
  { name: "Safety Vest+",  desc: "2× coin value",             cost: 250, effect: "permDoubleCoins", icon: "🦺" },
];
let purchasedUpgrades = {}; // { effect: true }
const keys = {};

// ── UI ──
const screens = {
  splash: document.getElementById("splash-screen"),
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
  // Menu music
  if (name === "menu" || name === "leaderboard") {
    menuMusic.play().catch(() => {});
  } else {
    menuMusic.pause();
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
  if (gameState === "shop") {
    if (e.code === "ArrowUp") shopSelection = (shopSelection - 1 + SHOP_UPGRADES.length) % SHOP_UPGRADES.length;
    if (e.code === "ArrowDown") shopSelection = (shopSelection + 1) % SHOP_UPGRADES.length;
    if (e.code === "Enter" || e.code === "Space") purchaseUpgrade();
    if (e.code === "Escape") { gameState = "playing"; Object.keys(keys).forEach(k => keys[k] = false); }
  }
  if (gameState === "question") {
    const numAnswers = currentQuestion ? currentQuestion.answers.length : 4;
    if (e.code === "ArrowUp" || e.code === "KeyW") { questionSelection = (questionSelection - 1 + numAnswers) % numAnswers; highlightAnswer(); }
    if (e.code === "ArrowDown" || e.code === "KeyS") { questionSelection = (questionSelection + 1) % numAnswers; highlightAnswer(); }
    if (e.code === "Enter" || e.code === "Space") submitAnswer(questionSelection);
  }
});
document.addEventListener("keyup", e => keys[e.code] = false);

document.getElementById("start-btn").addEventListener("click", () => startGame());
document.getElementById("restart-btn").addEventListener("click", () => startGame());
document.getElementById("leaderboard-btn").addEventListener("click", () => renderLeaderboard());
document.getElementById("go-leaderboard-btn").addEventListener("click", () => renderLeaderboard());
document.getElementById("go-menu-btn").addEventListener("click", () => showScreen("menu"));
document.getElementById("back-btn").addEventListener("click", () => showScreen("menu"));

// Level select
document.getElementById("level-select-btn").addEventListener("click", () => {
  const ls = document.getElementById("level-select");
  ls.style.display = ls.style.display === "none" ? "flex" : "none";
});
document.querySelectorAll(".lvl-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("lvl-locked")) return;
    const lvl = parseInt(btn.dataset.lvl);
    startGame(lvl);
  });
});

// ── Level Generation ──
// Jump: vy=-11.9, gravity=0.48. Max height ~147px, max horizontal ~248px.
const MAX_STEP = 120; // max height difference between platforms (with margin)
const MAX_GAP = 180;  // max pitfall width player can jump across

// ── Seeded Random ──
let seed = 1;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function generateLevel(lvl) {
  seed = lvl * 7919; // deterministic seed per level
  platforms = []; hazards = []; powerups = []; coins = []; questionTriggers = []; fallingBoxes = []; railings = []; drones = []; robots = []; conveyors = [];
  const groundY = H - 40;
  const levelWidth = 3000 + lvl * 1000;

  // Filter hazard types by level
  const levelHazards = lvl >= 4
    ? []
    : HAZARD_TYPES;

  const goalX = levelWidth - 100;

  // Ground segments — gaps limited to jumpable width
  let lastGroundEnd = 0;
  for (let x = 0; x < levelWidth; x += 200) {
    if (x < 400 || seededRandom() > 0.15) {
      // Check if gap since last ground is too wide
      if (x - lastGroundEnd > MAX_GAP) {
        // Fill in ground to keep gap jumpable
        platforms.push({ x: lastGroundEnd, y: groundY, w: x - lastGroundEnd, h: 40, type: "ground" });
      }
      platforms.push({ x, y: groundY, w: 200, h: 40, type: "ground" });
      lastGroundEnd = x + 200;
    }
  }
  // Ensure no trailing gap too wide before goal
  if (levelWidth - lastGroundEnd > MAX_GAP) {
    platforms.push({ x: lastGroundEnd, y: groundY, w: 200, h: 40, type: "ground" });
  }

  // Level-specific pitfalls — carve before spawning objects
  pitfalls = [];
  if (lvl === 1) {
    pitfalls = [[960, 1100], [1250, 1400]];
  } else if (lvl === 4) {
    pitfalls = [[800, 960], [1200, 1380], [1700, 1860], [2400, 2580]];
  } else if (lvl === 5) {
    pitfalls = [[700, 880], [1100, 1300], [1600, 1780], [2100, 2300], [2700, 2880]];
  } else if (lvl >= 6) {
    // Auto-generate pitfalls for higher levels
    for (let px = 600; px < levelWidth - 400; px += 400 + Math.floor(seededRandom() * 300)) {
      const gapW = 120 + Math.floor(seededRandom() * 60);
      pitfalls.push([px, px + gapW]);
      px += gapW;
    }
  }
  for (const [gapStart, gapEnd] of pitfalls) {
    platforms = platforms.filter(p => {
      if (p.type !== "ground") return true;
      if (p.x >= gapStart && p.x + p.w <= gapEnd) return false;
      if (p.x < gapStart && p.x + p.w > gapStart) { p.w = gapStart - p.x; }
      if (p.x < gapEnd && p.x + p.w > gapEnd) { const oldEnd = p.x + p.w; p.x = gapEnd; p.w = oldEnd - gapEnd; }
      return true;
    });
  }

  // Helper: check if x position has ground beneath it
  const grounds = platforms.filter(p => p.type === "ground");
  function hasGround(x) {
    return grounds.some(p => x >= p.x && x + 30 <= p.x + p.w);
  }

  // Helper: check if x range overlaps any pitfall
  function overPitfall(x, w) {
    return pitfalls.some(([gs, ge]) => x + w > gs && x < ge);
  }

  // Helper: check if position overlaps any placed object
  const placedObjects = [];
  const MIN_SPACING = 100;
  function tooClose(x) {
    return placedObjects.some(px => Math.abs(px - x) < MIN_SPACING);
  }
  function placeAt(x) { placedObjects.push(x); }

  // Floating platforms — all reachable from ground with a single jump
  let lastY = groundY;
  for (let x = 300; x < goalX - 150; x += 120 + seededRandom() * 160) {
    const w = 80 + seededRandom() * 80;
    if (!hasGround(x) || !hasGround(x + w - 30) || overPitfall(x, w)) { continue; }
    const dir = seededRandom() < 0.6 ? -1 : 1;
    let y = lastY + dir * (40 + seededRandom() * (MAX_STEP - 40));
    y = Math.max(groundY - MAX_STEP, Math.min(groundY - 60, y));
    if (lastY - y > MAX_STEP) y = lastY - MAX_STEP;
    platforms.push({ x, y, w, h: 16, type: "float" });
    if (seededRandom() > 0.4) {
      coins.push({ x: x + w / 2 - 8, y: y - 43, w: 22, h: 22, collected: false, bob: 0 });
    } else if (levelHazards.length > 0 && seededRandom() < 0.3 && !tooClose(x + w / 2)) {
      const ht = levelHazards[Math.floor(seededRandom() * levelHazards.length)];
      hazards.push({ x: x + w / 2 - 20, y: y - 58, w: 40, h: 40, type: ht, timer: seededRandom() * 6 });
      placeAt(x + w / 2);
    }
    lastY = y;
    if (seededRandom() < 0.3) lastY = groundY;
  }

  // Railings — spawn first so hazards avoid them
  railings = [];
  for (let x = 300; x < goalX - 200; x += 300 + seededRandom() * 400) {
    if (!hasGround(x) || tooClose(x) || overPitfall(x, 200)) continue;
    const count = 1 + Math.floor(seededRandom() * 3);
    railings.push({ x, y: groundY, count });
    placeAt(x);
  }

  // Hazards on ground — also check not near pitfall edges
  if (levelHazards.length > 0) {
    for (let x = 500; x < goalX - 100; x += 200 + seededRandom() * 300) {
      if (!hasGround(x) || !hasGround(x + 60) || tooClose(x) || overPitfall(x, 60)) continue;
      const ht = levelHazards[Math.floor(seededRandom() * levelHazards.length)];
      const h = { x, y: groundY - 42, w: 40, h: 40, type: ht, timer: seededRandom() * 6, facing: 1 };
      if (ht.patrols) {
        h.originX = x;
        h.patrolRange = 60 + seededRandom() * 60;
        h.patrolSpeed = 0.5 + seededRandom() * 0.5;
      }
      hazards.push(h);
      placeAt(x);
    }
  }

  // Power-ups — only on solid ground or above floating platforms, not over pitfalls
  const floats = platforms.filter(p => p.type === "float");
  for (let x = 400; x < goalX - 100; x += 400 + seededRandom() * 400) {
    if (tooClose(x)) continue;
    // Must have ground or a nearby float platform
    const nearFloat = floats.find(f => Math.abs(f.x + f.w / 2 - x) < 80);
    if (!hasGround(x) && !nearFloat) continue;
    const pt = POWERUP_TYPES[Math.floor(seededRandom() * POWERUP_TYPES.length)];
    let anchorY = groundY;
    if (nearFloat) anchorY = nearFloat.y;
    const py = anchorY - 30 - seededRandom() * 40;
    powerups.push({ x, y: Math.max(40, py), w: 36, h: 36, type: pt, collected: false, bob: seededRandom() * Math.PI * 2 });
    placeAt(x);
  }

  // Question triggers
  if (lvl >= 4 && pitfalls.length > 0) {
    // Place at landing edges of pitfalls — unavoidable
    for (const [gapStart, gapEnd] of pitfalls) {
      // Find ground right after the gap
      const landingGround = platforms.find(p => p.type === "ground" && p.x <= gapEnd + 10 && p.x + p.w > gapEnd);
      if (landingGround) {
        const qx = gapEnd + 5;
        questionTriggers.push({ x: qx, y: groundY - 50, w: 46, h: 46, used: false });
        placeAt(qx);
      }
    }
  } else {
    for (let x = 600; x < goalX - 100; x += 500 + seededRandom() * 400) {
      if (!hasGround(x) || tooClose(x)) continue;
      questionTriggers.push({ x, y: groundY - 50, w: 46, h: 46, used: false });
      placeAt(x);
    }
  }

  // Roaming robots — level 4+
  if (lvl >= 4) {
    // Hand-placed robot after pitfall 3 on level 4
    if (lvl === 4) {
      robots.push({ x: 1900, y: groundY - 70, w: 64, h: 70, facing: -1, speed: 1.5, originX: 1900, patrolRange: 120, animTimer: 0, animState: "idle", stateTimer: 0 });
    }

    const robotCount = 3 + Math.floor((lvl - 4) * 1.5);
    let placed = 0;
    for (let i = 0; i < robotCount * 5 && placed < robotCount; i++) {
      const rx = 500 + Math.floor(seededRandom() * (goalX - 700));
      if (!hasGround(rx) || !hasGround(rx + 64) || overPitfall(rx, 64)) continue;
      // Only check distance from other robots, not all objects
      if (robots.some(r => Math.abs(r.x - rx) < 200)) continue;
      const facing = seededRandom() < 0.5 ? -1 : 1;
      const range = 150 + Math.floor(seededRandom() * 200);
      const spd = 1 + seededRandom() * 1.5;
      robots.push({ x: rx, y: groundY - 70, w: 64, h: 70, facing, speed: spd, originX: rx, patrolRange: range, animTimer: 0, animState: "idle", stateTimer: 0 });
      placed++;
    }

    // Remove floating platforms that overlap robot patrol paths
    platforms = platforms.filter(p => {
      if (p.type !== "float") return true;
      for (const r of robots) {
        const patrolLeft = r.originX - r.patrolRange - 30;
        const patrolRight = r.originX + r.patrolRange + 30;
        if (p.x + p.w > patrolLeft && p.x < patrolRight) return false;
      }
      return true;
    });
  }

  // Checkpoint at middle of level
  const midX = Math.floor(goalX / 2);
  // Find nearest ground position to midpoint
  let cpX = midX;
  for (let dx = 0; dx < 300; dx += 10) {
    if (hasGround(midX + dx) && !overPitfall(midX + dx, 32)) { cpX = midX + dx; break; }
    if (hasGround(midX - dx) && !overPitfall(midX - dx, 32)) { cpX = midX - dx; break; }
  }
  checkpoint = { x: cpX, y: groundY - 83, w: 48, h: 60, activated: false, flashTimer: 0 };

  // Conveyor levels (6-8) — conveyors sit on top of ground tiles
  if (lvl >= 6 && lvl <= 8) {
    conveyorDir = 1;
    conveyorTimer = 0;
    // Remove everything except ground and goal
    platforms = platforms.filter(p => p.type === "ground" || p.type === "goal");
    hazards = []; powerups = []; coins = []; questionTriggers = []; railings = []; robots = [];

    // First conveyor — elevated in front of player start, must jump to reach
    const firstConvX = 200;
    const firstConvW = 291;
    const firstConvY = groundY - 120;    conveyors.push({ x: firstConvX, y: firstConvY, w: firstConvW, h: 23, elevated: true });
    platforms.push({ x: firstConvX, y: firstConvY + 15, w: firstConvW, h: 23, type: "float" });

    // Ground-level conveyors on ALL ground platforms
    for (const p of platforms) {
      if (p.type === "ground" && p.w >= 97) {
        if (overPitfall(p.x, p.w)) continue;
        conveyors.push({ x: p.x, y: p.y - 23, w: p.w, h: 23 });
        p.y -= 23;
      }
    }

    // Elevated conveyors throughout the level
    const elevCount = 10 + lvl;
    let lastFx = firstConvX + firstConvW + 100;
    for (let i = 0; i < elevCount * 3; i++) {
      if (conveyors.filter(c => c.elevated).length >= elevCount) break;
      const fx = lastFx + 100 + Math.floor(seededRandom() * 200);
      if (fx > goalX - 300) break;
      const fw = 291;
      const fy = groundY - 120;
      if (overPitfall(fx + fw / 2, 50)) { lastFx = fx + 100; continue; }
      conveyors.push({ x: fx, y: fy, w: fw, h: 23, elevated: true });
      platforms.push({ x: fx, y: fy + 15, w: fw, h: 23, type: "float" });
      lastFx = fx + fw;
    }
  }

  // Manager goal — ensure ground exists beneath
  if (!hasGround(goalX)) {
    platforms.push({ x: goalX - 50, y: groundY, w: 200, h: 40, type: "ground" });
  }
  platforms.push({ x: goalX, y: groundY - 60, w: 60, h: 60, type: "goal" });

  // Guru NPC at start of level 4+
  guruNPC = null;
  shopVisitedThisLevel = false;
  if (lvl >= 4 && (lvl - 4) % 3 === 0) {
    guruNPC = { x: 180, y: groundY - 80, w: 50, h: 80 };
  }
}

// ── Start Game ──
function startGame(startLevel) {
  bgCanvas = null;
  playerName = document.getElementById("player-name").value.trim() || "Player";
  score = 0; lives = 3; level = (typeof startLevel === "number") ? startLevel : 1; cameraX = 0; eswag = 0;
  activeEffects = {}; usedQuestions = new Set(); particles = [];
  purchasedUpgrades = {};
  player = { x: 50, y: H - 160, w: 40, h: 72, vx: 0, vy: 0, onGround: false, facing: 1, shielded: false, frame: 0 };
  lastBoxSpawn = 0;
  lastDroneSpawn = 0;
  conveyorDir = 1; conveyorTimer = 0; conveyorAnimTimer = 0;
  goalZooming = false; goalZoomTimer = 0; goalZoomScale = 1; goalTarget = null; goalZoomCamX = 0;
  generateLevel(level);
  showScreen("playing");
  bgMusic.currentTime = 0;
  menuMusic.pause(); menuMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
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
      player.canDoubleJump = !!(activeEffects.doublejump || purchasedUpgrades.permDoubleJump);
      playSound("jump");
    } else if (player.canDoubleJump) {
      player.vy = -10;
      player.canDoubleJump = false;
      playSound("jump");
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
      // Zoom-in approach when near goal
      const dist = Math.abs((player.x + player.w / 2) - (p.x + p.w / 2));
      if (dist < 150 && !goalZooming) {
        goalZooming = true;
        goalZoomTimer = 0;
        goalTarget = p;
      }
      if (overlap(player, p)) { goalZooming = false; goalZoomScale = 1; nextLevel(); return; }
      continue;
    }
    const collideY = p.type === "float" ? p.y - 18 : p.y;
    if (player.vy >= 0 &&
        player.x + player.w > p.x && player.x < p.x + p.w &&
        player.y + player.h >= collideY && player.y + player.h <= collideY + 14 + player.vy) {
      player.y = collideY - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // Fall death
  if (player.y > H + 50) { loseLife("pitfall"); return; }

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
  const magnetRange = purchasedUpgrades.permMagnet ? 60 : 0;
  for (const c of coins) {
    if (c.collected) continue;
    const inRange = magnetRange > 0 && Math.abs(player.x - c.x) < magnetRange && Math.abs(player.y - c.y) < magnetRange;
    if (overlap(player, c) || inRange) {
      c.collected = true; eswag += purchasedUpgrades.permDoubleCoins ? 20 : 10;
      burst(c.x, c.y, "#f1c40f", 5);
      playSound("coin");
    }
  }

  // Power-up pickup
  for (const p of powerups) {
    p.bob += 0.05;
    if (!p.collected && overlap(player, p)) {
      p.collected = true;
      applyPowerup(p.type);
      burst(p.x, p.y, p.type.color, 8);
      playSound("powerup");
    }
  }

  // Guru NPC — open shop on contact
  if (guruNPC && !shopVisitedThisLevel && overlap(player, guruNPC)) {
    shopOpen = true;
    shopVisitedThisLevel = true;
    shopSlideX = -400;
    shopSelection = 0;
    gameState = "shop";
    return; // stop update while shop opens
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
        playSound("hit");
      } else { playSound("hit"); loseLife(h.type.name === "Fire" ? "fire" : h.type.name === "Electrical" ? "electrical" : h.type.name === "Chemical Spill" ? "chemical" : "wetfloor"); return; }
    }
  }

  // Question triggers
  for (const qt of questionTriggers) {
    if (!qt.used && overlap(player, qt)) {
      qt.used = true;
      triggerQuestion();
    }
  }

  // Falling boxes — spawn rate increases with level (levels 1-3 only)
  if (level < 4) {
    const spawnInterval = Math.max(400, 2000 - level * 200);
    if (now - lastBoxSpawn > spawnInterval) {
      lastBoxSpawn = now;
      const bx = player.x - 100 + Math.random() * (W + 200);
      const speed = 1.5 + Math.random() * 1.5 + level * 0.3;
      const boxSprites = ["Box1", "Box3", "Box4"];
      const boxSpr = boxSprites[Math.floor(Math.random() * boxSprites.length)];
      fallingBoxes.push({ x: bx, y: 40, w: 34, h: 34, vy: 0, dropSpeed: speed, warning: 60, sprite: boxSpr });
    }
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
    // Land on platform — check before player hit
    let boxLanded = false;
    for (const p of platforms) {
      if (p.type === "goal") continue;
      if (b.vy > 0 && b.x + b.w > p.x && b.x < p.x + p.w &&
          b.y + b.h >= p.y && b.y + b.h <= p.y + 16 + b.vy) {
        burst(b.x, b.y, "#e67e22", 4);
        fallingBoxes.splice(i, 1);
        boxLanded = true;
        break;
      }
    }
    if (boxLanded) continue;
    // Hit player (only if no platform between box and player)
    if (overlap(player, b)) {
      // Check if there's a platform between the box and player (player is sheltered)
      let blocked = false;
      for (const p of platforms) {
        if (p.type === "goal") continue;
        // Platform is above player and below box, and overlaps horizontally
        if (b.x + b.w > p.x && b.x < p.x + p.w && p.y <= player.y && p.y >= b.y + b.h) {
          blocked = true; break;
        }
      }
      if (!blocked) {
        fallingBoxes.splice(i, 1);
        if (player.shielded) {
          player.shielded = false;
          burst(b.x, b.y, "#e67e22", 6);
          score += 25;
          playSound("hit");
        } else { playSound("hit"); loseLife("fallingBox"); return; }
      }
    }
    // Early crash sound when box is close to landing
    if (!b.crashPlayed && b.vy > 0) {
      for (const p of platforms) {
        if (p.type === "goal") continue;
        if (b.x + b.w > p.x && b.x < p.x + p.w && b.y + b.h >= p.y - 30 && b.y + b.h < p.y) {
          playSound("crash");
          b.crashPlayed = true;
          break;
        }
      }
    }
  }

  // Drone hazard — level 4+
  if (level >= 4) {
    const droneInterval = Math.max(500, 2500 - level * 150);
    if (now - lastDroneSpawn > droneInterval) {
      lastDroneSpawn = now;
      const targetX = player.x + player.w / 2 + player.vx * 40; // predict ahead based on velocity
      drones.push({
        x: cameraX + W + 60, y: 50 + Math.random() * 30,
        targetX: targetX, state: "carrying", warning: 0,
        animTimer: 0, droneSpeed: 4,
        box: null
      });
    }

    for (let i = drones.length - 1; i >= 0; i--) {
      const d = drones[i];
      d.animTimer += 0.15;

      if (d.state === "carrying") {
        // Continuously update target to lead the player
        const playerMoving = Math.abs(player.vx) > 0.5;
        d.targetX = player.x + player.w / 2 + player.vx * 30;
        d.x -= d.droneSpeed;

        if (d.x <= d.targetX + 20) {
          if (playerMoving) {
            // Player is moving — drop immediately without stopping
            d.box = { x: d.x + 10, y: d.y + 40, w: 34, h: 22, vy: 1.5, vx: -d.droneSpeed * 0.5, crashPlayed: false };
            d.state = "dropping";
          } else {
            // Player stopped — hover and warn
            d.state = "warning";
            d.warning = 45;
          }
        }
      } else if (d.state === "warning") {
        d.warning--;
        if (d.warning <= 0) {
          d.box = { x: d.x + 10, y: d.y + 40, w: 34, h: 22, vy: 1.5, vx: -1, crashPlayed: false };
          d.state = "dropping";
        }
      } else if (d.state === "dropping") {
        d.x -= 5;
        const b = d.box;
        b.vy += 0.12;
        b.y += b.vy;
        b.x += b.vx; // horizontal momentum
        // Hit player
        if (overlap(player, b)) {
          if (player.shielded) {
            player.shielded = false;
            burst(b.x, b.y, "#e67e22", 6);
            score += 25;
            playSound("hit");
          } else { playSound("hit"); loseLife("drone"); return; }
          d.state = "leaving";
        }
        // Crash sound near landing
        if (!b.crashPlayed && b.vy > 0) {
          for (const p of platforms) {
            if (p.type === "goal") continue;
            if (b.x + b.w > p.x && b.x < p.x + p.w && b.y + b.h >= p.y - 40 && b.y + b.h < p.y) {
              playSound("crash");
              b.crashPlayed = true;
              break;
            }
          }
        }
        // Land on platform or ground
        let landed = false;
        for (const p of platforms) {
          if (p.type === "goal") continue;
          if (b.vy > 0 && b.x + b.w > p.x && b.x < p.x + p.w &&
              b.y + b.h >= p.y && b.y + b.h <= p.y + 16 + b.vy) {
            burst(b.x, b.y, "#e67e22", 4);
            d.state = "leaving";
            landed = true;
            break;
          }
        }
        if (!landed && b.y > H + 40) d.state = "leaving";
      } else if (d.state === "leaving") {
        d.x -= 5;
      }

      // Remove when fully off screen left
      if (d.x < cameraX - 100) { drones.splice(i, 1); }
    }
  }

  // Roaming robots
  for (const r of robots) {
    r.stateTimer++;

    if (r.animState === "idle") {
      // Stationary for 2 frame-lengths (~30 ticks)
      if (r.stateTimer > 30) { r.animState = "starting"; r.stateTimer = 0; }
    } else if (r.animState === "starting") {
      // Transition frame 1
      r.x += r.speed * r.facing * 0.5;
      if (r.stateTimer > 10) { r.animState = "moving"; r.stateTimer = 0; }
    } else if (r.animState === "moving") {
      r.x += r.speed * r.facing;
      r.animTimer += 0.12;
      // Check patrol bounds or approaching pitfall
      const nextX = r.facing === 1 ? r.x + r.w : r.x;
      const nearPitfall = pitfalls.some(([gs, ge]) => nextX >= gs - 10 && nextX <= ge + 10);
      if (r.x > r.originX + r.patrolRange || r.x < r.originX - r.patrolRange || nearPitfall) {
        r.animState = "stopping"; r.stateTimer = 0;
      }
    } else if (r.animState === "stopping") {
      r.x += r.speed * r.facing * 0.3;
      if (r.stateTimer > 10) {
        r.facing *= -1;
        r.animState = "idle"; r.stateTimer = 0;
      }
    }

    // Hit player
    if (overlap(player, r)) {
      if (player.shielded) {
        player.shielded = false;
        burst(r.x, r.y, "#f1c40f", 6);
        score += 25;
        playSound("hit");
      } else { playSound("hit"); loseLife("robot"); return; }
    }
  }

  // Checkpoint
  if (checkpoint && !checkpoint.activated && overlap(player, checkpoint)) {
    checkpoint.activated = true;
    checkpoint.flashTimer = 30;
    score += 100;
    playSound("powerup");
  }
  if (checkpoint && checkpoint.flashTimer > 0) checkpoint.flashTimer--;

  // Conveyors — push/slow player, flip direction every 20 sec
  if (conveyors.length > 0) {
    conveyorTimer++;
    conveyorAnimTimer += 0.15;
    if (conveyorTimer >= 1200) {
      conveyorDir *= -1;
      conveyorTimer = 0;
    }
    // Apply conveyor force if player is on a conveyor
    if (player.onGround) {
      const playerFeet = player.y + player.h;
      for (const c of conveyors) {
        if (player.x + player.w > c.x && player.x < c.x + c.w &&
            Math.abs(playerFeet - c.y) < 35) {
          const pushSpeed = 2.5;
          let push = 0;
          if (Math.sign(player.vx) === conveyorDir || player.vx === 0) {
            push = pushSpeed * conveyorDir;
          } else {
            push = pushSpeed * conveyorDir * 0.4;
          }
          // Don't push player off the conveyor
          const newX = player.x + push;
          if (newX >= c.x - player.w && newX <= c.x + c.w) {
            player.x = newX;
          }
          break;
        }
      }
    }
  }

  // Expire effects
  for (const k of Object.keys(activeEffects)) {
    if (now > activeEffects[k]) delete activeEffects[k];
  }

  // Particles
  particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; return p.life > 0; });

  // Goal zoom-in sequence — zoom and hold, player must touch goal to advance
  if (goalZooming) {
    goalZoomTimer++;
    goalZoomScale = Math.min(1.5, 1 + goalZoomTimer * 0.005);
    // Lock camera once zoomed in
    if (goalZoomTimer > 90) goalZoomTimer = 90;
  }

  // HUD
  $score.textContent = "Score: " + score;
  document.getElementById("eswag-display").textContent = "E-Swag: $" + eswag;
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

// Death cause safety tips
const SAFETY_TIPS = {
  fallingBox: "When you see a falling box, don't try and catch it! Remember: Let it fall!",
  drone: "Always be aware of overhead operations. Stay clear of drop zones!",
  robot: "Never walk in front of moving equipment. Wait for it to pass or use designated crossings!",
  hazard: "Always watch for floor hazards. Report spills and obstructions immediately!",
  pitfall: "Stay away from unprotected edges. Always use designated walkways!",
  fire: "If you see a fire hazard, don't approach it. Pull the alarm and evacuate!",
  electrical: "Never touch exposed wiring or damaged equipment. Tag it out and report it!",
  chemical: "Don't handle chemical spills without proper PPE. Alert leadership immediately!",
  wetfloor: "Slow down on wet surfaces. Report spills right away to prevent slips!",
};
let lastDeathCause = "hazard";

function loseLife(cause) {
  lastDeathCause = cause || "hazard";
  lives--;
  if (lives <= 0) { gameOver(); return; }
  if (checkpoint && checkpoint.activated) {
    player.x = checkpoint.x; player.y = H - 150; player.vx = 0; player.vy = 0;
    cameraX = Math.max(0, checkpoint.x - W / 3);
  } else {
    player.x = 50; player.y = H - 160; player.vx = 0; player.vy = 0; cameraX = 0;
  }
  drones = []; fallingBoxes = [];
  for (const r of robots) { r.x = r.originX; r.facing = 1; r.animState = "idle"; r.stateTimer = 0; }
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
  playSound("levelcomplete");
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
  player.x = 50; player.y = H - 160; player.vx = 0; player.vy = 0; cameraX = 0;
  goalZooming = false; goalZoomTimer = 0; goalZoomScale = 1; goalTarget = null; goalZoomCamX = 0;
  generateLevel(level);
  applyPermanentUpgrades();
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
  bgMusic.pause();
  playSound("gameover");
  saveScore(playerName, score);
  // Show safety tip screen
  const tip = SAFETY_TIPS[lastDeathCause] || SAFETY_TIPS.hazard;
  const tipEl = document.getElementById("safety-tip-text");
  const scoreEl = document.getElementById("final-score");
  tipEl.textContent = tip;
  scoreEl.textContent = playerName + " scored " + score + " points on Level " + level + "!";
  showScreen("gameover");
  // After 5 seconds, show leaderboard
  setTimeout(() => renderLeaderboard(), 5000);
}

function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4, color, life: 20 + Math.random() * 15 });
  }
}

// ── Questions ──
let questionSelection = 0; // keyboard selection index for answers

function triggerQuestion() {
  let pool = QUESTIONS.filter((_, i) => !usedQuestions.has(i));
  if (!pool.length) { usedQuestions.clear(); pool = QUESTIONS; }
  const idx = QUESTIONS.indexOf(pool[Math.floor(Math.random() * pool.length)]);
  usedQuestions.add(idx);
  const q = QUESTIONS[idx];

  // Shuffle answers, track correct index
  const shuffled = q.a.map((text, i) => ({ text, correct: i === q.c }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  currentQuestion = { q: q.q, answers: shuffled };
  questionSelection = 0;

  document.getElementById("question-text").textContent = currentQuestion.q;
  const div = document.getElementById("answers");
  div.innerHTML = "";
  shuffled.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.textContent = item.text;
    btn.addEventListener("click", () => submitAnswer(i));
    div.appendChild(btn);
  });
  highlightAnswer();
  showScreen("question");
}

function highlightAnswer() {
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach((b, i) => {
    b.style.outline = i === questionSelection ? "3px solid #2ecc71" : "none";
    b.style.background = i === questionSelection ? "#1a4a6e" : "";
  });
}

function submitAnswer(idx) {
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);
  const chosen = currentQuestion.answers[idx];
  if (chosen.correct) {
    buttons[idx].classList.add("correct");
    score += 50;
    burst(player.x, player.y, "#2ecc71", 10);
    playSound("correct");
  } else {
    buttons[idx].classList.add("wrong");
    // Highlight the correct one
    currentQuestion.answers.forEach((a, i) => { if (a.correct) buttons[i].classList.add("correct"); });
    score = Math.max(0, score - 10);
    playSound("wrong");
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
  // Tile the cached wall with 0.1× parallax scroll
  const scrollX = -((cameraX * 0.1) % W + W) % W;
  ctx.drawImage(bgCanvas, scrollX, 0);
  ctx.drawImage(bgCanvas, scrollX + W, 0);
  return true;
}

function draw() {
  // Fill canvas to prevent transparency bleed-through
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, W, H);

  // Furthest background — warehouse wall (0.1× parallax)
  if (bgWallImg.complete && bgWallImg.naturalWidth) {
    const scrollX = -((cameraX * 0.1) % W + W) % W;
    ctx.drawImage(bgWallImg, scrollX, 0, W, H);
    ctx.drawImage(bgWallImg, scrollX + W, 0, W, H);
  } else {
    drawCachedBackground();
  }

  // Racking A (0.5× parallax — closest)
  if (bgRackImg.complete && bgRackImg.naturalWidth) {
    const rw = bgRackImg.naturalWidth * (H / bgRackImg.naturalHeight);
    const scrollX = -((cameraX * 0.5) % rw + rw) % rw;
    for (let x = scrollX; x < W; x += rw) {
      ctx.drawImage(bgRackImg, x, 210, rw, H - 210);
    }
  }

  ctx.save();
  if (goalZooming && goalTarget) {
    // Lock camera at zoom start, zoom from screen center anchored to ground
    if (!goalZoomCamX) goalZoomCamX = cameraX;
    const screenPlayerX = player.x - goalZoomCamX;
    const anchorX = screenPlayerX + player.w / 2;
    const anchorY = H - 40;
    ctx.translate(anchorX * (1 - goalZoomScale), anchorY * (1 - goalZoomScale));
    ctx.scale(goalZoomScale, goalZoomScale);
    ctx.translate(-goalZoomCamX, 0);
  } else {
    ctx.translate(-cameraX, 0);
  }

  // Platforms
  const ts = TILE_SIZE;

  // Pitfall depth fill
  const pitTile = tiles.wallSolid;
  if (pitTile) {
    const groundY = H - 40;
    const pitTop = groundY + 6;
    for (const [gs, ge] of pitfalls) {
      for (let x = gs; x < ge; x += ts) {
        const tw = Math.min(ts, ge - x);
        for (let y = pitTop; y < H; y += ts) {
          ctx.drawImage(pitTile, x, y, tw, Math.min(ts, H - y));
        }
      }
    }
    // Fill under ground-level conveyors only
    const groundYFill = H - 40;
    for (const c of conveyors) {
      if (c.y < groundYFill - 40) continue; // skip floating conveyors
      const fillTop = c.y + c.h;
      for (let x = c.x; x < c.x + c.w; x += ts) {
        const tw = Math.min(ts, c.x + c.w - x);
        for (let y = fillTop; y < H; y += ts) {
          ctx.drawImage(pitTile, x, y, tw, Math.min(ts, H - y));
        }
      }
    }
  }

  // Elevated conveyors (drawn behind ground tiles)
  if (conveyors.length > 0 && elevConveyImg.complete) {
    const elevFrame = Math.floor(conveyorAnimTimer) % 3;
    const groundYC = H - 40;
    for (const c of conveyors) {
      if (!c.elevated) continue;
      for (let cx = c.x; cx < c.x + c.w; cx += 291) {
        const tw = Math.min(291, c.x + c.w - cx);
        ctx.drawImage(elevConveyImg, 0, elevFrame * 120, tw, 120, cx, c.y, tw, 120);
      }
    }
  }

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
      // Skip float platform drawing on conveyor levels
      if (conveyors.length > 0 && p.type === "float") continue;
      // Check for raised platform sprite (hand-designed levels)
      if (p.raisedSprite && tiles[p.raisedSprite]) {
        const rImg = tiles[p.raisedSprite];
        const aspect = rImg.naturalWidth / rImg.naturalHeight;
        const drawH = rImg.naturalHeight * 0.7;
        const drawW = drawH * aspect;
        ctx.drawImage(rImg, p.x, p.y - drawH + 18, drawW, drawH);
      } else {
        // Platform A on top of stacked pillar tiles (61) with base (70)
        const platImg = tiles.platformA;
        const pillarMid = tiles.pillarMid;
        const pillarBase = tiles.pillarBase;
        if (platImg && pillarMid && pillarBase) {
          const ts = 32;
          const platH = 24;
          const platW = platH * (96 / 47);
          const count = Math.max(1, Math.round(p.w / platW));
          const totalW = count * platW;
          const startX = p.x + (p.w - totalW) / 2;
          const groundY = H - 40;
          const platOffset = 18;
          const pillarTop = p.y + platH - platOffset;
          const pillarBottom = groundY;
          for (let i = 0; i < count; i++) {
            const cx = startX + i * platW + platW / 2 - ts / 2;
            for (let y = pillarTop; y < pillarBottom - ts; y += ts) {
              ctx.drawImage(pillarMid, cx, y, ts, ts);
            }
            ctx.drawImage(pillarBase, cx, pillarBottom - ts, ts, ts);
          }
          for (let i = 0; i < count; i++) {
            ctx.drawImage(platImg, startX + i * platW, p.y - platOffset, platW, platH);
          }
        } else {
          ctx.fillStyle = "#6a6a6a";
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = "#888";
          ctx.fillRect(p.x, p.y, p.w, 2);
        }
      }
    }
  }

  // Conveyors (drawn on top of ground tiles)
  if (conveyors.length > 0) {
    const cImg = conveyorDir === 1 ? conveyRightImg : conveyLeftImg;
    const elevFrame = Math.floor(conveyorAnimTimer * 0.5) % 3;
    const groundYC = H - 40;

    // Draw ground-level conveyors on top
    if (cImg && cImg.complete) {
      const frame = Math.floor(conveyorAnimTimer) % 8;
      for (const c of conveyors) {
        if (c.elevated) continue;
        for (let cx = c.x; cx < c.x + c.w; cx += 97) {
          const tw = Math.min(97, c.x + c.w - cx);
          ctx.drawImage(cImg, 0, frame * 23, tw, 23, cx, c.y, tw, 23);
        }
      }
    }

    // Direction posts in middle of ground conveyors
    const postImg = conveyorDir === 1 ? postRightImg : postLeftImg;
    if (postImg && postImg.complete) {
      for (const c of conveyors) {
        if (c.elevated) continue;
        if (c.w >= 200) {
          const postW = 30;
          const postH = 85;
          const px = c.x + c.w / 2 - postW / 2;
          const py = c.y - postH;
          ctx.drawImage(postImg, px, py, postW, postH);
        }
      }
    }

    if (conveyorTimer > 1080) {
      const flash = Math.floor(conveyorTimer / 8) % 2 === 0;
      if (flash) {
        ctx.fillStyle = "rgba(255, 200, 0, 0.3)";
        for (const c of conveyors) { ctx.fillRect(c.x, c.y, c.w, c.h); }
      }
    }
  }

  // Coins (E-Swag Bucks)
  for (const c of coins) {
    if (c.collected) continue;
    c.bob += 0.15;
    if (moneyImg.complete && moneyImg.naturalWidth) {
      const frame = Math.floor(c.bob) % 6;
      ctx.drawImage(moneyImg, frame * 24, 0, 24, 24, c.x, c.y - 4, 29, 29);
    } else {
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(c.x, c.y, 22, 22);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("$", c.x + 6, c.y + 16);
    }
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
    const spr = p.type.sprite ? powerupSprites[p.type.sprite] : null;
    if (spr && spr.complete) {
      ctx.drawImage(spr, p.x, p.y + bobY, 36, 36);
    } else {
      ctx.font = "30px serif";
      ctx.fillText(p.type.emoji, p.x, p.y + 28 + bobY);
    }
  }

  // Falling boxes
  const fallIndicator = objImages["Fall indicator"];
  for (const b of fallingBoxes) {
    // Warning phase — flash indicator at top of screen (screen-space)
    if (b.warning > 0) {
      const flash = Math.floor(b.warning / 6) % 2 === 0;
      if (flash) {
        if (fallIndicator) {
          ctx.drawImage(fallIndicator, b.x, 40, 34, 34);
        } else {
          ctx.fillStyle = "#e74c3c";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText("⚠", b.x + 4, 64);
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

  // Drones
  for (const d of drones) {
    const frame = Math.floor(d.animTimer) % 4;
    const droneW = 60, droneH = 60;

    // Draw warning indicator when hovering
    if (d.state === "warning") {
      const flash = Math.floor(d.warning / 6) % 2 === 0;
      if (flash) {
        const fi = objImages["Fall indicator"];
        if (fi) {
          ctx.drawImage(fi, d.x + 10, 40, 34, 34);
        } else {
          ctx.fillStyle = "#e74c3c";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText("⚠", d.x + 14, 64);
        }
      }
    }

    // Draw drone
    const droneImg = (d.state === "carrying" || d.state === "warning") ? droneWithBoxImg : droneEmptyImg;
    if (droneImg.complete) {
      ctx.drawImage(droneImg, frame * 48, 0, 48, 48, d.x, d.y, droneW, droneH);
    }

    // Draw dropped box
    if (d.state === "dropping" && d.box && amazonBoxImg.complete) {
      ctx.drawImage(amazonBoxImg, d.box.x, d.box.y, 34, 22);
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.ellipse(d.box.x + 17, H - 42, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (guruNPC && guruImg.complete && !shopVisitedThisLevel) {
    ctx.drawImage(guruImg, guruNPC.x, guruNPC.y - 3, 55, 88);
  }

  // Roaming robots
  for (const r of robots) {
    const frames = r.facing === 1 ? robotRightFrames : robotLeftFrames;
    let frameIdx = 0;
    if (r.animState === "idle") frameIdx = 0;
    else if (r.animState === "starting") frameIdx = 1;
    else if (r.animState === "moving") frameIdx = 2 + (Math.floor(r.animTimer) % 2);
    else if (r.animState === "stopping") frameIdx = 4;
    const img = frames[frameIdx];
    if (img && img.complete) {
      ctx.drawImage(img, r.x, r.y + r.h - 128, 64, 128);
    }
  }

  // Checkpoint (drawn behind player)
  if (checkpoint) {
    const cp = checkpoint;
    const img = cp.activated ? checkpointBImg : checkpointAImg;
    if (img && img.complete) {
      ctx.drawImage(img, cp.x, cp.y, 48, 60);
    }
    // Flash animation on activation
    if (cp.flashTimer > 0 && checkpointFlashImg.complete) {
      const frame = Math.min(3, 3 - Math.floor(cp.flashTimer / 8));
      ctx.drawImage(checkpointFlashImg, frame * 48, 0, 48, 48, cp.x - 12, cp.y - 16, 72, 72);
    }
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
      const rH = 25; // 30% smaller
      const rW = rH * (53 / 16); // preserve aspect ratio
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

  // HUD frame and text (drawn on canvas, above everything)
  if (uiFrameImg.complete && uiFrameImg.naturalWidth) {
    ctx.drawImage(uiFrameImg, 0, 0, W, 41);
  }
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Score: " + score, 16, 21);
  ctx.fillStyle = "#2ecc71";
  ctx.fillText("E-Swag: $" + eswag, 130, 21);
  ctx.fillStyle = "#fff";
  ctx.fillText("Level " + level, W - 80, 21);
  // Hearts
  const heartStr = "❤️".repeat(Math.max(0, lives));
  ctx.font = "16px serif";
  ctx.fillText(heartStr, W / 2 - 30, 21);
  ctx.textBaseline = "alphabetic";
}

// ── Leaderboard ──
const useFirebase = typeof db !== "undefined";
const siteCode = new URLSearchParams(window.location.search).get("site") || "global";
const leaderboardPath = "leaderboard/" + siteCode;

function saveScore(name, sc) {
  if (useFirebase) {
    db.ref(leaderboardPath).push({ name, score: sc, timestamp: Date.now() });
  } else {
    const key = "safetyHeroScores_" + siteCode;
    const lb = JSON.parse(localStorage.getItem(key) || "[]");
    lb.push({ name, score: sc });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(lb.slice(0, 10)));
  }
}

function renderLeaderboard() {
  const medals = ["🥇", "🥈", "🥉"];
  const list = document.getElementById("leaderboard-list");
  document.getElementById("leaderboard-site").textContent = siteCode.toUpperCase();

  function displayScores(entries) {
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
    db.ref(leaderboardPath).orderByChild("score").limitToLast(10).once("value", function(snap) {
      const entries = [];
      snap.forEach(function(child) { entries.push(child.val()); });
      entries.sort(function(a, b) { return b.score - a.score; });
      displayScores(entries);
    });
  } else {
    const key = "safetyHeroScores_" + siteCode;
    const lb = JSON.parse(localStorage.getItem(key) || "[]").slice(0, 10);
    displayScores(lb);
    showScreen("leaderboard");
  }
}

// ── Shop ──
function updateShop() {
  // Slide guru shop sprite in from left
  const targetX = 20;
  shopSlideX += (targetX - shopSlideX) * 0.1;
}

function drawShop() {
  draw(); // frozen game in background
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, W, H);

  // Guru Shop sprite sliding in from left
  if (guruShopImg.complete) {
    const gh = H - 40;
    const gw = gh * (guruShopImg.naturalWidth / guruShopImg.naturalHeight);
    ctx.drawImage(guruShopImg, shopSlideX, 20, gw, gh);
  }

  // Shop panel on right
  const panelX = 380, panelY = 30, panelW = 420, panelH = H - 60;
  ctx.fillStyle = "rgba(15, 30, 15, 0.95)";
  ctx.strokeStyle = "#2ecc71";
  ctx.lineWidth = 3;
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  // Title
  ctx.fillStyle = "#2ecc71";
  ctx.font = "bold 22px 'Segoe UI', sans-serif";
  ctx.fillText("⚙️ Safety Guru's Shop", panelX + 20, panelY + 32);

  // Coins display
  ctx.fillStyle = "#f1c40f";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("E-Swag Bucks: " + eswag, panelX + 20, panelY + 58);

  // Upgrades list
  for (let i = 0; i < SHOP_UPGRADES.length; i++) {
    const u = SHOP_UPGRADES[i];
    const uy = panelY + 75 + i * 62;
    const owned = purchasedUpgrades[u.effect];
    const selected = i === shopSelection;

    // Selection highlight
    if (selected) {
      ctx.fillStyle = "rgba(46, 204, 113, 0.2)";
      ctx.fillRect(panelX + 10, uy - 5, panelW - 20, 55);
      ctx.strokeStyle = "#2ecc71";
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX + 10, uy - 5, panelW - 20, 55);
    }

    // Icon + name
    ctx.font = "20px serif";
    ctx.fillText(u.icon, panelX + 20, uy + 22);
    ctx.fillStyle = owned ? "#888" : "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(u.name, panelX + 50, uy + 18);

    // Description
    ctx.fillStyle = "#aaa";
    ctx.font = "13px sans-serif";
    ctx.fillText(u.desc, panelX + 50, uy + 36);

    // Cost or OWNED
    if (owned) {
      ctx.fillStyle = "#2ecc71";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("OWNED", panelX + panelW - 80, uy + 22);
    } else {
      ctx.fillStyle = eswag >= u.cost ? "#f1c40f" : "#e74c3c";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("$" + u.cost, panelX + panelW - 70, uy + 22);
    }
  }

  // Controls hint
  ctx.fillStyle = "#888";
  ctx.font = "12px sans-serif";
  ctx.fillText("↑↓ Select  |  Enter/Space: Buy  |  Esc: Close", panelX + 50, panelY + panelH - 15);
}

function purchaseUpgrade() {
  const u = SHOP_UPGRADES[shopSelection];
  if (purchasedUpgrades[u.effect] || eswag < u.cost) return;
  eswag -= u.cost;
  purchasedUpgrades[u.effect] = true;
  // Apply immediate effects
  if (u.effect === "extraLife") {
    lives++;
    purchasedUpgrades[u.effect] = false; // can rebuy
  }
  if (u.effect === "permShield") player.shielded = true;
  playSound("powerup");
}

function applyPermanentUpgrades() {
  if (purchasedUpgrades.permShield) player.shielded = true;
}

// ── Game Loop ──
function pollGamepad() {
  const gp = navigator.getGamepads ? navigator.getGamepads()[0] : null;
  if (!gp) return;
  const dz = 0.3;
  // Only override keys when gamepad input is active (don't clear keyboard inputs)
  const gpLeft = gp.axes[0] < -dz || gp.buttons[14]?.pressed;
  const gpRight = gp.axes[0] > dz || gp.buttons[15]?.pressed;
  const gpUp = gp.buttons[12]?.pressed || gp.axes[1] < -dz;
  const gpDown = gp.buttons[13]?.pressed || gp.axes[1] > dz;
  const gpA = gp.buttons[0]?.pressed;
  const gpB = gp.buttons[1]?.pressed;
  if (gpLeft) keys["ArrowLeft"] = true;
  if (gpRight) keys["ArrowRight"] = true;
  if (gpUp) { keys["ArrowUp"] = true; keys["KeyW"] = true; }
  if (gpDown) { keys["ArrowDown"] = true; keys["KeyS"] = true; }
  if (gpA) { keys["Space"] = true; keys["Enter"] = true; }
  if (gpB) keys["Escape"] = true;
  // Release gamepad keys when not pressed
  if (!gpLeft && !keys._kbLeft) keys["ArrowLeft"] = false;
  if (!gpRight && !keys._kbRight) keys["ArrowRight"] = false;
  if (!gpUp && !keys._kbUp) { keys["ArrowUp"] = false; keys["KeyW"] = false; }
  if (!gpDown && !keys._kbDown) { keys["ArrowDown"] = false; keys["KeyS"] = false; }
  if (!gpA && !keys._kbSpace) { keys["Space"] = false; keys["Enter"] = false; }
  if (!gpB) keys["Escape"] = false;

  // A button on splash/menu screens
  if (gp.buttons[0]?.pressed && !pollGamepad._aHeld) {
    if (gameState === "splash") {
      document.getElementById("lets-play-btn").click();
    } else if (gameState === "menu") {
      menuConfirm();
    } else if (gameState === "gameover") {
      const btns = document.querySelectorAll("#gameover-screen button");
      if (btns[menuIdx]) btns[menuIdx].click();
    }
  }
  pollGamepad._aHeld = gp.buttons[0]?.pressed;

  // D-pad navigation for menus (edge-triggered)
  const upNow = gp.buttons[12]?.pressed || gp.axes[1] < -dz;
  const downNow = gp.buttons[13]?.pressed || gp.axes[1] > dz;
  const leftNow = gp.buttons[14]?.pressed || gp.axes[0] < -dz;
  const rightNow = gp.buttons[15]?.pressed || gp.axes[0] > dz;
  if (upNow && !pollGamepad._upHeld) menuNav(-1);
  if (downNow && !pollGamepad._downHeld) menuNav(1);
  if (leftNow && !pollGamepad._leftHeld && oskActive) { oskIdx = Math.max(0, oskIdx - 1); highlightOSK(); }
  if (rightNow && !pollGamepad._rightHeld && oskActive) { oskIdx = Math.min(OSK_CHARS.length - 1, oskIdx + 1); highlightOSK(); }
  pollGamepad._upHeld = upNow;
  pollGamepad._downHeld = downNow;
  pollGamepad._leftHeld = leftNow;
  pollGamepad._rightHeld = rightNow;
}

// Menu navigation state
let menuIdx = 0;
let oskActive = false;
let oskIdx = 0;
const OSK_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ⌫✓";

function initOSK() {
  const osk = document.getElementById("osk");
  if (osk.children.length > 0) return;
  osk.style.display = "flex";
  OSK_CHARS.split("").forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.textContent = ch === "⌫" ? "DEL" : ch === "✓" ? "ENTER" : ch;
    if (ch === "✓") btn.style.background = "#2ecc71";
    btn.addEventListener("click", () => oskType(ch));
    osk.appendChild(btn);
  });
  highlightOSK();
}

function oskType(ch) {
  const input = document.getElementById("player-name");
  if (ch === "⌫") {
    input.value = input.value.slice(0, -1);
  } else if (ch === "✓") {
    oskActive = false;
    document.getElementById("osk").style.display = "none";
    startGame();
  } else {
    if (input.value.length < 15) input.value += ch;
  }
}

function highlightOSK() {
  const btns = document.querySelectorAll("#osk button");
  btns.forEach((b, i) => b.classList.toggle("btn-highlight", i === oskIdx));
}

function highlightMenu() {
  if (gameState === "menu") {
    const btns = document.querySelectorAll("#menu-buttons button");
    btns.forEach((b, i) => b.classList.toggle("btn-highlight", !oskActive && i === menuIdx));
    const input = document.getElementById("player-name");
    input.style.outline = oskActive ? "3px solid #2ecc71" : "";
  } else if (gameState === "gameover") {
    const btns = document.querySelectorAll("#gameover-screen button");
    btns.forEach((b, i) => b.classList.toggle("btn-highlight", i === menuIdx));
  }
}

function menuNav(dir) {
  if (gameState === "menu") {
    if (oskActive) {
      // Navigate OSK grid (38 chars, roughly 10 per row)
      const cols = 10;
      if (dir === 1 && oskIdx + cols < OSK_CHARS.length) oskIdx += cols;
      else if (dir === -1 && oskIdx - cols >= 0) oskIdx -= cols;
      else if (dir === 1) { oskActive = false; menuIdx = 0; }
      highlightOSK();
    } else {
      menuIdx = (menuIdx + dir + 3) % 3; // 0=name input, 1=start, 2=leaderboard
      if (menuIdx === 0) { oskActive = true; initOSK(); }
    }
    highlightMenu();
  } else if (gameState === "gameover") {
    const btns = document.querySelectorAll("#gameover-screen button");
    menuIdx = (menuIdx + dir + btns.length) % btns.length;
    highlightMenu();
  }
}

function menuConfirm() {
  if (gameState === "menu") {
    if (oskActive) {
      oskType(OSK_CHARS[oskIdx]);
    } else if (menuIdx === 1) {
      document.getElementById("start-btn").click();
    } else if (menuIdx === 2) {
      document.getElementById("leaderboard-btn").click();
    }
  }
}

function loop() {
  try {
    pollGamepad();
    update();
    if (gameState === "playing" || gameState === "question") {
      draw();
    } else if (gameState === "cinematic") {
      updateCinematic();
      drawCinematic();
    } else if (gameState === "shop") {
      updateShop();
      drawShop();
    }
  } catch(e) { console.error("LOOP ERROR:", e); }
  requestAnimationFrame(loop);
}

showScreen("splash");
loop();
