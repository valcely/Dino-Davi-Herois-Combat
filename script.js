const UI = {
    screens: document.querySelectorAll('.screen'),
    nav(id) {
        this.screens.forEach(s => s.classList.remove('active'));
        document.getElementById(id + 'Screen').classList.add('active');
        playSound('click');
    }
};

// --- Sistema de Som Melhorado ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination);
    
    if(type === 'click') {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if(type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
        g.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    }
}

// --- Lógica da Luta ---
let playerHP = 100, enemyHP = 100;
let fightContext, fightCanvas;

function initFight(color) {
    UI.nav('fight');
    fightCanvas = document.getElementById('fightCanvas');
    fightContext = fightCanvas.getContext('2d');
    fightCanvas.width = 600; fightCanvas.height = 300;
    playerHP = 100; enemyHP = 100;
    updateHP();
    requestAnimationFrame(renderFight);
}

function updateHP() {
    document.getElementById('hp-player').style.width = playerHP + '%';
    document.getElementById('hp-enemy').style.width = enemyHP + '%';
}

function playerAttack() {
    if(enemyHP <= 0) return;
    playSound('hit');
    enemyHP -= 15;
    updateHP();
    if(enemyHP <= 0) {
        setTimeout(() => { alert("VOCÊ VENCEU! 🏆"); UI.nav('title'); }, 500);
    }
}

function renderFight() {
    if(!document.getElementById('fightScreen').classList.contains('active')) return;
    const ctx = fightContext;
    ctx.clearRect(0,0,600,300);
    
    // Desenho Simples dos Personagens (Representação)
    ctx.fillStyle = '#22c55e'; // Jogador
    ctx.fillRect(100, 150, 80, 80); 
    
    ctx.fillStyle = '#ef4444'; // Inimigo
    ctx.fillRect(420, 150, 80, 80);
    
    requestAnimationFrame(renderFight);
}

// --- Seleção de Dino ---
const dinos = [
    { name: 'VERDINHO', color: '#22c55e' },
    { name: 'AZULÃO', color: '#3b82f6' },
    { name: 'ROXINHO', color: '#a855f7' }
];

function setupSelect() {
    const container = document.getElementById('dinoSelector');
    dinos.forEach(d => {
        const div = document.createElement('div');
        div.className = 'btn-card';
        div.style.backgroundColor = d.color;
        div.innerHTML = `<span style="font-size:3rem">🦖</span><span>${d.name}</span>`;
        div.onclick = () => initFight(d.color);
        container.appendChild(div);
    });
}

// --- Mini Jogo: Memória ---
function initMemory() {
    UI.nav('gameArea');
    document.getElementById('gameTitle').innerText = "CADÊ O PAR?";
    const content = document.getElementById('minigameContent');
    content.innerHTML = '<div class="memory-grid" id="grid"></div>';
    const grid = document.getElementById('grid');
    const icons = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];
    const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
    
    let flipped = [];
    cards.forEach(icon => {
        const c = document.createElement('div');
        c.className = 'card';
        c.onclick = () => {
            if(flipped.length < 2 && !c.classList.contains('flipped')) {
                c.innerText = icon;
                c.classList.add('flipped');
                flipped.push(c);
                if(flipped.length === 2) {
                    if(flipped[0].innerText === flipped[1].innerText) {
                        flipped = [];
                    } else {
                        setTimeout(() => {
                            flipped.forEach(i => { i.innerText = ''; i.classList.remove('flipped'); });
                            flipped = [];
                        }, 800);
                    }
                }
            }
        };
        grid.appendChild(c);
    });
}

// Funções de Navegação Global
window.nav = (id) => UI.nav(id);
window.onload = () => {
    setupSelect();
    UI.nav('title');
};
