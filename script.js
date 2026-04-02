// --- SISTEMA DE NAVEGAÇÃO ---
const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};

// --- COMBATE DINOSSAURO (1 OU 2 PLAYERS) ---
let fightMode = 1;
let p1 = { x: 100, y: 220, hp: 100, icon: '🦖' };
let p2 = { x: 500, y: 220, hp: 100, icon: '🦕' };

function startFight(mode) {
    fightMode = mode;
    UI.nav('fightScreen');
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;

    function gameLoop() {
        if(!document.getElementById('fightScreen').classList.contains('active')) return;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        ctx.font = "80px Arial";
        ctx.fillText(p1.icon, p1.x, p1.y); // Player 1
        ctx.fillText(p2.icon, p2.x, p2.y); // Player 2 ou CPU

        // IA Simples para 1 Jogador: O Dino 2 persegue o Dino 1
        if(fightMode === 1) {
            if(p2.x > p1.x + 80) p2.x -= 1.5;
            if(p2.x < p1.x - 80) p2.x += 1.5;
        }

        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// --- JOGO DA MEMÓRIA (DINOS, FRUTAS, NATUREZA) ---
function initMemory() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "MEMÓRIA";
    const grid = document.getElementById('minigameContent');
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.innerHTML = '';
    
    const items = ['🦖', '🦕', '🍎', '🍌', '🌴', '🌿', '🌋', '🍗'];
    const deck = [...items, ...items].sort(() => Math.random() - 0.5);

    deck.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = item;
        card.onclick = () => {
            card.classList.toggle('flipped');
        };
        grid.appendChild(card);
    });
}

// --- QUEBRA-CABEÇA (MONTAR O ESQUELETO) ---
function initPuzzle() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "QUEBRA-CABEÇA";
    const grid = document.getElementById('minigameContent');
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.innerHTML = '';
    
    // Peças lúdicas para montar o Dino
    const pieces = ['🦴 CABEÇA', '🦴 CORPO', '🦴 CAUDA', '🦴 PERNA D', '🦴 PERNA E', '🦴 GARRA', '🦴 PESCOÇO', '🦴 COSTAS', '🦴 DENTE'];
    
    pieces.sort(() => Math.random() - 0.5).forEach(text => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.innerHTML = text;
        piece.onclick = () => {
            piece.style.background = "#4ade80"; // Fica verde ao "encaixar"
            piece.style.color = "#fff";
        };
        grid.appendChild(piece);
    });
}
