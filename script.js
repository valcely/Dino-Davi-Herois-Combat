// --- CONFIGURAÇÕES DE ÁUDIO (SONS REAIS) ---
const Som = {
    tocar(freq, tipo, duracao) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = tipo; // 'sine', 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duracao);
    },
    rugido() { this.tocar(100, 'sawtooth', 0.4); },
    ataque() { this.tocar(150, 'sine', 0.1); },
    sucesso() { this.tocar(800, 'sine', 0.2); setTimeout(() => this.tocar(1000, 'sine', 0.3), 100); },
    falar(texto) {
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 1.2;
        window.speechSynthesis.speak(msg);
    }
};

// --- BANCO DE DADOS: 18 DINO-HERÓIS ---
const HEROIS = [
    { id: 1, name: 'DAVI-SPIDER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591933.png' },
    { id: 2, name: 'MAMÃE-WONDER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591942.png' },
    { id: 3, name: 'PAPAI-BAT', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591946.png' },
    { id: 4, name: 'DINO-HULK', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591931.png' },
    { id: 5, name: 'DINO-IRON', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png' },
    { id: 6, name: 'DINO-THOR', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591939.png' },
    { id: 7, name: 'DINO-CAP', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591944.png' },
    { id: 8, name: 'DINO-FLASH', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591935.png' },
    { id: 9, name: 'DINO-SUPER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591934.png' },
    { id: 10, name: 'DINO-AQUA', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591941.png' },
    { id: 11, name: 'DINO-PANTHER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591932.png' },
    { id: 12, name: 'DINO-WIDOW', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591945.png' },
    { id: 13, name: 'DINO-LOGAN', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591936.png' },
    { id: 14, name: 'DINO-LANTERN', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591938.png' },
    { id: 15, name: 'DINO-GROOT', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591940.png' },
    { id: 16, name: 'DINO-VENOM', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591943.png' },
    { id: 17, name: 'DINO-JOKER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591947.png' },
    { id: 18, name: 'DINO-THANOS', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591948.png' }
];

const VILAO_PADRAO = 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png';

// --- INICIALIZAÇÃO DO FUNDO ---
function criarFundo() {
    const bg = document.getElementById('main-background');
    bg.innerHTML = '';
    for (let i = 0; i < 40; i++) {
        const span = document.createElement('span');
        span.innerText = i % 2 === 0 ? '🦖' : '🦴';
        bg.appendChild(span);
    }
}
criarFundo();

// --- NAVEGAÇÃO ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goToMenu() { location.reload(); }

// --- LÓGICA DE SELEÇÃO (18 HERÓIS) ---
function initHeroSelect() {
    showScreen('selectScreen');
    const grid = document.getElementById('heroList');
    grid.innerHTML = '';
    HEROIS.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.innerHTML = `<img src="${hero.img}"><p>${hero.name}</p>`;
        card.onclick = () => {
            Som.rugido();
            Som.falar(hero.name);
            startFight(hero);
        };
        grid.appendChild(card);
    });
}

// --- LÓGICA DE LUTA ---
let heroHP = 100, enemyHP = 100;
function startFight(hero) {
    showScreen('fightScreen');
    heroHP = 100; enemyHP = 100;
    document.getElementById('name-p1').innerText = hero.name;
    document.getElementById('hp1').style.width = '100%';
    document.getElementById('hp2').style.width = '100%';
    document.getElementById('player-dino').style.backgroundImage = `url(${hero.img})`;
    document.getElementById('enemy-dino').style.backgroundImage = `url(${VILAO_PADRAO})`;
}

function handleAttack() {
    if (enemyHP <= 0) return;
    Som.ataque();
    const p1 = document.getElementById('player-dino');
    const p2 = document.getElementById('enemy-dino');
    
    p1.style.transform = "translateX(50px)";
    setTimeout(() => {
        p1.style.transform = "translateX(0)";
        p2.classList.add('shake');
        enemyHP -= 15;
        document.getElementById('hp2').style.width = Math.max(0, enemyHP) + '%';
        setTimeout(() => p2.classList.remove('shake'), 300);
        
        if (enemyHP <= 0) {
            Som.sucesso();
            Som.falar("Davi venceu o vilão!");
            alert("VOCÊ VENCEU!");
            location.reload();
        }
    }, 100);
}

function handleSpecial() {
    Som.rugido();
    enemyHP -= 30;
    document.getElementById('hp2').style.width = Math.max(0, enemyHP) + '%';
    if (enemyHP <= 0) handleAttack();
}

// --- JOGO DA MEMÓRIA (EMBARALHA SEMPRE) ---
function initMemory() {
    showScreen('minigameScreen');
    document.getElementById('current-game-title').innerText = "MEMÓRIA";
    document.getElementById('memory-game-wrap').style.display = 'block';
    document.getElementById('puzzle-game-wrap').style.display = 'none';
    
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    // Pega 8 heróis aleatórios e duplica
    const selecionados = [...HEROIS].sort(() => Math.random() - 0.5).slice(0, 8);
    const deck = [...selecionados, ...selecionados].sort(() => Math.random() - 0.5);

    deck.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<img src="${item.img}">`;
        card.onclick = () => {
            if(!card.classList.contains('flipped')) {
                Som.ataque();
                card.classList.add('flipped');
            }
        };
        grid.appendChild(card);
    });
}

// --- QUEBRA-CABEÇA (DINÂMICO) ---
function initPuzzle() {
    showScreen('minigameScreen');
    document.getElementById('current-game-title').innerText = "MONTE O DINO";
    document.getElementById('memory-game-wrap').style.display = 'none';
    document.getElementById('puzzle-game-wrap').style.display = 'block';

    const tray = document.getElementById('puzzle-pieces-tray');
    const shadow = document.getElementById('puzzle-shadow-guide');
    const board = document.getElementById('puzzle-target-box');
    
    tray.innerHTML = '';
    const sorteado = HEROIS[Math.floor(Math.random() * HEROIS.length)];
    board.style.backgroundImage = `url(${sorteado.img})`;
    
    for(let i=0; i<3; i++) {
        const p = document.createElement('div');
        p.className = 'puzzle-piece';
        p.style.backgroundImage = `url(${sorteado.img})`;
        p.onclick = () => {
            Som.sucesso();
            p.style.display = 'none';
            board.style.opacity = parseFloat(board.style.opacity || 0.3) + 0.25;
            if(board.style.opacity >= 1) {
                Som.falar("Parabéns Davi! Você montou o " + sorteado.name);
                alert("MUITO BEM!");
            }
        };
        tray.appendChild(p);
    }
}
