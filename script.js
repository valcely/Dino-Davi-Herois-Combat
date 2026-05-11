/* DINO DAVI HERÓIS COMBAT - Script Completo */

const canvas = document.getElementById(‘gameCanvas’);
const ctx = canvas.getContext(‘2d’);
ctx.imageSmoothingEnabled = false;

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

/* DADOS DE HERÓIS */
const HEROES = {
davi: {
name: ‘DINO DAVI’,
emoji: ‘👑’,
color: ‘#00dd00’,
accent: ‘#44ff44’,
hp: 140,
dmg: 16,
speed: 10,
power: ‘Verde Supremo’
},
mamae: {
name: ‘DINO MAMAE’,
emoji: ‘💖’,
color: ‘#ff1177’,
accent: ‘#ff66bb’,
hp: 140,
dmg: 15,
speed: 9,
power: ‘Rosa Cristal’
},
papai: {
name: ‘DINO PAPAI’,
emoji: ‘⚡’,
color: ‘#ff2200’,
accent: ‘#ff6644’,
hp: 125,
dmg: 14,
speed: 8,
power: ‘Vermelho Raio’
},
vovo: {
name: ‘DINO VOVO’,
emoji: ‘🌙’,
color: ‘#bb44ff’,
accent: ‘#dd88ff’,
hp: 130,
dmg: 13,
speed: 10,
power: ‘Roxo Magia’
},
vova: {
name: ‘DINO VOVA’,
emoji: ‘⛰️’,
color: ‘#0066ff’,
accent: ‘#44aaff’,
hp: 135,
dmg: 12,
speed: 6,
power: ‘Azul Escudo’
},
tiatina: {
name: ‘TITIA TINA’,
emoji: ‘✨’,
color: ‘#ffdd00’,
accent: ‘#ffff44’,
hp: 115,
dmg: 11,
speed: 9,
power: ‘Amarelo Luz’
},
tiagio: {
name: ‘TITIA GIO’,
emoji: ‘🌊’,
color: ‘#00dddd’,
accent: ‘#44ffff’,
hp: 118,
dmg: 12,
speed: 8,
power: ‘Azul Bebe’
},
tobby: {
name: ‘TOBBY’,
emoji: ‘💨’,
color: ‘#ffffff’,
accent: ‘#44ddff’,
hp: 108,
dmg: 11,
speed: 13,
power: ‘Branco Veloz’
},
atena: {
name: ‘ATENA’,
emoji: ‘🌌’,
color: ‘#cc8844’,
accent: ‘#ffaa66’,
hp: 128,
dmg: 15,
speed: 9,
power: ‘Caramelo Cosmos’
}
};

/* DADOS DE INIMIGOS */
const ENEMIES = {
caos: {
name: ‘CORINGA CAOTICO’,
emoji: ‘🤡’,
color: ‘#9900ff’,
accent: ‘#ff44ff’,
hp: 120,
dmg: 15
},
alien: {
name: ‘CONQUISTADOR GALAXICO’,
emoji: ‘👽’,
color: ‘#00aaff’,
accent: ‘#ffff00’,
hp: 180,
dmg: 18
},
tech: {
name: ‘SENHOR TECNOLOGICO’,
emoji: ‘🤖’,
color: ‘#ff6600’,
accent: ‘#ffff00’,
hp: 140,
dmg: 16
},
sombra: {
name: ‘LAMINA SOMBRIA’,
emoji: ‘⚫’,
color: ‘#1a1a1a’,
accent: ‘#ff0000’,
hp: 130,
dmg: 17
},
monstro: {
name: ‘TITA MONSTRUOSO’,
emoji: ‘👹’,
color: ‘#666666’,
accent: ‘#ff3333’,
hp: 220,
dmg: 19
},
psi: {
name: ‘MESTRE MENTAL’,
emoji: ‘🧠’,
color: ‘#4400ff’,
accent: ‘#00ffff’,
hp: 125,
dmg: 14
},
mutante: {
name: ‘CIENTISTA MUTANTE’,
emoji: ‘🧬’,
color: ‘#00ff00’,
accent: ‘#ffff00’,
hp: 135,
dmg: 16
},
rei: {
name: ‘REI SOMBRIO’,
emoji: ‘👑’,
color: ‘#4d3319’,
accent: ‘#ffd700’,
hp: 160,
dmg: 17
},
destruidor: {
name: ‘DESTRUIDOR UNIVERSAL’,
emoji: ‘☠️’,
color: ‘#000000’,
accent: ‘#ff0000’,
hp: 300,
dmg: 22
}
};

/* ESTADO GLOBAL */
let gameState = ‘menu’;
let selectedHero = null;
let selectedEnemy = null;
let gameRunning = false;
let gameFrame = 0;

const player = {
x: 100,
y: 0,
vx: 0,
vy: 0,
hp: 100,
maxHp: 100,
dmg: 10,
onGround: false,
jumping: false,
attacking: false,
frame: 0,
invuln: 0
};

const enemy = {
x: 0,
y: 0,
hp: 100,
maxHp: 100,
dmg: 10,
attacking: false,
frame: 0,
attackCooldown: 0,
state: ‘idle’
};

let distance = 0;
let score = 0;
let combo = 0;
let audioContext = null;

/* AUDIO */
function initAudio() {
if (!audioContext) {
audioContext = new (window.AudioContext || window.webkitAudioContext)();
}
}

function playSound(type, duration = 0.1, frequency = 400) {
try {
if (!audioContext) initAudio();

```
const now = audioContext.currentTime;
const osc = audioContext.createOscillator();
const gain = audioContext.createGain();

osc.connect(gain);
gain.connect(audioContext.destination);

gain.gain.setValueAtTime(0.3, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

osc.type = 'square';

switch(type) {
  case 'jump':
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration);
    break;
  case 'land':
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    break;
  case 'attack':
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration * 0.5);
    break;
  case 'hit':
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + duration);
    gain.gain.setValueAtTime(0.5, now);
    break;
  case 'select':
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + duration * 0.5);
    break;
  case 'win':
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + duration);
    break;
  case 'lose':
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    break;
}

osc.start(now);
osc.stop(now + duration);
```

} catch (e) {
console.log(‘Audio error:’, e);
}
}

function showToast(text) {
const toast = document.getElementById(‘toast’);
toast.textContent = text;
toast.classList.remove(‘hidden’);
setTimeout(() => toast.classList.add(‘hidden’), 2000);
}

/* NAVEGACAO */
function hideAllScreens() {
document.getElementById(‘menuScreen’).classList.add(‘hidden’);
document.getElementById(‘heroSelectScreen’).classList.add(‘hidden’);
document.getElementById(‘enemySelectScreen’).classList.add(‘hidden’);
document.getElementById(‘gameScreen’).classList.add(‘hidden’);
document.getElementById(‘winScreen’).classList.add(‘hidden’);
document.getElementById(‘loseScreen’).classList.add(‘hidden’);
document.getElementById(‘howToScreen’).classList.add(‘hidden’);
}

function goToMenu() {
playSound(‘select’, 0.1);
hideAllScreens();
gameState = ‘menu’;
document.getElementById(‘menuScreen’).classList.remove(‘hidden’);
}

function goToHeroSelect() {
playSound(‘select’, 0.1);
hideAllScreens();
gameState = ‘heroSelect’;
document.getElementById(‘heroSelectScreen’).classList.remove(‘hidden’);
buildHeroGrid();
}

function selectHero(heroId) {
playSound(‘select’, 0.15);
selectedHero = heroId;
const h = HEROES[heroId];
player.maxHp = h.hp;
player.hp = h.hp;
player.dmg = h.dmg;

hideAllScreens();
gameState = ‘enemySelect’;
document.getElementById(‘enemySelectScreen’).classList.remove(‘hidden’);
buildEnemyGrid();
}

function selectEnemy(enemyId) {
playSound(‘select’, 0.15);
selectedEnemy = enemyId;
const e = ENEMIES[enemyId];
enemy.maxHp = e.hp;
enemy.hp = e.hp;
enemy.dmg = e.dmg;

initGame();
}

function goToHowTo() {
playSound(‘select’, 0.1);
hideAllScreens();
gameState = ‘howTo’;
document.getElementById(‘howToScreen’).classList.remove(‘hidden’);
}

/* CONSTRUIR GRIDS */
function buildHeroGrid() {
const grid = document.getElementById(‘heroGrid’);
grid.innerHTML = ‘’;

Object.entries(HEROES).forEach(([id, hero]) => {
const card = document.createElement(‘div’);
card.className = ‘hero-card’;
card.style.borderColor = hero.accent;
card.innerHTML = `<div class="card-emoji">${hero.emoji}</div> <div class="card-name">${hero.name}</div> <div class="card-stats">HP: ${hero.hp}</div>`;
card.onclick = () => selectHero(id);
grid.appendChild(card);
});
}

function buildEnemyGrid() {
const grid = document.getElementById(‘enemyGrid’);
grid.innerHTML = ‘’;

Object.entries(ENEMIES).forEach(([id, enemy]) => {
const card = document.createElement(‘div’);
card.className = ‘enemy-card’;
card.style.borderColor = enemy.accent;
card.innerHTML = `<div class="card-emoji">${enemy.emoji}</div> <div class="card-name">${enemy.name}</div> <div class="card-stats">HP: ${enemy.hp}</div>`;
card.onclick = () => selectEnemy(id);
grid.appendChild(card);
});
}

/* INICIALIZAR JOGO */
function initGame() {
playSound(‘levelup’, 0.2);

const h = HEROES[selectedHero];
const e = ENEMIES[selectedEnemy];

player.x = 100;
player.y = H - 150;
player.hp = h.hp;
player.maxHp = h.hp;
player.dmg = h.dmg;
player.vx = 0;
player.vy = 0;
player.onGround = true;
player.invuln = 0;
player.frame = 0;

enemy.x = W - 150;
enemy.y = H - 150;
enemy.hp = e.hp;
enemy.maxHp = e.hp;
enemy.dmg = e.dmg;
enemy.attackCooldown = 0;
enemy.state = ‘idle’;
enemy.frame = 0;

distance = 0;
score = 0;
combo = 0;
gameFrame = 0;
gameRunning = true;

hideAllScreens();
gameState = ‘game’;
document.getElementById(‘gameScreen’).classList.remove(‘hidden’);
updateHUD();
}

/* UPDATE */
function updateGame() {
if (!gameRunning) return;

gameFrame++;
player.frame++;
enemy.frame++;

/* FÍSICA */
player.vy += 0.6;
player.y += player.vy;

if (player.y >= H - 50) {
player.y = H - 50;
player.vy = 0;
player.onGround = true;
if (player.jumping) {
playSound(‘land’, 0.08);
player.jumping = false;
}
} else {
player.onGround = false;
}

player.x += player.vx;
if (player.x < 0) player.x = 0;
if (player.x > W - 40) player.x = W - 40;

if (player.invuln > 0) player.invuln–;

/* IA INIMIGO */
const dist = Math.abs(player.x - enemy.x);

if (enemy.attackCooldown > 0) {
enemy.attackCooldown–;
}

if (enemy.state === ‘idle’) {
if (dist < 300 && Math.random() < 0.02) {
enemy.state = ‘attacking’;
enemy.frame = 0;
}
} else if (enemy.state === ‘attacking’) {
enemy.frame++;
if (enemy.frame > 20) {
if (dist < 150 && player.invuln === 0) {
hitPlayer(enemy.dmg);
}
enemy.state = ‘idle’;
enemy.attackCooldown = 120;
}
}

/* COLISAO */
if (dist < 40 && player.invuln === 0) {
hitPlayer(5);
}

/* VITÓRIA/DERROTA */
if (enemy.hp <= 0) {
gameRunning = false;
playSound(‘win’, 0.3);
showVictory();
return;
}

if (player.hp <= 0) {
gameRunning = false;
playSound(‘lose’, 0.3);
showDefeat();
return;
}

distance += 0.5;
score = Math.floor(distance) + combo * 100;
}

function jumpPlayer() {
if (!gameRunning) return;
if (player.onGround && !player.jumping) {
player.vy = -15;
player.jumping = true;
player.onGround = false;
playSound(‘jump’, 0.1);
}
}

function attackPlayer() {
if (!gameRunning) return;
playSound(‘attack’, 0.12);
player.attacking = true;

const dmg = player.dmg + Math.random() * 3;
const dist = Math.abs(player.x - enemy.x);

if (dist < 100) {
enemy.hp -= dmg;
playSound(‘hit’, 0.1);
combo++;
score += combo * 10;
if (enemy.hp > 0) {
showToast(‘ACERTOU! -’ + Math.round(dmg) + ’ HP’);
}
}

setTimeout(() => { player.attacking = false; }, 300);
}

function hitPlayer(dmg) {
if (player.invuln > 0) return;
player.hp -= dmg;
player.invuln = 120;
playSound(‘hit’, 0.15);
combo = 0;
showToast(‘ACERTOU! -’ + dmg + ’ HP’);
}

function updateHUD() {
const h = HEROES[selectedHero];
const e = ENEMIES[selectedEnemy];

document.getElementById(‘heroName’).textContent = h.name;
document.getElementById(‘heroHP’).textContent = Math.max(0, player.hp) + ‘/’ + player.maxHp;
document.getElementById(‘heroHPFill’).style.width = Math.max(0, player.hp / player.maxHp * 100) + ‘%’;

document.getElementById(‘enemyName’).textContent = e.name;
document.getElementById(‘enemyHP’).textContent = Math.max(0, enemy.hp) + ‘/’ + enemy.maxHp;
document.getElementById(‘enemyHPFill’).style.width = Math.max(0, enemy.hp / enemy.maxHp * 100) + ‘%’;

document.getElementById(‘distance’).textContent = Math.floor(distance) + ‘m’;
document.getElementById(‘score’).textContent = Math.floor(score) + ’ pts’;
}

function showVictory() {
hideAllScreens();
gameState = ‘win’;
document.getElementById(‘winScreen’).classList.remove(‘hidden’);
document.getElementById(‘winStats’).innerHTML = `VITORIA!<br> ${Math.floor(distance)}m | ${Math.floor(score)} pts | ${combo} combo`;
}

function showDefeat() {
hideAllScreens();
gameState = ‘lose’;
document.getElementById(‘loseScreen’).classList.remove(‘hidden’);
document.getElementById(‘loseStats’).innerHTML = `DERROTA<br> ${Math.floor(distance)}m | ${Math.floor(score)} pts`;
}

/* RENDER */
function drawPixelHero(x, y, heroId) {
const h = HEROES[heroId];
if (!h) return;

const col = h.color;
const accent = h.accent;
const bob = Math.sin(gameFrame * 0.05) * 2;

ctx.fillStyle = col;
ctx.globalAlpha = 0.3;
ctx.fillRect(x - 20, y - 20 + bob, 40, 60);
ctx.globalAlpha = 1;

ctx.fillStyle = col;
ctx.fillRect(x - 10, y + bob, 20, 30);

ctx.fillStyle = accent;
ctx.fillRect(x - 6, y + 8 + bob, 12, 8);

ctx.fillStyle = col;
ctx.fillRect(x - 8, y - 15 + bob, 16, 14);

ctx.fillStyle = accent;
ctx.fillRect(x - 5, y - 12 + bob, 3, 3);
ctx.fillRect(x + 2, y - 12 + bob, 3, 3);

ctx.fillStyle = col;
const legBob = Math.sin(gameFrame * 0.1) * 2;
ctx.fillRect(x - 6, y + 30 + legBob + bob, 4, 10);
ctx.fillRect(x + 2, y + 30 - legBob + bob, 4, 10);
}

function drawPixelEnemy(x, y, enemyId) {
const e = ENEMIES[enemyId];
if (!e) return;

const col = e.color;
const accent = e.accent;
const shake = Math.random() * 2 - 1;

ctx.globalAlpha = 0.2;
ctx.fillStyle = accent;
ctx.fillRect(x - 20 + shake, y - 20, 40, 60);
ctx.globalAlpha = 1;

ctx.fillStyle = col;
ctx.fillRect(x - 10 + shake, y, 20, 30);

ctx.fillStyle = accent;
ctx.fillRect(x - 8 + shake, y + 8, 16, 6);

ctx.fillStyle = col;
ctx.fillRect(x - 8 + shake, y - 15, 16, 14);

ctx.fillStyle = accent;
ctx.fillRect(x - 5 + shake, y - 12, 3, 3);
ctx.fillRect(x + 2 + shake, y - 12, 3, 3);

ctx.fillStyle = col;
ctx.fillRect(x - 6 + shake, y + 30, 4, 10);
ctx.fillRect(x + 2 + shake, y + 30, 4, 10);
}

function render() {
ctx.fillStyle = ‘#0a0a14’;
ctx.fillRect(0, 0, W, H);

const gradTop = ctx.createLinearGradient(0, 0, 0, H * 0.4);
gradTop.addColorStop(0, ‘#1a1a2e’);
gradTop.addColorStop(1, ‘#3a3a5e’);
ctx.fillStyle = gradTop;
ctx.fillRect(0, 0, W, H * 0.4);

ctx.fillStyle = ‘#6b5344’;
ctx.fillRect(0, H - 50, W, 50);

ctx.fillStyle = ‘#8b7354’;
for (let i = 0; i < W; i += 80) {
ctx.fillRect(i - (gameFrame % 80), H - 45, 60, 3);
}

if (gameState === ‘game’ && gameRunning) {
drawPixelHero(player.x, player.y, selectedHero);

```
if (player.invuln > 0 && Math.floor(player.invuln / 8) % 2 === 0) {
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(player.x - 20, player.y - 20, 40, 60);
  ctx.globalAlpha = 1;
}

drawPixelEnemy(enemy.x, enemy.y, selectedEnemy);

const hpBarWidth = 100;
ctx.fillStyle = '#000';
ctx.fillRect(enemy.x - hpBarWidth / 2, enemy.y - 50, hpBarWidth, 8);
ctx.fillStyle = '#ff0000';
ctx.fillRect(enemy.x - hpBarWidth / 2, enemy.y - 50, hpBarWidth * Math.max(0, enemy.hp / enemy.maxHp), 8);
ctx.strokeStyle = '#fff';
ctx.lineWidth = 1;
ctx.strokeRect(enemy.x - hpBarWidth / 2, enemy.y - 50, hpBarWidth, 8);
```

}
}

/* CONTROLES */
document.addEventListener(‘keydown’, (e) => {
if (gameState !== ‘game’) return;
if (e.code === ‘Space’ || e.code === ‘ArrowUp’ || e.code === ‘KeyW’) {
e.preventDefault();
jumpPlayer();
} else if (e.code === ‘KeyZ’ || e.code === ‘KeyX’) {
e.preventDefault();
attackPlayer();
}
});

/* GAME LOOP */
function gameLoop() {
if (gameState === ‘game’ && gameRunning) {
updateGame();
updateHUD();
}

render();
requestAnimationFrame(gameLoop);
}

/* RESIZE */
window.addEventListener(‘resize’, () => {
W = canvas.width = window.innerWidth;
H = canvas.height = window.innerHeight;
});

/* INICIAR */
document.addEventListener(‘click’, initAudio);
document.addEventListener(‘touchstart’, initAudio);

goToMenu();
gameLoop();