function speakTaltMessage(message) {
  const bubble = document.getElementById('taltBubble');

  if (!bubble || !message) return;

  bubble.textContent = message.text;
  bubble.classList.add('show');

  clearTimeout(taltBubbleTimer);

  taltBubbleTimer = setTimeout(() => {
    bubble.classList.remove('show');
  }, 4200);

  if (currentTaltAudio) {
    currentTaltAudio.pause();
    currentTaltAudio.currentTime = 0;
  }

  if (message.voice) {
    currentTaltAudio = new Audio(message.voice);
    currentTaltAudio.volume = 0.9;
    currentTaltAudio.play().catch(() => {});
  }
}

function stopAllSiteAudio() {
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0;
  }

  if (currentTaltAudio) {
    currentTaltAudio.pause();
    currentTaltAudio.currentTime = 0;
  }

  bgmOn = false;

  if (bgmButton) {
    bgmButton.textContent = '🔇 BGM OFF';
  }
}