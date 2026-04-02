// 1. Definição dos Heróis e Vilões (18 no total)
const HEROES = [
    { id: 1, name: 'Spider-Davi', icon: '🕷️', type: 'Hero' },
    { id: 2, name: 'Iron-Mamãe', icon: '🚀', type: 'Hero' },
    { id: 3, name: 'Hulk-Papai', icon: '👊', type: 'Hero' },
    { id: 4, name: 'Wonder-Vovó', icon: '👑', type: 'Hero' },
    { id: 5, name: 'Bat-Vovô', icon: '🦇', type: 'Hero' },
    { id: 6, name: 'Panther-Tobby', icon: '🐾', type: 'Hero' },
    { id: 7, name: 'Wolve-Atena', icon: '🐺', type: 'Hero' },
    { id: 8, name: 'Cap-Titiagio', icon: '🛡️', type: 'Hero' },
    { id: 9, name: 'Marvel-Titiatina', icon: '🌟', type: 'Hero' },
    // 9 Vilões Dinossauros
    { id: 10, name: 'T-Rex Malvado', icon: '🦖', type: 'Villain' },
    { id: 11, name: 'Raptor Veloz', icon: '🏃', type: 'Villain' },
    { id: 12, name: 'Spino Sombrio', icon: '🐊', type: 'Villain' },
    { id: 13, name: 'Giga Terror', icon: '👹', type: 'Villain' },
    { id: 14, name: 'Carno Chifrudo', icon: '🐂', type: 'Villain' },
    { id: 15, name: 'Ptera Alado', icon: '🦅', type: 'Villain' },
    { id: 16, name: 'Mossa Gigante', icon: '🌊', type: 'Villain' },
    { id: 17, name: 'Dilop Veneno', icon: '🐍', type: 'Villain' },
    { id: 18, name: 'Indominus Rex', icon: '💀', type: 'Villain' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

// 2. Inicialização do Jogo
function initMemory() {
    nav('gameArea');
    matchedPairs = 0;
    document.getElementById('pair-count').innerText = "0";
    
    // Criar pares (18 heróis/vilões x 2 = 36 cards)
    const gameIcons = [...HEROES, ...HEROES];
    // Embaralhar
    gameIcons.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    gameIcons.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.heroId = item.id;
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">
                <span>${item.icon}</span>
                <div class="hero-label">${item.name}</div>
            </div>
        `;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

// 3. Lógica do Clique (UX Infantil: Trava de clique enquanto anima)
function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || flippedCards.includes(card)) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// 4. Verificação de Pares e Sons
function checkMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.heroId === card2.dataset.heroId;

    if (isMatch) {
        playSound('rugido'); // Gatilho para Rugido
        matchedPairs++;
        document.getElementById('pair-count').innerText = matchedPairs;
        resetTurn();
        if (matchedPairs === HEROES.length) {
            setTimeout(() => alert("PARABÉNS PEQUENO CIENTISTA! VOCÊ SALVOU O PARQUE!"), 500);
        }
    } else {
        playSound('erro'); // Som lúdico
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetTurn();
        }, 1200); // Tempo maior para a criança processar o erro
    }
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}

// 5. Navegação Simples
function nav(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// 6. Sistema de Áudio (Preparado)
function playSound(type) {
    // Para implementar, basta adicionar os arquivos .mp3 na pasta
    const audio = new Audio();
    if (type === 'rugido') audio.src = 'roar.mp3';
    if (type === 'erro') audio.src = 'bubble.mp3';
    
    // audio.play().catch(() => {}); // Comentado para evitar erro de falta de arquivo
    console.log("Som ativado: " + type);
}
