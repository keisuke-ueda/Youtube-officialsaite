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
      playEmotionSe(type);

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

    if (!bgmOn) {
      await playBgm();
    } else {
      stopBgm();
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

    const messages =
      Array.isArray(window.taltMessages) && window.taltMessages.length > 0
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

    
  const levelCard = document.getElementById('levelCard');

  levelCard?.addEventListener('click', event => {
    event.stopPropagation();

    if (window.__secretMissionRunning) return;

    secretClicks++;

    if (secretClicks < 5) {
      toast('🔍 秘密探索', `あと ${5 - secretClicks} 回で何か起きるかも`);
      return;
    }

    window.__secretMissionRunning = true;
    secretClicks = 0;

    document.body.classList.add('secret-mode');

    playSecretMissionEffect();
    playSecretMissionSe();
    playSecretTaltMessage();

    unlock('secret');

    if (!state.hiddenMissionFound) {
      state.hiddenMissionFound = true;
      completeQuest('hidden');
      addXP(30, '隠しポイント');
      toast('🔐 隠しミッション発見', '秘密の演出が開きました。');
    } else {
      addXP(8, '秘密ポイント');
      toast('✨ 秘密の演出', 'また見つけてくれたね。');
    }

    saveState();

    setTimeout(() => {
      document.body.classList.remove('secret-mode');
      window.__secretMissionRunning = false;
    }, 5200);
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

  window.addEventListener('scroll', () => {
    const character = document.querySelector('.character');

    if (character && window.innerWidth > 950) {
      character.style.marginBottom = `${Math.min(window.scrollY * 0.045, 42)}px`;
    }

    document.body.classList.toggle('is-scrolled', window.scrollY > 12);
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