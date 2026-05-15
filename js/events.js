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


  const breakSe = new Audio('./media/se/break.mp3');

  breakSe.volume = 0.6;
  breakSe.preload = 'auto';
      
  breakButton?.addEventListener('click', event => {
    event.stopPropagation();

    /* SE */
    breakSe.currentTime = 0;
    breakSe.play().catch(() => {});

    /* 演出 */
    playClearMindEffect();

    /* 少し画面揺らし */
    document.body.animate(
      [
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0px)' }
      ],
      {
        duration: 180,
        easing: 'ease'
      }
    );

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

  const heartSe = new Audio('./media/se/heart.mp3');

  heartSe.volume = 0.6;
  heartSe.preload = 'auto';

  document.getElementById('heartButton')?.addEventListener('click', event => {
    event.stopPropagation();

    /* SE */
    heartSe.currentTime = 0;
    heartSe.play().catch(() => {});

    /* ハート演出 */
    for (let i = 0; i < 12; i++) {
      createFloating('💙', 'float-heart');
    }

    /* ボタンぷに */
    event.currentTarget.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.18)' },
        { transform: 'scale(.94)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 320,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    );

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
      event.preventDefault();
      event.stopPropagation();

      const isOpen = hamburgerButton.classList.toggle('is-open');
      nav?.classList.toggle('is-open', isOpen);

      hamburgerButton.setAttribute(
        'aria-label',
        isOpen ? 'メニューを閉じる' : 'メニューを開く'
      );
    });

    nav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerButton?.classList.remove('is-open');
        nav?.classList.remove('is-open');
        hamburgerButton?.setAttribute('aria-label', 'メニューを開く');
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
    const shouldStopAudio = () => {
      const href = link.getAttribute('href') || '';

      if (href.startsWith('#')) return false;
      if (href.startsWith('javascript:')) return false;

      return (
        link.target === '_blank' ||
        href.startsWith('http') ||
        href.includes('.html') ||
        href.startsWith('pages/')
      );
    };

    link.addEventListener('click', () => {
      if (shouldStopAudio()) {
        stopAllSiteAudio();
      }
    });
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


// Xのpost
  const SITE_URL = 'https://ここにURL';

  document.getElementById('xPostEmotionButton')?.addEventListener('click', async event => {

    event.stopPropagation();

    const value =
      state.currentEmotionBalance || 0;

    const comment =
      document.getElementById('emotionMeterComment')
        ?.textContent || '';

    /* =========================
      キャンバス生成
    ========================= */

    const canvas =
      document.getElementById('emotionShareCanvas');

    const ctx =
      canvas.getContext('2d');

    /* 背景 */

    const grad =
      ctx.createLinearGradient(0, 0, 1200, 630);

    grad.addColorStop(0, '#dff7ff');
    grad.addColorStop(1, '#eef2ff');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    /* タイトル */

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 64px sans-serif';

    ctx.fillText(
      '今の気分メーター',
      80,
      120
    );

    /* 数値 */

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 120px sans-serif';

    ctx.fillText(
      String(value),
      80,
      280
    );

    /* コメント */

    ctx.fillStyle = '#334155';
    ctx.font = '48px sans-serif';

    ctx.fillText(
      comment,
      80,
      380
    );

    /* メーター */

    const meterX = 80;
    const meterY = 500;
    const meterWidth = 1040;

    const meterGrad =
      ctx.createLinearGradient(
        meterX,
        0,
        meterX + meterWidth,
        0
      );

    meterGrad.addColorStop(0, '#60a5fa');
    meterGrad.addColorStop(.5, '#ffffff');
    meterGrad.addColorStop(1, '#facc15');

    ctx.strokeStyle = meterGrad;
    ctx.lineWidth = 20;

    ctx.beginPath();

    ctx.moveTo(meterX, meterY);
    ctx.lineTo(meterX + meterWidth, meterY);

    ctx.stroke();

    /* ポインター */

    const normalized =
      Math.max(-100, Math.min(100, value));

    const pointerX =
      meterX + (
        (normalized + 100) / 200
      ) * meterWidth;

    ctx.fillStyle = '#2563eb';

    ctx.beginPath();

    ctx.arc(
      pointerX,
      meterY,
      24,
      0,
      Math.PI * 2
    );

    ctx.fill();

    /* サイトURL */

    ctx.fillStyle = '#64748b';
    ctx.font = '32px sans-serif';

    ctx.fillText(
      SITE_URL,
      80,
      590
    );

    /* DL */

    const link =
      document.createElement('a');

    link.download =
      'emotion-meter.png';

    link.href =
      canvas.toDataURL('image/png');

    link.click();

    /* X投稿 */

    const text = [
      `今の気分メーター：${value}`,
      comment,
      '',
      SITE_URL,
      '',
      '#心理士ケイ #感情整理 #メンタルケア'
    ].join('\n');

    const url =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(text);

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

  });

}

