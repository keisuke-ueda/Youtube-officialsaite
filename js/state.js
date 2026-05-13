const STORAGE_KEY = 'kei_fan_site_game_v1';

const initialState = {
  xp: 0,
  trust: 0,
  resonance: 0,
  healing: 0,
  intimacy: 0,
  night: 0,
  emotion: 0,
  song: 0,
  clicks: 0,
  achievements: [],
  lastVisit: '',
  dailyDone: [],
  visitCount: 0,
  totalVisitBonus: 0,
  emotionTheme: '',
  hiddenMissionFound: false,
  emotionBalance: 0,
  lastEmotionBalance: null,
  lastEmotionComment: '',
  currentEmotionBalance: 0,
  lastEmotionBalance: null,
  lastEmotionComment: '',
  currentEmotionBalance: 0,
  emotionTouchedThisSession: false,
  lastEmotionBalance: null,
  lastEmotionComment: ''

};

let state = loadState();

function loadState() {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    };
  } catch {
    return { ...initialState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}