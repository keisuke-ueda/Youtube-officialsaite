const achievements = [
  { id:'first', icon:'🎉', title:'はじめての来室', desc:'サイトにアクセスした' },
  { id:'youtube', icon:'📺', title:'チャンネル探索者', desc:'YouTubeボタンを押した' },
  { id:'bgm', icon:'🎧', title:'共鳴する耳', desc:'BGMをONにした' },
  { id:'comment', icon:'💬', title:'コメント勇者', desc:'コメント演出を押した' },
  { id:'robot', icon:'🤖', title:'タルト君と話した', desc:'タルト君と会話した' },
  { id:'song', icon:'🎤', title:'感情の歌い手', desc:'歌エリアを見た' },
  { id:'night', icon:'🌙', title:'夜更かし勢', desc:'夜に訪問した' },
  { id:'level2', icon:'⭐', title:'常連さん', desc:'Lv.2になった' },
  { id:'secret', icon:'🔐', title:'隠しミッション発見', desc:'秘密の演出を起動した' }
];

function unlock(id) {
  if (state.achievements.includes(id)) return;

  state.achievements.push(id);

  const achievement = achievements.find(item => item.id === id);

  if (achievement) {
    toast(`${achievement.icon} 実績解除：${achievement.title}`, achievement.desc);
  }

  saveState();
  renderAchievements();
}

function checkLevelAchievements() {
  if (getLevelByXP() >= 2) {
    unlock('level2');
  }
}

function renderAchievements() {
  const list = document.getElementById('achievementList');
  if (!list) return;

  list.innerHTML = achievements.map(achievement => {
    const unlocked = state.achievements.includes(achievement.id);

    return `
      <div class="achievement ${unlocked ? '' : 'locked'}">
        <b>${unlocked ? achievement.icon : '🔒'} ${unlocked ? achievement.title : '???'}</b>
        <span>${unlocked ? achievement.desc : 'まだ未解放の称号です'}</span>
      </div>
    `;
  }).join('');
}