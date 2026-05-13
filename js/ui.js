const bgm = document.getElementById('bgm');
const bgmButton = document.getElementById('bgmButton');
const breakButton = document.getElementById('breakButton');
const breakArea = document.getElementById('breakArea');
const cursorGlow = document.getElementById('cursorGlow');
const xpFill = document.getElementById('xpFill');
const levelText = document.getElementById('levelText');
const toastArea = document.getElementById('toastArea');

let bgmOn = false;
let secretClicks = 0;
let lastLevel = null;
let currentTaltAudio = null;
let taltBubbleTimer = null;

const lastRenderedStats = {
  trust: null,
  resonance: null,
  emotion: null,
  xp: null
};