function init() {
  prepareEmotionSession();

  initDaily();
  unlock('first');
  initNightBonus();

  bindEvents();
  initRevealAnimation();
  initStayBonus();

  render();
  renderAchievements();
  renderQuests();
  renderEmotionMeter();
  initBgmPlayer();

  saveState();
}

function initRevealAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      if (entry.target.id === 'contents') {
        state.emotion += 5;
        saveState();
        render();
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

function initStayBonus() {
  setInterval(() => {
    state.healing += 1;

    if (state.healing % 30 === 0) {
      addXP(5, '滞在ボーナス');
    }

    saveState();
  }, 10000);
}

function initNightBonus() {
  const hour = new Date().getHours();

  if (hour >= 22 || hour <= 4) {
    state.night += 1;
    unlock('night');
  }
}

function prepareEmotionSession() {
  const previousValue = Number(state.currentEmotionBalance || 0);

  if (state.emotionTouchedThisSession) {
    state.lastEmotionBalance = previousValue;
    state.lastEmotionComment = getEmotionCommentByValue(previousValue);
  }

  if (!state.lastEmotionComment) {
    state.lastEmotionComment = '前回は真ん中あたりでした。';
  }

  state.currentEmotionBalance = 0;
  state.emotionTouchedThisSession = false;

  saveState();
}

function getEmotionCommentByValue(value) {
  if (value >= 30) return '前回はポジティブ寄りでした。';
  if (value >= 8) return '前回は少しポジティブ寄りでした。';
  if (value <= -30) return '前回はネガティブ寄りでした。';
  if (value <= -8) return '前回は少しネガティブ寄りでした。';
  return '前回は真ん中あたりでした。';
}

function saveEmotionSessionLog() {
  if (!state.emotionTouchedThisSession) return;

  const value = Number(state.currentEmotionBalance || 0);

  state.lastEmotionBalance = value;
  state.lastEmotionComment = getEmotionCommentByValue(value);

  saveState();
}

init();

