// ============================================================
// CONFIGURAÇÕES GERAIS - ESTILO INVINCIBLE / JURASSIC
// ============================================================
const CW = 800, CH = 400, GY = 320; // Dimensões do Mundo
let gameMode = '1p', selP1 = 'trex', selP2 = 'spino';
let p1, p2, particles = [], gameActive = false;

const CH_DATA = {
    trex:  {id:'trex',  name:'OMNI-REX',    color:'#ef4444', desc:'Poder Absoluto', power:'fogo' },
    raptor:{id:'raptor',name:'MARK-TOR',    color:'#facc15', desc:'O Invencível',   power:'raio' },
    trice: {id:'trice', name:'EVE-TOPS',    color:'#ec4899', desc:'Energia Rosa',   power:'raio' },
    ptero: {id:'ptero', name:'ROBO-DÁCTILO',color:'#94a3b8', desc:'Laser Tech',     power:'fogo' },
    spino: {id:'spino', name:'BATTLE-BEAST',color:'#475569', desc:'Vilão Brutal',   power:'mordida' },
    anky:  {id:'anky',  name:'TIGER-ANKY',  color:'#ea580c', desc:'Punho de Ferro', power:'mordida' },
    para:  {id:'para',  name:'SONIC-BIRD',  color:'#2563eb', desc:'Grito Sônico',   power:'raio' },
    carno: {id:'carno', name:'THRAGG-SAUR', color:'#7f1d1d', desc:'Imperador Vilão',power:'fogo' }
};

const HEROES = ['trex','raptor','trice','ptero'];
const VILLAINS = ['spino','anky','para','carno'];

// ============================================================
// INICIALIZAÇÃO E NAVEGAÇÃO
// ============================================================
window.onload = () => {
    goTitle();
    setupInputs();
};

function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goTitle() { show('titleScreen'); gameActive = false; }

function goSelect(mode) {
    gameMode = mode;
    show('selectScreen');
    renderCards();
}

function goFight() {
    show('fightScreen');
    initBattle();
    gameActive = true;
    requestAnimationFrame(gameLoop);
}

// ============================================================
// LÓGICA DE SELEÇÃO (INTERFACE HQ)
// ============================================================
function renderCards() {
    const col = document.getElementById('selCols');
    col.innerHTML = '';
    
    // Grid de Heróis e Vilões
    [...HEROES, ...VILLAINS].forEach(id => {
        const ch = CH_DATA[id];
        const card = document.createElement('div');
        card.className = 'ccard';
        if(selP1 === id || selP2 === id) card.style.backgroundColor = ch.color;
        
        card.innerHTML = `
            <div class="ccard-name">${ch.name}</div>
            <div class="ccard-sp">${ch.power.toUpperCase()}</div>
        `;
        
        card.onclick = () => {
            if(gameMode === '2p') {
                selP2 = selP1; selP1 = id; // Alterna seleção
            } else {
                selP1 = id;
                selP2 = VILLAINS[Math.floor(Math.random()*VILLAINS.length)];
            }
            renderCards();
            updateVS();
        };
        col.appendChild(card);
    });
    updateVS();
}

function updateVS() {
    document.getElementById('vsN1').innerText = CH_DATA[selP1].name;
    document.getElementById('vsN2').innerText = CH_DATA[selP2].name;
    document.getElementById('btnFight').onclick = goFight;
}

// ============================================================
// MOTOR DE COMBATE (CANVAS)
// ============================================================
function initBattle() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = CW; canvas.height = CH;
    
    p1 = { x:150, y:GY, hp:100, side:1, data:CH_DATA[selP1], atk:false };
    p2 = { x:600, y:GY, hp:100, side:-1, data:CH_DATA[selP2], atk:false };
}

function gameLoop() {
    if(!gameActive) return;
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    
    updateLogic();
    draw(ctx);
    requestAnimationFrame(gameLoop);
}

function updateLogic() {
    // IA Simples para o Vilão
    if(gameMode === '1p') {
        if(Math.random() < 0.02) p2.atk = true;
        setTimeout(() => p2.atk = false, 500);
    }
    
    // Teste de Colisão de Ataque
    if(p1.atk && Math.abs(p1.x - p2.x) < 100) { p2.hp -= 0.5; createEffect(p2.x, p2.y, p1.data.power); }
    if(p2.atk && Math.abs(p1.x - p2.x) < 100) { p1.hp -= 0.5; createEffect(p1.x, p1.y, p2.data.power); }
    
    // Atualiza Barras de Vida no HUD
    document.getElementById('p1hp').style.width = p1.hp + "%";
    document.getElementById('p2hp').style.width = p2.hp + "%";

    if(p1.hp <= 0 || p2.hp <= 0) endGame();
}

function draw(ctx) {
    // 1. CENÁRIO JURASSIC PARK CLARO
    ctx.fillStyle = "#7dd3fc"; // Céu Azul
    ctx.fillRect(0,0,CW,CH);
    
    ctx.fillStyle = "#fef08a"; // Sol
    ctx.beginPath(); ctx.arc(CW-80, 60, 30, 0, 7); ctx.fill();

    ctx.fillStyle = "#22c55e"; // Grama
    ctx.fillRect(0, GY+20, CW, 100);

    // 2. DESENHO DOS DINOSSAUROS (Visual HQ)
    drawDino(ctx, p1);
    drawDino(ctx, p2);
    
    // 3. PARTÍCULAS (Fogo/Raio)
    drawParticles(ctx);
}

function drawDino(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.side, 1);
    
    // Corpo Estilizado (Não é apenas um quadrado)
    ctx.fillStyle = p.data.color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    
    // Cabeça e Corpo
    ctx.beginPath();
    ctx.roundRect(-40, -60, 80, 60, 10);
    ctx.fill(); ctx.stroke();
    
    // Olho "Invincible"
    ctx.fillStyle = "white";
    ctx.fillRect(10, -50, 20, 10);
    
    // Braços de Herói (Skins)
    ctx.fillStyle = "#000";
    ctx.fillRect(10, -30, 15, 5);

    if(p.atk) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath(); ctx.arc(40, -30, 30, 0, 7); ctx.fill();
    }
    
    ctx.restore();
}

function createEffect(x, y, type) {
    for(let i=0; i<5; i++) {
        particles.push({
            x, y: y-30, 
            vx: (Math.random()-0.5)*10, 
            vy: (Math.random()-0.5)*10, 
            life: 1, 
            color: type === 'fogo' ? '#ef4444' : '#facc15'
        });
    }
}

function drawParticles(ctx) {
    particles.forEach((pt, i) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.fillRect(pt.x, pt.y, 8, 8);
        pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.05;
        if(pt.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
}

function setupInputs() {
    // Botões de Ataque
    const btnAtk = document.querySelector('.btn-atk');
    if(btnAtk) {
        btnAtk.onmousedown = () => p1.atk = true;
        btnAtk.onmouseup = () => p1.atk = false;
        btnAtk.ontouchstart = (e) => { e.preventDefault(); p1.atk = true; };
        btnAtk.ontouchend = () => p1.atk = false;
    }
}

function endGame() {
    gameActive = false;
    alert("FIM DA LUTA! " + (p1.hp > 0 ? "O HERÓI VENCEU!" : "O VILÃO VENCEU!"));
    goTitle();
}
