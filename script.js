const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};

// --- IMAGENS DOS DINOSSAUROS ---
const DINO_IMAGES = [
    'https://cdn-icons-png.flaticon.com/512/2591/2591933.png', // T-Rex
    'https://cdn-icons-png.flaticon.com/512/2591/2591942.png', // Triceratops
    'https://cdn-icons-png.flaticon.com/512/2591/2591946.png', // Pterodáctilo
    'https://cdn-icons-png.flaticon.com/512/2591/2591937.png', // Brontossauro
    'https://cdn-icons-png.flaticon.com/512/2591/2591931.png', // Estegossauro
    'https://cdn-icons-png.flaticon.com/512/2591/2591939.png'  // Velociraptor
];

// --- COMBATE ---
let p1Img = new Image(); p1Img.src = DINO_IMAGES[0];
let p2Img = new Image(); p2Img.src = DINO_IMAGES[1];

function startFight(mode) {
    UI.nav('fightScreen');
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    let x1 = 100, x2 = canvas.width - 200;

    function gameLoop() {
        if(!document.getElementById('fightScreen').classList.contains('active')) return;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        // Desenha as imagens em vez de texto
        ctx.drawImage(p1Img, x1, 150, 120, 120);
        ctx.drawImage(p2Img, x2, 150, 120, 120);

        if(mode === 1 && x2 > x1 + 100) x2 -= 1; // IA caminha
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// --- JOGO DA MEMÓRIA COM IMAGENS ---
function initMemory() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "MEMÓRIA";
    const grid = document.getElementById('minigameContent');
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.innerHTML = '';
    
    let deck = [...DINO_IMAGES.slice(0,6), ...DINO_IMAGES.slice(0,6)].sort(() => Math.random() - 0.5);

    deck.forEach(url => {
        const card = document.createElement('div');
        card.className = 'card';
        const img = document.createElement('img');
        img.src = url;
        card.appendChild(img);
        card.onclick = () => card.classList.toggle('flipped');
        grid.appendChild(card);
    });
}

// --- QUEBRA-CABEÇA COM IMAGENS ---
function initPuzzle() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "MONTAR DINO";
    const grid = document.getElementById('minigameContent');
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.innerHTML = '';
    
    // Mostra várias fotos de dinos para o Davi clicar e "coletar"
    DINO_IMAGES.forEach(url => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        const img = document.createElement('img');
        img.src = url;
        piece.appendChild(img);
        piece.onclick = () => {
            piece.style.borderColor = "#4ade80";
            piece.style.transform = "scale(0.9)";
        };
        grid.appendChild(piece);
    });
}
