function toast(title, desc = '') {
  if (!toastArea) return;

  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${title}${desc ? `<small>${desc}</small>` : ''}`;
  toastArea.appendChild(el);

  const duration = window.innerWidth <= 560 ? 1100 : 2600;

  setTimeout(() => {
    el.classList.add('toast-hide');
    setTimeout(() => el.remove(), 220);
  }, duration);
}

function createFloating(symbol, className = 'float-heart') {
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = symbol;
  el.style.left = Math.random() * window.innerWidth + 'px';
  el.style.top = window.innerHeight - 100 + 'px';

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

function createRain(symbol) {
  const el = document.createElement('div');
  el.className = 'rain-item';
  el.innerHTML = symbol;
  el.style.left = Math.random() * window.innerWidth + 'px';
  el.style.animationDuration = (2 + Math.random() * 3) + 's';

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

function createSpark() {
  const spark = document.createElement('div');
  spark.className = 'spark';
  spark.style.left = Math.random() * window.innerWidth + 'px';
  spark.style.top = Math.random() * window.innerHeight + 'px';

  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 900);
}

function createShards() {
  for (let i = 0; i < 28; i++) {
    const shard = document.createElement('span');
    const angle = i * 1.55;
    const distance = 90 + i * 9;

    shard.className = 'shard';
    shard.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    shard.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    shard.style.setProperty('--r', `${(i * 37) % 240}deg`);
    shard.style.animationDelay = `${i * 0.016}s`;

    document.body.appendChild(shard);
    setTimeout(() => shard.remove(), 1500);
  }
}

function playClearMindEffect() {
  if (!breakArea) return;

  document.body.classList.add('clear-mode');
  breakArea.classList.add('is-breaking');

  const burst = document.createElement('div');
  burst.className = 'clear-burst';
  document.body.appendChild(burst);

  const ring = document.createElement('div');
  ring.className = 'clear-ring';
  ring.style.left = (20 + Math.random() * 60) + '%';
  ring.style.top = (18 + Math.random() * 56) + '%';
  document.body.appendChild(ring);

  const messages = [
    'モヤモヤ、すっきり。',
    '少し軽くなったかも。',
    '深呼吸してみよう。',
    '大丈夫、ゆっくりでいい。',
    '今日はちゃんと頑張ってる。',
    '心を少し整理した。'
  ];

  const message = document.createElement('div');
  message.className = 'clear-message';
  message.textContent = messages[Math.floor(Math.random() * messages.length)];
  message.style.left = (28 + Math.random() * 44) + '%';
  message.style.top = (32 + Math.random() * 24) + '%';
  document.body.appendChild(message);

  const symbols = ['✨', '🫧', '💙', '🌿', '☁️'];

  for (let i = 0; i < 42; i++) {
    const particle = document.createElement('div');
    particle.className = 'clear-particle';
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 260;

    particle.style.left = (20 + Math.random() * 60) + '%';
    particle.style.top = (18 + Math.random() * 56) + '%';
    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--r', `${Math.random() * 360}deg`);
    particle.style.animationDelay = `${Math.random() * .18}s`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1600);
  }

  createShards();

  setTimeout(() => {
    document.body.classList.remove('clear-mode');
    breakArea.classList.remove('is-breaking');
    burst.remove();
    ring.remove();
    message.remove();
  }, 1500);
}

/**
 * 称号レベルアップ演出
 * 同じ称号では二度とポップアップを出さない
 */
function showLevelUpEffect(name) {
  if (!name) return;

  const savedTitle = localStorage.getItem('currentTitle');

  // すでに同じ称号を獲得済みなら何もしない
  if (savedTitle === name) return;

  // 先に保存して、連続呼び出しでも重複表示されないようにする
  localStorage.setItem('currentTitle', name);

  const el = document.createElement('div');
  el.className = 'levelup-effect';
  el.innerHTML = `
    <strong>✨ LvUP</strong>
    <span>新しい称号「${name}」を獲得しました</span>
  `;

  document.body.appendChild(el);

  for (let i = 0; i < 26; i++) createSpark();

  setTimeout(() => el.remove(), 1800);
}

/**
 * レベルと称号をまとめて管理したい場合用
 * 使う場合は showLevelUpEffect(title) の代わりに checkLevelUp(level, title) を呼ぶ
 */
function checkLevelUp(level, title) {
  if (!title) return;

  const lastNotifiedLevel = Number(localStorage.getItem('lastNotifiedLevel') || 0);
  const savedTitle = localStorage.getItem('currentTitle');

  if (level > lastNotifiedLevel || savedTitle !== title) {
    localStorage.setItem('lastNotifiedLevel', String(level));
    showLevelUpEffect(title);
  }
}

function popAt(target, symbol) {
  const rect = target.getBoundingClientRect();
  const el = document.createElement('div');

  el.className = 'float-heart';
  el.innerHTML = symbol;
  el.style.left = rect.left + rect.width / 2 + 'px';
  el.style.top = rect.top + rect.height / 2 + 'px';

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

function playEmotionButtonEffect(button, type) {
  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const settings = {
    anger: {
      word: 'イライラ',
      icons: ['💢', '🔥', '💨'],
      count: 18,
      spread: 220,
      mode: 'burst'
    },
    muka: {
      word: 'むかむか',
      icons: ['😖', '🌀', '💨'],
      count: 18,
      spread: 170,
      mode: 'shake'
    },
    refresh: {
      word: 'スカッ',
      icons: ['💥', '✨', '⚡'],
      count: 24,
      spread: 300,
      mode: 'burst'
    },
    heal: {
      word: 'ほっ',
      icons: ['💙', '🌿', '🫧'],
      count: 18,
      spread: 160,
      mode: 'float'
    },
    happy: {
      word: 'しあわせ',
      icons: ['🌈', '✨', '💛'],
      count: 24,
      spread: 240,
      mode: 'rainbow'
    },
    fuwa: {
      word: 'ふわふわ',
      icons: ['🫧', '☁️', '🤍'],
      count: 22,
      spread: 180,
      mode: 'float'
    },
    sad: {
      word: 'ぽろぽろ',
      icons: ['☔', '💧', '🫧'],
      count: 22,
      spread: 140,
      mode: 'fall'
    },
    anxiety: {
      word: 'すーっ',
      icons: ['☁️', '🫧', '🌿'],
      count: 20,
      spread: 190,
      mode: 'fade'
    },
    lonely: {
      word: 'ここにいる',
      icons: ['💙', '🌙', '🤝'],
      count: 18,
      spread: 150,
      mode: 'hug'
    },
    tired: {
      word: '休もう',
      icons: ['🌿', '🍵', '☁️'],
      count: 18,
      spread: 150,
      mode: 'float'
    },
    moya: {
      word: 'もやもや',
      icons: ['🌀', '☁️', '🫧'],
      count: 22,
      spread: 200,
      mode: 'swirl'
    },
    safe: {
      word: '今だけ',
      icons: ['🛟', '💙', '✨'],
      count: 24,
      spread: 170,
      mode: 'hug'
    }
  };

  const setting = settings[type] || settings.heal;

  const word = document.createElement('div');
  word.className = 'emotion-word-pop';
  word.textContent = setting.word;
  word.style.left = `${cx}px`;
  word.style.top = `${cy}px`;
  document.body.appendChild(word);

  button.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(.94)' },
    { transform: 'scale(1.04)' },
    { transform: 'scale(1)' }
  ], {
    duration: 360,
    easing: 'ease'
  });

  for (let i = 0; i < setting.count; i++) {
    const p = document.createElement('div');
    p.className = 'emotion-particle';
    p.textContent = setting.icons[Math.floor(Math.random() * setting.icons.length)];

    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;

    let angle = Math.random() * Math.PI * 2;
    let distance = Math.random() * setting.spread + 40;

    if (setting.mode === 'fall') {
      p.style.setProperty('--x', `${(Math.random() - .5) * 100}px`);
      p.style.setProperty('--y', `${120 + Math.random() * 220}px`);
    } else if (setting.mode === 'float') {
      p.style.setProperty('--x', `${(Math.random() - .5) * 160}px`);
      p.style.setProperty('--y', `${-80 - Math.random() * 180}px`);
    } else if (setting.mode === 'hug') {
      p.style.setProperty('--x', `${Math.cos(angle) * 80}px`);
      p.style.setProperty('--y', `${Math.sin(angle) * 80}px`);
    } else if (setting.mode === 'swirl') {
      angle = i * .7;
      distance = 60 + i * 6;
      p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    } else if (setting.mode === 'fade') {
      p.style.setProperty('--x', `${(Math.random() - .5) * 220}px`);
      p.style.setProperty('--y', `${(Math.random() - .5) * 100 - 80}px`);
    } else {
      p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    }

    p.style.setProperty('--r', `${Math.random() * 360}deg`);
    p.style.animationDelay = `${Math.random() * .12}s`;

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1400);
  }

  setTimeout(() => {
    word.remove();
  }, 1050);
}

function playSecretMissionEffect() {
  document.body.classList.add('secret-celebration');

  const message = document.createElement('div');
  message.className = 'secret-flash-message';
  message.textContent = '🔓 隠しミッション発見';
  document.body.appendChild(message);

  const icons = ['✦', '✨', '💙', '🌟', '🫧'];

  for (let i = 0; i < 70; i++) {
    const p = document.createElement('div');
    p.className = 'secret-particle';
    p.textContent = icons[Math.floor(Math.random() * icons.length)];

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 360;

    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    p.style.setProperty('--r', `${Math.random() * 360}deg`);
    p.style.animationDelay = `${Math.random() * .5}s`;

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 3000);
  }

  setTimeout(() => {
    document.body.classList.remove('secret-celebration');
    message.remove();
  }, 5000);
}

function playSecretTaltMessage() {
  const specialMessages = [
    {
      text: '見つけてくれたんだね。いっぱい遊んでくれてありがとう。',
      voice: 'media/voice/talt_secret_001.wav'
    },
    {
      text: 'ここまで触ってくれてありがとう。大好きだよ。',
      voice: 'media/voice/talt_secret_002.wav'
    },
    {
      text: 'この場所の秘密、少しだけ開いたよ。',
      voice: 'media/voice/talt_secret_003.wav'
    }
  ];

  const randomMessage =
    specialMessages[Math.floor(Math.random() * specialMessages.length)];

  speakTaltMessage(randomMessage);
}