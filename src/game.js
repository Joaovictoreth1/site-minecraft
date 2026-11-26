import * as THREE from 'three';

const updateLoading = (pct, text) => {
  let b = document.getElementById('loader-fill'),
    l = document.getElementById('loader-text');
  if (b) b.style.width = pct + '%';
  if (l) l.innerText = text;
};

const showToast = (msg) => {
  let c = document.getElementById('toast-container');
  if (!c) return;
  let t = document.createElement('div');
  t.className = 'toast';
  t.innerText = msg;
  c.appendChild(t);
  setTimeout(() => {
    if (t.parentNode) c.removeChild(t);
  }, 3200);
};

const SPLASH_TEXTS = [
  'Edição Clássica Xbox 360!',
  'Agora com Creepers!',
  'Cuidado com o Ssssss!',
  'Abre o Baú Inicial!',
  '4 Biomas para Explorar!',
  '100G em Conquistas!',
  'Texturas 16x16 Melhoradas!',
];

const ACHIEVEMENTS_LIST = [
  {
    id: 'Taking Inventory',
    title: 'Taking Inventory',
    desc: 'Abre o teu inventário ou menu de criação com [E].',
    score: 10,
    unlocked: false,
  },
  {
    id: 'Chest Hunter',
    title: 'Chest Hunter',
    desc: 'Abre ou recolhe o Baú Inicial no forte.',
    score: 10,
    unlocked: false,
  },
  {
    id: 'Getting Wood',
    title: 'Getting Wood',
    desc: 'Extrai um bloco de tronco de uma árvore.',
    score: 15,
    unlocked: false,
  },
  {
    id: 'Benchmarking',
    title: 'Benchmarking',
    desc: 'Fabrica uma Bancada de Trabalho.',
    score: 15,
    unlocked: false,
  },
  {
    id: 'Time to Strike',
    title: 'Time to Strike!',
    desc: 'Fabrica uma Picareta, Machado ou Espada.',
    score: 15,
    unlocked: false,
  },
  {
    id: 'Getting an Upgrade',
    title: 'Getting an Upgrade',
    desc: 'Fabrica uma Picareta ou Espada de Pedra.',
    score: 15,
    unlocked: false,
  },
  {
    id: 'Monster Hunter',
    title: 'Monster Hunter',
    desc: 'Ataca e derrota um Zombie ou Creeper.',
    score: 10,
    unlocked: false,
  },
  {
    id: 'Adventurer',
    title: 'Adventurer',
    desc: 'Descobre pelo menos 3 biomas diferentes.',
    score: 10,
    unlocked: false,
  },
];

class XboxAchv {
  static unlock(id) {
    let ach = ACHIEVEMENTS_LIST.find((a) => a.id === id);
    if (!ach || ach.unlocked) return;
    ach.unlocked = true;

    let el = document.getElementById('achiev-popup');
    let title = document.getElementById('achiev-name');
    if (el && title) {
      title.innerText = `${ach.score}G - ${ach.title}`;
      el.classList.add('show');
      if (window.App && window.App.audio) window.App.audio.playAchievement();
      setTimeout(() => el.classList.remove('show'), 4400);
    }
    XboxAchv.updateUI();
  }

  static getTotalScore() {
    return ACHIEVEMENTS_LIST.reduce(
      (acc, a) => acc + (a.unlocked ? a.score : 0),
      0,
    );
  }

  static updateUI() {
    let total = XboxAchv.getTotalScore();
    let m1 = document.getElementById('menu-gamerscore');
    let m2 = document.getElementById('modal-gamerscore');
    if (m1) m1.innerText = `${total}/100G`;
    if (m2) m2.innerText = `${total} / 100 G`;

    let cont = document.getElementById('achv-list-container');
    if (!cont) return;
    cont.innerHTML = '';
    ACHIEVEMENTS_LIST.forEach((a) => {
      let row = document.createElement('div');
      row.className = `flex justify-between items-center p-3 border-2 ${a.unlocked ? 'bg-emerald-900/20 border-emerald-600' : 'bg-zinc-300 border-zinc-500 opacity-75'}`;
      row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center font-black text-white ${a.unlocked ? 'bg-emerald-600 shadow' : 'bg-zinc-600'}">
                        ${a.unlocked ? '✓' : '🔒'}
                    </div>
                    <div>
                        <div class="font-black text-sm text-zinc-900">${a.title}</div>
                        <div class="text-xs text-zinc-700 font-semibold">${a.desc}</div>
                    </div>
                </div>
                <div class="font-black text-sm px-2 py-1 ${a.unlocked ? 'bg-emerald-600 text-white' : 'bg-zinc-400 text-zinc-800'}">${a.score}G</div>
            `;
      cont.appendChild(row);
    });
  }
}

class TutorialManager {
  constructor() {
    this.step = 1;
    this.steps = [
      '',
      'Olha para o <b>Baú Inicial</b> à tua frente no forte e clica com o <b>Botão Direito</b> (ou parte-o) para recolher os suprimentos!',
      'Boa! Agora sai do forte, aproxima-te de uma <b>Árvore</b> e segura o <b>Botão Esquerdo</b> no tronco para extrair Madeira.',
      'Madeira recolhida! Pressiona <b>[E]</b> para abrir o Menu Xbox e fabrica <b>Tábuas de Carvalho</b>.',
      'Agora no menu <b>[E]</b>, fabrica uma <b>Bancada de Trabalho</b> para desbloquear o teu acampamento!',
      'Excelente! Vai à 2.ª aba (Ferramentas) no menu <b>[E]</b> e fabrica uma <b>Picareta</b>, <b>Machado</b> ou <b>Espada</b>.',
      'Tutorial Concluído! Explora os <b>4 Biomas</b> (Floresta, Deserto, Neve e Montanhas) e sobrevive aos <b>Zombies e Creepers</b>!',
    ];
  }
  completeStep(targetStep) {
    if (this.step === targetStep && this.step < 6) {
      this.step++;
      let badge = document.getElementById('tut-step-badge');
      let text = document.getElementById('tut-text');
      let bar = document.getElementById('tut-progress-bar');
      if (badge)
        badge.innerText =
          this.step === 6 ? 'Completo!' : `Passo ${this.step}/5`;
      if (text) text.innerHTML = this.steps[this.step];
      if (bar) bar.style.width = `${Math.min(100, this.step * 20)}%`;
    }
  }
}

class AudioManager {
  constructor() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = AudioCtx ? new AudioCtx() : null;
    this.noiseBuffer = this.ctx ? this.createNoiseBuffer() : null;
  }

  createNoiseBuffer() {
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, sr * 1.5, sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playNoise(filterType, freq, duration, vol, pitchDrop = false) {
    if (!this.ctx || !this.noiseBuffer) return;
    this.resume();
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, t);
    if (pitchDrop) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(40, freq * 0.25),
        t + duration,
      );
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start(t);
    src.stop(t + duration);
  }

  playTone(freq, type, duration, vol, endFreq = null) {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    }
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  playUI() {
    this.playTone(740, 'sine', 0.06, 0.15, 880);
  }
  playCraft() {
    this.playNoise('bandpass', 1100, 0.12, 0.25, true);
    this.playTone(220, 'triangle', 0.1, 0.25, 440);
    setTimeout(() => {
      this.playTone(330, 'triangle', 0.12, 0.25, 580);
    }, 75);
  }

  playChestOpen() {
    this.playTone(180, 'sawtooth', 0.18, 0.2, 320);
    setTimeout(() => this.playTone(420, 'sine', 0.15, 0.2, 520), 120);
  }

  playMineStep(material) {
    if (material === 'wood') {
      this.playTone(135, 'triangle', 0.06, 0.14, 95);
      this.playNoise('bandpass', 600, 0.05, 0.12);
    } else if (material === 'stone') {
      this.playTone(420, 'square', 0.04, 0.08, 260);
      this.playNoise('highpass', 1800, 0.04, 0.1);
    } else if (material === 'sand' || material === 'snow') {
      this.playNoise('bandpass', 2400, 0.06, 0.12);
    } else {
      this.playNoise('bandpass', 950, 0.06, 0.14);
    }
  }

  playDig(material) {
    if (material === 'wood') {
      this.playTone(165, 'triangle', 0.16, 0.3, 75);
      this.playNoise('bandpass', 750, 0.14, 0.28, true);
    } else if (material === 'stone') {
      this.playTone(320, 'square', 0.12, 0.18, 120);
      this.playNoise('bandpass', 1400, 0.15, 0.3, true);
    } else if (material === 'glass') {
      this.playTone(1400, 'sine', 0.09, 0.2, 600);
      setTimeout(() => this.playTone(1950, 'sine', 0.08, 0.18, 900), 40);
      this.playNoise('highpass', 3200, 0.12, 0.25);
    } else if (material === 'sand' || material === 'snow') {
      this.playNoise('bandpass', 2100, 0.16, 0.26, true);
    } else {
      this.playNoise('bandpass', 850, 0.16, 0.32, true);
      this.playTone(110, 'sawtooth', 0.1, 0.15, 65);
    }
  }

  playPlace(material) {
    if (material === 'wood') {
      this.playTone(190, 'triangle', 0.11, 0.26, 130);
      this.playNoise('bandpass', 700, 0.08, 0.15);
    } else if (material === 'stone') {
      this.playTone(260, 'square', 0.09, 0.2, 170);
      this.playNoise('bandpass', 1200, 0.08, 0.2);
    } else {
      this.playNoise('bandpass', 950, 0.11, 0.24, true);
      this.playTone(130, 'sine', 0.08, 0.18, 95);
    }
  }

  playEat() {
    this.playNoise('bandpass', 1100, 0.09, 0.25);
    setTimeout(() => this.playNoise('bandpass', 1300, 0.09, 0.25), 110);
    setTimeout(() => this.playTone(320, 'sine', 0.12, 0.2, 480), 220);
  }

  playHit() {
    this.playNoise('lowpass', 600, 0.15, 0.35, true);
    this.playTone(160, 'sawtooth', 0.15, 0.28, 70);
  }

  playPop() {
    this.playTone(480, 'sine', 0.07, 0.22, 880);
  }
  playZombie() {
    this.playTone(95, 'sawtooth', 0.32, 0.22, 65);
    this.playNoise('lowpass', 350, 0.25, 0.15);
  }
  playPig() {
    this.playTone(210, 'triangle', 0.14, 0.18, 290);
    setTimeout(() => this.playTone(190, 'triangle', 0.12, 0.15, 250), 90);
  }
  playFuse() {
    this.playNoise('highpass', 2600, 1.2, 0.32, false);
  }
  playExplosion() {
    this.playNoise('lowpass', 380, 0.85, 0.65, true);
    this.playTone(95, 'sawtooth', 0.6, 0.45, 28);
  }

  playAchievement() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(340, t);
    popOsc.frequency.exponentialRampToValueAtTime(680, t + 0.08);
    popGain.gain.setValueAtTime(0.25, t);
    popGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(t);
    popOsc.stop(t + 0.1);

    const notes = [
      { f: 987.77, start: 0.07, dur: 0.38 },
      { f: 1318.51, start: 0.17, dur: 0.65 },
      { f: 1975.53, start: 0.17, dur: 0.55 },
    ];
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.start);
      g.gain.setValueAtTime(0.001, t + n.start);
      g.gain.linearRampToValueAtTime(0.22, t + n.start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + n.start + n.dur);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t + n.start);
      osc.stop(t + n.start + n.dur);
    });
  }
}

const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COBBLESTONE: 4,
  WOOD: 5,
  LEAVES: 6,
  SAND: 7,
  WATER: 8,
  GLASS: 9,
  PLANKS: 10,
  GOLD: 11,
  SNOW: 12,
  BEDROCK: 13,
  COAL_ORE: 14,
  IRON_ORE: 15,
  DIAMOND_ORE: 16,
  BRICKS: 17,
  OBSIDIAN: 18,
  CACTUS: 20,
  BOOKSHELF: 23,
  CRAFTING_TABLE: 24,
  RED_FLOWER: 25,
  YELLOW_FLOWER: 26,
  TORCH: 27,
  CHEST: 28,
  PICKAXE: 100,
  AXE: 101,
  SWORD: 102,
  STICK: 103,
  APPLE: 104,
  ROTTEN_FLESH: 105,
  STONE_PICKAXE: 106,
  STONE_SWORD: 107,
  PORKCHOP: 108,
};

const BLOCK_PROPS = {
  [BLOCKS.AIR]: {
    solid: false,
    trans: true,
    liquid: false,
    hardness: 0,
    name: 'Ar',
  },
  [BLOCKS.GRASS]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 0.6,
    name: 'Bloco de Erva',
    sound: 'grass',
  },
  [BLOCKS.DIRT]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 0.5,
    name: 'Terra',
    sound: 'dirt',
  },
  [BLOCKS.STONE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 2.2,
    name: 'Pedra',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.COBBLESTONE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 2.2,
    name: 'Pedregulho',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.WOOD]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 1.6,
    name: 'Tronco de Carvalho',
    sound: 'wood',
    tool: 'axe',
  },
  [BLOCKS.LEAVES]: {
    solid: true,
    trans: true,
    liquid: false,
    hardness: 0.25,
    name: 'Folhas de Carvalho',
    sound: 'grass',
    isFlora: true,
  },
  [BLOCKS.SAND]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 0.5,
    name: 'Areia',
    sound: 'sand',
  },
  [BLOCKS.WATER]: {
    solid: false,
    trans: true,
    liquid: true,
    hardness: -1,
    name: 'Água',
  },
  [BLOCKS.GLASS]: {
    solid: true,
    trans: true,
    liquid: false,
    hardness: 0.3,
    name: 'Vidro',
    sound: 'glass',
  },
  [BLOCKS.PLANKS]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 1.6,
    name: 'Tábuas de Carvalho',
    sound: 'wood',
    tool: 'axe',
  },
  [BLOCKS.GOLD]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 3.0,
    name: 'Minério de Ouro',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.SNOW]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 0.4,
    name: 'Bloco de Neve',
    sound: 'snow',
  },
  [BLOCKS.BEDROCK]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: Infinity,
    name: 'Rocha Matriz',
    sound: 'stone',
  },
  [BLOCKS.COAL_ORE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 2.5,
    name: 'Minério de Carvão',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.IRON_ORE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 3.0,
    name: 'Minério de Ferro',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.DIAMOND_ORE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 4.0,
    name: 'Minério de Diamante',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.BRICKS]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 2.5,
    name: 'Tijolos',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.OBSIDIAN]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 8.0,
    name: 'Obsidiana',
    sound: 'stone',
    tool: 'pickaxe',
  },
  [BLOCKS.CACTUS]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 0.4,
    name: 'Cacto do Deserto',
    sound: 'wood',
  },
  [BLOCKS.BOOKSHELF]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 1.5,
    name: 'Estante de Livros',
    sound: 'wood',
    tool: 'axe',
  },
  [BLOCKS.CRAFTING_TABLE]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 1.5,
    name: 'Bancada de Trabalho',
    sound: 'wood',
    tool: 'axe',
  },
  [BLOCKS.RED_FLOWER]: {
    solid: false,
    trans: true,
    liquid: false,
    hardness: 0.05,
    name: 'Papoila Vermelha',
    sound: 'grass',
    isFlora: true,
  },
  [BLOCKS.YELLOW_FLOWER]: {
    solid: false,
    trans: true,
    liquid: false,
    hardness: 0.05,
    name: 'Dente-de-Leão',
    sound: 'grass',
    isFlora: true,
  },
  [BLOCKS.TORCH]: {
    solid: false,
    trans: true,
    liquid: false,
    hardness: 0.05,
    name: 'Tocha',
    sound: 'wood',
    isFlora: true,
    light: true,
  },
  [BLOCKS.CHEST]: {
    solid: true,
    trans: false,
    liquid: false,
    hardness: 1.5,
    name: 'Baú Inicial',
    sound: 'wood',
    tool: 'axe',
  },

  [BLOCKS.PICKAXE]: {
    isItem: true,
    name: 'Picareta de Madeira',
    toolType: 'pickaxe',
    multiplier: 5.5,
    dmg: 3,
  },
  [BLOCKS.AXE]: {
    isItem: true,
    name: 'Machado de Madeira',
    toolType: 'axe',
    multiplier: 5.5,
    dmg: 4,
  },
  [BLOCKS.SWORD]: {
    isItem: true,
    name: 'Espada de Madeira',
    toolType: 'sword',
    multiplier: 1.5,
    dmg: 6,
  },
  [BLOCKS.STONE_PICKAXE]: {
    isItem: true,
    name: 'Picareta de Pedra',
    toolType: 'pickaxe',
    multiplier: 9.5,
    dmg: 4,
  },
  [BLOCKS.STONE_SWORD]: {
    isItem: true,
    name: 'Espada de Pedra',
    toolType: 'sword',
    multiplier: 1.8,
    dmg: 8,
  },
  [BLOCKS.STICK]: { isItem: true, name: 'Graveto' },
  [BLOCKS.APPLE]: {
    isItem: true,
    name: 'Maçã Vermelha (+2 ❤️ / +4 🍖)',
    type: 'food',
    heal: 4,
    food: 4,
  },
  [BLOCKS.PORKCHOP]: {
    isItem: true,
    name: 'Costeleta de Porco (+3 ❤️ / +6 🍖)',
    type: 'food',
    heal: 6,
    food: 6,
  },
  [BLOCKS.ROTTEN_FLESH]: {
    isItem: true,
    name: 'Carne Podre (+1 ❤️ / +2 🍖)',
    type: 'food',
    heal: 2,
    food: 2,
  },
};

const RECIPE_CATEGORIES = [
  {
    id: 'structures',
    icon: BLOCKS.CRAFTING_TABLE,
    name: 'Estruturas & Blocos',
  },
  { id: 'tools', icon: BLOCKS.PICKAXE, name: 'Ferramentas & Armas' },
  { id: 'misc', icon: BLOCKS.TORCH, name: 'Iluminação & Decoração' },
];

const RECIPES = [
  {
    res: BLOCKS.PLANKS,
    count: 4,
    name: 'Tábuas de Carvalho',
    cat: 'structures',
    req: [[BLOCKS.WOOD, 1]],
    grid: [BLOCKS.WOOD, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    res: BLOCKS.CRAFTING_TABLE,
    count: 1,
    name: 'Bancada de Trabalho',
    cat: 'structures',
    req: [[BLOCKS.PLANKS, 4]],
    grid: [
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      0,
      0,
      0,
    ],
  },
  {
    res: BLOCKS.CHEST,
    count: 1,
    name: 'Baú de Madeira',
    cat: 'structures',
    req: [[BLOCKS.PLANKS, 8]],
    grid: [
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
    ],
  },
  {
    res: BLOCKS.BRICKS,
    count: 4,
    name: 'Bloco de Tijolos',
    cat: 'structures',
    req: [[BLOCKS.COBBLESTONE, 4]],
    grid: [
      BLOCKS.COBBLESTONE,
      BLOCKS.COBBLESTONE,
      0,
      BLOCKS.COBBLESTONE,
      BLOCKS.COBBLESTONE,
      0,
      0,
      0,
      0,
    ],
  },

  {
    res: BLOCKS.STICK,
    count: 4,
    name: 'Gravetos',
    cat: 'tools',
    req: [[BLOCKS.PLANKS, 2]],
    grid: [BLOCKS.PLANKS, 0, 0, BLOCKS.PLANKS, 0, 0, 0, 0, 0],
  },
  {
    res: BLOCKS.PICKAXE,
    count: 1,
    name: 'Picareta de Madeira',
    cat: 'tools',
    req: [
      [BLOCKS.PLANKS, 3],
      [BLOCKS.STICK, 2],
    ],
    grid: [
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      BLOCKS.STICK,
      0,
      0,
      BLOCKS.STICK,
      0,
    ],
  },
  {
    res: BLOCKS.AXE,
    count: 1,
    name: 'Machado de Madeira',
    cat: 'tools',
    req: [
      [BLOCKS.PLANKS, 3],
      [BLOCKS.STICK, 2],
    ],
    grid: [
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      BLOCKS.PLANKS,
      BLOCKS.STICK,
      0,
      0,
      BLOCKS.STICK,
      0,
    ],
  },
  {
    res: BLOCKS.SWORD,
    count: 1,
    name: 'Espada de Madeira',
    cat: 'tools',
    req: [
      [BLOCKS.PLANKS, 2],
      [BLOCKS.STICK, 1],
    ],
    grid: [0, BLOCKS.PLANKS, 0, 0, BLOCKS.PLANKS, 0, 0, BLOCKS.STICK, 0],
  },
  {
    res: BLOCKS.STONE_PICKAXE,
    count: 1,
    name: 'Picareta de Pedra',
    cat: 'tools',
    req: [
      [BLOCKS.COBBLESTONE, 3],
      [BLOCKS.STICK, 2],
    ],
    grid: [
      BLOCKS.COBBLESTONE,
      BLOCKS.COBBLESTONE,
      BLOCKS.COBBLESTONE,
      0,
      BLOCKS.STICK,
      0,
      0,
      BLOCKS.STICK,
      0,
    ],
  },
  {
    res: BLOCKS.STONE_SWORD,
    count: 1,
    name: 'Espada de Pedra',
    cat: 'tools',
    req: [
      [BLOCKS.COBBLESTONE, 2],
      [BLOCKS.STICK, 1],
    ],
    grid: [
      0,
      BLOCKS.COBBLESTONE,
      0,
      0,
      BLOCKS.COBBLESTONE,
      0,
      0,
      BLOCKS.STICK,
      0,
    ],
  },

  {
    res: BLOCKS.TORCH,
    count: 4,
    name: 'Tochas',
    cat: 'misc',
    req: [
      [BLOCKS.COAL_ORE, 1],
      [BLOCKS.STICK, 1],
    ],
    grid: [0, 0, 0, BLOCKS.COAL_ORE, 0, 0, BLOCKS.STICK, 0, 0],
  },
  {
    res: BLOCKS.TORCH,
    count: 2,
    name: 'Tochas de Madeira',
    cat: 'misc',
    req: [
      [BLOCKS.WOOD, 1],
      [BLOCKS.STICK, 1],
    ],
    grid: [0, 0, 0, BLOCKS.WOOD, 0, 0, BLOCKS.STICK, 0, 0],
  },
  {
    res: BLOCKS.GLASS,
    count: 2,
    name: 'Vidro Cristalino',
    cat: 'misc',
    req: [[BLOCKS.SAND, 2]],
    grid: [BLOCKS.SAND, BLOCKS.SAND, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    res: BLOCKS.BOOKSHELF,
    count: 1,
    name: 'Estante de Livros',
    cat: 'misc',
    req: [[BLOCKS.PLANKS, 6]],
    grid: [
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      0,
      0,
      0,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
      BLOCKS.PLANKS,
    ],
  },
];

let CONFIG = {
  CHUNK_SIZE: 16,
  CHUNK_HEIGHT: 64,
  WATER_LEVEL: 20,
  RENDER_DISTANCE: 3,
  UNLOAD_DISTANCE: 5,
  FOV: 78,
};

class SimpleNoise {
  constructor(seedOffset = 0) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++)
      this.p[i] = (i * 131 + seedOffset * 17 + 73) & 255;
  }
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  lerp(t, a, b) {
    return a + t * (b - a);
  }
  grad(h, x, z) {
    let h0 = (h || 0) & 3;
    let u = h0 < 2 ? x : z,
      v = h0 < 2 ? z : x;
    return ((h0 & 1) === 0 ? u : -u) + ((h0 & 2) === 0 ? v : -v);
  }
  noise(x, z) {
    let X = Math.floor(x) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    z -= Math.floor(z);
    let u = this.fade(x),
      w = this.fade(z);
    let A = (this.p[X] + Z) & 255,
      AA = this.p[A & 255],
      AB = this.p[(A + 1) & 255];
    let B = (this.p[(X + 1) & 255] + Z) & 255,
      BA = this.p[B & 255],
      BB = this.p[(B + 1) & 255];
    return this.lerp(
      w,
      this.lerp(u, this.grad(AA, x, z), this.grad(BA, x - 1, z)),
      this.lerp(u, this.grad(AB, x, z - 1), this.grad(BB, x - 1, z - 1)),
    );
  }
  fBm(x, z, oct = 3, sc = 0.03) {
    let t = 0,
      a = 1,
      f = sc,
      m = 0;
    for (let i = 0; i < oct; i++) {
      t += this.noise(x * f, z * f) * a;
      m += a;
      a *= 0.5;
      f *= 2;
    }
    return t / m;
  }
}
const bGen = new SimpleNoise(12);
const nGen = new SimpleNoise(99);
const tempGen = new SimpleNoise(245);

class AtlasGen {
  constructor() {
    this.s = 32;
    this.c = 16;
    this.cv = document.createElement('canvas');
    this.cv.width = this.s * this.c;
    this.cv.height = this.s * this.c;
    this.ctx = this.cv.getContext('2d', { alpha: true });
    this.map = {};
    this.ui = {};
    this.gen();
  }

  getMap(id) {
    return this.map[id] || this.map[BLOCKS.STONE] || [4, 4, 4, 4, 4, 4];
  }

  drawPixelArt(cx, cy, s, art, pal) {
    if (!art || !Array.isArray(art)) return;
    let ps = s / 16;
    for (let y = 0; y < 16; y++) {
      const row = art[y];
      if (!row) continue;
      for (let x = 0; x < 16; x++) {
        let c = row[x];
        if (c && c !== ' ' && pal[c]) {
          this.ctx.fillStyle = pal[c];
          this.ctx.fillRect(cx + x * ps, cy + y * ps, ps, ps);
        }
      }
    }
  }

  draw(idx, t) {
    const cx = (idx % this.c) * this.s,
      cy = Math.floor(idx / this.c) * this.s,
      s = this.s;
    let rb = 120,
      gb = 120,
      bb = 120,
      v = 15;

    const pixelTypes = [
      'pickaxe',
      'axe',
      'sword',
      'stone_pickaxe',
      'stone_sword',
      'porkchop',
      'crafting_table',
      'bookshelf',
      'torch',
      'red_flower',
      'yellow_flower',
      'stick',
      'apple',
      'rotten_flesh',
      'wood_side',
      'wood_top',
      'leaves',
      'chest_front',
      'chest_top',
      'cactus',
      'creeper_face',
      'creeper_body',
      'steve_face',
      'pig_face',
      'zombie_shirt',
      'zombie_pants',
    ];

    if (pixelTypes.includes(t)) {
      let pal = {
        s: '#6a401c',
        i: '#d4d4d8',
        d: '#71717a',
        w: '#ffffff',
        h: '#422811',
        k: '#cca482',
        e: '#ffffff',
        p: '#f2a9af',
        n: '#d88a91',
        b: '#111111',
        B: '#0a0a0a',
        r: '#dc2626',
        g: '#4d9e34',
        y: '#facc15',
        x: '#27272a',
        j: '#8a5c33',
        z: '#234216',
        f: '#49822a',
        o: '#ffaa00',
        t: '#ffff55',
        T: '#3e2723',
        v: '#5d4037',
        R: '#8d6e63',
        m: '#a1887f',
        L: '#2e6b1e',
        l: '#48912a',
        D: '#1b4710',
        G: '#64ad42',
        Z: '#009696',
        P: '#323296',
        F: '#285A28',
        C: '#b47828',
        c: '#8f5b18',
        K: '#18181b',
        Y: '#fde047',
        S: '#9ca3af',
        Q: '#6b7280',
        M: '#f87171',
        W: '#fecaca',
      };
      let art = [];
      if (t === 'pickaxe')
        art = [
          '  wiiiiiiiiw    ',
          ' wjj      jjw   ',
          ' wjw      wsw   ',
          '  w        sw   ',
          '         sw     ',
          '        sw      ',
          '       sw       ',
          '      sw        ',
          '     sw         ',
          '    sw          ',
          '   sw           ',
          '  sw            ',
          '  w             ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'stone_pickaxe')
        art = [
          '  wSSSSSSSSw    ',
          ' wQQ      QQw   ',
          ' wQw      wsw   ',
          '  w        sw   ',
          '         sw     ',
          '        sw      ',
          '       sw       ',
          '      sw        ',
          '     sw         ',
          '    sw          ',
          '   sw           ',
          '  sw            ',
          '  w             ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'axe')
        art = [
          '  wjjjw         ',
          '  wjsjjw        ',
          '  wjssjwsw      ',
          '   wjw sw       ',
          '    w  sw       ',
          '      sw        ',
          '     sw         ',
          '    sw          ',
          '   sw           ',
          '  sw            ',
          '  w             ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'sword')
        art = [
          '             w  ',
          '            wjw ',
          '           wjsw ',
          '          wjsw  ',
          '         wjsw   ',
          '        wjsw    ',
          '       wjsw     ',
          '      wjsw      ',
          '     wjsw       ',
          '    wjsw        ',
          '  s wjsw        ',
          ' sws w          ',
          '  ws            ',
          '   w            ',
          '                ',
          '                ',
        ];
      else if (t === 'stone_sword')
        art = [
          '             w  ',
          '            wSw ',
          '           wSQw ',
          '          wSQw  ',
          '         wSQw   ',
          '        wSQw    ',
          '       wSQw     ',
          '      wSQw      ',
          '     wSQw       ',
          '    wSQw        ',
          '  s wSQw        ',
          ' sws w          ',
          '  ws            ',
          '   w            ',
          '                ',
          '                ',
        ];
      else if (t === 'porkchop')
        art = [
          '                ',
          '                ',
          '     WWWWWW     ',
          '    WMMMMMMW    ',
          '   WMMWMMMMMW   ',
          '   WMWMMMMMMW   ',
          '   WMMMMMMMW    ',
          '    WMMMMMW     ',
          '     WWWWW      ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'stick')
        art = [
          '                ',
          '       s        ',
          '      sjs       ',
          '      js        ',
          '     sjs        ',
          '     js         ',
          '    sjs         ',
          '    js          ',
          '   sjs          ',
          '   js           ',
          '  sjs           ',
          '  js            ',
          '   s            ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'apple')
        art = [
          '                ',
          '       j        ',
          '      j g       ',
          '      rrrr      ',
          '     rrrrrr     ',
          '    rrwrrrrr    ',
          '    rwrrrrrr    ',
          '    rrrrrrrr    ',
          '    rrrrrrrr    ',
          '     rrrrrr     ',
          '      rrrr      ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'rotten_flesh')
        art = [
          '                ',
          '                ',
          '      FFFF      ',
          '     FZFFZF     ',
          '     FFFFFF     ',
          '    ZFZZFZF     ',
          '    FFFFFFFZ    ',
          '    ZFFFFFFZ    ',
          '     ZFZZFF     ',
          '      FFFF      ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'red_flower')
        art = [
          '                ',
          '                ',
          '      rrrr      ',
          '     rrrrrr     ',
          '     rryyrr     ',
          '      rrrr      ',
          '       gg       ',
          '      gggg      ',
          '     gg gg      ',
          '       gg       ',
          '       gg       ',
          '       gg       ',
          '      gggg      ',
          '       gg       ',
          '       gg       ',
          '      gggg      ',
        ];
      else if (t === 'yellow_flower')
        art = [
          '                ',
          '                ',
          '      yyyy      ',
          '     yyyyyy     ',
          '     yyooyy     ',
          '      yyyy      ',
          '       gg       ',
          '      gggg      ',
          '     gg gg      ',
          '       gg       ',
          '       gg       ',
          '       gg       ',
          '      gggg      ',
          '       gg       ',
          '       gg       ',
          '      gggg      ',
        ];
      else if (t === 'crafting_table')
        art = [
          'CCCCCCCCCCCCCCCC',
          'CsssssiiissssssC',
          'CsssssiiissssssC',
          'CsswwsssssssswsC',
          'CsswwsssssssswsC',
          'CKKKKKKKKKKKKKKC',
          'CcjsssssxxxsxxxC',
          'CcjssssxxsxxsxxC',
          'CcjssssxxsxxsssC',
          'CcjssssssssssssC',
          'CcjssssssssssssC',
          'CcjssxxxssssssxC',
          'CcjssxxxssssxssC',
          'CcjssxxxsssxxssC',
          'CCCCCCCCCCCCCCCC',
          'KKKKKKKKKKKKKKKK',
        ];
      else if (t === 'bookshelf')
        art = [
          'CCCCCCCCCCCCCCCC',
          'CCCCCCCCCCCCCCCC',
          'xrxxyxxyyxxbxbxx',
          'xrxxyxxyyxxbxbxx',
          'xrxxyxxyyxxbxbxx',
          'xrxxyxxyyxxbxbxx',
          'CCCCCCCCCCCCCCCC',
          'CCCCCCCCCCCCCCCC',
          'xxbxxrxxyxxybxyx',
          'xxbxxrxxyxxybxyx',
          'xxbxxrxxyxxybxyx',
          'xxbxxrxxyxxybxyx',
          'CCCCCCCCCCCCCCCC',
          'CCCCCCCCCCCCCCCC',
          'CCCCCCCCCCCCCCCC',
          'CCCCCCCCCCCCCCCC',
        ];
      else if (t === 'torch')
        art = [
          '                ',
          '                ',
          '                ',
          '                ',
          '       t        ',
          '      tot       ',
          '      tot       ',
          '      sjs       ',
          '      sjs       ',
          '      sjs       ',
          '      sjs       ',
          '      sjs       ',
          '       s        ',
          '                ',
          '                ',
          '                ',
        ];
      else if (t === 'wood_side')
        art = [
          'TvTvRvTvTvRvTvTv',
          'vTvTvRvTvTvRvTvT',
          'TvRvTvTvRvTvTvRv',
          'vRvTvTvRvTvTvRvT',
          'TvTvRvTvTvRvTvTv',
          'vTvRvTvTvTvRvTvT',
          'TvRvTvTvRvTvTvRv',
          'vTvTvRvTvTvRvTvT',
          'TvTvRvTvTvRvTvTv',
          'vTvTvRvTvTvRvTvT',
          'TvRvTvTvRvTvTvRv',
          'vRvTvTvRvTvTvRvT',
          'TvTvRvTvTvRvTvTv',
          'vTvRvTvTvTvRvTvT',
          'TvRvTvTvRvTvTvRv',
          'vTvTvRvTvTvRvTvT',
        ];
      else if (t === 'wood_top')
        art = [
          'TTTTvvvvvvvvTTTT',
          'TvvvRRRRRRRRvvvT',
          'TvRRmmmmmmmmRRvT',
          'TvRmRRRRRRRRmRvT',
          'TvRmRmmmmmmRmRvT',
          'TvRmRmRRRRmRmRvT',
          'TvRmRmRvvRmRmRvT',
          'TvRmRmRvTRmRmRvT',
          'TvRmRmRvvRmRmRvT',
          'TvRmRmRRRRmRmRvT',
          'TvRmRmmmmmmRmRvT',
          'TvRmRRRRRRRRmRvT',
          'TvRRmmmmmmmmRRvT',
          'TvvvRRRRRRRRvvvT',
          'TTTTvvvvvvvvTTTT',
          'TTTTTTTTTTTTTTTT',
        ];
      else if (t === 'leaves')
        art = [
          'LLlDlGlDlDLLlDlG',
          'lDlGLLlDlDlGLLlD',
          'DlDLLlGlDlDlDLLl',
          'lGLLlDlDlGlDlDLL',
          'DLLlGlDlDLLlGlDl',
          'LLlDlDlGlDLLlDlD',
          'lDlGLLlDlDlGLLlD',
          'DlDLLlGlDlDlDLLl',
          'lDLLlDlDlGlDlGLL',
          'GLLlDlGlDLLlDlDl',
          'LLlGlDlDlDLLlGlD',
          'lDlDLLlGlDlDLLlD',
          'DlGLLlDlDlGlDLLl',
          'lDLLlGlDlDlDlGLL',
          'DLLlDlDlGLLlDlDl',
          'LLlGlDlDlDLLlDlG',
        ];
      else if (t === 'chest_front')
        art = [
          'KKKKKKKKKKKKKKKK',
          'KCCCCCCCCCCCCCCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCCCCCCCCCCCCCCK',
          'KKKKKKKYYKKKKKKK',
          'KCcccccYYcccccCK',
          'KCcccccYYcccccCK',
          'KCcccccKKcccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCCCCCCCCCCCCCCK',
          'KKKKKKKKKKKKKKKK',
        ];
      else if (t === 'chest_top')
        art = [
          'KKKKKKKKKKKKKKKK',
          'KCCCCCCCCCCCCCCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCccccccccccccCK',
          'KCCCCCCCCCCCCCCK',
          'KKKKKKKKKKKKKKKK',
        ];
      else if (t === 'cactus')
        art = [
          'DlLLLLLLLLLLLLlD',
          'lLbxLLLLLLLLxbLl',
          'LLbLLlLLLLlLLbLL',
          'LLLLLLLLLLLLLLLL',
          'DlLLLLLLLLLLLLlD',
          'lLLLLbxLLxbLLLLl',
          'LLLLLLbLLbLLLLLL',
          'LLLLLLLLLLLLLLLL',
          'DlLLLLLLLLLLLLlD',
          'lLbxLLLLLLLLxbLl',
          'LLbLLlLLLLlLLbLL',
          'LLLLLLLLLLLLLLLL',
          'DlLLLLLLLLLLLLlD',
          'lLLLLbxLLxbLLLLl',
          'LLLLLLbLLbLLLLLL',
          'DlLLLLLLLLLLLLlD',
        ];
      else if (t === 'creeper_face')
        art = [
          'lGlGlDGllGDlGlGl',
          'GlGlGlGllGlGlGlG',
          'lGlGllGllGllGlGl',
          'GllBBBBllBBBBllG',
          'lGlBBBBllBBBBGlG',
          'GlGBBBBllBBBBllG',
          'lGlBBBBllBBBBlGl',
          'GlGllllBBllllGlG',
          'lGlllBBBBBBlllGl',
          'GlGllBBBBBBllGlG',
          'lGlllBBBBBBlllGl',
          'GlGllBBllBBllGlG',
          'lGlllBBllBBlllGl',
          'GlGllBBllBBllGlG',
          'lGlGlGllllGlGlGl',
          'GlGlGlGllGlGlGlG',
        ];
      else if (t === 'creeper_body')
        art = [
          'lGlGlDGllGDlGlGl',
          'GlGlGlGllGlGlGlG',
          'lGlDGllGlGllGDlG',
          'GlGlGlGllGlGlGlG',
          'lGlGlDGllGDlGlGl',
          'GlGllGDllDGllGlG',
          'lGlGlGllllGlGlGl',
          'GlGDlGlGlGlGDlGl',
          'lGlGlDGllGDlGlGl',
          'GlGlGlGllGlGlGlG',
          'lGlDGllGlGllGDlG',
          'GlGlGlGllGlGlGlG',
          'lGlGlDGllGDlGlGl',
          'GlGllGDllDGllGlG',
          'lGlGlGllllGlGlGl',
          'GlGDlGlGlGlGDlGl',
        ];
      else if (t === 'steve_face')
        art = [
          'hhhhhhhhhhhhhhhh',
          'hhhhhhhhhhhhhhhh',
          'hhhhhhhhhhhhhhhh',
          'hhhhhhhhhhhhhhhh',
          'hkkkkkkkkkkkkkkh',
          'hkkkkkkkkkkkkkkh',
          'hkkkkkkkkkkkkkkh',
          'hkkkkkkkkkkkkkkh',
          'hkkepekkkkpeepkh',
          'hkkepekkkkpeepkh',
          'hkkkkkkkkkkkkkkh',
          'hkkkkhhhhhhkkkkh',
          'hkkkkhhhhhhkkkkh',
          'hkkkkkhhhhkkkkkh',
          'hkkkkkkkkkkkkkkh',
          'hkkkkkkkkkkkkkkh',
        ];
      else if (t === 'pig_face')
        art = [
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'ppppbbppppbbpppp',
          'ppppbbppppbbpppp',
          'pppppppppppppppp',
          'ppppppnnnnpppppp',
          'ppppppnnnnpppppp',
          'ppppppnnnnpppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
          'pppppppppppppppp',
        ];
      else if (t === 'zombie_shirt') art = Array(16).fill('ZZZZZZZZZZZZZZZZ');
      else if (t === 'zombie_pants') art = Array(16).fill('PPPPPPPPPPPPPPPP');

      this.drawPixelArt(cx, cy, s, art, pal);

      let ic = document.createElement('canvas');
      ic.width = 64;
      ic.height = 64;
      let ictx = ic.getContext('2d');
      ictx.imageSmoothingEnabled = false;
      ictx.drawImage(this.cv, cx, cy, s, s, 0, 0, 64, 64);
      return ic.toDataURL();
    }

    switch (t) {
      case 'grass_top':
        rb = 88;
        gb = 175;
        bb = 48;
        v = 28;
        break;
      case 'grass_side':
        rb = 134;
        gb = 96;
        bb = 67;
        v = 18;
        break;
      case 'dirt':
        rb = 134;
        gb = 96;
        bb = 67;
        v = 20;
        break;
      case 'stone':
        rb = 125;
        gb = 125;
        bb = 128;
        v = 22;
        break;
      case 'cobblestone':
        rb = 105;
        gb = 105;
        bb = 108;
        v = 42;
        break;
      case 'sand':
        rb = 228;
        gb = 216;
        bb = 162;
        v = 16;
        break;
      case 'snow':
        rb = 242;
        gb = 248;
        bb = 255;
        v = 10;
        break;
      case 'water':
        rb = 38;
        gb = 105;
        bb = 228;
        v = 0;
        break;
      case 'planks':
        rb = 168;
        gb = 132;
        bb = 84;
        v = 16;
        break;
      case 'bedrock':
        rb = 35;
        gb = 35;
        bb = 38;
        v = 35;
        break;
      case 'glass':
        rb = 230;
        gb = 248;
        bb = 255;
        v = 0;
        break;
      case 'ore_coal':
        rb = 125;
        gb = 125;
        bb = 128;
        v = 18;
        break;
      case 'ore_iron':
        rb = 125;
        gb = 125;
        bb = 128;
        v = 18;
        break;
      case 'ore_diamond':
        rb = 125;
        gb = 125;
        bb = 128;
        v = 18;
        break;
      case 'ore_gold':
        rb = 125;
        gb = 125;
        bb = 128;
        v = 18;
        break;
      case 'bricks':
        rb = 175;
        gb = 72;
        bb = 54;
        v = 12;
        break;
      case 'obsidian':
        rb = 24;
        gb = 14;
        bb = 44;
        v = 18;
        break;
      case 'zombie_face':
        rb = 48;
        gb = 105;
        bb = 45;
        v = 18;
        break;
    }

    if (!['water', 'glass'].includes(t)) {
      this.ctx.fillStyle = `rgb(${rb},${gb},${bb})`;
      this.ctx.fillRect(cx, cy, s, s);
    }

    const grassBlades = [5, 7, 9, 6, 4, 8, 10, 7, 5, 6, 9, 11, 7, 5, 8, 6];

    for (let x = 0; x < s; x += 2)
      for (let y = 0; y < s; y += 2) {
        let r = rb,
          g = gb,
          b = bb,
          a = 1.0,
          nz = (Math.random() - 0.5) * v;
        let bladeH = grassBlades[Math.floor(x / 2) % 16] * 2;

        if (t === 'grass_top') {
          if ((x + y) % 6 === 0 && Math.random() > 0.4) {
            g += 14;
            r += 6;
          }
        } else if (t === 'grass_side') {
          if (y < bladeH) {
            r = 88;
            g = 175;
            b = 48;
            nz = (Math.random() - 0.5) * 24;
          } else if (y === bladeH) {
            r = 62;
            g = 130;
            b = 32;
          }
        } else if (t === 'planks') {
          if (y % 8 === 0 || (x === 16 && y < 16) || (x === 8 && y >= 16)) {
            r -= 28;
            g -= 28;
            b -= 25;
          }
        } else if (t === 'water') {
          a = 0.76;
        } else if (t === 'glass') {
          if (
            x < 2 ||
            x >= s - 2 ||
            y < 2 ||
            y >= s - 2 ||
            (x === y && x > 6 && x < 16)
          ) {
            r = 255;
            g = 255;
            b = 255;
            a = 0.92;
          } else a = 0.06;
        } else if (t.startsWith('ore_')) {
          if (
            x > 4 &&
            x < s - 4 &&
            y > 4 &&
            y < s - 4 &&
            Math.random() > 0.78
          ) {
            if (t === 'ore_coal') {
              r = 22;
              g = 22;
              b = 25;
            } else if (t === 'ore_iron') {
              r = 225;
              g = 190;
              b = 165;
            } else if (t === 'ore_gold') {
              r = 250;
              g = 215;
              b = 45;
            } else if (t === 'ore_diamond') {
              r = 65;
              g = 235;
              b = 255;
            }
          }
        } else if (t === 'bricks') {
          if (
            y % 8 < 2 ||
            (x + (Math.floor(y / 8) % 2 === 0 ? 0 : 16)) % 16 < 2
          ) {
            r = 215;
            g = 210;
            b = 205;
          }
        }

        let dx = x - s / 2,
          dy = y - s / 2,
          dist = Math.sqrt(dx * dx + dy * dy) / (s / 2);
        let ao = 1.0 - (dist > 0.82 ? (dist - 0.82) * 1.1 : 0);

        r = Math.min(255, Math.max(0, (r + nz) * ao));
        g = Math.min(255, Math.max(0, (g + nz) * ao));
        b = Math.min(255, Math.max(0, (b + nz) * ao));
        if (a > 0) {
          this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          this.ctx.fillRect(cx + x, cy + y, 2, 2);
        }
      }

    let ic = document.createElement('canvas');
    ic.width = 64;
    ic.height = 64;
    let ictx = ic.getContext('2d');
    ictx.imageSmoothingEnabled = false;
    ictx.drawImage(this.cv, cx, cy, s, s, 0, 0, 64, 64);
    return ic.toDataURL();
  }

  gen() {
    let i = 1;
    const d = (t) => this.draw(i++, t);
    const tex = [
      null,
      d('grass_top'),
      d('grass_side'),
      d('dirt'),
      d('stone'),
      d('wood_side'),
      d('wood_top'),
      d('leaves'),
      d('sand'),
      d('water'),
      d('planks'),
      d('bedrock'),
      d('cobblestone'),
      d('crafting_table'),
      d('red_flower'),
      d('yellow_flower'),
      d('stick'),
      d('apple'),
      d('rotten_flesh'),
      d('pickaxe'),
      d('sword'),
      d('torch'),
      d('glass'),
      d('ore_coal'),
      d('ore_iron'),
      d('ore_diamond'),
      d('bricks'),
      d('obsidian'),
      d('bookshelf'),
      d('steve_face'),
      d('pig_face'),
      d('zombie_face'),
      d('zombie_shirt'),
      d('zombie_pants'),
      d('axe'),
      d('snow'),
      d('cactus'),
      d('chest_front'),
      d('chest_top'),
      d('creeper_face'),
      d('creeper_body'),
      d('ore_gold'),
      d('stone_pickaxe'),
      d('stone_sword'),
      d('porkchop'),
    ];
    const m = (id, r, l, t, b, f, bk) => {
      this.map[id] = [r, l, t, b, f, bk];
    };
    m(BLOCKS.GRASS, 2, 2, 1, 3, 2, 2);
    m(BLOCKS.DIRT, 3, 3, 3, 3, 3, 3);
    m(BLOCKS.STONE, 4, 4, 4, 4, 4, 4);
    m(BLOCKS.WOOD, 5, 5, 6, 6, 5, 5);
    m(BLOCKS.LEAVES, 7, 7, 7, 7, 7, 7);
    m(BLOCKS.SAND, 8, 8, 8, 8, 8, 8);
    m(BLOCKS.WATER, 9, 9, 9, 9, 9, 9);
    m(BLOCKS.PLANKS, 10, 10, 10, 10, 10, 10);
    m(BLOCKS.BEDROCK, 11, 11, 11, 11, 11, 11);
    m(BLOCKS.COBBLESTONE, 12, 12, 12, 12, 12, 12);
    m(BLOCKS.CRAFTING_TABLE, 13, 13, 10, 10, 13, 13);
    m(BLOCKS.RED_FLOWER, 14, 14, 14, 14, 14, 14);
    m(BLOCKS.YELLOW_FLOWER, 15, 15, 15, 15, 15, 15);
    m(BLOCKS.STICK, 16, 16, 16, 16, 16, 16);
    m(BLOCKS.APPLE, 17, 17, 17, 17, 17, 17);
    m(BLOCKS.ROTTEN_FLESH, 18, 18, 18, 18, 18, 18);
    m(BLOCKS.PICKAXE, 19, 19, 19, 19, 19, 19);
    m(BLOCKS.SWORD, 20, 20, 20, 20, 20, 20);
    m(BLOCKS.TORCH, 21, 21, 21, 21, 21, 21);
    m(BLOCKS.GLASS, 22, 22, 22, 22, 22, 22);
    m(BLOCKS.COAL_ORE, 23, 23, 23, 23, 23, 23);
    m(BLOCKS.IRON_ORE, 24, 24, 24, 24, 24, 24);
    m(BLOCKS.DIAMOND_ORE, 25, 25, 25, 25, 25, 25);
    m(BLOCKS.BRICKS, 26, 26, 26, 26, 26, 26);
    m(BLOCKS.OBSIDIAN, 27, 27, 27, 27, 27, 27);
    m(BLOCKS.BOOKSHELF, 28, 28, 10, 10, 28, 28);
    m(BLOCKS.AXE, 34, 34, 34, 34, 34, 34);
    m(BLOCKS.SNOW, 35, 35, 35, 3, 35, 35);
    m(BLOCKS.CACTUS, 36, 36, 36, 36, 36, 36);
    m(BLOCKS.CHEST, 37, 37, 38, 38, 37, 37);
    m(BLOCKS.GOLD, 41, 41, 41, 41, 41, 41);
    m(BLOCKS.STONE_PICKAXE, 42, 42, 42, 42, 42, 42);
    m(BLOCKS.STONE_SWORD, 43, 43, 43, 43, 43, 43);
    m(BLOCKS.PORKCHOP, 44, 44, 44, 44, 44, 44);

    this.steveUV = 29;
    this.pigUV = 30;
    this.zFace = 31;
    this.zShirt = 32;
    this.zPants = 33;
    this.creeperFaceUV = 39;
    this.creeperBodyUV = 40;

    Object.keys(BLOCKS).forEach((k) => {
      let id = BLOCKS[k];
      if (id !== 0) {
        const mapped = this.getMap(id);
        this.ui[id] = tex[mapped[0]] || tex[4];
      }
    });
    this.tex = new THREE.CanvasTexture(this.cv);
    this.tex.magFilter = THREE.NearestFilter;
    this.tex.minFilter = THREE.NearestFilter;
  }
  applyUV(geo, tIdx) {
    let safeIdx = tIdx || 4;
    let ts = 1 / this.c,
      tu = (safeIdx % this.c) * ts,
      tv = 1 - Math.floor(safeIdx / this.c) * ts - ts;
    let uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++)
      uv.setXY(i, tu + uv.getX(i) * ts, tv + uv.getY(i) * ts);
    uv.needsUpdate = true;
  }
}

class Particles {
  constructor(e) {
    this.e = e;
    this.p = [];
    this.geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
  }
  spawn(pos, id, count = 7) {
    if (id === 0 || id === 8 || (BLOCK_PROPS[id] && BLOCK_PROPS[id].isItem))
      return;
    let ti = this.e.atlas.getMap(id)[0];
    let ts = 1 / 16,
      tu = (ti % 16) * ts,
      tv = 1 - Math.floor(ti / 16) * ts - ts;
    let mat = new THREE.MeshBasicMaterial({ map: this.e.atlas.tex });
    for (let i = 0; i < count; i++) {
      let m = new THREE.Mesh(this.geo.clone(), mat);
      let u = m.geometry.attributes.uv;
      for (let j = 0; j < u.count; j++)
        u.setXY(
          j,
          tu + Math.random() * ts * 0.5,
          tv + Math.random() * ts * 0.5,
        );
      u.needsUpdate = true;
      m.position
        .copy(pos)
        .add(
          new THREE.Vector3(
            Math.random() * 0.6,
            Math.random() * 0.6,
            Math.random() * 0.6,
          ),
        );
      m.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 4 + 2,
        (Math.random() - 0.5) * 5,
      );
      m.life = 0.45 + Math.random() * 0.35;
      this.e.scene.add(m);
      this.p.push(m);
    }
  }
  update(dt) {
    for (let i = this.p.length - 1; i >= 0; i--) {
      let p = this.p[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.e.scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        this.p.splice(i, 1);
        continue;
      }
      p.vel.y -= 20 * dt;
      p.position.addScaledVector(p.vel, dt);
      p.scale.setScalar(p.life * 2.2);
    }
  }
}

class DroppedItems {
  constructor(e) {
    this.e = e;
    this.items = [];
    this._tempVec = new THREE.Vector3();
  }
  getDrop(id) {
    if (id === BLOCKS.STONE) return BLOCKS.COBBLESTONE;
    if (id === BLOCKS.GRASS) return BLOCKS.DIRT;
    if (id === BLOCKS.LEAVES)
      return Math.random() < 0.15
        ? BLOCKS.APPLE
        : Math.random() < 0.15
          ? BLOCKS.STICK
          : BLOCKS.AIR;
    return id;
  }
  spawn(pos, originId, directId = false) {
    let id = directId ? originId : this.getDrop(originId);
    if (!id || id === 0 || id === 8) return;
    let isItem = Boolean(BLOCK_PROPS[id] && BLOCK_PROPS[id].isItem);
    let geo = isItem
      ? new THREE.PlaneGeometry(0.35, 0.35)
      : new THREE.BoxGeometry(0.28, 0.28, 0.28);
    let tIdx = this.e.atlas.getMap(id)[0];
    this.e.atlas.applyUV(geo, tIdx);
    let mat = new THREE.MeshStandardMaterial({
      map: this.e.atlas.tex,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
    });
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    let spawnPos = pos.clone().add(this._tempVec.set(0.5, 0.5, 0.5));
    mesh.position.copy(spawnPos);
    this.e.scene.add(mesh);
    this.items.push({
      mesh: mesh,
      id: id,
      pos: spawnPos,
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        4,
        (Math.random() - 0.5) * 3,
      ),
      life: 300,
      bob: Math.random() * 6,
    });
  }
  update(dt) {
    let pPos = this.e.player.pos;
    for (let i = this.items.length - 1; i >= 0; i--) {
      let it = this.items[i];
      it.life -= dt;
      if (it.life <= 0) {
        this.e.scene.remove(it.mesh);
        it.mesh.geometry.dispose();
        it.mesh.material.dispose();
        this.items.splice(i, 1);
        continue;
      }
      it.vel.y -= 25 * dt;
      it.pos.addScaledVector(it.vel, dt);
      let bX = Math.floor(it.pos.x),
        bY = Math.floor(it.pos.y - 0.1),
        bZ = Math.floor(it.pos.z);
      let v = this.e.world.getG(bX, bY, bZ);
      if (v !== 0 && v !== 8 && BLOCK_PROPS[v] && BLOCK_PROPS[v].solid) {
        it.pos.y = bY + 1.15;
        it.vel.y = 0;
        it.vel.x *= 0.8;
        it.vel.z *= 0.8;
      }
      it.bob += dt * 3;
      it.mesh.position.set(
        it.pos.x,
        it.pos.y + Math.sin(it.bob) * 0.06,
        it.pos.z,
      );
      it.mesh.rotation.y += dt * 1.5;

      if (it.pos.distanceTo(pPos) < 2.8) {
        if (this.e.player.giveItem(it.id, 1)) {
          this.e.scene.remove(it.mesh);
          it.mesh.geometry.dispose();
          it.mesh.material.dispose();
          this.items.splice(i, 1);
          this.e.audio.playPop();
        }
      }
    }
  }
}

class Pig {
  constructor(e, pos) {
    this.e = e;
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.hp = 8;
    this.life = 0;
    this.dead = false;
    this.box = new THREE.Box3();
    this.w = 0.35;
    this.h = 0.85;
    this.moveDir = new THREE.Vector2(0, 0);
    this.timer = 0;
    this.group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xf4a4a4 });
    const mFace = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex });

    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.9), mat);
    this.body.position.set(0, -0.35, 0);
    this.group.add(this.body);

    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mFace);
    this.e.atlas.applyUV(this.head.geometry, this.e.atlas.pigUV);
    this.head.position.set(0, -0.15, 0.55);
    this.group.add(this.head);

    this.legs = [];
    [
      [-0.2, 0.3],
      [0.2, 0.3],
      [-0.2, -0.3],
      [0.2, -0.3],
    ].forEach(([lx, lz]) => {
      let leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), mat);
      leg.position.set(lx, -0.72, lz);
      this.group.add(leg);
      this.legs.push(leg);
    });

    this.group.children.forEach((c) => (c.castShadow = true));
    this.e.scene.add(this.group);
    this._tempMin = new THREE.Vector3();
    this._tempMax = new THREE.Vector3();
  }
  chkCol(box) {
    let mx = Math.floor(box.min.x),
      mX = Math.floor(box.max.x),
      my = Math.floor(box.min.y),
      mY = Math.floor(box.max.y),
      mz = Math.floor(box.min.z),
      mZ = Math.floor(box.max.z);
    for (let y = my; y <= mY; y++)
      for (let z = mz; z <= mZ; z++)
        for (let x = mx; x <= mX; x++) {
          let v = this.e.world.getG(x, y, z);
          if (v !== 0 && v !== 8 && BLOCK_PROPS[v] && BLOCK_PROPS[v].solid)
            return true;
        }
    return false;
  }
  dmg(a) {
    if (this.dead) return;
    this.hp -= a;
    this.e.audio.playPig();
    this.group.children.forEach((c) => c.material.color.setHex(0xff6666));
    this.vel.y = 4.5;
    setTimeout(() => {
      if (!this.dead)
        this.group.children.forEach((c) => c.material.color.setHex(0xffffff));
    }, 200);
    if (this.hp <= 0) {
      this.dead = true;
      this.group.rotation.z = Math.PI / 2;
      this.e.drops.spawn(this.pos, BLOCKS.PORKCHOP, true);
      setTimeout(() => {
        this.e.scene.remove(this.group);
        this.e.mobs.remove(this);
      }, 1000);
    }
  }
  update(dt) {
    if (this.dead) return;
    this.life += dt;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 2 + Math.random() * 4;
      if (Math.random() < 0.6) {
        let ang = Math.random() * Math.PI * 2;
        this.moveDir.set(Math.cos(ang), Math.sin(ang));
        this.group.rotation.y = Math.atan2(this.moveDir.x, this.moveDir.y);
      } else {
        this.moveDir.set(0, 0);
      }
    }
    this.vel.y -= 30 * dt;
    this.vel.x += (this.moveDir.x * 1.6 - this.vel.x) * 4 * dt;
    this.vel.z += (this.moveDir.y * 1.6 - this.vel.z) * 4 * dt;

    const rA = (ax) => {
      this.pos[ax] += this.vel[ax] * dt;
      this._tempMin.set(
        this.pos.x - this.w,
        this.pos.y - this.h,
        this.pos.z - this.w,
      );
      this._tempMax.set(
        this.pos.x + this.w,
        this.pos.y + 0.1,
        this.pos.z + this.w,
      );
      this.box.set(this._tempMin, this._tempMax);
      if (this.chkCol(this.box)) {
        this.pos[ax] -= this.vel[ax] * dt;
        if (ax === 'y' && this.vel.y < 0) this.vel.y = 0;
        else {
          this.vel[ax] = 0;
          if (ax !== 'y') this.vel.y = 7.5;
        }
      }
    };
    rA('x');
    rA('z');
    rA('y');

    if (this.moveDir.lengthSq() > 0.05) {
      let s = Math.sin(this.life * 8) * 0.45;
      this.legs[0].rotation.x = s;
      this.legs[3].rotation.x = s;
      this.legs[1].rotation.x = -s;
      this.legs[2].rotation.x = -s;
    }
    this.group.position.copy(this.pos);
  }
}

class Zombie {
  constructor(e, pos) {
    this.e = e;
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.hp = 14;
    this.life = 0;
    this.dead = false;
    this.box = new THREE.Box3();
    this.w = 0.3;
    this.h = 1.6;
    this.group = new THREE.Group();
    const mF = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex }),
      mS = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex }),
      mP = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex });
    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mF);
    this.e.atlas.applyUV(this.head.geometry, this.e.atlas.zFace);
    this.head.position.y = 0.25;
    this.group.add(this.head);
    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.25), mS);
    this.e.atlas.applyUV(this.body.geometry, this.e.atlas.zShirt);
    this.body.position.y = -0.375;
    this.group.add(this.body);
    this.aL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), mS);
    this.e.atlas.applyUV(this.aL.geometry, this.e.atlas.zShirt);
    this.aL.position.set(0.375, -0.1, 0.2);
    this.aL.rotation.x = -Math.PI / 2;
    this.group.add(this.aL);
    this.aR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), mS);
    this.e.atlas.applyUV(this.aR.geometry, this.e.atlas.zShirt);
    this.aR.position.set(-0.375, -0.1, 0.2);
    this.aR.rotation.x = -Math.PI / 2;
    this.group.add(this.aR);
    this.lL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), mP);
    this.e.atlas.applyUV(this.lL.geometry, this.e.atlas.zPants);
    this.lL.position.set(0.125, -1.125, 0);
    this.group.add(this.lL);
    this.lR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), mP);
    this.e.atlas.applyUV(this.lR.geometry, this.e.atlas.zPants);
    this.lR.position.set(-0.125, -1.125, 0);
    this.group.add(this.lR);
    this.group.children.forEach((c) => {
      c.castShadow = true;
    });
    this.e.scene.add(this.group);

    this._tempDir = new THREE.Vector3();
    this._tempMin = new THREE.Vector3();
    this._tempMax = new THREE.Vector3();
  }
  chkCol(box) {
    let mx = Math.floor(box.min.x),
      mX = Math.floor(box.max.x),
      my = Math.floor(box.min.y),
      mY = Math.floor(box.max.y),
      mz = Math.floor(box.min.z),
      mZ = Math.floor(box.max.z);
    for (let y = my; y <= mY; y++)
      for (let z = mz; z <= mZ; z++)
        for (let x = mx; x <= mX; x++) {
          let v = this.e.world.getG(x, y, z);
          if (v !== 0 && v !== 8 && BLOCK_PROPS[v] && BLOCK_PROPS[v].solid)
            return true;
        }
    return false;
  }
  dmg(a) {
    if (this.dead) return;
    this.hp -= a;
    this.e.audio.playZombie();
    this.group.children.forEach((c) => c.material.color.setHex(0xff7777));
    this.e.player.cam.getWorldDirection(this._tempDir);
    this.vel.x = this._tempDir.x * 7;
    this.vel.z = this._tempDir.z * 7;
    this.vel.y = 5;
    setTimeout(() => {
      if (!this.dead)
        this.group.children.forEach((c) => c.material.color.setHex(0xffffff));
    }, 200);
    if (this.hp <= 0) {
      this.dead = true;
      this.group.rotation.z = Math.PI / 2;
      this.group.position.y -= 0.5;
      XboxAchv.unlock('Monster Hunter');
      setTimeout(() => {
        this.e.scene.remove(this.group);
        this.e.mobs.remove(this);
      }, 1500);
      if (this.e.drops) this.e.drops.spawn(this.pos, BLOCKS.ROTTEN_FLESH, true);
    }
  }
  update(dt) {
    if (this.dead) return;
    this.life += dt;
    this._tempDir.copy(this.e.player.pos).sub(this.pos);
    let dist = this._tempDir.length();
    this.vel.y -= 30 * dt;

    if (dist < 18 && dist > 1.0) {
      this._tempDir.y = 0;
      this._tempDir.normalize();
      this.vel.x += (this._tempDir.x * 2.6 - this.vel.x) * 5 * dt;
      this.vel.z += (this._tempDir.z * 2.6 - this.vel.z) * 5 * dt;
      this.group.rotation.y = Math.atan2(this._tempDir.x, this._tempDir.z);
    } else {
      this.vel.x *= 0.9;
      this.vel.z *= 0.9;
    }

    if (dist < 1.35 && this.life > 1.0) {
      this.e.player.dmg(2);
      this.life = 0;
    }

    const rA = (ax) => {
      this.pos[ax] += this.vel[ax] * dt;
      this._tempMin.set(
        this.pos.x - this.w,
        this.pos.y - this.h,
        this.pos.z - this.w,
      );
      this._tempMax.set(
        this.pos.x + this.w,
        this.pos.y + 0.1,
        this.pos.z + this.w,
      );
      this.box.set(this._tempMin, this._tempMax);
      if (this.chkCol(this.box)) {
        this.pos[ax] -= this.vel[ax] * dt;
        if (ax === 'y' && this.vel.y < 0) {
          this.vel.y = 0;
          if (
            dist < 18 &&
            (Math.abs(this.vel.x) < 0.2 || Math.abs(this.vel.z) < 0.2)
          )
            this.vel.y = 8;
        } else this.vel[ax] = 0;
      }
    };
    rA('x');
    rA('z');
    rA('y');
    if (Math.abs(this.vel.x) > 0.1 || Math.abs(this.vel.z) > 0.1) {
      let wc = this.life * 8;
      this.lL.rotation.x = Math.sin(wc) * 0.5;
      this.lR.rotation.x = -Math.sin(wc) * 0.5;
    }
    this.group.position.copy(this.pos);
  }
}

class Creeper {
  constructor(e, pos) {
    this.e = e;
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.hp = 12;
    this.dead = false;
    this.box = new THREE.Box3();
    this.w = 0.3;
    this.h = 1.25;
    this.fuse = 0;
    this.fusing = false;
    this.life = 0;
    this.group = new THREE.Group();

    const mFace = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex });
    const mBody = new THREE.MeshStandardMaterial({ map: this.e.atlas.tex });

    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mFace);
    this.e.atlas.applyUV(this.head.geometry, this.e.atlas.creeperFaceUV);
    this.head.position.y = 0.25;
    this.group.add(this.head);

    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 0.28), mBody);
    this.e.atlas.applyUV(this.body.geometry, this.e.atlas.creeperBodyUV);
    this.body.position.y = -0.375;
    this.group.add(this.body);

    this.l1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mBody);
    this.e.atlas.applyUV(this.l1.geometry, this.e.atlas.creeperBodyUV);
    this.l1.position.set(0.14, -0.95, 0.2);
    this.group.add(this.l1);

    this.l2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mBody);
    this.e.atlas.applyUV(this.l2.geometry, this.e.atlas.creeperBodyUV);
    this.l2.position.set(-0.14, -0.95, 0.2);
    this.group.add(this.l2);

    this.l3 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mBody);
    this.e.atlas.applyUV(this.l3.geometry, this.e.atlas.creeperBodyUV);
    this.l3.position.set(0.14, -0.95, -0.2);
    this.group.add(this.l3);

    this.l4 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mBody);
    this.e.atlas.applyUV(this.l4.geometry, this.e.atlas.creeperBodyUV);
    this.l4.position.set(-0.14, -0.95, -0.2);
    this.group.add(this.l4);

    this.group.children.forEach((c) => {
      c.castShadow = true;
    });
    this.e.scene.add(this.group);

    this._tempDir = new THREE.Vector3();
    this._tempMin = new THREE.Vector3();
    this._tempMax = new THREE.Vector3();
  }

  chkCol(box) {
    let mx = Math.floor(box.min.x),
      mX = Math.floor(box.max.x),
      my = Math.floor(box.min.y),
      mY = Math.floor(box.max.y),
      mz = Math.floor(box.min.z),
      mZ = Math.floor(box.max.z);
    for (let y = my; y <= mY; y++)
      for (let z = mz; z <= mZ; z++)
        for (let x = mx; x <= mX; x++) {
          let v = this.e.world.getG(x, y, z);
          if (v !== 0 && v !== 8 && BLOCK_PROPS[v] && BLOCK_PROPS[v].solid)
            return true;
        }
    return false;
  }

  dmg(a) {
    if (this.dead) return;
    this.hp -= a;
    this.e.audio.playHit();
    this.group.children.forEach((c) => c.material.color.setHex(0xff7777));
    this.e.player.cam.getWorldDirection(this._tempDir);
    this.vel.x = this._tempDir.x * 6.5;
    this.vel.z = this._tempDir.z * 6.5;
    this.vel.y = 4.5;
    setTimeout(() => {
      if (!this.dead)
        this.group.children.forEach((c) => c.material.color.setHex(0xffffff));
    }, 200);
    if (this.hp <= 0) {
      this.dead = true;
      this.group.rotation.z = Math.PI / 2;
      XboxAchv.unlock('Monster Hunter');
      setTimeout(() => {
        this.e.scene.remove(this.group);
        this.e.mobs.remove(this);
      }, 1200);
      if (this.e.drops) this.e.drops.spawn(this.pos, BLOCKS.COAL_ORE, true);
    }
  }

  explode() {
    if (this.dead) return;
    this.dead = true;
    this.e.audio.playExplosion();
    this.e.particles.spawn(this.pos, BLOCKS.GRASS, 24);
    let cx = Math.floor(this.pos.x),
      cy = Math.floor(this.pos.y),
      cz = Math.floor(this.pos.z);
    for (let dx = -2; dx <= 2; dx++)
      for (let dy = -2; dy <= 2; dy++)
        for (let dz = -2; dz <= 2; dz++) {
          if (dx * dx + dy * dy + dz * dz <= 5) {
            let id = this.e.world.getG(cx + dx, cy + dy, cz + dz);
            if (
              id !== BLOCKS.AIR &&
              id !== BLOCKS.BEDROCK &&
              id !== BLOCKS.WATER
            ) {
              this.e.world.setG(cx + dx, cy + dy, cz + dz, BLOCKS.AIR);
            }
          }
        }
    let pDist = this.pos.distanceTo(this.e.player.pos);
    if (pDist < 5.5) {
      this.e.player.dmg(Math.max(2, Math.round((5.5 - pDist) * 2.2)));
    }
    this.e.scene.remove(this.group);
    this.e.mobs.remove(this);
  }

  update(dt) {
    if (this.dead) return;
    this.life += dt;
    this._tempDir.copy(this.e.player.pos).sub(this.pos);
    let dist = this._tempDir.length();
    this.vel.y -= 30 * dt;

    if (dist < 3.4) {
      if (!this.fusing) {
        this.fusing = true;
        this.e.audio.playFuse();
        showToast('⚠️ Sssssss! Creeper prestes a explodir!');
      }
      this.fuse += dt;
      let pulse = 1 + Math.sin(this.fuse * 28) * 0.14;
      this.group.scale.set(pulse, 1 + this.fuse * 0.15, pulse);
      let flash = Math.floor(this.fuse * 14) % 2 === 0 ? 0xffffff : 0x88ff88;
      this.group.children.forEach((c) => c.material.color.setHex(flash));
      this.vel.x *= 0.8;
      this.vel.z *= 0.8;
      if (this.fuse >= 1.45) {
        this.explode();
        return;
      }
    } else {
      if (this.fusing) {
        this.fusing = false;
        this.fuse = Math.max(0, this.fuse - dt * 2);
        this.group.scale.set(1, 1, 1);
        this.group.children.forEach((c) => c.material.color.setHex(0xffffff));
      }
      if (dist < 16) {
        this._tempDir.y = 0;
        this._tempDir.normalize();
        this.vel.x += (this._tempDir.x * 2.4 - this.vel.x) * 5 * dt;
        this.vel.z += (this._tempDir.z * 2.4 - this.vel.z) * 5 * dt;
        this.group.rotation.y = Math.atan2(this._tempDir.x, this._tempDir.z);
      } else {
        this.vel.x *= 0.9;
        this.vel.z *= 0.9;
      }
    }

    const rA = (ax) => {
      this.pos[ax] += this.vel[ax] * dt;
      this._tempMin.set(
        this.pos.x - this.w,
        this.pos.y - this.h,
        this.pos.z - this.w,
      );
      this._tempMax.set(
        this.pos.x + this.w,
        this.pos.y + 0.1,
        this.pos.z + this.w,
      );
      this.box.set(this._tempMin, this._tempMax);
      if (this.chkCol(this.box)) {
        this.pos[ax] -= this.vel[ax] * dt;
        if (ax === 'y' && this.vel.y < 0) {
          this.vel.y = 0;
          if (
            dist < 16 &&
            (Math.abs(this.vel.x) < 0.2 || Math.abs(this.vel.z) < 0.2)
          )
            this.vel.y = 8;
        } else {
          this.vel[ax] = 0;
        }
      }
    };
    rA('x');
    rA('z');
    rA('y');

    if (Math.abs(this.vel.x) > 0.1 || Math.abs(this.vel.z) > 0.1) {
      let wc = this.life * 9;
      this.l1.rotation.x = Math.sin(wc) * 0.5;
      this.l4.rotation.x = Math.sin(wc) * 0.5;
      this.l2.rotation.x = -Math.sin(wc) * 0.5;
      this.l3.rotation.x = -Math.sin(wc) * 0.5;
    }
    this.group.position.copy(this.pos);
  }
}

class MobManager {
  constructor(e) {
    this.e = e;
    this.list = [];
    this.spawnTimer = 3;
  }
  spawnInitial() {
    this.spawnNear(18, 12, 'pig');
    this.spawnNear(24, -10, 'pig');
    this.spawnNear(-16, 18, 'zombie');
    this.spawnNear(28, 22, 'creeper');
  }
  spawnNear(x, z, type) {
    let y = this.e.world.getSurfaceY(x, z) + 2;
    let pos = new THREE.Vector3(x + 0.5, y, z + 0.5);
    if (type === 'pig') this.list.push(new Pig(this.e, pos));
    else if (type === 'zombie') this.list.push(new Zombie(this.e, pos));
    else if (type === 'creeper') this.list.push(new Creeper(this.e, pos));
  }
  remove(mob) {
    let idx = this.list.indexOf(mob);
    if (idx !== -1) this.list.splice(idx, 1);
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      this.list[i].update(dt);
    }
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.list.length < 12) {
      this.spawnTimer = 8;
      let ang = Math.random() * Math.PI * 2;
      let dist = 16 + Math.random() * 14;
      let sx = Math.floor(this.e.player.pos.x + Math.cos(ang) * dist);
      let sz = Math.floor(this.e.player.pos.z + Math.sin(ang) * dist);
      let r = Math.random();
      let type = this.e.isNight
        ? r < 0.5
          ? 'zombie'
          : 'creeper'
        : r < 0.55
          ? 'pig'
          : r < 0.8
            ? 'zombie'
            : 'creeper';
      this.spawnNear(sx, sz, type);
    }
  }
}

class VoxelWorld {
  constructor(e) {
    this.e = e;
    this.chunks = new Map();
    this.meshes = new Map();
    this.torches = new Map();
    this.chestOpened = false;
    this.matOpaque = new THREE.MeshStandardMaterial({
      map: this.e.atlas.tex,
      roughness: 0.9,
      metalness: 0.05,
      vertexColors: true,
    });
    this.matTrans = new THREE.MeshStandardMaterial({
      map: this.e.atlas.tex,
      transparent: true,
      alphaTest: 0.15,
      side: THREE.DoubleSide,
      roughness: 0.85,
      vertexColors: true,
    });
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  getBiome(wx, wz) {
    let temp = tempGen.fBm(wx, wz, 2, 0.015);
    let heightMod = bGen.fBm(wx, wz, 3, 0.02);
    if (temp > 0.22) return 'desert';
    if (temp < -0.22) return 'snow';
    if (heightMod > 0.25) return 'mountains';
    return 'plains';
  }

  getTerrainHeight(wx, wz) {
    let biome = this.getBiome(wx, wz);
    let n = nGen.fBm(wx, wz, 3, 0.025);
    let base = 22 + Math.floor(n * 9);
    if (biome === 'mountains')
      base += Math.floor(Math.max(0, bGen.fBm(wx, wz, 2, 0.03)) * 18);
    if (biome === 'desert') base = 21 + Math.floor(n * 4);
    // Aplanar zona do Forte Inicial (0..16, 0..16)
    if (wx >= -2 && wx <= 18 && wz >= -2 && wz <= 18) return 22;
    return Math.max(6, Math.min(CONFIG.CHUNK_HEIGHT - 10, base));
  }

  generateChunk(cx, cz) {
    const S = CONFIG.CHUNK_SIZE,
      H = CONFIG.CHUNK_HEIGHT;
    const data = new Uint8Array(S * H * S);
    const idx = (x, y, z) => x + z * S + y * S * S;

    for (let x = 0; x < S; x++) {
      for (let z = 0; z < S; z++) {
        let wx = cx * S + x,
          wz = cz * S + z;
        let biome = this.getBiome(wx, wz);
        let h = this.getTerrainHeight(wx, wz);

        for (let y = 0; y < H; y++) {
          if (y === 0) {
            data[idx(x, y, z)] = BLOCKS.BEDROCK;
          } else if (y < h - 3) {
            let r = Math.abs(Math.sin(wx * 12.9898 + y * 78.233 + wz * 37.719));
            if (y < 10 && r > 0.985) data[idx(x, y, z)] = BLOCKS.DIAMOND_ORE;
            else if (y < 16 && r > 0.97) data[idx(x, y, z)] = BLOCKS.GOLD;
            else if (y < 22 && r > 0.95) data[idx(x, y, z)] = BLOCKS.IRON_ORE;
            else if (r > 0.93) data[idx(x, y, z)] = BLOCKS.COAL_ORE;
            else data[idx(x, y, z)] = BLOCKS.STONE;
          } else if (y < h) {
            data[idx(x, y, z)] = biome === 'desert' ? BLOCKS.SAND : BLOCKS.DIRT;
          } else if (y === h) {
            if (h < CONFIG.WATER_LEVEL) data[idx(x, y, z)] = BLOCKS.SAND;
            else if (biome === 'desert') data[idx(x, y, z)] = BLOCKS.SAND;
            else if (biome === 'snow') data[idx(x, y, z)] = BLOCKS.SNOW;
            else if (biome === 'mountains' && h > 31)
              data[idx(x, y, z)] = BLOCKS.STONE;
            else data[idx(x, y, z)] = BLOCKS.GRASS;
          } else if (y <= CONFIG.WATER_LEVEL) {
            data[idx(x, y, z)] = BLOCKS.WATER;
          }
        }

        // Vegetação procedural fora do forte
        let inFort = wx >= 1 && wx <= 15 && wz >= 1 && wz <= 15;
        if (!inFort && h > CONFIG.WATER_LEVEL && h < H - 8) {
          let hash = Math.abs(Math.sin(wx * 19.19 + wz * 73.13));
          if (biome === 'plains' || biome === 'snow') {
            if (hash > 0.985 && x >= 2 && x <= S - 3 && z >= 2 && z <= S - 3) {
              // Árvore
              let th = 4 + (Math.floor(hash * 100) % 2);
              for (let ty = 1; ty <= th; ty++)
                data[idx(x, h + ty, z)] = BLOCKS.WOOD;
              for (let lx = -2; lx <= 2; lx++)
                for (let lz = -2; lz <= 2; lz++)
                  for (let ly = th - 1; ly <= th + 1; ly++) {
                    if (
                      Math.abs(lx) + Math.abs(lz) + Math.abs(ly - th) <= 3 &&
                      data[idx(x + lx, h + ly, z + lz)] === 0
                    ) {
                      data[idx(x + lx, h + ly, z + lz)] = BLOCKS.LEAVES;
                    }
                  }
            } else if (biome === 'plains' && hash > 0.94 && hash < 0.96) {
              data[idx(x, h + 1, z)] =
                hash > 0.95 ? BLOCKS.RED_FLOWER : BLOCKS.YELLOW_FLOWER;
            }
          } else if (biome === 'desert' && hash > 0.988) {
            data[idx(x, h + 1, z)] = BLOCKS.CACTUS;
            data[idx(x, h + 2, z)] = BLOCKS.CACTUS;
          }
        }
      }
    }

    // Construir Forte Clássico Tutorial Xbox 360 no chunk (0, 0)
    if (cx === 0 && cz === 0) {
      const baseH = 22;
      for (let fx = 3; fx <= 13; fx++) {
        for (let fz = 3; fz <= 13; fz++) {
          data[idx(fx, baseH, fz)] = BLOCKS.COBBLESTONE;
          if (fx === 3 || fx === 13 || fz === 3 || fz === 13) {
            // Entrada aberta no lado sul (z=13, x=8)
            if (!(fz === 13 && (fx === 7 || fx === 8 || fx === 9))) {
              data[idx(fx, baseH + 1, fz)] = BLOCKS.PLANKS;
              if ((fx + fz) % 2 === 0)
                data[idx(fx, baseH + 2, fz)] = BLOCKS.COBBLESTONE;
            }
          }
        }
      }
      // Baú Inicial, Bancada de Trabalho e Tochas no Forte
      data[idx(8, baseH + 1, 5)] = BLOCKS.CHEST;
      data[idx(6, baseH + 1, 5)] = BLOCKS.CRAFTING_TABLE;
      data[idx(10, baseH + 1, 5)] = BLOCKS.BOOKSHELF;
      data[idx(4, baseH + 2, 4)] = BLOCKS.TORCH;
      data[idx(12, baseH + 2, 4)] = BLOCKS.TORCH;
      data[idx(6, baseH + 2, 13)] = BLOCKS.TORCH;
      data[idx(10, baseH + 2, 13)] = BLOCKS.TORCH;
    }

    this.chunks.set(this.key(cx, cz), data);
    return data;
  }

  getG(wx, wy, wz) {
    if (wy < 0 || wy >= CONFIG.CHUNK_HEIGHT) return BLOCKS.AIR;
    const S = CONFIG.CHUNK_SIZE;
    const cx = Math.floor(wx / S),
      cz = Math.floor(wz / S);
    let chunk = this.chunks.get(this.key(cx, cz));
    if (!chunk) chunk = this.generateChunk(cx, cz);
    const lx = ((wx % S) + S) % S,
      lz = ((wz % S) + S) % S;
    return chunk[lx + lz * S + wy * S * S];
  }

  setG(wx, wy, wz, id) {
    if (wy < 1 || wy >= CONFIG.CHUNK_HEIGHT) return;
    const S = CONFIG.CHUNK_SIZE;
    const cx = Math.floor(wx / S),
      cz = Math.floor(wz / S);
    let chunk = this.chunks.get(this.key(cx, cz));
    if (!chunk) chunk = this.generateChunk(cx, cz);
    const lx = ((wx % S) + S) % S,
      lz = ((wz % S) + S) % S;
    chunk[lx + lz * S + wy * S * S] = id;

    const tKey = `${wx},${wy},${wz}`;
    if (id === BLOCKS.TORCH) {
      if (!this.torches.has(tKey)) {
        const pl = new THREE.PointLight(0xffaa33, 1.35, 11);
        pl.position.set(wx + 0.5, wy + 0.7, wz + 0.5);
        this.e.scene.add(pl);
        this.torches.set(tKey, pl);
      }
    } else if (this.torches.has(tKey)) {
      this.e.scene.remove(this.torches.get(tKey));
      this.torches.delete(tKey);
    }

    this.rebuildChunk(cx, cz);
    if (lx === 0) this.rebuildChunk(cx - 1, cz);
    if (lx === S - 1) this.rebuildChunk(cx + 1, cz);
    if (lz === 0) this.rebuildChunk(cx, cz - 1);
    if (lz === S - 1) this.rebuildChunk(cx, cz + 1);
  }

  getSurfaceY(wx, wz) {
    for (let y = CONFIG.CHUNK_HEIGHT - 1; y >= 1; y--) {
      let v = this.getG(wx, y, wz);
      if (v !== BLOCKS.AIR && v !== BLOCKS.WATER) return y;
    }
    return 22;
  }

  rebuildChunk(cx, cz) {
    const k = this.key(cx, cz);
    if (this.meshes.has(k)) {
      const old = this.meshes.get(k);
      if (old.op) {
        this.e.scene.remove(old.op);
        old.op.geometry.dispose();
      }
      if (old.tr) {
        this.e.scene.remove(old.tr);
        old.tr.geometry.dispose();
      }
    }

    const S = CONFIG.CHUNK_SIZE,
      H = CONFIG.CHUNK_HEIGHT;
    const posOp = [],
      normOp = [],
      uvOp = [],
      colOp = [],
      idxOp = [];
    const posTr = [],
      normTr = [],
      uvTr = [],
      colTr = [],
      idxTr = [];

    const faces = [
      {
        dir: [1, 0, 0],
        corners: [
          [1, 0, 1],
          [1, 0, 0],
          [1, 1, 0],
          [1, 1, 1],
        ],
        faceIdx: 0,
        shade: 0.86,
      },
      {
        dir: [-1, 0, 0],
        corners: [
          [0, 0, 0],
          [0, 0, 1],
          [0, 1, 1],
          [0, 1, 0],
        ],
        faceIdx: 1,
        shade: 0.86,
      },
      {
        dir: [0, 1, 0],
        corners: [
          [0, 1, 1],
          [1, 1, 1],
          [1, 1, 0],
          [0, 1, 0],
        ],
        faceIdx: 2,
        shade: 1.0,
      },
      {
        dir: [0, -1, 0],
        corners: [
          [0, 0, 0],
          [1, 0, 0],
          [1, 0, 1],
          [0, 0, 1],
        ],
        faceIdx: 3,
        shade: 0.65,
      },
      {
        dir: [0, 0, 1],
        corners: [
          [0, 0, 1],
          [1, 0, 1],
          [1, 1, 1],
          [0, 1, 1],
        ],
        faceIdx: 4,
        shade: 0.92,
      },
      {
        dir: [0, 0, -1],
        corners: [
          [1, 0, 0],
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 0],
        ],
        faceIdx: 5,
        shade: 0.92,
      },
    ];

    const ts = 1 / 16;

    for (let y = 0; y < H; y++) {
      for (let z = 0; z < S; z++) {
        for (let x = 0; x < S; x++) {
          let wx = cx * S + x,
            wz = cz * S + z;
          let id = this.getG(wx, y, wz);
          if (id === BLOCKS.AIR) continue;

          const prop = BLOCK_PROPS[id] || {};
          const mapArr = this.e.atlas.getMap(id);

          // Plantas e Tochas (malha cruzada em X)
          if (
            id === BLOCKS.RED_FLOWER ||
            id === BLOCKS.YELLOW_FLOWER ||
            id === BLOCKS.TORCH
          ) {
            const ti = mapArr[0];
            const tu = (ti % 16) * ts,
              tv = 1 - Math.floor(ti / 16) * ts - ts;
            const hScale = id === BLOCKS.TORCH ? 0.65 : 0.85;
            const quads = [
              [
                [0.15, 0, 0.15],
                [0.85, 0, 0.85],
                [0.85, hScale, 0.85],
                [0.15, hScale, 0.15],
              ],
              [
                [0.85, 0, 0.15],
                [0.15, 0, 0.85],
                [0.15, hScale, 0.85],
                [0.85, hScale, 0.15],
              ],
            ];
            quads.forEach((q) => {
              let vStart = posTr.length / 3;
              q.forEach((c) => {
                posTr.push(wx + c[0], y + c[1], wz + c[2]);
                normTr.push(0, 1, 0);
                colTr.push(1, 1, 1);
              });
              uvTr.push(tu, tv, tu + ts, tv, tu + ts, tv + ts, tu, tv + ts);
              idxTr.push(
                vStart,
                vStart + 1,
                vStart + 2,
                vStart,
                vStart + 2,
                vStart + 3,
              );
            });
            if (id === BLOCKS.TORCH && cx === 0 && cz === 0) {
              const tKey = `${wx},${y},${wz}`;
              if (!this.torches.has(tKey)) {
                const pl = new THREE.PointLight(0xffaa33, 1.35, 11);
                pl.position.set(wx + 0.5, y + 0.7, wz + 0.5);
                this.e.scene.add(pl);
                this.torches.set(tKey, pl);
              }
            }
            continue;
          }

          const isTrans = prop.trans;
          const pArr = isTrans ? posTr : posOp;
          const nArr = isTrans ? normTr : normOp;
          const uArr = isTrans ? uvTr : uvOp;
          const cArr = isTrans ? colTr : colOp;
          const iArr = isTrans ? idxTr : idxOp;

          for (let f = 0; f < 6; f++) {
            const face = faces[f];
            const nId = this.getG(
              wx + face.dir[0],
              y + face.dir[1],
              wz + face.dir[2],
            );
            const nProp = BLOCK_PROPS[nId] || {};

            if (id === BLOCKS.WATER && nId === BLOCKS.WATER) continue;
            if (!isTrans && nId !== BLOCKS.AIR && !nProp.trans) continue;
            if (isTrans && id !== BLOCKS.WATER && nId === id) continue;

            const ti = mapArr[face.faceIdx];
            const tu = (ti % 16) * ts,
              tv = 1 - Math.floor(ti / 16) * ts - ts;
            const vStart = pArr.length / 3;
            const yTopOffset = id === BLOCKS.WATER && f === 2 ? -0.12 : 0;

            face.corners.forEach((c) => {
              pArr.push(
                wx + c[0],
                y + c[1] + (c[1] === 1 ? yTopOffset : 0),
                wz + c[2],
              );
              nArr.push(face.dir[0], face.dir[1], face.dir[2]);
              cArr.push(face.shade, face.shade, face.shade);
            });

            uArr.push(tu, tv, tu + ts, tv, tu + ts, tv + ts, tu, tv + ts);
            iArr.push(
              vStart,
              vStart + 1,
              vStart + 2,
              vStart,
              vStart + 2,
              vStart + 3,
            );
          }
        }
      }
    }

    let opMesh = null,
      trMesh = null;
    if (posOp.length > 0) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(posOp, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(normOp, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvOp, 2));
      g.setAttribute('color', new THREE.Float32BufferAttribute(colOp, 3));
      g.setIndex(idxOp);
      opMesh = new THREE.Mesh(g, this.matOpaque);
      opMesh.receiveShadow = true;
      opMesh.castShadow = true;
      this.e.scene.add(opMesh);
    }
    if (posTr.length > 0) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(posTr, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(normTr, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvTr, 2));
      g.setAttribute('color', new THREE.Float32BufferAttribute(colTr, 3));
      g.setIndex(idxTr);
      trMesh = new THREE.Mesh(g, this.matTrans);
      this.e.scene.add(trMesh);
    }

    this.meshes.set(k, { op: opMesh, tr: trMesh });
  }

  updateAround(wx, wz) {
    const S = CONFIG.CHUNK_SIZE;
    const pcx = Math.floor(wx / S),
      pcz = Math.floor(wz / S);
    const R = CONFIG.RENDER_DISTANCE;
    for (let dx = -R; dx <= R; dx++) {
      for (let dz = -R; dz <= R; dz++) {
        let k = this.key(pcx + dx, pcz + dz);
        if (!this.meshes.has(k)) {
          this.rebuildChunk(pcx + dx, pcz + dz);
        }
      }
    }
    // Libertar memória de chunks muito distantes
    const U = CONFIG.UNLOAD_DISTANCE;
    for (const [k, meshObj] of this.meshes.entries()) {
      const [cx, cz] = k.split(',').map(Number);
      if (Math.abs(cx - pcx) > U || Math.abs(cz - pcz) > U) {
        if (meshObj.op) {
          this.e.scene.remove(meshObj.op);
          meshObj.op.geometry.dispose();
        }
        if (meshObj.tr) {
          this.e.scene.remove(meshObj.tr);
          meshObj.tr.geometry.dispose();
        }
        this.meshes.delete(k);
      }
    }
  }
}

class Player {
  constructor(e) {
    this.e = e;
    this.pos = new THREE.Vector3(8.5, 25.0, 10.5);
    this.vel = new THREE.Vector3();
    this.yaw = 0; // Olhar para Norte (-Z) em direção ao Baú Inicial
    this.pitch = -0.15;
    this.hp = 20;
    this.maxHp = 20;
    this.hunger = 20;
    this.maxHunger = 20;
    this.hungerTimer = 0;
    this.regenTimer = 0;
    this.onGround = false;
    this.inWater = false;
    this.w = 0.3;
    this.h = 1.62;
    this.eyeH = 1.5;

    this.cam = new THREE.PerspectiveCamera(
      CONFIG.FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      220,
    );
    this.inv = Array(36).fill(null); // 0..8 = Hotbar, 9..35 = Inventário
    this.selectedSlot = 0;
    this.lastHeldId = -1;

    // Itens iniciais no inventário
    this.inv[0] = { id: BLOCKS.SWORD, count: 1 };
    this.inv[1] = { id: BLOCKS.TORCH, count: 8 };
    this.inv[2] = { id: BLOCKS.PLANKS, count: 12 };

    this.keys = {};
    this.mining = { active: false, progress: 0, target: null };
    this.handSwing = 0;
    this.walkBob = 0;
    this.visitedBiomes = new Set(['plains']);

    this.setupHand();
    this.renderHotbar();
    this.renderHealth();
    this.renderHunger();
  }

  setupHand() {
    this.handGroup = new THREE.Group();
    this.handGroup.position.set(0.38, -0.34, -0.55);

    // Braço padrão
    const armGeo = new THREE.BoxGeometry(0.16, 0.52, 0.16);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xcca482 });
    this.armMesh = new THREE.Mesh(armGeo, armMat);
    this.armMesh.rotation.set(0.45, -0.3, 0.2);
    this.handGroup.add(this.armMesh);

    // Item / Bloco segurado em 3D
    this.heldItemMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.38),
      new THREE.MeshStandardMaterial({
        map: this.e.atlas.tex,
        transparent: true,
        alphaTest: 0.15,
        side: THREE.DoubleSide,
      }),
    );
    this.heldItemMesh.position.set(-0.04, 0.08, -0.05);
    this.heldItemMesh.rotation.set(0.1, -0.65, 0.15);
    this.heldItemMesh.visible = false;
    this.handGroup.add(this.heldItemMesh);

    this.heldBlockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.24, 0.24),
      new THREE.MeshStandardMaterial({ map: this.e.atlas.tex }),
    );
    this.heldBlockMesh.position.set(-0.04, 0.05, -0.05);
    this.heldBlockMesh.rotation.set(0.2, 0.75, 0);
    this.heldBlockMesh.visible = false;
    this.handGroup.add(this.heldBlockMesh);

    this.cam.add(this.handGroup);
    this.e.scene.add(this.cam);
    this.updateHeldVisual();
  }

  updateHeldVisual() {
    const held = this.getHeldItem();
    const id = held ? held.id : 0;
    if (id === this.lastHeldId) return;
    this.lastHeldId = id;

    if (!id) {
      this.armMesh.visible = true;
      this.heldItemMesh.visible = false;
      this.heldBlockMesh.visible = false;
      return;
    }

    const prop = BLOCK_PROPS[id] || {};
    const tIdx = this.e.atlas.getMap(id)[0];

    if (prop.isItem || prop.isFlora) {
      this.armMesh.visible = false;
      this.heldBlockMesh.visible = false;
      this.heldItemMesh.visible = true;
      this.heldItemMesh.geometry.dispose();
      this.heldItemMesh.geometry = new THREE.PlaneGeometry(0.42, 0.42);
      this.e.atlas.applyUV(this.heldItemMesh.geometry, tIdx);
    } else {
      this.armMesh.visible = false;
      this.heldItemMesh.visible = false;
      this.heldBlockMesh.visible = true;
      this.heldBlockMesh.geometry.dispose();
      this.heldBlockMesh.geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      this.e.atlas.applyUV(this.heldBlockMesh.geometry, tIdx);
    }
  }

  getHeldItem() {
    return this.inv[this.selectedSlot];
  }

  giveItem(id, count = 1) {
    if (!id || id === BLOCKS.AIR) return false;
    const stackable = !(BLOCK_PROPS[id] && BLOCK_PROPS[id].toolType);
    if (stackable) {
      for (let i = 0; i < 36; i++) {
        if (this.inv[i] && this.inv[i].id === id && this.inv[i].count < 64) {
          let add = Math.min(64 - this.inv[i].count, count);
          this.inv[i].count += add;
          count -= add;
          if (count <= 0) {
            this.renderHotbar();
            this.updateHeldVisual();
            return true;
          }
        }
      }
    }
    for (let i = 0; i < 36; i++) {
      if (!this.inv[i]) {
        this.inv[i] = { id, count };
        this.renderHotbar();
        this.updateHeldVisual();
        return true;
      }
    }
    return false;
  }

  countItem(id) {
    let total = 0;
    for (let i = 0; i < 36; i++) {
      if (this.inv[i] && this.inv[i].id === id) total += this.inv[i].count;
    }
    return total;
  }

  consumeItem(id, amount) {
    let rem = amount;
    for (let i = 0; i < 36; i++) {
      if (this.inv[i] && this.inv[i].id === id) {
        let take = Math.min(this.inv[i].count, rem);
        this.inv[i].count -= take;
        rem -= take;
        if (this.inv[i].count <= 0) this.inv[i] = null;
        if (rem <= 0) break;
      }
    }
    this.renderHotbar();
    this.updateHeldVisual();
  }

  selectSlot(idx) {
    this.selectedSlot = ((idx % 9) + 9) % 9;
    this.renderHotbar();
    this.updateHeldVisual();
    const item = this.getHeldItem();
    const banner = document.getElementById('item-name-banner');
    if (banner) {
      if (item && BLOCK_PROPS[item.id]) {
        banner.innerText = BLOCK_PROPS[item.id].name;
        banner.style.opacity = '1';
        clearTimeout(this._bannerTimer);
        this._bannerTimer = setTimeout(
          () => (banner.style.opacity = '0'),
          1800,
        );
      } else {
        banner.style.opacity = '0';
      }
    }
  }

  renderHotbar() {
    const wrap = document.getElementById('hotbar-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      slot.className = `hotbar-slot ${i === this.selectedSlot ? 'active' : ''}`;
      slot.onclick = () => this.selectSlot(i);
      const num = document.createElement('span');
      num.className = 'slot-num';
      num.innerText = i + 1;
      slot.appendChild(num);

      const item = this.inv[i];
      if (item && this.e.atlas.ui[item.id]) {
        const img = document.createElement('img');
        img.src = this.e.atlas.ui[item.id];
        slot.appendChild(img);
        if (item.count > 1) {
          const qty = document.createElement('span');
          qty.className = 'slot-qty';
          qty.innerText = item.count;
          slot.appendChild(qty);
        }
      }
      wrap.appendChild(slot);
    }
  }

  renderHealth() {
    const hb = document.getElementById('health-bar');
    if (!hb) return;
    hb.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const span = document.createElement('span');
      span.className = `heart ${this.hp <= 6 ? 'low-hp' : ''}`;
      let heartVal = (i + 1) * 2;
      if (this.hp >= heartVal) span.innerText = '❤️';
      else if (this.hp === heartVal - 1) span.innerText = '💔';
      else span.innerText = '🖤';
      hb.appendChild(span);
    }
  }

  renderHunger() {
    const hgb = document.getElementById('hunger-bar');
    if (!hgb) return;
    hgb.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const span = document.createElement('span');
      span.className = 'drumstick';
      let val = (10 - i) * 2;
      if (this.hunger >= val) span.innerText = '🍖';
      else if (this.hunger === val - 1) span.innerText = '🦴';
      else span.innerText = '▫️';
      hgb.appendChild(span);
    }
  }

  dmg(amount) {
    if (this.hp <= 0) return;
    this.hp = Math.max(0, this.hp - amount);
    this.renderHealth();
    this.e.audio.playHit();
    const flash = document.getElementById('damage-flash');
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => (flash.style.opacity = '0'), 180);
    }
    if (this.hp <= 0) {
      document.exitPointerLock();
      document.getElementById('death-screen').showModal();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.renderHealth();
  }

  respawn() {
    this.hp = this.maxHp;
    this.hunger = this.maxHunger;
    this.pos.set(8.5, 25.0, 10.5);
    this.vel.set(0, 0, 0);
    this.renderHealth();
    this.renderHunger();
    document.getElementById('death-screen').close();
    this.e.requestLock();
  }

  raycastBlock(maxDist = 5.5) {
    const origin = this.cam.position.clone();
    const dir = new THREE.Vector3();
    this.cam.getWorldDirection(dir);

    let prev = null;
    const step = 0.04;
    for (let d = 0; d <= maxDist; d += step) {
      const p = origin.clone().addScaledVector(dir, d);
      const bx = Math.floor(p.x),
        by = Math.floor(p.y),
        bz = Math.floor(p.z);
      const id = this.e.world.getG(bx, by, bz);
      if (id !== BLOCKS.AIR && id !== BLOCKS.WATER) {
        return { x: bx, y: by, z: bz, id, prev };
      }
      prev = { x: bx, y: by, z: bz };
    }
    return null;
  }

  interactRightClick() {
    this.handSwing = 1;
    const held = this.getHeldItem();

    // Comer comida
    if (held && BLOCK_PROPS[held.id] && BLOCK_PROPS[held.id].type === 'food') {
      if (this.hp < this.maxHp || this.hunger < this.maxHunger) {
        const prop = BLOCK_PROPS[held.id];
        this.heal(prop.heal || 2);
        this.hunger = Math.min(this.maxHunger, this.hunger + (prop.food || 4));
        this.renderHunger();
        this.consumeItem(held.id, 1);
        this.e.audio.playEat();
        showToast('🍖 Alimento consumido! Vida e fome restauradas.');
        return;
      }
    }

    const hit = this.raycastBlock();
    if (!hit) return;

    // Abrir Baú Inicial
    if (hit.id === BLOCKS.CHEST) {
      this.e.audio.playChestOpen();
      XboxAchv.unlock('Chest Hunter');
      this.e.tutorial.completeStep(1);
      if (!this.e.world.chestOpened) {
        this.e.world.chestOpened = true;
        this.giveItem(BLOCKS.WOOD, 4);
        this.giveItem(BLOCKS.APPLE, 3);
        this.giveItem(BLOCKS.COBBLESTONE, 8);
        this.giveItem(BLOCKS.COAL_ORE, 4);
        showToast(
          '📦 Baú Inicial aberto! Recebeste Madeira, Maçãs, Pedra e Carvão!',
        );
      } else {
        showToast('📦 O Baú Inicial já foi saqueado.');
      }
      return;
    }

    // Abrir Bancada de Trabalho
    if (hit.id === BLOCKS.CRAFTING_TABLE) {
      this.e.craftingUI.toggle(true);
      return;
    }

    // Colocar Bloco
    if (held && !BLOCK_PROPS[held.id].isItem && hit.prev) {
      const { x, y, z } = hit.prev;
      const pMinX = this.pos.x - this.w,
        pMaxX = this.pos.x + this.w;
      const pMinY = this.pos.y - this.h,
        pMaxY = this.pos.y + 0.1;
      const pMinZ = this.pos.z - this.w,
        pMaxZ = this.pos.z + this.w;

      const overlaps =
        x + 1 > pMinX &&
        x < pMaxX &&
        y + 1 > pMinY &&
        y < pMaxY &&
        z + 1 > pMinZ &&
        z < pMaxZ;
      if (!overlaps || !BLOCK_PROPS[held.id].solid) {
        this.e.world.setG(x, y, z, held.id);
        this.e.audio.playPlace(BLOCK_PROPS[held.id].sound || 'dirt');
        this.consumeItem(held.id, 1);
      }
    }
  }

  attackLeftClick() {
    this.handSwing = 1;
    const held = this.getHeldItem();
    const dmg =
      held && BLOCK_PROPS[held.id] && BLOCK_PROPS[held.id].dmg
        ? BLOCK_PROPS[held.id].dmg
        : 2;

    // Verificar ataque a Mobs
    const origin = this.cam.position;
    const dir = new THREE.Vector3();
    this.cam.getWorldDirection(dir);

    for (let mob of this.e.mobs.list) {
      if (mob.dead) continue;
      const toMob = mob.pos.clone().sub(origin);
      const dist = toMob.length();
      if (dist < 3.6) {
        toMob.normalize();
        if (dir.dot(toMob) > 0.78) {
          mob.dmg(dmg);
          return true;
        }
      }
    }
    return false;
  }

  chkCol(box) {
    let mx = Math.floor(box.min.x),
      mX = Math.floor(box.max.x);
    let my = Math.floor(box.min.y),
      mY = Math.floor(box.max.y);
    let mz = Math.floor(box.min.z),
      mZ = Math.floor(box.max.z);
    for (let y = my; y <= mY; y++) {
      for (let z = mz; z <= mZ; z++) {
        for (let x = mx; x <= mX; x++) {
          let v = this.e.world.getG(x, y, z);
          if (
            v !== BLOCKS.AIR &&
            v !== BLOCKS.WATER &&
            BLOCK_PROPS[v] &&
            BLOCK_PROPS[v].solid
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  update(dt) {
    // Câmara
    this.cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');

    // Verificar água
    const feetBlock = this.e.world.getG(
      Math.floor(this.pos.x),
      Math.floor(this.pos.y - 1.2),
      Math.floor(this.pos.z),
    );
    const headBlock = this.e.world.getG(
      Math.floor(this.pos.x),
      Math.floor(this.pos.y - 0.1),
      Math.floor(this.pos.z),
    );
    this.inWater = feetBlock === BLOCKS.WATER || headBlock === BLOCKS.WATER;

    const uw = document.getElementById('underwater-overlay');
    if (uw) uw.style.opacity = headBlock === BLOCKS.WATER ? '1' : '0';

    // Movimento horizontal
    const forward = new THREE.Vector3(
      -Math.sin(this.yaw),
      0,
      -Math.cos(this.yaw),
    );
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (this.keys['KeyW']) move.add(forward);
    if (this.keys['KeyS']) move.sub(forward);
    if (this.keys['KeyD']) move.add(right);
    if (this.keys['KeyA']) move.sub(right);
    if (move.lengthSq() > 0) move.normalize();

    const isMoving = move.lengthSq() > 0.01;
    const speed = this.keys['ShiftLeft'] ? 2.6 : this.inWater ? 3.5 : 5.4;
    this.vel.x += (move.x * speed - this.vel.x) * 12 * dt;
    this.vel.z += (move.z * speed - this.vel.z) * 12 * dt;

    // Balanço da mão ao caminhar e golpear
    if (isMoving && this.onGround) this.walkBob += dt * 9.5;
    const bobX = Math.cos(this.walkBob * 0.5) * 0.025;
    const bobY = Math.abs(Math.sin(this.walkBob)) * 0.025;
    let swingAngle = 0;
    if (this.handSwing > 0) {
      this.handSwing = Math.max(0, this.handSwing - dt * 4.5);
      swingAngle = Math.sin(this.handSwing * Math.PI) * 1.15;
    }
    this.handGroup.position.set(
      0.38 + bobX,
      -0.34 - bobY - swingAngle * 0.12,
      -0.55 - swingAngle * 0.1,
    );
    this.handGroup.rotation.x = -swingAngle;

    // Sistema de Fome e Regeneração Natural
    this.hungerTimer += dt * (isMoving ? 1.5 : 0.4);
    if (this.hungerTimer >= 28) {
      this.hungerTimer = 0;
      if (this.hunger > 0) {
        this.hunger--;
        this.renderHunger();
      } else {
        this.dmg(1);
      }
    }
    if (this.hunger >= 16 && this.hp < this.maxHp) {
      this.regenTimer += dt;
      if (this.regenTimer >= 4) {
        this.regenTimer = 0;
        this.heal(1);
      }
    }

    // Gravidade e Salto
    if (this.inWater) {
      this.vel.y -= 8 * dt;
      if (this.keys['Space']) this.vel.y = 4.2;
    } else {
      this.vel.y -= 28 * dt;
      if (this.keys['Space'] && this.onGround) {
        this.vel.y = 8.6;
        this.onGround = false;
      }
    }

    // Resolver colisões AABB
    const box = new THREE.Box3();
    const moveAxis = (ax) => {
      this.pos[ax] += this.vel[ax] * dt;
      box.min.set(
        this.pos.x - this.w,
        this.pos.y - this.h,
        this.pos.z - this.w,
      );
      box.max.set(this.pos.x + this.w, this.pos.y + 0.1, this.pos.z + this.w);
      if (this.chkCol(box)) {
        this.pos[ax] -= this.vel[ax] * dt;
        if (ax === 'y') {
          if (this.vel.y < -14) {
            this.dmg(Math.floor((-this.vel.y - 13) * 1.5));
          }
          if (this.vel.y < 0) this.onGround = true;
          this.vel.y = 0;
        } else {
          this.vel[ax] = 0;
        }
      } else if (ax === 'y') {
        this.onGround = false;
      }
    };
    moveAxis('x');
    moveAxis('z');
    moveAxis('y');

    // Posicionar câmara
    const crouchOffset = this.keys['ShiftLeft'] ? -0.22 : 0;
    this.cam.position.set(this.pos.x, this.pos.y + crouchOffset, this.pos.z);

    // Mineração contínua com sobreposição visual de rachadura
    const mineBar = document.getElementById('mining-bar-container');
    const mineFill = document.getElementById('mining-bar-fill');

    if (this.mining.active) {
      this.handSwing = Math.max(this.handSwing, 0.5);
      const hit = this.raycastBlock();
      if (hit && hit.id !== BLOCKS.BEDROCK) {
        const t = this.mining.target;
        if (!t || t.x !== hit.x || t.y !== hit.y || t.z !== hit.z) {
          this.mining.target = { x: hit.x, y: hit.y, z: hit.z };
          this.mining.progress = 0;
          this.mining.soundTimer = 0;
        }
        const prop = BLOCK_PROPS[hit.id] || { hardness: 1 };
        const held = this.getHeldItem();
        const heldProp = held ? BLOCK_PROPS[held.id] : null;
        let mult = 1.0;
        if (heldProp && prop.tool && heldProp.toolType === prop.tool) {
          mult = heldProp.multiplier || 3.0;
        }
        this.mining.progress += (dt * mult) / Math.max(0.08, prop.hardness);
        this.mining.soundTimer += dt;
        if (this.mining.soundTimer > 0.24) {
          this.mining.soundTimer = 0;
          this.e.audio.playMineStep(prop.sound || 'dirt');
          this.e.particles.spawn(
            new THREE.Vector3(hit.x, hit.y, hit.z),
            hit.id,
            2,
          );
        }

        if (mineBar && mineFill) {
          mineBar.style.display = 'block';
          mineFill.style.width = `${Math.min(100, this.mining.progress * 100)}%`;
        }

        if (this.e.crackBox) {
          this.e.crackBox.visible = true;
          this.e.crackBox.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
          this.e.crackBox.material.opacity = Math.min(
            0.65,
            this.mining.progress * 0.7,
          );
        }

        if (this.mining.progress >= 1.0) {
          this.e.audio.playDig(prop.sound || 'dirt');
          this.e.particles.spawn(
            new THREE.Vector3(hit.x, hit.y, hit.z),
            hit.id,
            10,
          );
          this.e.drops.spawn(
            new THREE.Vector3(hit.x, hit.y, hit.z),
            hit.id,
            false,
          );
          this.e.world.setG(hit.x, hit.y, hit.z, BLOCKS.AIR);

          if (hit.id === BLOCKS.WOOD) {
            XboxAchv.unlock('Getting Wood');
            this.e.tutorial.completeStep(2);
          } else if (hit.id === BLOCKS.CHEST) {
            XboxAchv.unlock('Chest Hunter');
            this.e.tutorial.completeStep(1);
            if (!this.e.world.chestOpened) {
              this.e.world.chestOpened = true;
              this.giveItem(BLOCKS.WOOD, 4);
              this.giveItem(BLOCKS.APPLE, 3);
              showToast('📦 Suprimentos do Baú recolhidos!');
            }
          }

          this.mining.progress = 0;
          this.mining.target = null;
          if (mineBar) mineBar.style.display = 'none';
          if (this.e.crackBox) this.e.crackBox.visible = false;
        }
      } else {
        this.mining.progress = 0;
        if (mineBar) mineBar.style.display = 'none';
        if (this.e.crackBox) this.e.crackBox.visible = false;
      }
    } else {
      if (mineBar) mineBar.style.display = 'none';
      if (this.e.crackBox) this.e.crackBox.visible = false;
    }

    // Atualizar HUD de coordenadas e bioma
    const px = Math.floor(this.pos.x),
      py = Math.floor(this.pos.y),
      pz = Math.floor(this.pos.z);
    const posEl = document.getElementById('pos-counter');
    if (posEl) posEl.innerText = `XYZ: ${px} / ${py} / ${pz}`;

    const biome = this.e.world.getBiome(px, pz);
    this.visitedBiomes.add(biome);
    if (this.visitedBiomes.size >= 3) XboxAchv.unlock('Adventurer');

    const biomeNames = {
      plains: 'Planície & Floresta',
      desert: 'Deserto Árido',
      snow: 'Tundra Nevada',
      mountains: 'Montanhas Rochosas',
    };
    const bEl = document.getElementById('biome-counter');
    if (bEl) bEl.innerText = `Bioma: ${biomeNames[biome] || biome}`;

    this.e.world.updateAround(px, pz);
  }
}

class CraftingUI {
  constructor(e) {
    this.e = e;
    this.open = false;
    this.currentCat = 'structures';
    this.selectedRecipeIdx = 0;
    this.el = document.getElementById('ui-crafting');
    this.setupEvents();
  }

  setupEvents() {
    document.getElementById('btn-close-inv').onclick = () => this.toggle(false);
    document.getElementById('ui-btn-craft').onclick = () =>
      this.craftSelected();
    this.el.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.toggle(false);
    });
  }

  toggle(forceState = null) {
    const next = forceState ?? !this.open;
    if (next === this.open) return;
    this.open = next;
    if (this.open) {
      XboxAchv.unlock('Taking Inventory');
      document.exitPointerLock();
      this.render();
      this.el.showModal();
      document.getElementById('btn-close-inv').focus();
    } else {
      this.el.close();
      if (this.e.started && !this.e.paused) this.e.requestLock();
    }
  }

  canCraft(recipe) {
    return recipe.req.every(([id, qty]) => this.e.player.countItem(id) >= qty);
  }

  craftSelected() {
    const catRecipes = RECIPES.filter((r) => r.cat === this.currentCat);
    const recipe = catRecipes[this.selectedRecipeIdx];
    if (!recipe || !this.canCraft(recipe)) return;

    recipe.req.forEach(([id, qty]) => this.e.player.consumeItem(id, qty));
    this.e.player.giveItem(recipe.res, recipe.count);
    this.e.audio.playCraft();
    showToast(`🛠️ Fabricado: ${recipe.name} (x${recipe.count})`);

    if (recipe.res === BLOCKS.PLANKS) this.e.tutorial.completeStep(3);
    if (recipe.res === BLOCKS.CRAFTING_TABLE) {
      XboxAchv.unlock('Benchmarking');
      this.e.tutorial.completeStep(4);
    }
    if ([BLOCKS.PICKAXE, BLOCKS.AXE, BLOCKS.SWORD].includes(recipe.res)) {
      XboxAchv.unlock('Time to Strike');
      this.e.tutorial.completeStep(5);
    }
    if ([BLOCKS.STONE_PICKAXE, BLOCKS.STONE_SWORD].includes(recipe.res)) {
      XboxAchv.unlock('Getting an Upgrade');
    }

    this.render();
  }

  render() {
    const activeControl = document.activeElement.dataset.craftControl;
    const controls = new Map();
    const makeButton = (key, label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.craftControl = key;
      button.setAttribute('aria-label', label);
      controls.set(key, button);
      return button;
    };

    // Abas
    const tabsEl = document.getElementById('ui-tabs');
    tabsEl.innerHTML = '';
    RECIPE_CATEGORIES.forEach((cat) => {
      const tab = makeButton(`category-${cat.id}`, cat.name);
      tab.className = `xb-tab ${cat.id === this.currentCat ? 'active' : ''}`;
      tab.setAttribute('aria-pressed', cat.id === this.currentCat);
      tab.title = cat.name;
      tab.innerHTML = `<img src="${this.e.atlas.ui[cat.icon]}" alt="">`;
      tab.onclick = () => {
        this.currentCat = cat.id;
        this.selectedRecipeIdx = 0;
        this.e.audio.playUI();
        this.render();
      };
      tabsEl.appendChild(tab);
    });

    // Carrossel de Receitas
    const catRecipes = RECIPES.filter((r) => r.cat === this.currentCat);
    const carEl = document.getElementById('ui-carousel');
    carEl.innerHTML = '';
    catRecipes.forEach((rec, idx) => {
      const item = makeButton(`recipe-${idx}`, rec.name);
      const ok = this.canCraft(rec);
      item.className = `xb-carousel-item ${idx === this.selectedRecipeIdx ? 'selected' : ''}`;
      item.style.opacity = ok ? '1' : '0.55';
      item.setAttribute('aria-pressed', idx === this.selectedRecipeIdx);
      item.innerHTML = `<img src="${this.e.atlas.ui[rec.res]}" alt=""><span class="slot-qty">${rec.count > 1 ? rec.count : ''}</span>`;
      item.onclick = () => {
        this.selectedRecipeIdx = idx;
        this.e.audio.playUI();
        this.render();
      };
      carEl.appendChild(item);
    });

    // Detalhes da Receita
    const activeRec = catRecipes[this.selectedRecipeIdx] || catRecipes[0];
    document.getElementById('ui-recipe-name').innerText = activeRec.name;

    const gridEl = document.getElementById('ui-grid-3x3');
    gridEl.innerHTML = '';
    activeRec.grid.forEach((gid) => {
      const cell = document.createElement('div');
      cell.className = 'xb-slot';
      if (gid && this.e.atlas.ui[gid]) {
        cell.innerHTML = `<img src="${this.e.atlas.ui[gid]}">`;
      }
      gridEl.appendChild(cell);
    });

    const reqEl = document.getElementById('ui-req-list');
    reqEl.innerHTML = '';
    activeRec.req.forEach(([id, need]) => {
      const have = this.e.player.countItem(id);
      const ok = have >= need;
      const badge = document.createElement('div');
      badge.className = `xb-req-badge ${ok ? 'req-ok' : 'req-fail'}`;
      badge.innerHTML = `<img src="${this.e.atlas.ui[id]}"><span>${have}/${need}</span>`;
      reqEl.appendChild(badge);
    });

    const btnCraft = document.getElementById('ui-btn-craft');
    const craftable = this.canCraft(activeRec);
    btnCraft.className = `btn-craft ${craftable ? '' : 'disabled'}`;
    btnCraft.innerText = craftable
      ? `FABRICAR ${activeRec.name.toUpperCase()} (A)`
      : 'MATERIAIS INSUFICIENTES';
    btnCraft.setAttribute('aria-disabled', !craftable);

    // Inventário Principal & Hotbar
    const mainInvEl = document.getElementById('ui-inv-main');
    const hotbarInvEl = document.getElementById('ui-inv-hotbar');
    mainInvEl.innerHTML = '';
    hotbarInvEl.innerHTML = '';

    const createCell = (slotIdx) => {
      const it = this.e.player.inv[slotIdx];
      const itemName = BLOCK_PROPS[it?.id]?.name;
      const cell = makeButton(
        `slot-${slotIdx}`,
        `Espaço ${slotIdx + 1}: ${itemName ? `${itemName} (${it.count})` : 'vazio'}`,
      );
      cell.className = 'inv-cell';
      if (it && this.e.atlas.ui[it.id]) {
        cell.innerHTML = `<img src="${this.e.atlas.ui[it.id]}" alt="">${it.count > 1 ? `<span class="slot-qty">${it.count}</span>` : ''}`;
        cell.title = BLOCK_PROPS[it.id]?.name || '';
      }
      cell.onclick = () => {
        // Trocar rapidamente entre inventário e slot selecionado da hotbar
        const targetHotbar = this.e.player.selectedSlot;
        if (slotIdx !== targetHotbar) {
          const temp = this.e.player.inv[targetHotbar];
          this.e.player.inv[targetHotbar] = this.e.player.inv[slotIdx];
          this.e.player.inv[slotIdx] = temp;
          this.e.player.renderHotbar();
          this.e.audio.playUI();
          this.render();
        }
      };
      return cell;
    };

    for (let i = 9; i < 36; i++) mainInvEl.appendChild(createCell(i));
    for (let i = 0; i < 9; i++) hotbarInvEl.appendChild(createCell(i));
    controls.get(activeControl)?.focus();
  }
}

export class GameEngine {
  constructor() {
    this.started = false;
    this.paused = false;
    this.isNight = false;
    this.dayTime = 0.25;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.touchControls = window.matchMedia('(pointer: coarse)');

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x78a7ff);
    this.scene.fog = new THREE.FogExp2(0x78a7ff, 0.014);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.domElement.tabIndex = -1;
    this.renderer.domElement.setAttribute('aria-label', 'Mundo de voxels');
    document.body.appendChild(this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.68);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff5e0, 0.85);
    this.sunLight.position.set(40, 80, 30);
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    this.audio = new AudioManager();
    this.tutorial = new TutorialManager();
    this.atlas = new AtlasGen();
    this.particles = new Particles(this);
    this.drops = new DroppedItems(this);
    this.world = new VoxelWorld(this);
    this.player = new Player(this);
    this.mobs = new MobManager(this);
    this.craftingUI = new CraftingUI(this);

    this.highlightBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01, 1.01, 1.01)),
      new THREE.LineBasicMaterial({ color: 0x000000 }),
    );
    this.highlightBox.visible = false;
    this.scene.add(this.highlightBox);

    // Caixa de dano progressivo durante mineração
    this.crackBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.015, 1.015, 1.015),
      new THREE.MeshBasicMaterial({
        color: 0x111111,
        wireframe: false,
        transparent: true,
        opacity: 0,
      }),
    );
    this.crackBox.visible = false;
    this.scene.add(this.crackBox);

    // Nuvens 3D quadradas estilo Minecraft
    this.cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.78,
    });
    for (let i = 0; i < 18; i++) {
      const cw = 8 + Math.random() * 14;
      const cd = 6 + Math.random() * 12;
      const cMesh = new THREE.Mesh(
        new THREE.BoxGeometry(cw, 1.2, cd),
        cloudMat,
      );
      cMesh.position.set(
        (Math.random() - 0.5) * 180,
        56 + (i % 2) * 1.5,
        (Math.random() - 0.5) * 180,
      );
      this.cloudsGroup.add(cMesh);
    }
    this.scene.add(this.cloudsGroup);

    this.bindEvents();
  }

  async initWorld() {
    updateLoading(25, 'A Construir Texturas 16x16 Xbox 360...');
    await new Promise((r) => setTimeout(r, 80));

    updateLoading(55, 'A Gerar Forte Inicial & Biomas...');
    this.world.updateAround(8, 8);
    await new Promise((r) => setTimeout(r, 120));

    updateLoading(85, 'A Invocar Criaturas & Mobs...');
    this.mobs.spawnInitial();
    XboxAchv.updateUI();

    const splash = document.getElementById('splash-text');
    if (splash)
      splash.innerText =
        SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)];

    updateLoading(100, 'Pronto!');
    setTimeout(() => {
      document.getElementById('loading-screen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
      }, 500);
    }, 250);

    this.lastTime = performance.now();
    this.frames = 0;
    this.fpsTime = 0;
    this.loop(this.lastTime);
  }

  async requestLock() {
    if (this.touchControls.matches) return;
    try {
      await this.renderer.domElement.requestPointerLock();
    } catch {
      this.updatePointerLockBanner();
    }
  }

  updatePointerLockBanner() {
    const locked = document.pointerLockElement === this.renderer.domElement;
    const show =
      this.started &&
      !this.paused &&
      !this.craftingUI.open &&
      this.player.hp > 0 &&
      !this.touchControls.matches &&
      !locked;
    document.getElementById('pointer-lock-banner').style.display = show
      ? 'block'
      : 'none';
    if (!locked) this.player.mining.active = false;
  }

  startGame() {
    this.audio.resume();
    this.audio.playUI();
    this.started = true;
    this.paused = false;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('mobile-controls').hidden = false;
    this.renderer.domElement.focus();
    this.requestLock();
  }

  setPaused(state) {
    this.paused = state;
    const pm = document.getElementById('pause-menu');
    if (state) {
      document.exitPointerLock();
      if (!pm.open) pm.showModal();
    } else {
      pm.close();
      this.requestLock();
    }
  }

  toggleDayNight() {
    this.isNight = !this.isNight;
    const sky = this.isNight ? 0x090d1a : 0x78a7ff;
    this.scene.background.setHex(sky);
    this.scene.fog.color.setHex(sky);
    this.ambientLight.intensity = this.isNight ? 0.25 : 0.68;
    this.sunLight.intensity = this.isNight ? 0.15 : 0.85;
    const tc = document.getElementById('time-counter');
    if (tc)
      tc.innerText = `Hora: ${this.isNight ? 'Noite 🌙' : 'Dia ☀️'} | [E] Crafting | [P] Pausa`;
    showToast(
      this.isNight
        ? '🌙 A noite caiu! Cuidado com os monstros!'
        : '☀️ Amanheceu!',
    );
  }

  bindEvents() {
    const achievements = document.getElementById('achv-modal');
    const help = document.getElementById('help-modal');
    const pause = document.getElementById('pause-menu');
    pause.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.setPaused(false);
    });
    document
      .getElementById('death-screen')
      .addEventListener('cancel', (event) => event.preventDefault());

    window.addEventListener('resize', () => {
      this.player.cam.aspect = window.innerWidth / window.innerHeight;
      this.player.cam.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.getElementById('btn-start').onclick = () => this.startGame();
    document.getElementById('hint-play').onclick = () => this.startGame();

    document.getElementById('btn-open-achv').onclick = () => {
      this.audio.playUI();
      achievements.showModal();
    };
    document.getElementById('hint-achv').onclick = () =>
      document.getElementById('btn-open-achv').click();
    document.getElementById('btn-close-achv').onclick = () => {
      this.audio.playUI();
      achievements.close();
    };

    document.getElementById('btn-how-to').onclick = () => {
      this.audio.playUI();
      help.showModal();
    };
    document.getElementById('hint-help').onclick = () =>
      document.getElementById('btn-how-to').click();
    document.getElementById('btn-close-help').onclick = () => {
      this.audio.playUI();
      help.close();
    };

    document.getElementById('btn-resume').onclick = () => this.setPaused(false);
    document.getElementById('btn-pause-achv').onclick = () => {
      achievements.showModal();
    };
    document.getElementById('btn-toggle-time').onclick = () => {
      this.toggleDayNight();
      this.setPaused(false);
    };
    document.getElementById('btn-spawn-creeper').onclick = () => {
      let px = Math.floor(this.player.pos.x + 6);
      let pz = Math.floor(this.player.pos.z - 6);
      this.mobs.spawnNear(px, pz, 'creeper');
      this.mobs.spawnNear(px - 3, pz, 'zombie');
      showToast('💥 Creeper e Zombie invocados!');
      this.setPaused(false);
    };
    document.getElementById('btn-main-menu').onclick = () => {
      this.started = false;
      this.paused = false;
      pause.close();
      document.getElementById('hud').style.display = 'none';
      document.getElementById('mobile-controls').hidden = true;
      document.getElementById('main-menu').style.display = 'flex';
      document.getElementById('btn-start').focus();
    };

    document.getElementById('btn-respawn').onclick = () =>
      this.player.respawn();
    document.getElementById('pointer-lock-banner').onclick = () =>
      this.requestLock();

    document.addEventListener('pointerlockchange', () =>
      this.updatePointerLockBanner(),
    );
    document.addEventListener('pointerlockerror', () =>
      this.updatePointerLockBanner(),
    );

    document.addEventListener('mousemove', (e) => {
      if (
        document.pointerLockElement === this.renderer.domElement &&
        this.started &&
        !this.paused &&
        !this.craftingUI.open
      ) {
        this.player.yaw -= e.movementX * 0.0024;
        this.player.pitch = Math.max(
          -Math.PI / 2 + 0.05,
          Math.min(
            Math.PI / 2 - 0.05,
            this.player.pitch - e.movementY * 0.0024,
          ),
        );
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (
        !this.started ||
        this.paused ||
        this.craftingUI.open ||
        this.player.hp <= 0
      )
        return;
      if (e.target.closest('button')) return;
      if (document.pointerLockElement !== this.renderer.domElement) {
        this.requestLock();
        return;
      }
      if (e.button === 0) {
        const hitMob = this.player.attackLeftClick();
        if (!hitMob) this.player.mining.active = true;
      } else if (e.button === 2) {
        this.player.interactRightClick();
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.player.mining.active = false;
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('wheel', (e) => {
      if (!this.started || this.paused || this.craftingUI.open) return;
      this.player.selectSlot(
        this.player.selectedSlot + (e.deltaY > 0 ? 1 : -1),
      );
    });

    window.addEventListener('keydown', (e) => {
      if (achievements.open || help.open) return;
      if (this.craftingUI.open || pause.open) {
        if (!e.repeat && /^(KeyE|KeyP)$/.test(e.code)) {
          if (this.craftingUI.open) this.craftingUI.toggle(false);
          else if (e.code === 'KeyP') this.setPaused(false);
        }
        return;
      }
      if (!this.started || this.player.hp <= 0) return;
      this.player.keys[e.code] = true;

      if (e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''), 10);
        if (num >= 1 && num <= 9) this.player.selectSlot(num - 1);
      }

      if (e.code === 'KeyE' && !e.repeat) {
        this.craftingUI.toggle();
      }

      if ((e.code === 'KeyP' || e.code === 'Escape') && !e.repeat) {
        if (e.code === 'Escape') e.preventDefault();
        this.setPaused(true);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.player.keys[e.code] = false;
    });

    // Controlos táteis para dispositivos móveis / tablets
    document.querySelectorAll('.touch-btn').forEach((btn) => {
      const key = btn.dataset.key;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.player.keys[key] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.player.keys[key] = false;
      });
      btn.addEventListener('touchcancel', () => {
        this.player.keys[key] = false;
      });
      btn.addEventListener('keydown', (event) => {
        if (event.code !== 'Space' && event.code !== 'Enter') return;
        event.preventDefault();
        this.player.keys[key] = true;
      });
      btn.addEventListener('keyup', () => {
        this.player.keys[key] = false;
      });
      btn.addEventListener('blur', () => {
        this.player.keys[key] = false;
      });
    });

    const mobMine = document.getElementById('mob-btn-mine');
    if (mobMine) {
      mobMine.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const hitMob = this.player.attackLeftClick();
        if (!hitMob) this.player.mining.active = true;
      });
      mobMine.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.player.mining.active = false;
      });
      mobMine.addEventListener('touchcancel', () => {
        this.player.mining.active = false;
      });
      mobMine.addEventListener('click', () => this.player.attackLeftClick());
    }

    const mobUse = document.getElementById('mob-btn-use');
    if (mobUse) {
      mobUse.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.player.interactRightClick();
      });
      mobUse.addEventListener('click', () => this.player.interactRightClick());
    }

    const mobCraft = document.getElementById('mob-btn-craft');
    if (mobCraft) {
      mobCraft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.craftingUI.toggle();
      });
      mobCraft.addEventListener('click', () => this.craftingUI.toggle());
    }

    let touchLookId = null,
      lastTouchX = 0,
      lastTouchY = 0;
    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (!this.started || this.paused || this.craftingUI.open) return;
      const t = e.changedTouches[0];
      touchLookId = t.identifier;
      lastTouchX = t.clientX;
      lastTouchY = t.clientY;
    });
    this.renderer.domElement.addEventListener('touchmove', (e) => {
      for (let t of e.changedTouches) {
        if (t.identifier === touchLookId) {
          const dx = t.clientX - lastTouchX;
          const dy = t.clientY - lastTouchY;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
          this.player.yaw -= dx * 0.005;
          this.player.pitch = Math.max(
            -Math.PI / 2 + 0.05,
            Math.min(Math.PI / 2 - 0.05, this.player.pitch - dy * 0.005),
          );
        }
      }
    });
  }

  loop(now) {
    requestAnimationFrame((t) => this.loop(t));
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.frames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 0.5) {
      const fpsEl = document.getElementById('fps-counter');
      if (fpsEl)
        fpsEl.innerText = `FPS: ${Math.round(this.frames / this.fpsTime)}`;
      this.frames = 0;
      this.fpsTime = 0;
    }

    // Animar nuvens 3D no céu
    if (this.cloudsGroup && !this.reducedMotion.matches) {
      this.cloudsGroup.children.forEach((c) => {
        c.position.x += dt * 1.4;
        if (c.position.x > this.player.pos.x + 110)
          c.position.x = this.player.pos.x - 110;
      });
    }

    if (!this.started) {
      // Câmara orbital panorâmica no menu principal
      const t = this.reducedMotion.matches ? 0 : now * 0.00025;
      this.player.cam.position.set(
        8 + Math.cos(t) * 22,
        34,
        8 + Math.sin(t) * 22,
      );
      this.player.cam.lookAt(8, 22, 8);
    } else if (!this.paused && !this.craftingUI.open && this.player.hp > 0) {
      this.player.update(dt);
      this.mobs.update(dt);
      this.drops.update(dt);
      this.particles.update(dt);

      // Destaque wireframe do bloco alvo
      const hit = this.player.raycastBlock();
      if (hit) {
        this.highlightBox.visible = true;
        this.highlightBox.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
      } else {
        this.highlightBox.visible = false;
      }
    }

    this.renderer.render(this.scene, this.player.cam);
  }
}
