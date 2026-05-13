function getTotalPower() {
  return (
    state.xp +
    Math.floor(state.trust * 0.7) +
    Math.floor(state.emotion * 0.6) +
    Math.floor(state.resonance * 0.5)
  );
}

function getLevelByXP() {
  return Math.floor(Math.sqrt(getTotalPower() / 80)) + 1;
}

function addXP(amount, label = '癒しポイント') {
  state.xp += amount;
  state.healing += Math.max(1, Math.floor(amount / 2));
  state.clicks += 1;

  toast(`+${amount} ${label}`, '少しずつ記憶が増えています。');

  checkLevelAchievements();

  dailyQuests = buildDailyQuests();

  saveState();
  render();
  renderQuests();
}

function pulseHud(id) {
  const el = document.getElementById(id)?.closest('.game-card');
  if (!el) return;

  el.classList.remove('is-updated');
  void el.offsetWidth;
  el.classList.add('is-updated');

  setTimeout(() => {
    el.classList.remove('is-updated');
  }, 460);
}

function render() {
  const level = getLevelByXP();

  const rankTable = [
    { level: 0,  name: 'はじめての来室者' },
    { level: 1,  name: 'アクセス者' },
    { level: 5,  name: '感情観測者' },
    { level: 10, name: '相談室ログイン勢' },
    { level: 20, name: '心の探索者' },
    { level: 30, name: '配信室常連' },
    { level: 40, name: '感情共有メンバー' },
    { level: 50, name: '心理空間案内人' },
    { level: 60, name: 'ネット保健室住人' },
    { level: 70, name: '感情ログ収集者' },
    { level: 80, name: 'タルト君のお気に入り' },
    { level: 90, name: '心理士ケイの相棒' },
    { level: 99, name: 'この場所を知る者' }
  ];

  const currentRank = rankTable.filter(rank => level >= rank.level).at(-1);
  const name = currentRank.name;

  if (levelText) {
    levelText.textContent = `Lv.${level} ${name}`;
  }

  if (xpFill) {
    const currentLevelBase = Math.pow(level - 1, 2) * 80;
    const nextLevelBase = Math.pow(level, 2) * 80;
    const progress = ((getTotalPower() - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100;

    xpFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  }

  if (lastLevel !== null && level > lastLevel) {
    toast('✨ LvUP', `新しい称号「${name}」を獲得しました`);
    showLevelUpEffect(name);
    playLevelUpSe();
  }

  lastLevel = level;

  const trustText = document.getElementById('trustText');
  const resonanceText = document.getElementById('resonanceText');
  const emotionText = document.getElementById('emotionText');

  if (trustText) trustText.textContent = state.trust;
  if (resonanceText) resonanceText.textContent = state.resonance + '%';
  if (emotionText) emotionText.textContent = state.emotion;

  if (lastRenderedStats.trust !== null && lastRenderedStats.trust !== state.trust) pulseHud('trustText');
  if (lastRenderedStats.resonance !== null && lastRenderedStats.resonance !== state.resonance) pulseHud('resonanceText');
  if (lastRenderedStats.emotion !== null && lastRenderedStats.emotion !== state.emotion) pulseHud('emotionText');
  if (lastRenderedStats.xp !== null && lastRenderedStats.xp !== state.xp) pulseHud('levelText');

  lastRenderedStats.trust = state.trust;
  lastRenderedStats.resonance = state.resonance;
  lastRenderedStats.emotion = state.emotion;
  lastRenderedStats.xp = state.xp;
}

function renderEmotionMeter() {
  const pointer = document.getElementById('emotionPointer');
  const comment = document.getElementById('emotionMeterComment');
  const lastLog = document.getElementById('lastEmotionLog');

  if (!pointer || !comment || !lastLog) return;

  const value = Math.max(-100, Math.min(100, state.currentEmotionBalance || 0));
  const position = 50 + value / 2;

  pointer.style.left = `${position}%`;

  if (value >= 30) {
    comment.textContent = 'ポジティブ寄りです';
  } else if (value >= 8) {
    comment.textContent = '少しポジティブ寄りです';
  } else if (value <= -30) {
    comment.textContent = 'ネガティブ寄りです';
  } else if (value <= -8) {
    comment.textContent = '少しネガティブ寄りです';
  } else {
    comment.textContent = '今の気持ちをタップしてみよう';
  }

  lastLog.textContent = state.lastEmotionComment
    ? `前回の気分ログ：${state.lastEmotionComment}`
    : '前回の気分ログ：前回は真ん中あたりでした。';
}