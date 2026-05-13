const emotionThemes = [
  '今日は、無理しない日。',
  '今日は、気持ちを言葉にする日。',
  '今日は、人間関係を少し整理する日。',
  '今日は、自分を責めすぎない日。',
  '今日は、深呼吸を思い出す日。',
  '今日は、少しだけ前を向く日。',
  '今日は、現実から少し離れて休む日。'
];

const questPool = [
  { id:'q_comment', title:'コメント演出に触れる', desc:'親密度 +10', action:'comment', minLevel:1 },
  { id:'q_bgm', title:'BGMをONにする', desc:'共鳴率 +15', action:'bgm', minLevel:1 },
  { id:'q_robot', title:'タルト君と話す', desc:'癒しポイント +20', action:'robot', minLevel:1 },
  { id:'q_break', title:'心のモヤモヤを崩す', desc:'浄化ポイント +28', action:'break', minLevel:3 },
  { id:'q_heart', title:'ハートを送る', desc:'感情値 +15', action:'heart', minLevel:5 },
  { id:'q_keyword', title:'気になる感情ログに触れる', desc:'感情ログ +8', action:'keyword', minLevel:8 },
  { id:'q_song', title:'歌のエリアに触れる', desc:'感情値 +12', action:'song', minLevel:10 }
];

const weekdayQuests = [
  { id:'w_sun', day:0, title:'日曜の休憩ログ', desc:'癒しポイント +20', action:'heart' },
  { id:'w_mon', day:1, title:'月曜の気持ち整理', desc:'感情値 +15', action:'keyword' },
  { id:'w_tue', day:2, title:'火曜の相談室チェック', desc:'信頼度 +10', action:'comment' },
  { id:'w_wed', day:3, title:'水曜の深呼吸', desc:'共鳴率 +10', action:'bgm' },
  { id:'w_thu', day:4, title:'木曜のタルトと会話', desc:'癒しポイント +20', action:'robot' },
  { id:'w_fri', day:5, title:'金曜のモヤモヤ浄化', desc:'浄化ポイント +28', action:'break' },
  { id:'w_sat', day:6, title:'土曜の感情探索', desc:'感情ログ +8', action:'keyword' }
];

let dailyQuests = [];

function initDaily() {
  const today = todayKey();

  state.visitCount += 1;
  state.totalVisitBonus += 5;
  state.xp += 5;

  if (state.lastVisit !== today) {
    state.lastVisit = today;
    state.dailyDone = [];
    state.hiddenMissionFound = false;
    state.emotionTheme = emotionThemes[new Date().getDay()];

    state.xp += 15;
    state.totalVisitBonus += 15;

    toast('🌅 今日も来てくれてありがとう', 'ログインボーナス +15');
  } else {
    toast('💙 おかえりなさい', 'アクセスボーナス +5');
  }

  dailyQuests = buildDailyQuests();
  saveState();
}

function buildDailyQuests() {
  const level = getLevelByXP();
  const today = new Date();
  const day = today.getDay();

  const available = questPool.filter(quest => level >= quest.minLevel);

  const seed = Number(`${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`);

  const shuffled = [...available].sort((a, b) => {
    const aScore = Math.sin(seed + a.id.length) * 10000;
    const bScore = Math.sin(seed + b.id.length) * 10000;
    return aScore - bScore;
  });

  const hiddenQuest = {
    id: 'q_hidden',
    title: '隠しミッション',
    desc: state.hiddenMissionFound
      ? '隠しミッション発見済み'
      : '条件を満たすと正体がわかります。',
    action: 'hidden',
    hidden: true
  };

  return [
    ...shuffled.slice(0, 2),
    weekdayQuests.find(quest => quest.day === day),
    hiddenQuest
  ].filter(Boolean);
}

function completeQuest(action) {
  if (!Array.isArray(dailyQuests) || dailyQuests.length === 0) {
    dailyQuests = buildDailyQuests();
  }

  let completed = false;

  dailyQuests.forEach(quest => {
    if (
      quest.action === action &&
      !state.dailyDone.includes(quest.id) &&
      (!quest.hidden || state.hiddenMissionFound)
    ) {
      state.dailyDone.push(quest.id);
      completed = true;
      toast('✅ ミッション達成', quest.title);
    }
  });

  if (completed) {
    saveState();
    renderQuests();
  }
}

function renderQuests() {
  const list = document.getElementById('questList');
  if (!list) return;

  list.innerHTML = dailyQuests.map(quest => {
    const done = state.dailyDone.includes(quest.id);
    const hiddenLocked = quest.hidden && !state.hiddenMissionFound;

    return `
      <div class="quest ${hiddenLocked ? 'hidden-quest' : ''}">
        <b>${done ? '✅' : '⬜'} ${hiddenLocked ? '隠しミッション' : quest.title}</b>
        <span>${hiddenLocked ? '条件を満たすと正体がわかります。' : quest.desc}</span>
      </div>
    `;
  }).join('');

  const current = dailyQuests.find(quest => !state.dailyDone.includes(quest.id));
  const missionText = document.getElementById('missionText');

  if (missionText) {
    missionText.textContent = current
      ? (current.hidden && !state.hiddenMissionFound ? '隠しミッション' : current.title)
      : '今日のミッション完了！';
  }

  const themeTarget = document.getElementById('emotionThemeText');
  if (themeTarget) {
    themeTarget.textContent = state.emotionTheme || '今日は、少し心を休める日。';
  }
}