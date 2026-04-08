/* ============================================================
DAVI DINO HERÓIS — script.js
Versão 2.0 — Sons Web Audio API, 13 personagens, 3 modos
============================================================ */

// ============================================================
//  WEB AUDIO API — Sons sintetizados 8-bit
// ============================================================
var AudioCtx = window.AudioContext || window.webkitAudioContext;
var audioCtx = null;

function getAudio() {
if (!audioCtx) {
try { audioCtx = new AudioCtx(); } catch(e) { return null; }
}
if (audioCtx.state === ‘suspended’) audioCtx.resume();
return audioCtx;
}

function playSound(type) {
var ctx = getAudio(); if (!ctx) return;
var now = ctx.currentTime;
var osc = ctx.createOscillator();
var gain = ctx.createGain();
osc.connect(gain); gain.connect(ctx.destination);

switch(type) {
case ‘hit’:
osc.type = ‘square’;
osc.frequency.setValueAtTime(320, now);
osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
gain.gain.setValueAtTime(0.28, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
osc.start(now); osc.stop(now + 0.14);
break;
case ‘bigHit’:
osc.type = ‘sawtooth’;
osc.frequency.setValueAtTime(600, now);
osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
gain.gain.setValueAtTime(0.4, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
osc.start(now); osc.stop(now + 0.25);
// ruído extra
var osc2 = ctx.createOscillator(); var g2 = ctx.createGain();
osc2.connect(g2); g2.connect(ctx.destination);
osc2.type = ‘square’; osc2.frequency.setValueAtTime(180, now);
g2.gain.setValueAtTime(0.2, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
osc2.start(now); osc2.stop(now + 0.18);
break;
case ‘jump’:
osc.type = ‘square’;
osc.frequency.setValueAtTime(220, now);
osc.frequency.exponentialRampToValueAtTime(550, now + 0.18);
gain.gain.setValueAtTime(0.18, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
osc.start(now); osc.stop(now + 0.2);
break;
case ‘special’:
osc.type = ‘square’;
osc.frequency.setValueAtTime(130, now);
osc.frequency.setValueAtTime(260, now + 0.05);
osc.frequency.setValueAtTime(520, now + 0.1);
osc.frequency.setValueAtTime(1040, now + 0.15);
gain.gain.setValueAtTime(0.25, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
osc.start(now); osc.stop(now + 0.3);
break;
case ‘win’:
[523, 659, 784, 1047].forEach(function(freq, i) {
var o = ctx.createOscillator(); var g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘square’; o.frequency.value = freq;
var t0 = now + i * 0.12;
g.gain.setValueAtTime(0.22, t0);
g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
o.start(t0); o.stop(t0 + 0.22);
});
return;
case ‘select’:
osc.type = ‘square’;
osc.frequency.setValueAtTime(440, now);
osc.frequency.setValueAtTime(660, now + 0.06);
gain.gain.setValueAtTime(0.14, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
osc.start(now); osc.stop(now + 0.12);
break;
case ‘memFlip’:
osc.type = ‘sine’;
osc.frequency.setValueAtTime(880, now);
gain.gain.setValueAtTime(0.1, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
osc.start(now); osc.stop(now + 0.08);
break;
case ‘memMatch’:
[660, 880].forEach(function(freq, i) {
var o = ctx.createOscillator(); var g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘square’; o.frequency.value = freq;
var t0 = now + i * 0.09;
g.gain.setValueAtTime(0.15, t0);
g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
o.start(t0); o.stop(t0 + 0.12);
});
return;
case ‘memWrong’:
osc.type = ‘sawtooth’;
osc.frequency.setValueAtTime(180, now);
osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);
gain.gain.setValueAtTime(0.15, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
osc.start(now); osc.stop(now + 0.16);
break;
case ‘paintStroke’:
osc.type = ‘sine’;
osc.frequency.setValueAtTime(330 + Math.random()*80, now);
gain.gain.setValueAtTime(0.05, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
osc.start(now); osc.stop(now + 0.06);
break;
case ‘ko’:
[300, 250, 200, 150, 100].forEach(function(freq, i) {
var o = ctx.createOscillator(); var g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘sawtooth’; o.frequency.value = freq;
var t0 = now + i * 0.06;
g.gain.setValueAtTime(0.3, t0);
g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);
o.start(t0); o.stop(t0 + 0.09);
});
return;
case ‘projectile’:
osc.type = ‘square’;
osc.frequency.setValueAtTime(700, now);
osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
gain.gain.setValueAtTime(0.12, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
osc.start(now); osc.stop(now + 0.12);
break;
default:
osc.type = ‘square’; osc.frequency.value = 440;
gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
osc.start(now); osc.stop(now + 0.1);
}
}

// ============================================================
//  PERSONAGENS — 8 Heróis + 5 Vilões
// ============================================================
var CHARS = {
/* ── HERÓIS ── */
daviHeroi: {
name:‘DAVI HERÓI’, role:‘hero’, emoji:‘🦕’,
color:’#00e676’, accent:’#ffd740’, lc:’#69f0ae’,
speed:6.2, str:1.1, sp:‘Raio’, sp2:‘Chute’,
desc:‘O herói principal!’,
bodyColor:’#00695c’, markColor:’#ffd740’, letter:‘D’,
kawaii: true
},
aranha: {
name:‘HOMEM-ARANHA’, role:‘hero’, emoji:‘🕷️’,
color:’#e53935’, accent:’#1565c0’, lc:’#ef9a9a’,
speed:7.0, str:1.2, sp:‘Teia’, sp2:‘Chutar’,
desc:‘Amigão da vizinhança!’,
bodyColor:’#b71c1c’, markColor:’#1565c0’, letter:‘A’,
kawaii: true, spiderMan: true
},
mamae: {
name:‘MAMÃE DINO’, role:‘hero’, emoji:‘🌸’,
color:’#f48fb1’, accent:’#fce4ec’, lc:’#fce4ec’,
speed:4.8, str:1.3, sp:‘Coração’, sp2:‘Abraço’,
desc:‘Força de mãe!’,
bodyColor:’#c2185b’, markColor:’#fce4ec’, letter:‘M’,
kawaii: true, pink: true
},
papai: {
name:‘PAPAI DINO’, role:‘hero’, emoji:‘💪’,
color:’#42a5f5’, accent:’#ff5252’, lc:’#bbdefb’,
speed:4.0, str:1.6, sp:‘Super’, sp2:‘Soco’,
desc:‘Guardião da família!’,
bodyColor:’#1565c0’, markColor:’#ff5252’, letter:‘P’,
kawaii: true
},
vovo: {
name:‘VOVÔ DINO’, role:‘hero’, emoji:‘🦴’,
color:’#ff8a65’, accent:’#ffd740’, lc:’#ffab91’,
speed:3.4, str:1.8, sp:‘Rugido’, sp2:‘Bengala’,
desc:‘Força de vovô!’,
bodyColor:’#bf360c’, markColor:’#ffd740’, letter:‘V’,
kawaii: true
},
vova: {
name:‘VOVÓ DINO’, role:‘hero’, emoji:‘💜’,
color:’#ce93d8’, accent:’#fff9c4’, lc:’#e1bee7’,
speed:4.2, str:1.2, sp:‘Carinho’, sp2:‘Cabeçada’,
desc:‘Amorosa e forte!’,
bodyColor:’#6a1b9a’, markColor:’#fff9c4’, letter:‘G’,
kawaii: true, bow: true
},
tiaTina: {
name:‘TIA TINA’, role:‘hero’, emoji:‘✨’,
color:’#ba68c8’, accent:’#f3e5f5’, lc:’#e1bee7’,
speed:5.4, str:1.0, sp:‘Magia’, sp2:‘Empurrão’,
desc:‘Mágica e alegre!’,
bodyColor:’#6a1b9a’, markColor:’#f3e5f5’, letter:‘T’,
kawaii: true, bow: true
},
tiaGio: {
name:‘TIA GIO’, role:‘hero’, emoji:‘❄️’,
color:’#80cbc4’, accent:’#e0f2f1’, lc:’#b2dfdb’,
speed:5.0, str:1.1, sp:‘Gelo’, sp2:‘Chutar’,
desc:‘Fresca e rápida!’,
bodyColor:’#00695c’, markColor:’#e0f2f1’, letter:‘G’,
kawaii: true
},
/* ── VILÕES ── */
dinoBravo: {
name:‘DINO BRAVO’, role:‘villain’, emoji:‘🔥’,
color:’#f44336’, accent:’#ff6f00’, lc:’#ffcdd2’,
speed:5.8, str:1.7, sp:‘Fogo’, sp2:‘Mordida’,
desc:‘Vilão feroz!’,
bodyColor:’#b71c1c’, markColor:’#ff6f00’, letter:‘B’,
ai:‘aggressive’
},
dinoSombra: {
name:‘DINO SOMBRA’, role:‘villain’, emoji:‘🌑’,
color:’#9c27b0’, accent:’#e040fb’, lc:’#e1bee7’,
speed:5.2, str:1.5, sp:‘Sombra’, sp2:‘Garras’,
desc:‘Das trevas!’,
bodyColor:’#4a148c’, markColor:’#e040fb’, letter:‘S’,
ai:‘ranged’
},
dinoRex: {
name:‘DINO-REX’, role:‘villain’, emoji:‘👑’,
color:’#ff6f00’, accent:’#ffd740’, lc:’#ffe0b2’,
speed:4.0, str:2.2, sp:‘Tremor’, sp2:‘Pisão’,
desc:‘O Rei dos Vilões!’,
bodyColor:’#e65100’, markColor:’#ffd740’, letter:‘R’,
ai:‘aggressive’, king: true
},
dinoVeneno: {
name:‘DINO VENENO’, role:‘villain’, emoji:‘☠️’,
color:’#76ff03’, accent:’#1b5e20’, lc:’#ccff90’,
speed:6.5, str:1.4, sp:‘Veneno’, sp2:‘Cuspir’,
desc:‘Venenoso e ágil!’,
bodyColor:’#33691e’, markColor:’#76ff03’, letter:‘V’,
ai:‘ranged’, poison: true
},
dinoGelo: {
name:‘DINO GELO’, role:‘villain’, emoji:‘🧊’,
color:’#80deea’, accent:’#006064’, lc:’#e0f7fa’,
speed:4.5, str:1.6, sp:‘Congelar’, sp2:‘Rastejar’,
desc:‘Congela tudo!’,
bodyColor:’#006064’, markColor:’#80deea’, letter:‘G’,
ai:‘normal’, icy: true
},
dinoGigante: {
name:‘DINO GIGANTE’, role:‘villain’, emoji:‘🦴’,
color:’#8d6e63’, accent:’#ffd740’, lc:’#d7ccc8’,
speed:2.6, str:2.8, sp:‘Terremoto’, sp2:‘Esmagar’,
desc:‘Grandão e brutal!’,
bodyColor:’#4e342e’, markColor:’#ffd740’, letter:‘X’,
ai:‘aggressive’, giant: true
}
};

var HERO_IDS    = [‘daviHeroi’,‘aranha’,‘mamae’,‘papai’,‘vovo’,‘vova’,‘tiaTina’,‘tiaGio’];
var VILLAIN_IDS = [‘dinoBravo’,‘dinoSombra’,‘dinoRex’,‘dinoVeneno’,‘dinoGelo’,‘dinoGigante’];
var ALL_IDS     = HERO_IDS.concat(VILLAIN_IDS);

// ============================================================
//  MULTIPLICADORES DE FORÇA (balanceamento)
// ============================================================
var HERO_MULT   = 600;   // heróis 600x mais poderosos
var VILLAIN_MULT = 400;  // vilões 400x mais poderosos
// Na prática, como ambos os lados são multiplicados,
// o balanço de jogo é mantido mas os ataques são “épicos”
// HP_MAX e dano são mostrados em escala visual; internamente usamos HP% normalizado

// ============================================================
//  UTILITÁRIOS DE COR
// ============================================================
function hexShift(hex, d) {
if (!hex || hex[0] !== ‘#’) return hex;
var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
r = Math.min(255,Math.max(0,r+d)); g = Math.min(255,Math.max(0,g+d)); b = Math.min(255,Math.max(0,b+d));
return ‘#’+[r,g,b].map(function(v){return(‘0’+v.toString(16)).slice(-2);}).join(’’);
}

// ============================================================
//  DESENHO DO OLHO KAWAII
// ============================================================
function drawKawaiiEye(ctx, ex, ey, r, pupilColor) {
pupilColor = pupilColor || ‘#1a1a2e’;
// branco do olho
ctx.fillStyle = ‘#fff’;
ctx.beginPath(); ctx.ellipse(ex, ey, r, r*1.1, 0, 0, Math.PI*2); ctx.fill();
// pupila grande e fofa
ctx.fillStyle = pupilColor;
ctx.beginPath(); ctx.ellipse(ex, ey+r*0.1, r*0.65, r*0.7, 0, 0, Math.PI*2); ctx.fill();
// brilho principal
ctx.fillStyle = ‘rgba(255,255,255,0.95)’;
ctx.beginPath(); ctx.ellipse(ex - r*0.28, ey - r*0.22, r*0.28, r*0.28, -0.3, 0, Math.PI*2); ctx.fill();
// brilho secundário pequeno
ctx.fillStyle = ‘rgba(255,255,255,0.7)’;
ctx.beginPath(); ctx.ellipse(ex + r*0.2, ey + r*0.15, r*0.13, r*0.13, 0, 0, Math.PI*2); ctx.fill();
}

// ============================================================
//  ESTRELA 5 PONTAS
// ============================================================
function starPath5(ctx, cx, cy, r) {
ctx.beginPath();
for (var i = 0; i < 5; i++) {
var a = i*Math.PI*2/5 - Math.PI/2, ia = a + Math.PI/5;
ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
ctx.lineTo(cx + Math.cos(ia)*r*0.42, cy + Math.sin(ia)*r*0.42);
}
ctx.closePath();
}

// ============================================================
//  DESENHO KAWAII PRINCIPAL
// ============================================================
function drawDino(ctx, id, x, y, facing, action, frame, isHit, scale) {
scale = scale || 1;
var ch = CHARS[id]; if (!ch) return;
ctx.save();
ctx.translate(x, y); ctx.scale(scale, scale);
if (facing === -1) ctx.scale(-1, 1);
if (action === ‘ko’) ctx.rotate(0.42);

var bob = action === ‘idle’ ? Math.sin(frame*0.09)*2.5 : 0;
ctx.translate(0, bob);

var atk  = action === ‘attack’;
var atk2 = action === ‘attack2’;
var ko   = action === ‘ko’;
var walk = action === ‘walk’ || action === ‘jump’;
var leg  = (walk || atk || atk2) ? Math.sin(frame*0.24)*14 : 0;
var tail = walk ? Math.sin(frame*0.19)*5 : 0;

var bc = ch.bodyColor || ch.color;
var mc = ch.markColor || ch.accent;

if (ch.spiderMan) {
_drawSpiderMan(ctx, ch, atk, atk2, ko, leg, tail, frame, id);
} else {
_drawKawaiiDino(ctx, ch, bc, mc, atk, atk2, ko, leg, tail, frame, id);
}

if (isHit) {
ctx.globalAlpha = 0.42;
ctx.fillStyle = ‘rgba(255,60,60,0.5)’;
ctx.fillRect(-50, -102, 100, 102);
ctx.globalAlpha = 1;
}
ctx.restore();
}

// ── Homem-Aranha Kawaii ──
function _drawSpiderMan(ctx, ch, atk, atk2, ko, leg, tail, frame, id) {
var bc = ‘#b71c1c’, mc = ‘#1565c0’;

// Sombra
ctx.fillStyle = ‘rgba(0,0,0,0.2)’;
ctx.beginPath(); ctx.ellipse(0,4,26,6,0,0,Math.PI*2); ctx.fill();

// Pernas
for (var ls = -1; ls <= 1; ls += 2) {
ctx.save(); ctx.translate(ls<0?-10:10, 8);
ctx.rotate(ls*leg*0.022);
ctx.fillStyle = bc;
ctx.beginPath(); ctx.ellipse(0,6,7,10,ls*0.15,0,Math.PI*2); ctx.fill();
// bota azul
ctx.fillStyle = mc;
ctx.strokeStyle = mc; ctx.lineWidth = 7; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(0,14); ctx.lineTo(ls*3,26); ctx.lineTo(ls*7,32); ctx.stroke();
ctx.restore();
}

// Corpo redondo kawaii
var bodyG = ctx.createRadialGradient(-4,-12,2,-4,-12,28);
bodyG.addColorStop(0, ‘#e53935’); bodyG.addColorStop(1, bc);
ctx.fillStyle = bodyG;
ctx.beginPath(); ctx.ellipse(0,-14,24,22,0,0,Math.PI*2); ctx.fill();

// Logo aranha no peito
ctx.fillStyle = mc;
ctx.font = ‘bold 15px Arial Black, sans-serif’;
ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.fillText(‘⚡’, 0, -14);

// Braço
var armY = atk ? -18 : -10, armX = atk ? 22 : 15;
ctx.strokeStyle = bc; ctx.lineWidth = 7; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(14,-18); ctx.lineTo(armX, armY); ctx.stroke();
if (atk) {
// teia saindo
ctx.strokeStyle = ‘rgba(255,255,255,0.9)’; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(armX, armY); ctx.lineTo(armX+20, armY-15); ctx.stroke();
ctx.beginPath(); ctx.moveTo(armX+10, armY-8); ctx.lineTo(armX+22, armY-4); ctx.stroke();
}
if (atk2) {
// chutar
ctx.strokeStyle = mc; ctx.lineWidth = 7;
ctx.beginPath(); ctx.moveTo(-10,8); ctx.lineTo(-28,-10); ctx.stroke();
}

// Pescoço
ctx.strokeStyle = bc; ctx.lineWidth = 14; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(8,-22); ctx.quadraticCurveTo(14,-34,20,-42); ctx.stroke();

// Cabeça grande kawaii
var hg = ctx.createRadialGradient(20,-54,2,20,-54,18);
hg.addColorStop(0, ‘#ef5350’); hg.addColorStop(1, bc);
ctx.fillStyle = hg;
ctx.beginPath(); ctx.ellipse(20,-54,17,15,0,0,Math.PI*2); ctx.fill();

// Olhinhos kawaii (lentes brancas)
ctx.fillStyle = ‘rgba(255,255,255,0.92)’;
ctx.beginPath(); ctx.ellipse(13,-54,7,6,0.3,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(27,-54,7,6,-0.3,0,Math.PI*2); ctx.fill();
ctx.fillStyle = mc;
ctx.beginPath(); ctx.ellipse(13,-54,4.5,4,0.3,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(27,-54,4.5,4,-0.3,0,Math.PI*2); ctx.fill();
// brilho
ctx.fillStyle = ‘rgba(255,255,255,0.8)’;
ctx.beginPath(); ctx.arc(10,-57,2,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(24,-57,2,0,Math.PI*2); ctx.fill();

// Linhas de teia na máscara
ctx.strokeStyle = mc; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
for (var wi = 0; wi < 4; wi++) {
var wa = wi * Math.PI/4 - Math.PI/2;
ctx.beginPath(); ctx.moveTo(20,-54); ctx.lineTo(20+Math.cos(wa)*17, -54+Math.sin(wa)*15); ctx.stroke();
}
ctx.globalAlpha = 1;

if (ko) _drawKO(ctx, frame);
}

// ── Dino Kawaii Genérico ──
function _drawKawaiiDino(ctx, ch, bc, mc, atk, atk2, ko, leg, tail, frame, id) {
// Sombra
ctx.fillStyle = ‘rgba(0,0,0,0.2)’;
ctx.beginPath(); ctx.ellipse(0,4,26,6,0,0,Math.PI*2); ctx.fill();

// Rabo
ctx.save();
ctx.strokeStyle = bc; ctx.lineWidth = 12; ctx.lineCap = ‘round’;
ctx.translate(-20,0); ctx.rotate(tail*0.055);
ctx.beginPath(); ctx.moveTo(20,-2); ctx.quadraticCurveTo(-8,7,-19,18); ctx.stroke();
ctx.lineWidth = 5; ctx.strokeStyle = mc; ctx.globalAlpha = 0.35;
ctx.beginPath(); ctx.moveTo(20,-2); ctx.quadraticCurveTo(-8,7,-19,18); ctx.stroke();
ctx.globalAlpha = 1; ctx.restore();

// Pernas
for (var ls = -1; ls <= 1; ls += 2) {
ctx.save(); ctx.translate(ls<0?-11:11, 9);
ctx.rotate(ls*leg*0.024);
ctx.fillStyle = bc;
ctx.beginPath(); ctx.ellipse(0,6,7,10,ls*0.18,0,Math.PI*2); ctx.fill();
ctx.strokeStyle = bc; ctx.lineWidth = 7; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(0,14); ctx.lineTo(ls*3,26); ctx.lineTo(ls*7,32); ctx.stroke();
// garrinhas
ctx.strokeStyle = hexShift(mc,-30); ctx.lineWidth = 2.5;
ctx.beginPath(); ctx.moveTo(ls*7,32); ctx.lineTo(ls*11,30); ctx.stroke();
ctx.beginPath(); ctx.moveTo(ls*7,32); ctx.lineTo(ls*7,36); ctx.stroke();
ctx.restore();
}

// Corpo redondo kawaii (mais gorducho)
var bodyG = ctx.createRadialGradient(-3,-13,3,-3,-13,27);
bodyG.addColorStop(0, hexShift(bc,35)); bodyG.addColorStop(1, bc);
ctx.fillStyle = bodyG;
ctx.beginPath(); ctx.ellipse(0,-14,25,23,0,0,Math.PI*2); ctx.fill();

// Barriga mais clara
ctx.fillStyle = ‘rgba(255,255,255,0.14)’;
ctx.beginPath(); ctx.ellipse(-1,-11,15,14,0.1,0,Math.PI*2); ctx.fill();

// Espinhos dorsais arredondados (kawaii)
ctx.fillStyle = mc;
for (var di = 0; di < 4; di++) {
var dx = -8 + di*5.5, dy = -34 - di*2;
ctx.beginPath(); ctx.ellipse(dx, dy+3, 3.5, 5, 0, 0, Math.PI*2); ctx.fill();
}

// Letra kawaii no peito com fundo
ctx.fillStyle = mc; ctx.globalAlpha = 0.9;
ctx.font = ‘bold 13px Fredoka One, Arial Black, sans-serif’;
ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.fillText(ch.letter || ‘?’, 0, -14);
ctx.globalAlpha = 1;

// Manchas kawaii
ctx.fillStyle = ‘rgba(0,0,0,0.12)’;
for (var si = 0; si < 5; si++) {
ctx.beginPath(); ctx.arc(-10+si*5.5, -22+Math.sin(si)*2, 2.5, 0, Math.PI*2); ctx.fill();
}

// Braço
var armY = atk ? -18 : -9, armX = atk ? 20 : 14;
ctx.strokeStyle = bc; ctx.lineWidth = 7; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(14,-18); ctx.lineTo(armX, armY); ctx.stroke();
if (atk) {
ctx.strokeStyle = mc; ctx.lineWidth = 2.5;
ctx.beginPath(); ctx.moveTo(armX, armY); ctx.lineTo(armX+5, armY-4); ctx.stroke();
ctx.beginPath(); ctx.moveTo(armX, armY); ctx.lineTo(armX+6, armY); ctx.stroke();
ctx.beginPath(); ctx.moveTo(armX, armY); ctx.lineTo(armX+4, armY+4); ctx.stroke();
}
if (atk2) {
// chute / cabeçada
ctx.strokeStyle = mc; ctx.lineWidth = 7; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(-10, 8); ctx.lineTo(-26,-8); ctx.stroke();
}

// Pescoço
ctx.strokeStyle = bc; ctx.lineWidth = 14; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(9,-22); ctx.quadraticCurveTo(15,-34,21,-42); ctx.stroke();
ctx.strokeStyle = hexShift(bc,20); ctx.lineWidth = 5; ctx.globalAlpha = 0.3;
ctx.beginPath(); ctx.moveTo(9,-22); ctx.quadraticCurveTo(15,-34,21,-42); ctx.stroke();
ctx.globalAlpha = 1;

// Cabeça redonda GRANDE kawaii
var hg = ctx.createRadialGradient(19,-53,2,19,-53,17);
hg.addColorStop(0, hexShift(bc,30)); hg.addColorStop(1, bc);
ctx.fillStyle = hg;
ctx.beginPath(); ctx.ellipse(20,-53,17,15,0,0,Math.PI*2); ctx.fill();

// Bochechas fofinhas
ctx.fillStyle = ‘rgba(255,180,180,0.35)’;
ctx.beginPath(); ctx.ellipse(9,-53,6,4,0,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(31,-53,6,4,0,0,Math.PI*2); ctx.fill();

// Acessórios especiais por personagem
_drawCharAccessory(ctx, ch, id, frame, bc, mc);

// Olhos kawaii
if (id !== ‘dinoSombra’ && id !== ‘dinoBravo’ && id !== ‘dinoVeneno’) {
drawKawaiiEye(ctx, 13,-53, 6, ch.bodyColor || ‘#1a1a2e’);
drawKawaiiEye(ctx, 27,-53, 6, ch.bodyColor || ‘#1a1a2e’);
} else if (id === ‘dinoSombra’) {
ctx.fillStyle = ‘#e040fb’; ctx.globalAlpha = 0.92;
ctx.beginPath(); ctx.ellipse(13,-53,6,5,0,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(27,-53,6,5,0,0,Math.PI*2); ctx.fill();
ctx.globalAlpha = 1;
ctx.fillStyle=‘rgba(255,255,255,0.8)’;
ctx.beginPath(); ctx.arc(10,-56,2,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(24,-56,2,0,Math.PI*2); ctx.fill();
} else if (id === ‘dinoBravo’) {
ctx.fillStyle = ‘#ff6f00’; ctx.globalAlpha = 0.95;
ctx.beginPath(); ctx.ellipse(13,-53,6,5,0,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(27,-53,6,5,0,0,Math.PI*2); ctx.fill();
ctx.globalAlpha = 1;
ctx.fillStyle=’#fff’;
ctx.beginPath(); ctx.arc(10,-56,2,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(24,-56,2,0,Math.PI*2); ctx.fill();
} else {
ctx.fillStyle = ‘#76ff03’; ctx.globalAlpha = 0.9;
ctx.beginPath(); ctx.ellipse(13,-53,5,5,0,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(27,-53,5,5,0,0,Math.PI*2); ctx.fill();
ctx.globalAlpha = 1;
}

// Narizinho kawaii
ctx.fillStyle = hexShift(bc,-25);
ctx.beginPath(); ctx.ellipse(20,-48,3.5,2.5,0,0,Math.PI*2); ctx.fill();

// Sorriso fofo
ctx.strokeStyle = hexShift(bc,-30); ctx.lineWidth = 2.5; ctx.lineCap = ‘round’;
if (atk || atk2) {
ctx.beginPath(); ctx.arc(20,-45,5,-0.2,Math.PI+0.2); ctx.stroke();
} else {
ctx.beginPath(); ctx.arc(20,-46,4,0.1,Math.PI-0.1); ctx.stroke();
}

// Dentes no ataque
if (atk || atk2) {
ctx.fillStyle = ‘#f5f5e8’;
for (var ti = 0; ti < 3; ti++) {
ctx.beginPath(); ctx.rect(13+ti*4.5,-45,3.5,4); ctx.fill();
}
}

if (ko) _drawKO(ctx, frame);
}

// ── Acessórios por personagem ──
function _drawCharAccessory(ctx, ch, id, frame, bc, mc) {
if (id === ‘vova’ || id === ‘tiaTina’) {
// Laçinho kawaii
ctx.fillStyle = mc;
ctx.beginPath(); ctx.ellipse(11,-68,7,5,-0.4,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(23,-68,7,5,0.4,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(17,-68,4,0,Math.PI*2); ctx.fill();
} else if (id === ‘mamae’) {
// Coroa de coração
ctx.fillStyle = ‘#f48fb1’;
ctx.font = ‘12px Arial’; ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.fillText(‘♥’, 17, -70);
ctx.fillText(‘♥’, 26, -72);
ctx.fillText(‘♥’, 20, -75);
} else if (id === ‘tiaGio’) {
// Flocos de neve
ctx.fillStyle = ‘rgba(224,242,241,0.9)’;
ctx.font = ‘10px Arial’; ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.fillText(‘❄’, 20, -70);
} else if (id === ‘vovo’) {
// Chapéu
ctx.fillStyle = bc;
ctx.beginPath(); ctx.ellipse(20,-68,15,5,0,0,Math.PI*2); ctx.fill();
ctx.fillStyle = hexShift(bc,-20);
ctx.fillRect(12,-78,17,12);
ctx.fillStyle = mc; ctx.fillRect(11,-70,19,3);
} else if (id === ‘papai’) {
// Capa de herói
ctx.save();
ctx.strokeStyle = mc; ctx.lineWidth = 3; ctx.globalAlpha = 0.7;
ctx.beginPath(); ctx.moveTo(-10,-30); ctx.quadraticCurveTo(-25,0,-12,18); ctx.stroke();
ctx.globalAlpha = 1; ctx.restore();
} else if (id === ‘dinoBravo’) {
// Chifres
ctx.fillStyle = ‘#ff6f00’;
ctx.beginPath(); ctx.moveTo(10,-66); ctx.lineTo(7,-78); ctx.lineTo(15,-68); ctx.closePath(); ctx.fill();
ctx.beginPath(); ctx.moveTo(30,-65); ctx.lineTo(34,-77); ctx.lineTo(25,-67); ctx.closePath(); ctx.fill();
} else if (id === ‘dinoRex’) {
// Coroa de rei
ctx.fillStyle = ‘#ffd740’;
ctx.beginPath(); ctx.moveTo(8,-66); ctx.lineTo(20,-80); ctx.lineTo(32,-66);
ctx.lineTo(30,-66); ctx.lineTo(20,-76); ctx.lineTo(10,-66); ctx.closePath(); ctx.fill();
ctx.fillStyle = ‘#e53935’;
ctx.beginPath(); ctx.arc(20,-80,3.5,0,Math.PI*2); ctx.fill();
} else if (id === ‘dinoVeneno’) {
// Bolhas de veneno
ctx.fillStyle = ‘rgba(118,255,3,0.7)’;
ctx.beginPath(); ctx.arc(10,-66,3.5,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(20,-70,4,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(30,-66,3,0,Math.PI*2); ctx.fill();
} else if (id === ‘dinoGelo’) {
// Cristais de gelo
ctx.fillStyle = ‘rgba(128,222,234,0.9)’;
ctx.beginPath(); ctx.moveTo(20,-68); ctx.lineTo(16,-78); ctx.lineTo(20,-75); ctx.lineTo(24,-78); ctx.closePath(); ctx.fill();
} else if (id === ‘dinoGigante’) {
// Osso na cabeça
ctx.font = ‘12px Arial’; ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.fillStyle = ‘#d7ccc8’;
ctx.fillText(‘🦴’, 20, -70);
}
}

function _drawKO(ctx, frame) {
ctx.fillStyle = ‘white’; ctx.strokeStyle = ‘#ffd740’; ctx.lineWidth = 2;
ctx.beginPath(); ctx.rect(-20,-72,40,19); ctx.fill(); ctx.stroke();
ctx.fillStyle = ‘#1a1a1a’; ctx.font = ‘11px Arial’; ctx.textAlign = ‘center’;
ctx.fillText(‘x_x’, 0, -58);
for (var ki = 0; ki < 4; ki++) {
var ka = (frame*5 + ki*90) * Math.PI / 180;
ctx.fillStyle = [’#ffd740’,’#e5e7eb’,’#f9fafb’,’#fde68a’][ki];
ctx.font = ‘13px Arial’;
ctx.fillText([’*’,’+’,’*’,’.’][ki], Math.cos(ka)*24, -82+Math.sin(ka)*8);
}
}

// ============================================================
//  FUNDO JURÁSSICO
// ============================================================
function drawFightBG(ctx, W, H, GY) {
var sky = ctx.createLinearGradient(0,0,0,H*0.65);
sky.addColorStop(0,’#06101a’); sky.addColorStop(0.5,’#0a1c28’); sky.addColorStop(1,’#0e2c3a’);
ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

// Raios de luz
ctx.save();
for (var i = 0; i < 4; i++) {
var g = ctx.createLinearGradient(W*0.7,0,W*0.3,H*0.7);
g.addColorStop(0,‘rgba(255,215,64,0.04)’); g.addColorStop(1,‘rgba(255,215,64,0)’);
ctx.fillStyle = g;
ctx.beginPath(); ctx.moveTo(W*0.72+i*16,0); ctx.lineTo(W*0.28+i*20,H);
ctx.lineTo(W*0.24+i*20,H); ctx.lineTo(W*0.68+i*16,0); ctx.fill();
}
ctx.restore();

// Montanhas
ctx.fillStyle = ‘#091520’;
ctx.beginPath(); ctx.moveTo(0,H*0.55);
var mxs = [60,140,185,215,270,310,360,420,480,530,580,640,690,750,800,860];
for (var mi = 0; mi < mxs.length; mi++) ctx.lineTo(mxs[mi], H*(mi%2===0?0.28:0.44));
ctx.lineTo(W,H*0.55); ctx.lineTo(0,H*0.55); ctx.closePath(); ctx.fill();

// Colinas
ctx.fillStyle = ‘#0c2518’;
ctx.beginPath(); ctx.moveTo(0,H*0.66);
var cxs = [0,50,95,140,190,240,290,350,420,490,550,620,680,740,800,860];
for (var ci = 0; ci < cxs.length; ci++) ctx.lineTo(cxs[ci], H*(ci%2===0?0.50:0.63));
ctx.lineTo(W,H*0.68); ctx.lineTo(0,H*0.68); ctx.closePath(); ctx.fill();

// Chão
var gnd = ctx.createLinearGradient(0,GY+60,0,H);
gnd.addColorStop(0,’#173d08’); gnd.addColorStop(0.3,’#102c06’); gnd.addColorStop(1,’#091a04’);
ctx.fillStyle = gnd; ctx.fillRect(0,GY+60,W,H-GY-60);
ctx.strokeStyle = ‘rgba(80,200,60,0.25)’; ctx.lineWidth = 3;
ctx.beginPath(); ctx.moveTo(0,GY+62); ctx.lineTo(W,GY+62); ctx.stroke();
ctx.strokeStyle = ‘rgba(60,140,40,0.12)’; ctx.lineWidth = 2;
for (var si = 0; si < 18; si++) {
ctx.beginPath(); ctx.moveTo(si*52,GY+64); ctx.lineTo(si*52+26,GY+64); ctx.stroke();
}

// Árvores
for (var ti = 0; ti < 9; ti++) {
var tx = [25,115,210,310,420,520,620,720,830][ti];
var th = 100 + (ti%3)*38;
ctx.fillStyle = ti%2===0?’#0a1e0d’:’#0c2612’;
ctx.fillRect(tx-4, GY+48-th, 8, th);
for (var tj = 0; tj < 3; tj++) {
ctx.fillStyle = ‘rgba(’+(10+tj*4)+’,’+(40+tj*10)+’,’+(12+tj*4)+’,0.92)’;
ctx.beginPath(); ctx.ellipse(tx, GY+48-th+tj*18, 28+tj*6, 20+tj*4, 0, 0, Math.PI*2); ctx.fill();
}
}

// Ervas
var fpos = [0,170,340,520,700,860];
for (var fi = 0; fi < fpos.length; fi++) {
var bx = fpos[fi];
for (var fj = -3; fj <= 3; fj++) {
var ang = (fj/3)*0.65, fl = 52 + Math.abs(fj)*7;
ctx.strokeStyle = ‘rgba(22,85,28,0.85)’; ctx.lineWidth = 3-Math.abs(fj)*0.25; ctx.lineCap = ‘round’;
ctx.beginPath(); ctx.moveTo(bx, GY+62);
ctx.quadraticCurveTo(bx+Math.sin(ang)*fl*0.5, GY+62-Math.cos(ang)*fl*0.5, bx+Math.sin(ang)*fl, GY+62-Math.cos(ang)*fl);
ctx.stroke();
}
}
}

// ============================================================
//  PROJÉTEIS
// ============================================================
function drawProjs(ctx, projs) {
for (var i = 0; i < projs.length; i++) {
var pr = projs[i]; ctx.save();
if (pr.type === ‘web’) {
ctx.strokeStyle = ‘rgba(200,220,255,0.9)’; ctx.lineWidth = 2.5;
ctx.beginPath(); ctx.arc(pr.x, pr.y, 11, 0, Math.PI*2); ctx.stroke();
for (var wi = 0; wi < 6; wi++) {
var wa = wi*Math.PI/3;
ctx.beginPath(); ctx.moveTo(pr.x,pr.y); ctx.lineTo(pr.x+Math.cos(wa)*15, pr.y+Math.sin(wa)*15); ctx.stroke();
}
} else if (pr.type === ‘heart’) {
ctx.font = ‘22px Arial’; ctx.textAlign = ‘center’; ctx.textBaseline = ‘middle’;
ctx.globalAlpha = 0.92;
ctx.fillText(‘💗’, pr.x, pr.y);
} else if (pr.type === ‘fire’) {
var fg = ctx.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,17);
fg.addColorStop(0,‘rgba(255,200,0,0.95)’); fg.addColorStop(0.5,‘rgba(255,100,0,0.7)’); fg.addColorStop(1,‘rgba(255,50,0,0)’);
ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(pr.x,pr.y,17,0,Math.PI*2); ctx.fill();
} else if (pr.type === ‘lightning’) {
ctx.strokeStyle = ‘rgba(255,215,64,0.95)’; ctx.lineWidth = 3.5; ctx.lineCap = ‘round’;
ctx.shadowColor = ‘#ffd740’; ctx.shadowBlur = 10;
ctx.beginPath(); ctx.moveTo(pr.x, pr.y);
ctx.lineTo(pr.x + pr.vx*0.25 + (Math.random()-0.5)*8, pr.y - 8);
ctx.lineTo(pr.x + pr.vx*0.5  + (Math.random()-0.5)*8, pr.y - 16);
ctx.stroke(); ctx.shadowBlur = 0;
} else if (pr.type === ‘super’) {
var sg = ctx.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,15);
sg.addColorStop(0,‘rgba(66,165,245,0.95)’); sg.addColorStop(1,‘rgba(66,165,245,0)’);
ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(pr.x,pr.y,15,0,Math.PI*2); ctx.fill();
ctx.fillStyle = ‘rgba(255,82,82,0.85)’;
starPath5(ctx, pr.x, pr.y, 10); ctx.fill();
} else if (pr.type === ‘shockwave’) {
ctx.strokeStyle = ‘rgba(0,230,118,0.8)’; ctx.lineWidth = 4;
ctx.beginPath(); ctx.ellipse(pr.x, pr.y+10, pr.r, pr.r*0.3, 0, 0, Math.PI*2);
ctx.globalAlpha = 1 - pr.prog; ctx.stroke(); ctx.globalAlpha = 1;
} else if (pr.type === ‘dark’) {
var dg = ctx.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,16);
dg.addColorStop(0,‘rgba(224,64,251,0.92)’); dg.addColorStop(1,‘rgba(224,64,251,0)’);
ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(pr.x,pr.y,16,0,Math.PI*2); ctx.fill();
} else if (pr.type === ‘ice’) {
ctx.fillStyle = ‘rgba(128,222,234,0.9)’;
ctx.save(); ctx.translate(pr.x,pr.y); ctx.rotate(pr.spin||0);
starPath5(ctx,0,0,13); ctx.fill(); ctx.restore();
} else if (pr.type === ‘poison’) {
ctx.fillStyle = ‘rgba(118,255,3,0.88)’;
ctx.beginPath(); ctx.arc(pr.x,pr.y,12,0,Math.PI*2); ctx.fill();
ctx.fillStyle = ‘rgba(50,200,0,0.5)’;
ctx.beginPath(); ctx.arc(pr.x+5,pr.y-4,6,0,Math.PI*2); ctx.fill();
} else if (pr.type === ‘quake’) {
ctx.strokeStyle = ‘rgba(141,110,99,0.8)’; ctx.lineWidth = 4;
ctx.beginPath(); ctx.ellipse(pr.x, pr.y+10, pr.r, pr.r*0.25, 0, 0, Math.PI*2);
ctx.globalAlpha = 1 - pr.prog; ctx.stroke(); ctx.globalAlpha = 1;
} else if (pr.type === ‘magic’) {
ctx.fillStyle = ‘rgba(186,104,200,0.9)’;
ctx.save(); ctx.translate(pr.x,pr.y); ctx.rotate(pr.spin||0);
starPath5(ctx,0,0,11); ctx.fill(); ctx.restore();
ctx.fillStyle = ‘rgba(255,255,255,0.6)’;
ctx.font = ‘14px Arial’; ctx.textAlign = ‘center’; ctx.fillText(‘✦’,pr.x,pr.y+6);
} else if (pr.type === ‘ice_hero’) {
ctx.fillStyle = ‘rgba(128,203,196,0.88)’;
ctx.save(); ctx.translate(pr.x,pr.y); ctx.rotate(pr.spin||0);
ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(8,0); ctx.lineTo(0,12); ctx.lineTo(-8,0); ctx.closePath(); ctx.fill();
ctx.restore();
} else if (pr.type === ‘roar’) {
ctx.strokeStyle = ‘rgba(255,138,101,0.8)’; ctx.lineWidth = 3.5;
ctx.beginPath(); ctx.arc(pr.x,pr.y,pr.r,0,Math.PI*2);
ctx.globalAlpha = Math.max(0, 0.8-pr.r*0.013); ctx.stroke(); ctx.globalAlpha = 1;
}
ctx.restore();
}
}

// ============================================================
//  POP-UPS HQ
// ============================================================
var HQ_LIST = [
{w:‘POW!’,  c:’#fef08a’,b:’#7c3aed’},{w:‘BAM!’,  c:’#fff’,   b:’#dc2626’},
{w:‘ZAP!’,  c:’#fef08a’,b:’#0369a1’},{w:‘CRACK!’,c:’#fff’,   b:’#9333ea’},
{w:‘WHAM!’, c:’#fde68a’,b:’#15803d’},{w:‘SMASH!’,c:’#fef9c3’,b:’#b91c1c’},
{w:‘BOOM!’, c:’#fff’,   b:’#b45309’},{w:‘BANG!’, c:’#fef08a’,b:’#0e7490’},
{w:‘KA-POW!’,c:’#fff’, b:’#6d28d9’},{w:‘ZOING!’,c:’#fef08a’,b:’#0f766e’}
];

function drawPops(ctx, pops) {
for (var i = 0; i < pops.length; i++) {
var p = pops[i], h = p.hq, alpha = Math.min(1, p.life/14);
ctx.save(); ctx.globalAlpha = alpha;
ctx.translate(p.x, p.y); ctx.rotate(p.rot);
var fs = p.big ? 26 : 19;
ctx.font = ’900 ’+fs+‘px Fredoka One, Arial Black, sans-serif’;
var tw = ctx.measureText(h.w).width, pd = 7;
ctx.fillStyle = h.b; ctx.beginPath(); ctx.rect(-tw/2-pd,-fs,tw+pd*2,fs+pd); ctx.fill();
ctx.strokeStyle = h.c; ctx.lineWidth = 2; ctx.stroke();
ctx.fillStyle = h.c; ctx.textAlign = ‘center’; ctx.textBaseline = ‘alphabetic’;
ctx.fillText(h.w, 0, 0);
ctx.restore();
}
}

// ============================================================
//  ESTRELAS DE FUNDO
// ============================================================
(function() {
var sc = document.getElementById(‘starCanvas’);
var sctx = sc.getContext(‘2d’);
var stars = [];
function resize() { sc.width = window.innerWidth; sc.height = window.innerHeight; }
resize(); window.addEventListener(‘resize’, resize);
for (var i = 0; i < 160; i++) {
stars.push({x:Math.random(), y:Math.random(), r:Math.random()*1.6+0.3, sp:Math.random()*3+1, t:Math.random()*Math.PI*2});
}
function animStars() {
sctx.clearRect(0,0,sc.width,sc.height);
for (var i = 0; i < stars.length; i++) {
var s = stars[i]; s.t += 0.02;
var a = 0.18 + Math.abs(Math.sin(s.t*s.sp))*0.82;
sctx.fillStyle = ‘rgba(255,255,255,’+a+’)’;
sctx.beginPath(); sctx.arc(s.x*sc.width, s.y*sc.height, s.r, 0, Math.PI*2); sctx.fill();
}
requestAnimationFrame(animStars);
}
animStars();
})();

// ============================================================
//  RELÓGIO
// ============================================================
function updateClock() {
var now = new Date();
var h = String(now.getHours()).padStart(2,‘0’);
var m = String(now.getMinutes()).padStart(2,‘0’);
var s = String(now.getSeconds()).padStart(2,‘0’);
var el = document.getElementById(‘clockEl’);
if (el) el.textContent = h+’:’+m+’:’+s;
var days = [‘Dom’,‘Seg’,‘Ter’,‘Qua’,‘Qui’,‘Sex’,‘Sáb’];
var months = [‘Jan’,‘Fev’,‘Mar’,‘Abr’,‘Mai’,‘Jun’,‘Jul’,‘Ago’,‘Set’,‘Out’,‘Nov’,‘Dez’];
var de = document.getElementById(‘dateEl’);
if (de) de.textContent = days[now.getDay()]+’, ‘+now.getDate()+’ ‘+months[now.getMonth()]+’ ’+now.getFullYear();
}
updateClock(); setInterval(updateClock, 1000);

// ============================================================
//  NAVEGAÇÃO
// ============================================================
var SCREENS = [‘homeScreen’,‘selectScreen’,‘fightScreen’,‘resultScreen’,‘memoryScreen’,‘paintScreen’];
function showScreen(id) {
SCREENS.forEach(function(s) {
var el = document.getElementById(s);
if (s === id) el.classList.remove(‘hidden’);
else el.classList.add(‘hidden’);
});
}

function gotoHome()   { stopFight(); showScreen(‘homeScreen’); startHomeAnim(); }
function gotoSelect() { playSound(‘select’); showScreen(‘selectScreen’); buildCharGrid(); updateVsPreview(); }
function gotoMemory() { playSound(‘select’); showScreen(‘memoryScreen’); initMemory(); }
function gotoPaint()  { playSound(‘select’); showScreen(‘paintScreen’); initPaint(); }

// ============================================================
//  HOME PREVIEW
// ============================================================
var homeAnimRaf = null;
function startHomeAnim() {
if (homeAnimRaf) cancelAnimationFrame(homeAnimRaf);
var pc = document.getElementById(‘homePreview’);
if (!pc) return;
var ctx = pc.getContext(‘2d’);
var ids = [‘daviHeroi’,‘aranha’,‘mamae’,‘papai’];
var xs  = [42,130,230,330];
function loop() {
ctx.clearRect(0,0,400,110);
var fr = Math.round(Date.now()/80) % 200;
for (var i = 0; i < 4; i++) {
ctx.save(); ctx.translate(xs[i], 90);
drawDino(ctx, ids[i], 0, 0, 1, ‘idle’, fr+i*12, false);
ctx.restore();
}
homeAnimRaf = requestAnimationFrame(loop);
}
loop();
}
startHomeAnim();

// ============================================================
//  SELEÇÃO
// ============================================================
var selMode = ‘1p’, selP1 = ‘daviHeroi’, selP2 = ‘dinoBravo’;

function setMode(m) {
playSound(‘select’);
selMode = m;
document.getElementById(‘tab1p’).classList.toggle(‘active’, m===‘1p’);
document.getElementById(‘tab2p’).classList.toggle(‘active’, m===‘2p’);
if (m === ‘2p’ && VILLAIN_IDS.indexOf(selP2) < 0) selP2 = ‘mamae’;
buildCharGrid(); updateVsPreview();
}

function buildCharGrid() {
var grid = document.getElementById(‘charGrid’); grid.innerHTML = ‘’;
ALL_IDS.forEach(function(id) {
var ch = CHARS[id];
var isP1 = selP1 === id, isP2 = selP2 === id;
var cls = ‘char-card’ + (ch.role===‘villain’?’ villain-card’:’’) + (isP1?’ p1sel’:’’) + (isP2?’ p2sel’:’’);
var card = document.createElement(‘div’); card.className = cls;

```
var badge = document.createElement('div');
badge.className = 'card-role ' + (ch.role==='villain'?'role-villain':'role-hero');
badge.textContent = ch.role==='villain'?'VILÃO':'HERÓI'; card.appendChild(badge);

var circle = document.createElement('div'); circle.className = 'dino-circle';
circle.style.background = 'radial-gradient(circle at 35% 35%,'+ch.bodyColor+'44,'+ch.bodyColor+'22),radial-gradient(circle,#0a1a0a,#020a02)';
if (isP1 || isP2) circle.style.borderColor = ch.color;

var cv = document.createElement('canvas'); cv.width = 80; cv.height = 74;
(function(ctx2, iid) {
  setTimeout(function() {
    ctx2.clearRect(0,0,80,74);
    ctx2.save(); ctx2.translate(28, 62);
    drawDino(ctx2, iid, 0, 0, 1, 'idle', 20, false);
    ctx2.restore();
  }, 0);
})(cv.getContext('2d'), id);
circle.appendChild(cv); card.appendChild(circle);

var nm = document.createElement('div'); nm.className = 'card-name';
nm.textContent = ch.name; nm.style.color = ch.lc; card.appendChild(nm);

var em = document.createElement('div'); em.style.fontSize = '14px'; em.textContent = ch.emoji; card.appendChild(em);

if (isP1 || isP2) {
  var lbl = document.createElement('div'); lbl.className = 'player-lbl';
  if (isP1&&isP2){lbl.textContent='P1&P2';lbl.style.background='#9c27b0';}
  else if (isP1){lbl.textContent='P1';lbl.style.background='#00695c';}
  else{lbl.textContent=selMode==='2p'?'P2':'CPU';lbl.style.background='#0277bd';}
  card.appendChild(lbl);
}

card.addEventListener('click', function() { pickChar(id); });
card.addEventListener('touchstart', function(e) { e.preventDefault(); pickChar(id); }, {passive:false});
grid.appendChild(card);
```

});
}

var pickTurn = 0;
function pickChar(id) {
playSound(‘select’);
if (selMode === ‘1p’) {
selP1 = id;
if (VILLAIN_IDS.indexOf(selP2) < 0 || selP2 === id) selP2 = id===VILLAIN_IDS[0]?VILLAIN_IDS[1]:VILLAIN_IDS[0];
} else {
if (pickTurn%2===0) selP1 = id;
else selP2 = id;
pickTurn++;
}
buildCharGrid(); updateVsPreview();
}

function updateVsPreview() {
var c1 = document.getElementById(‘vsC1’), c2 = document.getElementById(‘vsC2’);
if (c1) { var x1 = c1.getContext(‘2d’); x1.clearRect(0,0,80,72); x1.save(); x1.translate(28,60); drawDino(x1,selP1,0,0,1,‘idle’,20,false); x1.restore(); }
if (c2) { var x2 = c2.getContext(‘2d’); x2.clearRect(0,0,80,72); x2.save(); x2.translate(28,60); drawDino(x2,selP2,0,0,-1,‘idle’,20,false); x2.restore(); }
var n1 = document.getElementById(‘vsN1’), n2 = document.getElementById(‘vsN2’);
if (n1) { n1.textContent = ’P1 – ‘+CHARS[selP1].name; n1.style.color = CHARS[selP1].lc; }
if (n2) { n2.textContent = (selMode===‘2p’?‘P2’:‘CPU’)+’ – ’+CHARS[selP2].name; n2.style.color = CHARS[selP2].lc; }
}

// ============================================================
//  BATALHA — Configuração
// ============================================================
var CW = 860, CH = 420, GY = 330;
var GRAV = 0.72, JUMP_V = -17;
var HP_MAX = 100, HIT_DMG = 8, SP_DMG = 22, SP_CD = 4500;
var ATK_DUR = 360, STUN_DUR = 400, PROJ_SPD = 11, AI_TICK = 340;

var gs = null, pops = [], hitF = {p1:0,p2:0};
var raf = null, resultRaf = null, resInterv = null;
var keys = {};
var p1In = {l:0,r:0,u:0}, p2In = {l:0,r:0,u:0};
var p1Pr = {atk:0,atk2:0,sp:0,up:0}, p2Pr = {atk:0,atk2:0,sp:0,up:0};

function addPop(x, y, big, custom) {
var h = custom || HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x,y:y,hq:h,big:big,rot:(Math.random()-0.5)*26,life:60});
if (big) {
var h2 = HQ_LIST[Math.floor(Math.random()*HQ_LIST.length)];
pops.push({x:x-44,y:y+18,hq:h2,big:false,rot:-14,life:44});
}
}

function applyHit(atk, def, dmg, big, hk) {
if (def.stun || def.hp <= 0) return;
def.hp = Math.max(0, def.hp - dmg);
def.stun = true; def.stunT = STUN_DUR; def.action = ‘hit’; hitF[hk] = 8;
playSound(big ? ‘bigHit’ : ‘hit’);
addPop((atk.x+def.x)/2, def.y-55, big);
}

function trigAtk(atk, def, hk) {
if (atk.atking || atk.atk2ing || atk.stun || atk.hp <= 0) return;
var ch = CHARS[atk.cId];
var mult = ch.role===‘hero’ ? HERO_MULT : VILLAIN_MULT;
atk.atking = true; atk.atkT = ATK_DUR; atk.action = ‘attack’;
if (Math.abs(atk.x - def.x) < ch.speed*16+32 && !def.stun && def.hp > 0) {
applyHit(atk, def, HIT_DMG * ch.str * mult * 0.001, false, hk); // normalizado
}
}

function trigAtk2(atk, def, hk) {
if (atk.atking || atk.atk2ing || atk.stun || atk.hp <= 0) return;
var ch = CHARS[atk.cId];
var mult = ch.role===‘hero’ ? HERO_MULT : VILLAIN_MULT;
atk.atk2ing = true; atk.atk2T = ATK_DUR*0.8; atk.action = ‘attack2’;
if (Math.abs(atk.x - def.x) < ch.speed*14+28 && !def.stun && def.hp > 0) {
applyHit(atk, def, HIT_DMG * ch.str * mult * 0.0008, false, hk);
}
}

function trigSp(user, opp, hk) {
if (user.spCD > 0 || user.stun || user.hp <= 0) return;
var ch = CHARS[user.cId];
var mult = ch.role===‘hero’ ? HERO_MULT : VILLAIN_MULT;
user.spCD = SP_CD; user.action = ‘special’;
playSound(‘special’);
var id = user.cId;
var ptype = ‘lightning’;

if (id === ‘aranha’)       ptype = ‘web’;
else if (id === ‘mamae’)   ptype = ‘heart’;
else if (id === ‘papai’)   ptype = ‘super’;
else if (id === ‘vovo’)    ptype = ‘roar’;
else if (id === ‘vova’)    ptype = ‘magic’;
else if (id === ‘tiaTina’) ptype = ‘magic’;
else if (id === ‘tiaGio’)  ptype = ‘ice_hero’;
else if (id === ‘daviHeroi’) ptype = ‘lightning’;
else if (id === ‘dinoBravo’) ptype = ‘fire’;
else if (id === ‘dinoSombra’) ptype = ‘dark’;
else if (id === ‘dinoRex’)   ptype = ‘quake’;
else if (id === ‘dinoVeneno’) ptype = ‘poison’;
else if (id === ‘dinoGelo’)  ptype = ‘ice’;
else if (id === ‘dinoGigante’) ptype = ‘quake’;

if (ptype === ‘shockwave’ || ptype === ‘quake’ || ptype === ‘roar’) {
gs.projs.push({type:ptype,x:user.x,y:GY,r:8,maxR:ptype===‘roar’?140:130,prog:0,owner:user,hk:hk,hit:false,spMult:mult});
} else {
gs.projs.push({type:ptype,x:user.x+user.facing*26,y:user.y-38,vx:user.facing*PROJ_SPD*(ptype===‘fire’?1.6:1.2),spin:0,owner:user,hk:hk,hit:false,spMult:mult});
}
addPop(user.x, user.y-80, true, {w:ch.sp+’!’, c:’#fef08a’, b:ch.color});
}

// ============================================================
//  IA DO VILÃO
// ============================================================
function runAI(ai, pl) {
if (ai.stun || ai.hp <= 0) return;
gs.aiT -= 16; if (gs.aiT > 0) return;
gs.aiT = AI_TICK + Math.random()*240;
var ch = CHARS[ai.cId], dist = Math.abs(ai.x - pl.x), style = ch.ai || ‘normal’;
ai.facing = pl.x > ai.x ? 1 : -1;

if (style === ‘aggressive’) {
ai.vx = ai.facing * ch.speed * (Math.random()<0.88 ? 1 : 0.45);
if (ai.onGnd && Math.random()<0.12) { ai.vy = JUMP_V; ai.onGnd = false; }
if (dist < 115 && !ai.atking && Math.random()<0.7) trigAtk(ai,pl,‘p1’);
if (dist < 90  && !ai.atk2ing && Math.random()<0.4) trigAtk2(ai,pl,‘p1’);
if (ai.spCD <= 0 && Math.random()<0.35) trigSp(ai,pl,‘p1’);
} else if (style === ‘ranged’) {
var ideal = 175;
if (dist < ideal-30) ai.vx = -ai.facing*ch.speed*0.6;
else if (dist > ideal+30) ai.vx = ai.facing*ch.speed;
else ai.vx = 0;
if (dist < 130 && !ai.atking && Math.random()<0.3) trigAtk(ai,pl,‘p1’);
if (ai.spCD <= 0 && Math.random()<0.42) trigSp(ai,pl,‘p1’);
} else {
if (dist > 100) ai.vx = ai.facing*ch.speed*(Math.random()<0.82?1:0);
else if (dist < 50) ai.vx = -ai.facing*ch.speed*0.5;
else ai.vx = 0;
if (ai.onGnd && Math.random()<0.09) { ai.vy = JUMP_V; ai.onGnd = false; }
if (dist < 108 && !ai.atking && Math.random()<0.55) trigAtk(ai,pl,‘p1’);
if (dist < 90  && !ai.atk2ing && Math.random()<0.3) trigAtk2(ai,pl,‘p1’);
if (ai.spCD <= 0 && Math.random()<0.28) trigSp(ai,pl,‘p1’);
}
}

// ============================================================
//  BATALHA — HUD e Controles
// ============================================================
function buildHUD() {
var ch1 = CHARS[gs.p1.cId], ch2 = CHARS[gs.p2.cId];
document.getElementById(‘hudL’).innerHTML =
‘<div class="hpname" style="color:'+ch1.lc+'">’+ch1.name+’</div>’+
‘<div class="hpbg"><div class="hpfill" id="hf1" style="width:100%;background:#00e676"></div></div>’+
‘<div class="hpval" id="hv1">HP 100</div>’;
document.getElementById(‘hudR’).innerHTML =
‘<div class="hpname r" style="color:'+ch2.lc+'">’+ch2.name+’</div>’+
‘<div class="hpbg"><div class="hpfill" id="hf2" style="width:100%;background:#00e676;margin-left:auto"></div></div>’+
‘<div class="hpval r" id="hv2">HP 100</div>’;
document.getElementById(‘sp1’).innerHTML =
‘<span class="splbl" style="color:'+ch1.lc+'">’+ch1.sp+’</span>’+
‘<div class="sptr"><div class="spfill" id="sf1" style="width:0%;background:'+ch1.color+'"></div></div>’;
document.getElementById(‘sp2’).innerHTML =
‘<span class="splbl" style="color:'+ch2.lc+'">’+ch2.sp+’</span>’+
‘<div class="sptr"><div class="spfill" id="sf2" style="width:0%;background:'+ch2.color+'"></div></div>’;
}

function refreshHUD() {
if (!gs) return;
var p1 = gs.p1, p2 = gs.p2;
var col = function(p) { return p>0.5?’#00e676’:p>0.25?’#ffd740’:’#ff5252’; };
var pct1 = Math.max(0,p1.hp)/HP_MAX, pct2 = Math.max(0,p2.hp)/HP_MAX;
var f1 = document.getElementById(‘hf1’); if(f1){f1.style.width=(pct1*100)+’%’;f1.style.background=col(pct1);}
var f2 = document.getElementById(‘hf2’); if(f2){f2.style.width=(pct2*100)+’%’;f2.style.background=col(pct2);}
var v1 = document.getElementById(‘hv1’); if(v1) v1.textContent = ‘HP ‘+Math.max(0,Math.round(p1.hp));
var v2 = document.getElementById(‘hv2’); if(v2) v2.textContent = ‘HP ‘+Math.max(0,Math.round(p2.hp));
var sf1 = document.getElementById(‘sf1’); if(sf1) sf1.style.width = Math.max(0,100-(p1.spCD/SP_CD)*100)+’%’;
var sf2 = document.getElementById(‘sf2’); if(sf2) sf2.style.width = Math.max(0,100-(p2.spCD/SP_CD)*100)+’%’;
}

function buildCtrl() {
document.getElementById(‘ctrlL’).innerHTML = ‘’;
document.getElementById(‘ctrlR’).innerHTML = ‘’;
document.getElementById(‘ctrlMid’).innerHTML = selMode===‘2p’
? ‘<span style="color:var(--green);font-size:7px">P1</span><br>vs<br><span style="color:var(--blue);font-size:7px">P2</span>’
: ‘<span style="color:var(--red);font-size:8px">AI</span>’;

addCtrl(‘ctrlL’, CHARS[gs.p1.cId],
function(){p1Pr.atk=1;}, function(){p1Pr.atk2=1;}, function(){p1Pr.sp=1;}, function(){p1Pr.up=1;},
function(v){p1In.l=v.l;p1In.r=v.r;if(v.u&&!p1In.u)p1Pr.up=1;p1In.u=v.u;}
);
if (selMode === ‘2p’) {
addCtrl(‘ctrlR’, CHARS[gs.p2.cId],
function(){p2Pr.atk=1;}, function(){p2Pr.atk2=1;}, function(){p2Pr.sp=1;}, function(){p2Pr.up=1;},
function(v){p2In.l=v.l;p2In.r=v.r;if(v.u&&!p2In.u)p2Pr.up=1;p2In.u=v.u;}
);
}
}

function addCtrl(cId, ch, onAtk, onAtk2, onSp, onJump, onJoy) {
var cont = document.getElementById(cId);
var jd = document.createElement(‘div’); jd.className = ‘joystick’;
var th = document.createElement(‘div’); th.className = ‘joystick-thumb’;
jd.appendChild(th); cont.appendChild(jd);

var jOn=false, jId=null, jBX=0, jBY=0, MX=34;
jd.addEventListener(‘touchstart’, function(e){e.preventDefault();var t=e.changedTouches[0];var r=jd.getBoundingClientRect();jOn=true;jId=t.identifier;jBX=r.left+r.width/2;jBY=r.top+r.height/2;},{passive:false});
jd.addEventListener(‘touchmove’, function(e){e.preventDefault();if(!jOn)return;var t=null;for(var i=0;i<e.changedTouches.length;i++)if(e.changedTouches[i].identifier===jId){t=e.changedTouches[i];break;}if(!t)return;var dx=t.clientX-jBX,dy=t.clientY-jBY,dist=Math.sqrt(dx*dx+dy*dy);var cx=dist>MX?dx/dist*MX:dx,cy=dist>MX?dy/dist*MX:dy;th.style.left=’calc(50% + ’+cx+‘px - 16px)’;th.style.top=‘calc(50% + ‘+cy+‘px - 16px)’;th.style.transition=‘none’;onJoy({l:cx/MX<-0.28,r:cx/MX>0.28,u:cy/MX<-0.45});},{passive:false});
var jEnd=function(e){e.preventDefault();jOn=false;th.style.left=‘calc(50% - 16px)’;th.style.top=‘calc(50% - 16px)’;th.style.transition=’.08s’;onJoy({l:false,r:false,u:false});};
jd.addEventListener(‘touchend’,jEnd,{passive:false}); jd.addEventListener(‘touchcancel’,jEnd,{passive:false});

var bd = document.createElement(‘div’); bd.className = ‘actbtns’;
function mkBtn(cls, bg, bc, html, fn) {
var b = document.createElement(‘button’); b.className = ‘actbtn ‘+cls;
b.style.background = bg; b.style.border = ‘2px solid ‘+bc; b.style.boxShadow = ‘0 0 10px ‘+bc+‘55’;
b.innerHTML = html;
b.addEventListener(‘touchstart’,function(e){e.preventDefault();fn();},{passive:false});
b.addEventListener(‘mousedown’,function(e){e.preventDefault();fn();});
return b;
}
bd.appendChild(mkBtn(‘btnJ’,‘radial-gradient(circle at 35% 35%,rgba(132,204,22,.8),rgba(132,204,22,.5))’,’#84cc16’,’<span style="font-size:14px">↑</span><div class="btnlbl">PULAR</div>’,onJump));
bd.appendChild(mkBtn(‘btnA’,‘radial-gradient(circle at 35% 35%,rgba(249,115,22,.8),rgba(249,115,22,.5))’,’#f97316’,’<span style="font-size:12px">ATK</span><div class="btnlbl">’+ch.sp+’</div>’,onAtk));
bd.appendChild(mkBtn(‘btnA2’,‘radial-gradient(circle at 35% 35%,rgba(255,210,0,.7),rgba(255,180,0,.4))’,’#ffd740’,’<span style="font-size:11px">ATK2</span><div class="btnlbl">’+ch.sp2+’</div>’,onAtk2));
bd.appendChild(mkBtn(‘btnS’,‘radial-gradient(circle at 35% 35%,’+ch.color+‘99,’+ch.color+‘55)’,ch.color,’<span style="font-size:10px">SP</span><div class="btnlbl">ESPECIAL</div>’,onSp));
cont.appendChild(bd);
}

// ============================================================
//  STOP FIGHT
// ============================================================
function stopFight() {
if (raf) { cancelAnimationFrame(raf); raf = null; }
if (resultRaf) { cancelAnimationFrame(resultRaf); resultRaf = null; }
if (resInterv) { clearInterval(resInterv); resInterv = null; }
gs = null;
}

// ============================================================
//  INICIAR BATALHA
// ============================================================
function startFight() {
stopFight();
showScreen(‘fightScreen’);
var fs = document.getElementById(‘fightScreen’);
var cv = document.getElementById(‘gameCanvas’);
var hud = document.getElementById(‘fightHUD’);
var spb = document.getElementById(‘spBars’);
var ctrl = document.getElementById(‘touchCtrl’);

cv.width  = fs.clientWidth  || window.innerWidth;
var usedH = (hud.offsetHeight||44) + (spb.offsetHeight||16) + (ctrl.offsetHeight||100);
cv.height = Math.max(fs.clientHeight - usedH, 120);

gs = {
p1: {cId:selP1, x:130, y:GY, vy:0, vx:0, hp:HP_MAX, facing:1,  action:‘idle’, atking:false,atkT:0,atk2ing:false,atk2T:0, stun:false,stunT:0, spCD:SP_CD, onGnd:true},
p2: {cId:selP2, x:CW-160, y:GY, vy:0, vx:0, hp:HP_MAX, facing:-1, action:‘idle’, atking:false,atkT:0,atk2ing:false,atk2T:0, stun:false,stunT:0, spCD:SP_CD, onGnd:true},
projs:[], frame:0, over:false, aiT:0
};
pops = []; hitF = {p1:0,p2:0};
p1In = {l:0,r:0,u:0}; p2In = {l:0,r:0,u:0};
p1Pr = {atk:0,atk2:0,sp:0,up:0}; p2Pr = {atk:0,atk2:0,sp:0,up:0};
buildHUD(); buildCtrl();
raf = requestAnimationFrame(fightLoop);
}

// ============================================================
//  LOOP DE LUTA
// ============================================================
function fightLoop() {
if (!gs || gs.over) return;
raf = requestAnimationFrame(fightLoop);
gs.frame++;
var DT = 16, p1 = gs.p1, p2 = gs.p2;

function tick(p) {
if (p.atkT>0)  { p.atkT-=DT;  if(p.atkT<=0)  p.atking=false; }
if (p.atk2T>0) { p.atk2T-=DT; if(p.atk2T<=0) p.atk2ing=false; }
if (p.stunT>0) { p.stunT-=DT; if(p.stunT<=0)  { p.stun=false; p.action=‘idle’; } }
if (p.spCD>0)  p.spCD -= DT;
}
tick(p1); tick(p2);
if (hitF.p1>0) hitF.p1–;
if (hitF.p2>0) hitF.p2–;

// P1 input
if (!p1.stun && p1.hp>0) {
var gl = p1In.l || keys[‘KeyA’], gr = p1In.r || keys[‘KeyD’];
if (gl)      { p1.vx = -CHARS[p1.cId].speed; p1.facing = -1; }
else if (gr) { p1.vx =  CHARS[p1.cId].speed; p1.facing =  1; }
else         p1.vx *= 0.72;
if ((p1Pr.up||keys[‘Space’]) && p1.onGnd) { p1.vy=JUMP_V; p1.onGnd=false; playSound(‘jump’); }
if (p1Pr.atk||keys[‘KeyF’])  trigAtk(p1,p2,‘p2’);
if (p1Pr.atk2||keys[‘KeyG’]) trigAtk2(p1,p2,‘p2’);
if (p1Pr.sp||keys[‘KeyE’])   trigSp(p1,p2,‘p2’);
} else p1.vx *= 0.5;
p1Pr.atk=0; p1Pr.atk2=0; p1Pr.sp=0; p1Pr.up=0;

// P2 / AI
if (selMode === ‘2p’) {
if (!p2.stun && p2.hp>0) {
var gl2 = p2In.l||keys[‘ArrowLeft’], gr2 = p2In.r||keys[‘ArrowRight’];
if (gl2)      { p2.vx = -CHARS[p2.cId].speed; p2.facing = -1; }
else if (gr2) { p2.vx =  CHARS[p2.cId].speed; p2.facing =  1; }
else          p2.vx *= 0.72;
if ((p2Pr.up||keys[‘ArrowUp’]) && p2.onGnd) { p2.vy=JUMP_V; p2.onGnd=false; playSound(‘jump’); }
if (p2Pr.atk||keys[‘KeyK’])  trigAtk(p2,p1,‘p1’);
if (p2Pr.atk2||keys[‘KeyJ’]) trigAtk2(p2,p1,‘p1’);
if (p2Pr.sp||keys[‘KeyL’])   trigSp(p2,p1,‘p1’);
} else p2.vx *= 0.5;
p2Pr.atk=0; p2Pr.atk2=0; p2Pr.sp=0; p2Pr.up=0;
} else {
runAI(p2, p1);
}

// Física
function physics(p) {
if (p.hp <= 0) { p.action = ‘ko’; p.vx *= 0.86; }
p.vy += GRAV; p.x += p.vx; p.y += p.vy;
if (p.y >= GY) { p.y=GY; p.vy=0; p.onGnd=true; } else p.onGnd=false;
p.x = Math.max(24, Math.min(CW-80, p.x));
if (p.hp>0 && !p.stun && !p.atking && !p.atk2ing) {
if (!p.onGnd)           p.action = ‘jump’;
else if (Math.abs(p.vx)>0.5) p.action = ‘walk’;
else                    p.action = ‘idle’;
}
if (p.hp>0 && !p.atking && !p.atk2ing) {
var opp = p===p1?p2:p1; p.facing = opp.x>p.x?1:-1;
}
}
physics(p1); physics(p2);

// Projéteis
var kill = [];
gs.projs.forEach(function(pr) {
var spMult = pr.spMult || 1;
if (pr.type===‘shockwave’||pr.type===‘quake’||pr.type===‘roar’) {
pr.r += 4; pr.prog = pr.r/pr.maxR;
var tgt = pr.owner===p1?p2:p1;
if (!pr.hit && tgt.hp>0 && !tgt.stun) {
var dist2 = pr.type===‘roar’
? (Math.abs(pr.x-tgt.x)<pr.r && Math.abs(pr.y-(tgt.y-30))<pr.r*0.5)
: Math.abs(pr.x-tgt.x)<pr.r;
if (dist2) { pr.hit=true; applyHit(pr.owner,tgt, SP_DMG*CHARS[pr.owner.cId].str*spMult*0.001, true, pr.hk); }
}
if (pr.r > pr.maxR) kill.push(pr);
} else {
pr.x += pr.vx;
if (pr.type===‘ice’||pr.type===‘magic’||pr.type===‘ice_hero’) pr.spin=(pr.spin||0)+0.15;
var tgt = pr.owner===p1?p2:p1;
if (!pr.hit && Math.abs(pr.x-tgt.x)<50 && Math.abs(pr.y-(tgt.y-36))<62) {
pr.hit = true;
applyHit(pr.owner, tgt, SP_DMG*CHARS[pr.owner.cId].str*spMult*0.001, true, pr.hk);
kill.push(pr);
}
if (pr.x<-90||pr.x>CW+90) kill.push(pr);
}
});
kill.forEach(function(pr){var i=gs.projs.indexOf(pr);if(i>=0)gs.projs.splice(i,1);});

// Pop-ups: envelhecer
pops = pops.map(function(p){return{x:p.x,y:p.y-0.5,hq:p.hq,big:p.big,rot:p.rot,life:p.life-1};}).filter(function(p){return p.life>0;});

// ── RENDER ──
var cv = document.getElementById(‘gameCanvas’);
var ctx = cv.getContext(‘2d’); if (!ctx) return;
var W = cv.width, H = cv.height;
var sc = Math.min(W/CW, H/CH), ox=(W-CW*sc)/2, oy=(H-CH*sc)/2;
ctx.clearRect(0,0,W,H);
ctx.save(); ctx.translate(ox,oy); ctx.scale(sc,sc);

drawFightBG(ctx,CW,CH,GY);

// Sombras
ctx.save(); ctx.globalAlpha=0.24; ctx.fillStyle=’#000’;
ctx.beginPath(); ctx.ellipse(p1.x,GY+62,28,5,0,0,Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.ellipse(p2.x,GY+62,28,5,0,0,Math.PI*2); ctx.fill();
ctx.restore();

drawProjs(ctx, gs.projs);

ctx.save(); ctx.translate(p1.x,p1.y); drawDino(ctx,p1.cId,0,0,p1.facing,p1.action,gs.frame,hitF.p1>0); ctx.restore();
ctx.save(); ctx.translate(p2.x,p2.y); drawDino(ctx,p2.cId,0,0,p2.facing,p2.action,gs.frame,hitF.p2>0); ctx.restore();

drawPops(ctx,pops);
ctx.restore();
refreshHUD();

if (p1.hp<=0||p2.hp<=0) {
gs.over = true;
var wk = p1.hp<=0?‘p2’:‘p1’;
playSound(‘ko’);
setTimeout(function(){ goResult(wk, wk===‘p1’?p1.cId:p2.cId); }, 800);
}
}

// ============================================================
//  RESULTADO
// ============================================================
function goResult(wk, cId) {
stopFight();
var ch = CHARS[cId];
var lbl = wk===‘p1’?‘JOGADOR 1’:(selMode===‘2p’?‘JOGADOR 2’:‘CPU’);
showScreen(‘resultScreen’);
playSound(‘win’);

var card = document.getElementById(‘rCard’);
card.style.borderColor = ch.color;
card.style.boxShadow = ‘0 0 50px ‘+ch.color+‘88,0 0 100px ‘+ch.color+‘22’;
var mast = document.getElementById(‘rMast’);
mast.style.background = ‘linear-gradient(135deg,’+ch.color+’,’+ch.accent+’)’;
document.getElementById(‘rRole’).textContent = ch.role===‘villain’?’— VILÃO VENCE —’:’— HERÓI VENCE —’;
document.getElementById(‘rRole’).style.color = ch.lc;
var nm = document.getElementById(‘rName’); nm.textContent = lbl; nm.style.color = ch.lc;
var dy = document.getElementById(‘rDay’);
dy.style.background = ‘linear-gradient(90deg,’+ch.color+’,’+ch.accent+’,’+ch.color+’)’;
dy.style.webkitBackgroundClip = ‘text’; dy.style.webkitTextFillColor = ‘transparent’;
document.getElementById(‘rDN’).textContent = ch.emoji+’ ‘+ch.name; document.getElementById(‘rDN’).style.color = ch.lc;
document.getElementById(‘rDD’).textContent = ch.desc;
document.getElementById(‘rPlate’).style.background = ch.color+‘22’;
document.getElementById(‘rPlate’).style.border = ‘1px solid ‘+ch.color+‘44’;
var btnAg = document.getElementById(‘btnAgain’);
btnAg.style.background = ‘linear-gradient(135deg,’+ch.color+’,’+ch.accent+’)’;
btnAg.style.boxShadow = ’0 4px 0 rgba(0,0,0,.4),0 0 20px ’+ch.color;
btnAg.onclick = function(){ startFight(); };

// Dino animado
var rc = document.getElementById(‘rDinoCanvas’), rctx = rc.getContext(‘2d’), rf = 0;
resInterv = setInterval(function() {
rf++;
rctx.clearRect(0,0,140,120);
rctx.save(); rctx.translate(46,100);
drawDino(rctx,cId,0,0,1,‘idle’,rf,false);
rctx.restore();
}, 50);

// Raios de fundo
var bc = document.getElementById(‘resultBeams’);
bc.width = window.innerWidth; bc.height = window.innerHeight;
var bctx = bc.getContext(‘2d’), bAng = 0;
function beamLoop() {
bctx.clearRect(0,0,bc.width,bc.height);
bctx.save(); bctx.translate(bc.width/2, bc.height/2); bctx.rotate(bAng*Math.PI/180);
for (var i=0;i<16;i++) {
var a = i*(Math.PI*2/16);
var g = bctx.createLinearGradient(0,0,Math.cos(a)*800,Math.sin(a)*800);
g.addColorStop(0,ch.color+‘22’); g.addColorStop(0.5,ch.color+‘08’); g.addColorStop(1,‘transparent’);
bctx.fillStyle=g; bctx.beginPath(); bctx.moveTo(0,0); bctx.arc(0,0,900,a-0.15,a+0.15); bctx.closePath(); bctx.fill();
}
bctx.restore(); bAng += 0.28;
if (!document.getElementById(‘resultScreen’).classList.contains(‘hidden’)) resultRaf = requestAnimationFrame(beamLoop);
}
resultRaf = requestAnimationFrame(beamLoop);
}

// ============================================================
//  TECLADO
// ============================================================
window.addEventListener(‘keydown’, function(e) { keys[e.code] = true; });
window.addEventListener(‘keyup’,   function(e) { keys[e.code] = false; });

// ============================================================
//  JOGO DA MEMÓRIA
// ============================================================
var memState = {pairs:0,cards:[],flipped:[],matched:[],moves:0,time:0,timer:null,diff:‘medium’};
var MEM_DIFFS = {easy:{pairs:6,label:‘FÁCIL’}, medium:{pairs:8,label:‘MÉDIO’}, hard:{pairs:10,label:‘DIFÍCIL’}};
var memDiffKeys = [‘easy’,‘medium’,‘hard’], memDiffIdx = 1;

function cycleMemDiff() {
memDiffIdx = (memDiffIdx+1)%3;
var k = memDiffKeys[memDiffIdx];
document.getElementById(‘memDiffBtn’).textContent = MEM_DIFFS[k].label;
initMemory();
}

function initMemory() {
document.getElementById(‘memWin’).classList.add(‘hidden’);
if (memState.timer) clearInterval(memState.timer);
var dk = memDiffKeys[memDiffIdx], numPairs = MEM_DIFFS[dk].pairs;
var ids = ALL_IDS.slice(0, numPairs);
var cards = [];
ids.forEach(function(id) { cards.push({id:id,pair:id}); cards.push({id:id,pair:id}); });
for (var i=cards.length-1;i>0;i–) {var j=Math.floor(Math.random()*(i+1));var tmp=cards[i];cards[i]=cards[j];cards[j]=tmp;}
memState = {pairs:numPairs,cards:cards,flipped:[],matched:[],moves:0,time:0,timer:null,diff:dk};
document.getElementById(‘memMoves’).textContent = ‘0’;
document.getElementById(‘memPairs’).textContent = ‘0’;
document.getElementById(‘memTime’).textContent = ‘0s’;
buildMemGrid();
memState.timer = setInterval(function(){ memState.time++; document.getElementById(‘memTime’).textContent = memState.time+‘s’; }, 1000);
}

function buildMemGrid() {
var grid = document.getElementById(‘memGrid’); grid.innerHTML = ‘’;
var dk = memDiffKeys[memDiffIdx], np = MEM_DIFFS[dk].pairs;
grid.className = ’mem-grid ’+(np<=6?‘pairs-6’:(np<=8?‘pairs-8’:‘pairs-10’));
var sz = Math.min(Math.floor((Math.min(window.innerWidth,560)-24)/Math.ceil(np/2))-10, 88);
sz = Math.max(sz, 50);

memState.cards.forEach(function(card,i) {
var el = document.createElement(‘div’); el.className = ‘mem-card’; el.dataset.idx = i;
var back = document.createElement(‘div’); back.className = ‘mem-back’;
back.innerHTML = ‘<div class="mem-back-inner">🦕</div>’;
var face = document.createElement(‘div’); face.className = ‘mem-face’;
var cv = document.createElement(‘canvas’); cv.width = sz; cv.height = sz;
(function(ctx2, iid, s2) {
setTimeout(function() {
ctx2.clearRect(0,0,s2,s2);
ctx2.save(); ctx2.translate(s2*0.36, s2*0.86);
drawDino(ctx2, iid, 0, 0, 1, ‘idle’, 20, false, s2/88);
ctx2.restore();
}, 0);
})(cv.getContext(‘2d’), card.id, sz);
face.appendChild(cv); el.appendChild(back); el.appendChild(face);
el.addEventListener(‘click’, function(){ memFlip(parseInt(el.dataset.idx)); });
el.addEventListener(‘touchstart’, function(e){ e.preventDefault(); memFlip(parseInt(el.dataset.idx)); }, {passive:false});
grid.appendChild(el);
});
}

var memLocked = false;
function memFlip(idx) {
if (memLocked || memState.flipped.length >= 2) return;
if (memState.matched.indexOf(idx) >= 0) return;
if (memState.flipped.indexOf(idx) >= 0) return;
playSound(‘memFlip’);
memState.flipped.push(idx);
var cards = document.querySelectorAll(’.mem-card’);
cards[idx].classList.add(‘flipped’);

if (memState.flipped.length === 2) {
memLocked = true;
memState.moves++;
document.getElementById(‘memMoves’).textContent = memState.moves;
var a = memState.flipped[0], b = memState.flipped[1];
if (memState.cards[a].pair === memState.cards[b].pair) {
memState.matched.push(a, b);
playSound(‘memMatch’);
setTimeout(function() {
cards[a].querySelector(’.mem-face’).classList.add(‘match-glow’);
cards[b].querySelector(’.mem-face’).classList.add(‘match-glow’);
memState.flipped = []; memLocked = false;
var pairsFound = memState.matched.length/2;
document.getElementById(‘memPairs’).textContent = pairsFound;
if (pairsFound === memState.pairs) memWin();
}, 400);
} else {
playSound(‘memWrong’);
setTimeout(function() {
cards[a].querySelector(’.mem-face’).classList.add(‘wrong-flash’);
cards[b].querySelector(’.mem-face’).classList.add(‘wrong-flash’);
setTimeout(function() {
cards[a].classList.remove(‘flipped’); cards[b].classList.remove(‘flipped’);
cards[a].querySelector(’.mem-face’).classList.remove(‘wrong-flash’);
cards[b].querySelector(’.mem-face’).classList.remove(‘wrong-flash’);
memState.flipped = []; memLocked = false;
}, 380);
}, 480);
}
}
}

function memWin() {
if (memState.timer) clearInterval(memState.timer);
playSound(‘win’);
var score = document.getElementById(‘memWinScore’);
score.textContent = ‘⭐ ‘+memState.moves+’ jogadas em ‘+memState.time+’ segundos! ⭐’;
document.getElementById(‘memWin’).classList.remove(‘hidden’);
}

// ============================================================
//  PINTURA DE DINOS
// ============================================================
var paintCtx = null, paintTool = ‘brush’, paintColor = ‘#ff5252’, paintDino = ‘daviHeroi’;
var paintDrawing = false, paintLastX = 0, paintLastY = 0;
var paintSoundThrottle = 0;

var PAINT_COLORS = [
‘#ff1744’,’#ff5252’,’#ff4081’,’#f48fb1’,’#e040fb’,’#ce93d8’,
‘#651fff’,’#7986cb’,’#29b6f6’,’#4dd0e1’,’#00e676’,’#69f0ae’,
‘#ffd740’,’#ffab40’,’#ff6d00’,’#ff8a65’,’#8d6e63’,’#fff9c4’,
‘#fff’,’#e0e0e0’,’#9e9e9e’,’#616161’,’#212121’,’#000’
];

function initPaint() {
// Paleta
var pal = document.getElementById(‘paintPalette’); pal.innerHTML = ‘’;
PAINT_COLORS.forEach(function(c) {
var btn = document.createElement(‘div’);
btn.className = ‘pcolor’+(c===paintColor?’ active’:’’);
btn.style.background = c;
if (c===’#fff’||c===’#fff9c4’||c===’#ffd740’) btn.style.border = ‘3px solid #888’;
btn.onclick = function() {
paintColor = c;
document.querySelectorAll(’.pcolor’).forEach(function(b){ b.classList.remove(‘active’); });
btn.classList.add(‘active’);
};
pal.appendChild(btn);
});

// Seleção de dino
var dsel = document.getElementById(‘paintDinoSel’); dsel.innerHTML = ‘’;
ALL_IDS.forEach(function(id) {
var btn = document.createElement(‘button’);
btn.className = ‘pdinoopt’+(id===paintDino?’ active’:’’);
btn.textContent = CHARS[id].emoji+’ ‘+CHARS[id].name;
btn.onclick = function() {
paintDino = id;
document.querySelectorAll(’.pdinoopt’).forEach(function(b){ b.classList.remove(‘active’); });
btn.classList.add(‘active’);
redrawPaintBg();
};
dsel.appendChild(btn);
});

// Canvas
var cv = document.getElementById(‘paintCanvas’);
paintCtx = cv.getContext(‘2d’);
var maxW = Math.min(window.innerWidth-24, 520);
var maxH = Math.min(window.innerHeight-240, 400);
cv.width = maxW; cv.height = maxH;
redrawPaintBg();

// Mouse events
cv.onmousedown = function(e) {
paintDrawing = true;
var r = cv.getBoundingClientRect();
paintLastX = e.clientX-r.left; paintLastY = e.clientY-r.top;
paintDo(paintLastX,paintLastY,paintLastX,paintLastY);
};
cv.onmousemove = function(e) {
if (!paintDrawing) return;
var r = cv.getBoundingClientRect();
var nx = e.clientX-r.left, ny = e.clientY-r.top;
paintDo(paintLastX,paintLastY,nx,ny);
paintLastX = nx; paintLastY = ny;
};
cv.onmouseup = cv.onmouseleave = function() { paintDrawing = false; };

// Touch events
cv.ontouchstart = function(e) {
e.preventDefault(); paintDrawing = true;
var r = cv.getBoundingClientRect(), t = e.touches[0];
paintLastX = t.clientX-r.left; paintLastY = t.clientY-r.top;
paintDo(paintLastX,paintLastY,paintLastX,paintLastY);
};
cv.ontouchmove = function(e) {
e.preventDefault(); if (!paintDrawing) return;
var r = cv.getBoundingClientRect(), t = e.touches[0];
var nx = t.clientX-r.left, ny = t.clientY-r.top;
paintDo(paintLastX,paintLastY,nx,ny);
paintLastX = nx; paintLastY = ny;
};
cv.ontouchend = function() { paintDrawing = false; };
}

function redrawPaintBg() {
if (!paintCtx) return;
var cv = document.getElementById(‘paintCanvas’);
paintCtx.fillStyle = ‘#fff’; paintCtx.fillRect(0,0,cv.width,cv.height);

// Grade sutil
paintCtx.strokeStyle = ‘rgba(200,200,200,0.2)’; paintCtx.lineWidth = 1;
for (var x=0;x<cv.width;x+=30){ paintCtx.beginPath();paintCtx.moveTo(x,0);paintCtx.lineTo(x,cv.height);paintCtx.stroke(); }
for (var y=0;y<cv.height;y+=30){ paintCtx.beginPath();paintCtx.moveTo(0,y);paintCtx.lineTo(cv.width,y);paintCtx.stroke(); }

// Dino outline como guia
paintCtx.save(); paintCtx.globalAlpha = 0.09;
paintCtx.translate(cv.width*0.46, cv.height*0.85);
drawDino(paintCtx, paintDino, 0, 0, 1, ‘idle’, 20, false, cv.height/108);
paintCtx.globalAlpha = 1; paintCtx.restore();

// Texto guia
paintCtx.fillStyle = ‘rgba(180,180,200,0.55)’;
paintCtx.font = ‘13px Nunito, sans-serif’; paintCtx.textAlign = ‘center’;
paintCtx.fillText(’🎨 Pinte o ‘+CHARS[paintDino].name+’! ’+CHARS[paintDino].emoji, cv.width/2, 20);
}

function paintDo(x1, y1, x2, y2) {
if (!paintCtx) return;
var sz = parseInt(document.getElementById(‘brushSize’).value) || 14;
if (paintTool === ‘erase’) {
paintCtx.globalCompositeOperation = ‘destination-out’;
paintCtx.strokeStyle = ‘rgba(0,0,0,1)’;
} else {
paintCtx.globalCompositeOperation = ‘source-over’;
paintCtx.strokeStyle = paintColor;
}
paintCtx.lineWidth = sz; paintCtx.lineCap = ‘round’; paintCtx.lineJoin = ‘round’;
paintCtx.beginPath(); paintCtx.moveTo(x1,y1); paintCtx.lineTo(x2,y2); paintCtx.stroke();
paintCtx.globalCompositeOperation = ‘source-over’;

// Som throttled
paintSoundThrottle++;
if (paintSoundThrottle % 8 === 0) playSound(‘paintStroke’);
}

function setTool(t) {
paintTool = t;
document.querySelectorAll(’.ptool’).forEach(function(b){ b.classList.remove(‘active’); });
var el = document.getElementById(‘tool’+t.charAt(0).toUpperCase()+t.slice(1));
if (el) el.classList.add(‘active’);
}

function clearPaint() { if (paintCtx) redrawPaintBg(); }

function savePaint() {
var cv = document.getElementById(‘paintCanvas’);
var a = document.createElement(‘a’);
a.download = ‘meu-’+paintDino+’.png’;
a.href = cv.toDataURL(‘image/png’);
a.click();
}

// ============================================================
//  RESIZE
// ============================================================
window.addEventListener(‘resize’, function() {
if (!document.getElementById(‘fightScreen’).classList.contains(‘hidden’) && gs && !gs.over) {
var cv  = document.getElementById(‘gameCanvas’);
var fs  = document.getElementById(‘fightScreen’);
cv.width = fs.clientWidth;
var used = document.getElementById(‘fightHUD’).offsetHeight
+ document.getElementById(‘spBars’).offsetHeight
+ document.getElementById(‘touchCtrl’).offsetHeight;
cv.height = Math.max(fs.clientHeight - used, 120);
}
});

// ============================================================
//  BOOT
// ============================================================
showScreen(‘homeScreen’);