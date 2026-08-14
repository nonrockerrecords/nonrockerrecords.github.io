// ==========================================
// GAME STATE & CONSTANTS
// ========================================== v2
const GRID_SIZE = 6;
const GIGS = {
  1: {
    id: 1,
    name: "Gig 1: Aces High Saloon (Salt Lake City)",
    moves: 25,
    targets: { pick: 15 },
    unlockAbility: null, // warm-up set, no ability unlock yet
    rankUpgrade: "OPENER",
    confidence: 10,
  },
  2: {
    id: 2,
    name: "Gig 2: Kilby Court (Basement)",
    moves: 30,
    targets: { kazoo: 18 },
    unlockAbility: "soju", // Yung Soju
    rankUpgrade: "BASSIST",
    confidence: 25,
  },
  3: {
    id: 3,
    name: "Gig 3: Dongmyo Soju Bar (Back Room)",
    moves: 35,
    targets: { didgeridoo: 16, soju: 16 },
    unlockAbility: "dj", // DJ 막걸리
    rankUpgrade: "ENGINEER",
    confidence: 45,
  },
  4: {
    id: 4,
    name: "Gig 4: Gwangalli Underpass (Busan)",
    moves: 38,
    targets: { statue: 20 },
    unlockAbility: "statue", // STATUE.EXE
    rankUpgrade: "VOCALIST",
    confidence: 75,
  },
  5: {
    id: 5,
    name: "Gig 5: The Recycle Bin (Cyberspace)",
    moves: 40,
    scoreGoal: 12000,
    targets: {},
    unlockAbility: "nullsoft", // NULLSOFT
    rankUpgrade: "SOJU DEITY",
    confidence: 100,
  },
  6: {
    id: 6,
    name: "Gig 6: The Reaper's Repo (Locked Archive)",
    moves: 45,
    targets: { floppy: 24 },
    unlockAbility: null, // final boss stage, all abilities already unlocked
    rankUpgrade: "REMEMBERED",
    confidence: 100,
    boss: "repo-reaper", // shows the boss portrait on this gig's map card
  }
};

const PIECES = {
  statue: { id: 0, name: "Statue Head", src: "assets/statue_head.png" },
  kazoo: { id: 1, name: "Kazoo", src: "assets/kazoo.png" },
  didgeridoo: { id: 2, name: "Didgeridoo", src: "assets/didgeridoo.png" },
  soju: { id: 3, name: "Soju Bottle", src: "assets/soju_bottle.png" },
  floppy: { id: 4, name: "Floppy Disk", src: "assets/floppy_disk.png" },
  pick: { id: 5, name: "Guitar Pick", src: "assets/guitar_pick.png" },
};
const PIECE_KEYS = Object.keys(PIECES);

// "Easy test" prototype: kazoo spawns ~15% more often (gig 2's target), and
// guitar pick spawns ~20% more often (gig 1 Aces High's target, was too hard).
const PIECE_WEIGHTS = { statue: 1, kazoo: 1.15, didgeridoo: 1, soju: 1, floppy: 1, pick: 1.20 };
const PIECE_WEIGHT_TOTAL = PIECE_KEYS.reduce((sum, k) => sum + PIECE_WEIGHTS[k], 0);
function pickWeightedPiece() {
  let roll = Math.random() * PIECE_WEIGHT_TOTAL;
  for (const key of PIECE_KEYS) {
    roll -= PIECE_WEIGHTS[key];
    if (roll <= 0) return key;
  }
  return PIECE_KEYS[PIECE_KEYS.length - 1];
}

// Audio Setup
let audioCtx = null;
let muted = false;

// ==========================================
// SAVE / LOAD PROGRESS (localStorage)
// ==========================================
const SAVE_KEY = 'nonrocker-match3-save';

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      rank, confidence, unlockedLevels, unlockedAbilities, muted
    }));
  } catch (e) { /* storage unavailable (private mode etc.) — play on without saving */ }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (typeof s.rank === 'string') rank = s.rank;
    if (typeof s.confidence === 'number') confidence = s.confidence;
    if (Array.isArray(s.unlockedLevels) && s.unlockedLevels.length) unlockedLevels = s.unlockedLevels;
    if (Array.isArray(s.unlockedAbilities)) unlockedAbilities = s.unlockedAbilities;
    if (typeof s.muted === 'boolean') muted = s.muted;
  } catch (e) { /* corrupt save — ignore */ }
}

function toggleMute() {
  muted = !muted;
  const btn = document.getElementById('btn-sound');
  if (btn) btn.textContent = muted ? 'SND OFF' : 'SND ON';
  saveProgress();
}

// Game State variables
let currentGig = 1;
let currentScore = 0;
let movesLeft = 0;
let rank = "ROADIE";
let confidence = 13;
let unlockedLevels = [1];
let unlockedAbilities = []; // list of character ids unlocked

let board = []; // 2D array of tile objects: { type: string, isPowerUp: boolean, powerType: string }
let boardDisabled = false;
let selectedTile = null;

let levelTargets = {}; // Track targets cleared during current level
let isGameOver = false;
let comboCount = 0; // Cascade depth: 1 on the triggering match, +1 per gravity re-match
let lastSwipeAt = 0; // Timestamp of last touch swipe, to suppress the synthetic click after it

// Matrix Wash animation variables
let matrixActive = false;
let matrixInterval = null;
let matrixStreams = [];

// ==========================================
// AUDIO SYNTH ENGINE (Procedural Web Audio)
// ==========================================
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSynth(type, freq, duration, gainVal = 0.1, sweep = 0) {
  if (!audioCtx || muted) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  if (sweep !== 0) {
    osc.frequency.exponentialRampToValueAtTime(sweep, audioCtx.currentTime + duration);
  }
  
  gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.05);
}

function playKazooSound() {
  initAudio();
  if (muted) return;
  // Yung Soju kazoo: Sawtooth with slight random vibration
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  const baseFreq = 220 + Math.random() * 60;
  osc.frequency.setValueAtTime(baseFreq, now);
  // Add kazoo vibration
  osc.frequency.linearRampToValueAtTime(baseFreq * 1.08, now + 0.1);
  osc.frequency.linearRampToValueAtTime(baseFreq * 0.95, now + 0.2);
  osc.frequency.linearRampToValueAtTime(baseFreq * 1.05, now + 0.35);
  
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(440, now);
  filter.Q.setValueAtTime(2, now);
  
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(now + 0.5);
}

function playDidgeridooSound() {
  initAudio();
  if (muted) return;
  // Low frequency rumble
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(65, now); // Low C
  osc.frequency.linearRampToValueAtTime(70, now + 0.4);
  osc.frequency.linearRampToValueAtTime(62, now + 0.8);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(150, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.4);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(now + 1.0);
}

function playSojuPourSound() {
  initAudio();
  if (muted) return;
  // Bubble / pouring noise: randomized short high-pitch sweeps + bandpass white noise
  const now = audioCtx.currentTime;
  const duration = 2.0;
  
  // White noise node
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(5, now);
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  
  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noiseNode.start();
  noiseNode.stop(now + duration + 0.05);

  // Add a quick bubble sound
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      playSynth('sine', 400 + Math.random() * 200, 0.15, 0.04, 800 + Math.random() * 300);
    }, i * 300);
  }
}

function playMatchSound() {
  initAudio();
  playSynth('sine', 380, 0.15, 0.08, 760);
}

function playExplosionSound() {
  initAudio();
  // Didgeridoo crash explosion
  playSynth('triangle', 180, 0.35, 0.25, 40);
  playSynth('sawtooth', 100, 0.25, 0.15, 20);
}

function playSwapSound() {
  initAudio();
  playSynth('sine', 220, 0.1, 0.05, 330);
}

function playBootSound() {
  initAudio();
  const now = audioCtx.currentTime;
  // Retro synth chord arpeggio
  const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playSynth('triangle', freq, 0.5, 0.06, freq * 1.5);
    }, idx * 100);
  });
}

// ==========================================
// INTERACTIVE NAVIGATION
// ==========================================
function showScreen(screenId) {
  initAudio();
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  // Flash Screen transitions
  const flash = document.getElementById('flash');
  flash.classList.remove('fire');
  void flash.offsetWidth;
  flash.classList.add('fire');
  
  if (screenId === 'screen-welcome') {
    playBootSound();
  }
}

function updateMapScreen() {
  // Update campaign locks/unlocks
  for (let l = 1; l <= 6; l++) {
    const card = document.getElementById(`gig-${l}`);
    if (unlockedLevels.includes(l)) {
      card.classList.remove('locked');
      card.classList.add('active');
      card.querySelector('.gig-status').textContent = "// UNLOCKED";
    } else {
      card.classList.remove('active');
      card.classList.add('locked');
      card.querySelector('.gig-status').textContent = "// LOCKED";
    }
  }
  
  // Update confidence zine panel
  document.getElementById('player-rank').textContent = rank;
  document.getElementById('confidence-percentage').textContent = `${confidence}%`;
  document.getElementById('confidence-bar').style.width = `${confidence}%`;
}

// ==========================================
// 8x8 GRID ENGINE & GAMEPLAY
// ==========================================
function selectLevel(lvlId) {
  if (!unlockedLevels.includes(lvlId)) {
    // Play failed didgeridoo buzz + shake the card (audio alone is silent feedback for muted/mobile players)
    initAudio();
    playSynth('sawtooth', 120, 0.2, 0.1, 80);
    const lockedCard = document.getElementById(`gig-${lvlId}`);
    if (lockedCard) {
      lockedCard.classList.remove('locked-shake');
      void lockedCard.offsetWidth; // restart animation if clicked again quickly
      lockedCard.classList.add('locked-shake');
    }
    return;
  }
  
  currentGig = lvlId;
  currentScore = 0;
  movesLeft = GIGS[lvlId].moves;
  isGameOver = false;
  boardDisabled = false;
  clearSelection(); // no stale selection from a previous board

  // Re-hide the soju bottle so it stays a surprise for this fresh attempt.
  const bottleReset = document.getElementById('soju-bottle-pourier');
  if (bottleReset) {
    bottleReset.classList.remove('revealed', 'tilting');
    const pourVideoReset = document.getElementById('soju-pour-video');
    if (pourVideoReset) pourVideoReset.pause();
  }

  // Build targets
  levelTargets = {};
  if (GIGS[lvlId].targets) {
    Object.keys(GIGS[lvlId].targets).forEach(key => {
      levelTargets[key] = {
        total: GIGS[lvlId].targets[key],
        current: 0
      };
    });
  }
  
  // Update sidebar characters based on level progress
  updateSidebarAbilities();
  
  // HUD
  document.getElementById('hud-score').textContent = "00000";
  document.getElementById('hud-moves').textContent = String(movesLeft).padStart(2, '0');
  document.getElementById('hud-gig-name').textContent = `GIG ${lvlId}`;
  
  renderHUDTargets();
  
  // Build board
  initBoard();

  showScreen('screen-game');

  // Perch the soju bottle above the board once layout has settled.
  requestAnimationFrame(positionSojuBottle);
}

// Anchor the giant soju bottle so it sits just above the board's top edge,
// slightly overlapping — visible all level as the "prize" waiting to pour.
function positionSojuBottle() {
  const bottle = document.getElementById('soju-bottle-pourier');
  const wrapper = document.querySelector('.board-wrapper');
  const boardEl = document.querySelector('.board-container');
  if (!bottle || !wrapper || !boardEl) return;
  const wr = wrapper.getBoundingClientRect();
  const br = boardEl.getBoundingClientRect();
  const bh = bottle.offsetHeight || 96;
  bottle.style.top = `${br.top - wr.top - bh + 20}px`;
}
window.addEventListener('resize', positionSojuBottle);

function updateSidebarAbilities() {
  const abilities = [
    { id: 'member-soju', ability: 'soju' },       // unlocked by beating Gig 1
    { id: 'member-dj', ability: 'dj' },           // Gig 2
    { id: 'member-statue', ability: 'statue' },   // Gig 3
    { id: 'member-nullsoft', ability: 'nullsoft' } // Gig 4
  ];

  abilities.forEach(ability => {
    const el = document.getElementById(ability.id);
    if (unlockedAbilities.includes(ability.ability)) {
      el.classList.remove('locked');
      el.classList.add('unlocked');
      el.querySelector('.status-indicator').textContent = "ACTIVE POWER-UP";
    } else {
      el.classList.remove('unlocked');
      el.classList.add('locked');
      el.querySelector('.status-indicator').textContent = "LOCKED";
    }
  });
}

function renderHUDTargets() {
  const container = document.getElementById('hud-targets');
  container.innerHTML = "";
  
  if (GIGS[currentGig].scoreGoal) {
    const item = document.createElement('div');
    item.className = 'target-item';
    item.innerHTML = `
      <div style="font-family:'Press Start 2P'; font-size: 8px;">SCORE TARGET:</div>
      <div class="count" style="color:var(--chaos-green);">${GIGS[currentGig].scoreGoal} pts</div>
    `;
    container.appendChild(item);
  }
  
  Object.keys(levelTargets).forEach(key => {
    const item = document.createElement('div');
    item.className = 'target-item';
    
    const targetObj = levelTargets[key];
    const imagePath = PIECES[key].src;
    
    item.innerHTML = `
      <div class="icon" style="background-image: url('${imagePath}');"></div>
      <div class="count">${targetObj.current} / ${targetObj.total}</div>
    `;
    container.appendChild(item);
  });
}

// Fill `board` with random tiles that form no immediate 3-match. Mutates `board`.
function fillBoardNoMatches() {
  board = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      // Keep generating until it doesn't form a 3-match immediately
      let type;
      do {
        type = pickWeightedPiece();
      } while (
        (r >= 2 && board[r - 1][c].type === type && board[r - 2][c].type === type) ||
        (c >= 2 && board[r][c - 1].type === type && board[r][c - 2].type === type)
      );

      board[r][c] = {
        type: type,
        isPowerUp: false,
        powerType: null
      };
    }
  }
}

function initBoard() {
  // Regenerate until the starting board actually has a legal move (no soft-lock).
  do {
    fillBoardNoMatches();
  } while (!hasPossibleMove());

  drawGridDOM();
}

// Is there any adjacent swap that would create a 3+ match? Tests each tile against its
// right and down neighbor (covers every adjacency), swapping back after each probe.
function hasPossibleMove() {
  const trySwap = (r1, c1, r2, c2) => {
    const tmp = board[r1][c1];
    board[r1][c1] = board[r2][c2];
    board[r2][c2] = tmp;
    const found = findMatches().coordinates.length > 0;
    // swap back
    const tmp2 = board[r1][c1];
    board[r1][c1] = board[r2][c2];
    board[r2][c2] = tmp2;
    return found;
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c + 1 < GRID_SIZE && trySwap(r, c, r, c + 1)) return true;
      if (r + 1 < GRID_SIZE && trySwap(r, c, r + 1, c)) return true;
    }
  }
  return false;
}

// Re-randomize the board in place (used when the player runs out of legal moves) and
// flash a glitch notice over the playfield. Keeps the EPK "reality is unstable" voice.
function reshuffleBoard() {
  // Earned power-ups survive the reshuffle (they were being wiped before).
  const savedPowers = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const t = board[r][c];
      if (t && t.isPowerUp) {
        savedPowers.push({ type: t.type, powerType: t.powerType });
      }
    }
  }

  let guard = 0;
  do {
    fillBoardNoMatches();
    // Re-inject saved power tiles at random distinct cells.
    const used = new Set();
    savedPowers.forEach(p => {
      let r, c;
      do {
        r = Math.floor(Math.random() * GRID_SIZE);
        c = Math.floor(Math.random() * GRID_SIZE);
      } while (used.has(`${r},${c}`));
      used.add(`${r},${c}`);
      board[r][c] = { type: p.type, isPowerUp: true, powerType: p.powerType };
    });
  } while ((!hasPossibleMove() || findMatches().coordinates.length > 0) && ++guard < 200);

  drawGridDOM();
  showComboCallout('REALITY.EXE NOT FOUND — RESHUFFLING', 'var(--chaos-amber)');
}

// ---- Persistent-tile renderer ----------------------------------------------
// Each non-empty tile object owns one DOM node (`tile.el`). Tiles are positioned
// with `transform: translate(col, row)` and a CSS transition, so changing a tile's
// row/col *animates* the move instead of rebuilding the board. This is what makes
// swaps slide, matched tiles pop in place, and only the tiles that fall fall.

// Move a tile's element to a grid cell. With the CSS transition on, this animates.
function setPos(el, r, c) {
  el.dataset.row = r;
  el.dataset.col = c;
  el.style.transform = `translate(${c * 100}%, ${r * 100}%)`;
}

// Create a tile's DOM node (icon + power glow + input bindings). Caller positions it.
function createTileEl(tile) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tile-wrapper';
  const size = (100 / GRID_SIZE) + '%';
  wrapper.style.width = size;
  wrapper.style.height = size;

  // Styling special glitched power-ups
  if (tile.isPowerUp) {
    wrapper.classList.add(`power-${tile.powerType}`);
  }

  const img = document.createElement('div');
  img.className = 'tile-icon';
  const piece = PIECES[tile.type];
  if (piece) {
    img.style.backgroundImage = `url('${piece.src}')`;
  }
  wrapper.appendChild(img);

  // Interactive bindings (bound once — nodes persist across moves).
  wrapper.addEventListener('click', handleTileClick);
  setupDragDrop(wrapper);
  return wrapper;
}

// Full (re)build of the board DOM — used for initial layout, reshuffle and tests.
// Mid-game swaps/clears/gravity mutate the persistent nodes instead of calling this.
function drawGridDOM() {
  const container = document.getElementById('game-board');
  container.innerHTML = "";

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = board[r][c];
      // Empty/cleared cells own no node.
      if (!tile || tile.type === "") {
        if (tile) tile.el = null;
        continue;
      }
      const el = createTileEl(tile);
      setPos(el, r, c);          // position set while detached → no load-time slide
      container.appendChild(el);
      tile.el = el;
    }
  }
}

// Drag & drop setups. Swipes use only local state — they must NOT touch
// `selectedTile`, or every touchstart wipes the tap-selection and tap-tap
// swapping never works on phones.
function setupDragDrop(wrapper) {
  let touchStartX, touchStartY;

  wrapper.addEventListener('touchstart', (e) => {
    if (boardDisabled || isGameOver) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (boardDisabled || isGameOver) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // Small tap → let the click handler do tap-select

    // A real swipe happened — remember when, so the synthetic click that follows
    // touchend doesn't also register as a tap-select on the released tile.
    lastSwipeAt = Date.now();

    const r = parseInt(wrapper.dataset.row);
    const c = parseInt(wrapper.dataset.col);
    let targetR = r;
    let targetC = c;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      targetC = dx > 0 ? c + 1 : c - 1;
    } else {
      targetR = dy > 0 ? r + 1 : r - 1;
    }
    
    if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
      triggerSwap(r, c, targetR, targetC);
    }
    clearSelection(); // a swipe cancels any prior tap-selection
  });
}

// Deselect the currently selected tile (also drops the highlight class).
function clearSelection() {
  if (selectedTile) {
    selectedTile.classList.remove('selected');
    selectedTile = null;
  }
}

function handleTileClick(e) {
  if (boardDisabled || isGameOver) return;
  // Ignore the synthetic click that fires right after a touch swipe.
  if (Date.now() - lastSwipeAt < 400) return;
  const tileEl = e.currentTarget;
  const r = parseInt(tileEl.dataset.row);
  const c = parseInt(tileEl.dataset.col);
  
  if (!selectedTile) {
    selectedTile = tileEl;
    tileEl.classList.add('selected');
    playSwapSound();
  } else {
    const selR = parseInt(selectedTile.dataset.row);
    const selC = parseInt(selectedTile.dataset.col);
    
    // Check adjacency
    const isAdjacent = (Math.abs(selR - r) === 1 && selC === c) || (Math.abs(selC - c) === 1 && selR === r);
    
    selectedTile.classList.remove('selected');

    if (isAdjacent) {
      selectedTile = null; // selection is consumed by the swap
      triggerSwap(selR, selC, r, c);
    } else {
      // Select the new tile instead
      selectedTile = tileEl;
      tileEl.classList.add('selected');
      playSwapSound();
    }
  }
}

function triggerSwap(r1, c1, r2, c2) {
  boardDisabled = true;
  playSwapSound();
  
  // Swap grid states
  const temp = board[r1][c1];
  board[r1][c1] = board[r2][c2];
  board[r2][c2] = temp;

  // Slide the two tiles into each other's cells (transform transition animates it).
  moveTileTo(r1, c1);
  moveTileTo(r2, c2);

  setTimeout(() => {
    // Check if swap made a match
    const matches = findMatches();
    if (matches.coordinates.length > 0) {
      // Moves count down
      movesLeft--;
      document.getElementById('hud-moves').textContent = String(movesLeft).padStart(2, '0');

      comboCount = 1; // fresh cascade; each gravity re-match will bump this
      processMatchSequence(matches);
    } else {
      // No match — slide them back.
      const temp2 = board[r1][c1];
      board[r1][c1] = board[r2][c2];
      board[r2][c2] = temp2;

      playSynth('sine', 150, 0.1, 0.08, 100);
      moveTileTo(r1, c1);
      moveTileTo(r2, c2);
      boardDisabled = false;
    }
  }, 230); // let the ~200ms slide finish before evaluating
}

// Animate whatever tile currently lives at (r,c) to its cell.
function moveTileTo(r, c) {
  const tile = board[r][c];
  if (tile && tile.el) setPos(tile.el, r, c);
}


// ==========================================
// MATCH MATCHING & CHAIN ALGORITHM
// ==========================================
function findMatches() {
  let matchedCoords = []; // Array of { r, c }
  let powerSpawns = []; // Power-ups to spawn after match clears: {r, c, type, powerType}
  
  // 1. Horizontal scans
  for (let r = 0; r < GRID_SIZE; r++) {
    let matchLen = 1;
    let matchType = "";
    let matchStartIdx = 0;
    
    for (let c = 0; c < GRID_SIZE; c++) {
      const type = board[r][c].type;
      if (c === 0) {
        matchType = type;
        matchStartIdx = 0;
        matchLen = 1;
      } else if (type === matchType && type !== "") {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          for (let m = matchStartIdx; m < c; m++) {
            matchedCoords.push({ r, c: m });
          }
          // Spawn power up at the center of match
          const centerC = Math.floor((matchStartIdx + c - 1) / 2);
          if (matchLen === 4) {
            powerSpawns.push({ r, c: centerC, type: matchType, len: 4 });
          } else if (matchLen >= 5) {
            powerSpawns.push({ r, c: centerC, type: matchType, len: 5 });
          }
        }
        matchType = type;
        matchStartIdx = c;
        matchLen = 1;
      }
    }
    if (matchLen >= 3) {
      for (let m = matchStartIdx; m < GRID_SIZE; m++) {
        matchedCoords.push({ r, c: m });
      }
      const centerC = Math.floor((matchStartIdx + GRID_SIZE - 1) / 2);
      if (matchLen === 4) {
        powerSpawns.push({ r, c: centerC, type: matchType, len: 4 });
      } else if (matchLen >= 5) {
        powerSpawns.push({ r, c: centerC, type: matchType, len: 5 });
      }
    }
  }

  // 2. Vertical scans
  for (let c = 0; c < GRID_SIZE; c++) {
    let matchLen = 1;
    let matchType = "";
    let matchStartIdx = 0;
    
    for (let r = 0; r < GRID_SIZE; r++) {
      const type = board[r][c].type;
      if (r === 0) {
        matchType = type;
        matchStartIdx = 0;
        matchLen = 1;
      } else if (type === matchType && type !== "") {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          for (let m = matchStartIdx; m < r; m++) {
            matchedCoords.push({ r: m, c });
          }
          const centerR = Math.floor((matchStartIdx + r - 1) / 2);
          if (matchLen === 4) {
            powerSpawns.push({ r: centerR, c, type: matchType, len: 4 });
          } else if (matchLen >= 5) {
            powerSpawns.push({ r: centerR, c, type: matchType, len: 5 });
          }
        }
        matchType = type;
        matchStartIdx = r;
        matchLen = 1;
      }
    }
    if (matchLen >= 3) {
      for (let m = matchStartIdx; m < GRID_SIZE; m++) {
        matchedCoords.push({ r: m, c });
      }
      const centerR = Math.floor((matchStartIdx + GRID_SIZE - 1) / 2);
      if (matchLen === 4) {
        powerSpawns.push({ r: centerR, c, type: matchType, len: 4 });
      } else if (matchLen >= 5) {
        powerSpawns.push({ r: centerR, c, type: matchType, len: 5 });
      }
    }
  }

  // Remove duplicate coordinates
  const uniqueMatches = [];
  const coordsSeen = new Set();
  matchedCoords.forEach(coord => {
    const hash = `${coord.r},${coord.c}`;
    if (!coordsSeen.has(hash)) {
      coordsSeen.add(hash);
      uniqueMatches.push(coord);
    }
  });

  // Attach power-ups metadata to triggers if matched
  return { coordinates: uniqueMatches, powerSpawns };
}

function processMatchSequence(matchesObj) {
  const coords = matchesObj.coordinates;
  const powerSpawns = matchesObj.powerSpawns;
  
  let powerTriggers = [];
  
  // Mark and trigger active glitched tiles first
  coords.forEach(coord => {
    const tile = board[coord.r][coord.c];
    if (tile.isPowerUp) {
      powerTriggers.push({ r: coord.r, c: coord.c, type: tile.powerType });
    }
  });
  
  // Calculate scoring & target progress — cascades multiply the payout.
  const mult = comboCount || 1;
  const matchScore = coords.length * 100 * mult;
  currentScore += matchScore;
  updateScoreHUD();

  // Play match chimes
  playMatchSound();

  // Collect cleared types so type-specific voices play once per cluster (not per tile).
  const clearedTypes = new Set();
  let sumR = 0, sumC = 0;

  // Animate clear tiles
  coords.forEach(coord => {
    const tile = board[coord.r][coord.c];
    if (tile.el) tile.el.querySelector('.tile-icon').classList.add('tile-pop');

    const tileType = tile.type;
    // Add to level goal progression
    if (levelTargets[tileType]) {
      levelTargets[tileType].current++;
    }
    clearedTypes.add(tileType);
    sumR += coord.r;
    sumC += coord.c;
  });

  // One voice per type, per cluster (was one per tile — a dozen overlapping honks).
  if (clearedTypes.has('kazoo')) playKazooSound();
  if (clearedTypes.has('didgeridoo')) playDidgeridooSound();

  // Floating "+N" popup at the match centroid, tinted by combo depth.
  const color = comboColor(mult);
  const centR = sumR / coords.length;
  const centC = sumC / coords.length;
  spawnScorePopup(centR, centC, matchScore, color);

  // Flair: particles fly out of every cleared tile, a shockwave ring pulses
  // from the match center, and the whole board gives a little thump.
  spawnMatchBurst(coords);
  spawnShockwave(centR, centC, color);
  thumpBoard();

  // Escalating combo callout once chains kick in.
  if (mult >= 2) {
    showComboCallout(`×${mult} ${comboLabel(mult)}`, color);
  }

  renderHUDTargets();

  setTimeout(() => {
    // Remove the matched tiles' nodes, then empty their cells.
    coords.forEach(coord => {
      const tile = board[coord.r][coord.c];
      if (tile.el) tile.el.remove();
      board[coord.r][coord.c] = { type: "", isPowerUp: false, powerType: null };
    });

    // Execute glitched power triggers
    triggerPowerUps(powerTriggers);
    
    // Spawn new glitched special power-ups
    spawnGlitchedPowerups(powerSpawns);
    
    // Gravity Drop & refill
    applyGravity();
  }, 220); // matches the longer clear-pop animation
}

// Power up activations. Processes a queue so power-ups cleared by other
// power-ups chain-react instead of fizzling. Only unlocked types ever spawn,
// so no lock checks are needed here.
let pendingPowerTriggers = []; // filled by clearSingleTile when it wipes a power tile
let powerClearCount = 0;       // tiles cleared by the current power sequence

function triggerPowerUps(triggers) {
  if (triggers.length === 0) return;

  const queue = [...triggers];
  powerClearCount = 0;
  const origin = triggers[0]; // where the score popup appears

  while (queue.length) {
    const trigger = queue.shift();
    const r = trigger.r;
    const c = trigger.c;

    if (trigger.type === 'soju') {
      // Kazoo blast: Row and Column clear
      playKazooSound();
      for (let i = 0; i < GRID_SIZE; i++) {
        clearSingleTile(r, i);
        clearSingleTile(i, c);
      }
    }
    else if (trigger.type === 'dj') {
      // Didgeridoo blast: 3x3 surrounding explosion
      playExplosionSound();
      const frame = document.querySelector('.deck');
      frame.classList.add('shake-screen');
      setTimeout(() => frame.classList.remove('shake-screen'), 450);

      for (let row = r - 1; row <= r + 1; row++) {
        for (let col = c - 1; col <= c + 1; col++) {
          if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            clearSingleTile(row, col);
          }
        }
      }
    }
    else if (trigger.type === 'statue') {
      // STATUE.EXE color clear — targets a type actually present on the board
      playSynth('sawtooth', 880, 0.4, 0.15, 110);
      const present = PIECE_KEYS.filter(k =>
        board.some(row => row.some(t => t.type === k)));
      if (present.length) {
        const targetType = present[Math.floor(Math.random() * present.length)];
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col].type === targetType) {
              clearSingleTile(row, col);
            }
          }
        }
      }
    }
    else if (trigger.type === 'nullsoft') {
      // Floppy Disk digital bomb: 6 random clearances
      playSynth('sine', 1500, 0.5, 0.08, 100);
      for (let i = 0; i < 6; i++) {
        const randR = Math.floor(Math.random() * GRID_SIZE);
        const randC = Math.floor(Math.random() * GRID_SIZE);
        clearSingleTile(randR, randC);
      }
    }

    // Chain reaction: any power tiles this effect wiped now fire too.
    queue.push(...pendingPowerTriggers);
    pendingPowerTriggers = [];
  }

  // Sync HUD + drop a popup for the whole blast (was silently stale before).
  if (powerClearCount > 0) {
    updateScoreHUD();
    renderHUDTargets();
    spawnScorePopup(origin.r, origin.c, powerClearCount * 100, 'var(--chaos-amber)');
  }
}

function clearSingleTile(r, c) {
  const tile = board[r][c];
  if (!tile || tile.type === "") return;

  // A power tile cleared by another power-up chains (queued by triggerPowerUps).
  if (tile.isPowerUp) {
    pendingPowerTriggers.push({ r, c, type: tile.powerType });
  }
  if (levelTargets[tile.type]) {
    levelTargets[tile.type].current++;
  }
  currentScore += 100;
  powerClearCount++;
  if (tile.el) tile.el.remove();
  board[r][c] = { type: "", isPowerUp: false, powerType: null };
}

function updateScoreHUD() {
  document.getElementById('hud-score').textContent = String(currentScore).padStart(5, '0');
}

function spawnGlitchedPowerups(spawns) {
  spawns.forEach(spawn => {
    // Only spawn power-ups the player has actually unlocked, so every glowing
    // tile on the board is guaranteed to fire when matched (no dead power-ups).
    let powerType = null;
    const fourMatch = ['soju', 'dj'].filter(a => unlockedAbilities.includes(a));
    const fiveMatch = ['statue', 'nullsoft'].filter(a => unlockedAbilities.includes(a));

    if (spawn.len === 4 && fourMatch.length) {
      powerType = fourMatch[Math.floor(Math.random() * fourMatch.length)];
    } else if (spawn.len >= 5) {
      if (fiveMatch.length) {
        powerType = fiveMatch[Math.floor(Math.random() * fiveMatch.length)];
      } else if (fourMatch.length) {
        // 5-match before big abilities are unlocked still rewards something.
        powerType = fourMatch[Math.floor(Math.random() * fourMatch.length)];
      }
    }

    if (powerType) {
      const tile = {
        type: spawn.type,
        isPowerUp: true,
        powerType: powerType
      };
      board[spawn.r][spawn.c] = tile;
      // Give the freshly-spawned power-up a node so gravity can carry it down.
      const el = createTileEl(tile);
      setPos(el, spawn.r, spawn.c);
      document.getElementById('game-board').appendChild(el);
      tile.el = el;

      playPowerUpBurst();
    }
  });
}

// Wan 2.2 generated burst clip, played once over the board whenever a
// 4+/5-match spawns a power-up tile. Shared across all power-up types by
// design (keeps the effect rare/special rather than per-piece asset bloat).
function playPowerUpBurst() {
  const video = document.getElementById('power-burst-video');
  if (!video) return;
  video.classList.add('playing');
  video.currentTime = 0;
  video.play().catch(() => {});
  video.onended = () => video.classList.remove('playing');
}

// Gravity falls logic — animated. Surviving tiles keep their nodes and slide down
// to their settled rows; new tiles are spawned just above the board and slide in.
// Only tiles that actually move animate (no full-board re-drop).
function applyGravity() {
  const container = document.getElementById('game-board');

  for (let c = 0; c < GRID_SIZE; c++) {
    // Existing tiles in this column, top → bottom (their nodes are reused as-is).
    const survivors = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      if (board[r][c].type !== "") survivors.push(board[r][c]);
    }
    const newCount = GRID_SIZE - survivors.length;

    // New column ordering: fresh tiles on top, survivors beneath.
    const column = [];
    for (let k = 0; k < newCount; k++) {
      const type = pickWeightedPiece();
      const tile = { type, isPowerUp: false, powerType: null };
      const el = createTileEl(tile);
      // Start above the top edge (negative row) so the tile drops into view.
      setPos(el, k - newCount, c);
      container.appendChild(el);
      tile.el = el;
      column.push(tile);
    }
    for (let i = 0; i < survivors.length; i++) column.push(survivors[i]);

    // Commit the column to the board model.
    for (let r = 0; r < GRID_SIZE; r++) board[r][c] = column[r];
  }

  // FLIP: commit the new tiles' "above" start positions as the transition baseline,
  // then move every tile to its final cell so survivors and newcomers slide together.
  void container.offsetHeight; // force reflow
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = board[r][c];
      if (tile.el) setPos(tile.el, r, c);
    }
  }

  setTimeout(() => {
    // Check if new matches form on gravity drop
    const newMatches = findMatches();
    if (newMatches.coordinates.length > 0) {
      comboCount++; // deeper into the cascade -> bigger multiplier + callout
      processMatchSequence(newMatches);
    } else {
      comboCount = 0;
      boardDisabled = false;
      // Out of legal moves? Reshuffle instead of soft-locking (mid-game only).
      if (!isGameOver && !hasPossibleMove()) {
        reshuffleBoard();
      }
      checkGameStatus();
    }
  }, 250);
}

// ==========================================
// JUICE: SCORE POPUPS & COMBO CALLOUTS
// ==========================================
// Cascade color ramp: cyan -> green -> pink -> amber as the multiplier climbs.
function comboColor(mult) {
  if (mult >= 4) return 'var(--chaos-amber)';
  if (mult === 3) return 'var(--chaos-pink)';
  if (mult === 2) return 'var(--chaos-green)';
  return 'var(--chaos-cyan)';
}

// EPK-flavored chain labels so the juice carries the band's voice.
function comboLabel(mult) {
  const labels = {
    2: 'GLITCH',
    3: 'SOJU.EXE',
    4: 'DIGITAL HARDCORE',
  };
  return labels[mult] || 'REBRAND +1%';
}

// Floating "+N" that rises from a board cell (r,c may be fractional centroids).
function spawnScorePopup(r, c, amount, color) {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;
  const pop = document.createElement('div');
  pop.className = 'score-popup';
  pop.textContent = `+${amount}`;
  pop.style.color = color;
  pop.style.left = `${((c + 0.5) / GRID_SIZE) * 100}%`;
  pop.style.top = `${((r + 0.5) / GRID_SIZE) * 100}%`;
  layer.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove());
}

// Confetti-style particle burst: a few neon squares fly out of each cleared tile.
const PARTICLE_COLORS = ['var(--chaos-pink)', 'var(--chaos-green)', 'var(--chaos-cyan)', 'var(--chaos-amber)'];

function spawnMatchBurst(coords) {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;
  coords.forEach(({ r, c }) => {
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('div');
      p.className = 'match-particle';
      const ang = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 55;
      p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
      p.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      p.style.left = `${((c + 0.5) / GRID_SIZE) * 100}%`;
      p.style.top = `${((r + 0.5) / GRID_SIZE) * 100}%`;
      layer.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  });
}

// Expanding ring at the match centroid.
function spawnShockwave(r, c, color) {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;
  const ring = document.createElement('div');
  ring.className = 'shockwave';
  ring.style.color = color;
  ring.style.left = `${((c + 0.5) / GRID_SIZE) * 100}%`;
  ring.style.top = `${((r + 0.5) / GRID_SIZE) * 100}%`;
  layer.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove());
}

// Quick scale bump on the whole board so matches land with weight.
function thumpBoard() {
  const boardEl = document.querySelector('.board-container');
  if (!boardEl) return;
  boardEl.classList.remove('thump');
  void boardEl.offsetWidth;
  boardEl.classList.add('thump');
}

// Centered combo callout with a punch-in animation; replaces any in-flight one.
function showComboCallout(text, color) {
  const layer = document.getElementById('fx-layer');
  if (!layer) return;
  let callout = document.getElementById('combo-callout');
  if (!callout) {
    callout = document.createElement('div');
    callout.id = 'combo-callout';
    layer.appendChild(callout);
  }
  callout.textContent = text;
  callout.style.color = color;
  // Restart the animation even on a rapid second call.
  callout.classList.remove('punch');
  void callout.offsetWidth;
  callout.classList.add('punch');
}

// ==========================================
// GAME PROGRESS & CHECKS
// ==========================================
function checkGameStatus() {
  if (isGameOver) return;
  
  // Check targets
  let targetsMet = true;
  if (GIGS[currentGig].scoreGoal) {
    if (currentScore < GIGS[currentGig].scoreGoal) {
      targetsMet = false;
    }
  } else {
    Object.keys(levelTargets).forEach(key => {
      if (levelTargets[key].current < levelTargets[key].total) {
        targetsMet = false;
      }
    });
  }
  
  if (targetsMet) {
    // WIN LEVEL!
    triggerLevelWinSequence();
  } else if (movesLeft <= 0) {
    // LOSE LEVEL
    triggerLevelLoseSequence();
  }
}

// ==========================================
// SOJU POUR & MATRIX CLEANSE END-GAME ANIMATION
// ==========================================
function triggerLevelWinSequence() {
  isGameOver = true;
  boardDisabled = true;

  // 1. Reveal + tilt the Soju Bottle (hidden all level; this is the payoff).
  //    Play the Wan 2.2 pour clip — CSS swaps it in over the static PNG.
  const bottle = document.getElementById('soju-bottle-pourier');
  bottle.classList.add('revealed');
  bottle.classList.add('tilting');
  const pourVideo = document.getElementById('soju-pour-video');
  if (pourVideo) {
    pourVideo.currentTime = 0;
    pourVideo.play().catch(() => {}); // autoplay can be blocked pre-interaction; static img still shows
  }

  // Pouring sound
  playSojuPourSound();
  
  // 2. Start Canvas Matrix Cleanse
  setTimeout(() => {
    const canvas = document.getElementById('matrix-canvas');
    canvas.classList.add('active');
    
    startMatrixWash();
  }, 1000);
}

function startMatrixWash() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  
  // Match width/height to container
  const boardEl = document.querySelector('.board-container');
  canvas.width = boardEl.clientWidth;
  canvas.height = boardEl.clientHeight;
  
  const columns = Math.floor(canvas.width / 14);
  matrixStreams = [];

  // Initialize streams. Each stream starts later the farther it is from the
  // center (where the bottle pours), so the rain spreads outward like a spill.
  const startTime = Date.now();
  const cx = canvas.width / 2;
  for (let i = 0; i < columns; i++) {
    const x = i * 14;
    matrixStreams[i] = {
      x: x,
      y: Math.random() * -60, // Starts just above the board
      speed: 3 + Math.random() * 5,
      startAt: startTime + (Math.abs(x - cx) / cx) * 1100 + Math.random() * 150,
      chars: []
    };
  }

  const textStrings = ["소주", "막걸리", "KAZOO", "DIDG", "GLITCH", "ERROR", "WIN95", "1", "0", "NRK", "TURBOLAG"];
  matrixActive = true;
  
  // Gradual Grid Dissolution. Dissolve the icon (not the wrapper) so each tile's
  // translate position is preserved — otherwise tiles would jump to the corner.
  const tiles = document.querySelectorAll('.tile-wrapper');
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      const icon = tile.querySelector('.tile-icon');
      if (!icon) return;
      icon.style.transition = 'all 800ms ease';
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0) rotate(90deg)';
    }, index * 8); // Rapid cascade collapse
  });
  
  matrixInterval = setInterval(() => {
    // Clear canvas slightly transparent
    ctx.fillStyle = 'rgba(5, 0, 8, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#39ff14'; // Neon Green
    ctx.font = '12px Press Start 2P, monospace';

    matrixStreams.forEach(stream => {
      // Not poured this far out yet — the spill is still spreading.
      if (Date.now() < stream.startAt) return;

      // Pick random char
      const word = textStrings[Math.floor(Math.random() * textStrings.length)];
      const char = word[Math.floor(Math.random() * word.length)];

      // Draw trails
      ctx.fillText(char, stream.x, stream.y);

      stream.y += stream.speed;

      // Reset stream if hit bottom
      if (stream.y > canvas.height) {
        stream.y = Math.random() * -50;
        stream.speed = 3 + Math.random() * 5;
      }
    });

    // Stop matrix after the pour has spread and rained (~4s)
    if (Date.now() - startTime > 4000) {
      clearInterval(matrixInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.remove('active');
      
      // Hide tilted bottle
      const bottle = document.getElementById('soju-bottle-pourier');
      bottle.classList.remove('tilting');
      
      showLevelResults(true);
    }
  }, 30);
}

function triggerLevelLoseSequence() {
  isGameOver = true;
  boardDisabled = true;
  
  // Fail buzz sound
  playSynth('sawtooth', 100, 0.8, 0.25, 40);
  
  setTimeout(() => {
    showLevelResults(false);
  }, 1000);
}

// ==========================================
// RESULTS & LEVELING LOGIC
// ==========================================
function showLevelResults(isWin) {
  const overlay = document.getElementById('overlay-result');
  const title = document.getElementById('result-title');
  const message = document.getElementById('result-message');
  const nextBtn = document.getElementById('btn-next-action');
  
  overlay.classList.add('active');
  
  if (isWin) {
    title.textContent = "GIG COMPLETE";
    title.style.color = "var(--chaos-green)";
    message.textContent = `Setlist survived. The rebrand is now ${GIGS[currentGig].confidence}% inevitable. ALL WRONGS RESERVED.`;
    
    // Apply rank and confidence changes
    const gigData = GIGS[currentGig];
    rank = gigData.rankUpgrade;
    confidence = gigData.confidence;

    // Ability unlocking — beating gig N grants its member's power-up
    // (this is what makes NULLSOFT reachable after Gig 4).
    if (gigData.unlockAbility && !unlockedAbilities.includes(gigData.unlockAbility)) {
      unlockedAbilities.push(gigData.unlockAbility);
    }

    // Level unlocking
    const nextLvl = currentGig + 1;
    if (GIGS[nextLvl] && !unlockedLevels.includes(nextLvl)) {
      unlockedLevels.push(nextLvl);
    }
    saveProgress();
    
    document.getElementById('result-score').textContent = String(currentScore).padStart(5, '0');
    document.getElementById('result-rank').textContent = rank;
    
    nextBtn.textContent = "CONTINUE TOUR";
    nextBtn.onclick = () => {
      overlay.classList.remove('active');
      updateMapScreen();
      showScreen('screen-map');
    };
  } else {
    title.textContent = "GIG FAILED";
    title.style.color = "#ff3333";
    message.textContent = "The didgeridoo cracked. The kazoos melted. The venue kicked us out.";
    
    document.getElementById('result-score').textContent = String(currentScore).padStart(5, '0');
    document.getElementById('result-rank').textContent = rank; // remains same
    
    nextBtn.textContent = "RETRY GIG";
    nextBtn.onclick = () => {
      overlay.classList.remove('active');
      selectLevel(currentGig);
    };
  }
}

function quitGame() {
  isGameOver = true;
  boardDisabled = true;
  clearSelection();
  updateMapScreen();
  showScreen('screen-map');
}

// ==========================================
// IDENTITY GLITCH — the EPK signature: the title scrambles and can't decide
// whether the band is NONROCKER or TURBOLAG. Ported from slides_raw.html.
// ==========================================
const IDENTITY_NAMES = ['NONROCKER', 'TURBOLAG', 'NONROCKER', 'TurboLag', 'NONROCKER', 'TURBOLAG', 'turbolag'];
const IDENTITY_CORRUPT = '!<>-_\\/[]{}—=+*^?#________';
let identityIdx = 0;
let identityTimer = null;

function setTitle(text) {
  const el = document.getElementById('title-logo');
  if (!el) return;
  el.textContent = text;
  el.setAttribute('data-text', text); // keep the RGB-split layers (::before/::after) in sync
}

function scrambleTitleTo(target) {
  const el = document.getElementById('title-logo');
  if (!el) return;
  let steps = 0;
  const maxSteps = 4;
  const interval = setInterval(() => {
    if (steps < maxSteps) {
      const corrupted = target
        .split('')
        .map((ch) => (Math.random() < 0.45 ? IDENTITY_CORRUPT[Math.floor(Math.random() * IDENTITY_CORRUPT.length)] : ch))
        .join('');
      setTitle(corrupted);
      steps++;
    } else {
      setTitle(target);
      clearInterval(interval);
    }
  }, 55);
}

function tickIdentity() {
  scrambleTitleTo(IDENTITY_NAMES[identityIdx % IDENTITY_NAMES.length]);
  identityIdx++;
}

function startIdentityGlitch() {
  // Respect reduced-motion: settle on the canonical name, no scrambling.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTitle('NONROCKER');
    return;
  }
  if (identityTimer) return;
  setTimeout(tickIdentity, 600);
  identityTimer = setInterval(tickIdentity, 2400);
}

// Initial Boot Sequence
window.addEventListener('load', () => {
  loadProgress();
  const sndBtn = document.getElementById('btn-sound');
  if (sndBtn) sndBtn.textContent = muted ? 'SND OFF' : 'SND ON';
  showScreen('screen-welcome');
  updateMapScreen();
  startIdentityGlitch();
});

// ==========================================
// TEST / DEBUG SEAM
// Top-level `let` bindings (board, currentScore, levelTargets) are script-scoped
// and not reachable from page.evaluate(); expose them here for automated QA.
// Harmless in production.
// ==========================================
window.__game = {
  getBoard: () => board,
  setBoard: (b) => { board = b; drawGridDOM(); },
  getScore: () => currentScore,
  getMovesLeft: () => movesLeft,
  getLevelTargets: () => levelTargets,
  setLevelTargets: (t) => { levelTargets = t; },
  setMovesLeft: (m) => { movesLeft = m; },
  getComboCount: () => comboCount,
  findMatches,
  applyGravity,
  triggerSwap,
  checkGameStatus,
  hasPossibleMove,
  reshuffleBoard,
  selectLevel,
  showScreen,
  GRID_SIZE,
  PIECE_KEYS,
};
