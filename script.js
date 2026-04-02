const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id + 'Screen').classList.add('active');
        if(id === 'fight') initGameLoop();
    }
};

// Configuração dos Heróis
const HEROES = [
    { name: 'BAT-DINO', color: '#1a1a1a', power: 'Bumerangue' },
    { name: 'SUPER-DINO', color: '#1e40af', power: 'Laser' },
    { name: 'SPIDER-DINO', color: '#dc2626', power: 'Teia' },
    { name: 'HULK-DINO', color: '#16a34a', power: 'Esmagar' },
    { name: 'IRON-DINO', color: '#facc15', power: 'Raio' }
];

// Estado do Jogo
let player = { x: 50, y: 150, w: 40, h: 60, dy: 0, color: 'blue', hp: 100, jumping: false };
let enemy = { x: 450, y: 150, w: 40, h: 60, color: 'red', hp: 100 };
let keys = { a: false, s: false };
let projectiles = [];

// Seleção de Personagem
function setupSelect() {
    const container = document.getElementById('dinoSelector');
    HEROES.forEach(h => {
        const div = document.createElement('div');
        div.className = 'btn-card';
        div.style.background = h.color;
        div.innerHTML = `<span>🦖</span><br>${h.name}`;
        div.onclick = () => { 
            player.color = h.color; 
            player.name = h.name;
            UI.nav('fight'); 
        };
        container.appendChild(div);
    });
}

// Input de Teclado (PC)
window.addEventListener('keydown', e => {
    if(e.code === 'KeyA') keys.a = true;
    if(e.code === 'KeyS') keys.s = true;
    if(e.code === 'Space') playerJump();
    if(e.code === 'KeyL') playerAttack('hit');
    if(e.code === 'KeyK') playerAttack('power');
});
window.addEventListener('keyup', e => {
    if(e.code === 'KeyA') keys.a = false;
    if(e.code === 'KeyS') keys.s = false;
});

function playerJump() {
    if(!player.jumping) {
        player.dy = -12;
        player.jumping = true;
    }
}

function playerAttack(type) {
    if(type === 'hit' && Math.abs(player.x - enemy.x) < 60) {
        enemy.hp -= 5;
    } else if(type === 'power') {
        projectiles.push({ x: player.x + 20, y: player.y + 20, speed: 7 });
    }
    updateUI();
}

function updateUI() {
    document.getElementById('hp-player').style.width = player.hp + '%';
    document.getElementById('hp-enemy').style.width = enemy.hp + '%';
    if(enemy.hp <= 0) { alert("VITÓRIA!"); location.reload(); }
    if(player.hp <= 0) { alert("DERROTA!"); location.reload(); }
}

function initGameLoop() {
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600; canvas.height = 250;

    function loop() {
        if(!document.getElementById('fightScreen').classList.contains('active')) return;
        
        // Física Movimento
        if(keys.a && player.x > 0) player.x -= 5;
        if(keys.s && player.x < 560) player.x += 5;
        
        // Gravidade
        player.y += player.dy;
        if(player.y < 150) player.dy += 0.8;
        else { player.y = 150; player.dy = 0; player.jumping = false; }

        // Desenho
        ctx.clearRect(0, 0, 600, 250);
        
        // Chão
        ctx.fillStyle = '#1a4d2e';
        ctx.fillRect(0, 210, 600, 40);

        // Player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.w, player.h);
        
        // Inimigo (IA simples que segue)
        ctx.fillStyle = '#555';
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        if(enemy.x > player.x + 50) enemy.x -= 1;

        // Projéteis
        projectiles.forEach((p, i) => {
            p.x += p.speed;
            ctx.fillStyle = 'orange';
            ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill();
            if(p.x > enemy.x && p.x < enemy.x + 40 && p.y > enemy.y) {
                enemy.hp -= 10;
                projectiles.splice(i, 1);
                updateUI();
            }
        });

        requestAnimationFrame(loop);
    }
    loop();
}

// Iniciar
window.onload = () => {
    setupSelect();
    UI.nav('title');
};
