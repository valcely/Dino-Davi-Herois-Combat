// --- SISTEMA DE ÁUDIO ---
let audioReady = false;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSfx(freq, type = 'sine', duration = 0.1) {
    if(!audioReady) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// --- ENGINE GRÁFICA SIMPLES ---
const State = {
    currentScreen: 'bootScreen',
    playerColor: '#4ade80',
    playerHP: 100,
    enemyHP: 100
};

function initGame() {
    audioReady = true;
    audioCtx.resume();
    showScreen('titleScreen');
    animateMenuBg();
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    State.currentScreen = id;
}

function goTitle() {
    playSfx(400);
    showScreen('titleScreen');
}

// --- FUNDO ANIMADO DO MENU ---
function animateMenuBg() {
    const canvas = document.getElementById('skyBg');
    const ctx = canvas.getContext('2d');
    let frame = 0;

    function render() {
        if(State.currentScreen !== 'titleScreen') return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        ctx.fillStyle = '#1a2e1a';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        
        // Nuvens/Moitas estilizadas
        for(let i=0; i<10; i++) {
            ctx.fillStyle = '#2d5a27';
            let x = (Math.sin(frame * 0.005 + i) * 100) + (canvas.width/10 * i*2);
            ctx.beginPath();
            ctx.arc(x % canvas.width, 100 + (i*50), 60, 0, Math.PI*2);
            ctx.fill();
        }
        frame++;
        requestAnimationFrame(render);
    }
    render();
}

// --- MODO LUTINHA ---
function goSelect() {
    playSfx(600);
    showScreen('selectScreen');
    const container = document.getElementById('selCols');
    container.innerHTML = '';
    ['#4ade80', '#60a5fa', '#f87171', '#fbbf24'].forEach(color => {
        const d = document.createElement('div');
        d.className = 'dino-card';
        d.style.background = color;
        d.style.width = '100px'; d.style.height = '100px'; d.style.borderRadius = '20px';
        d.style.margin = '10px'; d.style.border = '5px solid white';
        d.onclick = () => startFight(color);
        container.appendChild(d);
    });
}

function startFight(color) {
    State.playerColor = color;
    State.playerHP = 100;
    State.enemyHP = 100;
    showScreen('fightScreen');
    
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let shake = 0;

    function gameLoop() {
        if(State.currentScreen !== 'fightScreen') return;
        canvas.width = window.innerWidth;
        canvas.height = 300;
        
        ctx.clearRect(0,0,canvas.width, canvas.height);
        if(shake > 0) { ctx.translate(Math.random()*5, Math.random()*5); shake--; }

        // Desenhar Chão
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(0, 250, canvas.width, 50);

        // Desenhar Dinos (Versão Melhorada)
        drawDino(ctx, canvas.width * 0.25, 250, State.playerColor, false, frame);
        drawDino(ctx, canvas.width * 0.75, 250, '#ef4444', true, frame);

        document.querySelector('#hpL .hp-fill').style.width = State.playerHP + '%';
        document.querySelector('#hpR .hp-fill').style.width = State.enemyHP + '%';

        frame++;
        requestAnimationFrame(gameLoop);
    }

    document.getElementById('btnAtk').onclick = () => {
        if(State.enemyHP <= 0) return;
        playSfx(150, 'sawtooth', 0.3);
        State.enemyHP -= 10;
        shake = 10;
        if(State.enemyHP <= 0) {
            setTimeout(() => { alert("DAVI VENCEU!"); goTitle(); }, 500);
        }
    };

    gameLoop();
}

function drawDino(ctx, x, y, color, flip, frame) {
    ctx.save();
    ctx.translate(x, y);
    if(flip) ctx.scale(-1, 1);

    const bounce = Math.sin(frame * 0.15) * 8;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 0, 40, 10, 0, 0, Math.PI*2); ctx.fill();

    // Corpo
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, -30 + bounce, 45, 30, 0, 0, Math.PI*2);
    ctx.fill();

    // Cabeça
    ctx.beginPath();
    ctx.roundRect(-60, -80 + bounce, 50, 40, 10);
    ctx.fill();

    // Olho
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-45, -65 + bounce, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(-47, -65 + bounce, 3, 0, Math.PI*2); ctx.fill();

    ctx.restore();
}

// --- JOGO DE MEMÓRIA (REFEITO) ---
function startMemoryGame() {
    playSfx(500);
    showScreen('gameContainer');
    const content = document.getElementById('gameContent');
    content.innerHTML = '<h2 style="text-align:center">ACHE OS PARES!</h2><div id="memGrid" class="memory-grid"></div>';
    
    const icons = ['🦖','🦕','🌋','🦴','🌳','🥚','🌞','💎'];
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    let flipped = [];

    deck.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.val = icon;
        card.onclick = () => {
            if(flipped.length < 2 && !card.innerText) {
                card.innerText = icon;
                playSfx(800);
                flipped.push(card);
                if(flipped.length === 2) {
                    if(flipped[0].dataset.val === flipped[1].dataset.val) {
                        playSfx(1200, 'sine', 0.4);
                        flipped = [];
                    } else {
                        setTimeout(() => { flipped.forEach(c => c.innerText = ''); flipped = []; }, 800);
                    }
                }
            }
        };
        document.getElementById('memGrid').appendChild(card);
    });
}

// Inicialização segura
window.onload = () => {
    console.log("Dino Davi pronto!");
};
