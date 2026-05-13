function bindEvents() {
  if (window.__keiEventsBound) return;
  window.__keiEventsBound = true;

  document.addEventListener('mousemove', event => {
    if (!cursorGlow) return;

    cursorGlow.style.left = event.clientX + 'px';
    cursorGlow.style.top = event.clientY + 'px';
  });

  document.querySelectorAll('.emotion-button').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();

      const type = button.dataset.emotion;
      playEmotionButtonEffect(button, type);

      const emotionScores = {
        anger: -5,
        muka: -5,
        sad: -5,
        anxiety: -4,
        lonely: -4,
        moya: -4,

        refresh: 5,
        heal: 4,
        happy: 5,
        fuwa: 4,
        calm: 4,
        warm: 4
      };

      state.currentEmotionBalance += emotionScores[type] || 0;
      state.currentEmotionBalance = Math.max(-100, Math.min(100, state.currentEmotionBalance));
      state.emotionTouchedThisSession = true;

      renderEmotionMeter();
      saveState();

      state.emotion += 4;
      state.healing += 4;

      addXP(6, '感情整理');
    });
  });

  bgmButton?.addEventListener('click', async event => {
    event.stopPropagation();

    try {
      if (!bgmOn) {
        bgm.volume = 0.28;
        await bgm.play();

        bgmOn = true;
        bgmButton.textContent = '🔊 BGM ON';
        state.resonance += 15;

        unlock('bgm');
        completeQuest('bgm');
        addXP(18, '共鳴率');
      } else {
        bgm.pause();
        bgm.currentTime = 0;
        bgmOn = false;
        bgmButton.textContent = '🔇 BGM OFF';
      }
    } catch {
      toast('⚠️ BGM再生エラー', '音源ファイルのパスを確認してください。');
    }
  });

  ['youtubeButton', 'youtubeButton2', 'youtubeLink'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', event => {
      event.stopPropagation();

      stopAllSiteAudio();

      state.trust += 20;
      unlock('youtube');
      addXP(20, '信頼度');
    });
  });

  breakButton?.addEventListener('click', event => {
    event.stopPropagation();

    playClearMindEffect();
    completeQuest('break');
    addXP(28, '心のモヤモヤ浄化');
  });

  document.querySelectorAll('[data-action="comment"]').forEach(el => {
    el.addEventListener('click', event => {
      event.stopPropagation();

      state.intimacy += 10;
      state.emotion += 8;

      unlock('comment');
      completeQuest('comment');
      addXP(15, '親密度');
      popAt(el, '💬');
    });
  });

  document.querySelectorAll('[data-action="song"]').forEach(el => {
    el.addEventListener('click', event => {
      event.stopPropagation();

      state.song += 10;
      state.emotion += 12;

      unlock('song');
      completeQuest('song');
      addXP(12, '感情値');
    });
  });

  document.querySelectorAll('.floating-word').forEach(word => {
    word.addEventListener('click', event => {
      event.stopPropagation();

      state.emotion += 5;

      completeQuest('keyword');
      addXP(8, '感情ログ');

      word.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.18)' },
        { transform: 'scale(1)' }
      ], {
        duration: 420,
        easing: 'ease'
      });

      createSpark();
    });
  });

  document.getElementById('heartButton')?.addEventListener('click', event => {
    event.stopPropagation();

    for (let i = 0; i < 12; i++) {
      createFloating('💙', 'float-heart');
    }

    state.emotion += 10;
    completeQuest('heart');
    addXP(15, '感情値');
  });

  const petRobot = document.getElementById('petRobot');

  const handleTaltTalk = event => {
    event?.stopPropagation();

    if (!petRobot) return;

    const messages = Array.isArray(window.taltMessages) && window.taltMessages.length > 0
      ? window.taltMessages
      : [{ text: '今日も来てくれてありがとう。', voice: '' }];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    petRobot.textContent = 'ありがとう';
    petRobot.classList.add('robot-happy');

    speakTaltMessage(randomMessage);

    state.healing += 20;
    state.trust += 5;

    unlock('robot');
    completeQuest('robot');
    addXP(20, '癒しポイント');

    setTimeout(() => {
      petRobot.textContent = 'タルト君と話す';
      petRobot.classList.remove('robot-happy');
    }, 2600);
  };

  petRobot?.addEventListener('click', handleTaltTalk);

  petRobot?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTaltTalk(event);
    }
  });

  document.getElementById('mainCharacter')?.addEventListener('click', event => {
    event.stopPropagation();

    const messages = [
      '今日も来てくれてありがとう',
      '無理しなくて大丈夫',
      '少し休んでいこう',
      'コメントはゆっくりでOK'
    ];

    toast('💙 心理士ケイ', messages[Math.floor(Math.random() * messages.length)]);
    addXP(10, '会話ポイント');
  });

  document.getElementById('rainButton')?.addEventListener('click', event => {
    event.stopPropagation();

    const emotions = ['✨','💙','🌙','🎧','☁️','🫧'];

    for (let i = 0; i < 46; i++) {
      createRain(emotions[Math.floor(Math.random() * emotions.length)]);
    }

    state.emotion += 18;
    addXP(18, '感情値');
  });

  document.getElementById('glitchButton')?.addEventListener('click', event => {
    event.stopPropagation();

    document.body.classList.add('glitch-mode');

    setTimeout(() => {
      document.body.classList.remove('glitch-mode');
    }, 900);

    unlock('secret');
    addXP(22, '隠しポイント');
  });

  document.getElementById('sparkButton')?.addEventListener('click', event => {
    event.stopPropagation();

    for (let i = 0; i < 55; i++) {
      createSpark();
    }

    addXP(25, '癒しポイント');
  });

  document.getElementById('levelCard')?.addEventListener('click', event => {
    event.stopPropagation();

    secretClicks++;

    if (secretClicks >= 5) {
      document.body.classList.toggle('secret-mode');
      state.hiddenMissionFound = true;

      unlock('secret');
      completeQuest('hidden');

      toast('🔐 隠しミッション発見', '感情の奥に隠れていたログを見つけました。');

      secretClicks = 0;
    }
  });

  document
    .querySelectorAll('.card, .theme-card:not(.theme-card-static), .timeline-row, .status-card')
    .forEach(el => {
      el.addEventListener('click', event => {
        event.stopPropagation();

        if (el.dataset.action) return;

        addXP(4, '探索ポイント');
      });
    });

  window.addEventListener('scroll', () => {
    const character = document.querySelector('.character');

    if (character && window.innerWidth > 950) {
      character.style.marginBottom = `${Math.min(window.scrollY * 0.045, 42)}px`;
    }

    if (window.scrollY > 12) {
      document.body.classList.add('is-scrolled');
    } else {
      document.body.classList.remove('is-scrolled');
    }
  }, { passive: true });

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', stopAllSiteAudio);
    link.addEventListener('touchstart', stopAllSiteAudio, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stopAllSiteAudio();
    }
  });

  window.addEventListener('pagehide', () => {
    saveEmotionSessionLog();
    stopAllSiteAudio();
  });

  window.addEventListener('beforeunload', () => {
    saveEmotionSessionLog();
    stopAllSiteAudio();
  });
}

document.querySelectorAll('.emotion-button').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();

    const type = button.dataset.emotion;

    const messages = {
      anger: ['イライラを外に出した。', '今は押して逃がしてOK。', 'ぶつける代わりに、ここに置いた。'],
      sad: ['悲しさを少し流した。', '泣きたい気持ちがあっても大丈夫。', '今はここで休んでいい。'],
      anxiety: ['不安を少しほどいた。', '今すぐ全部解決しなくていい。', '息をゆっくり吐いてみよう。'],
      lonely: ['ひとりじゃないよ。', 'ここに来てくれてありがとう。', '今だけ一緒にいよう。'],
      tired: ['少し休もう。', '頑張りすぎていたかも。', '今日は止まっても大丈夫。'],
      safe: ['10秒だけ先送りしよう。', '手を止めて、ここを連打していい。', '今は傷つけない選択を一緒に作ろう。']
    };

    const icons = {
      anger: ['💢','🧊','💨'],
      sad: ['☔','💧','🫧'],
      anxiety: ['🫧','☁️','🌿'],
      lonely: ['💙','🤝','🌙'],
      tired: ['🌿','🍵','☁️'],
      safe: ['🛟','💙','✨']
    };

    const textList = messages[type] || ['少し気持ちを逃がした。'];
    const iconList = icons[type] || ['✨'];

    const pop = document.createElement('div');
    pop.className = 'emotion-pop';
    pop.textContent = textList[Math.floor(Math.random() * textList.length)];
    document.body.appendChild(pop);

    for (let i = 0; i < 22; i++) {
      createFloating(iconList[Math.floor(Math.random() * iconList.length)], 'float-heart');
    }

    state.emotion += 6;
    state.healing += 6;
    addXP(10, '感情整理');

    setTimeout(() => {
      pop.remove();
    }, 1300);
  });
});


const hamburgerButton = document.getElementById('hamburgerButton');
const nav = document.querySelector('.nav');

hamburgerButton?.addEventListener('click', event => {
  event.stopPropagation();

  hamburgerButton.classList.toggle('is-open');
  nav?.classList.toggle('is-open');
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerButton?.classList.remove('is-open');
    nav?.classList.remove('is-open');
  });
});

document.addEventListener('click', event => {
  if (
    nav?.classList.contains('is-open') &&
    !nav.contains(event.target) &&
    !hamburgerButton?.contains(event.target)
  ) {
    hamburgerButton?.classList.remove('is-open');
    nav.classList.remove('is-open');
  }
});