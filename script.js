// ============================================================
//  CONFIG
// ============================================================
var CW=860, CH=420, GY=335;
var GRAV=0.72, JUMP_V=-17;
var HP_MAX=100, HIT_DMG=8, SP_DMG=22, SP_CD=4500;
var ATK_DUR=360, STUN_DUR=400, PROJ_SPD=11, AI_TICK=360;

// ============================================================
//  PERSONAGENS – familia Davi (9 personagens)
// ============================================================
var CH_DATA = {
/* –– HEROIS –– */
daviAranha: {
id:‘daviAranha’, name:‘DAVI-ARANHA’, role:‘hero’,
color:’#3b82f6’, accent:’#dc2626’, lc:’#93c5fd’,
speed:6.2, str:0.9, sp:‘Teia’, desc:‘Agil e preciso’,
ai:‘ranged’,
bodyColor:’#1e40af’, markColor:’#dc2626’, letter:‘A’
},
daviDeFerro: {
id:‘daviDeFerro’, name:‘DAVI DE FERRO’, role:‘hero’,
color:’#ef4444’, accent:’#fbbf24’, lc:’#fca5a5’,
speed:4.4, str:1.4, sp:‘Laser’, desc:‘Armadura de aco’,
bodyColor:’#b91c1c’, markColor:’#fbbf24’, letter:‘I’
},
daviSombra: {
id:‘daviSombra’, name:‘DAVI-SOMBRA’, role:‘villain’,
color:’#6b7280’, accent:’#a855f7’, lc:’#d1d5db’,
speed:5.0, str:1.5, sp:‘Sombra’, desc:‘Das trevas’,
ai:‘aggressive’,
bodyColor:’#1f2937’, markColor:’#a855f7’, letter:‘V’
},
mamaGuerreira: {
id:‘mamaGuerreira’, name:‘MAMAE-GUERREIRA’, role:‘hero’,
color:’#3b82f6’, accent:’#fbbf24’, lc:’#93c5fd’,
speed:4.8, str:1.3, sp:‘Garras’, desc:‘Forca de mae’,
bodyColor:’#1e3a8a’, markColor:’#fbbf24’, letter:‘M’
},
mamaCristal: {
id:‘mamaCristal’, name:‘MAMAE-CRISTAL’, role:‘hero’,
color:’#06b6d4’, accent:’#a855f7’, lc:’#67e8f9’,
speed:5.2, str:1.0, sp:‘Cristal’, desc:‘Pura energia’,
bodyColor:’#0e7490’, markColor:’#a855f7’, letter:‘M’
},
mamaEstelar: {
id:‘mamaEstelar’, name:‘MAMAE-ESTELAR’, role:‘hero’,
color:’#3b82f6’, accent:’#ef4444’, lc:’#93c5fd’,
speed:4.0, str:1.2, sp:‘Estelar’, desc:‘Luz das estrelas’,
bodyColor:’#1e40af’, markColor:’#ef4444’, letter:‘S’
},
papaiNoturno: {
id:‘papaiNoturno’, name:‘PAPAI-NOTURNO’, role:‘hero’,
color:’#6b7280’, accent:’#3b82f6’, lc:’#d1d5db’,
speed:3.8, str:1.6, sp:‘Noite’, desc:‘Guardiao noturno’,
bodyColor:’#374151’, markColor:’#3b82f6’, letter:‘B’
},
papaiTita: {
id:‘papaiTita’, name:‘PAPAI-TITA’, role:‘hero’,
color:’#22c55e’, accent:’#fbbf24’, lc:’#4ade80’,
speed:2.8, str:2.0, sp:‘Tremor’, desc:‘Forca maxima’,
bodyColor:’#15803d’, markColor:’#fbbf24’, letter:‘H’
},
superPapai: {
id:‘superPapai’, name:‘SUPER-PAPAI’, role:‘hero’,
color:’#3b82f6’, accent:’#ef4444’, lc:’#93c5fd’,
speed:4.2, str:1.4, sp:‘Super’, desc:‘O mais forte’,
bodyColor:’#1d4ed8’, markColor:’#ef4444’, letter:‘S’
}
};

var HEROES   = [‘daviAranha’,‘daviDeFerro’,‘mamaGuerreira’,‘mamaCristal’,‘mamaEstelar’,‘papaiNoturno’,‘papaiTita’,‘superPapai’];
var VILLAINS = [‘daviSombra’];
var ALL_IDS  = [‘daviAranha’,‘daviDeFerro’,‘daviSombra’,‘mamaGuerreira’,‘mamaCristal’,‘mamaEstelar’,‘papaiNoturno’,‘papaiTita’,‘superPapai’];

var HQ_LIST = [
{w:‘POW!’,  c:’#fef08a’,b:’#7c3aed’},
{w:‘BAM!’,  c:’#fff’,   b:’#dc2626’},
{w:‘ZAP!’,  c:’#fef08a’,b:’#0369a1’},
{w:‘CRACK!’,c:’#fff’,   b:’#9333ea’},
{w:‘WHAM!’, c:’#fde68a’,b:’#15803d’},
{w:‘SMASH!’,c:’#fef9c3’,b:’#b91c1c’}
];

// ============================================================
//  STATE
// ============================================================
var gameMode=‘1p’, p1Id=‘daviAranha’, p2Id=‘daviSombra’;
var gs=null, pops=[], hitF={p1:0,p2:0};
var raf=null, resultRaf=null;
var keys={};
var p1In={left:false,right:false,up:false};
var p2In={left:false,right:false,up:false};
var p1Pr={atk:false,sp:false,up:false};
var p2Pr={atk:false,sp:false,up:false};

// ============================================================
//  ESTRELAS DE FUNDO
// ============================================================
function createStars(containerId){
var c=document.getElementById(containerId);
if(!c) return;
for(var i=0;i<80;i++){
var d=document.createElement(‘div’);
d.className=‘star-dot’;
var sz=Math.random()*2+1;
d.style.cssText=‘width:’+sz+‘px;height:’+sz+‘px;top:’+(Math.random()*100)+’%;left:’+(Math.random()*100)+’%;animation-duration:’+(Math.random()*4+2)+‘s;animation-delay:’+(Math.random()*4)+‘s;opacity:’+(Math.random()*0.5+0.1);
c.appendChild(d);
}
}

// ============================================================
//  CANVAS UTILITIES
// ============================================================
function drawEye(c,ex,ey,r,iris){
iris=iris||’#d97706’;
c.fillStyle=’#111’; c.beginPath(); c.arc(ex,ey,r,0,Math.PI*2); c.fill();
c.fillStyle=iris;   c.beginPath(); c.arc(ex,ey,r*0.72,0,Math.PI*2); c.fill();
c.fillStyle=’#111’; c.beginPath(); c.arc(ex,ey,r*0.4,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(255,255,255,0.8)’; c.beginPath(); c.arc(ex-r*0.25,ey-r*0.25,r*0.24,0,Math.PI*2); c.fill();
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
//  FUNDO JURASSICO
// ============================================================
function drawBG(c,W,H){
var sky=c.createLinearGradient(0,0,0,H*0.65);
sky.addColorStop(0,’#0a1a0d’); sky.addColorStop(0.5,’#0d2b14’); sky.addColorStop(1,’#133d1c’);
c.fillStyle=sky; c.fillRect(0,0,W,H);

c.save();
for(var i=0;i<5;i++){
var g=c.createLinearGradient(W*0.72,0,W*0.4,H*0.7);
g.addColorStop(0,‘rgba(255,240,160,0.06)’); g.addColorStop(1,‘rgba(255,240,160,0)’);
c.fillStyle=g;
c.beginPath(); c.moveTo(W*0.74+i*18,0); c.lineTo(W*0.3+i*22,H);
c.lineTo(W*0.25+i*22,H); c.lineTo(W*0.70+i*18,0); c.fill();
}
c.restore();

c.fillStyle=’#0b2211’; c.beginPath(); c.moveTo(0,H*0.52);
var mxs=[60,140,180,210,260,300,350,400,460,510,570,620,680,740,790,860];
for(var mi=0;mi<mxs.length;mi++) c.lineTo(mxs[mi],H*(mi%2===0?0.30:0.42));
c.lineTo(W,H*0.55); c.lineTo(0,H*0.55); c.closePath(); c.fill();

c.fillStyle=’#0f2e18’; c.beginPath(); c.moveTo(0,H*0.62);
var cxs=[0,45,90,130,170,220,265,310,370,425,480,540,600,660,720,780,860];
for(var ci=0;ci<cxs.length;ci++) c.lineTo(cxs[ci],H*(ci%2===0?0.50:0.61));
c.lineTo(W,H*0.68); c.lineTo(0,H*0.68); c.closePath(); c.fill();

c.fillStyle=’#0c1f12’; c.fillRect(0,GY+62,W,14);
c.fillStyle=’#0e2a18’; c.fillRect(0,GY+66,W,6);
c.strokeStyle=‘rgba(100,200,120,0.18)’; c.lineWidth=2;
for(var si=0;si<18;si++){ c.beginPath(); c.moveTo(si*52,GY+66); c.lineTo(si*52+28,GY+66); c.stroke(); }

var gnd=c.createLinearGradient(0,GY+62,0,H);
gnd.addColorStop(0,’#1a3d0a’); gnd.addColorStop(0.3,’#142e08’); gnd.addColorStop(1,’#0a1a04’);
c.fillStyle=gnd; c.fillRect(0,GY+62,W,H-GY-62);
c.strokeStyle=‘rgba(80,180,60,0.3)’; c.lineWidth=3;
c.beginPath(); c.moveTo(0,GY+64); c.lineTo(W,GY+64); c.stroke();

for(var ti=0;ti<10;ti++){
var tx=[20,110,200,290,390,490,590,680,770,840][ti];
var th=120+(ti%3)*40;
c.fillStyle=ti%2===0?’#091a0c’:’#0b2010’;
c.fillRect(tx-4,GY+50-th,8,th);
for(var tj=0;tj<3;tj++){
c.fillStyle=‘rgba(’+(10+tj*4)+’,’+(35+tj*8)+’,’+(12+tj*4)+’,0.9)’;
c.beginPath(); c.ellipse(tx,GY+50-th+tj*18,28+tj*6,22+tj*4,0,0,Math.PI*2); c.fill();
}
}

var fpos=[0,160,340,520,700,860];
for(var fi=0;fi<fpos.length;fi++){
var bx=fpos[fi];
for(var fj=-3;fj<=3;fj++){
var ang=(fj/3)*0.7, fl=55+Math.abs(fj)*8;
c.strokeStyle=‘rgba(20,80,25,0.82)’; c.lineWidth=3-Math.abs(fj)*0.3; c.lineCap=‘round’;
c.beginPath(); c.moveTo(bx,GY+64);
c.quadraticCurveTo(
bx+Math.sin(ang)*fl*0.5+Math.sin(ang+1)*10,
GY+64-Math.cos(ang)*fl*0.5-Math.cos(ang+1)*10,
bx+Math.sin(ang)*fl, GY+64-Math.cos(ang)*fl
);
c.stroke();
for(var fk=1;fk<=4;fk++){
var ft=fk/5;
c.fillStyle=‘rgba(18,’+(70+fk*8)+’,20,0.7)’;
c.beginPath();
c.ellipse(
bx+Math.sin(ang)*fl*ft+Math.cos(ang+1.2)*(8-fk),
GY+64-Math.cos(ang)*fl*ft+Math.sin(ang+1.2)*(4-fk),
6+fk,2.5,ang+1.2,0,Math.PI*2
);
c.fill();
}
}
}
}

// ============================================================
//  DINO RENDERING – versao melhorada com detalhes
// ============================================================
function drawDino(c,id,x,y,facing,action,frame,isHit){
var ch=CH_DATA[id];
if(!ch) return;
c.save();
if(facing===-1){ c.scale(-1,1); x=-x; }
c.translate(x,y);
if(action===‘ko’) c.rotate(0.42);
var bob=action===‘idle’?Math.sin(frame*0.09)*2.5:0;
c.translate(0,bob);
var atk=action===‘attack’, ko=action===‘ko’;
var walk=action===‘walk’||action===‘jump’;
var leg=walk||atk?Math.sin(frame*0.24)*14:0;
var tail=walk?Math.sin(frame*0.19)*5:0;

_drawGenericDino(c, ch, atk, ko, leg, tail, action, frame);

if(isHit){
c.globalAlpha=0.45; c.fillStyle=‘rgba(255,60,60,0.5)’;
c.fillRect(-44,-95,88,95); c.globalAlpha=1;
}
c.restore();
}

// Dino generico melhorado – cada personagem tem corpo unico baseado em sua cor e letra
function _drawGenericDino(c, ch, atk, ko, leg, tail, action, frame){
var bc  = ch.bodyColor  || ch.color;
var mc  = ch.markColor  || ch.accent;
var ltr = ch.letter     || ‘?’;
var id  = ch.id;

// sombra suave sob o corpo
c.fillStyle=‘rgba(0,0,0,0.25)’;
c.beginPath(); c.ellipse(0,2,26,6,0,0,Math.PI*2); c.fill();

// –– RABO ––
c.save();
c.strokeStyle=bc; c.lineWidth=12; c.lineCap=‘round’;
c.translate(-22,0); c.rotate(tail*0.05);
c.beginPath(); c.moveTo(22,-2); c.quadraticCurveTo(-8,6,-20,16); c.stroke();
// detalhe rabo
c.lineWidth=5; c.strokeStyle=mc; c.globalAlpha=0.35;
c.beginPath(); c.moveTo(22,-2); c.quadraticCurveTo(-8,6,-20,16); c.stroke();
c.globalAlpha=1;
c.restore();

// –– PERNAS ––
for(var ls=-1;ls<=1;ls+=2){
c.save();
var lx=ls<0?-11:11;
c.translate(lx,10);
c.rotate(ls*leg*0.024);

```
// coxa
c.fillStyle=bc;
c.beginPath(); c.ellipse(0,6,7,10,ls*0.2,0,Math.PI*2); c.fill();

// perna inferior + pe
c.strokeStyle=bc; c.lineWidth=7; c.lineCap='round';
c.beginPath(); c.moveTo(0,14); c.lineTo(ls*3,26); c.lineTo(ls*7,32); c.stroke();

// garras do pe
c.strokeStyle='rgba(0,0,0,0.5)'; c.lineWidth=2.5;
c.beginPath(); c.moveTo(ls*7,32); c.lineTo(ls*11,30); c.stroke();
c.beginPath(); c.moveTo(ls*7,32); c.lineTo(ls*7,36); c.stroke();
c.beginPath(); c.moveTo(ls*7,32); c.lineTo(ls*4,36); c.stroke();

c.restore();
```

}

// –– CORPO PRINCIPAL ––
// gradiente de corpo
var bg=c.createRadialGradient(-4,-12,2,-4,-12,30);
bg.addColorStop(0,_lighten(bc,30)); bg.addColorStop(1,bc);
c.fillStyle=bg;
c.beginPath(); c.ellipse(0,-14,24,22,0,0,Math.PI*2); c.fill();

// barriga clara
c.fillStyle=‘rgba(255,255,255,0.12)’;
c.beginPath(); c.ellipse(-2,-10,14,13,0.1,0,Math.PI*2); c.fill();

// marcas dorsais (espinhos)
c.fillStyle=mc;
for(var di=0;di<4;di++){
var dx=-8+di*6, dy=-34-di*2;
c.beginPath(); c.moveTo(dx-3,-30); c.lineTo(dx,dy); c.lineTo(dx+3,-30); c.closePath(); c.fill();
}

// emblema / letra no peito
c.fillStyle=mc;
c.globalAlpha=0.9;
c.font=‘bold 13px Arial Black,Arial’;
c.textAlign=‘center’; c.textBaseline=‘middle’;
c.fillText(ltr, 0, -14);
c.globalAlpha=1;

// detalhes de escama
c.fillStyle=‘rgba(0,0,0,0.18)’;
for(var si=0;si<6;si++){
var sx=-12+si*5, sy=-22+Math.sin(si)*3;
c.beginPath(); c.arc(sx,sy,2.5,0,Math.PI*2); c.fill();
}

// –– BRACO ––
var armY = atk ? -16 : -8;
var armX = atk ? 18 : 14;
c.save();
c.strokeStyle=bc; c.lineWidth=6; c.lineCap=‘round’;
c.beginPath(); c.moveTo(14,-18); c.lineTo(armX,armY); c.stroke();
// garra do braco
if(atk){
c.strokeStyle=mc; c.lineWidth=2.5;
c.beginPath(); c.moveTo(armX,armY); c.lineTo(armX+5,armY-4); c.stroke();
c.beginPath(); c.moveTo(armX,armY); c.lineTo(armX+6,armY); c.stroke();
c.beginPath(); c.moveTo(armX,armY); c.lineTo(armX+4,armY+4); c.stroke();
}
c.restore();

// –– PESCOCO ––
c.strokeStyle=bc; c.lineWidth=14; c.lineCap=‘round’;
c.beginPath(); c.moveTo(10,-22); c.quadraticCurveTo(16,-34,22,-42); c.stroke();
// detalhe pescoco
c.strokeStyle=_lighten(bc,20); c.lineWidth=5; c.globalAlpha=0.35;
c.beginPath(); c.moveTo(10,-22); c.quadraticCurveTo(16,-34,22,-42); c.stroke();
c.globalAlpha=1;

// –– CABECA ––
// cranio principal
var hg=c.createRadialGradient(20,-52,2,20,-52,16);
hg.addColorStop(0,_lighten(bc,25)); hg.addColorStop(1,bc);
c.fillStyle=hg;
c.beginPath(); c.ellipse(22,-52,14,11,0,0,Math.PI*2); c.fill();

// PERSONAGENS ESPECIAIS: acessorios na cabeca
if(id===‘daviAranha’){
// mascara aranha – olhos em formato de lente
c.fillStyle=’#dc2626’; c.beginPath(); c.ellipse(22,-52,14,11,0,0,Math.PI*2); c.fill();
c.fillStyle=’#fff’; c.globalAlpha=0.85;
c.beginPath(); c.ellipse(17,-52,5,4,0.3,0,Math.PI*2); c.fill();
c.beginPath(); c.ellipse(27,-52,5,4,-0.3,0,Math.PI*2); c.fill();
c.globalAlpha=1;
c.fillStyle=’#1e40af’;
c.beginPath(); c.ellipse(17,-52,3,2.5,0.3,0,Math.PI*2); c.fill();
c.beginPath(); c.ellipse(27,-52,3,2.5,-0.3,0,Math.PI*2); c.fill();
} else if(id===‘daviDeFerro’){
// capacete de ferro
c.fillStyle=’#b91c1c’;
c.beginPath(); c.ellipse(22,-52,14,11,0,0,Math.PI*2); c.fill();
// viseira dourada
c.fillStyle=’#fbbf24’; c.globalAlpha=0.9;
c.beginPath(); c.moveTo(11,-52); c.lineTo(33,-52); c.lineTo(33,-47); c.lineTo(11,-47); c.closePath(); c.fill();
c.globalAlpha=1;
// olhos no viseira
c.fillStyle=‘rgba(0,0,0,0.7)’; c.fillRect(13,-51,7,3); c.fillRect(23,-51,7,3);
} else if(id===‘daviSombra’){
// mascara sombra – escura com brilho roxo
c.fillStyle=’#111’;
c.beginPath(); c.ellipse(22,-52,14,11,0,0,Math.PI*2); c.fill();
c.strokeStyle=’#a855f7’; c.lineWidth=1.5;
c.beginPath(); c.ellipse(22,-52,14,11,0,0,Math.PI*2); c.stroke();
// olhos brilhantes
c.fillStyle=’#a855f7’; c.globalAlpha=0.9;
c.beginPath(); c.ellipse(17,-52,4,3,0,0,Math.PI*2); c.fill();
c.beginPath(); c.ellipse(27,-52,4,3,0,0,Math.PI*2); c.fill();
c.globalAlpha=1;
} else if(id===‘superPapai’){
// coroa de rei
c.fillStyle=’#ef4444’;
c.beginPath();
c.moveTo(10,-60); c.lineTo(22,-68); c.lineTo(34,-60);
c.lineTo(31,-60); c.lineTo(22,-65); c.lineTo(13,-60);
c.closePath(); c.fill();
c.fillStyle=’#fbbf24’;
c.beginPath(); c.arc(22,-68,3,0,Math.PI*2); c.fill();
drawEye(c,17,-52,5,’#ef4444’);
drawEye(c,27,-52,5,’#ef4444’);
} else {
// olho padrao melhorado
drawEye(c,17,-52,5, ch.accent||’#d97706’);
drawEye(c,27,-52,5, ch.accent||’#d97706’);
}

// –– BOCA / MANDIBULA ––
var jo=atk?8:3;
c.fillStyle=_darken(bc,15);
c.beginPath();
c.moveTo(11,-44+jo); c.lineTo(34,-42+jo); c.lineTo(35,-38+jo); c.lineTo(11,-40+jo);
c.closePath(); c.fill();
// dentes
if(atk){
c.fillStyle=’#f0f0e0’;
for(var ti=0;ti<4;ti++){
c.beginPath(); c.moveTo(14+ti*5,-42); c.lineTo(13+ti*5,-46+jo); c.lineTo(17+ti*5,-46+jo); c.closePath(); c.fill();
}
}
// narinas
c.fillStyle=‘rgba(0,0,0,0.4)’;
c.beginPath(); c.arc(32,-47,1.5,0,Math.PI*2); c.fill();

// –– KO ––
if(ko){
c.fillStyle=‘white’; c.strokeStyle=’#fbbf24’; c.lineWidth=2;
c.beginPath(); c.rect(-18,-68,36,18); c.fill(); c.stroke();
c.fillStyle=’#1a1a1a’; c.font=‘11px Arial’; c.textAlign=‘center’;
c.fillText(‘x_x’,0,-54);
for(var ki=0;ki<4;ki++){
var ka=(frame*5+ki*90)*Math.PI/180;
c.fillStyle=[’#fbbf24’,’#e5e7eb’,’#f9fafb’,’#fde68a’][ki];
c.font=‘13px Arial’;
c.fillText([’*’,’+’,’*’,’.’][ki], Math.cos(ka)*22, -80+Math.sin(ka)*8);
}
}
}

// helpers de cor
function _lighten(hex,pct){
return _shiftHex(hex,pct);
}
function _darken(hex,pct){
return _shiftHex(hex,-pct);
}
function _shiftHex(hex,pct){
var r=parseInt(hex.slice(1,3),16);
var g=parseInt(hex.slice(3,5),16);
var b=parseInt(hex.slice(5,7),16);
r=Math.min(255,Math.max(0,r+pct));
g=Math.min(255,Math.max(0,g+pct));
b=Math.min(255,Math.max(0,b+pct));
return ‘#’+[r,g,b].map(function(v){return (‘0’+v.toString(16)).slice(-2);}).join(’’);
}

// ============================================================
//  PROJETEIS
// ============================================================
function drawProj(c,projs){
for(var i=0;i<projs.length;i++){
var pr=projs[i]; c.save();
if(pr.type===‘shockwave’){
c.strokeStyle=‘rgba(74,222,128,0.8)’; c.lineWidth=4;
c.beginPath(); c.ellipse(pr.x,GY-10,pr.r,pr.r*0.3,0,0,Math.PI*2);
c.globalAlpha=1-pr.prog; c.stroke(); c.globalAlpha=1;
} else if(pr.type===‘web’){
// teia aranha
c.strokeStyle=‘rgba(147,197,253,0.8)’; c.lineWidth=2;
c.beginPath(); c.arc(pr.x,pr.y,10,0,Math.PI*2);
c.stroke();
for(var wi=0;wi<6;wi++){
var wa=wi*Math.PI/3;
c.beginPath(); c.moveTo(pr.x,pr.y); c.lineTo(pr.x+Math.cos(wa)*14,pr.y+Math.sin(wa)*14); c.stroke();
}
} else if(pr.type===‘laser’){
var lx=pr.x-(pr.vx>0?0:50);
var lg=c.createLinearGradient(lx,pr.y,lx+50,pr.y);
lg.addColorStop(0,’#fef08a’); lg.addColorStop(0.5,’#f97316’); lg.addColorStop(1,‘rgba(249,115,22,0)’);
c.fillStyle=lg; c.fillRect(lx,pr.y-5,50,10);
// brilho
c.fillStyle=‘rgba(254,240,138,0.3)’; c.fillRect(lx,pr.y-10,50,20);
} else if(pr.type===‘crystal’){
c.fillStyle=‘rgba(6,182,212,0.9)’;
c.save(); c.translate(pr.x,pr.y); c.rotate(pr.spin||0);
c.beginPath(); c.moveTo(0,-12); c.lineTo(8,0); c.lineTo(0,12); c.lineTo(-8,0); c.closePath(); c.fill();
c.restore();
} else if(pr.type===‘sonic’){
c.strokeStyle=‘rgba(139,92,246,’+(0.8-pr.r*0.012)+’)’; c.lineWidth=3;
c.beginPath(); c.arc(pr.x,pr.y,pr.r,0,Math.PI*2);
c.globalAlpha=Math.max(0,0.8-pr.r*0.015); c.stroke(); c.globalAlpha=1;
} else if(pr.type===‘star’){
c.fillStyle=‘rgba(251,191,36,0.9)’;
c.save(); c.translate(pr.x,pr.y); c.rotate(pr.spin||0);
starPath(c,0,0,12); c.fill();
c.restore();
} else if(pr.type===‘dark’){
var dg=c.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,14);
dg.addColorStop(0,‘rgba(168,85,247,0.9)’); dg.addColorStop(1,‘rgba(168,85,247,0)’);
c.fillStyle=dg; c.beginPath(); c.arc(pr.x,pr.y,14,0,Math.PI*2); c.fill();
}
c.restore();
}
}

// ============================================================
//  POPUPS HQ
// ============================================================
function drawPops(c,pops){
for(var i=0;i<pops.length;i++){
var p=pops[i], h=p.hq, alpha=Math.min(1,p.life/14);
c.save(); c.globalAlpha=alpha; c.translate(p.x,p.y); c.rotate(p.rot);
var fs=p.big?26:20;
c.font=’900 ’+fs+‘px Arial Black,Arial’;
var tw=c.measureText(h.w).width, pd=8;
c.fillStyle=h.b; c.beginPath(); c.rect(-tw/2-pd,-fs,tw+pd*2,fs+pd); c.fill();
c.strokeStyle=h.c; c.lineWidth=2; c.stroke();
c.fillStyle=h.c; c.textAlign=‘center’; c.textBaseline=‘alphabetic’;
c.fillText(h.w,0,0);
c.restore();
}
}

// ============================================================
//  MINI DINO (usado nas cards e preview)
// ============================================================
function miniDino(cvs2d, id){
var c=cvs2d;
c.clearRect(0,0,90,80);
c.save(); c.translate(32,66);
drawDino(c,id,0,0,1,‘idle’,30,false);
c.restore();
}

// ============================================================
//  SCREEN SWITCHER
// ============================================================
function show(id){
[‘titleScreen’,‘selectScreen’,‘fightScreen’,‘resultScreen’].forEach(function(s){
document.getElementById(s).classList.toggle(‘hidden’, s!==id);
});
}

// ============================================================
//  TITULO
// ============================================================
function goTitle(){
if(raf){ cancelAnimationFrame(raf); raf=null; }
if(resultRaf){ cancelAnimationFrame(resultRaf); resultRaf=null; }
show(‘titleScreen’);

// preview de 4 dinos
var pc=document.getElementById(‘titlePreview’), c=pc.getContext(‘2d’);
c.clearRect(0,0,440,110);
var ids=[‘daviAranha’,‘daviDeFerro’,‘papaiTita’,‘superPapai’];
var xs=[40,130,230,330];
for(var i=0;i<4;i++){
c.save(); c.translate(xs[i],88);
drawDino(c,ids[i],0,0,1,‘idle’,i*8,false);
c.restore();
}
}

// ============================================================
//  SELECT – grade 3x3
// ============================================================
var selMode=‘1p’, selP1=‘daviAranha’, selP2=‘daviSombra’;

function goSelect(mode){
selMode=mode;
selP1=‘daviAranha’;
selP2=mode===‘1p’?‘daviSombra’:‘papaiTita’;
show(‘selectScreen’);
document.getElementById(‘selSub’) && (document.getElementById(‘selSub’).textContent = mode===‘2p’?‘P1 ESQUERDA | P2 DIREITA’:‘HEROI vs VILAO CPU’);
buildGrid();
updateVS();
}

function buildGrid(){
var grid=document.getElementById(‘selGrid’);
grid.innerHTML=’’;

ALL_IDS.forEach(function(id){
var ch=CH_DATA[id];
var isSelP1 = selP1===id;
var isSelP2 = selP2===id;
var selClass = (isSelP1&&isSelP2)?‘sel-both’:(isSelP1?‘sel-p1’:(isSelP2?‘sel-p2’:’’));

```
var card=document.createElement('div');
card.className='dino-card'+(selClass?' '+selClass:'');

// badge heroi/vilao
var badge=document.createElement('div');
badge.className='dino-badge '+(ch.role==='villain'?'badge-villain':'badge-hero');
badge.textContent=ch.role==='villain'?'VILAO':'HEROI';
card.appendChild(badge);

// circulo com canvas do dino
var circle=document.createElement('div');
circle.className='dino-circle';
// cor de fundo do circulo baseada no personagem
circle.style.background='radial-gradient(circle at 35% 35%, '+ch.bodyColor+'44, '+ch.bodyColor+'22), radial-gradient(circle, #0a1a0a, #020a02)';
circle.style.borderColor=selClass?ch.color:'rgba(255,255,255,0.12)';

var cv=document.createElement('canvas'); cv.width=90; cv.height=80;
circle.appendChild(cv);
card.appendChild(circle);

// nome
var nm=document.createElement('div');
nm.className='dino-card-name';
nm.textContent=ch.name;
nm.style.color=ch.lc;
card.appendChild(nm);

// label P1/P2
if(isSelP1||isSelP2){
  var lbl=document.createElement('div');
  lbl.className='dino-player-lbl';
  if(isSelP1&&isSelP2){ lbl.textContent='P1&P2'; lbl.style.background='#a855f7'; }
  else if(isSelP1){ lbl.textContent='P1'; lbl.style.background=CH_DATA[selP1].color; }
  else { lbl.textContent=selMode==='2p'?'P2':'CPU'; lbl.style.background=CH_DATA[selP2].color; }
  card.appendChild(lbl);
}

// desenhar dino no canvas do card
miniDino(cv.getContext('2d'), id);

// eventos
card.addEventListener('touchstart',function(e){ e.preventDefault(); pickChar(id); },{passive:false});
card.addEventListener('click',function(){ pickChar(id); });

grid.appendChild(card);
```

});
}

// logica de selecao: 1a vez = P1, 2a vez = P2, ou alterna
var _pickCount=0;
function pickChar(id){
if(selMode===‘1p’){
// no modo 1p: clique sempre escolhe P1; CPU fica fixo em vilao
selP1=id;
// se escolheu um vilao como heroi, CPU vira outro vilao ou padrao
var isVillain=(CH_DATA[id].role===‘villain’);
if(isVillain){
selP1=‘daviAranha’; // nao deixa vilao como P1 no modo 1p
selP1=id; // na verdade deixa – e divertido
selP2=‘daviSombra’;
}
} else {
// modo 2p: primeiro clique P1, segundo P2
if(selP1===id){ selP2=id; }
else if(selP2===id){ selP1=id; }
else {
// se nenhum estava selecionado ainda, vai para P1
if(!_pickCount||_pickCount%2===0) selP1=id;
else selP2=id;
_pickCount++;
}
}
buildGrid();
updateVS();
}

function updateVS(){
var c1=document.getElementById(‘vsC1’);
var c2=document.getElementById(‘vsC2’);
if(c1) miniDino(c1.getContext(‘2d’), selP1);
if(c2) miniDino(c2.getContext(‘2d’), selP2);
var n1=document.getElementById(‘vsN1’);
var n2=document.getElementById(‘vsN2’);
if(n1){ n1.textContent=’P1 – ‘+CH_DATA[selP1].name; n1.style.color=CH_DATA[selP1].lc; }
if(n2){ n2.textContent=(selMode===‘2p’?‘P2’:‘CPU’)+’ – ’+CH_DATA[selP2].name; n2.style.color=CH_DATA[selP2].lc; }
}

// ============================================================
//  BATALHA – INIT
// ============================================================
function goFight(){
p1Id=selP1; p2Id=selP2; gameMode=selMode;
show(‘fightScreen’);

var fs=document.getElementById(‘fightScreen’);
var cv=document.getElementById(‘gameCanvas’);
var hud=document.getElementById(‘hud’);
var spb=document.getElementById(‘spbars’);
var ctrl=document.getElementById(‘controls’);
cv.width=fs.clientWidth;
var usedH=hud.offsetHeight+spb.offsetHeight+ctrl.offsetHeight;
cv.height=Math.max(fs.clientHeight-usedH,100);

buildHUD(); buildCtrl();

gs={
p1:{cId:p1Id,x:130,y:GY,vy:0,vx:0,hp:HP_MAX,facing:1, action:‘idle’,atking:false,atkT:0,stun:false,stunT:0,spCD:SP_CD,dash:false,dashT:0,onGnd:true},
p2:{cId:p2Id,x:CW-160,y:GY,vy:0,vx:0,hp:HP_MAX,facing:-1,action:‘idle’,atking:false,atkT:0,stun:false,stunT:0,spCD:SP_CD,dash:false,dashT:0,onGnd:true},
projs:[],frame:0,over:false,aiT:0
};
pops=[]; hitF={p1:0,p2:0};
p1In={left:false,right:false,up:false};
p2In={left:false,right:false,up:false};
p1Pr={atk:false,sp:false,up:false};
p2Pr={atk:false,sp:false,up:false};

if(raf) cancelAnimationFrame(raf);
raf=requestAnimationFrame(loop);
}

// – HUD –
function buildHUD(){
var ch1=CH_DATA[p1Id], ch2=CH_DATA[p2Id];
document.getElementById(‘hudL’).innerHTML=
‘<div class="hp-name" style="color:'+ch1.lc+'">’+ch1.name+’</div>’+
‘<div class="hp-bg"><div class="hp-fill" id="hf1" style="width:100%;background:#22c55e"></div></div>’+
‘<div class="hp-val" id="hv1">HP 100/100</div>’;
document.getElementById(‘hudR’).innerHTML=
‘<div class="hp-name right" style="color:'+ch2.lc+'">’+ch2.name+’</div>’+
‘<div class="hp-bg"><div class="hp-fill" id="hf2" style="width:100%;background:#22c55e;margin-left:auto"></div></div>’+
‘<div class="hp-val right" id="hv2">HP 100/100</div>’;
document.getElementById(‘sp1’).innerHTML=
‘<span class="sp-lbl" style="color:'+ch1.lc+'">’+ch1.sp+’</span>’+
‘<div class="sp-track"><div class="sp-fill" id="sf1" style="width:0%;background:'+ch1.color+'"></div></div>’;
document.getElementById(‘sp2’).innerHTML=
‘<span class="sp-lbl" style="color:'+ch2.lc+'">’+ch2.sp+’</span>’+
‘<div class="sp-track"><div class="sp-fill" id="sf2" style="width:0%;background:'+ch2.color+'"></div></div>’;
}

function refreshHUD(){
if(!gs) return;
var p1=gs.p1, p2=gs.p2;
var pct1=Math.max(0,p1.hp)/HP_MAX, pct2=Math.max(0,p2.hp)/HP_MAX;
var col=function(p){ return p>0.5?’#22c55e’:p>0.25?’#f59e0b’:’#ef4444’; };
var f1=document.getElementById(‘hf1’); if(f1){f1.style.width=(pct1*100)+’%’;f1.style.background=col(pct1);}
var f2=document.getElementById(‘hf2’); if(f2){f2.style.width=(pct2*100)+’%’;f2.style.background=col(pct2);}
var v1=document.getElementById(‘hv1’); if(v1)v1.textContent=‘HP ‘+Math.max(0,Math.round(p1.hp))+’/’+HP_MAX;
var v2=document.getElementById(‘hv2’); if(v2)v2.textContent=‘HP ‘+Math.max(0,Math.round(p2.hp))+’/’+HP_MAX;
var s1=document.getElementById(‘sf1’); if(s1)s1.style.width=Math.max(0,100-(p1.spCD/SP_CD)*100)+’%’;
var s2=document.getElementById(‘sf2’); if(s2)s2.style.width=Math.max(0,100-(p2.spCD/SP_CD)*100)+’%’;
}

// – CONTROLES TOUCH –
function buildCtrl(){
document.getElementById(‘ctrlL’).innerHTML=’’;
document.getElementById(‘ctrlR’).innerHTML=’’;
document.getElementById(‘ctrlMid’).innerHTML=gameMode===‘2p’
?’<span style="color:#22c55e;font-size:7px">P1</span><br>vs<br><span style="color:#60a5fa;font-size:7px">P2</span>’
:’<span style="color:#ef4444;font-size:8px">AI</span>’;

addCtrl(‘ctrlL’,CH_DATA[p1Id],
function(){p1Pr.atk=true;}, function(){p1Pr.sp=true;}, function(){p1Pr.up=true;},
function(v){p1In.left=v.left;p1In.right=v.right;if(v.up&&!p1In.up)p1Pr.up=true;p1In.up=v.up;}
);
if(gameMode===‘2p’){
addCtrl(‘ctrlR’,CH_DATA[p2Id],
function(){p2Pr.atk=true;}, function(){p2Pr.sp=true;}, function(){p2Pr.up=true;},
function(v){p2In.left=v.left;p2In.right=v.right;if(v.up&&!p2In.up)p2Pr.up=true;p2In.up=v.up;}
);
}
}

function addCtrl(cId,ch,onAtk,onSp,onJump,onJoy){
var cont=document.getElementById(cId);
var jd=document.createElement(‘div’); jd.className=‘joystick’;
var th=document.createElement(‘div’); th.className=‘joystick-thumb’;
jd.appendChild(th); cont.appendChild(jd);
var jOn=false,jId2=null,jBX=0,jBY=0,MX=36;

jd.addEventListener(‘touchstart’,function(e){
e.preventDefault(); var t=e.changedTouches[0];
var r=jd.getBoundingClientRect(); jOn=true; jId2=t.identifier; jBX=r.left+r.width/2; jBY=r.top+r.height/2;
},{passive:false});
jd.addEventListener(‘touchmove’,function(e){
e.preventDefault(); if(!jOn) return;
var t=null; for(var i=0;i<e.changedTouches.length;i++) if(e.changedTouches[i].identifier===jId2){t=e.changedTouches[i];break;}
if(!t) return;
var dx=t.clientX-jBX, dy=t.clientY-jBY, dist=Math.sqrt(dx*dx+dy*dy);
var cx=dist>MX?dx/dist*MX:dx, cy=dist>MX?dy/dist*MX:dy;
th.style.left=’calc(50% + ’+cx+‘px - 18px)’; th.style.top=’calc(50% + ’+cy+‘px - 18px)’; th.style.transition=‘none’;
onJoy({left:cx/MX<-0.28,right:cx/MX>0.28,up:cy/MX<-0.45});
},{passive:false});
var jEnd=function(e){
e.preventDefault(); jOn=false;
th.style.left=‘calc(50% - 18px)’; th.style.top=‘calc(50% - 18px)’; th.style.transition=‘0.08s’;
onJoy({left:false,right:false,up:false});
};
jd.addEventListener(‘touchend’,jEnd,{passive:false});
jd.addEventListener(‘touchcancel’,jEnd,{passive:false});

var bd=document.createElement(‘div’); bd.className=‘act-btns’;
function mkBtn(cls,bg,bc,html,fn){
var b=document.createElement(‘button’); b.className=‘act-btn ‘+cls;
b.style.background=bg; b.style.border=‘2px solid ‘+bc; b.style.boxShadow=‘0 0 10px ‘+bc+‘55’;
b.innerHTML=html;
b.addEventListener(‘touchstart’,function(e){e.preventDefault();fn();},{passive:false});
b.addEventListener(‘mousedown’,function(e){e.preventDefault();fn();});
return b;
}
bd.appendChild(mkBtn(‘btn-jump’,‘radial-gradient(circle at 35% 35%,rgba(132,204,22,0.8),rgba(132,204,22,0.5))’,’#84cc16’,’<span style="font-size:13px">^</span><span class="btn-lbl">PULAR</span>’,onJump));
bd.appendChild(mkBtn(‘btn-atk’,‘radial-gradient(circle at 35% 35%,rgba(249,115,22,0.8),rgba(249,115,22,0.5))’,’#f97316’,’<span style="font-size:13px">ATK</span><span class="btn-lbl">ATACAR</span>’,onAtk));
bd.appendChild(mkBtn(‘btn-sp’,‘radial-gradient(circle at 35% 35%,’+ch.color+‘99,’+ch.color+‘55)’,ch.color,’<span style="font-size:11px">SP</span><span class="btn-lbl">’+ch.sp+’</span>’,onSp));
cont.appendChild(bd);
}

// ============================================================
//  LOGICA DE JOGO
// ============================================================
function addPop(x,y,big,custom){
var h=custom||HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x,y:y,hq:h,big:big,rot:(Math.random()-0.5)*26,life:60});
if(big){
var h2=HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x-46,y:y+18,hq:h2,big:false,rot:-15,life:44});
}
}

function applyHit(atk,def,dmg,big,hk){
if(def.stun||def.hp<=0) return;
def.hp=Math.max(0,def.hp-dmg);
def.stun=true; def.stunT=STUN_DUR; def.action=‘hit’; hitF[hk]=7;
addPop((atk.x+def.x)/2, def.y-55, big);
}

function trigAtk(atk,def,hk){
if(atk.atking||atk.stun||atk.hp<=0) return;
var ch=CH_DATA[atk.cId];
atk.atking=true; atk.atkT=ATK_DUR; atk.action=‘attack’;
if(Math.abs(atk.x-def.x)<ch.speed*16+32&&!def.stun&&def.hp>0)
applyHit(atk,def,HIT_DMG*ch.str,false,hk);
}

function trigSp(user,opp,hk){
if(user.spCD>0||user.stun||user.hp<=0) return;
var ch=CH_DATA[user.cId];
user.spCD=SP_CD; user.action=‘special’;
var id=user.cId;

if(id===‘daviAranha’||id===‘mamaCristal’){
// teia / cristal
var ptype=id===‘daviAranha’?‘web’:‘crystal’;
gs.projs.push({type:ptype,x:user.x+user.facing*26,y:user.y-36,vx:user.facing*PROJ_SPD*1.1,spin:0,owner:user,hk:hk,hit:false});
} else if(id===‘daviDeFerro’||id===‘mamaEstelar’){
// laser
gs.projs.push({type:‘laser’,x:user.x+user.facing*26,y:user.y-44,vx:user.facing*PROJ_SPD*1.8,owner:user,hk:hk,hit:false});
} else if(id===‘daviSombra’){
// projétil sombra
gs.projs.push({type:‘dark’,x:user.x+user.facing*26,y:user.y-38,vx:user.facing*PROJ_SPD,owner:user,hk:hk,hit:false});
} else if(id===‘papaiTita’){
// shockwave (tremor)
gs.projs.push({type:‘shockwave’,x:user.x,y:GY,r:8,maxR:130,prog:0,owner:user,hk:hk,hit:false});
} else if(id===‘superPapai’||id===‘mamaGuerreira’){
// estrela
gs.projs.push({type:‘star’,x:user.x+user.facing*26,y:user.y-38,vx:user.facing*PROJ_SPD*1.3,spin:0,owner:user,hk:hk,hit:false,ret:false});
} else if(id===‘papaiNoturno’){
// sonic
gs.projs.push({type:‘sonic’,x:user.x,y:user.y-40,r:5,maxR:120,owner:user,hk:hk,hit:false});
} else {
// dash generico
user.dash=true; user.dashT=460; user.vx=user.facing*15;
}

addPop(user.x,user.y-80,true,{w:ch.sp+’!’,c:’#fef08a’,b:ch.color});
}

function runAI(ai,pl){
if(ai.stun||ai.hp<=0) return;
gs.aiT-=16; if(gs.aiT>0) return;
gs.aiT=AI_TICK+Math.random()*260;
var ch=CH_DATA[ai.cId], dist=Math.abs(ai.x-pl.x), style=ch.ai||‘normal’;
ai.facing=pl.x>ai.x?1:-1;
if(style===‘aggressive’){
ai.vx=ai.facing*ch.speed*(Math.random()<0.9?1:0.5);
if(ai.onGnd&&Math.random()<0.12){ai.vy=JUMP_V;ai.onGnd=false;}
if(dist<110&&!ai.atking&&Math.random()<0.7) trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.35) trigSp(ai,pl,‘p1’);
} else if(style===‘ranged’){
var ideal=180;
if(dist<ideal-30) ai.vx=-ai.facing*ch.speed*0.6;
else if(dist>ideal+30) ai.vx=ai.facing*ch.speed;
else ai.vx=0;
if(dist<130&&!ai.atking&&Math.random()<0.3) trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.4) trigSp(ai,pl,‘p1’);
} else {
if(dist>100) ai.vx=ai.facing*ch.speed*(Math.random()<0.85?1:0);
else if(dist<50) ai.vx=-ai.facing*ch.speed*0.5;
else ai.vx=0;
if(ai.onGnd&&Math.random()<0.09){ai.vy=JUMP_V;ai.onGnd=false;}
if(dist<108&&!ai.atking&&Math.random()<0.55) trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.28) trigSp(ai,pl,‘p1’);
}
}

// ============================================================
//  LOOP PRINCIPAL
// ============================================================
function loop(){
if(!gs||gs.over) return;
raf=requestAnimationFrame(loop);
gs.frame++;
var DT=16, p1=gs.p1, p2=gs.p2;

function tick(p){
if(p.atkT>0){p.atkT-=DT;if(p.atkT<=0)p.atking=false;}
if(p.stunT>0){p.stunT-=DT;if(p.stunT<=0){p.stun=false;p.action=‘idle’;}}
if(p.spCD>0) p.spCD-=DT;
if(p.dashT>0){p.dashT-=DT;if(p.dashT<=0){p.dash=false;p.vx*=0.2;}}
}
tick(p1); tick(p2);
if(hitF.p1>0) hitF.p1–;
if(hitF.p2>0) hitF.p2–;

// P1 input
if(!p1.stun&&p1.hp>0){
if(!p1.dash){
var gl=p1In.left||keys[‘KeyA’], gr=p1In.right||keys[‘KeyD’];
if(gl){p1.vx=-CH_DATA[p1.cId].speed;p1.facing=-1;}
else if(gr){p1.vx=CH_DATA[p1.cId].speed;p1.facing=1;}
else p1.vx*=0.72;
}
if((p1Pr.up||keys[‘Space’])&&p1.onGnd){p1.vy=JUMP_V;p1.onGnd=false;}
if(p1Pr.atk||keys[‘KeyF’]) trigAtk(p1,p2,‘p2’);
if(p1Pr.sp||keys[‘KeyE’])  trigSp(p1,p2,‘p2’);
} else p1.vx*=0.5;
p1Pr.atk=false; p1Pr.sp=false; p1Pr.up=false;

// P2 / AI
if(gameMode===‘2p’){
if(!p2.stun&&p2.hp>0){
if(!p2.dash){
var gl2=p2In.left||keys[‘ArrowLeft’], gr2=p2In.right||keys[‘ArrowRight’];
if(gl2){p2.vx=-CH_DATA[p2.cId].speed;p2.facing=-1;}
else if(gr2){p2.vx=CH_DATA[p2.cId].speed;p2.facing=1;}
else p2.vx*=0.72;
}
if((p2Pr.up||keys[‘ArrowUp’])&&p2.onGnd){p2.vy=JUMP_V;p2.onGnd=false;}
if(p2Pr.atk||keys[‘KeyK’]) trigAtk(p2,p1,‘p1’);
if(p2Pr.sp||keys[‘KeyL’])  trigSp(p2,p1,‘p1’);
} else p2.vx*=0.5;
p2Pr.atk=false; p2Pr.sp=false; p2Pr.up=false;
} else {
runAI(p2,p1);
}

// fisica
function physics(p){
if(p.hp<=0){p.action=‘ko’;p.vx*=0.86;}
p.vy+=GRAV; p.x+=p.vx; p.y+=p.vy;
if(p.y>=GY){p.y=GY;p.vy=0;p.onGnd=true;} else p.onGnd=false;
p.x=Math.max(24,Math.min(CW-80,p.x));
if(p.hp>0&&!p.stun&&!p.atking){
if(!p.onGnd) p.action=‘jump’;
else if(Math.abs(p.vx)>0.5) p.action=‘walk’;
else p.action=‘idle’;
}
if(p.hp>0&&!p.atking&&!p.dash){
var opp=p===p1?p2:p1; p.facing=opp.x>p.x?1:-1;
}
}
physics(p1); physics(p2);

// projeteis
var kill=[];
gs.projs.forEach(function(pr){
if(pr.type===‘shockwave’){
pr.r+=4; pr.prog=pr.r/pr.maxR;
var tgt=pr.owner===p1?p2:p1;
if(!pr.hit&&Math.abs(pr.x-tgt.x)<pr.r&&tgt.hp>0&&!tgt.stun){
pr.hit=true; applyHit(pr.owner,tgt,SP_DMG*CH_DATA[pr.owner.cId].str,true,pr.hk);
}
if(pr.r>pr.maxR) kill.push(pr);
} else if(pr.type===‘sonic’){
pr.r+=5; var tgt=pr.owner===p1?p2:p1;
var dd=Math.sqrt((pr.x-tgt.x)*(pr.x-tgt.x)+(pr.y-tgt.y)*(pr.y-tgt.y));
if(!pr.hit&&dd<pr.r&&tgt.hp>0&&!tgt.stun){
pr.hit=true; applyHit(pr.owner,tgt,SP_DMG*CH_DATA[pr.owner.cId].str*0.85,true,pr.hk);
}
if(pr.r>pr.maxR) kill.push(pr);
} else {
pr.x+=pr.vx;
if(pr.type===‘star’||pr.type===‘crystal’) pr.spin=(pr.spin||0)+0.15;
var tgt=pr.owner===p1?p2:p1;
if(!pr.hit&&Math.abs(pr.x-tgt.x)<44&&Math.abs(pr.y-(tgt.y-36))<56){
pr.hit=true;
applyHit(pr.owner,tgt,SP_DMG*CH_DATA[pr.owner.cId].str,true,pr.hk);
if(pr.type===‘star’){pr.ret=true;pr.vx*=-0.85;} else kill.push(pr);
}
if(pr.ret&&Math.abs(pr.x-pr.owner.x)<32) kill.push(pr);
if(pr.x<-70||pr.x>CW+70) kill.push(pr);
}
});
kill.forEach(function(pr){ gs.projs.splice(gs.projs.indexOf(pr),1); });

// dash colisao
[[p1,p2,‘p2’],[p2,p1,‘p1’]].forEach(function(t){
if(t[0].dash&&Math.abs(t[0].x-t[1].x)<60&&!t[1].stun&&t[1].hp>0){
applyHit(t[0],t[1],SP_DMG*CH_DATA[t[0].cId].str,true,t[2]);
t[0].dash=false; t[0].dashT=0;
}
});

// envelhecer popups
pops=pops.map(function(p){
return {x:p.x,y:p.y-0.55,hq:p.hq,big:p.big,rot:p.rot,life:p.life-1};
}).filter(function(p){ return p.life>0; });

// –– DESENHO ––
var cv=document.getElementById(‘gameCanvas’);
var c=cv.getContext(‘2d’);
if(!c) return;
var W=cv.width, H=cv.height;
var scX=W/CW, scY=H/CH, sc=Math.min(scX,scY);
var ox=(W-CW*sc)/2, oy=(H-CH*sc)/2;

c.clearRect(0,0,W,H);
c.save(); c.translate(ox,oy); c.scale(sc,sc);

drawBG(c,CW,CH);

// sombras no chao
c.save(); c.globalAlpha=0.28; c.fillStyle=’#000’;
c.beginPath(); c.ellipse(p1.x,GY+64,30,5,0,0,Math.PI*2); c.fill();
c.beginPath(); c.ellipse(p2.x,GY+64,30,5,0,0,Math.PI*2); c.fill();
c.restore();

drawProj(c,gs.projs);

c.save(); c.translate(p1.x,p1.y);
drawDino(c,p1.cId,0,0,p1.facing,p1.action,gs.frame,hitF.p1>0);
c.restore();

c.save(); c.translate(p2.x,p2.y);
drawDino(c,p2.cId,0,0,p2.facing,p2.action,gs.frame,hitF.p2>0);
c.restore();

drawPops(c,pops);
c.restore();

refreshHUD();

// vitoria
if(p1.hp<=0||p2.hp<=0){
gs.over=true;
var wk=p1.hp<=0?‘p2’:‘p1’;
setTimeout(function(){ goResult(wk, wk===‘p1’?p1.cId:p2.cId); }, 700);
}
}

// ============================================================
//  RESULTADO
// ============================================================
var resInterv=null;

function goResult(wk,cId){
if(raf){ cancelAnimationFrame(raf); raf=null; }
var ch=CH_DATA[cId];
var lbl=wk===‘p1’?‘JOGADOR 1’:(gameMode===‘2p’?‘JOGADOR 2’:‘CPU’);
show(‘resultScreen’);

var card=document.getElementById(‘rCard’);
card.style.borderColor=ch.color;
card.style.boxShadow=’0 0 40px ’+ch.color+’88, 0 0 80px ’+ch.color+‘33’;

var mast=document.getElementById(‘rMast’);
mast.style.background=‘linear-gradient(135deg,’+ch.color+’,’+ch.accent+’)’;

document.getElementById(‘rRole’).textContent=ch.role===‘villain’?’— VILAO VENCE —’:’— HEROI VENCE —’;
document.getElementById(‘rRole’).style.color=ch.lc;

var nm=document.getElementById(‘rName’);
nm.textContent=lbl;
nm.style.background=‘linear-gradient(135deg,’+ch.lc+’,#fff,’+ch.accent+’)’;
nm.style.webkitBackgroundClip=‘text’; nm.style.webkitTextFillColor=‘transparent’;
nm.style.filter=‘drop-shadow(0 0 10px ‘+ch.color+’)’;

var dy=document.getElementById(‘rDay’);
dy.style.background=‘linear-gradient(90deg,’+ch.color+’,’+ch.accent+’,’+ch.color+’)’;
dy.style.webkitBackgroundClip=‘text’; dy.style.webkitTextFillColor=‘transparent’;

document.getElementById(‘rDN’).textContent=ch.name; document.getElementById(‘rDN’).style.color=ch.lc;
document.getElementById(‘rDD’).textContent=ch.desc;
document.getElementById(‘rPlate’).style.background=ch.color+‘22’;
document.getElementById(‘rPlate’).style.border=’1px solid ’+ch.color+‘44’;

document.getElementById(‘btnAgain’).style.background=‘linear-gradient(135deg,’+ch.color+’,’+ch.accent+’)’;
document.getElementById(‘btnAgain’).style.boxShadow=’0 4px 0 rgba(0,0,0,0.4), 0 0 20px ’+ch.color;

// dino animado
var rc=document.getElementById(‘rDinoCanvas’), rctx=rc.getContext(‘2d’), rf=0;
if(resInterv) clearInterval(resInterv);
resInterv=setInterval(function(){
rf++;
rctx.clearRect(0,0,140,120);
rctx.save(); rctx.translate(46,98);
drawDino(rctx,cId,0,0,1,‘idle’,rf,false);
rctx.restore();
},50);

// raios giratórios
var bc=document.getElementById(‘beams’);
bc.width=window.innerWidth; bc.height=window.innerHeight;
bc.style.width=‘100%’; bc.style.height=‘100%’;
var bctx=bc.getContext(‘2d’), bAng=0;
function beamLoop(){
bctx.clearRect(0,0,bc.width,bc.height);
bctx.save(); bctx.translate(bc.width/2,bc.height/2); bctx.rotate(bAng*Math.PI/180);
for(var i=0;i<16;i++){
var a=i*(Math.PI*2/16);
var g=bctx.createLinearGradient(0,0,Math.cos(a)*800,Math.sin(a)*800);
g.addColorStop(0,ch.color+‘22’); g.addColorStop(0.5,ch.color+‘08’); g.addColorStop(1,‘transparent’);
bctx.fillStyle=g; bctx.beginPath(); bctx.moveTo(0,0); bctx.arc(0,0,900,a-0.15,a+0.15); bctx.closePath(); bctx.fill();
}
bctx.restore(); bAng+=0.28;
if(!document.getElementById(‘resultScreen’).classList.contains(‘hidden’))
resultRaf=requestAnimationFrame(beamLoop);
}
requestAnimationFrame(beamLoop);
}

// ============================================================
//  TECLADO
// ============================================================
window.addEventListener(‘keydown’,function(e){ keys[e.code]=true; });
window.addEventListener(‘keyup’,  function(e){ keys[e.code]=false; });

// ============================================================
//  BOTOES
// ============================================================
document.getElementById(‘btn1p’).addEventListener(‘click’,     function(){ goSelect(‘1p’); });
document.getElementById(‘btn2p’).addEventListener(‘click’,     function(){ goSelect(‘2p’); });
document.getElementById(‘btnBack’).addEventListener(‘click’,   function(){ goTitle(); });
document.getElementById(‘btnFight’).addEventListener(‘click’,  function(){ goFight(); });
document.getElementById(‘btnAgain’).addEventListener(‘click’,  function(){ if(resInterv)clearInterval(resInterv); goFight(); });
document.getElementById(‘btnNewChar’).addEventListener(‘click’,function(){ if(resInterv)clearInterval(resInterv); goSelect(gameMode); });
document.getElementById(‘btnHome’).addEventListener(‘click’,   function(){ if(resInterv)clearInterval(resInterv); goTitle(); });

// redimensionamento
window.addEventListener(‘resize’,function(){
if(gs&&!gs.over){
var cv=document.getElementById(‘gameCanvas’);
var fs=document.getElementById(‘fightScreen’);
cv.width=fs.clientWidth;
var used=document.getElementById(‘hud’).offsetHeight+document.getElementById(‘spbars’).offsetHeight+document.getElementById(‘controls’).offsetHeight;
cv.height=Math.max(fs.clientHeight-used,100);
}
});

// ============================================================
//  BOOT
// ============================================================
createStars(‘starsBg’);
createStars(‘starsBg2’);
goTitle();