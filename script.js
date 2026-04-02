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

const Som = {
    play(freq) {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain); gain.connect(actx.destination);
        osc.frequency.value = freq; osc.start(); 
        gain.gain.exponentialRampToValueAtTime(0.00001, actx.currentTime + 0.5);
    }
};

// Criar fundo de Dinos
const bg = document.getElementById('bg');
for(let i=0; i<30; i++) {
    const s = document.createElement('span');
    s.innerText = i % 2 === 0 ? '🦖' : '🦴';
    s.style.fontSize = '2rem';
    bg.appendChild(s);
}

function initSelection() {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('selection').classList.add('active');
    const grid = document.getElementById('heroList');
    grid.innerHTML = '';
    HEROIS.forEach(h => {
        const div = document.createElement('div');
        div.className = 'hero-card';
        div.innerHTML = `<img src="${h.img}"><p>${h.name}</p>`;
        div.onclick = () => startFight(h);
        grid.appendChild(div);
    });
}

let enemyHP = 100;
function startFight(hero) {
    enemyHP = 100;
    document.getElementById('hp2').style.width = '100%';
    document.getElementById('selection').classList.remove('active');
    document.getElementById('fight').classList.add('active');
    document.getElementById('p1-dino').style.backgroundImage = `url(${hero.img})`;
    document.getElementById('p2-dino').style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/2591/2591937.png)`;
    
    const msg = new SpeechSynthesisUtterance("Davi escolheu " + hero.name);
    window.speechSynthesis.speak(msg);
}

function ataqueP1() {
    Som.play(150);
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    p1.style.left = '100px';
    setTimeout(() => {
        p1.style.left = '10px';
        p2.style.filter = 'brightness(2) red';
        enemyHP -= 20;
        document.getElementById('hp2').style.width = enemyHP + '%';
        setTimeout(() => p2.style.filter = 'none', 200);
        
        if(enemyHP <= 0) {
            const win = new SpeechSynthesisUtterance("O Davi venceu o vilão!");
            window.speechSynthesis.speak(win);
            alert("VOCÊ VENCEU!");
            location.reload();
        }
    }, 150);
}
