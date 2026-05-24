/* ============================================================
   🦖 DINOS DAVI HERÓIS COMBAT - v2.0
   Feito por Mamãe Valcely para o Davi 💚
   4 Interfaces: Batalha | Memória | Pintura | Ovos
   T-Rex 100% em código (sem dependências externas)
   ============================================================ */

'use strict';

/* ============================================================
   HERÓIS (9) e VILÕES (9)
   ============================================================ */
const HEROES = [
  { id:'davi',  name:'DINO DAVI ARANHA',   inspiration:'Homem-Aranha',     emoji:'🕷️', color:'#dc143c', secondaryColor:'#1e3a8a', hp:100, atk:20, def:10, speed:15, rarity:'legendary', skill:'TEIA EXPLOSIVA',  unlockWins:0 },
  { id:'mamae', name:'DINA MAMÃE EVE',      inspiration:'Eve (Invincible)', emoji:'🌸', color:'#ff66bb', secondaryColor:'#ff1177', hp:110, atk:22, def:12, speed:14, rarity:'legendary', skill:'CHUVA DE ROSAS',  unlockWins:0 },
  { id:'papai', name:'DINO PAPAI HULK',     inspiration:'Hulk',             emoji:'💪', color:'#00aa00', secondaryColor:'#006600', hp:130, atk:25, def:15, speed:8,  rarity:'epic',      skill:'SMASH!',          unlockWins:2 },
  { id:'vovo',  name:'DINA VOVÓ BRUXA',     inspiration:'Bruxa Escarlate',  emoji:'🌙', color:'#aa00ff', secondaryColor:'#660099', hp:95,  atk:24, def:8,  speed:13, rarity:'epic',      skill:'FEITIÇO REAL',    unlockWins:4 },
  { id:'vova',  name:'DINO VOVÔ BAT',       inspiration:'Batman',           emoji:'🦇', color:'#1a1a3e', secondaryColor:'#444466', hp:105, atk:19, def:14, speed:12, rarity:'rare',      skill:'BATARANGUE',      unlockWins:6 },
  { id:'tina',  name:'DINA TITIA SOL',      inspiration:'Estelar Rosa',     emoji:'🌟', color:'#ffccdd', secondaryColor:'#ff99cc', hp:90,  atk:18, def:9,  speed:16, rarity:'rare',      skill:'RAIO SOLAR',      unlockWins:8 },
  { id:'gio',   name:'DINA TITIA MAR',      inspiration:'Aquaman Rosa',     emoji:'🌊', color:'#99ccff', secondaryColor:'#3366ff', hp:100, atk:17, def:11, speed:14, rarity:'rare',      skill:'TSUNAMI',         unlockWins:10 },
  { id:'tobby', name:'DINO TOBBY FLASH',    inspiration:'Flash',            emoji:'⚡', color:'#ffdd00', secondaryColor:'#ffaa00', hp:85,  atk:16, def:7,  speed:20, rarity:'epic',      skill:'VELOCIDADE LUZ',  unlockWins:12 },
  { id:'atena', name:'DINA ATENA AMAZONA',  inspiration:'Mulher Maravilha', emoji:'⚔️', color:'#cc8844', secondaryColor:'#ffaa66', hp:115, atk:23, def:13, speed:13, rarity:'mythic',    skill:'LAÇO DOURADO',    unlockWins:14 }
];

const VILLAINS = [
  { id:'coringa',  name:'CORINGA REX',   inspiration:'Coringa',      emoji:'🤡', color:'#aa00ff', secondaryColor:'#00ff00', hp:120, atk:18, def:8,  skill:'GÁS TÓXICO' },
  { id:'venom',    name:'VENOM REX',     inspiration:'Venom',        emoji:'👽', color:'#1a1a1a', secondaryColor:'#ffffff', hp:160, atk:20, def:10, skill:'SIMBIOSE' },
  { id:'duende',   name:'DUENDE REX',    inspiration:'Duende Verde', emoji:'👺', color:'#22aa22', secondaryColor:'#aa00ff', hp:140, atk:22, def:9,  skill:'BOMBA ABÓBORA' },
  { id:'thanos',   name:'THANOS REX',    inspiration:'Thanos',       emoji:'👹', color:'#aa66cc', secondaryColor:'#ffd700', hp:200, atk:25, def:14, skill:'ESTALAR' },
  { id:'lex',      name:'LEX REX',       inspiration:'Lex Luthor',   emoji:'🧠', color:'#00aa88', secondaryColor:'#aaaaaa', hp:170, atk:21, def:13, skill:'KRYPTONITA' },
  { id:'doomsday', name:'DOOMSDAY REX',  inspiration:'Apocalipse',   emoji:'💀', color:'#888899', secondaryColor:'#ffaa00', hp:240, atk:27, def:16, skill:'DEVASTAR' },
  { id:'magneto',  name:'MAGNETO REX',   inspiration:'Magneto',      emoji:'🧲', color:'#cc0000', secondaryColor:'#9900cc', hp:190, atk:24, def:15, skill:'CAMPO MAGNÉTICO' },
  { id:'octopus',  name:'OCTOPUS REX',   inspiration:'Dr. Octopus',  emoji:'🐙', color:'#ff8800', secondaryColor:'#00aaaa', hp:180, atk:23, def:12, skill:'TENTÁCULOS' },
  { id:'galactus', name:'GALACTUS REX',  inspiration:'Galactus',     emoji:'🌌', color:'#7722aa', secondaryColor:'#ffcc00', hp:300, atk:30, def:20, skill:'DEVORAR MUNDOS' }
];

/* ============================================================
   ESTADO
   ============================================================ */
let gameState = {
  selectedHeroId: 'davi',
  currentEnemyIndex: 0,
  crystals: 50,
  wins: 0,
  combo: 0,
  upgrades: { attack: 0, defense: 0, health: 0 },
  collection: ['davi', 'mamae'],   // heróis chocados/desbloqueados
  battle: { active:false, playerHP:100, enemyHP:120, playerMaxHP:100, enemyMaxHP:120, cooldowns:{attack:0,skill:0,defend:0}, defending:false, busy:false }
};

function loadState() {
  try {
    const saved = localStorage.getItem('dinoDaviGameState_v2');
    if (saved) {
      const p = JSON.parse(saved);
      gameState.selectedHeroId = p.selectedHeroId || 'davi';
      gameState.currentEnemyIndex = p.currentEnemyIndex || 0;
      gameState.crystals = (p.crystals !== undefined) ? p.crystals : 50;
      gameState.wins = p.wins || 0;
      gameState.upgrades = p.upgrades || { attack:0, defense:0, health:0 };
      gameState.collection = p.collection || ['davi','mamae'];
    }
  } catch(e) { console.warn('load erro', e); }
}

function saveState() {
  try {
    localStorage.setItem('dinoDaviGameState_v2', JSON.stringify({
      selectedHeroId: gameState.selectedHeroId,
      currentEnemyIndex: gameState.currentEnemyIndex,
      crystals: gameState.crystals,
      wins: gameState.wins,
      upgrades: gameState.upgrades,
      collection: gameState.collection
    }));
  } catch(e) { console.warn('save erro', e); }
}

/* ============================================================
   ÁUDIO
   ============================================================ */
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}
function playSound(type) {
  if (!audioCtx) return;
  try {
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    const sounds = {
      attack:{freq:[200,80],type:'square',dur:0.15},
      hit:{freq:[400,100],type:'sawtooth',dur:0.2},
      skill:{freq:[400,1200,600],type:'triangle',dur:0.4},
      victory:{freq:[400,600,800],type:'sine',dur:0.5},
      defeat:{freq:[400,200,100],type:'sine',dur:0.6},
      click:{freq:[800,1000],type:'sine',dur:0.08},
      pop:{freq:[600,900],type:'sine',dur:0.12},
      crack:{freq:[300,150],type:'square',dur:0.15},
      reveal:{freq:[500,800,1200],type:'triangle',dur:0.6}
    };
    const cfg = sounds[type] || sounds.click;
    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.freq[0], t);
    if (cfg.freq[1]) osc.frequency.exponentialRampToValueAtTime(cfg.freq[1], t + cfg.dur*0.5);
    if (cfg.freq[2]) osc.frequency.exponentialRampToValueAtTime(cfg.freq[2], t + cfg.dur);
    osc.start(t); osc.stop(t + cfg.dur);
  } catch(e) {}
}

/* ============================================================
   THREE.JS - BATALHA (fundo claro de dia)
   ============================================================ */
let scene, camera, renderer, clock;
let playerDino = null, enemyDino = null;

function initThree() {
  const canvas = document.getElementById('battleCanvas');
  const w = window.innerWidth, h = window.innerHeight;

  scene = new THREE.Scene();
  // FUNDO CLARO - céu azul de dia
  scene.background = new THREE.Color(0x9fd4f0);
  scene.fog = new THREE.Fog(0xbfe5f5, 22, 55);

  const aspect = w / h;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);
  const camDist = aspect < 0.7 ? 19 : (aspect < 1 ? 16 : 12);
  camera.position.set(0, 5, camDist);
  camera.lookAt(0, 2, 0);
  scene.userData.camDist = camDist;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Luz do dia forte
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sun = new THREE.DirectionalLight(0xfff8e8, 1.5);
  sun.position.set(10, 20, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.left = -14; sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -14;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x9fd4f0, 0x3d8b3d, 0.7));

  // Chão de grama verde
  const groundGeo = new THREE.CircleGeometry(40, 64);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x4caf3f, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Terra batida (arena central)
  const arenaGeo = new THREE.CircleGeometry(9, 48);
  const arenaMat = new THREE.MeshStandardMaterial({ color: 0xc2a878, roughness: 1 });
  const arena = new THREE.Mesh(arenaGeo, arenaMat);
  arena.rotation.x = -Math.PI/2;
  arena.position.y = 0.01;
  arena.receiveShadow = true;
  scene.add(arena);

  // Tufos de grama
  for (let i = 0; i < 40; i++) {
    const g = new THREE.ConeGeometry(0.18, 0.5, 4);
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.28, 0.6, 0.35 + Math.random()*0.15) });
    const tuft = new THREE.Mesh(g, m);
    const a = Math.random()*Math.PI*2, d = 11 + Math.random()*22;
    tuft.position.set(Math.cos(a)*d, 0.25, Math.sin(a)*d);
    tuft.castShadow = true;
    scene.add(tuft);
  }

  // Palmeiras simples ao fundo
  for (let i = 0; i < 14; i++) {
    const a = (i/14)*Math.PI*2, d = 24 + Math.random()*6;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 8), new THREE.MeshStandardMaterial({ color: 0x6b4423 }));
    trunk.position.set(Math.cos(a)*d, 2.5, Math.sin(a)*d);
    trunk.castShadow = true;
    scene.add(trunk);
    for (let j = 0; j < 7; j++) {
      const pa = (j/7)*Math.PI*2;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.2, 2.2, 4), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.3,0.6,0.3) }));
      leaf.position.set(Math.cos(a)*d + Math.cos(pa)*1, 5 - 0.5, Math.sin(a)*d + Math.sin(pa)*1);
      leaf.rotation.z = Math.cos(pa)*0.8; leaf.rotation.x = Math.sin(pa)*0.8;
      scene.add(leaf);
    }
  }

  // Montanhas verdes (estilo havaiano)
  for (let i = 0; i < 9; i++) {
    const a = (i/9)*Math.PI*2;
    const m = new THREE.Mesh(new THREE.ConeGeometry(6 + Math.random()*3, 10 + Math.random()*5, 7), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.3,0.4,0.3), roughness:0.9 }));
    m.position.set(Math.cos(a)*42, 5, Math.sin(a)*42);
    scene.add(m);
  }

  // Nuvens
  for (let i = 0; i < 8; i++) {
    const cloud = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const c = new THREE.Mesh(new THREE.SphereGeometry(1+Math.random()*0.5, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness:1 }));
      c.position.set(j*1.2-1.5, Math.random()*0.4, 0);
      cloud.add(c);
    }
    cloud.position.set((Math.random()-0.5)*60, 16+Math.random()*6, (Math.random()-0.5)*60);
    scene.add(cloud);
  }

  clock = new THREE.Clock();

  const hero = getHero(gameState.selectedHeroId);
  const villain = VILLAINS[gameState.currentEnemyIndex];

  playerDino = createDino(hero.color, hero.secondaryColor, hero.id === 'davi');
  playerDino.position.set(-2.6, 0, 0);
  playerDino.rotation.y = Math.PI/2;
  playerDino.scale.set(0.72,0.72,0.72);
  scene.add(playerDino);

  enemyDino = createDino(villain.color, villain.secondaryColor, false);
  enemyDino.position.set(2.6, 0, 0);
  enemyDino.rotation.y = -Math.PI/2;
  enemyDino.scale.set(0.72,0.72,0.72);
  scene.add(enemyDino);

  animate();
}

/* ============================================================
   CRIAR T-REX (mais detalhado e realista)
   ============================================================ */
function createDino(colorPrimary, colorSecondary, isSpider) {
  const dino = new THREE.Group();
  const matBody = new THREE.MeshStandardMaterial({ color: colorPrimary, roughness: 0.6, metalness: 0.08 });
  const matAccent = new THREE.MeshStandardMaterial({ color: colorSecondary, roughness: 0.6, metalness: 0.08 });
  const matBelly = new THREE.MeshStandardMaterial({ color: lighten(colorPrimary, 0.28), roughness: 0.7 });
  const matTeeth = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.3 });
  const matEye = new THREE.MeshStandardMaterial({ color: 0xffee44, emissive: 0xffaa00, emissiveIntensity: 0.5, roughness: 0.3 });
  const matPupil = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const matBlack = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.5 });
  const matClaw = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4 });

  dino.userData.materials = [matBody, matAccent, matBelly];

  // TRONCO inclinado (postura horizontal de T-Rex)
  const torsoGeo = new THREE.SphereGeometry(0.95, 28, 20);
  torsoGeo.scale(1.8, 1.0, 1.05);
  const torso = new THREE.Mesh(torsoGeo, matBody);
  torso.position.set(0, 2.0, 0);
  torso.rotation.z = 0.15;
  torso.castShadow = true;
  dino.add(torso);

  // Barriga clara
  const bellyGeo = new THREE.SphereGeometry(0.8, 22, 16);
  bellyGeo.scale(1.6, 0.8, 0.8);
  const belly = new THREE.Mesh(bellyGeo, matBelly);
  belly.position.set(0.4, 1.7, 0);
  dino.add(belly);

  // Costas (cor secundária) - lombada
  const backGeo = new THREE.SphereGeometry(0.85, 22, 16);
  backGeo.scale(1.7, 0.5, 0.9);
  const back = new THREE.Mesh(backGeo, matAccent);
  back.position.set(-0.1, 2.5, 0);
  back.rotation.z = 0.15;
  back.castShadow = true;
  dino.add(back);

  // PESCOÇO curvado
  const neckGeo = new THREE.CylinderGeometry(0.4, 0.58, 1.2, 16);
  const neck = new THREE.Mesh(neckGeo, matBody);
  neck.position.set(1.3, 2.5, 0);
  neck.rotation.z = -0.9;
  neck.castShadow = true;
  dino.add(neck);

  // CABEÇA (grupo)
  const head = new THREE.Group();
  const skullGeo = new THREE.SphereGeometry(0.55, 24, 18);
  skullGeo.scale(1.6, 1.0, 0.95);
  const skull = new THREE.Mesh(skullGeo, matBody);
  skull.castShadow = true;
  head.add(skull);

  // Topo da cabeça (cor secundária - capuz)
  const topGeo = new THREE.SphereGeometry(0.56, 20, 14, 0, Math.PI*2, 0, Math.PI*0.55);
  const top = new THREE.Mesh(topGeo, matAccent);
  top.scale.set(1.6, 1.0, 0.95);
  head.add(top);

  // Focinho longo
  const snoutGeo = new THREE.SphereGeometry(0.42, 20, 14);
  snoutGeo.scale(2.2, 0.72, 0.85);
  const snout = new THREE.Mesh(snoutGeo, matBody);
  snout.position.set(0.95, -0.08, 0);
  snout.castShadow = true;
  head.add(snout);

  // Narinas
  const nostrilGeo = new THREE.SphereGeometry(0.05, 8, 6);
  [0.28, -0.28].forEach(z => {
    const n = new THREE.Mesh(nostrilGeo, matBlack);
    n.position.set(1.7, 0.0, z);
    head.add(n);
  });

  // MANDÍBULA inferior (anima)
  const jaw = new THREE.Group();
  const jawGeo = new THREE.SphereGeometry(0.38, 18, 12);
  jawGeo.scale(2.1, 0.4, 0.8);
  const jawMesh = new THREE.Mesh(jawGeo, matBody);
  jawMesh.position.set(0.92, -0.3, 0);
  jaw.add(jawMesh);
  // Língua
  const tongue = new THREE.Mesh(makeScaledSphere(0.2, 2.0, 0.3, 0.6), new THREE.MeshStandardMaterial({ color: 0xcc5577, roughness: 0.6 }));
  tongue.position.set(0.9, -0.22, 0);
  jaw.add(tongue);
  // Dentes inferiores
  for (let i = 0; i < 8; i++) {
    [0.32, -0.32].forEach(z => {
      const tth = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 5), matTeeth);
      tth.position.set(0.45 + i*0.15, -0.18, z);
      jaw.add(tth);
    });
  }
  head.add(jaw);
  head.userData.jaw = jaw;

  // Dentes superiores
  for (let i = 0; i < 8; i++) {
    [0.33, -0.33].forEach(z => {
      const tth = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 5), matTeeth);
      tth.position.set(0.45 + i*0.15, -0.04, z);
      tth.rotation.x = Math.PI;
      head.add(tth);
    });
  }

  // OLHOS
  if (isSpider) {
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3, roughness: 0.2 });
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 12); eyeGeo.scale(1.5, 0.95, 0.5);
    [0.42, -0.42].forEach((z, i) => {
      const e = new THREE.Mesh(eyeGeo, eyeMat);
      e.position.set(0.36, 0.2, z); e.rotation.z = -0.3; e.rotation.y = i === 0 ? 0.3 : -0.3;
      head.add(e);
      const border = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 16), matBlack);
      border.position.set(0.34, 0.2, z + (i===0?0.02:-0.02)); border.rotation.y = Math.PI/2; border.scale.set(1.5,0.95,1);
      head.add(border);
    });
  } else {
    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 12);
    [0.4, -0.4].forEach(z => {
      const e = new THREE.Mesh(eyeGeo, matEye);
      e.position.set(0.42, 0.28, z);
      head.add(e);
      const pup = new THREE.Mesh(makeScaledSphere(0.07,0.5,1.3,1), matPupil);
      pup.position.set(0.53, 0.28, z);
      head.add(pup);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.1,0.26), matAccent);
      brow.position.set(0.42, 0.46, z); brow.rotation.z = -0.2;
      head.add(brow);
    });
  }

  head.position.set(1.9, 2.95, 0);
  dino.add(head);
  dino.userData.head = head;

  // SÍMBOLO ARANHA (só Davi)
  if (isSpider) {
    const spider = new THREE.Group();
    const sb = new THREE.Mesh(makeScaledSphere(0.14,1,1.4,0.3), matBlack); spider.add(sb);
    const sh = new THREE.Mesh(makeScaledSphere(0.09,1,1,0.3), matBlack); sh.position.y = 0.2; spider.add(sh);
    for (let i = 0; i < 4; i++) {
      const ang = -0.4 + i*0.28;
      [[0.13,-1],[-0.13,1]].forEach(([x,dir]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.34,5), matBlack);
        leg.position.set(x, 0.1 - i*0.1, 0); leg.rotation.z = dir*(Math.PI/2) - dir*ang;
        spider.add(leg);
      });
    }
    spider.position.set(0.95, 1.95, 0); spider.rotation.y = Math.PI/2; spider.scale.set(1.4,1.4,1.4);
    dino.add(spider);
  }

  // BRACINHOS com garras
  [0.5, -0.5].forEach(z => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,0.45,8), matAccent);
    arm.position.set(1.05, 2.0, z); arm.rotation.z = -0.5;
    dino.add(arm);
    for (let c = 0; c < 2; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.04,0.13,5), matClaw);
      claw.position.set(1.32, 1.78, z + (c*0.07-0.03)); claw.rotation.z = -Math.PI/2;
      dino.add(claw);
    }
  });

  // PERNAS (animáveis)
  function makeLeg(z) {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(makeScaledSphere(0.48, 0.85, 1.4, 0.95), matBody);
    thigh.position.set(0, 1.35, 0); thigh.castShadow = true; leg.add(thigh);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.0, 12), matBody);
    shin.position.set(0.08, 0.6, 0); shin.castShadow = true; leg.add(shin);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.42), matAccent);
    foot.position.set(0.22, 0.1, 0); foot.castShadow = true; leg.add(foot);
    // Garras do pé
    for (let c = 0; c < 3; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.05,0.16,5), matClaw);
      claw.position.set(0.5, 0.08, (c-1)*0.13); claw.rotation.z = -Math.PI/2;
      leg.add(claw);
    }
    leg.position.set(-0.25, 0, z);
    return leg;
  }
  const legL = makeLeg(0.5), legR = makeLeg(-0.5);
  dino.add(legL); dino.add(legR);
  dino.userData.legL = legL; dino.userData.legR = legR;

  // CAUDA segmentada (animável)
  const tailSegs = [];
  for (let i = 0; i < 10; i++) {
    const t = i/10, r = 0.52 - t*0.45;
    const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), i%3===2 ? matAccent : matBody);
    seg.position.set(-0.6 - i*0.42, 2.0 - t*0.7, 0);
    seg.castShadow = true;
    dino.add(seg); tailSegs.push(seg);
  }
  dino.userData.tailSegs = tailSegs;
  dino.userData.anim = { hit:0, attacking:0 };

  return dino;
}

function makeScaledSphere(r, sx, sy, sz) { const g = new THREE.SphereGeometry(r,14,10); g.scale(sx,sy,sz); return g; }
function lighten(hex, amt) { const c = new THREE.Color(hex); c.r=Math.min(1,c.r+amt); c.g=Math.min(1,c.g+amt); c.b=Math.min(1,c.b+amt); return c.getHex(); }
function recolorDino(dino, p, s) { if (!dino||!dino.userData.materials) return; dino.userData.materials[0].color.set(p); dino.userData.materials[1].color.set(s); dino.userData.materials[2].color.set(lighten(p,0.28)); }

/* ============================================================
   LOOP DE ANIMAÇÃO
   ============================================================ */
function animate() {
  requestAnimationFrame(animate);
  if (!renderer) return;
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  animateDino(playerDino, time, delta, -2.6, 1);
  animateDino(enemyDino, time, delta, 2.6, -1);

  if (game.currentScreen === 'battle') {
    const cd = scene.userData.camDist || 16;
    camera.position.x = Math.sin(time*0.15)*0.7;
    camera.position.y = 5 + Math.sin(time*0.3)*0.3;
    camera.position.z = cd;
    camera.lookAt(0, 2, 0);
  }
  renderer.render(scene, camera);
}

function animateDino(dino, time, delta, baseX, facing) {
  if (!dino) return;
  const ud = dino.userData, a = ud.anim;
  const breath = Math.sin(time*2)*0.04;
  const readyBob = Math.sin(time*3 + (facing>0?0:Math.PI))*0.1;

  if (ud.tailSegs) ud.tailSegs.forEach((seg,i) => {
    seg.position.z = Math.sin(time*2.5 - i*0.4)*(0.04 + i*0.03);
    seg.position.y = (2.0 - (i/10)*0.7) + breath;
  });

  if (ud.head) {
    ud.head.position.y = 2.95 + breath;
    if (a.attacking<=0 && a.hit<=0) {
      ud.head.rotation.y = Math.sin(time*1.5)*0.06;
      if (ud.head.userData.jaw) {
        const growl = Math.max(0, Math.sin(time*4))*0.12;
        ud.head.userData.jaw.rotation.z += (-growl - ud.head.userData.jaw.rotation.z)*0.2;
      }
    }
  }

  if (ud.legL && ud.legR && a.attacking<=0) {
    ud.legL.rotation.x = Math.sin(time*4)*0.12;
    ud.legR.rotation.x = Math.sin(time*4+Math.PI)*0.12;
    ud.legL.position.y = Math.max(0,Math.sin(time*4))*0.08;
    ud.legR.position.y = Math.max(0,Math.sin(time*4+Math.PI))*0.08;
  }

  if (a.attacking > 0) {
    a.attacking -= delta;
    const prog = 1 - a.attacking, lunge = Math.sin(prog*Math.PI);
    dino.position.x = baseX - facing*lunge*2.2;
    dino.position.y = lunge*0.3;
    if (ud.head && ud.head.userData.jaw) ud.head.userData.jaw.rotation.z = -lunge*0.6;
    if (ud.head) ud.head.rotation.z = -lunge*0.25;
    if (ud.legL) ud.legL.rotation.x = -lunge*0.5;
    if (ud.legR) ud.legR.rotation.x = -lunge*0.5;
  } else {
    dino.position.x += ((baseX - facing*readyBob) - dino.position.x)*0.1;
    dino.position.y += (0 - dino.position.y)*0.15;
    if (ud.head) ud.head.rotation.z += (0 - ud.head.rotation.z)*0.1;
  }

  if (a.hit > 0) {
    a.hit -= delta;
    dino.position.x = baseX + (Math.random()-0.5)*0.5 + facing*0.3;
    ud.materials.forEach(m => m.emissive && m.emissive.setRGB(0.7,0.1,0.1));
  } else if (a.attacking<=0) {
    ud.materials.forEach(m => m.emissive && m.emissive.setRGB(0,0,0));
  }
}

/* ============================================================
   HELPERS DE DADOS
   ============================================================ */
function getHero(id){ return HEROES.find(h=>h.id===id)||HEROES[0]; }
function isHeroUnlocked(hero){ return gameState.wins>=hero.unlockWins || gameState.collection.includes(hero.id); }

/* ============================================================
   OBJETO PRINCIPAL
   ============================================================ */
const game = {
  currentScreen: 'loading',

  /* ===== INTERFACE 2: BATALHA ===== */
  startBattle() {
    initAudio(); playSound('click');
    const hero = getHero(gameState.selectedHeroId);
    const enemy = VILLAINS[gameState.currentEnemyIndex];
    const b = gameState.battle;
    b.playerMaxHP = hero.hp + gameState.upgrades.health*20;
    b.playerHP = b.playerMaxHP;
    b.enemyMaxHP = enemy.hp + gameState.wins*12;
    b.enemyHP = b.enemyMaxHP;
    b.active = true; b.busy = false; b.defending = false;
    gameState.combo = 0;

    if (playerDino) recolorDino(playerDino, hero.color, hero.secondaryColor);
    if (enemyDino) recolorDino(enemyDino, enemy.color, enemy.secondaryColor);

    setText('playerName', hero.name); setText('playerAvatar', hero.emoji);
    setVar('playerAvatar','--hero-color',hero.color);
    setText('enemyName', enemy.name); setText('enemyAvatar', enemy.emoji);
    setVar('enemyAvatar','--hero-color',enemy.color);
    setText('enemyLevel','Vilão '+(gameState.currentEnemyIndex+1));
    setText('playerLevel','Nível '+(gameState.wins+1));

    this.updateHUD();
    showScreen('battleScreen');
    this.currentScreen = 'battle';
    if (renderer) { renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); }
    showBattleMessage('LUTAR!');
  },

  attack() {
    const b = gameState.battle;
    if (!b.active||b.busy||b.cooldowns.attack>Date.now()) return;
    b.busy=true; playSound('attack');
    const hero = getHero(gameState.selectedHeroId);
    const dmg = hero.atk + gameState.upgrades.attack*5 + Math.floor(Math.random()*8);
    const crit = Math.random()<0.15, fin = crit?dmg*2:dmg;
    if (playerDino) playerDino.userData.anim.attacking = 0.5;
    setTimeout(()=>{
      b.enemyHP = Math.max(0,b.enemyHP-fin);
      if (enemyDino) enemyDino.userData.anim.hit = 0.3;
      gameState.combo++; showDamagePopup(fin,true,crit); playSound('hit'); this.updateHUD();
      if (b.enemyHP<=0){ this.victory(); return; }
      setTimeout(()=>this.enemyTurn(),700);
    },350);
    b.cooldowns.attack=Date.now()+1200; this.showCooldown('cdAttack',1.2);
  },

  useSkill() {
    const b = gameState.battle;
    if (!b.active||b.busy||b.cooldowns.skill>Date.now()) return;
    b.busy=true; playSound('skill');
    const hero = getHero(gameState.selectedHeroId);
    const dmg = Math.floor(hero.atk*2.5 + gameState.upgrades.attack*8);
    const crit = Math.random()<0.3, fin = crit?Math.floor(dmg*1.8):dmg;
    showBattleMessage(hero.skill+'!');
    if (playerDino) playerDino.userData.anim.attacking = 0.8;
    setTimeout(()=>{
      b.enemyHP=Math.max(0,b.enemyHP-fin);
      if (enemyDino) enemyDino.userData.anim.hit=0.5;
      gameState.combo+=2; showDamagePopup(fin,true,crit); playSound('hit'); this.updateHUD();
      if (b.enemyHP<=0){ this.victory(); return; }
      setTimeout(()=>this.enemyTurn(),900);
    },650);
    b.cooldowns.skill=Date.now()+6000; this.showCooldown('cdSkill',6);
  },

  defend() {
    const b = gameState.battle;
    if (!b.active||b.busy||b.cooldowns.defend>Date.now()) return;
    playSound('click'); b.defending=true; showBattleMessage('DEFENDER!');
    setTimeout(()=>{ b.defending=false; },1500);
    b.cooldowns.defend=Date.now()+4000; this.showCooldown('cdDefend',4);
  },

  enemyTurn() {
    const b = gameState.battle;
    if (!b.active) return;
    const enemy = VILLAINS[gameState.currentEnemyIndex];
    let dmg = enemy.atk + Math.floor(Math.random()*6) - gameState.upgrades.defense*3;
    if (b.defending) dmg = Math.floor(dmg*0.3);
    if (dmg<1) dmg=1;
    if (enemyDino) enemyDino.userData.anim.attacking=0.5;
    setTimeout(()=>{
      b.playerHP=Math.max(0,b.playerHP-dmg);
      if (playerDino) playerDino.userData.anim.hit=0.3;
      gameState.combo=0; showDamagePopup(dmg,false,false); playSound('hit'); this.updateHUD();
      b.busy=false;
      if (b.playerHP<=0) this.defeat();
    },350);
  },

  victory() {
    const b = gameState.battle; b.active=false; b.busy=false; playSound('victory');
    const earned = 25 + gameState.combo*5 + gameState.wins*3;
    gameState.crystals+=earned; gameState.wins++;
    gameState.currentEnemyIndex=(gameState.currentEnemyIndex+1)%VILLAINS.length;
    saveState();
    setTimeout(()=>{
      setText('resultTitle','🏆 VITÓRIA! 🏆'); setText('resultSubtitle','Você derrotou o vilão!');
      document.getElementById('resultCard').classList.remove('defeat');
      document.getElementById('rewardsList').innerHTML =
        rewardRow('💎','Cristais','+'+earned)+rewardRow('⚡','Combo Máximo',gameState.combo+'x')+rewardRow('🏆','Vitórias',gameState.wins);
      showScreen('resultScreen');
    },1400);
  },

  defeat() {
    const b = gameState.battle; b.active=false; b.busy=false; playSound('defeat');
    const cons = Math.floor(gameState.combo*2+5); gameState.crystals+=cons; saveState();
    setTimeout(()=>{
      setText('resultTitle','💔 DERROTA'); setText('resultSubtitle','O vilão foi mais forte... melhore seu herói!');
      document.getElementById('resultCard').classList.add('defeat');
      document.getElementById('rewardsList').innerHTML =
        rewardRow('💎','Cristais (consolação)','+'+cons)+rewardRow('⚡','Combo',gameState.combo+'x');
      showScreen('resultScreen');
    },1400);
  },

  continueAfterResult(){ playSound('click'); showScreen('menuScreen'); this.currentScreen='menu'; this.updateMenuStats(); },
  exitBattle(){ if(confirm('Sair da batalha?')){ gameState.battle.active=false; this.continueAfterResult(); } },

  showCooldown(id, sec) {
    const ov = document.getElementById(id); ov.classList.add('active');
    let r = sec; ov.textContent = Math.ceil(r);
    const iv = setInterval(()=>{ r-=0.1; if(r<=0){clearInterval(iv); ov.classList.remove('active'); ov.textContent='';} else ov.textContent=Math.ceil(r); },100);
  },

  updateHUD() {
    const b = gameState.battle;
    document.getElementById('playerHealthBar').style.width = Math.max(0,(b.playerHP/b.playerMaxHP)*100)+'%';
    document.getElementById('enemyHealthBar').style.width = Math.max(0,(b.enemyHP/b.enemyMaxHP)*100)+'%';
    setText('playerHealthText', Math.ceil(b.playerHP)+' / '+b.playerMaxHP);
    setText('enemyHealthText', Math.ceil(b.enemyHP)+' / '+b.enemyMaxHP);
    setText('statCrystals', gameState.crystals); setText('statCombo', gameState.combo+'x');
  },
  updateMenuStats(){ setText('menuCrystals',gameState.crystals); setText('menuWins',gameState.wins); },

  /* ===== SELEÇÃO DE HERÓI ===== */
  openHeroSelect(){ playSound('click'); showScreen('heroSelectScreen'); this.currentScreen='heroSelect'; this.renderHeroGrid(); },
  renderHeroGrid() {
    const grid = document.getElementById('heroGrid'); grid.innerHTML='';
    HEROES.forEach(hero=>{
      const unlocked = isHeroUnlocked(hero), selected = hero.id===gameState.selectedHeroId;
      const card = document.createElement('div');
      card.className='hero-card'+(unlocked?' unlocked':' locked')+(selected?' selected':'');
      card.style.setProperty('--hero-color',hero.color);
      card.innerHTML = `
        <div class="hero-card-rarity rarity-${hero.rarity}">${hero.rarity.toUpperCase()}</div>
        <div class="hero-emoji">${hero.emoji}</div>
        <div class="hero-name">${hero.name}</div>
        <div class="hero-inspiration">${hero.inspiration}</div>
        <div class="hero-stats">
          <div class="hero-stat"><span class="stat-icon">❤️</span><span class="stat-value">${hero.hp}</span></div>
          <div class="hero-stat"><span class="stat-icon">⚔️</span><span class="stat-value">${hero.atk}</span></div>
          <div class="hero-stat"><span class="stat-icon">🛡️</span><span class="stat-value">${hero.def}</span></div>
        </div>`;
      card.addEventListener('click',()=>{
        if(unlocked){ playSound('click'); gameState.selectedHeroId=hero.id; saveState(); showToast('✨ '+hero.name+' selecionado!'); this.renderHeroGrid(); if(playerDino) recolorDino(playerDino,hero.color,hero.secondaryColor); }
        else showToast('🔒 Vença '+hero.unlockWins+' batalhas ou choque nos ovos!');
      });
      grid.appendChild(card);
    });
  },

  goToMenu(){ playSound('click'); if(this.memory.timerInterval)clearInterval(this.memory.timerInterval); showScreen('menuScreen'); this.currentScreen='menu'; this.updateMenuStats(); },

  /* ===== UPGRADES ===== */
  openUpgrades(){ playSound('click'); this.renderUpgrades(); document.getElementById('upgradeModal').classList.add('active'); },
  closeUpgrades(){ playSound('click'); document.getElementById('upgradeModal').classList.remove('active'); },
  renderUpgrades() {
    setText('upgradeCrystals',gameState.crystals);
    const list=document.getElementById('upgradesList');
    const ups=[{id:'attack',name:'⚔️ Ataque',desc:'+5 dano'},{id:'defense',name:'🛡️ Defesa',desc:'+3 redução'},{id:'health',name:'❤️ Vida',desc:'+20 HP'}];
    list.innerHTML='';
    ups.forEach(up=>{
      const lvl=gameState.upgrades[up.id], cost=50+lvl*30, can=gameState.crystals>=cost;
      const item=document.createElement('div'); item.className='upgrade-item';
      item.innerHTML=`<div class="upgrade-info"><div class="upgrade-name">${up.name}</div><div class="upgrade-level">Nível ${lvl} • ${up.desc}</div></div><button class="upgrade-btn" ${can?'':'disabled'} data-id="${up.id}" data-cost="${cost}">💎 ${cost}</button>`;
      list.appendChild(item);
    });
    list.querySelectorAll('.upgrade-btn').forEach(btn=>btn.addEventListener('click',()=>this.buyUpgrade(btn.dataset.id,parseInt(btn.dataset.cost))));
  },
  buyUpgrade(id,cost){ if(gameState.crystals<cost)return; playSound('skill'); gameState.crystals-=cost; gameState.upgrades[id]++; saveState(); showToast('⬆️ Upgrade adquirido!'); this.renderUpgrades(); this.updateMenuStats(); },

  /* ===== INTERFACE 1: MEMÓRIA ===== */
  memory:{ cards:[], flipped:[], matched:0, moves:0, locked:false, timer:0, timerInterval:null, totalPairs:6 },
  openMemory(){ playSound('click'); showScreen('memoryScreen'); this.currentScreen='memory'; this.startMemoryGame(); },
  startMemoryGame() {
    const m=this.memory;
    m.flipped=[]; m.matched=0; m.moves=0; m.locked=false; m.timer=0;
    const chosen=HEROES.slice(0,m.totalPairs);
    let deck=[];
    chosen.forEach(h=>{ deck.push({id:h.id,emoji:h.emoji,name:h.name,color:h.color}); deck.push({id:h.id,emoji:h.emoji,name:h.name,color:h.color}); });
    for(let i=deck.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
    m.cards=deck;
    if(m.timerInterval)clearInterval(m.timerInterval);
    m.timerInterval=setInterval(()=>{ m.timer++; setText('memTime',m.timer+'s'); },1000);
    this.renderMemoryGrid();
    setText('memMoves','0'); setText('memPairs','0/'+m.totalPairs); setText('memTime','0s');
  },
  renderMemoryGrid() {
    const grid=document.getElementById('memoryGrid'); grid.innerHTML=''; const m=this.memory;
    m.cards.forEach((card,index)=>{
      const el=document.createElement('div'); el.className='memory-card'; el.dataset.index=index;
      el.innerHTML=`<div class="memory-card-inner"><div class="memory-card-face memory-card-back"></div><div class="memory-card-face memory-card-front" style="--card-color:${card.color}"><span class="card-emoji">${card.emoji}</span><span class="card-label">${card.name}</span></div></div>`;
      el.addEventListener('click',()=>this.flipMemoryCard(index,el));
      grid.appendChild(el);
    });
  },
  flipMemoryCard(index,el) {
    const m=this.memory;
    if(m.locked||el.classList.contains('flipped')||el.classList.contains('matched')||m.flipped.length>=2) return;
    playSound('pop'); el.classList.add('flipped'); m.flipped.push({index,el});
    if(m.flipped.length===2){
      m.moves++; setText('memMoves',m.moves); m.locked=true;
      const [a,b]=m.flipped;
      if(m.cards[a.index].id===m.cards[b.index].id){
        setTimeout(()=>{ a.el.classList.add('matched'); b.el.classList.add('matched'); m.matched++; setText('memPairs',m.matched+'/'+m.totalPairs); playSound('skill'); m.flipped=[]; m.locked=false; if(m.matched===m.totalPairs)this.memoryWin(); },500);
      } else {
        setTimeout(()=>{ a.el.classList.remove('flipped'); b.el.classList.remove('flipped'); m.flipped=[]; m.locked=false; },900);
      }
    }
  },
  memoryWin() {
    const m=this.memory; if(m.timerInterval)clearInterval(m.timerInterval); playSound('victory');
    const total=40+Math.max(0,60-m.timer)+Math.max(0,(m.totalPairs*2-(m.moves-m.totalPairs))*3);
    gameState.crystals+=total; saveState(); this.updateMenuStats();
    setTimeout(()=>{ showToast('🏆 Parabéns! +'+total+' 💎'); setTimeout(()=>this.startMemoryGame(),1600); },600);
  },

  /* ===== INTERFACE 3: PINTURA ===== */
  paint:{ canvas:null, ctx:null, color:'#dc143c', tool:'brush', size:14, drawing:false, dinoType:0, lastX:0, lastY:0 },
  openPaint(){ playSound('click'); showScreen('paintScreen'); this.currentScreen='paint'; this.initPaint(); },
  initPaint() {
    const p=this.paint;
    p.canvas=document.getElementById('paintCanvas');
    p.ctx=p.canvas.getContext('2d');
    this.renderPalette();
    this.drawDinoOutline();
    if(!p.bound){ this.bindPaintEvents(); p.bound=true; }
    this.setPaintTool('brush');
  },
  renderPalette() {
    const colors=['#dc143c','#1e3a8a','#00aa00','#aa00ff','#ffaa00','#ff66bb','#00d4ff','#ffdd00','#ff6633','#8b4513','#000000','#ffffff'];
    const pal=document.getElementById('colorPalette'); pal.innerHTML='';
    colors.forEach((c,i)=>{
      const sw=document.createElement('div'); sw.className='color-swatch'+(i===0?' active':''); sw.style.background=c;
      sw.addEventListener('click',()=>{ playSound('click'); this.paint.color=c; this.paint.tool='brush'; this.setPaintTool('brush'); pal.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('active')); sw.classList.add('active'); });
      pal.appendChild(sw);
    });
  },
  drawDinoOutline() {
    const p=this.paint, ctx=p.ctx, W=p.canvas.width, H=p.canvas.height;
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#222'; ctx.lineWidth=4; ctx.lineJoin='round';
    const dinos=[this.outlineTRex, this.outlineStego, this.outlineBronto];
    (dinos[p.dinoType]||this.outlineTRex).call(this,ctx,W,H);
  },
  outlineTRex(ctx,W,H) {
    ctx.beginPath();
    ctx.moveTo(W*0.15,H*0.55);
    ctx.bezierCurveTo(W*0.1,H*0.4, W*0.25,H*0.32, W*0.4,H*0.35);
    ctx.bezierCurveTo(W*0.5,H*0.2, W*0.7,H*0.18, W*0.8,H*0.32);
    ctx.lineTo(W*0.92,H*0.32);
    ctx.lineTo(W*0.82,H*0.42);
    ctx.bezierCurveTo(W*0.78,H*0.5, W*0.7,H*0.52, W*0.62,H*0.52);
    ctx.bezierCurveTo(W*0.6,H*0.7, W*0.55,H*0.85, W*0.5,H*0.85);
    ctx.lineTo(W*0.42,H*0.85);
    ctx.bezierCurveTo(W*0.4,H*0.7, W*0.4,H*0.6, W*0.38,H*0.55);
    ctx.bezierCurveTo(W*0.3,H*0.62, W*0.2,H*0.62, W*0.15,H*0.55);
    ctx.closePath(); ctx.stroke();
    // perna traseira
    ctx.beginPath(); ctx.moveTo(W*0.28,H*0.55); ctx.bezierCurveTo(W*0.26,H*0.7,W*0.28,H*0.82,W*0.32,H*0.85); ctx.lineTo(W*0.24,H*0.85); ctx.stroke();
    // olho
    ctx.beginPath(); ctx.arc(W*0.78,H*0.3,W*0.022,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
  },
  outlineStego(ctx,W,H) {
    ctx.beginPath();
    ctx.moveTo(W*0.12,H*0.6);
    ctx.bezierCurveTo(W*0.2,H*0.45, W*0.4,H*0.42, W*0.55,H*0.45);
    ctx.bezierCurveTo(W*0.7,H*0.46, W*0.82,H*0.5, W*0.88,H*0.58);
    ctx.bezierCurveTo(W*0.8,H*0.62, W*0.7,H*0.6, W*0.6,H*0.62);
    ctx.bezierCurveTo(W*0.6,H*0.78, W*0.55,H*0.85, W*0.5,H*0.85);
    ctx.lineTo(W*0.44,H*0.85);
    ctx.lineTo(W*0.42,H*0.64);
    ctx.bezierCurveTo(W*0.3,H*0.66, W*0.2,H*0.66, W*0.16,H*0.68);
    ctx.bezierCurveTo(W*0.12,H*0.66, W*0.1,H*0.62, W*0.12,H*0.6);
    ctx.closePath(); ctx.stroke();
    // placas nas costas
    for(let i=0;i<5;i++){ const x=W*(0.28+i*0.1); ctx.beginPath(); ctx.moveTo(x,H*0.44); ctx.lineTo(x+W*0.03,H*0.3); ctx.lineTo(x+W*0.06,H*0.44); ctx.closePath(); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(W*0.18,H*0.58,W*0.015,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
  },
  outlineBronto(ctx,W,H) {
    ctx.beginPath();
    ctx.moveTo(W*0.7,H*0.2);
    ctx.bezierCurveTo(W*0.6,H*0.15, W*0.55,H*0.25, W*0.55,H*0.4);
    ctx.bezierCurveTo(W*0.45,H*0.45, W*0.3,H*0.45, W*0.2,H*0.5);
    ctx.bezierCurveTo(W*0.1,H*0.55, W*0.1,H*0.65, W*0.18,H*0.68);
    ctx.bezierCurveTo(W*0.35,H*0.7, W*0.55,H*0.68, W*0.7,H*0.65);
    ctx.bezierCurveTo(W*0.85,H*0.63, W*0.92,H*0.55, W*0.88,H*0.48);
    ctx.bezierCurveTo(W*0.8,H*0.42, W*0.72,H*0.45, W*0.68,H*0.4);
    ctx.bezierCurveTo(W*0.7,H*0.3, W*0.75,H*0.25, W*0.7,H*0.2);
    ctx.closePath(); ctx.stroke();
    // pernas
    [0.3,0.5,0.7].forEach(fx=>{ ctx.beginPath(); ctx.moveTo(W*fx,H*0.67); ctx.lineTo(W*fx,H*0.85); ctx.lineTo(W*(fx+0.06),H*0.85); ctx.lineTo(W*(fx+0.06),H*0.67); ctx.stroke(); });
    ctx.beginPath(); ctx.arc(W*0.66,H*0.26,W*0.015,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
  },
  setPaintTool(tool) {
    this.paint.tool=tool;
    ['btnBrush','btnBucket','btnEraser'].forEach(id=>document.getElementById(id).classList.remove('active'));
    if(tool==='brush')document.getElementById('btnBrush').classList.add('active');
    if(tool==='bucket')document.getElementById('btnBucket').classList.add('active');
    if(tool==='eraser')document.getElementById('btnEraser').classList.add('active');
  },
  bindPaintEvents() {
    const p=this.paint, cv=p.canvas;
    const getPos=(e)=>{ const r=cv.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return { x:(t.clientX-r.left)*(cv.width/r.width), y:(t.clientY-r.top)*(cv.height/r.height) }; };
    const start=(e)=>{ e.preventDefault(); const pos=getPos(e); if(p.tool==='bucket'){ this.floodFill(Math.floor(pos.x),Math.floor(pos.y),p.color); playSound('pop'); return; } p.drawing=true; p.lastX=pos.x; p.lastY=pos.y; this.paintDot(pos.x,pos.y); };
    const move=(e)=>{ if(!p.drawing)return; e.preventDefault(); const pos=getPos(e); this.paintLine(p.lastX,p.lastY,pos.x,pos.y); p.lastX=pos.x; p.lastY=pos.y; };
    const end=()=>{ p.drawing=false; };
    cv.addEventListener('mousedown',start); cv.addEventListener('mousemove',move); window.addEventListener('mouseup',end);
    cv.addEventListener('touchstart',start,{passive:false}); cv.addEventListener('touchmove',move,{passive:false}); cv.addEventListener('touchend',end);
  },
  paintDot(x,y){ const p=this.paint,ctx=p.ctx; ctx.beginPath(); ctx.fillStyle=p.tool==='eraser'?'#ffffff':p.color; ctx.arc(x,y,p.size/2,0,Math.PI*2); ctx.fill(); },
  paintLine(x1,y1,x2,y2){ const p=this.paint,ctx=p.ctx; ctx.strokeStyle=p.tool==='eraser'?'#ffffff':p.color; ctx.lineWidth=p.size; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); },
  floodFill(sx,sy,hexColor) {
    const p=this.paint,ctx=p.ctx,W=p.canvas.width,H=p.canvas.height;
    const img=ctx.getImageData(0,0,W,H), data=img.data;
    const idx=(x,y)=>(y*W+x)*4;
    const target=[data[idx(sx,sy)],data[idx(sx,sy)+1],data[idx(sx,sy)+2],data[idx(sx,sy)+3]];
    const fc=hexToRgb(hexColor);
    // não pinta sobre linha preta (contorno)
    if(target[0]<60&&target[1]<60&&target[2]<60) return;
    if(Math.abs(target[0]-fc.r)<10&&Math.abs(target[1]-fc.g)<10&&Math.abs(target[2]-fc.b)<10) return;
    const match=(i)=>Math.abs(data[i]-target[0])<40&&Math.abs(data[i+1]-target[1])<40&&Math.abs(data[i+2]-target[2])<40;
    const stack=[[sx,sy]];
    while(stack.length){
      const [x,y]=stack.pop();
      if(x<0||x>=W||y<0||y>=H)continue;
      const i=idx(x,y);
      if(!match(i))continue;
      data[i]=fc.r; data[i+1]=fc.g; data[i+2]=fc.b; data[i+3]=255;
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(img,0,0);
  },
  clearPaint(){ playSound('click'); this.drawDinoOutline(); showToast('🗑️ Tela limpa!'); },
  nextDino(){ playSound('click'); this.paint.dinoType=(this.paint.dinoType+1)%3; this.drawDinoOutline(); const names=['T-Rex','Estegossauro','Pescoçudo']; showToast('🦖 '+names[this.paint.dinoType]); },
  cycleBrushSize(){ const sizes=[8,14,24,36]; const cur=sizes.indexOf(this.paint.size); this.paint.size=sizes[(cur+1)%sizes.length]; playSound('click'); showToast('🖌️ Pincel: '+this.paint.size+'px'); },
  savePaint(){ playSound('skill'); const link=document.createElement('a'); link.download='meu-dino-pintado.png'; link.href=this.paint.canvas.toDataURL('image/png'); link.click(); showToast('💾 Imagem salva!'); },

  /* ===== INTERFACE 4: OVOS ===== */
  egg:{ taps:0, needed:5, hatching:false },
  openEgg(){ playSound('click'); showScreen('eggScreen'); this.currentScreen='egg'; this.egg.taps=0; this.egg.hatching=false; this.updateEggStats(); document.getElementById('eggReveal').classList.remove('active'); document.getElementById('eggElement').textContent='🥚'; },
  updateEggStats(){ setText('eggCrystals',gameState.crystals); setText('eggCollection',gameState.collection.length+'/9'); },
  tapEgg() {
    const e=this.egg;
    if(e.hatching) return;
    e.taps++; playSound('crack');
    const egg=document.getElementById('eggElement');
    egg.classList.remove('shake'); void egg.offsetWidth; egg.classList.add('shake');
    document.getElementById('eggTapHint').textContent='🥚 Rachando... ('+e.taps+'/'+e.needed+')';
    if(e.taps>=e.needed) this.hatchEgg();
  },
  hatchEgg() {
    const e=this.egg; e.hatching=true;
    const egg=document.getElementById('eggElement');
    egg.classList.add('cracking'); egg.textContent='🐣';
    playSound('reveal');
    // sortear herói por raridade
    const hero=this.rollHero();
    setTimeout(()=>{
      const isNew=!gameState.collection.includes(hero.id);
      if(isNew){ gameState.collection.push(hero.id); }
      saveState();
      const rev=document.getElementById('eggReveal');
      setText('revealEmoji',hero.emoji); setText('revealName',hero.name);
      const rar=document.getElementById('revealRarity');
      rar.textContent=(isNew?'NOVO! ':'')+hero.rarity.toUpperCase();
      rar.className='reveal-rarity rarity-'+hero.rarity;
      document.getElementById('revealEmoji').textContent=hero.emoji;
      rev.classList.add('active');
      this.updateEggStats();
    },800);
  },
  rollHero() {
    const r=Math.random()*100;
    let pool;
    if(r<3) pool=HEROES.filter(h=>h.rarity==='mythic');
    else if(r<18) pool=HEROES.filter(h=>h.rarity==='legendary');
    else if(r<45) pool=HEROES.filter(h=>h.rarity==='epic');
    else pool=HEROES.filter(h=>h.rarity==='rare');
    if(!pool||!pool.length) pool=HEROES;
    return pool[Math.floor(Math.random()*pool.length)];
  },
  revealContinue() {
    playSound('click');
    document.getElementById('eggReveal').classList.remove('active');
    document.getElementById('eggElement').textContent='🥚';
    document.getElementById('eggElement').classList.remove('cracking');
    document.getElementById('eggTapHint').textContent='👆 Toque para chocar!';
    this.egg.taps=0; this.egg.hatching=false;
  },
  buyEgg() {
    if(gameState.crystals<30){ showToast('💎 Cristais insuficientes! Vença batalhas.'); return; }
    playSound('skill'); gameState.crystals-=30; saveState(); this.updateEggStats();
    this.egg.taps=0; this.egg.hatching=false;
    document.getElementById('eggElement').textContent='🥚';
    document.getElementById('eggTapHint').textContent='👆 Toque para chocar o novo ovo!';
    showToast('🥚 Novo ovo! Toque para chocar.');
  }
};

/* ============================================================
   HELPERS DE UI
   ============================================================ */
function setText(id,t){ const el=document.getElementById(id); if(el)el.textContent=t; }
function setVar(id,n,v){ const el=document.getElementById(id); if(el)el.style.setProperty(n,v); }
function rewardRow(icon,label,amount){ return `<div class="reward-item"><div class="reward-info"><span class="reward-icon">${icon}</span><span class="reward-label">${label}</span></div><div class="reward-amount">${amount}</div></div>`; }
function hexToRgb(hex){ hex=hex.replace('#',''); if(hex.length===3)hex=hex.split('').map(c=>c+c).join(''); const n=parseInt(hex,16); return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 }; }

function showScreen(id) {
  ['menuScreen','heroSelectScreen','memoryScreen','paintScreen','eggScreen','battleScreen','resultScreen'].forEach(s=>document.getElementById(s).classList.remove('active'));
  document.getElementById('upgradeModal').classList.remove('active');
  document.getElementById(id).classList.add('active');
}
function showDamagePopup(value,isPlayer,isCrit) {
  const p=document.createElement('div');
  p.className='damage-popup'+(isPlayer?' player':'')+(isCrit?' crit':'');
  p.textContent=(isCrit?'💥':'')+'-'+value;
  p.style.left=(isPlayer?innerWidth*0.6+Math.random()*80:innerWidth*0.2+Math.random()*80)+'px';
  p.style.top=(innerHeight*0.4+Math.random()*40)+'px';
  document.getElementById('battleScreen').appendChild(p);
  setTimeout(()=>p.remove(),1000);
}
function showBattleMessage(text) {
  const ex=document.querySelector('.battle-message'); if(ex)ex.remove();
  const m=document.createElement('div'); m.className='battle-message'; m.textContent=text;
  document.getElementById('battleScreen').appendChild(m);
  setTimeout(()=>m.remove(),1500);
}
function showToast(text) {
  const t=document.getElementById('toast'); t.textContent=text; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}
function updateLoadingProgress(pct,text){ const b=document.getElementById('loadingProgress'); const t=document.getElementById('loadingText'); if(b)b.style.width=pct+'%'; if(t&&text)t.textContent=text; }

/* ============================================================
   BOTÕES
   ============================================================ */
function bindButtons() {
  document.getElementById('btnStartBattle').addEventListener('click',()=>game.startBattle());
  document.getElementById('btnMemory').addEventListener('click',()=>game.openMemory());
  document.getElementById('btnPaint').addEventListener('click',()=>game.openPaint());
  document.getElementById('btnEgg').addEventListener('click',()=>game.openEgg());
  document.getElementById('btnHeroSelect').addEventListener('click',()=>game.openHeroSelect());
  document.getElementById('btnUpgrades').addEventListener('click',()=>game.openUpgrades());
  document.getElementById('btnBackFromHeroes').addEventListener('click',()=>game.goToMenu());
  document.getElementById('btnBackFromMemory').addEventListener('click',()=>game.goToMenu());
  document.getElementById('btnBackFromPaint').addEventListener('click',()=>game.goToMenu());
  document.getElementById('btnBackFromEgg').addEventListener('click',()=>game.goToMenu());
  document.getElementById('btnRestartMemory').addEventListener('click',()=>game.startMemoryGame());
  document.getElementById('btnAttack').addEventListener('click',()=>game.attack());
  document.getElementById('btnSkill').addEventListener('click',()=>game.useSkill());
  document.getElementById('btnDefend').addEventListener('click',()=>game.defend());
  document.getElementById('btnExitBattle').addEventListener('click',()=>game.exitBattle());
  document.getElementById('btnContinue').addEventListener('click',()=>game.continueAfterResult());
  document.getElementById('btnCloseUpgrades').addEventListener('click',()=>game.closeUpgrades());
  // Pintura
  document.getElementById('btnBrush').addEventListener('click',()=>{ playSound('click'); game.setPaintTool('brush'); });
  document.getElementById('btnBucket').addEventListener('click',()=>{ playSound('click'); game.setPaintTool('bucket'); });
  document.getElementById('btnEraser').addEventListener('click',()=>{ playSound('click'); game.setPaintTool('eraser'); });
  document.getElementById('btnBrushSize').addEventListener('click',()=>game.cycleBrushSize());
  document.getElementById('btnClearPaint').addEventListener('click',()=>game.clearPaint());
  document.getElementById('btnNextDino').addEventListener('click',()=>game.nextDino());
  document.getElementById('btnSavePaint').addEventListener('click',()=>game.savePaint());
  // Ovos
  document.getElementById('eggContainer').addEventListener('click',()=>game.tapEgg());
  document.getElementById('btnRevealContinue').addEventListener('click',()=>game.revealContinue());
  document.getElementById('btnBuyEgg').addEventListener('click',()=>game.buyEgg());
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('resize',()=>{ if(renderer&&camera){ renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); } });
document.addEventListener('touchstart',initAudio,{once:true});
document.addEventListener('click',initAudio,{once:true});

window.addEventListener('load',()=>{
  loadState(); bindButtons();
  updateLoadingProgress(20,'Carregando 3D...');
  if(typeof THREE==='undefined'){ updateLoadingProgress(100,'Erro: Three.js não carregou.'); return; }
  setTimeout(()=>{
    updateLoadingProgress(60,'Criando dinossauros...');
    try {
      initThree();
      updateLoadingProgress(100,'Pronto!');
      setTimeout(()=>{ document.getElementById('loadingScreen').classList.add('hide'); document.getElementById('menuScreen').classList.add('active'); game.currentScreen='menu'; game.updateMenuStats(); },600);
    } catch(err){ console.error(err); updateLoadingProgress(100,'Erro ao iniciar. Recarregue.'); }
  },400);
});
