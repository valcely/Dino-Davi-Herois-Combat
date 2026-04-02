// --- DATABASE DE PERSONAGENS ---
const HEROES = [
    { id: 1, name: 'Dino Davi', hero: 'Spiderman', icon: '🕷️', color: '#E23636' },
    { id: 2, name: 'Dino Mamãe', hero: 'IronMan', icon: '🚀', color: '#FFD700' },
    { id: 3, name: 'Dino Papai', hero: 'Hulk', icon: '💪', color: '#45a049' },
    { id: 4, name: 'Dino Vovó', hero: 'WonderW', icon: '🛡️', color: '#104E8B' },
    { id: 5, name: 'Dino Vovô', hero: 'Batman', icon: '🦇', color: '#222' },
    { id: 6, name: 'Dino Tobby', hero: 'Panther', icon: '🐾', color: '#333' },
    { id: 7, name: 'Dino Atena', hero: 'Wolve', icon: '🐺', color: '#FFB90F' },
    { id: 8, name: 'Dino Titiagio', hero: 'CapitãoA', icon: '⭐', color: '#00529B' },
    { id: 9, name: 'Dino Titiatina', hero: 'Cap Marvel', icon: '☀️', color: '#F0E68C' }
];

const VILLAINS = [
    { id: 10, name: 'T-Rex Venom', icon: '👅' }, { id: 11, name: 'Raptor Joker', icon: '🤡' },
    { id: 12, name: 'Spino Thanos', icon: '💎' }, { id: 13, name: 'Dino Goblin', icon: '👺' },
    { id: 14, name: 'Dino Loki', icon: '🪄' }, { id: 15, name: 'Dino Magneto', icon: '🧲' },
    { id: 16, name: 'Dino Doom', icon: '🎭' }, { id: 17, name: 'Dino Ultron', icon: '🤖' },
    { id: 18, name: 'Dino Carnage', icon: '🩸' }
];

// --- ÁUDIO (MOCKUP PARA GATILHOS) ---
const Sound = {
    play(type) {
        // Criando oscilador simples para feedback sonoro imediato sem arquivos externos
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if(type === 'hit') { osc.frequency.setValueAtTime(150, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); }
        if(type === 'success') { osc.frequency.setValueAtTime(600, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); }
        
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }
};

// --- NAVEGAÇÃO ---
const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id + 'Screen').classList.add('active');
        Sound.play('success');
    }
};

// --- JOGO DA MEMÓRIA ---
const MemoryGame = {
    cards: [], flipped: [], lock: false,
    init() {
        UI.nav('gameArea');
        const container = document.getElementById('minigameContent');
        container.innerHTML = '<div class="memory-grid" id="mGrid"></div>';
        
        // Criar pares com os 18 dinos
        const deck = [...HEROES, ...VILLAINS].sort(() => Math.random() - 0.5).slice(0, 8);
        this.cards = [...deck, ...deck].sort(() => Math.random() - 0.5);
        
        const grid = document.getElementById('mGrid');
        this.cards.forEach((card, index) => {
            const div = document.createElement('div');
            div.className = 'memory-card';
            div.dataset.id = card.id;
            div.dataset.index = index;
            div.innerHTML = '?';
            div.onclick = () => this.flip(div);
            grid.appendChild(div);
        });
    },
    flip(card) {
        if (this.lock || card.classList.contains('flipped')) return;
        
        card.innerHTML = this.cards[card.dataset.index].icon;
        card.classList.add('flipped');
        this.flipped.push(card);

        if (this.flipped.length === 2) {
            this.lock = true;
            const [c1, c2] = this.flipped;
            if (c1.dataset.id === c2.dataset.id) {
                Sound.play('success');
                this.flipped = [];
                this.lock = false;
            } else {
                setTimeout(() => {
                    c1.classList.remove('flipped'); c2.classList.remove('flipped');
                    c1.innerHTML = '?'; c2.innerHTML = '?';
                    this.flipped = [];
                    this.lock = false;
                }, 1000);
            }
        }
    }
};

// --- LOGICA DE LUTA (ADAPTADA) ---
let player = { x: 50, y: 150, color: 'gold', hp: 100, dy: 0, jumping: false };
let enemy = { x: 450, y: 150, hp: 100 };
let projectiles = [];
let keys = { a: false, s: false };

function setupSelect() {
    const container = document.getElementById('dinoSelector');
    HEROES.forEach(h => {
        const div = document.createElement('div');
        div.className = 'btn-main';
        div.style.borderColor = h.color;
        div.innerHTML = `<span style="font-size:2rem">${h.icon}</span><br><small>${h.name}</small>`;
        div.onclick = () => { player.color = h.color; UI.nav('fightScreen'); initFight(); };
        container.appendChild(div);
    });
}

function playerJump() { if(!player.jumping) { player.dy = -15; player.jumping = true; Sound.play('success'); } }

function playerAttack(type) {
    Sound.play('hit');
    if(type === 'hit' && Math.abs(player.x - enemy.x) < 80) {
        enemy.hp -= 10;
    } else if(type === 'power') {
        projectiles.push({ x: player.x + 40, y: player.y + 20, speed: 10 });
    }
    updateFightUI();
}

function updateFightUI() {
    document.getElementById('hp-player').style.width = player.hp + '%';
    document.getElementById('hp-enemy').style.width = enemy.hp + '%';
    if(enemy.hp <= 0) { alert("DINO VENCEU!"); UI.nav('title'); }
}

function initFight() {
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth;
    canvas.height = 300;

    function loop() {
        if(!document.getElementById('fightScreen').classList.contains('active')) return;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        // Movimento
        if(keys.a && player.x > 0) player.x -= 5;
        if(keys.s && player.x < canvas.width - 50) player.x += 5;
        
        player.y += player.dy;
        if(player.y < 180) player.dy += 0.8; else { player.y = 180; player.jumping = false; }

        // Desenho Player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 50, 50);
        
        // Desenho Inimigo
        ctx.fillStyle = '#444';
        ctx.fillRect(enemy.x, enemy.y + 30, 60, 60);

        // Projéteis
        projectiles.forEach((p, i) => {
            p.x += p.speed;
            ctx.fillStyle = 'cyan';
            ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill();
            if(p.x > enemy.x) { enemy.hp -= 5; projectiles.splice(i,1); updateFightUI(); }
        });

        requestAnimationFrame(loop);
    }
    loop();
}

// Inicialização
window.onload = () => {
    setupSelect();
};
