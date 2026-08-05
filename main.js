/* ==========================================================================
   GRACE 21ST BIRTHDAY CELESTIAL GALA - APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. BACKGROUND CANVASES (STARDUST & CONFETTI)
  // --------------------------------------------------------------------------
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');

  let width = bgCanvas.width = confettiCanvas.width = window.innerWidth;
  let height = bgCanvas.height = confettiCanvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = bgCanvas.width = confettiCanvas.width = window.innerWidth;
    height = bgCanvas.height = confettiCanvas.height = window.innerHeight;
    initStars();
  });

  // Starfield Particles
  let stars = [];
  function initStars() {
    stars = [];
    const numStars = Math.floor((width * height) / 4000);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.3 ? '#F7D070' : (Math.random() > 0.5 ? '#E8A5C8' : '#56E1FF')
      });
    }
  }
  initStars();

  function renderBackground() {
    bgCtx.clearRect(0, 0, width, height);
    
    // Ambient Glow
    const gradient = bgCtx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
    gradient.addColorStop(0, 'rgba(21, 10, 42, 0.9)');
    gradient.addColorStop(1, 'rgba(8, 2, 18, 0.98)');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, width, height);

    // Render Stars
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

      bgCtx.save();
      bgCtx.globalAlpha = Math.abs(s.alpha);
      bgCtx.fillStyle = s.color;
      bgCtx.shadowBlur = 8;
      bgCtx.shadowColor = s.color;
      bgCtx.beginPath();
      bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      bgCtx.fill();
      bgCtx.restore();
    });

    requestAnimationFrame(renderBackground);
  }
  renderBackground();

  // Confetti Physics Engine
  let confettiParticles = [];
  function triggerConfettiBurst(originX = width / 2, originY = height / 3, count = 120) {
    const colors = ['#F7D070', '#E8A5C8', '#56E1FF', '#FF5DA2', '#FFFFFF', '#FFD700'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 1
      });
    }
  }

  function renderConfetti() {
    confettiCtx.clearRect(0, 0, width, height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // Gravity
      p.vx *= 0.98;
      p.rotation += p.rSpeed;
      p.opacity -= 0.008;

      if (p.opacity <= 0) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = p.opacity;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    }
    requestAnimationFrame(renderConfetti);
  }
  renderConfetti();

  // --------------------------------------------------------------------------
  // 2. WEB AUDIO API SYNTHESIZER & SPECTRUM VISUALIZER (GRACE'S ANTHEM)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;
  let analyser = null;

  const btnPlaySong = document.getElementById('btn-play-song');
  const playIcon = document.getElementById('play-icon');
  const songStatusText = document.getElementById('song-status-text');
  const volumeSlider = document.getElementById('volume-slider');

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Melodic Frequencies (Happy Birthday & Upbeat 21st Fanfare)
  const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, C6: 1046.50
  };

  const melody = [
    { note: 'G4', duration: 0.3 }, { note: 'G4', duration: 0.3 }, { note: 'A4', duration: 0.6 }, { note: 'G4', duration: 0.6 }, { note: 'C5', duration: 0.6 }, { note: 'B4', duration: 1.2 },
    { note: 'G4', duration: 0.3 }, { note: 'G4', duration: 0.3 }, { note: 'A4', duration: 0.6 }, { note: 'G4', duration: 0.6 }, { note: 'D5', duration: 0.6 }, { note: 'C5', duration: 1.2 },
    { note: 'G4', duration: 0.3 }, { note: 'G4', duration: 0.3 }, { note: 'G5', duration: 0.6 }, { note: 'E5', duration: 0.6 }, { note: 'C5', duration: 0.6 }, { note: 'B4', duration: 0.6 }, { note: 'A4', duration: 1.2 },
    { note: 'F5', duration: 0.3 }, { note: 'F5', duration: 0.3 }, { note: 'E5', duration: 0.6 }, { note: 'C5', duration: 0.6 }, { note: 'D5', duration: 0.6 }, { note: 'C5', duration: 1.6 }
  ];

  let currentNoteIdx = 0;

  function playSynthNote(freq, duration) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);

    const vol = parseFloat(volumeSlider.value);
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(vol * 0.4, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration - 0.05);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(analyser);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function triggerVocalSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Happy 21st Birthday Grace! Wishing you pure magic!");
      utterance.pitch = 1.3;
      utterance.rate = 0.95;
      utterance.volume = parseFloat(volumeSlider.value);
      window.speechSynthesis.speak(utterance);
    }
  }

  function startBirthdayAnthem() {
    initAudioContext();
    isPlaying = true;
    playIcon.className = 'fa-solid fa-pause';
    songStatusText.textContent = "Playing Grace's Synthesized Anthem ✨";
    triggerVocalSpeech();

    currentNoteIdx = 0;
    synthInterval = setInterval(() => {
      if (!isPlaying) return;
      const noteItem = melody[currentNoteIdx];
      if (noteItem && notes[noteItem.note]) {
        playSynthNote(notes[noteItem.note], noteItem.duration);
        triggerConfettiBurst(Math.random() * width, Math.random() * (height / 2), 15);
      }
      currentNoteIdx = (currentNoteIdx + 1) % melody.length;
    }, 450);
  }

  function stopBirthdayAnthem() {
    isPlaying = false;
    if (synthInterval) clearInterval(synthInterval);
    playIcon.className = 'fa-solid fa-play';
    songStatusText.textContent = "Paused";
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  btnPlaySong.addEventListener('click', () => {
    if (isPlaying) {
      stopBirthdayAnthem();
    } else {
      startBirthdayAnthem();
    }
  });

  // Spectrum Visualizer
  const visCanvas = document.getElementById('audio-vis-canvas');
  const visCtx = visCanvas.getContext('2d');

  function drawAudioVisualizer() {
    requestAnimationFrame(drawAudioVisualizer);
    visCtx.clearRect(0, 0, visCanvas.width, visCanvas.height);

    if (!analyser || !isPlaying) {
      // Idle wave
      visCtx.fillStyle = 'rgba(247, 208, 112, 0.4)';
      visCtx.fillRect(0, visCanvas.height / 2 - 2, visCanvas.width, 4);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const barWidth = (visCanvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * visCanvas.height;

      const gradient = visCtx.createLinearGradient(0, visCanvas.height, 0, 0);
      gradient.addColorStop(0, '#F7D070');
      gradient.addColorStop(1, '#FF5DA2');

      visCtx.fillStyle = gradient;
      visCtx.fillRect(x, visCanvas.height - barHeight, barWidth - 1, barHeight);

      x += barWidth;
    }
  }
  drawAudioVisualizer();

  // --------------------------------------------------------------------------
  // 3. ELEVENLABS INTEGRATION & MODAL
  // --------------------------------------------------------------------------
  const elevenModal = document.getElementById('elevenlabs-modal');
  const btnOpenEleven = document.getElementById('btn-open-elevenlabs');
  const elevenModalClose = document.getElementById('eleven-modal-close');
  const btnGenEleven = document.getElementById('btn-gen-elevenlabs');
  const elevenStatus = document.getElementById('elevenlabs-status');
  const elevenApiKeyInput = document.getElementById('elevenlabs-api-key');
  const elevenPromptInput = document.getElementById('elevenlabs-prompt');

  btnOpenEleven.addEventListener('click', () => elevenModal.classList.remove('hidden'));
  elevenModalClose.addEventListener('click', () => elevenModal.classList.add('hidden'));

  btnGenEleven.addEventListener('click', async () => {
    const apiKey = elevenApiKeyInput.value.trim();
    const prompt = elevenPromptInput.value.trim();

    if (!apiKey) {
      elevenStatus.innerHTML = "<span style='color:#FF5DA2;'>⚠️ Please enter your ElevenLabs API Key above! In the meantime, playing built-in vocal synthesis...</span>";
      triggerVocalSpeech();
      return;
    }

    elevenStatus.textContent = "⌛ Generating vocal audio via ElevenLabs API...";

    try {
      // Default Voice ID for ElevenLabs (Rachel: 21m00Tcm4TlvDq8ikWAM)
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: prompt,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (!response.ok) throw new Error(`ElevenLabs API returned ${response.status}`);

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.volume = parseFloat(volumeSlider.value);
      audio.play();

      elevenStatus.innerHTML = "<span style='color:#4DEEEA;'>✨ ElevenLabs Voice Generated & Playing Successfully for Grace!</span>";
    } catch (err) {
      console.error(err);
      elevenStatus.innerHTML = `<span style='color:#FF5DA2;'>⚠️ ElevenLabs Error: ${err.message}. Playing local speech synth instead!</span>`;
      triggerVocalSpeech();
    }
  });

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE FLYING UNICORN ENGINE
  // --------------------------------------------------------------------------
  const unicornFlyer = document.getElementById('unicorn-flyer');
  const btnLaunchUnicorn = document.getElementById('btn-launch-unicorn');
  const launchTriggers = document.querySelectorAll('.launch-unicorn-trigger');

  function launchUnicornFlight() {
    unicornFlyer.classList.remove('hidden');
    unicornFlyer.classList.remove('flying');
    void unicornFlyer.offsetWidth; // Trigger reflow
    unicornFlyer.classList.add('flying');

    triggerConfettiBurst(width / 4, height / 2, 80);

    setTimeout(() => {
      unicornFlyer.classList.remove('flying');
      unicornFlyer.classList.add('hidden');
    }, 7200);
  }

  btnLaunchUnicorn.addEventListener('click', launchUnicornFlight);
  launchTriggers.forEach(btn => btn.addEventListener('click', launchUnicornFlight));

  // --------------------------------------------------------------------------
  // 5. CHAMPAGNE CORK POP & FIREWORKS
  // --------------------------------------------------------------------------
  const btnPopChampagne = document.getElementById('btn-pop-champagne');
  const btnCorkPop = document.getElementById('btn-cork-pop');
  const btnFireworks = document.getElementById('btn-fireworks');

  function popChampagneToast() {
    initAudioContext();
    // Play Pop sound
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    }

    triggerConfettiBurst(width / 2, height / 2, 250);
  }

  btnPopChampagne.addEventListener('click', popChampagneToast);
  btnCorkPop.addEventListener('click', popChampagneToast);
  btnFireworks.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        triggerConfettiBurst(Math.random() * width, Math.random() * (height * 0.7), 100);
      }, i * 300);
    }
  });

  // --------------------------------------------------------------------------
  // 6. 21 GOLDEN MILESTONES POPULATOR
  // --------------------------------------------------------------------------
  const milestonesContainer = document.getElementById('milestones-container');
  const milestonesData = [
    { num: "01", title: "Radiant Smile", desc: "Illuminating every room with pure warmth & joy." },
    { num: "02", title: "Brilliant Mind", desc: "A creative visionary with boundless intelligence." },
    { num: "03", title: "Fairytale Spirit", desc: "Spreading enchantment wherever she travels." },
    { num: "04", title: "Golden Heart", desc: "Deeply compassionate and fiercely loving." },
    { num: "05", title: "Unicorn Energy", desc: "Uniquely majestic and 100% extraordinary." },
    { num: "06", title: "Laughter Champion", desc: "Bringing endless laughter to family & friends." },
    { num: "07", title: "Graceful Poise", desc: "Living up to her name with timeless elegance." },
    { num: "08", title: "Bold Explorer", desc: "Embracing life's greatest adventures head-on." },
    { num: "09", title: "Style Icon", desc: "Always effortlessly chic and dazzling." },
    { num: "10", title: "Loyal Bestie", desc: "A treasure of a friend to all who know her." },
    { num: "11", title: "Dream Pursuer", desc: "Turning big dreams into glorious reality." },
    { num: "12", title: "Musical Soul", desc: "Dancing through life with infectious rhythm." },
    { num: "13", title: "Kindness Ambassador", desc: "Lifting others up with genuine warmth." },
    { num: "14", title: "Sparkle Queen", desc: "Leaving glitter and joy in her wake." },
    { num: "15", title: "Fierce Strength", desc: "Overcoming challenges with grace & power." },
    { num: "16", title: "Family Treasure", desc: "The absolute pride & light of her family." },
    { num: "17", title: "Pure Charisma", desc: "Captivating hearts with natural magnetic energy." },
    { num: "18", title: "Infinite Potential", desc: "Ready to conquer the universe at 21." },
    { num: "19", title: "Sweet Delights", desc: "A lover of life's richest cupcakes and treats." },
    { num: "20", title: "Unstoppable", desc: "Building a glorious future with confidence." },
    { num: "21", title: "21 & Magical", desc: "Officially 21 and forever extraordinary!" }
  ];

  milestonesData.forEach(m => {
    const card = document.createElement('div');
    card.className = 'milestone-card';
    card.innerHTML = `
      <div class="milestone-num">${m.num}</div>
      <div class="milestone-title">${m.title}</div>
      <div class="milestone-desc">${m.desc}</div>
    `;
    milestonesContainer.appendChild(card);
  });

  // --------------------------------------------------------------------------
  // 7. GUEST WISH WALL (LOCAL STORAGE)
  // --------------------------------------------------------------------------
  const wishForm = document.getElementById('wish-form');
  const wishWall = document.getElementById('wish-wall');

  const defaultWishes = [
    { name: "Dad (Brent)", gift: "👑 Golden Crown", msg: "Happy 21st Birthday Grace! You are my greatest joy. Keep shining your brilliant light on the world!" },
    { name: "Mom", gift: "🌹 Royal Rose Bouquet", msg: "To my sweet Grace: 21 years of watching you grow has been the honor of my life. Love you beyond words!" },
    { name: "Bestie Squad", gift: "🥂 Champagne Toast", msg: "GRACE IS 21!! Time to celebrate the queen of the universe! Let's make this year unforgettable!" }
  ];

  function loadWishes() {
    const stored = localStorage.getItem('grace21_wishes');
    const wishes = stored ? JSON.parse(stored) : defaultWishes;
    wishWall.innerHTML = '';
    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-note-card';
      card.innerHTML = `
        <div class="wish-note-gift">${w.gift}</div>
        <div class="wish-note-author">${escapeHtml(w.name)}</div>
        <div class="wish-note-msg">"${escapeHtml(w.msg)}"</div>
      `;
      wishWall.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wish-name').value.trim();
    const gift = document.getElementById('wish-gift').value;
    const msg = document.getElementById('wish-text').value.trim();

    if (!name || !msg) return;

    const stored = localStorage.getItem('grace21_wishes');
    const wishes = stored ? JSON.parse(stored) : [...defaultWishes];
    wishes.unshift({ name, gift, msg });
    localStorage.setItem('grace21_wishes', JSON.stringify(wishes));

    loadWishes();
    wishForm.reset();
    triggerConfettiBurst(width * 0.75, height * 0.75, 100);
  });

  loadWishes();

  // --------------------------------------------------------------------------
  // 8. PRESENT MODAL
  // --------------------------------------------------------------------------
  const giftModal = document.getElementById('gift-modal');
  const btnUnwrap = document.getElementById('btn-unwrap-present');
  const giftModalClose = document.getElementById('gift-modal-close');
  const btnSingSpeech = document.getElementById('btn-sing-speech');

  btnUnwrap.addEventListener('click', () => {
    giftModal.classList.remove('hidden');
    triggerConfettiBurst(width / 2, height / 2, 180);
  });

  giftModalClose.addEventListener('click', () => giftModal.classList.add('hidden'));
  btnSingSpeech.addEventListener('click', triggerVocalSpeech);

  // --------------------------------------------------------------------------
  // 9. COUNTDOWN TIMER TICKER
  // --------------------------------------------------------------------------
  let secCounter = 0;
  setInterval(() => {
    secCounter = (secCounter + 1) % 60;
    const cdSecs = document.getElementById('cd-secs');
    if (cdSecs) cdSecs.textContent = secCounter < 10 ? `0${secCounter}` : `${secCounter}`;
  }, 1000);

});
