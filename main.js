/* ==========================================================================
   GRACE 21ST BIRTHDAY CELESTIAL GALA - APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. BACKGROUND & FIREWORKS CANVASES
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

  // Starfield Background
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
    
    // Ambient Nebula Glow
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

  // --------------------------------------------------------------------------
  // 2. OVERWHELMING FIREWORKS & CONFETTI ENGINE
  // --------------------------------------------------------------------------
  let confettiParticles = [];
  let fireworksRockets = [];
  let fireworkSparks = [];
  let flashAlpha = 0;

  class FireworkRocket {
    constructor(targetX, targetY) {
      this.x = Math.random() * (width * 0.8) + (width * 0.1);
      this.y = height;
      this.targetX = targetX || (Math.random() * (width * 0.8) + (width * 0.1));
      this.targetY = targetY || (Math.random() * (height * 0.45) + (height * 0.1));
      
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      const speed = Math.random() * 4 + 14;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      
      this.trail = [];
      this.exploded = false;
      this.color = ['#F7D070', '#E8A5C8', '#FF5DA2', '#56E1FF', '#FFD700', '#FFFFFF', '#9B51E0'][Math.floor(Math.random() * 7)];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 12) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      // Rocket whiz / whistle sound trigger
      if (Math.random() < 0.2) {
        playSynthWhistle();
      }

      // Check peak reach
      if (this.vy < 0 && this.y <= this.targetY) {
        this.explode();
        this.exploded = true;
      }
    }

    explode() {
      flashAlpha = 0.25;
      playSynthExplosion();

      const particleCount = Math.floor(Math.random() * 120) + 180; // Overwhelming count
      const colors = [this.color, '#F7D070', '#FFFFFF', '#FF5DA2', '#56E1FF'];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 2;
        fireworkSparks.push({
          x: this.x,
          y: this.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          gravity: 0.08,
          flicker: Math.random() > 0.3
        });
      }
    }

    draw(ctx) {
      // Trail
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        ctx.save();
        ctx.globalAlpha = (i / this.trail.length) * 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Rocket head
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

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
        opacity: 1
      });
    }
  }

  // OVERWHELMING FIREWORKS GRAND FINALE
  function launchGrandFireworksFinale() {
    initAudioContext();
    
    // Attempt ElevenLabs Sound Effects API if Key is present
    playElevenLabsFireworksSoundEffect();

    let waveCount = 0;
    const interval = setInterval(() => {
      // Launch 5 rockets per wave across screen
      for (let i = 0; i < 4; i++) {
        fireworksRockets.push(new FireworkRocket());
      }
      waveCount++;
      if (waveCount >= 10) { // 40 rockets total
        clearInterval(interval);
      }
    }, 250);
  }

  function renderConfettiAndFireworks() {
    confettiCtx.clearRect(0, 0, width, height);

    // Flash Effect
    if (flashAlpha > 0) {
      confettiCtx.save();
      confettiCtx.fillStyle = `rgba(255, 240, 200, ${flashAlpha})`;
      confettiCtx.fillRect(0, 0, width, height);
      confettiCtx.restore();
      flashAlpha -= 0.02;
    }

    // Render Fireworks Rockets
    for (let i = fireworksRockets.length - 1; i >= 0; i--) {
      const rocket = fireworksRockets[i];
      rocket.update();
      rocket.draw(confettiCtx);
      if (rocket.exploded) {
        fireworksRockets.splice(i, 1);
      }
    }

    // Render Fireworks Sparks
    for (let i = fireworkSparks.length - 1; i >= 0; i--) {
      const spark = fireworkSparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += spark.gravity;
      spark.vx *= 0.98;
      spark.alpha -= spark.decay;

      if (spark.alpha <= 0) {
        fireworkSparks.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = spark.flicker && Math.random() > 0.4 ? spark.alpha * 0.5 : spark.alpha;
      confettiCtx.fillStyle = spark.color;
      confettiCtx.shadowBlur = 10;
      confettiCtx.shadowColor = spark.color;
      confettiCtx.beginPath();
      confettiCtx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      confettiCtx.fill();
      confettiCtx.restore();
    }

    // Render Confetti
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
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

    requestAnimationFrame(renderConfettiAndFireworks);
  }
  renderConfettiAndFireworks();

  // --------------------------------------------------------------------------
  // 3. SOUND SYNTHESIS & ELEVENLABS FIREWORKS AUDIO
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

  // Realistic Synthesized Firework Sound Effects
  function playSynthWhistle() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.3);

    const vol = parseFloat(volumeSlider.value) * 0.15;
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  function playSynthExplosion() {
    if (!audioCtx) return;
    
    // Deep Sub-Bass Boom
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);

    const vol = parseFloat(volumeSlider.value) * 0.6;
    oscGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);

    // Crackle Noise Burst
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.5, audioCtx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    whiteNoise.start();
    whiteNoise.stop(audioCtx.currentTime + 0.4);
  }

  // ELEVENLABS SOUND GENERATION API INTEGRATION FOR FIREWORKS
  async function playElevenLabsFireworksSoundEffect() {
    const apiKeyInput = document.getElementById('elevenlabs-api-key');
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

    if (!apiKey) return; // Fallback smoothly to web audio synth fireworks

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: "Grand finale fireworks explosions boisterous roaring boom crackle cheering celebration",
          duration_seconds: 4.0,
          prompt_influence: 0.8
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.volume = parseFloat(volumeSlider.value);
        audio.play();
      }
    } catch (e) {
      console.warn("ElevenLabs sound generation request skipped:", e);
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
  // 4. ELEVENLABS INTEGRATION & MODAL
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
      elevenStatus.innerHTML = "<span style='color:#FF5DA2;'>⚠️ Please enter your ElevenLabs API Key above! Playing local speech synth...</span>";
      triggerVocalSpeech();
      return;
    }

    elevenStatus.textContent = "⌛ Generating vocal audio via ElevenLabs API...";

    try {
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
  // 5. INTERACTIVE FLYING UNICORN ENGINE & CARD ACTIONS
  // --------------------------------------------------------------------------
  const unicornFlyer = document.getElementById('unicorn-flyer');
  const btnLaunchUnicorn = document.getElementById('btn-launch-unicorn');
  const launchTriggers = document.querySelectorAll('.launch-unicorn-trigger');

  function launchUnicornFlight() {
    unicornFlyer.classList.remove('hidden');
    unicornFlyer.classList.remove('flying');
    void unicornFlyer.offsetWidth;
    unicornFlyer.classList.add('flying');

    triggerConfettiBurst(width / 4, height / 2, 80);

    setTimeout(() => {
      unicornFlyer.classList.remove('flying');
      unicornFlyer.classList.add('hidden');
    }, 7200);
  }

  btnLaunchUnicorn.addEventListener('click', launchUnicornFlight);
  launchTriggers.forEach(btn => btn.addEventListener('click', launchUnicornFlight));

  // Sound Synth for Balloon Pop
  function playPopSound() {
    initAudioContext();
    if (!audioCtx) return;

    // Pop Pitch Drop
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

    const vol = parseFloat(volumeSlider.value);
    gain.gain.setValueAtTime(vol * 0.9, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);

    // Click Noise
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.7, audioCtx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start();
  }

  // Floating Balloons Spawner & Pop Trigger
  const popBalloonsTriggers = document.querySelectorAll('.pop-balloons-trigger');
  
  function spawnAndPopBalloons() {
    initAudioContext();

    // Spawn 18 interactive floating balloon elements
    const balloonColors = ['#FF5DA2', '#F7D070', '#E8A5C8', '#56E1FF', '#9B51E0', '#FFD700'];
    
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.className = 'interactive-balloon';
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const size = Math.floor(Math.random() * 30) + 50;
        const startX = Math.random() * (width - 100) + 50;

        balloon.style.cssText = `
          position: fixed;
          bottom: -100px;
          left: ${startX}px;
          width: ${size}px;
          height: ${size * 1.2}px;
          background: radial-gradient(circle at 30% 30%, #FFF, ${color} 70%);
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px ${color};
          cursor: pointer;
          z-index: 150;
          transition: transform 0.1s ease;
          animation: floatUpBalloon ${Math.random() * 3 + 4}s linear forwards;
        `;

        // Ribbon
        const ribbon = document.createElement('div');
        ribbon.style.cssText = `
          position: absolute;
          bottom: -20px;
          left: 50%;
          width: 2px;
          height: 25px;
          background: rgba(255,255,255,0.7);
          transform: translateX(-50%);
        `;
        balloon.appendChild(ribbon);

        // Click to pop
        function popThisBalloon(e) {
          if (e) e.stopPropagation();
          playPopSound();
          const rect = balloon.getBoundingClientRect();
          triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
          balloon.remove();
        }

        balloon.addEventListener('click', popThisBalloon);
        balloon.addEventListener('touchstart', popThisBalloon);

        document.body.appendChild(balloon);

        // Auto pop or clean up if reached top
        setTimeout(() => {
          if (document.body.contains(balloon)) {
            popThisBalloon();
          }
        }, (Math.random() * 3000) + 3500);

      }, i * 180);
    }
  }

  popBalloonsTriggers.forEach(btn => btn.addEventListener('click', spawnAndPopBalloons));

  // Candle Sparkler Fountain
  function triggerCandleSparklerFountain(originX = width / 2, originY = height / 2) {
    const candleSymbols = ['🕯️', '✨', '🔥', '🎂', '⭐', '✨', '💫'];
    for (let i = 0; i < 21; i++) {
      const candleSpark = document.createElement('div');
      candleSpark.className = 'candle-spark-particle';
      candleSpark.textContent = candleSymbols[Math.floor(Math.random() * candleSymbols.length)];
      const startX = originX + (Math.random() * 120 - 60);
      const startY = originY;

      candleSpark.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: ${Math.random() * 22 + 18}px;
        pointer-events: none;
        z-index: 200;
        transition: transform 1.5s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 1.5s ease-out;
        opacity: 1;
        filter: drop-shadow(0 0 12px #FFD700);
      `;

      document.body.appendChild(candleSpark);

      setTimeout(() => {
        const moveX = (Math.random() - 0.5) * 300;
        const moveY = -(Math.random() * 280 + 100);
        candleSpark.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.8) rotate(${Math.random() * 360}deg)`;
        candleSpark.style.opacity = '0';
      }, 20);

      setTimeout(() => {
        if (document.body.contains(candleSpark)) candleSpark.remove();
      }, 1600);
    }

    triggerConfettiBurst(originX, originY, 150);
  }

  // Sparkle Candles Trigger (Royal Cake)
  const lightCakeTriggers = document.querySelectorAll('.light-cake-trigger');
  lightCakeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      initAudioContext();
      playMagicGlissandoSound();
      const rect = btn.getBoundingClientRect();
      triggerCandleSparklerFountain(rect.left + rect.width / 2, rect.top + rect.height / 2);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance("Blow out your 21 candles Grace and make a magical wish!");
        utter.pitch = 1.25;
        utter.volume = parseFloat(volumeSlider.value);
        window.speechSynthesis.speak(utter);
      }
    });
  });

  // Sound Synth for Magic Chime Glissando
  function playMagicGlissandoSound() {
    initAudioContext();
    if (!audioCtx) return;

    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
    const vol = parseFloat(volumeSlider.value) * 0.4;

    chimeFreqs.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }, idx * 60);
    });
  }

  // Fairy Dust Particle Shower
  function triggerFairyDustShower(originX = width / 2, originY = height / 2) {
    const symbols = ['✨', '⭐', '💖', '🌟', '💫', '✨'];
    for (let i = 0; i < 25; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'fairy-dust-particle';
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const startX = originX + (Math.random() * 200 - 100);
      const startY = originY + (Math.random() * 100 - 50);

      sparkle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: ${Math.random() * 20 + 16}px;
        pointer-events: none;
        z-index: 200;
        transition: transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s ease-out;
        opacity: 1;
        filter: drop-shadow(0 0 10px #F7D070);
      `;

      document.body.appendChild(sparkle);

      setTimeout(() => {
        const moveX = (Math.random() - 0.5) * 250;
        const moveY = -(Math.random() * 200 + 80);
        sparkle.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.6) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      }, 20);

      setTimeout(() => {
        if (document.body.contains(sparkle)) sparkle.remove();
      }, 1300);
    }

    // Also trigger canvas confetti burst at button position
    triggerConfettiBurst(originX, originY, 120);
  }

  // Sprinkle Magic Dust Trigger (Cupcakes)
  const confettiTriggers = document.querySelectorAll('.confetti-trigger');
  confettiTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playMagicGlissandoSound();
      const rect = btn.getBoundingClientRect();
      triggerFairyDustShower(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  // --------------------------------------------------------------------------
  // 6. CHAMPAGNE & FIREWORKS BUTTON TRIGGERS
  // --------------------------------------------------------------------------
  const btnPopChampagne = document.getElementById('btn-pop-champagne');
  const btnCorkPop = document.getElementById('btn-cork-pop');
  const btnFireworks = document.getElementById('btn-fireworks');

  function popChampagneToast() {
    initAudioContext();
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
  
  // GRAND OVERWHELMING FIREWORKS BUTTON TRIGGER
  btnFireworks.addEventListener('click', launchGrandFireworksFinale);

  // --------------------------------------------------------------------------
  // 7. 21 GOLDEN MILESTONES POPULATOR
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
  // 8. GLOBAL PERSISTENT GUEST WISH WALL (CLOUD BACKEND + LOCAL CACHE)
  // --------------------------------------------------------------------------
  const wishForm = document.getElementById('wish-form');
  const wishWall = document.getElementById('wish-wall');
  const WISH_API_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fd38367407c4d';

  let globalWishes = [];

  async function fetchGlobalWishes() {
    try {
      const res = await fetch(WISH_API_URL);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && Array.isArray(json.data.wishes)) {
          globalWishes = json.data.wishes.filter(w => 
            w.name !== "Dad (Brent)" && w.name !== "Mom" && w.name !== "Bestie Squad"
          );
          localStorage.setItem('grace21_wishes_v2', JSON.stringify(globalWishes));
        }
      }
    } catch (err) {
      console.warn("Using local cache for wishes:", err);
      const stored = localStorage.getItem('grace21_wishes_v2');
      if (stored) globalWishes = JSON.parse(stored);
    }
    renderWishWall();
  }

  async function saveGlobalWishes(newWishes) {
    try {
      await fetch(WISH_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'grace21_wishes',
          data: { wishes: newWishes }
        })
      });
    } catch (err) {
      console.error("Failed to sync wish to cloud:", err);
    }
  }

  function renderWishWall() {
    wishWall.innerHTML = '';
    
    if (globalWishes.length === 0) {
      wishWall.innerHTML = `
        <div class="wish-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.02); border: var(--border-gold); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">✍️✨</div>
          <p style="font-family: var(--font-accent); font-size: 1.1rem; color: var(--text-sub);">Be the first to post a birthday wish for Grace!</p>
        </div>
      `;
      return;
    }

    globalWishes.forEach(w => {
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

  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('wish-name').value.trim();
    const gift = document.getElementById('wish-gift').value;
    const msg = document.getElementById('wish-text').value.trim();

    if (!name || !msg) return;

    const newWish = { name, gift, msg, date: new Date().toISOString() };
    globalWishes.unshift(newWish);
    localStorage.setItem('grace21_wishes_v2', JSON.stringify(globalWishes));

    renderWishWall();
    wishForm.reset();
    triggerConfettiBurst(width * 0.75, height * 0.75, 100);

    // Save to global cloud database
    await saveGlobalWishes(globalWishes);
  });

  // Fetch initial global wishes on load and poll every 8 seconds for live updates
  fetchGlobalWishes();
  setInterval(fetchGlobalWishes, 8000);

  // --------------------------------------------------------------------------
  // 9. PRESENT MODAL & 21 CANDLES CEREMONY MODAL
  // --------------------------------------------------------------------------
  const giftModal = document.getElementById('gift-modal');
  const btnUnwrap = document.getElementById('btn-unwrap-present');
  const giftModalClose = document.getElementById('gift-modal-close');
  const btnSingSpeech = document.getElementById('btn-sing-speech');

  // State tracking for required birthday ceremonies before auto-tour
  let hasUnwrappedGift = false;
  let hasBlownCandles = false;

  function checkCeremoniesComplete() {
    if (hasUnwrappedGift && hasBlownCandles && !isAutoTourActive) {
      setTimeout(() => {
        if (!isPlaying) startBirthdayAnthem();
        startAutoTour();
        triggerConfettiBurst(width / 2, height / 3, 200);
      }, 1500);
    }
  }

  btnUnwrap.addEventListener('click', () => {
    giftModal.classList.remove('hidden');
    triggerConfettiBurst(width / 2, height / 2, 180);
    hasUnwrappedGift = true;
    checkCeremoniesComplete();
  });

  giftModalClose.addEventListener('click', () => giftModal.classList.add('hidden'));
  btnSingSpeech.addEventListener('click', triggerVocalSpeech);

  // 21 Candles Ceremony
  const candleModal = document.getElementById('candle-modal');
  const btnLightCandles = document.getElementById('btn-light-candles');
  const candleModalClose = document.getElementById('candle-modal-close');
  const btnDoBlowCandles = document.getElementById('btn-do-blow-candles');
  const candlesGrid = document.getElementById('candles-grid');
  const candleStatus = document.getElementById('candle-status');

  function playBlowPuffSound() {
    initAudioContext();
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.5);

    const gain = audioCtx.createGain();
    const vol = parseFloat(volumeSlider.value);
    gain.gain.setValueAtTime(vol * 0.8, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  }

  function init21CandlesDisplay() {
    if (!candlesGrid) return;
    candlesGrid.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
      const item = document.createElement('div');
      item.className = 'candle-item';
      item.innerHTML = `
        <div class="flame lit" id="candle-flame-${i}">🔥</div>
        <div class="candle-stick"></div>
      `;
      item.addEventListener('click', () => blowOutSingleCandle(i));
      candlesGrid.appendChild(item);
    }
    if (candleStatus) candleStatus.textContent = "21 glowing candles are lit for Grace's 21st birthday!";
  }

  function blowOutSingleCandle(idx) {
    const flame = document.getElementById(`candle-flame-${idx}`);
    if (flame && flame.classList.contains('lit')) {
      playBlowPuffSound();
      flame.className = 'flame blown';
      flame.textContent = '💨';
    }
  }

  function blowOutAll21Candles() {
    playBlowPuffSound();
    for (let i = 1; i <= 21; i++) {
      setTimeout(() => {
        const flame = document.getElementById(`candle-flame-${i}`);
        if (flame) {
          flame.className = 'flame blown';
          flame.textContent = '💨';
        }
      }, i * 60);
    }

    setTimeout(() => {
      triggerCandleSparklerFountain(width / 2, height / 2);
      if (candleStatus) candleStatus.innerHTML = "<span style='color:#F7D070; font-weight:700;'>✨ GRACE BLEW OUT ALL 21 CANDLES! May all your birthday wishes come true!</span>";

      hasBlownCandles = true;
      checkCeremoniesComplete();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance("Grace blew out all 21 candles! May every single 21st birthday wish come true!");
        utter.pitch = 1.3;
        utter.volume = parseFloat(volumeSlider.value);
        window.speechSynthesis.speak(utter);
      }
    }, 1300);
  }

  if (btnLightCandles) {
    btnLightCandles.addEventListener('click', () => {
      init21CandlesDisplay();
      if (candleModal) candleModal.classList.remove('hidden');
    });
  }

  if (candleModalClose) {
    candleModalClose.addEventListener('click', () => {
      if (candleModal) candleModal.classList.add('hidden');
    });
  }

  if (btnDoBlowCandles) {
    btnDoBlowCandles.addEventListener('click', blowOutAll21Candles);
  }

  // --------------------------------------------------------------------------
  // 10. AUTO-PLAY MUSIC & AUTO-TOUR ENGINE
  // --------------------------------------------------------------------------
  let isAutoTourActive = false;
  let autoTourFrameId = null;
  const triggeredButtons = new Set();

  const autotourStatus = document.getElementById('autotour-status');
  const btnToggleAutotour = document.getElementById('btn-toggle-autotour');

  // Set initial status to prompt user for gift & candles
  if (autotourStatus) autotourStatus.innerHTML = '<i class="fa-solid fa-gift"></i> Complete Grace\'s Gift & Candles to Start Auto-Tour';
  if (btnToggleAutotour) btnToggleAutotour.innerHTML = '<i class="fa-solid fa-play"></i> Start Tour';

  // Unlock Audio on First User Gesture if blocked by browser autoplay policy
  const unlockAudioEvents = ['click', 'touchstart', 'keydown', 'scroll'];
  function unlockAudio() {
    if (!isPlaying) {
      startBirthdayAnthem();
    }
    unlockAudioEvents.forEach(ev => window.removeEventListener(ev, unlockAudio));
  }
  unlockAudioEvents.forEach(ev => window.addEventListener(ev, unlockAudio, { once: true }));

  // Auto Scroll & Auto Click Engine Loop
  function runAutoTourLoop() {
    if (!isAutoTourActive) return;

    // Smooth Slow Downward Scroll
    window.scrollBy(0, 0.75);

    // List of interactive buttons to simulate click as they enter viewport
    const tourTargets = [
      document.querySelector('.launch-unicorn-trigger'),
      document.querySelector('.light-cake-trigger'),
      document.querySelector('.confetti-trigger'),
      document.querySelector('.pop-balloons-trigger'),
      document.getElementById('btn-cork-pop'),
      document.getElementById('btn-fireworks')
    ];

    tourTargets.forEach(btn => {
      if (btn && !triggeredButtons.has(btn)) {
        const rect = btn.getBoundingClientRect();
        // Check if button is in the active viewport trigger zone
        if (rect.top > height * 0.25 && rect.top < height * 0.65) {
          triggeredButtons.add(btn);
          // Highlight button briefly
          btn.style.boxShadow = '0 0 35px #F7D070';
          setTimeout(() => {
            btn.click();
          }, 100);
          setTimeout(() => {
            btn.style.boxShadow = '';
          }, 800);
        }
      }
    });

    // Check if reached page bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 40) {
      stopAutoTour();
      launchGrandFireworksFinale();
      return;
    }

    autoTourFrameId = requestAnimationFrame(runAutoTourLoop);
  }

  function startAutoTour() {
    isAutoTourActive = true;
    if (!isPlaying) startBirthdayAnthem();
    if (autotourStatus) autotourStatus.innerHTML = '<i class="fa-solid fa-clapperboard"></i> Royal Auto-Tour Active';
    if (btnToggleAutotour) btnToggleAutotour.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Tour';
    autoTourFrameId = requestAnimationFrame(runAutoTourLoop);
  }

  function stopAutoTour() {
    isAutoTourActive = false;
    if (autoTourFrameId) cancelAnimationFrame(autoTourFrameId);
    if (autotourStatus) autotourStatus.innerHTML = '<i class="fa-solid fa-circle-stop"></i> Auto-Tour Paused';
    if (btnToggleAutotour) btnToggleAutotour.innerHTML = '<i class="fa-solid fa-play"></i> Resume Tour';
  }

  // Toggle Button Click
  if (btnToggleAutotour) {
    btnToggleAutotour.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAutoTourActive) {
        stopAutoTour();
      } else {
        startAutoTour();
      }
    });
  }

  // Allow User to Interrupt Auto-Tour anytime with wheel or drag
  const userInterruptEvents = ['wheel', 'touchstart', 'keydown'];
  userInterruptEvents.forEach(ev => {
    window.addEventListener(ev, (e) => {
      // Ignore clicks on control button itself
      if (e.target.closest('#autotour-banner')) return;
      if (isAutoTourActive) {
        stopAutoTour();
      }
    }, { passive: true });
  });

});
