const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};

const DINOS = [
    { name: 'T-REX', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591933.png' },
    { name: 'TRICERA', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591942.png' },
    { name: 'PTERO', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591946.png' },
    { name: 'BRONTO', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png' }
];

// --- SELEÇÃO DE HERÓI ---
function initHeroSelect() {
    UI.nav('selectScreen');
    const list = document.getElementById('heroList');
    list.innerHTML = '';
    DINOS.forEach(dino => {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.innerHTML = `<img src="${dino.img}" width="80"><p>${dino.name}</p>`;
        div.onclick = () => alert("Heroi " + dino.name + " selecionado! Preparar luta...");
        list.appendChild(div);
    });
}

// --- JOGO DA MEMÓRIA (SEMPRE EMBARALHADO) ---
function initMemory() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "MEMÓRIA";
    document.getElementById('puzzle-board').style.display = 'none';
    document.getElementById('puzzle-pieces-area').style.display = 'none';
    
    const grid = document.getElementById('minigameContent');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.innerHTML = '';

    // Embaralha sempre ao iniciar
    const deck = [...DINOS, ...DINOS].sort(() => Math.random() - 0.5);

    deck.forEach(dino => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<img src="${dino.img}">`;
        card.onclick = () => card.classList.toggle('flipped');
        grid.appendChild(card);
    });
}

// --- QUEBRA-CABEÇA SIMPLES ---
function initPuzzle() {
    UI.nav('gameScreen');
    document.getElementById('gameTitle').innerText = "MONTE O DINO";
    document.getElementById('minigameContent').style.display = 'none';
    
    const board = document.getElementById('puzzle-board');
    const piecesArea = document.getElementById('puzzle-pieces-area');
    board.style.display = 'block';
    piecesArea.style.display = 'flex';
    board.innerHTML = ''; piecesArea.innerHTML = '';

    // Escolhe um dino para montar
    const targetDino = DINOS[0].img;
    board.style.backgroundImage = `url(${targetDino})`;
    board.style.backgroundSize = 'contain';
    board.style.backgroundRepeat = 'no-repeat';
    board.style.opacity = '0.3'; // Fica clarinho para o Davi saber onde colocar

    // Cria peças para "arrastar" (clicar e aparecer)
    for(let i=0; i<3; i++) {
        const p = document.createElement('div');
        p.className = 'puzzle-piece';
        p.style.backgroundImage = `url(${targetDino})`;
        p.onclick = () => {
            p.style.display = 'none';
            board.style.opacity = '1'; // "Montou"
            alert("Parabéns Davi! Você montou!");
        };
        piecesArea.appendChild(p);
    }
}
