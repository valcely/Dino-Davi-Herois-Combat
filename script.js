let currentScreen = ‘homeScreen’;
let gameStartTime = Date.now();
let globalPlaytime = 0;
let playtimeInterval = null;

let soundEnabled = true;
let musicEnabled = true;
let vibrationEnabled = true;
let brightness = 1;

let selectedCharacterPlayer1 = null;
let selectedCharacterPlayer2 = null;
let gameMode = ‘1p’;

let battleState = {
player1: {
name: ‘Dino Herói’,
character: ‘dino-hero’,
health: 100,
maxHealth: 100,
special: 0,
maxSpecial: 100
},
player2: {
name: ‘Dino Vilão’,
character: ‘dino-villain’,
health: 100,
maxHealth: 100,
special: 0,
maxSpecial: 100
},
currentTurn: ‘player1’,
battleLog: []
};

let memoryState = {
cards: [],
flipped: [],
matched: [],
moves: 0,
pairs: 0,
startTime: null,
difficulty: ‘medium’,
isAnimating: false
};

let paintState = {
selectedTool: ‘brush’,
selectedColor: ‘#000000’,
brushSize: 10,
canvas: null,
context: null,
isDrawing: false,
history: []
};

const characters = [
{
id: ‘dino-hero’,
name: ‘Dino Herói’,
emoji: ‘🦕’,
type: ‘hero’,
stats: { speed: 8, strength: 7, defense: 6 }
},
{
id: ‘dino-rex’,
name: ‘T-Rex’,
emoji: ‘🦖’,
type: ‘hero’,
stats: { speed: 5, strength: 10, defense: 8 }
},
{
id: ‘dino-triceratops’,
name: ‘Tricerátops’,
emoji: ‘🦕’,
type: ‘hero’,
stats: { speed: 6, strength: 8, defense: 9 }
},
{
id: ‘dino-stegosaurus’,
name: ‘Estegossauro’,
emoji: ‘🦕’,
type: ‘hero’,
stats: { speed: 7, strength: 8, defense: 8 }
},
{
id: ‘dino-villain’,
name: ‘Dino Vilão’,
emoji: ‘🦖’,
type: ‘villain’,
stats: { speed: 7, strength: 9, defense: 7 }
},
{
id: ‘dino-boss’,
name: ‘Rei dos Dinos’,
emoji: ‘🦖’,
type: ‘villain’,
stats: { speed: 4, strength: 10, defense: 10 }
},
{
id: ‘dino-anky’,
name: ‘Anquilossauro’,
emoji: ‘🦕’,
type: ‘villain’,
stats: { speed: 3, strength: 8, defense: 10 }
},
{
id: ‘dino-raptor’,
name: ‘Velocirrátor’,
emoji: ‘🦖’,
type: ‘villain’,
stats: { speed: 10, strength: 7, defense: 5 }
}
];

const defaultPalette = [
‘#000000’, ‘#FFFFFF’, ‘#FF0000’, ‘#00FF00’, ‘#0000FF’,
‘#FFFF00’, ‘#FF00FF’, ‘#00FFFF’, ‘#FFA500’, ‘#800080’,
‘#FFC0CB’, ‘#A52A2A’, ‘#808080’, ‘#FFF0F5’, ‘#FFB6C1’
];

function initGame() {
loadGameSettings();
startGlobalClock();
startPlaytimeCounter();
initHomeScreen();
drawStarCanvas();
}

function loadGameSettings() {
const saved = localStorage.getItem(‘daviDinoSettings’);
if (saved) {
const settings = JSON.parse(saved);
soundEnabled = settings.sound !== false;
musicEnabled = settings.music !== false;
vibrationEnabled = settings.vibration !== false;
brightness = settings.brightness || 1;
}
}

function saveGameSettings() {
const settings = {
sound: soundEnabled,
music: musicEnabled,
vibration: vibrationEnabled,
brightness: brightness
};
localStorage.setItem(‘daviDinoSettings’, JSON.stringify(settings));
}

function changeBrightness(value) {
brightness = parseFloat(value);
document.body.style.filter = `brightness(${brightness})`;
const brightnessValue = document.getElementById(‘brightnessValue’);
if (brightnessValue) {
brightnessValue.textContent = Math.round(brightness * 100) + ‘%’;
}
saveGameSettings();
}

function changeLanguage(lang) {
localStorage.setItem(‘daviDinoLanguage’, lang);
}

function resetGameData() {
if (confirm(‘⚠️ Tem certeza que deseja limpar TODOS os dados do jogo?\n\nEsta ação não pode ser desfeita!’)) {
localStorage.clear();
location.reload();
}
}

if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, initGame);
} else {
initGame();
}
function showScreen(screenId) {
const screens = document.querySelectorAll(’.screen’);
screens.forEach(screen => {
screen.classList.add(‘hidden’);
});

const targetScreen = document.getElementById(screenId);
if (targetScreen) {
targetScreen.classList.remove(‘hidden’);
currentScreen = screenId;
}
}

function goToHome() {
showScreen(‘homeScreen’);
initHomeScreen();
playSound(‘select’);
}

function goToSelect() {
showScreen(‘selectScreen’);
initSelectScreen();
}

function goToBattle() {
goToSelect();
}

function goToMemory() {
showScreen(‘memoryScreen’);
initMemoryGame();
playSound(‘select’);
}

function goToPaint() {
showScreen(‘paintScreen’);
initPaintScreen();
playSound(‘select’);
}

function goToSettings() {
showScreen(‘settingsScreen’);
playSound(‘select’);
}

function initHomeScreen() {
drawHomePreview();
updateGlobalHeader();
}

function drawHomePreview() {
const canvas = document.getElementById(‘homePreviewCanvas’);
if (!canvas) return;

const ctx = canvas.getContext(‘2d’);
ctx.clearRect(0, 0, canvas.width, canvas.height);

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, ‘#1a1a2e’);
gradient.addColorStop(1, ‘#0f0f1e’);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.font = ‘bold 48px Arial’;
ctx.textAlign = ‘center’;

const time = Date.now() / 1000;
const offsetY = Math.sin(time) * 10;

ctx.fillText(‘🦕’, canvas.width / 3, canvas.height / 2 + offsetY);
ctx.fillText(‘🦖’, canvas.width / 2, canvas.height / 2 - offsetY);
ctx.fillText(‘🦕’, (canvas.width * 2) / 3, canvas.height / 2 + offsetY);
}

function initSelectScreen() {
renderCharacterGrid();
updateVSPreview();
}

function renderCharacterGrid() {
const grid = document.querySelector(’.character-grid’);
if (!grid) return;

grid.innerHTML = ‘’;

characters.forEach(char => {
const card = document.createElement(‘div’);
card.className = ‘character-card’;
card.innerHTML = `<div class="char-emoji">${char.emoji}</div> <div class="char-name">${char.name}</div> <div class="char-type">${char.type === 'hero' ? '⭐ Herói' : '👿 Vilão'}</div>`;

```
card.onclick = () => selectCharacter(char.id);
grid.appendChild(card);
```

});
}

function selectCharacter(characterId) {
if (gameMode === ‘1p’) {
selectedCharacterPlayer1 = characterId;
selectedCharacterPlayer2 = ‘dino-villain’;
} else {
selectedCharacterPlayer1 = characterId;
}

updateVSPreview();
const confirmBtn = document.getElementById(‘confirmSelectBtn’);
if (confirmBtn) confirmBtn.disabled = false;
playSound(‘select’);
}

function switchMode(mode) {
gameMode = mode;

document.querySelectorAll(’.mode-tab’).forEach(btn => btn.classList.remove(‘active’));
if (event && event.target) {
event.target.classList.add(‘active’);
}

playSound(‘select’);
}

function updateVSPreview() {
const char1 = characters.find(c => c.id === selectedCharacterPlayer1);
const char2 = characters.find(c => c.id === selectedCharacterPlayer2);

if (char1) {
drawCharacterPreview(document.getElementById(‘vsPlayerCanvas’), char1);
}
if (char2) {
drawCharacterPreview(document.getElementById(‘vsOpponentCanvas’), char2);
}
}

function drawCharacterPreview(canvas, character) {
if (!canvas) return;

const ctx = canvas.getContext(‘2d’);
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = ‘#1a1a2e’;
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.font = ‘bold 60px Arial’;
ctx.textAlign = ‘center’;
ctx.textBaseline = ‘middle’;
ctx.fillText(character.emoji, canvas.width / 2, canvas.height / 2);
}

function confirmSelection() {
if (!selectedCharacterPlayer1) {
alert(‘⚠️ Selecione um dinossauro para continuar!’);
return;
}

playSound(‘confirm’);
startBattle();
}
function startBattle() {
showScreen(‘battleScreen’);
initBattleScreen();
playSound(‘battle-start’);
}

function initBattleScreen() {
const char1 = characters.find(c => c.id === selectedCharacterPlayer1);
const char2 = characters.find(c => c.id === selectedCharacterPlayer2);

if (!char1 || !char2) {
return;
}

battleState.player1.name = char1.name;
battleState.player1.character = char1.id;

battleState.player2.name = char2.name;
battleState.player2.character = char2.id;

battleState.player1.health = battleState.player1.maxHealth;
battleState.player2.health = battleState.player2.maxHealth;
battleState.player1.special = 0;
battleState.player2.special = 0;
battleState.battleLog = [];
battleState.currentTurn = ‘player1’;

updateBattleHUD();
drawBattleBackground();
updateBattleLog(char1.name + ’ vs ’ + char2.name + ’ - A batalha começou!’);
}

function updateBattleHUD() {
document.getElementById(‘battlePlayer1Name’).textContent = battleState.player1.name;
document.getElementById(‘battlePlayer2Name’).textContent = battleState.player2.name;

document.getElementById(‘player1Health’).textContent = Math.max(0, battleState.player1.health);
document.getElementById(‘player2Health’).textContent = Math.max(0, battleState.player2.health);

const p1HealthPercent = (battleState.player1.health / battleState.player1.maxHealth) * 100;
const p2HealthPercent = (battleState.player2.health / battleState.player2.maxHealth) * 100;

document.getElementById(‘player1HealthFill’).style.width = Math.max(0, p1HealthPercent) + ‘%’;
document.getElementById(‘player2HealthFill’).style.width = Math.max(0, p2HealthPercent) + ‘%’;

document.getElementById(‘player1SpecialFill’).style.width = Math.max(0, battleState.player1.special) + ‘%’;
document.getElementById(‘player2SpecialFill’).style.width = Math.max(0, battleState.player2.special) + ‘%’;
}

function drawBattleBackground() {
const canvas = document.getElementById(‘battleBackgroundCanvas’);
if (!canvas) return;

const ctx = canvas.getContext(‘2d’);
ctx.clearRect(0, 0, canvas.width, canvas.height);

const dayProgress = (new Date().getHours() % 12) / 12;
const isDaytime = dayProgress > 0.25 && dayProgress < 0.75;

if (isDaytime) {
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, ‘#87CEEB’);
gradient.addColorStop(1, ‘#90EE90’);
ctx.fillStyle = gradient;
} else {
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, ‘#001a33’);
gradient.addColorStop(1, ‘#003d66’);
ctx.fillStyle = gradient;
}

ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = ‘#228B22’;
ctx.fillRect(50, canvas.height - 100, 40, 100);
ctx.fillStyle = ‘#00AA00’;
ctx.beginPath();
ctx.moveTo(70, canvas.height - 100);
ctx.lineTo(50, canvas.height - 140);
ctx.lineTo(90, canvas.height - 140);
ctx.fill();

ctx.fillStyle = ‘#228B22’;
ctx.fillRect(canvas.width - 90, canvas.height - 100, 40, 100);
ctx.fillStyle = ‘#00AA00’;
ctx.beginPath();
ctx.moveTo(canvas.width - 70, canvas.height - 100);
ctx.lineTo(canvas.width - 90, canvas.height - 140);
ctx.lineTo(canvas.width - 50, canvas.height - 140);
ctx.fill();
}

function handleActionStart(action) {
vibrateDevice(30);

switch(action) {
case ‘jump’:
performBattleAction(‘jump’);
break;
case ‘attack’:
performBattleAction(‘attack’);
break;
case ‘attack2’:
performBattleAction(‘attack2’);
break;
case ‘special’:
performBattleAction(‘special’);
break;
}
}

function handleActionEnd() {
}

function updateBattleLog(message) {
battleState.battleLog.push(message);
const logDiv = document.getElementById(‘battleLog’);

if (logDiv) {
const logEntry = document.createElement(‘p’);
logEntry.textContent = message;
logDiv.appendChild(logEntry);
logDiv.scrollTop = logDiv.scrollHeight;
}
}

function performBattleAction(actionType) {
const attacker = battleState.currentTurn === ‘player1’ ? battleState.player1 : battleState.player2;
const defender = battleState.currentTurn === ‘player1’ ? battleState.player2 : battleState.player1;

let damage = 0;
let specialGain = 10;

switch(actionType) {
case ‘jump’:
updateBattleLog(attacker.name + ’ pulou para o alto!’);
specialGain = 15;
playSound(‘select’);
break;

```
case 'attack':
  damage = Math.floor(Math.random() * 10) + 15;
  updateBattleLog(attacker.name + ' atacou causando ' + damage + ' de dano!');
  specialGain = 20;
  playSound('hit');
  break;
  
case 'attack2':
  damage = Math.floor(Math.random() * 15) + 20;
  updateBattleLog(attacker.name + ' usou Ataque 2 causando ' + damage + ' de dano!');
  specialGain = 25;
  playSound('hit');
  break;
  
case 'special':
  if (attacker.special < 100) {
    updateBattleLog(attacker.name + ' não tem especial carregado!');
    playSound('nomatch');
    return;
  }
  damage = Math.floor(Math.random() * 20) + 30;
  updateBattleLog(attacker.name + ' usou ESPECIAL causando ' + damage + ' de dano!');
  attacker.special = 0;
  playSound('special');
  break;
```

}

defender.health -= damage;
attacker.special = Math.min(100, attacker.special + specialGain);

if (defender.health <= 0) {
defender.health = 0;
endBattle(attacker);
} else {
battleState.currentTurn = battleState.currentTurn === ‘player1’ ? ‘player2’ : ‘player1’;

```
if (battleState.currentTurn === 'player2' && selectedCharacterPlayer2 !== 'manual') {
  setTimeout(() => {
    performAIAction();
  }, 1000);
}
```

}

updateBattleHUD();
}

function performAIAction() {
const random = Math.random();

if (random < 0.3) {
performBattleAction(‘attack’);
} else if (random < 0.6) {
performBattleAction(‘attack2’);
} else if (random < 0.9 && battleState.player2.special >= 100) {
performBattleAction(‘special’);
} else {
performBattleAction(‘jump’);
}
}

function endBattle(winner) {
showScreen(‘resultScreen’);
displayBattleResult(winner);
}

function displayBattleResult(winner) {
const isVictory = winner.character === selectedCharacterPlayer1;

document.getElementById(‘resultStatus’).textContent = isVictory ? ‘🎉 VITÓRIA!’ : ‘😢 DERROTA!’;
document.getElementById(‘resultWinnerName’).textContent = winner.name;
document.getElementById(‘resultMessage’).textContent = isVictory ? ‘Parabéns! Você venceu a batalha!’ : ‘Você foi derrotado. Tente novamente!’;

const points = isVictory ? 1500 : 500;
document.getElementById(‘resultPoints’).textContent = points;

playSound(‘victory’);
vibrateDevice([100, 50, 100]);
}
function initMemoryGame() {
memoryState.startTime = Date.now();
memoryState.moves = 0;
memoryState.pairs = 0;
memoryState.matched = [];
memoryState.flipped = [];
memoryState.isAnimating = false;

generateMemoryCards();
renderMemoryBoard();
startMemoryTimer();

updateMemoryStats();
}

function generateMemoryCards() {
const difficulty = memoryState.difficulty || ‘medium’;
let pairCount = 6;

if (difficulty === ‘easy’) pairCount = 4;
if (difficulty === ‘medium’) pairCount = 6;
if (difficulty === ‘hard’) pairCount = 8;

const cardTypes = characters.slice(0, pairCount);
memoryState.cards = [];

cardTypes.forEach(char => {
memoryState.cards.push({ id: char.id, emoji: char.emoji, name: char.name });
memoryState.cards.push({ id: char.id, emoji: char.emoji, name: char.name });
});

for (let i = memoryState.cards.length - 1; i > 0; i–) {
const j = Math.floor(Math.random() * (i + 1));
const temp = memoryState.cards[i];
memoryState.cards[i] = memoryState.cards[j];
memoryState.cards[j] = temp;
}
}

function renderMemoryBoard() {
const board = document.querySelector(’.memory-board’);
if (!board) return;

board.innerHTML = ‘’;

const gridSize = memoryState.cards.length / 2;
if (gridSize === 4) {
board.className = ‘memory-board memory-grid-4’;
} else if (gridSize === 6) {
board.className = ‘memory-board memory-grid-6’;
} else if (gridSize === 8) {
board.className = ‘memory-board memory-grid-8’;
}

memoryState.cards.forEach((card, index) => {
const cardElement = document.createElement(‘div’);
cardElement.className = ‘memory-card’;
cardElement.dataset.index = index;
cardElement.dataset.id = card.id;

```
cardElement.innerHTML = `
  <div class="card-inner">
    <div class="card-front">?</div>
    <div class="card-back">${card.emoji}</div>
  </div>
`;

cardElement.onclick = () => flipMemoryCard(index);
board.appendChild(cardElement);
```

});
}

function flipMemoryCard(index) {
if (memoryState.isAnimating) return;
if (memoryState.flipped.includes(index)) return;
if (memoryState.matched.includes(index)) return;

memoryState.flipped.push(index);
const cardElement = document.querySelector(`.memory-card[data-index="${index}"]`);
cardElement.classList.add(‘flipped’);

playSound(‘flip’);

if (memoryState.flipped.length === 2) {
checkMemoryMatch();
}
}

function checkMemoryMatch() {
memoryState.isAnimating = true;
memoryState.moves++;

const index1 = memoryState.flipped[0];
const index2 = memoryState.flipped[1];

const card1 = memoryState.cards[index1];
const card2 = memoryState.cards[index2];

const isMatch = card1.id === card2.id;

if (isMatch) {
memoryState.matched.push(index1, index2);
memoryState.pairs++;
playSound(‘match’);

```
setTimeout(() => {
  const cardElement1 = document.querySelector(`.memory-card[data-index="${index1}"]`);
  const cardElement2 = document.querySelector(`.memory-card[data-index="${index2}"]`);
  
  if (cardElement1) cardElement1.classList.add('matched');
  if (cardElement2) cardElement2.classList.add('matched');
  
  memoryState.flipped = [];
  memoryState.isAnimating = false;
  
  updateMemoryStats();
  
  if (memoryState.pairs === memoryState.cards.length / 2) {
    endMemoryGame();
  }
}, 500);
```

} else {
playSound(‘nomatch’);

```
setTimeout(() => {
  const cardElement1 = document.querySelector(`.memory-card[data-index="${index1}"]`);
  const cardElement2 = document.querySelector(`.memory-card[data-index="${index2}"]`);
  
  if (cardElement1) cardElement1.classList.remove('flipped');
  if (cardElement2) cardElement2.classList.remove('flipped');
  
  memoryState.flipped = [];
  memoryState.isAnimating = false;
  updateMemoryStats();
}, 1000);
```

}
}

function updateMemoryStats() {
const moveEl = document.getElementById(‘memoryMoves’);
const pairEl = document.getElementById(‘memoryPairs’);

if (moveEl) moveEl.textContent = memoryState.moves;
if (pairEl) pairEl.textContent = memoryState.pairs;
}

function startMemoryTimer() {
const timerInterval = setInterval(() => {
const elapsed = Math.floor((Date.now() - memoryState.startTime) / 1000);
const minutes = Math.floor(elapsed / 60);
const seconds = elapsed % 60;

```
const timeEl = document.getElementById('memoryTime');
if (timeEl) {
  timeEl.textContent = 
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

if (memoryState.pairs === memoryState.cards.length / 2) {
  clearInterval(timerInterval);
}
```

}, 100);
}

function endMemoryGame() {
const elapsed = Math.floor((Date.now() - memoryState.startTime) / 1000);
const minutes = Math.floor(elapsed / 60);
const seconds = elapsed % 60;
const timeStr = String(minutes).padStart(2, ‘0’) + ‘:’ + String(seconds).padStart(2, ‘0’);

const winTimeEl = document.getElementById(‘winTime’);
const winMovesEl = document.getElementById(‘winMoves’);
const winPointsEl = document.getElementById(‘winPoints’);

if (winTimeEl) winTimeEl.textContent = timeStr;
if (winMovesEl) winMovesEl.textContent = memoryState.moves;
if (winPointsEl) winPointsEl.textContent = Math.max(0, 1000 - (memoryState.moves * 10));

const overlay = document.getElementById(‘memoryWinOverlay’);
if (overlay) overlay.classList.remove(‘hidden’);

playSound(‘victory’);
vibrateDevice([100, 50, 100]);
}

function restartMemory() {
const overlay = document.getElementById(‘memoryWinOverlay’);
if (overlay) overlay.classList.add(‘hidden’);

initMemoryGame();
}

function switchMemoryDifficulty() {
const difficulties = [‘easy’, ‘medium’, ‘hard’];
const currentIndex = difficulties.indexOf(memoryState.difficulty || ‘medium’);
memoryState.difficulty = difficulties[(currentIndex + 1) % difficulties.length];

const diffNames = {
‘easy’: ‘FÁCIL (4 Pares)’,
‘medium’: ‘MÉDIO (6 Pares)’,
‘hard’: ‘DIFÍCIL (8 Pares)’
};

alert(’Dificuldade: ’ + diffNames[memoryState.difficulty]);
initMemoryGame();
}
function initPaintScreen() {
setupPaintCanvas();
renderPaintPalette();
renderDinoSelector();
}

function setupPaintCanvas() {
paintState.canvas = document.getElementById(‘paintCanvas’);
if (!paintState.canvas) {
return;
}

paintState.canvas.width = window.innerWidth;
paintState.canvas.height = window.innerHeight - 300;

paintState.context = paintState.canvas.getContext(‘2d’);
if (!paintState.context) {
return;
}

paintState.context.fillStyle = ‘#FFFFFF’;
paintState.context.fillRect(0, 0, paintState.canvas.width, paintState.canvas.height);

paintState.canvas.onmousedown = null;
paintState.canvas.onmousemove = null;
paintState.canvas.onmouseup = null;
paintState.canvas.onmouseout = null;
paintState.canvas.ontouchstart = null;
paintState.canvas.ontouchmove = null;
paintState.canvas.ontouchend = null;

paintState.canvas.addEventListener(‘mousedown’, startPainting);
paintState.canvas.addEventListener(‘mousemove’, paint);
paintState.canvas.addEventListener(‘mouseup’, stopPainting);
paintState.canvas.addEventListener(‘mouseout’, stopPainting);

paintState.canvas.addEventListener(‘touchstart’, startPainting, { passive: false });
paintState.canvas.addEventListener(‘touchmove’, paint, { passive: false });
paintState.canvas.addEventListener(‘touchend’, stopPainting, { passive: false });

paintState.history = [];
paintState.isDrawing = false;
paintState.selectedTool = ‘brush’;
paintState.selectedColor = ‘#000000’;
paintState.brushSize = 10;
}

function renderPaintPalette() {
const palette = document.getElementById(‘paintPalette’);
if (!palette) return;

palette.innerHTML = ‘’;

defaultPalette.forEach(color => {
const colorBtn = document.createElement(‘button’);
colorBtn.className = ‘palette-color’;
colorBtn.style.backgroundColor = color;
colorBtn.title = color;

```
colorBtn.onclick = () => selectPaintColor(color);
palette.appendChild(colorBtn);
```

});
}

function renderDinoSelector() {
const selector = document.getElementById(‘dinoOptions’);
if (!selector) return;

selector.innerHTML = ‘’;

characters.slice(0, 5).forEach(char => {
const btn = document.createElement(‘button’);
btn.className = ‘dino-option’;
btn.textContent = char.emoji;
btn.title = char.name;
btn.onclick = () => changeDinoPaint(char);
selector.appendChild(btn);
});
}

function selectPaintTool(tool) {
paintState.selectedTool = tool;

const toolButtons = {
‘brush’: ‘toolBrush’,
‘bucket’: ‘toolBucket’,
‘eraser’: ‘toolEraser’
};

document.querySelectorAll(’.paint-tool’).forEach(btn => btn.classList.remove(‘active’));
if (toolButtons[tool]) {
const btn = document.getElementById(toolButtons[tool]);
if (btn) btn.classList.add(‘active’);
}

playSound(‘select’);
}

function selectPaintColor(color) {
paintState.selectedColor = color;

document.querySelectorAll(’.palette-color’).forEach(btn => {
btn.style.border = btn.style.backgroundColor === color ? ‘3px solid #FFF’ : ‘none’;
});

playSound(‘select’);
}

function selectCustomColor(color) {
paintState.selectedColor = color;
}

function updateBrushSize(size) {
paintState.brushSize = parseInt(size);
const sizeLabel = document.getElementById(‘brushSizeLabel’);
if (sizeLabel) sizeLabel.textContent = size + ‘px’;
}

function startPainting(e) {
if (e.type.startsWith(‘touch’)) {
e.preventDefault();
}

paintState.isDrawing = true;
saveCanvasState();

if (paintState.context) {
const rect = paintState.canvas.getBoundingClientRect();
const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

```
paintState.context.beginPath();
paintState.context.moveTo(x, y);
```

}
}

function paint(e) {
if (!paintState.isDrawing || !paintState.context || !paintState.canvas) return;

if (e.type.startsWith(‘touch’)) {
e.preventDefault();
}

const rect = paintState.canvas.getBoundingClientRect();
const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

if (paintState.selectedTool === ‘brush’) {
paintState.context.strokeStyle = paintState.selectedColor;
paintState.context.lineWidth = paintState.brushSize;
paintState.context.lineCap = ‘round’;
paintState.context.lineJoin = ‘round’;
paintState.context.globalAlpha = 1.0;

```
paintState.context.lineTo(x, y);
paintState.context.stroke();
```

}
else if (paintState.selectedTool === ‘eraser’) {
const size = paintState.brushSize;
paintState.context.clearRect(x - size / 2, y - size / 2, size, size);
}
}

function stopPainting() {
if (paintState.context) {
paintState.context.closePath();
}
paintState.isDrawing = false;
}

function saveCanvasState() {
if (paintState.canvas) {
try {
paintState.history.push(paintState.canvas.toDataURL());
if (paintState.history.length > 20) {
paintState.history.shift();
}
} catch (e) {
}
}
}

function clearPaintCanvas() {
if (!paintState.canvas || !paintState.context) return;

if (confirm(‘Tem certeza que deseja limpar o desenho?’)) {
paintState.context.fillStyle = ‘#FFFFFF’;
paintState.context.fillRect(0, 0, paintState.canvas.width, paintState.canvas.height);
paintState.history = [];
playSound(‘clear’);
}
}

function undoPaint() {
if (paintState.history.length === 0) {
return;
}

paintState.history.pop();

if (paintState.history.length > 0) {
const img = new Image();
img.src = paintState.history[paintState.history.length - 1];
img.onload = () => {
paintState.context.clearRect(0, 0, paintState.canvas.width, paintState.canvas.height);
paintState.context.drawImage(img, 0, 0);
};
} else {
paintState.context.fillStyle = ‘#FFFFFF’;
paintState.context.fillRect(0, 0, paintState.canvas.width, paintState.canvas.height);
}

playSound(‘clear’);
}

function savePaintCanvas() {
if (!paintState.canvas) return;

try {
const link = document.createElement(‘a’);
link.href = paintState.canvas.toDataURL(‘image/png’);
link.download = ‘dino-art-’ + new Date().getTime() + ‘.png’;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

```
playSound('save');
alert('Seu desenho foi salvo com sucesso!');
```

} catch (e) {
alert(‘Erro ao salvar o desenho’);
}
}

function changeDinoPaint(character) {
playSound(‘select’);
}
function startGlobalClock() {
setInterval(() => {
updateGlobalHeader();
}, 1000);
}

function updateGlobalHeader() {
const now = new Date();

const hours = String(now.getHours()).padStart(2, ‘0’);
const minutes = String(now.getMinutes()).padStart(2, ‘0’);
const seconds = String(now.getSeconds()).padStart(2, ‘0’);

const day = String(now.getDate()).padStart(2, ‘0’);
const month = String(now.getMonth() + 1).padStart(2, ‘0’);
const year = now.getFullYear();

const timeEl = document.getElementById(‘globalTime’);
const dateEl = document.getElementById(‘globalDate’);

if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
if (dateEl) dateEl.textContent = `${day}/${month}/${year}`;
}

function startPlaytimeCounter() {
gameStartTime = Date.now();

if (playtimeInterval) clearInterval(playtimeInterval);

playtimeInterval = setInterval(() => {
const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);

```
const hours = Math.floor(elapsed / 3600);
const minutes = Math.floor((elapsed % 3600) / 60);
const seconds = elapsed % 60;

const playtimeEl = document.getElementById('globalPlaytime');
if (playtimeEl) {
  playtimeEl.textContent = `Tempo Total: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

}, 1000);
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(soundType) {
if (!soundEnabled) return;

try {
const now = audioContext.currentTime;
const osc = audioContext.createOscillator();
const gain = audioContext.createGain();

```
osc.connect(gain);
gain.connect(audioContext.destination);

switch(soundType) {
  case 'select':
    osc.frequency.value = 400;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    break;
    
  case 'confirm':
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
    break;
    
  case 'hit':
    osc.frequency.value = 100;
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
    break;
    
  case 'special':
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
    break;
    
  case 'flip':
    osc.frequency.value = 500;
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
    break;
    
  case 'match':
    osc.frequency.value = 700;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
    break;
    
  case 'nomatch':
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    break;
    
  case 'victory':
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
    break;
    
  case 'battle-start':
    osc.frequency.value = 500;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
    break;
    
  case 'clear':
    osc.frequency.value = 300;
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    break;
    
  case 'save':
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
    break;
}
```

} catch (e) {
}
}

function vibrateDevice(pattern) {
if (!vibrationEnabled) return;

if (!navigator.vibrate) return;

if (typeof pattern === ‘number’) {
navigator.vibrate(pattern);
} else if (Array.isArray(pattern)) {
navigator.vibrate(pattern);
}
}

function drawStarCanvas() {
const canvas = document.getElementById(‘starCanvas’);
if (!canvas) return;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext(‘2d’);
ctx.clearRect(0, 0, canvas.width, canvas.height);

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, ‘#0a0a1a’);
gradient.addColorStop(1, ‘#000005’);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const starCount = 150;

for (let i = 0; i < starCount; i++) {
const x = Math.random() * canvas.width;
const y = Math.random() * canvas.height;
const radius = Math.random() * 1.5;
const opacity = Math.random() * 0.7 + 0.3;

```
ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();
```

}

animateStars();
}

function animateStars() {
const canvas = document.getElementById(‘starCanvas’);
if (!canvas) return;

const ctx = canvas.getContext(‘2d’);

setInterval(() => {
ctx.fillStyle = ‘rgba(0, 0, 0, 0.02)’;
ctx.fillRect(0, 0, canvas.width, canvas.height);

```
const starCount = 10;

for (let i = 0; i < starCount; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 1.5;
  const opacity = Math.random() * 0.5 + 0.3;
  
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
```

}, 100);
}

document.addEventListener(‘DOMContentLoaded’, () => {
const soundToggle = document.getElementById(‘soundToggle’);
const musicToggle = document.getElementById(‘musicToggle’);
const vibrationToggle = document.getElementById(‘vibrationToggle’);

if (soundToggle) {
soundToggle.checked = soundEnabled;
soundToggle.addEventListener(‘change’, (e) => {
soundEnabled = e.target.checked;
const label = document.getElementById(‘soundLabel’);
if (label) label.textContent = soundEnabled ? ‘ATIVADO’ : ‘DESATIVADO’;
saveGameSettings();
});
}

if (musicToggle) {
musicToggle.checked = musicEnabled;
musicToggle.addEventListener(‘change’, (e) => {
musicEnabled = e.target.checked;
const label = document.getElementById(‘musicLabel’);
if (label) label.textContent = musicEnabled ? ‘ATIVADA’ : ‘DESATIVADA’;
saveGameSettings();
});
}

if (vibrationToggle) {
vibrationToggle.checked = vibrationEnabled;
vibrationToggle.addEventListener(‘change’, (e) => {
vibrationEnabled = e.target.checked;
const label = document.getElementById(‘vibrationLabel’);
if (label) label.textContent = vibrationEnabled ? ‘ATIVADA’ : ‘DESATIVADA’;
saveGameSettings();
});
}
});
function getCharacterById(id) {
return characters.find(c => c.id === id);
}

function calculateDamage(attacker, defender, moveType) {
let baseDamage = 10;
let multiplier = 1;

switch(moveType) {
case ‘attack’:
multiplier = 1.5;
break;
case ‘attack2’:
multiplier = 2.0;
break;
case ‘special’:
multiplier = 2.5;
break;
}

const variance = Math.random() * 0.2 + 0.9;
const damage = Math.floor(baseDamage * multiplier * variance);

return Math.max(1, damage);
}

function formatTime(seconds) {
const mins = Math.floor(seconds / 60);
const secs = seconds % 60;
return String(mins).padStart(2, ‘0’) + ‘:’ + String(secs).padStart(2, ‘0’);
}

function randomRange(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
const arr = […array];
for (let i = arr.length - 1; i > 0; i–) {
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}

function isEmpty(str) {
return str === null || str === undefined || str.trim() === ‘’;
}

function createElement(tag, classNames = ‘’, innerHTML = ‘’) {
const element = document.createElement(tag);
if (classNames) element.className = classNames;
if (innerHTML) element.innerHTML = innerHTML;
return element;
}

function getBestScore() {
const saved = localStorage.getItem(‘daviDinoBestScore’);
return saved ? parseInt(saved) : 0;
}

function saveBestScore(score) {
const best = getBestScore();
if (score > best) {
localStorage.setItem(‘daviDinoBestScore’, score.toString());
return true;
}
return false;
}

function getPlayerStats() {
const saved = localStorage.getItem(‘daviDinoStats’);
if (saved) {
return JSON.parse(saved);
}
return {
totalGames: 0,
wins: 0,
losses: 0,
bestTime: Infinity
};
}

function savePlayerStats(stats) {
localStorage.setItem(‘daviDinoStats’, JSON.stringify(stats));
}

function updateBattleStats(isVictory, timeSpent) {
const stats = getPlayerStats();
stats.totalGames++;

if (isVictory) {
stats.wins++;
} else {
stats.losses++;
}

if (timeSpent < stats.bestTime) {
stats.bestTime = timeSpent;
}

savePlayerStats(stats);
}

function getBestMemoryTime() {
const saved = localStorage.getItem(‘daviDinoBestMemoryTime’);
return saved ? parseInt(saved) : Infinity;
}

function saveBestMemoryTime(time) {
const best = getBestMemoryTime();
if (time < best) {
localStorage.setItem(‘daviDinoBestMemoryTime’, time.toString());
return true;
}
return false;
}

window.addEventListener(‘resize’, () => {
const starCanvas = document.getElementById(‘starCanvas’);
if (starCanvas) {
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;
drawStarCanvas();
}

const paintCanvas = document.getElementById(‘paintCanvas’);
if (paintCanvas && currentScreen === ‘paintScreen’) {
paintCanvas.width = window.innerWidth;
paintCanvas.height = window.innerHeight - 300;

```
if (paintState.history.length > 0) {
  const img = new Image();
  img.src = paintState.history[paintState.history.length - 1];
  img.onload = () => {
    paintState.context.drawImage(img, 0, 0);
  };
} else {
  paintState.context.fillStyle = '#FFFFFF';
  paintState.context.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}
```

}

const battleCanvas = document.getElementById(‘battleBackgroundCanvas’);
if (battleCanvas && currentScreen === ‘battleScreen’) {
drawBattleBackground();
}

const homeCanvas = document.getElementById(‘homePreviewCanvas’);
if (homeCanvas && currentScreen === ‘homeScreen’) {
drawHomePreview();
}
});

window.addEventListener(‘orientationchange’, () => {
setTimeout(() => {
window.dispatchEvent(new Event(‘resize’));
}, 100);
});

const isTouchDevice = () => {
return ((‘ontouchstart’ in window) ||
(navigator.maxTouchPoints > 0) ||
(navigator.msMaxTouchPoints > 0));
};

document.addEventListener(‘touchstart’, (e) => {
if (e.touches.length > 1) {
e.preventDefault();
}
}, { passive: false });

function toggleSound() {
soundEnabled = !soundEnabled;
const soundLabel = document.getElementById(‘soundLabel’);
if (soundLabel) soundLabel.textContent = soundEnabled ? ‘ATIVADO’ : ‘DESATIVADO’;
saveGameSettings();
}

function toggleMusic() {
musicEnabled = !musicEnabled;
const musicLabel = document.getElementById(‘musicLabel’);
if (musicLabel) musicLabel.textContent = musicEnabled ? ‘ATIVADA’ : ‘DESATIVADA’;
saveGameSettings();
}

function toggleVibration() {
vibrationEnabled = !vibrationEnabled;
const vibrationLabel = document.getElementById(‘vibrationLabel’);
if (vibrationLabel) vibrationLabel.textContent = vibrationEnabled ? ‘ATIVADA’ : ‘DESATIVADA’;
saveGameSettings();
}

function showNotification(message, duration = 3000) {
const notification = document.createElement(‘div’);
notification.className = ‘notification’;
notification.textContent = message;
notification.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; font-size: 14px;`;

document.body.appendChild(notification);

setTimeout(() => {
notification.remove();
}, duration);
}

function requestFullscreen() {
const element = document.documentElement;

if (element.requestFullscreen) {
element.requestFullscreen();
} else if (element.webkitRequestFullscreen) {
element.webkitRequestFullscreen();
} else if (element.mozRequestFullScreen) {
element.mozRequestFullScreen();
} else if (element.msRequestFullscreen) {
element.msRequestFullscreen();
}
}

function exitFullscreen() {
if (document.exitFullscreen) {
document.exitFullscreen();
} else if (document.webkitExitFullscreen) {
document.webkitExitFullscreen();
} else if (document.mozCancelFullScreen) {
document.mozCancelFullScreen();
} else if (document.msExitFullscreen) {
document.msExitFullscreen();
}
}

const getBrowser = () => {
const ua = navigator.userAgent.toLowerCase();

if (ua.indexOf(‘safari’) !== -1 && ua.indexOf(‘chrome’) === -1) {
return ‘safari’;
} else if (ua.indexOf(‘chrome’) !== -1) {
return ‘chrome’;
} else if (ua.indexOf(‘firefox’) !== -1) {
return ‘firefox’;
} else if (ua.indexOf(‘edge’) !== -1 || ua.indexOf(‘edg’) !== -1) {
return ‘edge’;
}

return ‘unknown’;
};

function checkBrowserCompatibility() {
const browser = getBrowser();

if (!window.AudioContext && !window.webkitAudioContext) {
}

if (!navigator.vibrate && !navigator.webkitVibrate && !navigator.mozVibrate && !navigator.msVibrate) {
}
}

checkBrowserCompatibility();
function getDayNightPhase() {
const now = new Date();
const hours = now.getHours();

let phase = ‘night’;
let brightness = 0.6;

if (hours >= 6 && hours < 12) {
phase = ‘morning’;
brightness = 0.9;
} else if (hours >= 12 && hours < 18) {
phase = ‘day’;
brightness = 1.0;
} else if (hours >= 18 && hours < 21) {
phase = ‘sunset’;
brightness = 0.8;
} else if (hours >= 21 || hours < 6) {
phase = ‘night’;
brightness = 0.6;
}

return { phase, brightness, hours };
}

function applyDayNightTheme() {
const { phase, brightness } = getDayNightPhase();

const root = document.documentElement;

switch(phase) {
case ‘morning’:
root.style.setProperty(’–primary-color’, ‘#FFB84D’);
root.style.setProperty(’–secondary-color’, ‘#FFC857’);
break;
case ‘day’:
root.style.setProperty(’–primary-color’, ‘#87CEEB’);
root.style.setProperty(’–secondary-color’, ‘#90EE90’);
break;
case ‘sunset’:
root.style.setProperty(’–primary-color’, ‘#FF6B6B’);
root.style.setProperty(’–secondary-color’, ‘#FFA500’);
break;
case ‘night’:
root.style.setProperty(’–primary-color’, ‘#1a1a2e’);
root.style.setProperty(’–secondary-color’, ‘#0f0f1e’);
break;
}

document.body.style.filter = `brightness(${brightness})`;
}

setInterval(() => {
applyDayNightTheme();
}, 60000);

function openAdvancedSettings() {
}

function setDifficulty(level) {
memoryState.difficulty = level;
localStorage.setItem(‘daviDinoDifficulty’, level);
}

function getDifficulty() {
return localStorage.getItem(‘daviDinoDifficulty’) || ‘medium’;
}

function setGraphicsQuality(quality) {
localStorage.setItem(‘daviDinoGraphicsQuality’, quality);
}

function getGraphicsQuality() {
return localStorage.getItem(‘daviDinoGraphicsQuality’) || ‘high’;
}

function enableDebugMode(enabled) {
if (enabled) {
window.DEBUG_MODE = true;
} else {
window.DEBUG_MODE = false;
}
}

const achievements = {
‘first-battle’: {
name: ‘Primeiro Combate’,
description: ‘Vença sua primeira batalha’,
icon: ‘⚔️’,
unlocked: false
},
‘memory-master’: {
name: ‘Mestre da Memória’,
description: ‘Ganhe o jogo da memória em menos de 30 segundos’,
icon: ‘🧠’,
unlocked: false
},
‘artist’: {
name: ‘Artista’,
description: ‘Salve seu primeiro desenho’,
icon: ‘🎨’,
unlocked: false
},
‘speedrunner’: {
name: ‘Speedrunner’,
description: ‘Vença uma batalha em menos de 1 minuto’,
icon: ‘⚡’,
unlocked: false
},
‘collector’: {
name: ‘Colecionador’,
description: ‘Desbloqueie todos os personagens’,
icon: ‘🦖’,
unlocked: false
}
};

function unlockAchievement(id) {
if (achievements[id] && !achievements[id].unlocked) {
achievements[id].unlocked = true;
localStorage.setItem(‘daviDinoAchievements’, JSON.stringify(achievements));

```
const achievement = achievements[id];
showNotification('CONQUISTA DESBLOQUEADA: ' + achievement.name);
playSound('victory');
```

}
}

function getUnlockedAchievements() {
const saved = localStorage.getItem(‘daviDinoAchievements’);
if (saved) {
return JSON.parse(saved);
}
return achievements;
}

function loadAchievements() {
const saved = getUnlockedAchievements();
Object.keys(saved).forEach(key => {
if (saved[key].unlocked) {
achievements[key].unlocked = true;
}
});
}

loadAchievements();

function trackEvent(eventName, eventData = {}) {
const event = {
name: eventName,
timestamp: new Date().getTime(),
data: eventData
};

const saved = localStorage.getItem(‘daviDinoEvents’) || ‘[]’;
const events = JSON.parse(saved);
events.push(event);

if (events.length > 100) {
events.shift();
}

localStorage.setItem(‘daviDinoEvents’, JSON.stringify(events));
}

function getAnalytics() {
const saved = localStorage.getItem(‘daviDinoEvents’) || ‘[]’;
return JSON.parse(saved);
}

function logError(error) {
const errorLog = {
message: error.message || String(error),
stack: error.stack || ‘’,
timestamp: new Date().toISOString()
};

const saved = localStorage.getItem(‘daviDinoErrors’) || ‘[]’;
const errors = JSON.parse(saved);
errors.push(errorLog);

if (errors.length > 20) {
errors.shift();
}

localStorage.setItem(‘daviDinoErrors’, JSON.stringify(errors));
}

window.addEventListener(‘error’, (e) => {
logError(e.error);
});

window.addEventListener(‘unhandledrejection’, (e) => {
logError(new Error(’Unhandled Promise Rejection: ’ + e.reason));
});

function exportGameData() {
const data = {
timestamp: new Date().toISOString(),
settings: {
sound: soundEnabled,
music: musicEnabled,
vibration: vibrationEnabled,
brightness: brightness
},
stats: getPlayerStats(),
achievements: achievements,
bestScores: {
battle: getBestScore(),
memory: getBestMemoryTime()
}
};

const json = JSON.stringify(data, null, 2);
const blob = new Blob([json], { type: ‘application/json’ });
const url = URL.createObjectURL(blob);

const a = document.createElement(‘a’);
a.href = url;
a.download = ‘davi-dino-data-’ + new Date().getTime() + ‘.json’;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

function importGameData(file) {
const reader = new FileReader();

reader.onload = (e) => {
try {
const data = JSON.parse(e.target.result);

```
  if (data.settings) {
    soundEnabled = data.settings.sound;
    musicEnabled = data.settings.music;
    vibrationEnabled = data.settings.vibration;
    brightness = data.settings.brightness;
    saveGameSettings();
  }
  
  if (data.achievements) {
    Object.keys(data.achievements).forEach(key => {
      if (data.achievements[key].unlocked) {
        unlockAchievement(key);
      }
    });
  }
  
  showNotification('Dados importados com sucesso!');
} catch (error) {
  showNotification('Erro ao importar dados');
}
```

};

reader.readAsText(file);
}

function cleanupMemory() {
if (paintState.history.length > 30) {
paintState.history = paintState.history.slice(-20);
}

if (battleState.battleLog.length > 100) {
battleState.battleLog = battleState.battleLog.slice(-50);
}
}

setInterval(() => {
cleanupMemory();
}, 300000);

const GAME_INFO = {
name: ‘Davi Dino Heróis’,
version: ‘1.0.0’,
author: ‘Dra. Valcely Ferreira’,
year: 2026,
description: ‘Jogo de dinossauros com batalha, memória e pintura’
};

function showGameInfo() {
const info = `${GAME_INFO.name} v${GAME_INFO.version} Desenvolvido por: ${GAME_INFO.author} Ano: ${GAME_INFO.year} Descrição: ${GAME_INFO.description}`;

console.log(info);
}

showGameInfo();

window.addEventListener(‘beforeunload’, () => {
saveGameSettings();
cleanupMemory();
});

document.addEventListener(‘visibilitychange’, () => {
if (document.hidden) {
} else {
}
});

applyDayNightTheme();