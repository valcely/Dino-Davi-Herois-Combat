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
  trex:  {id:'trex',  name:'T-Rex Davi',       role:'hero',    color:'#22c55e', accent:'#7c3aed', lc:'#4ade80', speed:2.6, str:2.0,  sp:'Tremor',    desc:'Velocidade EXTREMA e DEVASTADOR'   },
  raptor:{id:'raptor',name:'Velociraptor Tobby',role:'hero',   color:'#ef4444', accent:'#fbbf24', lc:'#fca5a5', speed:7.0, str:0.75, sp:'Investida', desc:'Velocidade EXTREMA'   },
  trice: {id:'trice', name:'Triceratops Vovó', role:'hero',    color:'#3b82f6', accent:'#ef4444', lc:'#93c5fd', speed:4.0, str:1.2,  sp:'Escudo',    desc:'EQUILIBRADO'          },
  ptero: {id:'ptero', name:'Pterodactilo Valentina', role:'hero',color:'#f59e0b', accent:'#dc2626', lc:'#fde68a', speed:4.4, str:1.3,  sp:'Laser',     desc:'Tecnologia JURASSICA' },
  spino: {id:'spino', name:'Spinossauro TitiaGio', role:'villain', color:'#7f1d1d', accent:'#6b21a8', lc:'#fca5a5', speed:3.2, str:1.8,  sp:'Acido',     desc:'Predador das Aguas',  ai:'aggressive'},
  anky:  {id:'anky',  name:'Anquilossauro Vovô', role:'villain', color:'#78350f', accent:'#065f46', lc:'#d97706', speed:2.0, str:1.6,  sp:'Clava',     desc:'Armadura Inquebravel',ai:'defensive' },
  para:  {id:'para',  name:'Parasaurolofus Papai', role:'villain', color:'#1e3a8a', accent:'#7c3aed', lc:'#93c5fd', speed:5.0, str:1.0,  sp:'Sonico',    desc:'Grito que Paralisa e TREMOR', ai:'ranged'    },
  carno: {id:'carno', name:'Carnotaurus Mamãe',  role:'villain', color:'#7c2d12', accent:'#ca8a04', lc:'#fb923c', speed:5.5, str:1.5,  sp:'Brutus',    desc:'Chifres Letais',      ai:'rushdown'  }
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

  var fpos=[0,160,340,520,700,860];
  for(var fi=0;fi<fpos.length;fi++){
    var bx=fpos[fi];
    for(var fj=-3;fj<=3;fj++){
      var ang=(fj/3)*0.7, fl=55+Math.abs(fj)*8;
      c.strokeStyle='rgba(20,80,25,0.82)'; c.lineWidth=3-Math.abs(fj)*0.3; c.lineCap='round';
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
        c.fillStyle='rgba(18,'+(70+fk*8)+',20,0.7)';
        c.beginPath();
        c.ellipse(flx+Math.cos(ang+1.2)*(8-fk), fly+Math.sin(ang+1.2)*(4-fk), 6+fk, 2.5, ang+1.2, 0, Math.PI*2);
        c.fill();
      }
    }
  }

  for(var sci=0;sci<3;sci++){
    var sx=[155,420,670][sci], sy=GY+22;
    c.save(); c.globalAlpha=0.75; c.translate(sx,sy);
    c.fillStyle='#f1f5f9'; c.fillRect(-9,-50,18,30);
    c.fillStyle='#fde68a'; c.beginPath(); c.arc(0,-58,10,0,Math.PI*2); c.fill();
    c.fillStyle='#92400e'; c.beginPath(); c.ellipse(0,-65,9,5,0,0,Math.PI*2); c.fill();
    c.fillStyle='#94a3b8'; c.fillRect(-7,-22,6,22); c.fillRect(1,-22,6,22);
    c.fillStyle='#e2e8f0'; c.fillRect(6,-50,11,14);
    c.strokeStyle='#94a3b8'; c.lineWidth=1.5;
    c.beginPath(); c.moveTo(8,-47); c.lineTo(15,-47); c.stroke();
    c.beginPath(); c.moveTo(8,-44); c.lineTo(15,-44); c.stroke();
    c.fillStyle='#1a1a1a';
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

function _trex(c,atk,ko,leg,tail){
  c.strokeStyle='#1a5c28'; c.lineWidth=14; c.lineCap='round';
  c.save(); c.translate(-30,0); c.rotate(tail*0.04);
  c.beginPath(); c.moveTo(30,-5); c.quadraticCurveTo(-10,8,-28,20); c.stroke();
  c.restore();
  var bg=c.createRadialGradient(8,-15,2,8,-15,38);
  bg.addColorStop(0,'#3a9e55'); bg.addColorStop(1,'#1a5c28');
  c.fillStyle=bg; c.beginPath(); c.ellipse(5,-18,28,26,0,0,Math.PI*2); c.fill();
  var bel=c.createRadialGradient(2,-12,1,2,-12,18);
  bel.addColorStop(0,'#c8f0d4'); bel.addColorStop(1,'#7ecf96');
  c.fillStyle=bel; c.globalAlpha=0.5; c.beginPath(); c.ellipse(2,-12,16,14,0.1,0,Math.PI*2); c.fill(); c.globalAlpha=1;
  c.fillStyle='#166534';
  for(var i=0;i<5;i++){ c.beginPath(); c.arc(-4+i*8,-40+i,4-i*0.4,0,Math.PI*2); c.fill(); }
  var sh=c.createLinearGradient(0,-4,0,12); sh.addColorStop(0,'#7c3aed'); sh.addColorStop(1,'#581c87');
  c.fillStyle=sh; c.beginPath(); c.rect(-18,-4,46,16); c.fill();
  c.strokeStyle='#a855f7'; c.lineWidth=1.5; c.strokeRect(-18,-4,46,16);
  c.fillStyle='#c084fc'; c.fillRect(-5,-2,10,8);
  for(var ls=-1;ls<=1;ls+=2){
    c.save(); c.translate(ls<0?-12:14,10); c.rotate(ls*leg*0.022);
    c.fillStyle=ls<0?'#1a5c28':'#1f6b30'; c.fillRect(-6,0,14,22);
    c.strokeStyle='#0f3d1b'; c.lineWidth=3; c.lineCap='round';
    c.beginPath(); c.moveTo(-6,22); c.lineTo(-11,28); c.stroke();
    c.beginPath(); c.moveTo(2,22);  c.lineTo(2,29);   c.stroke();
    c.beginPath(); c.moveTo(8,22);  c.lineTo(14,27);  c.stroke();
    c.restore();
  }
  c.strokeStyle='#2d7a3a'; c.lineWidth=18; c.lineCap='round';
  c.beginPath(); c.moveTo(18,-20); c.quadraticCurveTo(30,-40,38,-52); c.stroke
