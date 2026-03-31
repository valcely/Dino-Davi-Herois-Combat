// ============================================================
// CONFIGURAÇÕES GERAIS - DINO DAVI HERÓI COMBAT
// ============================================================
const CW = 800, CH = 400, GY = 300; 
let gameActive = false, gameMode = '1p';
let p1, p2, particles = [];

const CH_DATA = {
    trex:  {id:'trex',  name:'DAVI-REX',      color:'#ef4444', power:'fogo' },
    raptor:{id:'raptor',name:'VELOCI-DAVI',   color:'#facc15', power:'raio' },
    trice: {id:'trice', name:'ESCUDO-TOPS',   color:'#3b82f6', power:'mordida' },
    ptero: {id:'ptero', name:'AERO-DAVI',     color:'#94a3b8', power:'raio' },
    spino: {id:'spino', name:'GIGA-VILÃO',    color:'#475569', power:'mordida' },
    anky:  {id:'anky',  name:'ANKY-PUNHO',    color:'#ea580c', power:'mordida' },
    para:  {id:'para',  name:'SOM-DINOSSAURO',color:'#2563eb', power:'raio' },
    carno: {id:'carno', name:'CHIFRE-FATAL',  color:'#7f1d1d', power:'fogo' }
};

const HEROES = ['trex','raptor','trice','ptero'];
const VILLAINS = ['spino','anky','para','carno'];
let selP1 = 'trex', selP2 = 'spino';

// ============================================================
// INICIALIZAÇÃO (BOOT)
// ============================================================
window.onload = () => {
    // Liga os botões da tela inicial
    document.getElementById('btn1p').onclick = () => { gameMode='1p'; show('selectScreen'); renderCards(); };
    document.getElementById('btn2p').onclick = () => { gameMode='2p'; show('selectScreen'); renderCards(); };
    document.getElementById('btnBack').onclick = () => show('titleScreen');
    document.getElementById('btnFight').onclick = startBattle;

    // Controles de Luta
    const btnAtk = document.querySelector('.btn-atk');
    if(btnAtk) {
        btnAtk.onmousedown = () => { if(p1) p1.atk = true; };
        btnAtk.onmouseup = () => { if(p1) p1.atk = false; };
    }
};

function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// ============================================================
// SELEÇÃO DE PERSONAGENS
// ============================================================
function renderCards() {
    const container = document.getElementById('selCols');
    container.innerHTML = '';
    [...HEROES, ...VILLAINS].forEach(id => {
        const card = document.createElement('div');
        card.className = 'ccard';
        card.style.border = (selP1 === id || selP2 === id) ? "4px solid gold" : "2px solid black";
        card.style.backgroundColor = (selP1 === id || selP2 === id) ? CH_DATA[id].color : "#fff";
        card.innerHTML = `<div class="ccard-name">${CH_DATA[id].name}</div>`;
        card.onclick = () => { selP1 = id; selP2 = VILLAINS[Math.floor(Math.random()*4)]; renderCards(); };
        container.appendChild(card);
    });
}

// ============================================================
// MOTOR DA LUTA (CANVAS)
// ============================================================
function startBattle() {
    show('fightScreen');
    const canvas = document.getElementById('gameCanvas');
    canvas.width = CW; canvas.height = CH;
    const ctx = canvas.getContext('2d');

    p1 = { x: 100, y: GY, hp: 100, color: CH_DATA[selP1].color, power: CH_DATA[selP1].power, atk: false, side: 1 };
    p2 = { x: 600, y: GY, hp: 100, color: CH_DATA[selP2].color, power: CH_DATA[selP2].power, atk: false, side: -1 };

    gameActive = true;
    loop(ctx);
}

function loop(ctx) {
    if(!gameActive) return;

    // IA Simples do Vilão
    if(Math.random() < 0.03) { p2.atk = true; setTimeout(()=>p2.atk=false, 300); }

    // Dano
    if(p1.atk && Math.abs(p1.x - p2.x) < 120) { p2.hp -= 0.5; spawnEffect(p2.x, p2.y, p1.power); }
    if(p2.atk && Math.abs(p1.x - p2.x) < 120) { p1.hp -= 0.5; spawnEffect(p1.x, p1.y, p2.power); }

    // HUD
    document.getElementById('p1hp').style.width = p1.hp + "%";
    document.getElementById('p2hp').style.width = p2.hp + "%";

    // Desenho
    drawScene(ctx);
    drawDino(ctx, p1);
    drawDino(ctx, p2);
    drawParticles(ctx);

    if(p1.hp <= 0 || p2.hp <= 0) {
        alert(p1.hp > 0 ? "DAVI VENCEU!" : "VILÃO VENCEU!");
        location.reload();
    } else {
        requestAnimationFrame(() => loop(ctx));
    }
}

function drawScene(ctx) {
    ctx.fillStyle = "#7dd3fc"; // Céu claro
    ctx.fillRect(0,0,CW,CH);
    ctx.fillStyle = "#fbbf24"; // Sol
    ctx.beginPath(); ctx.arc(700, 60, 40, 0, 7); ctx.fill();
    ctx.fillStyle = "#22c55e"; // Grama
    ctx.fillRect(0, GY+40, CW, 100);
    // Cientistas ao fundo
    ctx.fillStyle = "white"; ctx.fillRect(200, GY+10, 10, 25);
    ctx.fillStyle = "white"; ctx.fillRect(500, GY+10, 10, 25);
}

function drawDino(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.side, 1);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = "black"; ctx.lineWidth = 3;
    
    // Corpo mais "realista" (Arredondado)
    ctx.beginPath();
    ctx.ellipse(0, 0, 50, 35, 0, 0, 7);
    ctx.fill(); ctx.stroke();
    
    // Cabeça
    ctx.beginPath();
    ctx.roundRect(20, -50, 45, 35, 10);
    ctx.fill(); ctx.stroke();

    // Efeito de Ataque (Fogo/Raio)
    if(p.atk) {
        ctx.fillStyle = p.power === 'fogo' ? "rgba(255,100,0,0.6)" : "rgba(0,200,255,0.6)";
        ctx.beginPath(); ctx.arc(50, -20, 40, 0, 7); ctx.fill();
    }
    ctx.restore();
}

function spawnEffect(x, y, power) {
    for(let i=0; i<5; i++) {
        particles.push({ x, y: y-20, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 1, c: power === 'fogo' ? 'red' : 'cyan' });
    }
}

function drawParticles(ctx) {
    particles.forEach((pt, i) => {
        ctx.fillStyle = pt.c; ctx.globalAlpha = pt.life;
        ctx.fillRect(pt.x, pt.y, 6, 6);
        pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.05;
        if(pt.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
}
