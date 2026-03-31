// ============================================================
//  CONFIG
// ============================================================
var CW=860, CH=420, GY=335;
var GRAV=0.72, JUMP_V=-17;
var HP_MAX=100, HIT_DMG=8, SP_DMG=22, SP_CD=4500;
var ATK_DUR=360, STUN_DUR=400, PROJ_SPD=11, AI_TICK=360;

// ============================================================
//  CHARACTERS
// ============================================================
var CH_DATA = {
    trex:  {id:'trex',  name:'T-Rex Esmagador',       role:'hero',    color:'#22c55e',accent:'#7c3aed',lc:'#4ade80', speed:2.6,str:2.0, sp:'Tremor',   desc:'Lento e DEVASTADOR'   },
    raptor:{id:'raptor',name:'Velociraptor Raio',      role:'hero',    color:'#ef4444',accent:'#fbbf24',lc:'#fca5a5', speed:7.0,str:0.75,sp:'Investida',desc:'Velocidade EXTREMA'   },
    trice: {id:'trice', name:'Triceratops Patriota',   role:'hero',    color:'#3b82f6',accent:'#ef4444',lc:'#93c5fd', speed:4.0,str:1.2, sp:'Escudo',   desc:'EQUILIBRADO'          },
    ptero: {id:'ptero', name:'Pterodactilo de Ferro',  role:'hero',    color:'#f59e0b',accent:'#dc2626',lc:'#fde68a', speed:4.4,str:1.3, sp:'Laser',    desc:'Tecnologia JURASSICA' },
    spino: {id:'spino', name:'Spinossauro Sombrio',    role:'villain', color:'#7f1d1d',accent:'#6b21a8',lc:'#fca5a5', speed:3.2,str:1.8, sp:'Acido',    desc:'Predador das Aguas',  ai:'aggressive'},
    anky:  {id:'anky',  name:'Anquilossauro Blindado', role:'villain', color:'#78350f',accent:'#065f46',lc:'#d97706', speed:2.0,str:1.6, sp:'Clava',    desc:'Armadura Inquebravel',ai:'defensive' },
    para:  {id:'para',  name:'Parasaurolofus Sonico',  role:'villain', color:'#1e3a8a',accent:'#7c3aed',lc:'#93c5fd', speed:5.0,str:1.0, sp:'Sonico',   desc:'Grito que Paralisa',  ai:'ranged'    },
    carno: {id:'carno', name:'Carnotaurus Selvagem',   role:'villain', color:'#7c2d12',accent:'#ca8a04',lc:'#fb923c', speed:5.5,str:1.5, sp:'Brutus',   desc:'Chifres Letais',      ai:'rushdown'  }
};
var HEROES   = ['trex','raptor','trice','ptero'];
var VILLAINS = ['spino','anky','para','carno'];
var ALL_IDS  = HEROES.concat(VILLAINS);

var HQ_LIST = [
    {w:'POW!',  c:'#fef08a',b:'#7c3aed'},
    {w:'BAM!',  c:'#fff',   b:'#dc2626'},
    {w:'ZAP!',  c:'#fef08a',b:'#0369a1'},
    {w:'CRACK!',c:'#fff',   b:'#9333ea'},
    {w:'WHAM!', c:'#fde68a',b:'#15803d'},
    {w:'SMASH!',c:'#fef9c3',b:'#b91c1c'}
];

// ============================================================
//  STATE
// ============================================================
var gameMode='1p', p1Id='trex', p2Id='spino';
var gs=null, pops=[], hitF={p1:0,p2:0};
var raf=null, resultRaf=null;
var keys={};
var p1In={left:false,right:false,up:false};
var p2In={left:false,right:false,up:false};
var p1Pr={atk:false,sp:false,up:false};
var p2Pr={atk:false,sp:false,up:false};

// ============================================================
//  CANVAS UTILITIES
// ============================================================
function drawEye(c,ex,ey,r,iris){
    iris=iris||'#d97706';
    c.fillStyle='#111'; c.beginPath(); c.arc(ex,ey,r,0,Math.PI*2); c.fill();
    c.fillStyle=iris;   c.beginPath(); c.arc(ex,ey,r*0.72,0,Math.PI*2); c.fill();
    c.fillStyle='#111'; c.beginPath(); c.arc(ex,ey,r*0.4,0,Math.PI*2); c.fill();
    c.fillStyle='rgba(255,255,255,0.75)'; c.beginPath(); c.arc(ex-r*0.25,ey-r*0.25,r*0.22,0,Math.PI*2); c.fill();
}

function starPath(c,cx,cy,r){
    c.beginPath();
    for(var i=0;i<5;i++){
        var a=i*Math.PI*2/5-Math.PI/2, ia=a+Math.PI/5;
        c.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r);
        c.lineTo(cx+Math.cos(ia)*r*0.4, cy+Math.sin(ia)*r*0.4);
    }
    c.closePath();
}

// ============================================================
//  BACKGROUND
// ============================================================
function drawBG(c, W, H){
    var sky=c.createLinearGradient(0,0,0,H*0.65);
    sky.addColorStop(0,'#0a1a0d'); sky.addColorStop(0.5,'#0d2b14'); sky.addColorStop(1,'#133d1c');
    c.fillStyle=sky; c.fillRect(0,0,W,H);

    c.save();
    for(var i=0;i<5;i++){
        var g=c.createLinearGradient(W*0.72,0,W*0.4,H*0.7);
        g.addColorStop(0,'rgba(255,240,160,0.06)'); g.addColorStop(1,'rgba(255,240,160,0)');
        c.fillStyle=g;
        c.beginPath(); c.moveTo(W*0.74+i*18,0); c.lineTo(W*0.3+i*22,H);
        c.lineTo(W*0.25+i*22,H); c.lineTo(W*0.70+i*18,0); c.fill();
    }
    c.restore();

    c.fillStyle='#0b2211'; c.beginPath(); c.moveTo(0,H*0.52);
    var mxs=[60,140,180,210,260,300,350,400,460,510,570,620,680,740,790,860];
    for(var mi=0;mi<mxs.length;mi++) c.lineTo(mxs[mi],H*(mi%2===0?0.30:0.42));
    c.lineTo(W,H*0.55); c.lineTo(0,H*0.55); c.closePath(); c.fill();

    c.fillStyle='#0f2e18'; c.beginPath(); c.moveTo(0,H*0.62);
    var cxs=[0,45,90,130,170,220,265,310,370,425,480,540,600,660,720,780,860];
    for(var ci=0;ci<cxs.length;ci++) c.lineTo(cxs[ci],H*(ci%2===0?0.50:0.61));
    c.lineTo(W,H*0.68); c.lineTo(0,H*0.68); c.closePath(); c.fill();

    c.fillStyle='#0c1f12'; c.fillRect(0,GY+62,W,14);
    c.fillStyle='#0e2a18'; c.fillRect(0,GY+66,W,6);
    c.strokeStyle='rgba(100,200,120,0.18)'; c.lineWidth=2;
    for(var si=0;si<18;si++){ c.beginPath(); c.moveTo(si*52,GY+66); c.lineTo(si*52+28,GY+66); c.stroke(); }

    var gnd=c.createLinearGradient(0,GY+62,0,H);
    gnd.addColorStop(0,'#1a3d0a'); gnd.addColorStop(0.3,'#142e08'); gnd.addColorStop(1,'#0a1a04');
    c.fillStyle=gnd; c.fillRect(0,GY+62,W,H-GY-62);
    c.strokeStyle='rgba(80,180,60,0.3)'; c.lineWidth=3;
    c.beginPath(); c.moveTo(0,GY+64); c.lineTo(W,GY+64); c.stroke();

    for(var ti=0;ti<10;ti++){
        var tx=[20,110,200,290,390,490,590,680,770,840][ti];
        var th=120+(ti%3)*40;
        c.fillStyle=ti%2===0?'#091a0c':'#0b2010';
        c.fillRect(tx-4,GY+50-th,8,th);
        for(var tj=0;tj<3;tj++){
            c.fillStyle='rgba('+(10+tj*4)+','+(35+tj*8)+','+(12+tj*4)+',0.9)';
            c.beginPath(); c.ellipse(tx,GY+50-th+tj*18,28+tj*6,22+tj*4,0,0,Math.PI*2); c.fill();
        }
    }
}

// ============================================================
//  DINO RENDERING (Simplified identifiers)
// ============================================================
function drawDino(c,id,x,y,facing,action,frame,isHit){
    c.save();
    if(facing===-1){ c.scale(-1,1); x=-x; }
    c.translate(x,y);
    if(action==='ko') c.rotate(0.44);
    var bob=action==='idle'?Math.sin(frame*0.09)*2.5:0;
    c.translate(0,bob);
    var atk=action==='attack', ko=action==='ko', walk=action==='walk';
    var leg=walk||atk?Math.sin(frame*0.24)*16:0;
    var tail=walk?Math.sin(frame*0.19)*6:0;

    if(id==='trex')        _trex(c,atk,ko,leg,tail);
    else if(id==='raptor') _raptor(c,atk,ko,leg,tail);
    else if(id==='trice')  _trice(c,atk,ko,leg,tail);
    else if(id==='ptero')  _ptero(c,atk,ko,leg,tail,action);
    else if(id==='spino')  _spino(c,atk,ko,leg,tail);
    else if(id==='anky')   _anky(c,atk,ko,leg,tail);
    else if(id==='para')   _para(c,atk,ko,leg,tail);
    else if(id==='carno')  _carno(c,atk,ko,leg,tail);

    if(isHit){
        c.globalAlpha=0.5;
        c.fillStyle='rgba(255,60,60,0.5)';
        c.fillRect(-42,-92,84,92);
        c.globalAlpha=1;
    }
    c.restore();
}

// ... (Funções _trex, _raptor, etc, omitidas para brevidade, mas devem permanecer no seu código com aspas corrigidas) ...

// ============================================================
//  SCREEN SWITCHER
// ============================================================
function show(id){
    ['titleScreen','selectScreen','fightScreen','resultScreen'].forEach(function(s){
        var el = document.getElementById(s);
        if(el) el.classList.toggle('hidden', s!==id);
    });
}

function goTitle(){
    if(raf){ cancelAnimationFrame(raf); raf=null; }
    if(resultRaf){ cancelAnimationFrame(resultRaf); resultRaf=null; }
    show('titleScreen');
}

// ============================================================
//  SELECT SCREEN
// ============================================================
var selMode='1p', selP1='trex', selP2='spino';

function goSelect(mode){
    selMode=mode;
    selP1='trex';
    selP2=mode==='1p'?'spino':'raptor';
    show('selectScreen');
    document.getElementById('selSub').textContent = mode==='2p'?'P1 ESQUERDA | P2 DIREITA':'HERÓI vs VILÃO CPU';
    buildCards();
    updateVS();
}

function buildCards(){
    var col=document.getElementById('selCols');
    if(!col) return;
    col.innerHTML='';

    function group(label,cls,ids,slot){
        var g=document.createElement('div'); g.className='sel-group';
        var lbl=document.createElement('label'); lbl.className=cls; lbl.textContent=label;
        var row=document.createElement('div'); row.className='cards-row';
        ids.forEach(function(id){ row.appendChild(makeCard(id,slot)); });
        g.appendChild(lbl); g.appendChild(row); col.appendChild(g);
    }

    group('[ HERÓI - P1 ]','lbl-hero', HEROES, 'p1');
    group(selMode==='2p'?'[ P2 ]':'[ VILÃO CPU ]', selMode==='2p'?'lbl-hero':'lbl-villain', selMode==='2p'?ALL_IDS:VILLAINS, 'p2');
}

function makeCard(id,slot){
    var ch=CH_DATA[id];
    var sel=(slot==='p1'&&selP1===id)||(slot==='p2'&&selP2===id);
    var card=document.createElement('div'); card.className='ccard';
    if(sel){
        card.style.borderColor=ch.color;
        card.style.transform='scale(1.06)';
    }
    card.innerHTML = `<div class="ccard-name">${ch.name}</div>`;
    card.onclick = function() { pick(id, slot); };
    return card;
}

function pick(id,slot){
    if(slot==='p1') selP1=id; else selP2=id;
    buildCards(); updateVS();
}

function updateVS(){
    var v1 = document.getElementById('vsN1');
    var v2 = document.getElementById('vsN2');
    if(v1) v1.textContent = CH_DATA[selP1].name;
    if(v2) v2.textContent = selMode==='2p'? CH_DATA[selP2].name : "CPU: " + CH_DATA[selP2].name;
}

// ============================================================
//  BOOT & BUTTONS (AQUI ESTAVA O PROBLEMA)
// ============================================================
window.onload = function() {
    goTitle();

    // Wiring dos botões principais
    document.getElementById('btn1p').onclick = function() { goSelect('1p'); };
    document.getElementById('btn2p').onclick = function() { goSelect('2p'); };
    document.getElementById('btnBack').onclick = function() { goTitle(); };
    document.getElementById('btnFight').onclick = function() { goFight(); };
    
    var btnAgain = document.getElementById('btnAgain');
    if(btnAgain) btnAgain.onclick = function() { goFight(); };
};

// ... (Restante das funções como loop, goFight, etc) ...
