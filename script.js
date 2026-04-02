// ============================================================
// SISTEMA DE SOM (Sem arquivos externos!)
// ============================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if(type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if(type === 'roar') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    }
}

// ============================================================
// ANIMAÇÃO DE FUNDO (FLORESTA VIVA)
// ============================================================
function drawAnimatedForest() {
    const canvas = document.getElementById('forestBg');
    const c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frame = 0;
    function anim() {
        if(document.getElementById('titleScreen').classList.contains('hidden')) return;
        frame++;
        c.fillStyle = '#0d2b14';
        c.fillRect(0,0, canvas.width, canvas.height);
        
        // Folhas balançando
        for(let i=0; i<15; i++) {
            let x = (i * 100) % canvas.width;
            let y = (i * 50) % canvas.height;
            let wave = Math.sin(frame * 0.05 + i) * 10;
            c.fillStyle = '#166534';
            c.beginPath();
            c.ellipse(x + wave, y, 40, 20, Math.PI/4, 0, Math.PI*2);
            c.fill();
        }
        requestAnimationFrame(anim);
    }
    anim();
}

// ============================================================
// NAVEGAÇÃO E EVENTOS
// ============================================================
function goTitle() {
    playSound('click');
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('titleScreen').classList.remove('hidden');
    drawAnimatedForest();
}

document.getElementById('btnGoSelect').onclick = () => { playSound('click'); goSelect('1p'); };
document.getElementById('btnGoMemory').onclick = () => { playSound('click'); startMemoryGame(); };
document.getElementById('btnGoStack').onclick = () => { playSound('click'); startStackGame(); };

// Melhoria na mordida (mudar animação quando morder)
function trigAtk(atk, def, hk) {
    if(atk.atking || atk.stun) return;
    playSound('roar'); // Som de dinossauro
    atk.atking = true;
    atk.atkT = 400; 
    atk.action = 'attack';
    // Aqui o dino vai abrir a boca mais (já incluso na função drawDino original pelo "jo")
}

// ============================================================
// MINI JOGO: MEMÓRIA
// ============================================================
function startMemoryGame() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('memoryScreen').classList.remove('hidden');
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    let icons = ['🦖', '🦕', '🐊', '🦴', '🌋', '🌳', '🥚', '🌞'];
    let deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    
    deck.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.onclick = () => {
            playSound('click');
            card.textContent = icon;
            card.classList.add('flipped');
            // Lógica de check de pares simplificada...
        };
        grid.appendChild(card);
    });
}

// ============================================================
// MINI JOGO: STACKER (MONTAR)
// ============================================================
let stackY = 350;
function startStackGame() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('stackScreen').classList.remove('hidden');
    const canvas = document.getElementById('stackCanvas');
    canvas.width = 300; canvas.height = 400;
    // Lógica básica de queda de peças
}

// Iniciar
goTitle();
