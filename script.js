// 1. A FAMÍLIA DINO MARVEL/DC
const HEROIS = [
    { name: 'Davi-Aranha', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591933.png' },
    { name: 'Mamãe-Maravilha', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591942.png' },
    { name: 'Papai-Morcego', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591946.png' },
    { name: 'Davi de Ferro', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591937.png' },
    { name: 'Papai-Hulk', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591931.png' },
    { name: 'Papai-Thor', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591939.png' },
    { name: 'Vovô-América', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591944.png' },
    { name: 'Titiagio-Flash', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591935.png' },
    { name: 'Super-Papai', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591934.png' },
    { name: 'Vovô-Aquaman', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591941.png' },
    { name: 'Davi-Pantera', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591932.png' },
    { name: 'Titiatina-Viúva', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591945.png' },
    { name: 'Vovô-Wolverine', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591936.png' },
    { name: 'Vovô-Lanterna', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591938.png' },
    { name: 'Mamãe-Invisível', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591940.png' },
    { name: 'Davi-Venom', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591943.png' },
    { name: 'Titiagio-Coringa', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591947.png' },
    { name: 'Titiatina-Arlequina', img: 'https://cdn-icons-png.flaticon.com/512/2591/2591948.png' }
];

// 2. SISTEMA DE SOM
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

// 3. GERAR FUNDO DE DINOS
const bg = document.getElementById('bg');
for(let i=0; i<30; i++) {
    const s = document.createElement('span');
    s.innerText = i % 2 === 0 ? '🦖' : '🦴';
    s.style.fontSize = '2rem';
    bg.appendChild(s);
}

// 4. VARIÁVEIS DO JOGO
let playerHP = 100;
let enemyHP = 100;
let lutando = false;
let loopAtaqueInimigo;

// 5. INICIAR TELA DE SELEÇÃO
function initSelection() {
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

// 6. PREPARAR A LUTA
function startFight(hero) {
    // Reseta as vidas
    playerHP = 100;
    enemyHP = 100;
    lutando = true;
    
    // Sorteia um inimigo aleatório da lista
    const enemy = HEROIS[Math.floor(Math.random() * HEROIS.length)];

    // Atualiza nomes e barras na tela
    document.getElementById('p1-name').innerText = hero.name;
    document.getElementById('p2-name').innerText = enemy.name;
    document.getElementById('hp1').style.width = '100%';
    document.getElementById('hp2').style.width = '100%';
    
    // Troca as telas
    document.getElementById('selection').classList.remove('active');
    document.getElementById('fight').classList.add('active');
    
    // Define as imagens dos lutadores
    document.getElementById('p1-dino').style.backgroundImage = `url(${hero.img})`;
    document.getElementById('p2-dino').style.backgroundImage = `url(${enemy.img})`;
    
    // Voz do narrador
    const msg = new SpeechSynthesisUtterance(`${hero.name} contra ${enemy.name}! Que a batalha comece!`);
    window.speechSynthesis.speak(msg);

    // Inicia a Inteligência Artificial do inimigo (ataca a cada 2 segundos)
    loopAtaqueInimigo = setInterval(ataqueP2, 2000);
}

// 7. ATAQUE DO JOGADOR
function ataqueP1() {
    if (!lutando) return; // Se a luta acabou, não deixa bater
    
    Som.play(150);
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    // Animação de pulo pra frente
    p1.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        p1.style.transform = 'translateX(0)'; // Volta pro lugar
        p2.style.opacity = '0.5'; // Inimigo pisca (dano)
        
        enemyHP -= 20; // Tira 20 de vida do inimigo
        if (enemyHP < 0) enemyHP = 0;
        document.getElementById('hp2').style.width = enemyHP + '%';
        
        setTimeout(() => p2.style.opacity = '1', 150);
        
        // Verifica se o inimigo morreu
        if(enemyHP <= 0) {
            lutando = false;
            clearInterval(loopAtaqueInimigo); // Para o inimigo de atacar
            const win = new SpeechSynthesisUtterance("Vitória épica da família!");
            window.speechSynthesis.speak(win);
            setTimeout(() => {
                alert("VOCÊ VENCEU!");
                location.reload(); // Reinicia o jogo
            }, 500);
        }
    }, 150);
}

// 8. ATAQUE DO INIMIGO (Inteligência Artificial)
function ataqueP2() {
    if (!lutando) return;
    
    Som.play(100); // Som mais grave para o inimigo
    const p1 = document.getElementById('p1-dino');
    const p2 = document.getElementById('p2-dino');
    
    // Animação do inimigo pulando pra frente (negativo no eixo X)
    p2.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        p2.style.transform = 'translateX(0)';
        p1.style.opacity = '0.5'; // Jogador pisca
        
        playerHP -= 15; // Inimigo bate um pouco mais fraco (15 de dano)
        if (playerHP < 0) playerHP = 0;
        document.getElementById('hp1').style.width = playerHP + '%';
        
        setTimeout(() => p1.style.opacity = '1', 150);
        
        // Verifica se o jogador morreu
        if(playerHP <= 0) {
            lutando = false;
            clearInterval(loopAtaqueInimigo);
            const lose = new SpeechSynthesisUtterance("Ah não! O inimigo foi mais forte.");
            window.speechSynthesis.speak(lose);
            setTimeout(() => {
                alert("VOCÊ FOI DERROTADO!");
                location.reload();
            }, 500);
        }
    }, 150);
}
