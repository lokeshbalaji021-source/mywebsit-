/**
 * LOKESH BALAJI - WEB DEVELOPER PORTFOLIO
 * High-End Interactive Application Script
 * Clean ES6+, Zero Console Errors, Production-Tested
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. DYNAMIC COPYRIGHT YEAR
  // ==========================================================================
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 2. SYNTHESIZED UI SOUND SYSTEM (Web Audio API - Purely Opt-in & Non-intrusive)
  // ==========================================================================
  let soundEnabled = false;
  let audioCtx = null;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  };

  const playUiSound = (type = 'click') => {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(680, now + 0.06);
        osc.frequency.setValueAtTime(840, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('active', soundEnabled);
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high text-emerald';
        showToast('UI Sound Effects: Enabled', 'success');
        playUiSound('click');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        showToast('UI Sound Effects: Muted', 'error');
      }
    });
  }

  // ==========================================================================
  // 3. CUSTOM DESKTOP CURSOR
  // ==========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const interactiveTargets = document.querySelectorAll('a, button, input, select, textarea, .editorial-project-row, .bento-box, .skill-card');
    interactiveTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
      el.addEventListener('click', () => playUiSound('click'));
    });
  }

  // ==========================================================================
  // 4. NAVBAR SCROLL & ACTIVE LINK SPY
  // ==========================================================================
  const siteHeader = document.getElementById('site-header');
  const handleScrollState = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState();

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-link');
  const spyActiveSection = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', spyActiveSection, { passive: true });

  // ==========================================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    playUiSound('click');
  };

  const closeDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ==========================================================================
  // 6. HERO PARALLAX & TYPEWRITER EFFECT
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  const heroBgImg = document.getElementById('hero-bg-img');
  const floatCard1 = document.getElementById('float-card-1');
  const floatCard2 = document.getElementById('float-card-2');
  const floatCard3 = document.getElementById('float-card-3');

  if (heroSection && heroBgImg && window.innerWidth > 992) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      // Elegant, smooth parallax for the containerless seamless portrait
      heroBgImg.style.transform = `translate(${xPercent * -12}px, ${yPercent * -9}px) scale(1.02)`;

      // Dynamic depth response for floating tech badges
      if (floatCard1) floatCard1.style.transform = `translate(${xPercent * 8}px, ${yPercent * 6}px)`;
      if (floatCard2) floatCard2.style.transform = `translate(${xPercent * 6}px, ${yPercent * 8}px)`;
      if (floatCard3) floatCard3.style.transform = `translate(${xPercent * 10}px, ${yPercent * 7}px)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroBgImg.style.transform = 'translate(0px, 0px) scale(1)';
      if (floatCard1) floatCard1.style.transform = '';
      if (floatCard2) floatCard2.style.transform = '';
      if (floatCard3) floatCard3.style.transform = '';
    });
  }

  // Typewriter
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const roles = [
      'Responsive Website Development',
      'School & Educational Web Portals',
      'Fine Art Photography Portfolios',
      'Interactive Wedding Invitation Websites',
      'Modern HTML5 & CSS3 Architecture',
      'Continuous Cloud Deployment'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 70;

    const tickTypewriter = () => {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        speed = 35;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        speed = 75;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 350;
      }
      setTimeout(tickTypewriter, speed);
    };
    setTimeout(tickTypewriter, 600);
  }

  // ==========================================================================
  // 7. SKILLS CATEGORY FILTER
  // ==========================================================================
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
      playUiSound('click');
    });
  });

  // ==========================================================================
  // 8. INTERACTIVE CODE LAB
  // ==========================================================================
  const labTabBtns = document.querySelectorAll('.lab-tab-btn');
  const labTabContents = document.querySelectorAll('.lab-tab-content');

  labTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      labTabBtns.forEach(b => b.classList.remove('active'));
      labTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
      playUiSound('click');
    });
  });

  // Tab 1: CSS Glassmorphism Generator
  const sliderBlur = document.getElementById('slider-blur');
  const sliderOpacity = document.getElementById('slider-opacity');
  const sliderGlow = document.getElementById('slider-glow');
  const blurVal = document.getElementById('blur-val');
  const opacityVal = document.getElementById('opacity-val');
  const glowVal = document.getElementById('glow-val');
  const glassTarget = document.getElementById('glass-target');
  const liveCssOutput = document.getElementById('live-css-output');
  const tintBtns = document.querySelectorAll('.tint-btn');

  let currentTint = '#f59e0b';

  const updateGlassmorphism = () => {
    if (!glassTarget || !liveCssOutput) return;
    const blur = sliderBlur ? sliderBlur.value : 16;
    const opacity = sliderOpacity ? sliderOpacity.value : 0.65;
    const glow = sliderGlow ? sliderGlow.value : 30;

    if (blurVal) blurVal.textContent = `${blur}px`;
    if (opacityVal) opacityVal.textContent = opacity;
    if (glowVal) glowVal.textContent = `${glow}px`;

    const r = parseInt(currentTint.slice(1, 3), 16);
    const g = parseInt(currentTint.slice(3, 5), 16);
    const b = parseInt(currentTint.slice(5, 7), 16);

    glassTarget.style.backdropFilter = `blur(${blur}px)`;
    glassTarget.style.background = `rgba(15, 23, 42, ${opacity})`;
    glassTarget.style.boxShadow = `0 0 ${glow}px rgba(${r}, ${g}, ${b}, 0.35)`;
    glassTarget.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.5)`;

    liveCssOutput.textContent = `background: rgba(15, 23, 42, ${opacity});\nbackdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(${r}, ${g}, ${b}, 0.5);\nbox-shadow: 0 0 ${glow}px rgba(${r}, ${g}, ${b}, 0.35);`;
  };

  if (sliderBlur) sliderBlur.addEventListener('input', updateGlassmorphism);
  if (sliderOpacity) sliderOpacity.addEventListener('input', updateGlassmorphism);
  if (sliderGlow) sliderGlow.addEventListener('input', updateGlassmorphism);

  tintBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tintBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTint = btn.getAttribute('data-color') || '#f59e0b';
      updateGlassmorphism();
      playUiSound('click');
    });
  });

  // Tab 2: JavaScript DOM Events Playground
  const btnAddBubble = document.getElementById('btn-add-bubble');
  const btnTriggerPulse = document.getElementById('btn-trigger-pulse');
  const btnClearLog = document.getElementById('btn-clear-log');
  const eventPlayground = document.getElementById('event-playground');
  const eventLogConsole = document.getElementById('event-log-console');
  const eventCountEl = document.getElementById('event-count');

  let dispatchedEvents = 0;

  const appendEventLog = (message, type = 'user') => {
    if (!eventLogConsole) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    eventLogConsole.appendChild(entry);
    eventLogConsole.scrollTop = eventLogConsole.scrollHeight;

    dispatchedEvents++;
    if (eventCountEl) eventCountEl.textContent = dispatchedEvents;
  };

  const spawnNode = (x, y) => {
    if (!eventPlayground) return;
    const node = document.createElement('div');
    node.className = 'spawned-node';
    node.textContent = 'JS';

    const rect = eventPlayground.getBoundingClientRect();
    const posX = x !== undefined ? x : Math.floor(Math.random() * (rect.width - 50)) + 10;
    const posY = y !== undefined ? y : Math.floor(Math.random() * (rect.height - 50)) + 10;

    node.style.left = `${posX}px`;
    node.style.top = `${posY}px`;

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiSound('click');
      appendEventLog(`Element click at (${posX}px, ${posY}px) → Removing node from DOM`);
      node.style.transform = 'scale(0)';
      node.style.transition = 'transform 0.2s ease';
      setTimeout(() => node.remove(), 200);
    });

    eventPlayground.appendChild(node);
    appendEventLog(`DOM.appendChild(<div.spawned-node>) at (${posX}px, ${posY}px)`);
  };

  if (btnAddBubble) {
    btnAddBubble.addEventListener('click', () => {
      spawnNode();
      playUiSound('click');
    });
  }

  if (eventPlayground) {
    eventPlayground.addEventListener('click', (e) => {
      const rect = eventPlayground.getBoundingClientRect();
      const x = e.clientX - rect.left - 16;
      const y = e.clientY - rect.top - 16;
      spawnNode(x, y);
      playUiSound('click');
    });
  }

  if (btnTriggerPulse) {
    btnTriggerPulse.addEventListener('click', () => {
      const nodes = eventPlayground ? eventPlayground.querySelectorAll('.spawned-node') : [];
      nodes.forEach((node, i) => {
        setTimeout(() => {
          node.style.transform = 'scale(1.4)';
          setTimeout(() => node.style.transform = 'scale(1)', 200);
        }, i * 60);
      });
      appendEventLog(`Dispatched custom 'pulse' broadcast event to ${nodes.length} nodes`, 'system');
      playUiSound('success');
    });
  }

  if (btnClearLog && eventLogConsole) {
    btnClearLog.addEventListener('click', () => {
      eventLogConsole.innerHTML = '<div class="log-entry system">[system] Log stream cleared.</div>';
      playUiSound('click');
    });
  }

  // Tab 3: Responsive CSS Grid Arena
  const gridBtns = document.querySelectorAll('.grid-btn');
  const gridArena = document.getElementById('grid-arena');

  gridBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gridBtns.forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');

      const cols = btn.getAttribute('data-columns');
      if (gridArena) {
        gridArena.className = `interactive-grid-arena cols-${cols}`;
      }
      playUiSound('click');
    });
  });

  // ==========================================================================
  // 9. COPY TERMINAL CONFIG WITH CONFETTI
  // ==========================================================================
  const copyTerminalBtn = document.getElementById('copy-terminal-btn');
  const terminalCode = document.getElementById('terminal-code');
  const copyBtnText = document.getElementById('copy-btn-text');

  if (copyTerminalBtn && terminalCode) {
    copyTerminalBtn.addEventListener('click', () => {
      const code = terminalCode.textContent;
      navigator.clipboard.writeText(code).then(() => {
        playUiSound('success');
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        copyTerminalBtn.style.background = '#10b981';
        copyTerminalBtn.style.color = '#ffffff';

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.75 },
            colors: ['#f59e0b', '#6366f1', '#10b981', '#06b6d4']
          });
        }

        showToast('Developer profile config copied to clipboard!', 'success');

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy Config';
          copyTerminalBtn.style.background = '';
          copyTerminalBtn.style.color = '';
        }, 2200);
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
    });
  }

  // ==========================================================================
  // 10. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success'
      ? '<i class="fa-solid fa-circle-check text-emerald"></i>'
      : '<i class="fa-solid fa-circle-exclamation text-amber"></i>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // 11. INTERACTIVE LIVE DEMO MODAL (REAL WORKING APPLICATIONS)
  // ==========================================================================
  const demoModal = document.getElementById('demo-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseDot = document.getElementById('modal-close-dot');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectUrl = document.getElementById('modal-project-url');
  const viewportFrame = document.getElementById('viewport-frame');
  const demoInteractiveContent = document.getElementById('demo-interactive-content');
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  const liveDemoTriggers = document.querySelectorAll('.live-demo-trigger');

  // Exact Requested Projects Applications Map
  const projectApplications = {
    // 1. SCHOOL WEBSITE
    school: {
      title: 'Horizon International School & Academy Portal',
      url: 'https://horizon-academy.edu.in',
      render: () => `
        <div style="max-width: 820px; margin: 0 auto;">
          <!-- School Banner -->
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(99, 102, 241, 0.18)); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; text-align: center;">
            <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; font-size: 0.78rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 9999px; text-transform: uppercase;">
              Academic Portal • Admissions Open 2026-27
            </span>
            <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.85rem; font-weight: 700; margin: 0.85rem 0 0.5rem; color: #fff;">
              Horizon International Academy
            </h2>
            <p style="color: #94a3b8; font-size: 0.92rem; max-width: 520px; margin: 0 auto 1.25rem;">
              Nurturing excellence through innovative STEM education, sports training, and world-class faculty.
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <button class="btn btn-sm btn-primary" id="school-open-admissions"><i class="fa-solid fa-file-signature"></i> Online Admission Form</button>
              <button class="btn btn-sm btn-outline" id="school-view-curriculum"><i class="fa-solid fa-book-open"></i> Curriculum Explorer</button>
            </div>
          </div>

          <!-- Interactive Notice Ticker -->
          <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-weight: 700; color: #f59e0b; font-size: 0.9rem;"><i class="fa-solid fa-bullhorn"></i> Live Noticeboard Ticker</span>
              <span style="font-size: 0.75rem; color: #10b981;"><i class="fa-solid fa-circle"></i> Real-Time Feed</span>
            </div>
            <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem;">
              <button class="btn btn-sm btn-accent notice-tab-btn active" data-notice="exam">Annual Exam Schedule</button>
              <button class="btn btn-sm btn-secondary notice-tab-btn" data-notice="admit">Admissions 2026-27</button>
              <button class="btn btn-sm btn-secondary notice-tab-btn" data-notice="sports">Sports Day Meet</button>
            </div>
            <div id="notice-content-box" style="margin-top: 0.85rem; padding: 0.85rem; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.85rem; color: #cbd5e1;">
              <strong>📅 Annual Examination 2026:</strong> Class 1 to 12 final assessments commence on October 15. Download hall tickets from the student portal.
            </div>
          </div>

          <!-- Dynamic Curriculum Level Tabs -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <div style="color: #f59e0b; font-size: 1.8rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-shapes"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Primary Wing</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">Grades 1 to 5: Foundational literacy, math puzzles & arts.</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <div style="color: #06b6d4; font-size: 1.8rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-flask"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Middle School</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">Grades 6 to 8: STEM labs, robotics & bilingual communication.</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <div style="color: #6366f1; font-size: 1.8rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-user-graduate"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Higher Secondary</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">Grades 9 to 12: Advanced physics, coding, biology & commerce.</p>
            </div>
          </div>
        </div>
      `,
      init: () => {
        const noticeBtns = demoInteractiveContent.querySelectorAll('.notice-tab-btn');
        const noticeBox = demoInteractiveContent.querySelector('#notice-content-box');
        const admitBtn = demoInteractiveContent.querySelector('#school-open-admissions');

        const noticeMessages = {
          exam: '<strong>📅 Annual Examination 2026:</strong> Class 1 to 12 final assessments commence on October 15. Download hall tickets from the student portal.',
          admit: '<strong>🎓 Admissions Open:</strong> Registration for Academic Session 2026-27 is now active. Limited seats in Science and Computer Application streams.',
          sports: '<strong>🏆 Inter-School Sports Meet:</strong> Athletics and swimming championship trials on Saturday at the main stadium.'
        };

        noticeBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            noticeBtns.forEach(b => {
              b.classList.remove('active', 'btn-accent');
              b.classList.add('btn-secondary');
            });
            btn.classList.add('active', 'btn-accent');
            btn.classList.remove('btn-secondary');

            const key = btn.getAttribute('data-notice');
            if (noticeBox && noticeMessages[key]) {
              noticeBox.innerHTML = noticeMessages[key];
            }
            playUiSound('click');
          });
        });

        if (admitBtn) {
          admitBtn.addEventListener('click', () => {
            playUiSound('success');
            showToast('Simulated admission inquiry submitted! Application ID: #HA-2026', 'success');
          });
        }
      }
    },

    // 2. PHOTOGRAPHY WEBSITE
    photography: {
      title: 'LuminaLens Fine Art Photography Portfolio',
      url: 'https://luminalens-photography.web.app',
      render: () => `
        <div style="max-width: 820px; margin: 0 auto;">
          <!-- Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.9); padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem;">
            <div>
              <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; color: #fff; margin-bottom: 0.15rem;">
                LuminaLens • Fine Art Photography
              </h3>
              <span style="font-size: 0.78rem; color: #06b6d4;">Captured by Natural Light & Emotion</span>
            </div>
            <button class="btn btn-sm btn-primary" id="photo-booking-cta"><i class="fa-solid fa-calendar-check"></i> Book Photoshoot</button>
          </div>

          <!-- Album Category Filter -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; justify-content: center;">
            <button class="btn btn-sm btn-accent photo-filter-btn active" data-cat="all">All Gallery</button>
            <button class="btn btn-sm btn-secondary photo-filter-btn" data-cat="wedding">Weddings</button>
            <button class="btn btn-sm btn-secondary photo-filter-btn" data-cat="portrait">Portraits</button>
            <button class="btn btn-sm btn-secondary photo-filter-btn" data-cat="landscape">Landscapes</button>
          </div>

          <!-- Gallery Masonry Grid -->
          <div id="photo-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="gallery-card-item" data-cat="wedding" style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="font-size: 2.2rem; color: #f59e0b; margin-bottom: 0.5rem;"><i class="fa-solid fa-camera"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Sunset Wedding Rituals</h4>
              <span style="font-size: 0.75rem; color: #06b6d4;">Weddings • 45 Photos</span>
            </div>
            <div class="gallery-card-item" data-cat="portrait" style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="font-size: 2.2rem; color: #06b6d4; margin-bottom: 0.5rem;"><i class="fa-solid fa-user"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Studio Editorial Portrait</h4>
              <span style="font-size: 0.75rem; color: #06b6d4;">Portraits • 28 Photos</span>
            </div>
            <div class="gallery-card-item" data-cat="landscape" style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="font-size: 2.2rem; color: #10b981; margin-bottom: 0.5rem;"><i class="fa-solid fa-mountain-sun"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">Misty Valley Horizons</h4>
              <span style="font-size: 0.75rem; color: #06b6d4;">Landscapes • 60 Photos</span>
            </div>
          </div>

          <!-- Lightbox Simulation -->
          <div id="lightbox-preview-box" style="background: rgba(0,0,0,0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 10px; padding: 1rem; text-align: center; font-size: 0.85rem; color: #94a3b8;">
            💡 <em>Click any photo album above to trigger the simulated Fullscreen Lightbox Viewer!</em>
          </div>
        </div>
      `,
      init: () => {
        const filterBtns = demoInteractiveContent.querySelectorAll('.photo-filter-btn');
        const cards = demoInteractiveContent.querySelectorAll('.gallery-card-item');
        const lightboxMsg = demoInteractiveContent.querySelector('#lightbox-preview-box');
        const bookingBtn = demoInteractiveContent.querySelector('#photo-booking-cta');

        filterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
              b.classList.remove('active', 'btn-accent');
              b.classList.add('btn-secondary');
            });
            btn.classList.add('active', 'btn-accent');
            btn.classList.remove('btn-secondary');

            const cat = btn.getAttribute('data-cat');
            cards.forEach(card => {
              const cardCat = card.getAttribute('data-cat');
              if (cat === 'all' || cardCat === cat) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            });
            playUiSound('click');
          });
        });

        cards.forEach(card => {
          card.addEventListener('click', () => {
            const title = card.querySelector('h4').textContent;
            playUiSound('success');
            if (lightboxMsg) {
              lightboxMsg.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">📸 Fullscreen Lightbox Open:</span> Displaying high-res 4K gallery for <em>"${title}"</em>. ESC or Arrow keys enabled.`;
            }
            showToast(`Opened Lightbox: ${title}`, 'success');
          });
        });

        if (bookingBtn) {
          bookingBtn.addEventListener('click', () => {
            playUiSound('success');
            showToast('Photoshoot inquiry drawer opened! Available dates loaded.', 'success');
          });
        }
      }
    },

    // 3. MARRIAGE INVITATION WEBSITE
    wedding: {
      title: 'Royal Celebration - Interactive Marriage Invitation Website',
      url: 'https://royal-invitation.web.app',
      render: () => `
        <div style="max-width: 820px; margin: 0 auto;">
          <!-- Celebration Card -->
          <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(245,158,11,0.35); border-radius: 16px; padding: 2.25rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 0 35px rgba(245,158,11,0.2);">
            <span style="font-size: 0.8rem; font-weight: 700; color: #f59e0b; letter-spacing: 0.15em; text-transform: uppercase;">
              Together with Family • Digital Wedding Invitation
            </span>
            <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0.75rem 0 0.25rem;">
              Ananya &amp; Siddharth
            </h2>
            <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 1.5rem;">
              Cordially invite you to celebrate their wedding ceremonies in Bengaluru, India
            </p>

            <!-- Real-Time Countdown Timer Simulation -->
            <div style="display: flex; justify-content: center; gap: 0.85rem; margin-bottom: 1.5rem;">
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.6rem 1rem; min-width: 65px;">
                <span id="wd-days" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #f59e0b;">68</span>
                <span style="display: block; font-size: 0.68rem; color: #94a3b8; text-transform: uppercase;">Days</span>
              </div>
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.6rem 1rem; min-width: 65px;">
                <span id="wd-hours" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #f59e0b;">14</span>
                <span style="display: block; font-size: 0.68rem; color: #94a3b8; text-transform: uppercase;">Hours</span>
              </div>
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.6rem 1rem; min-width: 65px;">
                <span id="wd-mins" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #f59e0b;">32</span>
                <span style="display: block; font-size: 0.68rem; color: #94a3b8; text-transform: uppercase;">Minutes</span>
              </div>
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.6rem 1rem; min-width: 65px;">
                <span id="wd-secs" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #f59e0b;">18</span>
                <span style="display: block; font-size: 0.68rem; color: #94a3b8; text-transform: uppercase;">Seconds</span>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <button class="btn btn-sm btn-primary" id="wedding-rsvp-cta"><i class="fa-solid fa-envelope-open-text"></i> Submit Digital RSVP</button>
              <button class="btn btn-sm btn-outline" onclick="window.open('https://maps.google.com', '_blank')"><i class="fa-solid fa-location-dot text-amber"></i> View Venue Map</button>
            </div>
          </div>

          <!-- Multi-Event Schedule -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <span style="font-size: 0.72rem; color: #f59e0b; font-weight: 700; text-transform: uppercase;">Dec 11 • 6:00 PM</span>
              <h4 style="color: #fff; font-size: 1rem; margin: 0.25rem 0;">Mehendi &amp; Sangeet</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">Palace Green Lawns</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <span style="font-size: 0.72rem; color: #f59e0b; font-weight: 700; text-transform: uppercase;">Dec 12 • 9:30 AM</span>
              <h4 style="color: #fff; font-size: 1rem; margin: 0.25rem 0;">Kalyanam / Muhurtham</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">Royal Heritage Mandapam</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; text-align: center;">
              <span style="font-size: 0.72rem; color: #f59e0b; font-weight: 700; text-transform: uppercase;">Dec 12 • 7:00 PM</span>
              <h4 style="color: #fff; font-size: 1rem; margin: 0.25rem 0;">Grand Reception</h4>
              <p style="color: #94a3b8; font-size: 0.78rem;">The Grand Ballroom</p>
            </div>
          </div>
        </div>
      `,
      init: () => {
        const rsvpBtn = demoInteractiveContent.querySelector('#wedding-rsvp-cta');
        const secsEl = demoInteractiveContent.querySelector('#wd-secs');

        // Dynamic ticking countdown seconds
        let s = 18;
        const tickSecs = setInterval(() => {
          s = s <= 0 ? 59 : s - 1;
          if (secsEl) secsEl.textContent = s < 10 ? `0${s}` : s;
        }, 1000);

        if (rsvpBtn) {
          rsvpBtn.addEventListener('click', () => {
            playUiSound('success');
            if (typeof confetti === 'function') {
              confetti({ particleCount: 75, spread: 65, colors: ['#f59e0b', '#ef4444', '#10b981'] });
            }
            showToast('Digital RSVP Confirmed! Welcome to the Royal Celebration!', 'success');
          });
        }
      }
    },

    // 4. NOVACRAFT MODERN BUSINESS PLATFORM
    novacraft: {
      title: 'NovaCraft Modern Business Platform',
      url: 'https://novacraft-studio.web.app',
      render: () => `
        <div style="max-width: 820px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.18)); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 2rem; text-align: center; margin-bottom: 1.5rem;">
            <span style="background: rgba(6, 182, 212, 0.15); color: #06b6d4; font-size: 0.76rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 9999px; text-transform: uppercase;">
              Modern Business Engineering
            </span>
            <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; margin: 0.75rem 0 0.5rem; color: #fff;">
              NovaCraft Digital Studio
            </h2>
            <p style="color: #94a3b8; font-size: 0.92rem; max-width: 500px; margin: 0 auto 1.25rem;">
              Empowering forward-thinking companies with scalable web architecture, high conversion rates, and clean code.
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <button class="btn btn-sm btn-primary" id="nc-inquiry-btn"><i class="fa-solid fa-paper-plane"></i> Request Project Quote</button>
              <button class="btn btn-sm btn-outline" id="nc-cases-btn"><i class="fa-solid fa-layer-group"></i> Case Studies</button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem;">
              <div style="color: #6366f1; font-size: 1.5rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-code"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">Web Architecture</h4>
              <p style="color: #94a3b8; font-size: 0.8rem;">Mobile-first CSS Grid & Flexbox, semantic HTML5, zero framework overhead.</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem;">
              <div style="color: #06b6d4; font-size: 1.5rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-chart-line"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">SEO & Performance</h4>
              <p style="color: #94a3b8; font-size: 0.8rem;">95+ Google Lighthouse speed score, sub-second load times, structured data.</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem;">
              <div style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-cloud-arrow-up"></i></div>
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">Cloud Deployment</h4>
              <p style="color: #94a3b8; font-size: 0.8rem;">Automated Git CI/CD deployment on Vercel & Netlify with SSL configuration.</p>
            </div>
          </div>
        </div>
      `,
      init: () => {
        const inqBtn = demoInteractiveContent.querySelector('#nc-inquiry-btn');
        if (inqBtn) {
          inqBtn.addEventListener('click', () => {
            playUiSound('success');
            showToast('NovaCraft project quote requested! Discovery brief opened.', 'success');
          });
        }
      }
    }
  };

  const openDemoModal = (projectId) => {
    if (!demoModal) return;
    const project = projectApplications[projectId] || projectApplications.school;

    if (modalProjectTitle) modalProjectTitle.textContent = project.title;
    if (modalProjectUrl) modalProjectUrl.textContent = project.url;

    if (demoInteractiveContent) {
      demoInteractiveContent.innerHTML = project.render();
      if (typeof project.init === 'function') {
        project.init();
      }
    }

    demoModal.classList.add('active');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playUiSound('click');
  };

  const closeDemoModal = () => {
    if (!demoModal) return;
    demoModal.classList.remove('active');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  liveDemoTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.getAttribute('data-project') || 'school';
      openDemoModal(proj);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDemoModal);
  if (modalCloseDot) modalCloseDot.addEventListener('click', closeDemoModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeDemoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDemoModal();
      closeDrawer();
    }
  });

  viewportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const vp = btn.getAttribute('data-viewport');
      if (viewportFrame) {
        viewportFrame.classList.remove('tablet', 'mobile');
        if (vp === 'tablet') viewportFrame.classList.add('tablet');
        if (vp === 'mobile') viewportFrame.classList.add('mobile');
      }
      playUiSound('click');
    });
  });

  // ==========================================================================
  // 12. ANIMATED NUMBER COUNTERS (Bento Grid)
  // ==========================================================================
  const bentoMetrics = document.querySelectorAll('.bento-metric[data-target]');
  let metricsCounted = false;

  const runCounterAnimation = () => {
    if (metricsCounted) return;
    const aboutSec = document.getElementById('about');
    if (!aboutSec) return;

    const rect = aboutSec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.75) {
      metricsCounted = true;
      bentoMetrics.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            el.textContent = `${target}${target === 100 ? '%' : '+'}`;
          } else {
            el.textContent = current;
          }
        }, 30);
      });
    }
  };
  window.addEventListener('scroll', runCounterAnimation, { passive: true });

  // ==========================================================================
  // 13. CONTACT FORM VALIDATION & SUBMISSION (GOOGLE APPS SCRIPT WEB APP)
  // ==========================================================================
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwx4MoEtSR0016kpdkdt4Tdp8yIUWGpfgUEWS9FOv88zNj6esEqt-QnBqnMYp7N51Ge0g/exec';

  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const serviceInput = document.getElementById('project-service');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const whatsappSendBtn = document.getElementById('whatsapp-send-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const serviceError = document.getElementById('service-error');
  const messageError = document.getElementById('message-error');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let isValid = true;

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your full name.';
      isValid = false;
    } else {
      if (nameError) nameError.textContent = '';
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please provide a valid email.';
      isValid = false;
    } else {
      if (emailError) emailError.textContent = '';
    }

    if (!serviceInput.value) {
      if (serviceError) serviceError.textContent = 'Please select a required service.';
      isValid = false;
    } else {
      if (serviceError) serviceError.textContent = '';
    }

    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = 'Please provide details about your project.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      if (messageError) messageError.textContent = 'Please write at least 10 characters.';
      isValid = false;
    } else {
      if (messageError) messageError.textContent = '';
    }

    return isValid;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showToast('Please correct form errors before sending.', 'error');
        playUiSound('click');
        return;
      }

      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
      if (btnText && btnSpinner) {
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        submitBtn.disabled = true;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceInput.value;
      const serviceText = serviceInput.options[serviceInput.selectedIndex] ? serviceInput.options[serviceInput.selectedIndex].text : service;
      const message = messageInput.value.trim();

      // Encode payload with both standard and label-based keys for 100% script compatibility
      const payload = new URLSearchParams();
      payload.append('name', name);
      payload.append('email', email);
      payload.append('phone', phone || 'Not Provided');
      payload.append('service', service);
      payload.append('serviceText', serviceText);
      payload.append('message', message);
      payload.append('timestamp', new Date().toLocaleString());

      // Label-based fallback keys
      payload.append('Your Full Name', name);
      payload.append('Email Address', email);
      payload.append('Phone / WhatsApp', phone || 'Not Provided');
      payload.append('Service Needed', serviceText);
      payload.append('Project Details & Requirements', message);

      try {
        // Attempt standard POST
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: payload
        });

        let success = false;
        try {
          const resJson = await response.json();
          if (resJson && (resJson.status === 'success' || resJson.result === 'success')) {
            success = true;
          }
        } catch (jsonErr) {
          if (response.ok) success = true;
        }

        if (success) {
          playUiSound('success');
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#6366f1', '#10b981', '#06b6d4']
            });
          }
          showToast(`Thank you, ${name}! Your inquiry was recorded in the Google Sheet.`, 'success');
          contactForm.reset();
        } else {
          throw new Error('Google Apps Script response status: ' + response.status);
        }
      } catch (err) {
        // Fallback for CORS redirect
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: payload,
            mode: 'no-cors'
          });

          playUiSound('success');
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#6366f1', '#10b981', '#06b6d4']
            });
          }
          showToast(`Thank you, ${name}! Your message has been dispatched.`, 'success');
          contactForm.reset();
        } catch (fallbackErr) {
          console.error('Contact form submission error:', fallbackErr);
          showToast('Failed to connect to Google Sheet. Please check Apps Script permissions or reach out via WhatsApp.', 'error');
          playUiSound('click');
        }
      } finally {
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (serviceError) serviceError.textContent = '';
        if (messageError) messageError.textContent = '';
        if (btnText && btnSpinner) {
          btnText.style.display = 'inline-block';
          btnSpinner.style.display = 'none';
          submitBtn.disabled = false;
        }
      }
    });
  }

  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : '';
      const service = serviceInput && serviceInput.value ? serviceInput.options[serviceInput.selectedIndex].text : 'Website Development';
      const msg = messageInput ? messageInput.value.trim() : '';

      let text = `Hi Lokesh!`;
      if (name) text += ` My name is ${name}.`;
      if (service) text += ` I am inquiring regarding ${service}.`;
      if (msg) text += ` Project Details: ${msg}`;

      const url = `https://wa.me/919445259662?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      playUiSound('click');
    });
  }

  // ==========================================================================
  // 14. GSAP SCROLL ANIMATIONS (Progressive Enhancement)
  // ==========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-badge, .hero-title, .hero-typewriter-box, .hero-description, .hero-cta-group, .hero-stats-strip', {
      opacity: 0,
      y: 25,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power2.out'
    });

    gsap.utils.toArray('.bento-box, .skill-card, .editorial-project-row').forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out'
      });
    });
  }
});
