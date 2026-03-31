// ============================================================
// CONFIGURAÇÕES GERAIS
// ============================================================
var CW=860, CH=420, GY=335;
var CH_DATA = {
    trex:  {id:'trex',  name:'T-Rex Esmagador',       color:'#22c55e', desc:'Lento e DEVASTADOR' },
    raptor:{id:'raptor',name:'Velociraptor Raio',      color:'#ef4444', desc:'Velocidade EXTREMA' },
    trice: {id:'trice', name:'Triceratops Patriota',   color:'#3b82f6', desc:'EQUILIBRADO' },
    ptero: {id:'ptero', name:'Pterodactilo de Ferro',  color:'#f59e0b', desc:'Tecnologia JURASSICA' },
    spino: {id:'spino', name:'Spinossauro Sombrio',    color:'#7f1d1d', desc:'Predador das Aguas' },
    anky:  {id:'anky',  name:'Anquilossauro Blindado', color:'#78350f', desc:'Armadura Inquebravel' },
    para:  {id:'para',  name:'Parasaurolofus Sonico',  color:'#1e3a8a', desc:'Grito que Paralisa' },
    carno: {id:'carno', name:'Carnotaurus Selvagem',   color:'#7c2d12', desc:'Chifres Letais' }
};
var HEROES   = ['trex','raptor','trice','ptero'];
var VILLAINS = ['spino','anky','para','carno'];
var ALL_IDS  = HEROES.concat(VILLAINS);

var gameMode='1p', selP1='trex', selP2='spino';

// ============================================================
// INICIALIZAÇÃO (BOOT)
// ============================================================
window.onload = function() {
    console.log("Jogo Iniciado");
    goTitle();

    // Configura os cliques dos botões da tela inicial
    document.getElementById('btn1p').onclick = function() { goSelect('1p'); };
    document.getElementById('btn2p').onclick = function() { goSelect('2p'); };
    
    // Botões da tela de seleção
    document.getElementById('btnBack').onclick = function() { goTitle(); };
    document.getElementById('btnFight').onclick = function() { 
        alert("Iniciando luta entre " + CH_DATA[selP1].name + " e " + CH_DATA[selP2].name);
    };
};

// ============================================================
// NAVEGAÇÃO ENTRE TELAS
// ============================================================
function show(id){
    var screens = ['titleScreen','selectScreen','fightScreen','resultScreen'];
    screens.forEach(function(s){
        var el = document.getElementById(s);
        if(el) el.classList.toggle('hidden', s !== id);
    });
}

function goTitle() {
    show('titleScreen');
}

function goSelect(mode) {
    gameMode = mode;
    show('selectScreen');
    document.getElementById('selSub').textContent = (mode === '2p') ? 'MODO 2 JOGADORES' : 'CONTRA A CPU';
    renderCards();
}

// ============================================================
// LÓGICA DE SELEÇÃO
// ============================================================
function renderCards() {
    var col = document.getElementById('selCols');
    if(!col) return;
    col.innerHTML = '';

    // Criar seção P1
    var hTitle = document.createElement('div');
    hTitle.className = 'lbl-hero';
    hTitle.textContent = "JOGADOR 1";
    col.appendChild(hTitle);

    var hRow = document.createElement('div');
    hRow.className = 'cards-row';
    HEROES.forEach(id => hRow.appendChild(createCard(id, 'p1')));
    col.appendChild(hRow);

    // Criar seção P2/CPU
    var vTitle = document.createElement('div');
    vTitle.className = 'lbl-villain';
    vTitle.textContent = (gameMode === '2p') ? "JOGADOR 2" : "VILÃO CPU";
    col.appendChild(vTitle);

    var vRow = document.createElement('div');
    vRow.className = 'cards-row';
    var targets = (gameMode === '2p') ? ALL_IDS : VILLAINS;
    targets.forEach(id => vRow.appendChild(createCard(id, 'p2')));
    col.appendChild(vRow);
}

function createCard(id, slot) {
    var ch = CH_DATA[id];
    var isSel = (slot === 'p1' && selP1 === id) || (slot === 'p2' && selP2 === id);
    
    var card = document.createElement('div');
    card.className = 'ccard';
    if(isSel) card.style.border = "3px solid white";
    card.style.backgroundColor = isSel ? ch.color : "#333";
    
    card.innerHTML = `
        <div style="font-weight:bold">${ch.name}</div>
        <div style="font-size:10px">${ch.desc}</div>
    `;

    card.onclick = function() {
        if(slot === 'p1') selP1 = id; else selP2 = id;
        renderCards();
        updateVSPreview();
    };
    return card;
}

function updateVSPreview() {
    document.getElementById('vsN1').textContent = CH_DATA[selP1].name;
    document.getElementById('vsN1').style.color = CH_DATA[selP1].color;
    document.getElementById('vsN2').textContent = CH_DATA[selP2].name;
    document.getElementById('vsN2').style.color = CH_DATA[selP2].color;
}
