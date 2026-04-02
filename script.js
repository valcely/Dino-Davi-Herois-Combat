// --- CONFIGURAÇÕES ---
const HEROES = [
    { id: 1, name: 'DAVI (ARANHA)', icon: '🕷️', color: '#e11d48' },
    { id: 2, name: 'MAMÃE (FERRO)', icon: '🚀', color: '#facc15' },
    { id: 3, name: 'PAPAI (HULK)', icon: '💪', color: '#16a34a' },
    { id: 4, name: 'VOVÓ (WONDER)', icon: '👑', color: '#1e40af' },
    { id: 5, name: 'VOVÔ (BATMAN)', icon: '🦇', color: '#1a1a1a' },
    { id: 6, name: 'TOBBY (PANTERA)', icon: '🐾', color: '#4b5563' },
    { id: 7, name: 'ATENA (WOLVERINE)', icon: '🐺', color: '#f59e0b' },
    { id: 8, name: 'TITIAGIO (CAP)', icon: '🛡️', color: '#2563eb' },
    { id: 9, name: 'TITIATINA (MARVEL)', icon: '🌟', color: '#db2777' }
];

const VILLAINS = [
    { name: 'GIGANTOSSAURO', icon: '🦖' }, { name: 'SPINO-DARK', icon: '🐊' },
    { name: 'RAPTOR-NIGHT', icon: '🦎' }, { name: 'PTERO-TERROR', icon: '🦅' },
    { name: 'T-REX-VOID', icon: '💀' }, { name: 'CARNO-FIRE', icon: '🔥' },
    { name: 'MOSA-SHADOW', icon: '🌊' }, { name: 'TRI-CRUSH', icon: '🪨' },
    { name: 'BRONTO-STOMP', icon: '👣' }
];

// Audio Mock (Gatilhos de som)
const playSound = (type) => {
    const sounds = {
        'hit': '🔊 Rugido!', 'miss': '🎵 Blip', 'win': '🎉 Vitória!', 'click': '🖱️ Click'
    };
    console.log("Som ativado:", sounds[type]);
    // Aqui você integraria: new Audio('path/to/sound.mp3').play();
};

let currentPlayerHero = HEROES[0];
let currentEnemy = VILLAINS[0];

const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id + 'Screen').classList.add('active');
        playSound('click');
        if(id === 'fight') initFight();
    }
};

// --- LOGICA DE SELEÇÃO ---
function setupSelect() {
    const container = document.getElementById('dinoSelector');
    HEROES.forEach(h => {
        const div = document.createElement('div');
        div.className = 'hero-card';
        div.innerHTML = `<span>${h.icon}</span><p>${h.name}</p>`;
        div.onclick = () => { 
            currentPlayerHero = h; 
            UI.nav('fight'); 
        };
        container.appendChild(div);
    });
}

// --- JOGO DE LUTA (CANVAS) ---
let fightActive = false;
let player = { x: 50, y: 150, hp: 100, dy: 0, jumping: false };
let enemy = { x: 450, y: 150, hp: 100 };
let keys = { a: false, s: false };
let projectiles = [];

function initFight() {
    fightActive = true;
    player.hp = 100; enemy.hp = 100;
    currentEnemy = VILLAINS[Math.floor(Math.random() * VILLAINS.length)];
    document.getElementById('enemy-name').innerText = currentEnemy.name;
    updateFightUI();
    requestAnimationFrame(gameLoop);
}

function playerJump() { if(!player.jumping) { player.dy = -15; player.jumping = true; playSound('miss'); } }

function playerAttack(type) {
    if(type === 'hit' && Math.abs(player.x - enemy.x) < 70) {
        enemy.hp -= 10; playSound('hit');
    } else if(type === 'power') {
        projectiles.push({ x: player.x + 40, y: player.y + 20, speed: 8 });
        playSound('hit');
    }
    updateFightUI();
}

function updateFightUI() {
    document.getElementById('hp-player').style.width = player.hp + '%';
    document.getElementById('hp-enemy').style.width = enemy.hp + '%';
    if(enemy.hp <= 0) { alert("VOCÊ VENCEU!"); UI.nav('title'); }
}

function gameLoop() {
    if(!fightActive || document.getElementById('fightScreen').classList.contains('active') === false) return;
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = 300;

    // Movimento
    if(keys.a && player.x > 0) player.x -= 5;
    if(keys.s && player.x < canvas.width - 60) player.x += 5;
    player.y += player.dy;
    if(player.y < 180) player.dy += 0.8; else { player.y = 180; player.dy = 0; player.jumping = false; }

    // Desenho
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    // Player (Herói)
    ctx.font = "50px Arial";
    ctx.fillText(currentPlayerHero.icon, player.x, player.y);
    
    // Inimigo (Vilão)
    ctx.fillText(currentEnemy.icon, enemy.x, enemy.y);
    if(enemy.x > player.x + 60) enemy.x -= 1.5; // IA Simples

    // Projéteis
    projectiles.forEach((p, i) => {
        p.x += p.speed;
        ctx.fillStyle = "gold";
        ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2); ctx.fill();
        if(p.x > enemy.x && p.x < enemy.x + 50) { enemy.hp -= 5; projectiles.splice(i, 1); updateFightUI(); }
    });

    requestAnimationFrame(gameLoop);
}

// --- JOGO DA MEMÓRIA ---
function initMemory() {
    UI.nav('gameArea');
    const container = document.getElementById('minigameContent');
    container.style.gridTemplateColumns = "repeat(4, 1fr)";
    container.innerHTML = '';
    
    let cards = [...HEROES, ...HEROES].sort(() => Math.random() - 0.5);
    let flipped = [];
    let lock = false;

    cards.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'memory-card';
        el.dataset.id = card.id;
        el.onclick = () => {
            if(lock || el.classList.contains('flipped')) return;
            el.classList.add('flipped');
            el.innerHTML = card.icon;
            flipped.push(el);

            if(flipped.length === 2) {
                lock = true;
                if(flipped[0].dataset.id === flipped[1].dataset.id) {
                    playSound('hit');
                    flipped = [];
                    lock = false;
                } else {
                    setTimeout(() => {
                        flipped.forEach(c => { c.classList.remove('flipped'); c.innerHTML = ''; });
                        flipped = [];
                        lock = false;
                        playSound('miss');
                    }, 800);
                }
            }
        };
        container.appendChild(el);
    });
}

// --- QUEBRA-CABEÇA (VERSÃO SIMPLIFICADA PARA 3+) ---
function initPuzzle() {
    UI.nav('gameArea');
    const container = document.getElementById('minigameContent');
    container.innerHTML = '<h3 style="grid-column: span 4">Arraste as peças!</h3>';
    // Lógica simplificada: Pareamento de ícones (UX 3+ foca em arrastar e soltar)
    const items = [...HEROES].slice(0, 4);
    items.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'memory-card';
        slot.style.border = "2px dashed #fff";
        slot.innerHTML = "?";
        slot.onclick = () => { slot.innerHTML = item.icon; playSound('win'); };
        container.appendChild(slot);
    });
}

window.onload = () => { setupSelect(); };
