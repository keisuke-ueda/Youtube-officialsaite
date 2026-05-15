const achievements = [
  {
    id: 'first',
    icon: '🚪',
    title: 'ネット保健室の来室者',
    desc: 'はじめて心理士ケイのネット保健室に入室した'
  },
  {
    id: 'youtube',
    icon: '📺',
    title: '配信室への案内人',
    desc: 'YouTubeチャンネルへの扉を開いた'
  },
  {
    id: 'bgm',
    icon: '🎧',
    title: 'BGM共鳴者',
    desc: 'この空間の音に耳を澄ませた'
  },
  {
    id: 'comment',
    icon: '💬',
    title: 'コメントの観測者',
    desc: '漂うコメントに触れて、配信室の声を観測した'
  },
  {
    id: 'robot',
    icon: '🤖',
    title: 'タルト君のともだち',
    desc: 'タルト君と会話して、少し仲良くなった'
  },
  {
    id: 'song',
    icon: '🎤',
    title: '感情のリスナー',
    desc: '歌や声に込められた感情のエリアに触れた'
  },
  {
    id: 'night',
    icon: '🌙',
    title: '夜の相談室メンバー',
    desc: '夜の時間にこっそり来室した'
  },
  {
    id: 'level2',
    icon: '⭐',
    title: '少し慣れてきた常連さん',
    desc: 'Lv.2になり、この場所に少し馴染んできた'
  },
  {
    id: 'secret',
    icon: '🔐',
    title: '隠し扉を見つけた人',
    desc: 'ひっそり隠された秘密の演出を見つけた'
  }
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