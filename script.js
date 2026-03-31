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
trex:  {id:‘trex’,  name:‘T-Rex Davi’,       role:‘hero’,    color:’#22c55e’,accent:’#7c3aed’,lc:’#4ade80’, speed:2.6,str:2.0, sp:‘Tremor’,   desc:‘Velocidade EXTREMA e DEVASTADOR’   },
raptor:{id:‘raptor’,name:‘Velociraptor Tobby’,      role:‘hero’,    color:’#ef4444’,accent:’#fbbf24’,lc:’#fca5a5’, speed:7.0,str:0.75,sp:‘Investida’,desc:‘Velocidade EXTREMA’   },
trice: {id:‘trice’, name:‘Triceratops Vovó’,   role:‘hero’,    color:’#3b82f6’,accent:’#ef4444’,lc:’#93c5fd’, speed:4.0,str:1.2, sp:‘Escudo’,   desc:‘EQUILIBRADO’          },
ptero: {id:‘ptero’, name:‘Pterodactilo Valentina’,  role:‘hero’,    color:’#f59e0b’,accent:’#dc2626’,lc:’#fde68a’, speed:4.4,str:1.3, sp:‘Laser’,    desc:‘Tecnologia JURASSICA’ },
spino: {id:‘spino’, name:‘Spinossauro TitiaGio’,    role:‘villain’, color:’#7f1d1d’,accent:’#6b21a8’,lc:’#fca5a5’, speed:3.2,str:1.8, sp:‘Acido’,    desc:‘Predador das Aguas’,  ai:‘aggressive’},
anky:  {id:‘anky’,  name:‘Anquilossauro Vovô’, role:‘villain’, color:’#78350f’,accent:’#065f46’,lc:’#d97706’, speed:2.0,str:1.6, sp:‘Clava’,    desc:‘Armadura Inquebravel’,ai:‘defensive’ },
para:  {id:‘para’,  name:‘Parasaurolofus Papai’,  role:‘villain’, color:’#1e3a8a’,accent:’#7c3aed’,lc:’#93c5fd’, speed:5.0,str:1.0, sp:‘Sonico’,   desc:‘Grito que Paralisa e TREMOR’,  ai:‘ranged’    },
carno: {id:‘carno’, name:‘Carnotaurus Mamãe’,   role:‘villain’, color:’#7c2d12’,accent:’#ca8a04’,lc:’#fb923c’, speed:5.5,str:1.5, sp:‘Brutus’,   desc:‘Chifres Letais’,      ai:‘rushdown’  }
};
var HEROES   = [‘trex’,‘raptor’,‘trice’,‘ptero’];
var VILLAINS = [‘spino’,‘anky’,‘para’,‘carno’];
var ALL_IDS  = HEROES.concat(VILLAINS);

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
var gameMode=‘1p’, p1Id=‘trex’, p2Id=‘spino’;
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
iris=iris||’#d97706’;
c.fillStyle=’#111’; c.beginPath(); c.arc(ex,ey,r,0,Math.PI*2); c.fill();
c.fillStyle=iris;   c.beginPath(); c.arc(ex,ey,r*0.72,0,Math.PI*2); c.fill();
c.fillStyle=’#111’; c.beginPath(); c.arc(ex,ey,r*0.4,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(255,255,255,0.75)’; c.beginPath(); c.arc(ex-r*0.25,ey-r*0.25,r*0.22,0,Math.PI*2); c.fill();
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
bx+Math.sin(ang)*fl,
GY+64-Math.cos(ang)*fl
);
c.stroke();
for(var fk=1;fk<=4;fk++){
var ft=fk/5;
var flx=bx+Math.sin(ang)*fl*ft;
var fly=GY+64-Math.cos(ang)*fl*ft;
c.fillStyle=‘rgba(18,’+(70+fk*8)+’,20,0.7)’;
c.beginPath();
c.ellipse(flx+Math.cos(ang+1.2)*(8-fk), fly+Math.sin(ang+1.2)*(4-fk), 6+fk, 2.5, ang+1.2, 0, Math.PI*2);
c.fill();
}
}
}

for(var sci=0;sci<3;sci++){
var sx=[155,420,670][sci], sy=GY+22;
c.save(); c.globalAlpha=0.75; c.translate(sx,sy);
c.fillStyle=’#f1f5f9’; c.fillRect(-9,-50,18,30);
c.fillStyle=’#fde68a’; c.beginPath(); c.arc(0,-58,10,0,Math.PI*2); c.fill();
c.fillStyle=’#92400e’; c.beginPath(); c.ellipse(0,-65,9,5,0,0,Math.PI*2); c.fill();
c.fillStyle=’#94a3b8’; c.fillRect(-7,-22,6,22); c.fillRect(1,-22,6,22);
c.fillStyle=’#e2e8f0’; c.fillRect(6,-50,11,14);
c.strokeStyle=’#94a3b8’; c.lineWidth=1.5;
c.beginPath(); c.moveTo(8,-47); c.lineTo(15,-47); c.stroke();
c.beginPath(); c.moveTo(8,-44); c.lineTo(15,-44); c.stroke();
c.fillStyle=’#1a1a1a’;
c.beginPath(); c.arc(-2,-59,1.8,0,Math.PI*2); c.fill();
c.beginPath(); c.arc(3,-59,1.8,0,Math.PI*2); c.fill();
c.restore();
}
}

// ============================================================
//  DINO RENDERING
// ============================================================
function drawDino(c,id,x,y,facing,action,frame,isHit){
c.save();
if(facing===-1){ c.scale(-1,1); x=-x; }
c.translate(x,y);
if(action===‘ko’) c.rotate(0.44);
var bob=action===‘idle’?Math.sin(frame*0.09)*2.5:0;
c.translate(0,bob);
var atk=action===‘attack’, ko=action===‘ko’, walk=action===‘walk’;
var leg=walk||atk?Math.sin(frame*0.24)*16:0;
var tail=walk?Math.sin(frame*0.19)*6:0;

if(id===‘trex’)        _trex(c,atk,ko,leg,tail);
else if(id===‘raptor’) _raptor(c,atk,ko,leg,tail);
else if(id===‘trice’)  _trice(c,atk,ko,leg,tail);
else if(id===‘ptero’)  _ptero(c,atk,ko,leg,tail,action);
else if(id===‘spino’)  _spino(c,atk,ko,leg,tail);
else if(id===‘anky’)   _anky(c,atk,ko,leg,tail);
else if(id===‘para’)   _para(c,atk,ko,leg,tail);
else if(id===‘carno’)  _carno(c,atk,ko,leg,tail);

if(isHit){
c.globalAlpha=0.5;
c.fillStyle=‘rgba(255,60,60,0.5)’;
c.fillRect(-42,-92,84,92);
c.globalAlpha=1;
}
c.restore();
}

function _trex(c,atk,ko,leg,tail){
c.strokeStyle=’#1a5c28’; c.lineWidth=14; c.lineCap=‘round’;
c.save(); c.translate(-30,0); c.rotate(tail*0.04);
c.beginPath(); c.moveTo(30,-5); c.quadraticCurveTo(-10,8,-28,20); c.stroke();
c.restore();
var bg=c.createRadialGradient(8,-15,2,8,-15,38);
bg.addColorStop(0,’#3a9e55’); bg.addColorStop(1,’#1a5c28’);
c.fillStyle=bg; c.beginPath(); c.ellipse(5,-18,28,26,0,0,Math.PI*2); c.fill();
var bel=c.createRadialGradient(2,-12,1,2,-12,18);
bel.addColorStop(0,’#c8f0d4’); bel.addColorStop(1,’#7ecf96’);
c.fillStyle=bel; c.globalAlpha=0.5; c.beginPath(); c.ellipse(2,-12,16,14,0.1,0,Math.PI*2); c.fill(); c.globalAlpha=1;
c.fillStyle=’#166534’;
for(var i=0;i<5;i++){ c.beginPath(); c.arc(-4+i*8,-40+i,4-i*0.4,0,Math.PI*2); c.fill(); }
var sh=c.createLinearGradient(0,-4,0,12); sh.addColorStop(0,’#7c3aed’); sh.addColorStop(1,’#581c87’);
c.fillStyle=sh; c.beginPath(); c.rect(-18,-4,46,16); c.fill();
c.strokeStyle=’#a855f7’; c.lineWidth=1.5; c.strokeRect(-18,-4,46,16);
c.fillStyle=’#c084fc’; c.fillRect(-5,-2,10,8);
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls<0?-12:14,10); c.rotate(ls*leg*0.022);
c.fillStyle=ls<0?’#1a5c28’:’#1f6b30’; c.fillRect(-6,0,14,22);
c.strokeStyle=’#0f3d1b’; c.lineWidth=3; c.lineCap=‘round’;
c.beginPath(); c.moveTo(-6,22); c.lineTo(-11,28); c.stroke();
c.beginPath(); c.moveTo(2,22);  c.lineTo(2,29);   c.stroke();
c.beginPath(); c.moveTo(8,22);  c.lineTo(14,27);  c.stroke();
c.restore();
}
c.strokeStyle=’#2d7a3a’; c.lineWidth=18; c.lineCap=‘round’;
c.beginPath(); c.moveTo(18,-20); c.quadraticCurveTo(30,-40,38,-52); c.stroke();
var jg=c.createLinearGradient(20,-60,60,-45);
jg.addColorStop(0,’#2d7a3a’); jg.addColorStop(1,’#1a5c28’);
c.fillStyle=jg;
c.beginPath(); c.moveTo(22,-58); c.lineTo(68,-50); c.lineTo(72,-44); c.lineTo(54,-40); c.lineTo(26,-46); c.closePath(); c.fill();
c.fillStyle=’#0f3d1b’; c.beginPath(); c.ellipse(64,-48,3,2,0.3,0,Math.PI*2); c.fill();
var jo=atk?8:3;
c.fillStyle=atk?’#4ade80’:’#3a9e55’;
c.beginPath(); c.moveTo(26,-46+jo); c.lineTo(66,-42+jo); c.lineTo(68,-36+jo); c.lineTo(26,-38+jo); c.closePath(); c.fill();
c.fillStyle=’#f0f0e0’;
for(var ti=0;ti<6;ti++){ c.beginPath(); c.moveTo(30+ti*6,-40); c.lineTo(28+ti*6,-44+jo); c.lineTo(32+ti*6,-44+jo); c.closePath(); c.fill(); }
drawEye(c,40,-56,7,’#d97706’);
c.strokeStyle=’#0f3d1b’; c.lineWidth=2.5; c.lineCap=‘round’;
c.beginPath(); c.moveTo(34,-63); c.lineTo(47,-61); c.stroke();
c.strokeStyle=’#1a5c28’; c.lineWidth=6; c.lineCap=‘round’;
c.beginPath(); c.moveTo(22,-22); c.lineTo(10,atk?-14:-8); c.stroke();
}

function _raptor(c,atk,ko,leg,tail){
c.strokeStyle=’#991b1b’; c.lineWidth=9; c.lineCap=‘round’;
c.save(); c.translate(-18,0); c.rotate(tail*0.05);
c.beginPath(); c.moveTo(18,-2); c.quadraticCurveTo(-8,6,-20,14); c.stroke();
c.restore();
var bg=c.createRadialGradient(4,-12,2,4,-12,22);
bg.addColorStop(0,’#ef4444’); bg.addColorStop(1,’#7f1d1d’);
c.fillStyle=bg; c.beginPath(); c.ellipse(4,-14,18,18,0,0,Math.PI*2); c.fill();
c.fillStyle=’#fbbf24’;
c.beginPath(); c.moveTo(6,-22); c.lineTo(1,-10); c.lineTo(6,-12); c.lineTo(2,-2); c.lineTo(9,-14); c.lineTo(4,-12); c.closePath(); c.fill();
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls<0?-8:8,4); c.rotate(ls*leg*-0.025);
c.strokeStyle=’#991b1b’; c.lineWidth=7; c.lineCap=‘round’;
c.beginPath(); c.moveTo(0,0); c.lineTo(ls*2,14); c.lineTo(ls*6,20); c.stroke();
c.restore();
}
c.strokeStyle=’#dc2626’; c.lineWidth=10; c.lineCap=‘round’;
c.beginPath(); c.moveTo(10,-18); c.quadraticCurveTo(18,-30,24,-38); c.stroke();
var hg=c.createLinearGradient(12,-48,46,-35);
hg.addColorStop(0,’#dc2626’); hg.addColorStop(1,’#7f1d1d’);
c.fillStyle=hg;
c.beginPath(); c.moveTo(16,-46); c.lineTo(50,-40); c.lineTo(54,-36); c.lineTo(44,-30); c.lineTo(16,-36); c.closePath(); c.fill();
var jo=atk?7:2;
c.fillStyle=’#ef4444’;
c.beginPath(); c.moveTo(18,-36+jo); c.lineTo(48,-32+jo); c.lineTo(50,-28+jo); c.lineTo(18,-30+jo); c.closePath(); c.fill();
c.fillStyle=’#f0f0e0’;
for(var ti=0;ti<5;ti++){ c.beginPath(); c.moveTo(22+ti*5,-32); c.lineTo(20+ti*5,-36+jo); c.lineTo(24+ti*5,-36+jo); c.closePath(); c.fill(); }
drawEye(c,32,-42,5,’#f87171’);
c.strokeStyle=’#dc2626’; c.lineWidth=5; c.lineCap=‘round’;
c.beginPath(); c.moveTo(10,-16); c.lineTo(4,atk?-8:-4); c.stroke();
}

function _trice(c,atk,ko,leg,tail){
c.strokeStyle=’#1d4ed8’; c.lineWidth=16; c.lineCap=‘round’;
c.save(); c.translate(-32,-2); c.rotate(tail*0.03);
c.beginPath(); c.moveTo(32,0); c.quadraticCurveTo(-4,10,-18,24); c.stroke();
c.restore();
var bg=c.createRadialGradient(4,-14,4,4,-14,36);
bg.addColorStop(0,’#3b82f6’); bg.addColorStop(1,’#1e3a8a’);
c.fillStyle=bg; c.beginPath(); c.ellipse(4,-18,32,26,0,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(191,219,254,0.35)’; c.beginPath(); c.ellipse(2,-14,18,14,0.1,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(255,255,255,0.88)’; starPath(c,4,-18,12); c.fill();
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls<0?-14:18,8); c.rotate(ls*leg*0.022);
c.fillStyle=ls<0?’#1d4ed8’:’#2563eb’; c.fillRect(-7,0,15,22);
c.strokeStyle=’#1e3a8a’; c.lineWidth=3; c.lineCap=‘round’;
c.beginPath(); c.moveTo(-7,22); c.lineTo(-13,30); c.stroke();
c.beginPath(); c.moveTo(2,22);  c.lineTo(2,31);   c.stroke();
c.beginPath(); c.moveTo(8,22);  c.lineTo(14,29);  c.stroke();
c.restore();
}
c.strokeStyle=’#2563eb’; c.lineWidth=20; c.lineCap=‘round’;
c.beginPath(); c.moveTo(22,-24); c.quadraticCurveTo(34,-38,44,-46); c.stroke();
var fg=c.createRadialGradient(32,-50,4,32,-50,22);
fg.addColorStop(0,’#f87171’); fg.addColorStop(1,’#991b1b’);
c.fillStyle=fg; c.beginPath(); c.ellipse(32,-50,22,14,0,0,Math.PI*2); c.fill();
var hg=c.createLinearGradient(26,-60,66,-44);
hg.addColorStop(0,’#3b82f6’); hg.addColorStop(1,’#1e3a8a’);
c.fillStyle=hg; c.beginPath(); c.ellipse(50,-52,18,13,0,0,Math.PI*2); c.fill();
c.fillStyle=atk?’#93c5fd’:’#60a5fa’;
c.beginPath(); c.moveTo(60,-48); c.lineTo(76,-44); c.lineTo(76,-40); c.lineTo(60,-44); c.closePath(); c.fill();
c.fillStyle=’#f1f5f9’;
var hns=[[58,-66,4,18],[66,-62,3,14],[50,-64,2.5,12]];
for(var hi=0;hi<hns.length;hi++){
var h=hns[hi];
c.beginPath(); c.moveTo(h[0]-h[2],h[1]+h[3]); c.lineTo(h[0],h[1]); c.lineTo(h[0]+h[2],h[1]+h[3]); c.closePath(); c.fill();
}
drawEye(c,46,-54,6,’#60a5fa’);
c.fillStyle=’#ef4444’; c.beginPath(); c.arc(80,-44,10,0,Math.PI*2); c.fill();
c.fillStyle=’#1d4ed8’; c.beginPath(); c.arc(80,-44,7,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(255,255,255,0.88)’; starPath(c,80,-44,4); c.fill();
}

function _ptero(c,atk,ko,leg,tail,action){
c.fillStyle=’#b91c1c’; c.globalAlpha=0.82;
c.beginPath(); c.moveTo(-6,-16); c.quadraticCurveTo(-40,-36,-52,-20); c.lineTo(-40,-6); c.quadraticCurveTo(-20,-10,-6,-8); c.closePath(); c.fill();
c.beginPath(); c.moveTo(18,-16); c.quadraticCurveTo(52,-36,64,-20); c.lineTo(52,-6); c.quadraticCurveTo(32,-10,18,-8); c.closePath(); c.fill();
c.globalAlpha=1;
var bg=c.createRadialGradient(6,-14,2,6,-14,22);
bg.addColorStop(0,’#f59e0b’); bg.addColorStop(1,’#92400e’);
c.fillStyle=bg; c.beginPath(); c.ellipse(6,-18,20,20,0,0,Math.PI*2); c.fill();
var ar=c.createRadialGradient(6,-18,0,6,-18,8);
ar.addColorStop(0,’#bfdbfe’); ar.addColorStop(0.4,’#3b82f6’); ar.addColorStop(1,’#1e40af’);
c.fillStyle=ar; c.beginPath(); c.arc(6,-18,8,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(255,255,255,0.9)’; c.beginPath(); c.arc(6,-18,3,0,Math.PI*2); c.fill();
c.strokeStyle=’#92400e’; c.lineWidth=7; c.lineCap=‘round’;
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls<0?-8:14,2); c.rotate(ls*leg*-0.025);
c.beginPath(); c.moveTo(0,0); c.lineTo(ls*2,16); c.lineTo(ls*6,22); c.stroke();
c.restore();
}
c.strokeStyle=’#b45309’; c.lineWidth=12; c.lineCap=‘round’;
c.beginPath(); c.moveTo(14,-24); c.quadraticCurveTo(22,-36,28,-44); c.stroke();
var hg=c.createLinearGradient(16,-58,50,-42);
hg.addColorStop(0,’#f59e0b’); hg.addColorStop(1,’#92400e’);
c.fillStyle=hg; c.beginPath(); c.ellipse(32,-50,18,14,0,0,Math.PI*2); c.fill();
c.fillStyle=’#fbbf24’;
c.beginPath(); c.moveTo(22,-60); c.quadraticCurveTo(32,-72,42,-60); c.quadraticCurveTo(36,-62,22,-60); c.closePath(); c.fill();
var vg=c.createLinearGradient(16,-54,48,-44);
vg.addColorStop(0,’#fcd34d’); vg.addColorStop(1,’#f59e0b’);
c.fillStyle=vg;
c.beginPath(); c.moveTo(18,-54); c.lineTo(48,-48); c.lineTo(48,-42); c.lineTo(18,-44); c.closePath(); c.fill();
if(action===‘special’){
c.fillStyle=‘rgba(191,219,254,0.75)’;
c.beginPath(); c.moveTo(18,-54); c.lineTo(48,-48); c.lineTo(48,-42); c.lineTo(18,-44); c.closePath(); c.fill();
}
c.fillStyle=‘rgba(0,0,0,0.7)’; c.fillRect(20,-51,10,4); c.fillRect(34,-49,10,4);
c.fillStyle=’#92400e’;
c.beginPath(); c.moveTo(46,-46); c.lineTo(62,-42); c.lineTo(62,-38); c.lineTo(46,-42); c.closePath(); c.fill();
if(atk){
var rg=c.createRadialGradient(-8,-14,0,-8,-14,10);
rg.addColorStop(0,‘rgba(191,219,254,1)’); rg.addColorStop(1,‘rgba(59,130,246,0)’);
c.fillStyle=rg; c.beginPath(); c.arc(-8,-14,10,0,Math.PI*2); c.fill();
}
}

function _spino(c,atk,ko,leg,tail){
c.strokeStyle=’#6b1515’; c.lineWidth=16; c.lineCap=‘round’;
c.save(); c.translate(-36,-4); c.rotate(tail*0.04);
c.beginPath(); c.moveTo(36,0); c.quadraticCurveTo(-2,10,-22,26); c.stroke();
c.restore();
c.fillStyle=‘rgba(120,20,20,0.85)’;
c.beginPath(); c.moveTo(-10,-28); c.lineTo(-4,-68); c.lineTo(4,-72); c.lineTo(10,-66); c.lineTo(18,-60); c.lineTo(22,-50); c.lineTo(20,-28); c.closePath(); c.fill();
var bg=c.createRadialGradient(2,-16,3,2,-16,32);
bg.addColorStop(0,’#9b3030’); bg.addColorStop(1,’#4a0e0e’);
c.fillStyle=bg; c.beginPath(); c.ellipse(2,-18,28,24,0,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(200,120,100,0.3)’; c.beginPath(); c.ellipse(0,-14,16,14,0,0,Math.PI*2); c.fill();
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls*12,8); c.rotate(ls*leg*-0.022);
c.strokeStyle=’#6b1515’; c.lineWidth=9; c.lineCap=‘round’;
c.beginPath(); c.moveTo(0,0); c.lineTo(ls*2,18); c.lineTo(ls*6,26); c.stroke();
c.restore();
}
c.strokeStyle=’#8b2020’; c.lineWidth=16; c.lineCap=‘round’;
c.beginPath(); c.moveTo(18,-22); c.quadraticCurveTo(30,-38,40,-50); c.stroke();
c.fillStyle=’#7f1d1d’;
c.beginPath(); c.moveTo(20,-54); c.lineTo(78,-46); c.lineTo(80,-40); c.lineTo(56,-34); c.lineTo(22,-40); c.closePath(); c.fill();
var jo=atk?8:3;
c.fillStyle=’#9b3030’;
c.beginPath(); c.moveTo(24,-40+jo); c.lineTo(76,-36+jo); c.lineTo(78,-30+jo); c.lineTo(24,-34+jo); c.closePath(); c.fill();
c.fillStyle=’#ddd’;
for(var ti=0;ti<8;ti++){ c.beginPath(); c.moveTo(28+ti*6,-36); c.lineTo(26+ti*6,-40+jo); c.lineTo(30+ti*6,-40+jo); c.closePath(); c.fill(); }
drawEye(c,38,-52,7,’#dc2626’);
c.fillStyle=‘rgba(60,0,0,0.4)’;
for(var si=0;si<5;si++) for(var sj=0;sj<3;sj++){ c.beginPath(); c.arc(-8+si*9,-28+sj*7,3,0,Math.PI*2); c.fill(); }
}

function _anky(c,atk,ko,leg,tail){
c.save(); c.translate(-42,0); c.rotate(tail*0.05+(atk?-0.4:0));
c.strokeStyle=’#5c3d0a’; c.lineWidth=12; c.lineCap=‘round’;
c.beginPath(); c.moveTo(42,2); c.quadraticCurveTo(8,8,-10,18); c.stroke();
c.fillStyle=’#6b4c0a’; c.beginPath(); c.arc(-12,20,14,0,Math.PI*2); c.fill();
c.fillStyle=’#8b6914’; c.beginPath(); c.arc(-12,20,10,0,Math.PI*2); c.fill();
for(var i=0;i<6;i++){
var a=i*Math.PI/3; c.fillStyle=’#4a3208’;
c.beginPath();
c.moveTo(-12+Math.cos(a)*10, 20+Math.sin(a)*10);
c.lineTo(-12+Math.cos(a)*17, 20+Math.sin(a)*17);
c.lineTo(-12+Math.cos(a+0.4)*12, 20+Math.sin(a+0.4)*12);
c.closePath(); c.fill();
}
c.restore();
var bg=c.createRadialGradient(2,-10,4,2,-10,38);
bg.addColorStop(0,’#b45309’); bg.addColorStop(1,’#451a03’);
c.fillStyle=bg; c.beginPath(); c.ellipse(2,-12,36,22,0,0,Math.PI*2); c.fill();
c.fillStyle=’#7c3d12’;
var os=[[0,-30,5],[12,-32,4.5],[-12,-32,4.5],[-22,-26,4],[22,-26,4],[0,-14,4.5],[12,-16,4],[-12,-16,4]];
for(var oi=0;oi<os.length;oi++){ c.beginPath(); c.ellipse(os[oi][0],os[oi][1],os[oi][2],os[oi][2]*0.7,0,0,Math.PI*2); c.fill(); }
c.fillStyle=’#5c2d0a’;
for(var i2=-2;i2<=2;i2++){ c.beginPath(); c.moveTo(i2*12,-30); c.lineTo(i2*12-4,-46); c.lineTo(i2*12+4,-46); c.closePath(); c.fill(); }
var lps=[[-20,8],[-8,10],[8,10],[20,8]];
for(var li=0;li<lps.length;li++){
c.save(); c.translate(lps[li][0],lps[li][1]); c.rotate((li<2?-1:1)*leg*0.018);
c.fillStyle=’#7c3d12’; c.fillRect(-5,0,10,14); c.restore();
}
c.strokeStyle=’#b45309’; c.lineWidth=14; c.lineCap=‘round’;
c.beginPath(); c.moveTo(22,-18); c.quadraticCurveTo(30,-26,36,-32); c.stroke();
c.fillStyle=’#92400e’; c.beginPath(); c.ellipse(40,-34,16,10,0,0,Math.PI*2); c.fill();
c.fillStyle=’#7c3d12’; c.beginPath(); c.ellipse(40,-34,12,7,0,0,Math.PI); c.fill();
c.fillStyle=atk?’#fbbf24’:’#b45309’;
c.beginPath(); c.moveTo(50,-34); c.lineTo(62,-30); c.lineTo(62,-27); c.lineTo(50,-30); c.closePath(); c.fill();
drawEye(c,36,-38,5,’#d97706’);
}

function _para(c,atk,ko,leg,tail){
c.strokeStyle=’#1a3580’; c.lineWidth=12; c.lineCap=‘round’;
c.save(); c.translate(-28,-2); c.rotate(tail*0.04);
c.beginPath(); c.moveTo(28,0); c.quadraticCurveTo(-4,10,-18,22); c.stroke();
c.restore();
var bg=c.createRadialGradient(4,-16,3,4,-16,28);
bg.addColorStop(0,’#2563eb’); bg.addColorStop(1,’#1e3a8a’);
c.fillStyle=bg; c.beginPath(); c.ellipse(4,-18,24,22,0,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(147,197,253,0.35)’; c.beginPath(); c.ellipse(2,-14,14,12,0,0,Math.PI*2); c.fill();
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls*10,4); c.rotate(ls*leg*-0.022);
c.strokeStyle=’#1e3a8a’; c.lineWidth=8; c.lineCap=‘round’;
c.beginPath(); c.moveTo(0,0); c.lineTo(ls*2,16); c.lineTo(ls*5,22); c.stroke();
c.restore();
}
c.strokeStyle=’#2563eb’; c.lineWidth=14; c.lineCap=‘round’;
c.beginPath(); c.moveTo(16,-22); c.quadraticCurveTo(26,-36,34,-44); c.stroke();
c.fillStyle=’#1d4ed8’; c.beginPath(); c.ellipse(40,-48,16,11,0,0,Math.PI*2); c.fill();
var cg=c.createLinearGradient(30,-70,20,-46);
cg.addColorStop(0,’#7c3aed’); cg.addColorStop(1,’#1d4ed8’);
c.fillStyle=cg;
c.beginPath(); c.moveTo(38,-56); c.quadraticCurveTo(26,-72,8,-68); c.quadraticCurveTo(12,-60,30,-54); c.closePath(); c.fill();
if(atk){
var sg=c.createRadialGradient(18,-68,0,18,-68,20);
sg.addColorStop(0,‘rgba(139,92,246,0.8)’); sg.addColorStop(1,‘rgba(139,92,246,0)’);
c.fillStyle=sg; c.beginPath(); c.arc(18,-68,20,0,Math.PI*2); c.fill();
}
c.fillStyle=atk?’#93c5fd’:’#3b82f6’;
c.beginPath(); c.moveTo(50,-46); c.lineTo(66,-44); c.lineTo(66,-40); c.lineTo(50,-42); c.closePath(); c.fill();
drawEye(c,34,-50,5.5,’#60a5fa’);
c.strokeStyle=’#2563eb’; c.lineWidth=6; c.lineCap=‘round’;
c.beginPath(); c.moveTo(14,-18); c.lineTo(8,atk?-8:-4); c.stroke();
}

function _carno(c,atk,ko,leg,tail){
c.strokeStyle=’#7c2d12’; c.lineWidth=14; c.lineCap=‘round’;
c.save(); c.translate(-30,-2); c.rotate(tail*0.04);
c.beginPath(); c.moveTo(30,0); c.quadraticCurveTo(-4,10,-20,24); c.stroke();
c.restore();
var bg=c.createRadialGradient(4,-16,3,4,-16,30);
bg.addColorStop(0,’#c2410c’); bg.addColorStop(1,’#7c2d12’);
c.fillStyle=bg; c.beginPath(); c.ellipse(4,-18,26,22,0,0,Math.PI*2); c.fill();
c.fillStyle=‘rgba(90,20,5,0.6)’;
for(var i=0;i<8;i++) for(var j=0;j<2;j++){ c.beginPath(); c.arc(-16+i*9,-24+j*10,3.5,0,Math.PI*2); c.fill(); }
for(var ls=-1;ls<=1;ls+=2){
c.save(); c.translate(ls*12,6); c.rotate(ls*leg*-0.025);
c.strokeStyle=’#7c2d12’; c.lineWidth=9; c.lineCap=‘round’;
c.beginPath(); c.moveTo(0,0); c.lineTo(ls*2,18); c.lineTo(ls*6,24); c.stroke();
c.restore();
}
c.strokeStyle=’#9a3412’; c.lineWidth=18; c.lineCap=‘round’;
c.beginPath(); c.moveTo(18,-22); c.quadraticCurveTo(28,-36,36,-46); c.stroke();
c.strokeStyle=’#c2410c’; c.lineWidth=8;
c.beginPath(); c.moveTo(18,-22); c.quadraticCurveTo(28,-36,36,-46); c.stroke();
var hg=c.createLinearGradient(22,-60,62,-44);
hg.addColorStop(0,’#c2410c’); hg.addColorStop(1,’#7c2d12’);
c.fillStyle=hg; c.beginPath(); c.ellipse(44,-52,20,14,0,0,Math.PI*2); c.fill();
c.fillStyle=’#5c1e08’; c.beginPath(); c.ellipse(44,-60,16,6,-0.1,0,Math.PI*2); c.fill();
c.fillStyle=’#fbbf24’;
c.beginPath(); c.moveTo(34,-62); c.lineTo(30,-74); c.lineTo(38,-64); c.closePath(); c.fill();
c.beginPath(); c.moveTo(52,-62); c.lineTo(56,-74); c.lineTo(48,-64); c.closePath(); c.fill();
c.fillStyle=atk?’#fb923c’:’#c2410c’;
c.beginPath(); c.moveTo(58,-50); c.lineTo(70,-46); c.lineTo(70,-40); c.lineTo(58,-44); c.closePath(); c.fill();
var jo=atk?7:2;
c.fillStyle=’#9a3412’;
c.beginPath(); c.moveTo(30,-44+jo); c.lineTo(68,-40+jo); c.lineTo(70,-36+jo); c.lineTo(30,-38+jo); c.closePath(); c.fill();
c.fillStyle=’#e5e5d0’;
for(var ti=0;ti<6;ti++){ c.beginPath(); c.moveTo(34+ti*5.5,-40); c.lineTo(33+ti*5.5,-44+jo); c.lineTo(37+ti*5.5,-44+jo); c.closePath(); c.fill(); }
drawEye(c,38,-54,6.5,’#dc2626’);
c.strokeStyle=’#4a1505’; c.lineWidth=2.5; c.lineCap=‘round’;
c.beginPath(); c.moveTo(32,-59); c.lineTo(44,-57); c.stroke();
}

// ============================================================
//  KO STARS
// ============================================================
function drawKO(c,x,y,frame){
c.fillStyle=‘white’; c.strokeStyle=’#fbbf24’; c.lineWidth=2;
c.beginPath(); c.rect(x-18,y-50,36,20); c.fill(); c.stroke();
c.fillStyle=’#1a1a1a’; c.font=‘13px Arial’; c.textAlign=‘center’;
c.fillText(‘x_x’,x,y-35);
for(var i=0;i<4;i++){
var a=(frame*5+i*90)*Math.PI/180;
c.fillStyle=[’#fbbf24’,’#e5e7eb’,’#f9fafb’,’#fde68a’][i];
c.font=‘14px Arial’; c.textAlign=‘center’;
c.fillText([’*’,’+’,’*’,’.’][i], x+Math.cos(a)*22, y-62+Math.sin(a)*9);
}
}

// ============================================================
//  PROJECTILES
// ============================================================
function drawProj(c,projs){
for(var i=0;i<projs.length;i++){
var pr=projs[i]; c.save();
if(pr.type===‘shockwave’){
c.strokeStyle=‘rgba(74,222,128,0.8)’; c.lineWidth=4;
c.beginPath(); c.ellipse(pr.x,GY-10,pr.r,pr.r*0.3,0,0,Math.PI*2);
c.globalAlpha=1-pr.prog; c.stroke(); c.globalAlpha=1;
} else if(pr.type===‘shield’){
c.translate(pr.x,pr.y); c.rotate((pr.spin||0)*Math.PI/180);
var sg=c.createRadialGradient(0,0,0,0,0,14);
sg.addColorStop(0,’#60a5fa’); sg.addColorStop(1,’#1d4ed8’);
c.fillStyle=sg; c.beginPath(); c.arc(0,0,14,0,Math.PI*2); c.fill();
c.strokeStyle=’#f1f5f9’; c.lineWidth=3; c.stroke();
c.fillStyle=‘rgba(255,255,255,0.8)’; starPath(c,0,0,7); c.fill();
} else if(pr.type===‘laser’){
var lx=pr.x-(pr.vx>0?0:50);
var lg=c.createLinearGradient(lx,pr.y,lx+50,pr.y);
lg.addColorStop(0,’#fef08a’); lg.addColorStop(0.5,’#f97316’); lg.addColorStop(1,‘rgba(249,115,22,0)’);
c.fillStyle=lg; c.fillRect(lx,pr.y-5,50,10);
} else if(pr.type===‘acid’){
var ag=c.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,10);
ag.addColorStop(0,‘rgba(132,204,22,0.9)’); ag.addColorStop(1,‘rgba(63,98,18,0)’);
c.fillStyle=ag; c.beginPath(); c.arc(pr.x,pr.y,10,0,Math.PI*2); c.fill();
} else if(pr.type===‘sonic’){
c.strokeStyle=‘rgba(139,92,246,’+(0.8-pr.r*0.012)+’)’; c.lineWidth=3;
c.beginPath(); c.arc(pr.x,pr.y,pr.r,0,Math.PI*2);
c.globalAlpha=Math.max(0,0.8-pr.r*0.015); c.stroke(); c.globalAlpha=1;
}
c.restore();
}
}

// ============================================================
//  HQ POPUPS
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
c.fillStyle=h.c; c.textAlign=‘center’; c.textBaseline=‘alphabetic’; c.fillText(h.w,0,0);
c.restore();
}
}

// ============================================================
//  MINI DINO (for UI cards)
// ============================================================
function miniDino(canvas2d,id){
var c=canvas2d;
c.clearRect(0,0,80,70);
c.save(); c.translate(22,58);
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
//  TITLE SCREEN
// ============================================================
function goTitle(){
if(raf){ cancelAnimationFrame(raf); raf=null; }
if(resultRaf){ cancelAnimationFrame(resultRaf); resultRaf=null; }
show(‘titleScreen’);
var pc=document.getElementById(‘titlePreview’), c=pc.getContext(‘2d’);
c.clearRect(0,0,340,100);
var ids=[‘trex’,‘raptor’,‘trice’,‘ptero’], xs=[30,100,195,280];
for(var i=0;i<4;i++){
c.save(); c.translate(xs[i],68);
drawDino(c,ids[i],0,0,1,‘idle’,0,false);
c.restore();
}
}

// ============================================================
//  SELECT SCREEN
// ============================================================
var selMode=‘1p’, selP1=‘trex’, selP2=‘spino’;

function goSelect(mode){
selMode=mode;
selP1=‘trex’;
selP2=mode===‘1p’?‘spino’:‘raptor’;
show(‘selectScreen’);
document.getElementById(‘selSub’).textContent = mode===‘2p’?‘P1 ESQUERDA | P2 DIREITA’:‘HEROI vs VILAO CPU’;
buildCards();
updateVS();
}

function buildCards(){
var col=document.getElementById(‘selCols’);
col.innerHTML=’’;

function group(label,cls,ids,slot){
var g=document.createElement(‘div’); g.className=‘sel-group’;
var lbl=document.createElement(‘label’); lbl.className=cls; lbl.textContent=label;
var row=document.createElement(‘div’); row.className=‘cards-row’;
ids.forEach(function(id){ row.appendChild(makeCard(id,slot)); });
g.appendChild(lbl); g.appendChild(row); col.appendChild(g);
}

group(’[ HEROI - P1 ]’,‘lbl-hero’, HEROES, ‘p1’);
group(
selMode===‘2p’?’[ P2 ]’:’[ VILAO CPU ]’,
selMode===‘2p’?‘lbl-hero’:‘lbl-villain’,
selMode===‘2p’?ALL_IDS:VILLAINS,
‘p2’
);
}

function makeCard(id,slot){
var ch=CH_DATA[id];
var sel=(slot===‘p1’&&selP1===id)||(slot===‘p2’&&selP2===id);
var card=document.createElement(‘div’); card.className=‘ccard’;
if(sel){
card.style.borderColor=ch.color;
card.style.boxShadow=’0 0 16px ’+ch.color+‘66’;
card.style.transform=‘scale(1.06)’;
}
if(ch.role===‘villain’){
var vt=document.createElement(‘div’); vt.className=‘villain-tag’; vt.textContent=‘VILAO’; card.appendChild(vt);
}
var mc=document.createElement(‘canvas’); mc.width=80; mc.height=70;
card.appendChild(mc);
miniDino(mc.getContext(‘2d’),id);
var nm=document.createElement(‘div’); nm.className=‘ccard-name’;
nm.style.color=ch.lc; nm.style.textShadow=’0 0 6px ’+ch.color; nm.textContent=ch.name; card.appendChild(nm);
var sp=document.createElement(‘div’); sp.className=‘ccard-sp’; sp.textContent=ch.sp; card.appendChild(sp);
if(sel){
var lbl=document.createElement(‘div’); lbl.className=‘ccard-lbl’;
lbl.style.background=ch.color;
lbl.textContent=slot===‘p1’?‘P1’:(selMode===‘2p’?‘P2’:‘CPU’);
card.appendChild(lbl);
}
card.addEventListener(‘touchstart’,function(e){ e.preventDefault(); pick(id,slot); },{passive:false});
card.addEventListener(‘click’,function(){ pick(id,slot); });
return card;
}

function pick(id,slot){
if(slot===‘p1’) selP1=id; else selP2=id;
buildCards(); updateVS();
}

function updateVS(){
miniDino(document.getElementById(‘vsC1’).getContext(‘2d’), selP1);
miniDino(document.getElementById(‘vsC2’).getContext(‘2d’), selP2);
document.getElementById(‘vsN1’).style.color=CH_DATA[selP1].lc;
document.getElementById(‘vsN2’).style.color=CH_DATA[selP2].lc;
document.getElementById(‘vsN2’).textContent=selMode===‘2p’?‘P2’:‘CPU’;
}

// ============================================================
//  FIGHT SCREEN
// ============================================================
function goFight(){
p1Id=selP1; p2Id=selP2; gameMode=selMode;
show(‘fightScreen’);

var fs   = document.getElementById(‘fightScreen’);
var cv   = document.getElementById(‘gameCanvas’);
var hud  = document.getElementById(‘hud’);
var spb  = document.getElementById(‘spbars’);
var ctrl = document.getElementById(‘controls’);
cv.width  = fs.clientWidth;
var usedH = hud.offsetHeight + spb.offsetHeight + ctrl.offsetHeight;
cv.height = Math.max(fs.clientHeight - usedH, 100);

buildHUD();
buildCtrl();

gs = {
p1:{ cId:p1Id, x:130,       y:GY, vy:0, vx:0, hp:HP_MAX, facing:1,  action:‘idle’, atking:false, atkT:0, stun:false, stunT:0, spCD:SP_CD, dash:false, dashT:0, onGnd:true },
p2:{ cId:p2Id, x:CW-160,    y:GY, vy:0, vx:0, hp:HP_MAX, facing:-1, action:‘idle’, atking:false, atkT:0, stun:false, stunT:0, spCD:SP_CD, dash:false, dashT:0, onGnd:true },
projs:[], frame:0, over:false, aiT:0
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
var f1=document.getElementById(‘hf1’); if(f1){ f1.style.width=(pct1*100)+’%’; f1.style.background=col(pct1); }
var f2=document.getElementById(‘hf2’); if(f2){ f2.style.width=(pct2*100)+’%’; f2.style.background=col(pct2); }
var v1=document.getElementById(‘hv1’); if(v1) v1.textContent=‘HP ‘+Math.max(0,Math.round(p1.hp))+’/’+HP_MAX;
var v2=document.getElementById(‘hv2’); if(v2) v2.textContent=‘HP ‘+Math.max(0,Math.round(p2.hp))+’/’+HP_MAX;
var s1=document.getElementById(‘sf1’); if(s1) s1.style.width=Math.max(0,100-(p1.spCD/SP_CD)*100)+’%’;
var s2=document.getElementById(‘sf2’); if(s2) s2.style.width=Math.max(0,100-(p2.spCD/SP_CD)*100)+’%’;
}

// – CONTROLS –
function buildCtrl(){
document.getElementById(‘ctrlL’).innerHTML=’’;
document.getElementById(‘ctrlR’).innerHTML=’’;
document.getElementById(‘ctrlMid’).innerHTML = gameMode===‘2p’
? ‘<span style="color:#22c55e;font-size:7px">P1</span><br>vs<br><span style="color:#60a5fa;font-size:7px">P2</span>’
: ‘<span style="color:#ef4444;font-size:8px">AI</span>’;

addCtrl(‘ctrlL’, CH_DATA[p1Id],
function(){ p1Pr.atk=true; },
function(){ p1Pr.sp=true;  },
function(){ p1Pr.up=true;  },
function(v){ p1In.left=v.left; p1In.right=v.right; if(v.up&&!p1In.up) p1Pr.up=true; p1In.up=v.up; }
);

if(gameMode===‘2p’){
addCtrl(‘ctrlR’, CH_DATA[p2Id],
function(){ p2Pr.atk=true; },
function(){ p2Pr.sp=true;  },
function(){ p2Pr.up=true;  },
function(v){ p2In.left=v.left; p2In.right=v.right; if(v.up&&!p2In.up) p2Pr.up=true; p2In.up=v.up; }
);
}
}

function addCtrl(cId,ch,onAtk,onSp,onJump,onJoy){
var cont=document.getElementById(cId);

// joystick
var jd=document.createElement(‘div’); jd.className=‘joystick’;
var th=document.createElement(‘div’); th.className=‘joystick-thumb’;
jd.appendChild(th); cont.appendChild(jd);
var jOn=false, jId2=null, jBX=0, jBY=0, MX=36;

jd.addEventListener(‘touchstart’,function(e){
e.preventDefault();
var t=e.changedTouches[0];
var r=jd.getBoundingClientRect();
jOn=true; jId2=t.identifier; jBX=r.left+r.width/2; jBY=r.top+r.height/2;
},{passive:false});

jd.addEventListener(‘touchmove’,function(e){
e.preventDefault(); if(!jOn) return;
var t=null;
for(var i=0;i<e.changedTouches.length;i++) if(e.changedTouches[i].identifier===jId2){ t=e.changedTouches[i]; break; }
if(!t) return;
var dx=t.clientX-jBX, dy=t.clientY-jBY, dist=Math.sqrt(dx*dx+dy*dy);
var cx=dist>MX?dx/dist*MX:dx, cy=dist>MX?dy/dist*MX:dy;
th.style.left=’calc(50% + ’+cx+‘px - 18px)’;
th.style.top =’calc(50% + ’+cy+‘px - 18px)’;
th.style.transition=‘none’;
onJoy({left:cx/MX<-0.28, right:cx/MX>0.28, up:cy/MX<-0.45});
},{passive:false});

var jEnd=function(e){
e.preventDefault(); jOn=false;
th.style.left=‘calc(50% - 18px)’; th.style.top=‘calc(50% - 18px)’;
th.style.transition=‘0.08s’;
onJoy({left:false,right:false,up:false});
};
jd.addEventListener(‘touchend’,jEnd,{passive:false});
jd.addEventListener(‘touchcancel’,jEnd,{passive:false});

// action buttons
var bd=document.createElement(‘div’); bd.className=‘act-btns’;

function mkBtn(cls,bg,bc,html,fn){
var b=document.createElement(‘button’); b.className=’act-btn ’+cls;
b.style.background=bg; b.style.border=’2px solid ’+bc; b.style.boxShadow=’0 0 10px ’+bc+‘55’;
b.innerHTML=html;
b.addEventListener(‘touchstart’,function(e){ e.preventDefault(); fn(); },{passive:false});
b.addEventListener(‘mousedown’, function(e){ e.preventDefault(); fn(); });
return b;
}

bd.appendChild(mkBtn(‘btn-jump’,
‘radial-gradient(circle at 35% 35%,rgba(132,204,22,0.8),rgba(132,204,22,0.5))’,
‘#84cc16’,
‘<span style="font-size:13px">^</span><span class="btn-lbl">PULAR</span>’,
onJump
));
bd.appendChild(mkBtn(‘btn-atk’,
‘radial-gradient(circle at 35% 35%,rgba(249,115,22,0.8),rgba(249,115,22,0.5))’,
‘#f97316’,
‘<span style="font-size:13px">ATK</span><span class="btn-lbl">ATACAR</span>’,
onAtk
));
bd.appendChild(mkBtn(‘btn-sp’,
‘radial-gradient(circle at 35% 35%,’+ch.color+‘99,’+ch.color+‘55)’,
ch.color,
‘<span style="font-size:11px">SP</span><span class="btn-lbl">’+ch.sp+’</span>’,
onSp
));

cont.appendChild(bd);
}

// ============================================================
//  GAME LOGIC
// ============================================================
function addPop(x,y,big,custom){
var h=custom||HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x, y:y, hq:h, big:big, rot:(Math.random()-0.5)*26, life:60});
if(big){
var h2=HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x-46, y:y+18, hq:h2, big:false, rot:-15, life:44});
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
if(id===‘trex’)
gs.projs.push({type:‘shockwave’,x:user.x,y:GY,r:8,maxR:130,prog:0,owner:user,hk:hk,hit:false});
else if(id===‘raptor’)
{ user.dash=true; user.dashT=480; user.vx=user.facing*16; }
else if(id===‘trice’)
gs.projs.push({type:‘shield’,x:user.x+user.facing*28,y:user.y-38,vx:user.facing*PROJ_SPD,spin:0,hit:false,owner:user,hk:hk,ret:false});
else if(id===‘ptero’)
gs.projs.push({type:‘laser’,x:user.x+user.facing*26,y:user.y-44,vx:user.facing*PROJ_SPD*1.8,owner:user,hk:hk,hit:false});
else if(id===‘spino’)
gs.projs.push({type:‘acid’,x:user.x+user.facing*28,y:user.y-30,vx:user.facing*PROJ_SPD*0.9,owner:user,hk:hk,hit:false});
else if(id===‘anky’){
var o2=user===gs.p1?gs.p2:gs.p1;
if(Math.abs(user.x-o2.x)<100&&!o2.stun&&o2.hp>0)
applyHit(user,o2,SP_DMG*ch.str*1.2,true,hk);
}
else if(id===‘para’)
gs.projs.push({type:‘sonic’,x:user.x,y:user.y-40,r:5,maxR:120,owner:user,hk:hk,hit:false});
else if(id===‘carno’)
{ user.dash=true; user.dashT=420; user.vx=user.facing*18; }
addPop(user.x, user.y-80, true, {w:ch.sp+’!’, c:’#fef08a’, b:ch.color});
}

function runAI(ai,pl){
if(ai.stun||ai.hp<=0) return;
gs.aiT-=16; if(gs.aiT>0) return;
gs.aiT=AI_TICK+Math.random()*260;
var ch=CH_DATA[ai.cId], dist=Math.abs(ai.x-pl.x), style=ch.ai||‘normal’;
ai.facing=pl.x>ai.x?1:-1;
if(style===‘aggressive’){
ai.vx=ai.facing*ch.speed*(Math.random()<0.9?1:0.5);
if(ai.onGnd&&Math.random()<0.12){ ai.vy=JUMP_V; ai.onGnd=false; }
if(dist<110&&!ai.atking&&Math.random()<0.7)  trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.35)            trigSp(ai,pl,‘p1’);
} else if(style===‘defensive’){
ai.vx=dist<70?-ai.facing*ch.speed*0.6:ai.facing*ch.speed*(dist>160?1:0.5);
if(dist<90&&!ai.atking&&Math.random()<0.5)   trigAtk(ai,pl,‘p1’);
if(dist<80&&ai.spCD<=0&&Math.random()<0.4)   trigSp(ai,pl,‘p1’);
} else if(style===‘ranged’){
var ideal=180;
if(dist<ideal-30)      ai.vx=-ai.facing*ch.speed*0.6;
else if(dist>ideal+30) ai.vx= ai.facing*ch.speed;
else                   ai.vx=0;
if(dist<130&&!ai.atking&&Math.random()<0.3)  trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.4)            trigSp(ai,pl,‘p1’);
} else if(style===‘rushdown’){
ai.vx=ai.facing*ch.speed;
if(ai.onGnd&&Math.random()<0.08){ ai.vy=JUMP_V; ai.onGnd=false; }
if(dist<100&&!ai.atking&&Math.random()<0.65) trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&dist<220&&Math.random()<0.32) trigSp(ai,pl,‘p1’);
} else {
if(dist>100)      ai.vx=ai.facing*ch.speed*(Math.random()<0.85?1:0);
else if(dist<50)  ai.vx=-ai.facing*ch.speed*0.5;
else              ai.vx=0;
if(ai.onGnd&&Math.random()<0.09){ ai.vy=JUMP_V; ai.onGnd=false; }
if(dist<108&&!ai.atking&&Math.random()<0.55) trigAtk(ai,pl,‘p1’);
if(ai.spCD<=0&&Math.random()<0.28)           trigSp(ai,pl,‘p1’);
}
}

// ============================================================
//  MAIN LOOP
// ============================================================
function loop(){
if(!gs||gs.over) return;
raf=requestAnimationFrame(loop);
gs.frame++;
var DT=16, p1=gs.p1, p2=gs.p2;

// timers
function tick(p){
if(p.atkT>0) { p.atkT-=DT; if(p.atkT<=0) p.atking=false; }
if(p.stunT>0){ p.stunT-=DT; if(p.stunT<=0){ p.stun=false; p.action=‘idle’; } }
if(p.spCD>0)   p.spCD-=DT;
if(p.dashT>0){ p.dashT-=DT; if(p.dashT<=0){ p.dash=false; p.vx*=0.2; } }
}
tick(p1); tick(p2);
if(hitF.p1>0) hitF.p1–;
if(hitF.p2>0) hitF.p2–;

// P1 input (touch + keyboard)
if(!p1.stun&&p1.hp>0){
if(!p1.dash){
var gl=p1In.left||keys[‘KeyA’], gr=p1In.right||keys[‘KeyD’];
if(gl)      { p1.vx=-CH_DATA[p1.cId].speed; p1.facing=-1; }
else if(gr) { p1.vx= CH_DATA[p1.cId].speed; p1.facing= 1; }
else          p1.vx*=0.72;
}
if((p1Pr.up||keys[‘Space’])&&p1.onGnd){ p1.vy=JUMP_V; p1.onGnd=false; }
if(p1Pr.atk||keys[‘KeyF’]) trigAtk(p1,p2,‘p2’);
if(p1Pr.sp ||keys[‘KeyE’]) trigSp(p1,p2,‘p2’);
} else p1.vx*=0.5;
p1Pr.atk=false; p1Pr.sp=false; p1Pr.up=false;

// P2 input / AI
if(gameMode===‘2p’){
if(!p2.stun&&p2.hp>0){
if(!p2.dash){
var gl2=p2In.left||keys[‘ArrowLeft’], gr2=p2In.right||keys[‘ArrowRight’];
if(gl2)      { p2.vx=-CH_DATA[p2.cId].speed; p2.facing=-1; }
else if(gr2) { p2.vx= CH_DATA[p2.cId].speed; p2.facing= 1; }
else           p2.vx*=0.72;
}
if((p2Pr.up||keys[‘ArrowUp’])&&p2.onGnd){ p2.vy=JUMP_V; p2.onGnd=false; }
if(p2Pr.atk||keys[‘KeyK’]) trigAtk(p2,p1,‘p1’);
if(p2Pr.sp ||keys[‘KeyL’]) trigSp(p2,p1,‘p1’);
} else p2.vx*=0.5;
p2Pr.atk=false; p2Pr.sp=false; p2Pr.up=false;
} else {
runAI(p2,p1);
}

// physics
function physics(p){
if(p.hp<=0){ p.action=‘ko’; p.vx*=0.86; }
p.vy+=GRAV; p.x+=p.vx; p.y+=p.vy;
if(p.y>=GY){ p.y=GY; p.vy=0; p.onGnd=true; } else p.onGnd=false;
p.x=Math.max(24, Math.min(CW-80, p.x));
if(p.hp>0&&!p.stun&&!p.atking){
if(!p.onGnd)              p.action=‘jump’;
else if(Math.abs(p.vx)>0.5) p.action=‘walk’;
else                      p.action=‘idle’;
}
if(p.hp>0&&!p.atking&&!p.dash){
var opp=p===p1?p2:p1;
p.facing=opp.x>p.x?1:-1;
}
}
physics(p1); physics(p2);

// projectiles
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
pr.r+=5;
var tgt=pr.owner===p1?p2:p1;
var dd=Math.sqrt((pr.x-tgt.x)*(pr.x-tgt.x)+(pr.y-tgt.y)*(pr.y-tgt.y));
if(!pr.hit&&dd<pr.r&&tgt.hp>0&&!tgt.stun){
pr.hit=true; applyHit(pr.owner,tgt,SP_DMG*CH_DATA[pr.owner.cId].str*0.85,true,pr.hk);
}
if(pr.r>pr.maxR) kill.push(pr);
} else {
pr.x+=pr.vx;
if(pr.type===‘shield’) pr.spin=(pr.spin||0)+15;
var tgt=pr.owner===p1?p2:p1;
if(!pr.hit&&Math.abs(pr.x-tgt.x)<44&&Math.abs(pr.y-(tgt.y-36))<56){
pr.hit=true;
applyHit(pr.owner,tgt,SP_DMG*CH_DATA[pr.owner.cId].str,true,pr.hk);
if(pr.type===‘shield’){ pr.ret=true; pr.vx*=-0.85; }
else kill.push(pr);
}
if(pr.ret&&Math.abs(pr.x-pr.owner.x)<32) kill.push(pr);
if(pr.x<-70||pr.x>CW+70) kill.push(pr);
}
});
kill.forEach(function(pr){ gs.projs.splice(gs.projs.indexOf(pr),1); });

// dash collision
[[p1,p2,‘p2’],[p2,p1,‘p1’]].forEach(function(t){
if(t[0].dash&&Math.abs(t[0].x-t[1].x)<60&&!t[1].stun&&t[1].hp>0){
applyHit(t[0],t[1],SP_DMG*CH_DATA[t[0].cId].str,true,t[2]);
t[0].dash=false; t[0].dashT=0;
}
});

// age popups
pops=pops.map(function(p){
return {x:p.x, y:p.y-0.55, hq:p.hq, big:p.big, rot:p.rot, life:p.life-1};
}).filter(function(p){ return p.life>0; });

// –– DRAW ––
var cv=document.getElementById(‘gameCanvas’);
var c=cv.getContext(‘2d’);
if(!c) return;
var W=cv.width, H=cv.height;
var scX=W/CW, scY=H/CH, sc=Math.min(scX,scY);
var ox=(W-CW*sc)/2, oy=(H-CH*sc)/2;

c.clearRect(0,0,W,H);
c.save();
c.translate(ox,oy);
c.scale(sc,sc);

drawBG(c,CW,CH);

// ground shadows
c.save(); c.globalAlpha=0.28; c.fillStyle=’#000’;
c.beginPath(); c.ellipse(p1.x,GY+64,30,5,0,0,Math.PI*2); c.fill();
c.beginPath(); c.ellipse(p2.x,GY+64,30,5,0,0,Math.PI*2); c.fill();
c.restore();

drawProj(c,gs.projs);

// P1
c.save(); c.translate(p1.x,p1.y);
drawDino(c,p1.cId,0,0,p1.facing,p1.action,gs.frame,hitF.p1>0);
if(p1.action===‘ko’) drawKO(c,0,0,gs.frame);
c.restore();

// P2
c.save(); c.translate(p2.x,p2.y);
drawDino(c,p2.cId,0,0,p2.facing,p2.action,gs.frame,hitF.p2>0);
if(p2.action===‘ko’) drawKO(c,0,0,gs.frame);
c.restore();

drawPops(c,pops);
c.restore();

refreshHUD();

// win check
if(p1.hp<=0||p2.hp<=0){
gs.over=true;
var wk=p1.hp<=0?‘p2’:‘p1’;
setTimeout(function(){ goResult(wk, wk===‘p1’?p1.cId:p2.cId); }, 600);
}
}

// ============================================================
//  RESULT SCREEN
// ============================================================
var resInterv=null;

function goResult(wk,cId){
if(raf){ cancelAnimationFrame(raf); raf=null; }
var ch=CH_DATA[cId];
var lbl=wk===‘p1’?‘JOGADOR 1’:(gameMode===‘2p’?‘JOGADOR 2’:‘CPU’);
show(‘resultScreen’);

var card=document.getElementById(‘rCard’);
card.style.border=’5px solid ’+ch.color;
card.style.boxShadow=’0 0 36px ’+ch.color+’88, 0 0 72px ’+ch.color+‘33’;

document.getElementById(‘rMast’).style.background=ch.color;

document.getElementById(‘rRole’).textContent=ch.role===‘villain’?’— VILAO VENCE —’:’— HEROI VENCE —’;
document.getElementById(‘rRole’).style.color=ch.color;

var nm=document.getElementById(‘rName’);
nm.textContent=lbl;
nm.style.background=‘linear-gradient(135deg,’+ch.lc+’,#fff,’+ch.accent+’)’;
nm.style.webkitBackgroundClip=‘text’;
nm.style.webkitTextFillColor=‘transparent’;
nm.style.filter=‘drop-shadow(0 0 10px ‘+ch.color+’)’;

var dy=document.getElementById(‘rDay’);
dy.style.background=‘linear-gradient(90deg,’+ch.color+’,’+ch.accent+’,’+ch.color+’)’;
dy.style.webkitBackgroundClip=‘text’;
dy.style.webkitTextFillColor=‘transparent’;

document.getElementById(‘rDN’).textContent=ch.name;
document.getElementById(‘rDN’).style.color=ch.lc;
document.getElementById(‘rDD’).textContent=ch.desc;

document.getElementById(‘rPlate’).style.background=ch.color+‘22’;
document.getElementById(‘rPlate’).style.border=’1px solid ’+ch.color+‘44’;

document.getElementById(‘btnAgain’).style.background=‘linear-gradient(135deg,’+ch.color+’,’+ch.accent+’)’;
document.getElementById(‘btnAgain’).style.boxShadow=’0 4px 0 rgba(0,0,0,0.5), 0 0 18px ’+ch.color;

// animate dino on result card
var rc=document.getElementById(‘rDinoCanvas’), rctx=rc.getContext(‘2d’), rf=0;
if(resInterv) clearInterval(resInterv);
resInterv=setInterval(function(){
rf++;
rctx.clearRect(0,0,120,100);
rctx.save(); rctx.translate(28,78);
drawDino(rctx,cId,0,0,1,‘idle’,rf,false);
rctx.restore();
},50);

// rotating beams background
var bc=document.getElementById(‘beams’);
bc.width=window.innerWidth; bc.height=window.innerHeight;
bc.style.width=‘100%’; bc.style.height=‘100%’;
var bctx=bc.getContext(‘2d’), bAng=0;
function beamLoop(){
bctx.clearRect(0,0,bc.width,bc.height);
bctx.save();
bctx.translate(bc.width/2, bc.height/2);
bctx.rotate(bAng*Math.PI/180);
for(var i=0;i<16;i++){
var a=i*(Math.PI*2/16);
var g=bctx.createLinearGradient(0,0,Math.cos(a)*800,Math.sin(a)*800);
g.addColorStop(0,ch.color+‘22’); g.addColorStop(0.5,ch.color+‘08’); g.addColorStop(1,‘transparent’);
bctx.fillStyle=g;
bctx.beginPath(); bctx.moveTo(0,0); bctx.arc(0,0,900,a-0.15,a+0.15); bctx.closePath(); bctx.fill();
}
bctx.restore();
bAng+=0.28;
if(!document.getElementById(‘resultScreen’).classList.contains(‘hidden’))
resultRaf=requestAnimationFrame(beamLoop);
}
requestAnimationFrame(beamLoop);
}

// ============================================================
//  KEYBOARD
// ============================================================
window.addEventListener(‘keydown’, function(e){ keys[e.code]=true; });
window.addEventListener(‘keyup’,   function(e){ keys[e.code]=false; });

// ============================================================
//  BUTTON WIRING
// ============================================================
document.getElementById(‘btn1p’).addEventListener(‘click’,    function(){ goSelect(‘1p’); });
document.getElementById(‘btn2p’).addEventListener(‘click’,    function(){ goSelect(‘2p’); });
document.getElementById(‘btnBack’).addEventListener(‘click’,  function(){ goTitle(); });
document.getElementById(‘btnFight’).addEventListener(‘click’, function(){ goFight(); });
document.getElementById(‘btnAgain’).addEventListener(‘click’, function(){
if(resInterv) clearInterval(resInterv);
goFight();
});
document.getElementById(‘btnNewChar’).addEventListener(‘click’, function(){
if(resInterv) clearInterval(resInterv);
goSelect(gameMode);
});
document.getElementById(‘btnHome’).addEventListener(‘click’, function(){
if(resInterv) clearInterval(resInterv);
goTitle();
});

// ============================================================
//  RESIZE
// ============================================================
window.addEventListener(‘resize’, function(){
if(gs&&!gs.over){
var cv=document.getElementById(‘gameCanvas’);
var fs=document.getElementById(‘fightScreen’);
cv.width=fs.clientWidth;
var used=
document.getElementById(‘hud’).offsetHeight +
document.getElementById(‘spbars’).offsetHeight +
document.getElementById(‘controls’).offsetHeight;
cv.height=Math.max(fs.clientHeight-used, 100);
}
});

// ============================================================
//  BOOT
// ============================================================
goTitle();