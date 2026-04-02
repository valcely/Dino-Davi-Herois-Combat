// --- CONFIGURAÇÃO DE ÁUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);

    if(type === 'click') {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if(type === 'roar') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if(type === 'win') {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

// --- DESENHO DOS DINOSSAUROS ---
function drawDino(ctx, x, y, color, side, frame, action) {
    ctx.save();
    ctx.translate(x, y);
    if(side === 'left') ctx.scale(-1, 1);
    
    let bob = Math.sin(frame * 0.1) * 5;
    let mouth = (action === 'attack') ? Math.sin(frame * 0.5) * 15 : 0;

    // Corpo
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0 + bob, 40, 25, 0, 0, Math.PI*2);
    ctx.fill();

    // Pescoço e Cabeça
    ctx.beginPath();
    ctx.quadraticCurveTo(-30, -40 + bob, -50, -40 + bob - mouth);
    ctx.lineWidth = 15; ctx.strokeStyle = color; ctx.stroke();
    
    // Olho
    ctx.fillStyle = "white";
    ctx.beginPath(); ctx.arc(-50, -45 + bob - mouth, 5, 0, Math.PI*2); ctx.fill();
    
    ctx.restore();
}

// --- FUNDO ANIMADO ---
let forestFrame = 0;
function drawForest() {
    const canvas = document.getElementById('forestBg');
    if(!canvas || document.getElementById('titleScreen').classList.contains('hidden')) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    
    forestFrame++;
    ctx.fillStyle = '#0d2b14'; ctx.fillRect(0,0,canvas.width, canvas.height);
    
    for(let i=0; i<20; i++) {
        let bx = (i * 120) % canvas.width;
        let by = (i * 80) % canvas.height;
        let wave = Math.sin(forestFrame * 0.03 + i) * 15;
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.ellipse(bx + wave, by, 50, 25, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
    }
    requestAnimationFrame(drawForest);
}

// --- NAVEGAÇÃO ---
function hideAll() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}

function goTitle() {
    playSound('click'); hideAll();
    document.getElementById('titleScreen').classList.remove('hidden');
    drawForest();
}

// --- MINI JOGO: MEMÓRIA ---
function startMemoryGame() {
    playSound('click'); hideAll();
    document.getElementById('memoryScreen').classList.remove('hidden');
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    const icons = ['🦖', '🦕', '🐊', '🦴', '🌋', '🌳', '🥚', '🌞'];
    let deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    
    let flipped = [];
    deck.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.onclick = () => {
            if(flipped.length < 2 && !card.innerText) {
                playSound('click');
                card.innerText = icon;
                flipped.push(card);
                if(flipped.length === 2) {
                    if(flipped[0].dataset.icon === flipped[1].dataset.icon) {
                        playSound('win'); flipped = [];
                    } else {
                        setTimeout(() => { flipped.forEach(c => c.innerText = ''); flipped = []; }, 1000);
                    }
                }
            }
        };
        grid.appendChild(card);
    });
}

// --- MINI JOGO: CORES ---
const colors = ['#ef4444', '#3b82f6', '#22c55e', '#fbbf24', '#a855f7', '#f472b6'];
function startColorsGame() {
    playSound('click'); hideAll();
    document.getElementById('colorsScreen').classList.remove('hidden');
    const target = document.getElementById('colorTarget');
    const options = document.getElementById('colorOptions');
    
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    target.style.backgroundColor = correctColor;
    options.innerHTML = '';
    
    colors.forEach(c => {
        const btn = document.createElement('div');
        btn.className = 'color-circle';
        btn.style.backgroundColor = c;
        btn.onclick = () => {
            if(c === correctColor) { playSound('win'); startColorsGame(); }
            else { playSound('click'); btn.style.opacity = '0.3'; }
        };
        options.appendChild(btn);
    });
}

// --- MINI JOGO: MONTAR (STACKER) ---
let stackPieces = [];
let currentStackX = 50;
let stackDir = 2;
let stackLevel = 1;
function startStackGame() {
    playSound('click'); hideAll();
    document.getElementById('stackScreen').classList.remove('hidden');
    const canvas = document.getElementById('stackCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300; canvas.height = 400;
    stackPieces = []; stackLevel = 1;
    
    function loop() {
        if(document.getElementById('stackScreen').classList.contains('hidden')) return;
        ctx.clearRect(0,0,300,400);
        ctx.fillStyle = '#333'; ctx.fillRect(0, 380, 300, 20); // Chão
        
        // Peça atual se movendo
        currentStackX += stackDir * (1 + stackLevel * 0.5);
        if(currentStackX > 250 || currentStackX < 0) stackDir *= -1;
        
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(currentStackX, 50, 50, 30);
        
        // Peças já caídas
        stackPieces.forEach(p => {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x, p.y, 50, 30);
        });
        requestAnimationFrame(loop);
    }
    loop();
}

document.getElementById('btnDrop').onclick = () => {
    playSound('roar');
    let targetY = 380 - (stackPieces.length + 1) * 30;
    stackPieces.push({x: currentStackX, y: targetY});
    stackLevel++;
    document.getElementById('stackLevel').innerText = stackLevel;
    if(stackPieces.length > 10) { playSound('win'); stackPieces = []; stackLevel = 1; }
};

// --- MODO LUTINHA ---
let playerHP = 100, enemyHP = 100;
function goSelect() {
    playSound('click'); hideAll();
    document.getElementById('selectScreen').classList.remove('hidden');
    const sel = document.getElementById('selCols');
    sel.innerHTML = '';
    ['#22c55e', '#ef4444', '#3b82f6'].forEach(color => {
        const btn = document.createElement('div');
        btn.style.width = "80px"; btn.style.height = "80px";
        btn.style.background = color; btn.style.borderRadius = "20px";
        btn.onclick = () => startFight(color);
        sel.appendChild(btn);
    });
}

function startFight(pColor) {
    playSound('click'); hideAll();
    document.getElementById('fightScreen').classList.remove('hidden');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = 300;
    playerHP = 100; enemyHP = 100;
    let frame = 0, atkTimer = 0;

    function fightLoop() {
        if(document.getElementById('fightScreen').classList.contains('hidden')) return;
        frame++;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        let action = (atkTimer > 0) ? 'attack' : 'idle';
        if(atkTimer > 0) atkTimer--;

        drawDino(ctx, canvas.width*0.2, 200, pColor, 'right', frame, action);
        drawDino(ctx, canvas.width*0.8, 200, '#ef4444', 'left', frame, 'idle');
        
        document.querySelector('#hpL div').style.width = playerHP + '%';
        document.querySelector('#hpR div').style.width = enemyHP + '%';
        
        requestAnimationFrame(fightLoop);
    }
    
    document.getElementById('btnAtk').onclick = () => {
        playSound('roar');
        atkTimer = 20;
        enemyHP -= 10;
        if(enemyHP <= 0) { playSound('win'); goTitle(); }
    };
    
    fightLoop();
}

// Iniciar
window.onload = goTitle;
