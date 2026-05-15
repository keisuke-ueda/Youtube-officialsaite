const bgmTracks = [
  'media/bgm1.mp3',
  'media/bgm2.mp3',
  'media/bgm3.mp3',
  'media/bgm4.mp3',
];

let currentBgmIndex = -1;
let bgmVolume = 0.3;

/* =========================
   共通SE
========================= */

const uiSeVolume = 0.45;

const breakSe = new Audio('media/se/break.mp3');
breakSe.volume = 0.7;
breakSe.preload = 'auto';

const heartSe = new Audio('media/se/heart.mp3');
heartSe.volume = 0.7;
heartSe.preload = 'auto';

const levelUpSe = new Audio('media/se/levelup.mp3');
levelUpSe.volume = 0.26;
levelUpSe.preload = 'auto';

const secretMissionSe = new Audio('media/se/secret.mp3');
secretMissionSe.volume = 0.26;
secretMissionSe.preload = 'auto';

function playSe(audio) {
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playBreakSe() {
  playSe(breakSe);
}

function playHeartSe() {
  playSe(heartSe);
}

function playLevelUpSe() {
  playSe(levelUpSe);
}

function playSecretMissionSe() {
  playSe(secretMissionSe);
}

/* =========================
   BGM
========================= */

function updateBgmButton() {
  if (!bgmButton) return;

  if (bgmOn) {
    bgmButton.textContent = '🎵';
    bgmButton.classList.remove('is-off');
    bgmButton.setAttribute('aria-label', 'BGMを止める');
  } else {
    bgmButton.textContent = '🔇';
    bgmButton.classList.add('is-off');
    bgmButton.setAttribute('aria-label', 'BGMを流す');
  }
}

function getRandomBgmIndex() {
  if (bgmTracks.length <= 1) return 0;

  let nextIndex;

  do {
    nextIndex = Math.floor(Math.random() * bgmTracks.length);
  } while (nextIndex === currentBgmIndex);

  return nextIndex;
}

function setRandomBgm() {
  if (!bgm) return;

  currentBgmIndex = getRandomBgmIndex();
  bgm.src = bgmTracks[currentBgmIndex];
  bgm.volume = bgmVolume;
}

async function playBgm() {
  if (!bgm) return;

  if (!bgm.src) {
    setRandomBgm();
  }

  bgm.volume = bgmVolume;

  try {
    await bgm.play();

    bgmOn = true;
    updateBgmButton();

    unlock('bgm');
    completeQuest('bgm');

    state.resonance += 15;
    addXP(18, '共鳴率');
  } catch {
    toast('⚠️ BGM再生エラー', '音源ファイルのパスを確認してください。');
  }
}

function pauseBgm() {
  if (!bgm) return;

  bgm.pause();
  bgmOn = false;
  updateBgmButton();
}

function stopBgm() {
  if (!bgm) return;

  bgm.pause();
  bgm.currentTime = 0;
  bgmOn = false;
  updateBgmButton();
}

async function nextRandomBgm() {
  if (!bgm) return;

  setRandomBgm();

  if (bgmOn) {
    try {
      await bgm.play();
    } catch {
      toast('⚠️ BGM再生エラー', '次のBGMを再生できませんでした。');
    }
  }
}

function setBgmVolume(value) {
  bgmVolume = Math.max(0, Math.min(1, Number(value)));

  if (bgm) {
    bgm.volume = bgmVolume;
  }

  localStorage.setItem('kei_bgm_volume', String(bgmVolume));
}

function loadBgmVolume() {
  const saved = localStorage.getItem('kei_bgm_volume');

  if (saved !== null) {
    bgmVolume = Math.max(0, Math.min(1, Number(saved)));
  }

  if (bgm) {
    bgm.volume = bgmVolume;
  }
}

function initBgmPlayer() {
  if (!bgm) return;

  loadBgmVolume();
  setRandomBgm();

  bgm.loop = false;
  updateBgmButton();

  bgm.addEventListener('ended', () => {
    nextRandomBgm();
  });
}

/* =========================
   タルト君ボイス
========================= */

function speakTaltMessage(message) {
  const bubble = document.getElementById('taltBubble');

  if (!bubble || !message) return;

  bubble.textContent = message.text;
  bubble.classList.add('show');

  clearTimeout(taltBubbleTimer);

  taltBubbleTimer = setTimeout(() => {
    bubble.classList.remove('show');
  }, 4200);

  if (currentTaltAudio) {
    currentTaltAudio.pause();
    currentTaltAudio.currentTime = 0;
  }

  if (message.voice) {
    currentTaltAudio = new Audio(message.voice);
    currentTaltAudio.volume = 0.9;
    currentTaltAudio.play().catch(() => {});
  }
}

function stopAllSiteAudio() {
  stopBgm();

  if (currentTaltAudio) {
    currentTaltAudio.pause();
    currentTaltAudio.currentTime = 0;
  }

  if (currentEmotionSe) {
    currentEmotionSe.pause();
    currentEmotionSe.currentTime = 0;
  }
}

/* =========================
   感情ボタンSE
========================= */

const emotionSeMap = {
  anger: 'media/se/anger.mp3',
  muka: 'media/se/muka.mp3',
  sad: 'media/se/sad.mp3',
  anxiety: 'media/se/anxiety.mp3',
  lonely: 'media/se/lonely.mp3',
  moya: 'media/se/moya.mp3',

  refresh: 'media/se/refresh.mp3',
  heal: 'media/se/heal.mp3',
  happy: 'media/se/happy.mp3',
  fuwa: 'media/se/fuwa.mp3',
  calm: 'media/se/calm.mp3',
  warm: 'media/se/warm.mp3'
};

let currentEmotionSe = null;
const emotionSeVolume = 0.4;

function playEmotionSe(type) {
  const src = emotionSeMap[type];

  if (!src) return;

  if (currentEmotionSe) {
    currentEmotionSe.pause();
    currentEmotionSe.currentTime = 0;
  }

  currentEmotionSe = new Audio(src);
  currentEmotionSe.volume = emotionSeVolume;

  currentEmotionSe.play().catch(() => {});
}