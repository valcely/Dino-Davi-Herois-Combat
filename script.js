// 1. A LISTA MASTER DA FAMÍLIA DINO-HERÓI COM IMAGENS REALISTAS
// Esses links geram dinossauros com texturas reais e roupas de super-heróis!
const base_url = "https://image.pollinations.ai/prompt/";
const params = "?width=300&height=300&nologo=true";

const HEROIS = [
    { name: 'Davi-Aranha', img: base_url + 'realistic%100velociraptor%20dinosaur%20in%20spiderman%20suit%20epic%20dark' + params },
    { name: 'Davi de Ferro', img: base_url + 'realistic%20ankylosaurus%20dinosaur%20in%20iron%20man%20armor%20glowing' + params },
    { name: 'Davi-Venom', img: base_url + 'scary%20realistic%20t-rex%20dinosaur%20with%20venom%20symbiote%20teeth' + params },
    { name: 'Mamãe-Maravilha', img: base_url + 'realistic%90pterodactyl%20dinosaur%20wearing%20wonder%20woman%20armor%20epic' + params },
    { name: 'Mamãe-Invisível', img: base_url + 'realistic%20brachiosaurus%20dinosaur%20blue%20glowing%20invisible%20forcefield' + params },
    { name: 'Mamãe-Supergirl', img: base_url + 'realistic%20gallimimus%20dinosaur%20supergirl%20cape%20flying' + params },
    { name: 'Papai-Morcego', img: base_url + 'realistic%20t-rex%20dinosaur%20wearing%20batman%20suit%20dark%20knight' + params },
    { name: 'Papai-Hulk', img: base_url + 'massive%60muscular%20green%20t-rex%20dinosaur%20hulk%20angry%20realistic' + params },
    { name: 'Super-Papai', img: base_url + 'realistic%30triceratops%20dinosaur%20superman%20suit%20red%20cape' + params },
    { name: 'Vovô-América', img: base_url + 'realistic%20stegosaurus%20dinosaur%20captain%20america%20shield%20armor' + params },
    { name: 'Vovô-Aquaman', img: base_url + 'realistic%20spinosaurus%20dinosaur%20aquaman%20golden%20armor%20ocean' + params },
    { name: 'Vovô-Lanterna', img: base_url + 'realistic%20brontosaurus%20dinosaur%20green%20lantern%20glowing%20energy' + params },
    { name: 'Vovó-Feiticeira', img: base_url + 'realistic%20pteranodon%20dinosaur%20scarlet%20witch%20red%20magic%20glowing' + params },
    { name: 'Vovó-Tempestade', img: base_url + 'realistic%20diplodocus%20dinosaur%20storm%20lightning%20white%20eyes' + params },
    { name: 'Titiagio-Flash', img: base_url + 'realistic%20velociraptor%20dinosaur%20flash%20red%20suit%20yellow%20lightning' + params },
    { name: 'Titiagio-Coringa', img: base_url + 'creepy%20realistic%20dilophosaurus%20joker%20makeup%20green%20hair' + params },
    { name: 'Titiatina-Viúva', img: base_url + 'realistic%20baryonyx%20dinosaur%20black%20widow%20stealth%20suit' + params },
    { name: 'Titiatina-Arlequina', img: base_url + 'realistic%20utahraptor%20dinosaur%20harley%20quinn%20colors%20baseball%20bat' + params }
];

// 2. SISTEMA DE SOM DE JOGUINHO (Sintetizador 8-bits)
const Som = {
    tocar(freq, tipo = 'square', duracao = 0.15) {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = tipo; 
        osc.connect(gain); 
        gain.connect(actx.destination);
        osc.frequency.setValueAtTime(freq, actx.currentTime);
        if (tipo === 'sawtooth') {
            osc.frequency.exponentialRampToValueAtTime(freq / 2, actx.currentTime + duracao);
        }
        osc.start(); 
        gain.gain.exponentialRampToValueAtTime(0.00001, actx.currentTime + duracao);
    },
    socoP1() { this.tocar(400, 'square', 0.1); }, 
    socoP2() { this.tocar(150, 'sawtooth', 0.2); }, 
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
    Som.tocar(500, 'square', 0.2);
    document.getElementById('menu').classList.remove('active');
    document.getElementById('selection').classList.add('active');
    const grid = document.getElementById('heroList');
    grid.innerHTML = '';
    
    // Mostra "Carregando" rápido porque as imagens realistas são pesadas
    grid.innerHTML = '<p style="color:gold; text-align:center; width:100%;">Carregando Dinos Reais...</p>';
    
    setTimeout(() => {
        grid.innerHTML = '';
        HEROIS.forEach(h => {
            const div = document.createElement('div');
            div.className = 'hero-card';
            div.innerHTML = `<img src="${h.img}" alt="${h.name}"><p>${h.name}</p>`;
            div.onclick = () => startFight(h);
            grid.appendChild(div);
        });
    }, 500);
}

// 5. PREPARAR A LUTA
function startFight(hero) {
    heroiAtual = hero;
    playerHP = 100;
    enemyHP = 100;
    lutando = true;
    
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
    
    const msg = new SpeechSynthesisUtterance(`${hero.name} contra ${inimigoAtual.name}! Que vença o mais forte!`);
    window.speechSynthesis.speak(msg);

    loopAtaqueInimigo = setInterval(ataqueP2, 1500);
}

// 6. ATAQUE DO JOGADOR
function ataqueP1() {
    if (!lutando) return; 
    
    Som.socoP1();
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    // SISTEMA DE SUPER FORÇA: Davi e Mamãe são muito mais fortes!
    let dano = 10; 
    if (heroiAtual.name.includes('Davi') || heroiAtual.name.includes('Mamãe')) {
        dano = 35; // Mamãe e Davi destroem com 3 golpes!
    }
    
    p1.style.transform = 'translateX(60px)';
    setTimeout(() => {
        p1.style.transform = 'translateX(0)';
        p2.style.opacity = '0.4'; 
        
        enemyHP -= dano; 
        if (enemyHP < 0) enemyHP = 0;
        document.getElementById('hp2').style.width = enemyHP + '%';
        
        setTimeout(() => p2.style.opacity = '1', 150);
        
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

// 7. ATAQUE DO INIMIGO
function ataqueP2() {
    if (!lutando) return;
    
    Som.socoP2(); 
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    let danoInimigo = 15; 
    
    p2.style.transform = 'scaleX(-1) translateX(60px)';
    setTimeout(() => {
        p2.style.transform = 'scaleX(-1) translateX(0)';
        p1.style.opacity = '0.4'; 
        
        playerHP -= danoInimigo; 
        if (playerHP < 0) playerHP = 0;
        document.getElementById('hp1').style.width = playerHP + '%';
        
        setTimeout(() => p1.style.opacity = '1', 150);
        
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
