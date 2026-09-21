/**
 * Audio & Live Microphone Module
 * Web Audio API Analyser & Speech Synthesis Intro
 * Developed for Lokesh Balaji's Portfolio
 */

(function() {
  'use strict';

  let audioContext = null;
  let analyser = null;
  let microphoneStream = null;
  let audioDataArray = null;
  let isLiveMicActive = false;
  let isIntroPlaying = false;
  let animFrameId = null;

  // DOM Elements
  let canvas, ctx;
  let btnVoiceIntro, btnLiveMic, micIconBubble, micStatusText;

  function init() {
    canvas = document.getElementById('audioVisualizerCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    btnVoiceIntro = document.getElementById('btnVoiceIntro');
    btnLiveMic = document.getElementById('btnLiveMic');
    micIconBubble = document.getElementById('micIconBubble');
    micStatusText = document.getElementById('micStatusText');

    if (btnVoiceIntro) {
      btnVoiceIntro.addEventListener('click', toggleVoiceGreeting);
    }

    if (btnLiveMic) {
      btnLiveMic.addEventListener('click', toggleLiveMic);
    }

    // Start idle visualizer animation
    startVisualizerLoop();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth || 400;
    canvas.height = canvas.parentElement.clientHeight || 48;
  }

  // --- Feature 1: Speech Synthesis Developer Introduction ---
  function toggleVoiceGreeting() {
    if (isIntroPlaying) {
      stopVoiceGreeting();
    } else {
      playVoiceGreeting();
    }
  }

  function playVoiceGreeting() {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    // Stop live mic if running
    if (isLiveMicActive) {
      stopLiveMic();
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const greetingText = "Hi there! Welcome to my portfolio. I'm Lokesh Balaji, an enthusiastic fresher web developer passionate about building modern, animated, and responsive web applications. Feel free to explore my projects or get in touch!";
    const utterance = new SpeechSynthesisUtterance(greetingText);

    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Alex')) && v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = function() {
      isIntroPlaying = true;
      if (btnVoiceIntro) {
        btnVoiceIntro.classList.add('active');
        btnVoiceIntro.innerHTML = '<i class="fas fa-pause"></i> <span>Stop Greeting</span>';
      }
      if (micIconBubble) micIconBubble.classList.add('active');
      if (micStatusText) micStatusText.textContent = 'Speaking Welcome Intro...';
      if (window.Avatar3D) window.Avatar3D.setSpeaking(true);
    };

    utterance.onend = function() {
      stopVoiceGreeting();
    };

    utterance.onerror = function() {
      stopVoiceGreeting();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopVoiceGreeting() {
    isIntroPlaying = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    if (btnVoiceIntro) {
      btnVoiceIntro.classList.remove('active');
      btnVoiceIntro.innerHTML = '<i class="fas fa-volume-high"></i> <span>Hear Intro</span>';
    }
    if (!isLiveMicActive) {
      if (micIconBubble) micIconBubble.classList.remove('active');
      if (micStatusText) micStatusText.textContent = 'Live Audio HUD • Ready';
    }
    if (window.Avatar3D) window.Avatar3D.setSpeaking(false);
  }

  // --- Feature 2: Real-time Live Microphone Analyser ---
  async function toggleLiveMic() {
    if (isLiveMicActive) {
      stopLiveMic();
    } else {
      await startLiveMic();
    }
  }

  async function startLiveMic() {
    // Stop voice intro if playing
    if (isIntroPlaying) {
      stopVoiceGreeting();
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      microphoneStream = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      audioDataArray = new Uint8Array(bufferLength);

      isLiveMicActive = true;

      if (btnLiveMic) {
        btnLiveMic.classList.add('active');
        btnLiveMic.innerHTML = '<i class="fas fa-microphone-slash"></i> <span>Stop Mic</span>';
      }
      if (micIconBubble) micIconBubble.classList.add('active');
      if (micStatusText) micStatusText.textContent = 'Listening to Mic • Live FFT';
      if (window.Avatar3D) window.Avatar3D.setSpeaking(true);

    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      if (micStatusText) micStatusText.textContent = 'Mic access declined (Demo Mode)';
      simulateDemoAudio();
    }
  }

  function stopLiveMic() {
    isLiveMicActive = false;

    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
      microphoneStream = null;
    }

    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      audioContext = null;
    }

    analyser = null;
    audioDataArray = null;

    if (btnLiveMic) {
      btnLiveMic.classList.remove('active');
      btnLiveMic.innerHTML = '<i class="fas fa-microphone"></i> <span>Live Mic</span>';
    }
    if (micIconBubble) micIconBubble.classList.remove('active');
    if (micStatusText) micStatusText.textContent = 'Live Audio HUD • Ready';
    if (window.Avatar3D) window.Avatar3D.setSpeaking(false);
  }

  // Simulated waveform fallback
  function simulateDemoAudio() {
    let demoCount = 0;
    const interval = setInterval(() => {
      if (isLiveMicActive || isIntroPlaying || demoCount > 30) {
        clearInterval(interval);
        return;
      }
      demoCount++;
    }, 100);
  }

  // --- Visualizer Rendering Canvas Loop ---
  function startVisualizerLoop() {
    let step = 0;

    function render() {
      animFrameId = requestAnimationFrame(render);
      step += 0.05;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (isLiveMicActive && analyser && audioDataArray) {
        // Real-time Mic FFT Frequency Bars
        analyser.getByteFrequencyData(audioDataArray);

        const barCount = audioDataArray.length;
        const barWidth = (width / barCount) * 0.75;
        const gap = (width / barCount) * 0.25;

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < barCount; i++) sum += audioDataArray[i];
        const avg = sum / barCount;
        if (window.Avatar3D) {
          window.Avatar3D.setSpeaking(avg > 18);
        }

        for (let i = 0; i < barCount; i++) {
          const val = audioDataArray[i] / 255;
          const barHeight = Math.max(4, val * (height - 6));
          const x = i * (barWidth + gap) + 4;
          const y = (height - barHeight) / 2;

          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.5, '#6366f1');
          grad.addColorStop(1, '#a855f7');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();
        }

      } else if (isIntroPlaying) {
        // Expressive voice frequency simulation
        const barCount = 28;
        const barWidth = 6;
        const spacing = (width - (barCount * barWidth)) / (barCount - 1);

        for (let i = 0; i < barCount; i++) {
          const wave = Math.sin(step * 3 + i * 0.45) * 0.5 + 0.5;
          const barHeight = Math.max(6, wave * (height * 0.75) * (0.4 + Math.random() * 0.6));
          const x = i * (barWidth + spacing);
          const y = (height - barHeight) / 2;

          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#818cf8';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();
        }

      } else {
        // Idle gentle breathing sine wave
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';

        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin((x * 0.035) + step) * 6 * Math.sin(step * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Overlay small neon dots along the wave
        const dotX = ((step * 40) % width);
        const dotY = height / 2 + Math.sin((dotX * 0.035) + step) * 6 * Math.sin(step * 0.5);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    render();
  }

  // Expose public API
  window.AudioMicManager = {
    playVoiceGreeting: playVoiceGreeting,
    stopVoiceGreeting: stopVoiceGreeting,
    toggleLiveMic: toggleLiveMic,
    get isIntroPlaying() { return isIntroPlaying; },
    get isLiveMicActive() { return isLiveMicActive; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
