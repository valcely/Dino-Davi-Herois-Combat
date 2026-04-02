// ==========================================
// MOTOR DE ÁUDIO (KIDS SOUNDS)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination);

    if(type === 'pop') { // Clique divertido
        osc.frequency.setValueAtTime(400 + Math.random()*200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if(type === 'roar') { // Dino Bravo
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);
        g.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
}

// ==========================================
// FUNDO ANIMADO (FLORESTA VIVA)
// ==========================================
const bgCanvas = document.getElementById('forestBg');
const bgCtx = bgCanvas.getContext('2d');
let bgFrame = 0;

function animateForest() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgFrame++;
    
    // Grama/Fundo
    bgCtx.fillStyle = '#061a06';
    bgCtx.fillRect(0,0,bgCanvas.width, bgCanvas.height);
    
    // Folhas caindo e balançando
    for(let i=0; i<20; i++) {
        let x = (i * 150 + Math.sin(bgFrame*0.01 + i)*50) % bgCanvas.width;
        let y = (bgFrame * (1 + i%3)) % bgCanvas.height;
        bgCtx.fillStyle = '#14532d';
        bgCtx.beginPath();
        bgCtx.ellipse(x, y, 30, 15, Math.sin(bgFrame*0.05), 0, Math.PI*2);
        bgCtx.fill();
    }
    
    if(!document.getElementById('titleScreen').classList.contains('hidden')) {
        requestAnimationFrame(animateForest);
    }
}

// ==========================================
// NAVEGAÇÃO
// ==========================================
function goTitle() {
    hideAll();
    document.getElementById('titleScreen').classList.remove('hidden');
    animateForest();
}

function hideAll() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}

// ==========================================
// MINI JOGO: LUTINHA (DINOS RENDERIZADOS)
// ==========================================
let playerHp = 100, enemyHp = 100;
function goSelect() {
    playSound('pop');
    hideAll();
    document.getElementById('fightScreen').classList.remove('hidden');
    initFight();
}

function initFight() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 350; canvas.height = 200;
    
    let bite = 0;
    function loop() {
        if(document.getElementById('fightScreen').classList.contains('hidden')) return;
        ctx.clearRect(0,0,350,200);
        
        // Desenha Dino Jogador (Verde)
        drawDino(ctx, 50, 120, '#4ade80', bite);
        // Desenha Inimigo (Vermelho)
        drawDino(ctx, 250, 120, '#ef4444', 0, true);
        
        if(bite > 0) bite--;
        requestAnimationFrame(loop);
    }
    loop();
}

function drawDino(ctx, x, y, color, bite, flip) {
    ctx.save();
    if(flip) { ctx.translate(x+60, 0); ctx.scale(-1, 1); x=0; }
    ctx.fillStyle = color;
    // Corpo
    ctx.fillRect(x, y, 60, 40);
    // Cabeça com animação de mordida
    ctx.fillRect(x + 40, y - 20 - (bite*2), 30, 25);
    // Mandíbula
    ctx.fillRect(x + 40, y + 5 + (bite*2), 30, 10);
    // Olho
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 60, y - 15 - (bite*2), 5, 5);
    ctx.restore();
}

function doAttack() {
    playSound('roar');
    enemyHp -= 10;
    document.querySelector('#hpR div').style.width = enemyHp + '%';
    // Ativa animação de mordida (simulada por frames no loop)
    if(enemyHp <= 0) { alert("Você Venceu!"); goTitle(); enemyHp=100; }
}

// ==========================================
// MINI JOGO: MEMÓRIA
// ==========================================
function startMemoryGame() {
    playSound('pop');
    hideAll();
    document.getElementById('memoryScreen').classList.remove('hidden');
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    const icons = ['🦖', '🦕', '🌋', '🥚', '🦴', '🌳'];
    const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
    
    cards.forEach(icon => {
        const div = document.createElement('div');
        div.className = 'card';
        div.onclick = () => {
            playSound('pop');
            div.textContent = icon;
            div.style.background = '#fff';
        };
        grid.appendChild(div);
    });
}

// ==========================================
// MINI JOGO: CORES
// ==========================================
function startColorGame() {
    playSound('pop');
    hideAll();
    document.getElementById('colorScreen').classList.remove('hidden');
    const pal = document.getElementById('colorPalette');
    pal.innerHTML = '';
    const colors = ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#a855f7'];
    
    colors.forEach(c => {
        const btn = document.createElement('div');
        btn.className = 'color-btn';
        btn.style.backgroundColor = c;
        btn.onclick = () => {
            playSound('pop');
            document.getElementById('colorTarget').style.color = c;
        };
        pal.appendChild(btn);
    });
}

// ==========================================
// MINI JOGO: MONTAR (STACKER)
// ==========================================
let stackY = 320, stackLevel = 1;
function startStackGame() {
    playSound('pop');
    hideAll();
    document.getElementById('stackScreen').classList.remove('hidden');
    const canvas = document.getElementById('stackCanvas');
    canvas.width = 200; canvas.height = 350;
    stackY = 320;
    renderStack();
}

function renderStack() {
    const ctx = document.getElementById('stackCanvas').getContext('2d');
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(50, stackY, 100, 30);
}

function dropPiece() {
    if(stackY > 50) {
        playSound('pop');
        stackY -= 35;
        const ctx = document.getElementById('stackCanvas').getContext('2d');
        ctx.fillStyle = `hsl(${Math.random()*360}, 70%, 50%)`;
        ctx.fillRect(50, stackY, 100, 30);
    } else {
        alert("Torre completa!");
        goTitle();
    }
}

// Inicializar
window.onload = goTitle;
