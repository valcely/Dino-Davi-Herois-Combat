// 1. A LISTA MASTER DA FAMÍLIA DINO-HERÓI (18 PERSONAGENS)
const HEROIS = [
    { name: 'Davi-Aranha', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591933.png' },
    { name: 'Davi de Ferro', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png' },
    { name: 'Davi-Venom', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591943.png' },
    { name: 'Mamãe-Maravilha', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591942.png' },
    { name: 'Mamãe-Invisível', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591940.png' },
    { name: 'Mamãe-Supergirl', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591936.png' },
    { name: 'Papai-Morcego', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591946.png' },
    { name: 'Papai-Hulk', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591931.png' },
    { name: 'Super-Papai', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591934.png' },
    { name: 'Vovô-América', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591944.png' },
    { name: 'Vovô-Aquaman', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591941.png' },
    { name: 'Vovô-Lanterna', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591938.png' },
    { name: 'Vovó-Feiticeira', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591945.png' },
    { name: 'Vovó-Tempestade', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591939.png' },
    { name: 'Titiagio-Flash', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591935.png' },
    { name: 'Titiagio-Coringa', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591947.png' },
    { name: 'Titiatina-Viúva', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591932.png' },
    { name: 'Titiatina-Arlequina', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591948.png' }
];

// 2. SISTEMA DE SOM DE JOGUINHO (Sintetizador 8-bits)
const Som = {
    tocar(freq, tipo = 'square', duracao = 0.15) {
        // Tenta iniciar o áudio no navegador
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = tipo; // 'square' = som de nintendinho, 'sawtooth' = som mais rasgado
        osc.connect(gain); 
        gain.connect(actx.destination);
        osc.frequency.setValueAtTime(freq, actx.currentTime);
        
        // Efeito de queda de som pros golpes do inimigo
        if (tipo === 'sawtooth') {
            osc.frequency.exponentialRampToValueAtTime(freq / 2, actx.currentTime + duracao);
        }
        
        osc.start(); 
        gain.gain.exponentialRampToValueAtTime(0.00001, actx.currentTime + duracao);
    },
    socoP1() { this.tocar(400, 'square', 0.1); }, // Soco agudo do jogador
    socoP2() { this.tocar(150, 'sawtooth', 0.2); }, // Golpe grave do inimigo
    vitoria() { this.tocar(600, 'square', 0.3); setTimeout(() => this.tocar(800, 'square', 0.5), 300); }
};

// 3. VARIÁVEIS DO JOGO E SUPER FORÇA
let playerHP = 100;
let enemyHP = 100;
let lutando = false;
let loopAtaqueInimigo;
let heroiAtual = null;
let inimigoAtual = null;

// 4. INICIAR TELA DE SELEÇÃO
function initSelection() {
    // Toca um sonzinho ao clicar em jogar
    Som.tocar(500, 'square', 0.2);
    
    document.getElementById('menu').classList.remove('active');
    document.getElementById('selection').classList.add('active');
    const grid = document.getElementById('heroList');
    grid.innerHTML = '';
    
    HEROIS.forEach(h => {
        const div = document.createElement('div');
        div.className = 'hero-card';
        div.innerHTML = `<img src="${h.img}" alt="${h.name}"><p>${h.name}</p>`;
        div.onclick = () => startFight(h);
        grid.appendChild(div);
    });
}

// 5. PREPARAR A LUTA
function startFight(hero) {
    heroiAtual = hero;
    playerHP = 100;
    enemyHP = 100;
    lutando = true;
    
    // Sorteia um inimigo diferente de você
    do {
        inimigoAtual = HEROIS[Math.floor(Math.random() * HEROIS.length)];
    } while (inimigoAtual.name === hero.name);

    document.getElementById('p1-name').innerText = hero.name;
    document.getElementById('p2-name').innerText = inimigoAtual.name;
    document.getElementById('hp1').style.width = '100%';
    document.getElementById('hp2').style.width = '100%';
    
    document.getElementById('selection').classList.remove('active');
    document.getElementById('fight').classList.add('active');
    
    document.getElementById('p1-dino').style.backgroundImage = `url(${hero.img})`;
    document.getElementById('p2-dino').style.backgroundImage = `url(${inimigoAtual.img})`;
    
    // Fala quem vai lutar
    const msg = new SpeechSynthesisUtterance(`${hero.name} contra ${inimigoAtual.name}! Que vença o mais forte!`);
    window.speechSynthesis.speak(msg);

    // O inimigo ataca a cada 1.5 segundos
    loopAtaqueInimigo = setInterval(ataqueP2, 1500);
}

// 6. ATAQUE DO JOGADOR
function ataqueP1() {
    if (!lutando) return; 
    
    Som.socoP1();
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    // SISTEMA DE SUPER FORÇA (Davi e Mamãe dão o triplo de dano!)
    let dano = 10; // Dano normal para os outros
    if (heroiAtual.name.includes('Davi') || heroiAtual.name.includes('Mamãe')) {
        dano = 35; // Com 3 socos o inimigo já era!
    }
    
    // Animação e dano
    p1.style.transform = 'translateX(60px)';
    setTimeout(() => {
        p1.style.transform = 'translateX(0)';
        p2.style.opacity = '0.4'; 
        
        enemyHP -= dano; 
        if (enemyHP < 0) enemyHP = 0;
        document.getElementById('hp2').style.width = enemyHP + '%';
        
        setTimeout(() => p2.style.opacity = '1', 150);
        
        // Verifica se o jogador venceu
        if(enemyHP <= 0) {
            lutando = false;
            clearInterval(loopAtaqueInimigo);
            Som.vitoria();
            const win = new SpeechSynthesisUtterance(`Sensacional! ${heroiAtual.name} venceu a batalha!`);
            window.speechSynthesis.speak(win);
            setTimeout(() => {
                alert("VITÓRIA ÉPICA!");
                location.reload(); 
            }, 1000);
        }
    }, 100);
}

// 7. ATAQUE DO INIMIGO (Inteligência Artificial)
function ataqueP2() {
    if (!lutando) return;
    
    Som.socoP2(); 
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    // Dano do inimigo
    let danoInimigo = 15; 
    
    // Animação e dano
    p2.style.transform = 'scaleX(-1) translateX(60px)';
    setTimeout(() => {
        p2.style.transform = 'scaleX(-1) translateX(0)';
        p1.style.opacity = '0.4'; 
        
        playerHP -= danoInimigo; 
        if (playerHP < 0) playerHP = 0;
        document.getElementById('hp1').style.width = playerHP + '%';
        
        setTimeout(() => p1.style.opacity = '1', 150);
        
        // Verifica se o jogador perdeu
        if(playerHP <= 0) {
            lutando = false;
            clearInterval(loopAtaqueInimigo);
            const lose = new SpeechSynthesisUtterance("Ah não! O inimigo foi mais forte dessa vez.");
            window.speechSynthesis.speak(lose);
            setTimeout(() => {
                alert("VOCÊ FOI DERROTADO!");
                location.reload();
            }, 1000);
        }
    }, 100);
}
