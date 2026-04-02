// --- CONFIGURAÇÕES ---
const HEROES = [
    { id: 1, name: 'DAVI (ARANHA)', icon: '🕷️', color: '#e11d48' },
    { id: 2, name: 'MAMÃE (FERRO)', icon: '🚀', color: '#facc15' },
    { id: 3, name: 'PAPAI (HULK)', icon: '💪', color: '#16a34a' },
    { id: 4, name: 'VOVÓ (WONDER)', icon: '👑', color: '#1e40af' },
    { id: 5, name: 'VOVÔ (BATMAN)', icon: '🦇', color: '#1a1a1a' },
    { id: 6, name: 'TOBBY (PANTERA)', icon: '🐾', color: '#4b5563' },
    { id: 7, name: 'ATENA (WOLVERINE)', icon: '🐺', color: '#f59e0b' },
    { id: 8, name: 'TITIAGIO (CAP)', icon: '🛡️', color: '#2563eb' },
    { id: 9, name: 'TITIATINA (MARVEL)', icon: '🌟', color: '#db2777' }
];

const VILLAINS = [
    { name: 'GIGANTOSSAURO', icon: '🦖' }, { name: 'SPINO-DARK', icon: '🐊' },
    { name: 'RAPTOR-NIGHT', icon: '🦎' }, { name: 'PTERO-TERROR', icon: '🦅' },
    { name: 'T-REX-VOID', icon: '💀' }, { name: 'CARNO-FIRE', icon: '🔥' },
    { name: 'MOSA-SHADOW', icon: '🌊' }, { name: 'TRI-CRUSH', icon: '🪨' },
    { name: 'BRONTO-STOMP', icon: '👣' }
];

const playSound = (type) => {
    const sounds = { 'hit': '🔊 Rugido!', 'miss': '🎵 Blip', 'win': '🎉 Vitória!', 'click': '🖱️ Click' };
    console.log("Som ativado:", sounds[type]);
};

let currentPlayerHero = HEROES[0];
let currentEnemy = VILLAINS[0];
let fightActive = false;
let projectiles = [];
let player = { x: 50, y: 180, hp: 100, dy: 0, jumping: false };
let enemy = { x: 450, y: 180, hp: 100 };
let keys = { a: false, s: false };

const UI = {
    nav(id) {
        const target = document.getElementById(id + 'Screen');
        if (!target) return console.error("Tela não encontrada: " + id + 'Screen');
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        target.classList.add('active');
        playSound('click');
        
        if(id === 'fight') {
            initFight();
        } else {
            fightActive = false; // Para o loop se sair da luta
        }
    }
};

function setupSelect() {
    const container = document.getElementById('dinoSelector');
    if (!container) return;
    container.innerHTML = '';
    HEROES.forEach(h => {
        const div = document.createElement('div');
        div.className = 'hero-card';
        div.innerHTML = `<span>${h.icon}</span><p>${h.name}</p>`;
        div.onclick = () => { 
            currentPlayerHero = h; 
            UI.nav('fight'); 
        };
        container.appendChild(div);
    });
}

function initFight() {
    fightActive = true;
    player.hp = 100; enemy.hp = 100;
    player.x = 50; enemy.x = 450;
    projectiles = [];
    currentEnemy = VILLAINS[Math.floor(Math.random() * VILLAINS.length)];
    
    const enemyTitle = document.getElementById('enemy-name');
    if (enemyTitle) enemyTitle.innerText = currentEnemy.name;
    
    updateFightUI();
    gameLoop();
}

// Movimentação por teclado
window.addEventListener('keydown', e => {
    if(e.key.toLowerCase() === 'a') keys.a = true;
    if(e.key.toLowerCase() === 's') keys.s = true;
    if(e.key === ' ') { e.preventDefault(); playerJump(); }
    if(e.key.toLowerCase() === 'f') playerAttack('power');
});
window.addEventListener('keyup', e => {
    if(e.key.toLowerCase() === 'a') keys.a = false;
    if(e.key.toLowerCase() === 's') keys.s = false;
});

function playerJump() { 
    if(!player.jumping) { player.dy = -15; player.jumping = true; playSound('click'); } 
}

function playerAttack(type) {
    if(type === 'power') {
        projectiles.push({ x: player.x + 40, y: player.y + 20, speed: 8 });
        playSound('hit');
    }
}

function updateFightUI() {
    const pBar = document.getElementById('hp-player');
    const eBar = document.getElementById('hp-enemy');
    if(pBar) pBar.style.width = player.hp + '%';
    if(eBar) eBar.style.width = enemy.hp + '%';
    
    if(enemy.hp <= 0 && fightActive) { 
        fightActive = false;
        alert("VITÓRIA! VOCÊ VENCEU O " + currentEnemy.name); 
        UI.nav('title'); 
    }
}

function gameLoop() {
    if(!fightActive) return;

    const canvas = document.getElementById('fightCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Movimento
    if(keys.a && player.x > 0) player.x -= 5;
    if(keys.s && player.x < canvas.width - 60) player.x += 5;
    
    player.y += player.dy;
    if(player.y < 180) {
        player.dy += 0.8; 
    } else { 
        player.y = 180; player.dy = 0; player.jumping = false; 
    }

    // Desenho
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.font = "50px Arial";
    ctx.fillText(currentPlayerHero.icon, player.x, player.y);
    ctx.fillText(currentEnemy.icon, enemy.x, enemy.y);
    
    // IA do Inimigo
    if(enemy.x > player.x + 60) enemy.x -= 1;

    // Projéteis
    projectiles.forEach((p, i) => {
        p.x += p.speed;
        ctx.fillStyle = "gold";
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill();
        
        if(p.x > enemy.x && p.x < enemy.x + 50 && Math.abs(p.y - enemy.y) < 50) { 
            enemy.hp -= 5; 
            projectiles.splice(i, 1); 
            updateFightUI(); 
        }
    });

    requestAnimationFrame(gameLoop);
}

// Jogo da Memória funcionando
function initMemory() {
    UI.nav('gameArea');
    const container = document.getElementById('minigameContent');
    if(!container) return;
    container.innerHTML = '';
    
    let cards = [...HEROES].slice(0, 8); // Pega 8 heróis para fazer 16 cartas
    let deck = [...cards, ...cards].sort(() => Math.random() - 0.5);
    let flipped = [];
    let lock = false;

    deck.forEach(card => {
        const el = document.createElement('div');
        el.className = 'memory-card';
        el.dataset.id = card.id;
        el.onclick = () => {
            if(lock || el.classList.contains('flipped')) return;
            el.classList.add('flipped');
            el.innerHTML = card.icon;
            flipped.push(el);

            if(flipped.length === 2) {
                lock = true;
                if(flipped[0].dataset.id === flipped[1].dataset.id) {
                    playSound('hit');
                    flipped = [];
                    lock = false;
                } else {
                    setTimeout(() => {
                        flipped.forEach(c => { c.classList.remove('flipped'); c.innerHTML = ''; });
                        flipped = [];
                        lock = false;
                    }, 800);
                }
            }
        };
        container.appendChild(el);
    });
}

window.onload = () => { setupSelect(); };
