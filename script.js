const UI = {
    nav(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};

// --- OS 18 DINO-HERÓIS ---
const HEROIS = [
    { name: 'DAVI-SPIDER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591933.png' },
    { name: 'MAMÃE-WONDER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591942.png' },
    { name: 'PAPAI-BAT', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591946.png' },
    { name: 'DINO-IRON', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png' },
    { name: 'DINO-HULK', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591931.png' },
    { name: 'DINO-THOR', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591939.png' },
    { name: 'DINO-CAP', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591944.png' },
    { name: 'DINO-FLASH', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591935.png' },
    { name: 'DINO-SUPER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591934.png' },
    { name: 'DINO-AQUA', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591941.png' },
    { name: 'DINO-PANTHER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591932.png' },
    { name: 'DINO-WIDOW', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591945.png' },
    { name: 'DINO-LOGAN', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591936.png' },
    { name: 'DINO-LANTERN', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591938.png' },
    { name: 'DINO-GROOT', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591940.png' },
    { name: 'DINO-VENOM', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591943.png' },
    { name: 'DINO-JOKER', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591947.png' },
    { name: 'DINO-THANOS', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591948.png' }
];

// Preencher fundo
const bg = document.getElementById('bgIcons');
for(let i=0; i<36; i++) {
    const span = document.createElement('span');
    span.innerHTML = i % 2 === 0 ? '🦖' : '🦴';
    bg.appendChild(span);
}

function initHeroSelect() {
    UI.nav('selectScreen');
    const list = document.getElementById('heroList');
    list.innerHTML = '';
    HEROIS.forEach(hero => {
        const div = document.createElement('div');
        div.className = 'hero-card';
        div.innerHTML = `<img src="${hero.img}"><p>${hero.name}</p>`;
        div.onclick = () => startFight(hero);
        list.appendChild(div);
    });
}

let currentHero = HEROIS[0];
let p2HP = 100;

function startFight(hero) {
    currentHero = hero;
    p2HP = 100;
    UI.nav('fightScreen');
    renderFight();
}

function atacar() {
    p2HP -= 10;
    document.getElementById('hp2').style.width = p2HP + '%';
    if(p2HP <= 0) { alert("VITÓRIA DO " + currentHero.name); location.reload(); }
}

function renderFight() {
    const canvas = document.getElementById('fightCanvas');
    const ctx = canvas.getContext('2d');
    const hImg = new Image(); hImg.src = currentHero.img;
    const vImg = new Image(); vImg.src = 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png';

    function loop() {
        if(!document.getElementById('fightScreen').classList.contains('active')) return;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(hImg, 50, 150, 100, 100);
        ctx.drawImage(vImg, canvas.width-150, 150, 100, 100);
        requestAnimationFrame(loop);
    }
    loop();
}

// MEMÓRIA EMBARALHADA
function initMemory() {
    alert("Iniciando Memória com os 18 Dinos!");
    // Lógica de embaralhar HEROIS e criar o grid...
}
