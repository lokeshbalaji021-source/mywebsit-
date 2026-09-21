/**
 * Three.js 3D Interactive Developer Avatar
 * Developed for Lokesh Balaji's Portfolio
 */

(function() {
  'use strict';

  let scene, camera, renderer;
  let avatarGroup, headGroup, visorMesh, visorMaterial, boomMicLed;
  let techRing1, techRing2, particles;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isSpeaking = false;
  let clock;

  const container = document.getElementById('avatar3dCanvas');
  if (!container) return;

  function init() {
    // 1. Scene setup
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x4f46e5, 2.2); // Indigo key
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0891b2, 2.8); // Cyan rim
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    const purpleLight = new THREE.PointLight(0x9333ea, 1.8, 10);
    purpleLight.position.set(0, -3, 3);
    scene.add(purpleLight);

    // 5. Build 3D Avatar Structure
    avatarGroup = new THREE.Group();
    headGroup = new THREE.Group();

    createDeveloperAvatar();
    createTechHalos();
    createCyberParticles();

    avatarGroup.add(headGroup);
    scene.add(avatarGroup);

    // Slight initial tilt
    headGroup.position.y = 0.2;

    // 6. Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onAvatarClick);

    // 7. Start Animation Loop
    animate();
  }

  function createDeveloperAvatar() {
    // Materials
    const helmetMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a, // Deep obsidian slate
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3
    });

    // Helmet / Head Base
    const headGeom = new THREE.SphereGeometry(1.2, 32, 32);
    headGeom.scale(1, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeom, helmetMat);
    headGroup.add(headMesh);

    // Visor Material (Glowing Interactive Neon Visor)
    const visorCanvas = document.createElement('canvas');
    visorCanvas.width = 512;
    visorCanvas.height = 256;
    const visorCtx = visorCanvas.getContext('2d');
    
    // Draw initial expressive visor eyes
    drawVisorEyes(visorCtx, 512, 256, 0);

    const visorTexture = new THREE.CanvasTexture(visorCanvas);
    visorMaterial = new THREE.MeshBasicMaterial({
      map: visorTexture,
      transparent: true,
      opacity: 0.95
    });

    // Visor Geometry (Front Curved Shield)
    const visorGeom = new THREE.SphereGeometry(1.22, 32, 32, 0, Math.PI, 0, Math.PI * 0.55);
    visorGeom.rotateY(-Math.PI / 2);
    visorGeom.rotateX(Math.PI / 2);
    visorGeom.scale(0.9, 0.75, 0.95);
    visorMesh = new THREE.Mesh(visorGeom, visorMaterial);
    visorMesh.position.set(0, 0.12, 0.28);
    headGroup.add(visorMesh);

    // Store canvas and context for animation updates
    visorMesh.userData = { canvas: visorCanvas, ctx: visorCtx, texture: visorTexture, blinkTimer: 0 };

    // Developer Over-Ear Headset Band
    const bandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, -0.05, 0),
      new THREE.Vector3(-1.1, 1.35, 0),
      new THREE.Vector3(0, 1.55, 0),
      new THREE.Vector3(1.1, 1.35, 0),
      new THREE.Vector3(1.3, -0.05, 0)
    ]);
    const bandGeom = new THREE.TubeGeometry(bandCurve, 32, 0.08, 12, false);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const bandMesh = new THREE.Mesh(bandGeom, bandMat);
    headGroup.add(bandMesh);

    // Headset Ear Cups (Left & Right)
    const cupGeom = new THREE.CylinderGeometry(0.38, 0.42, 0.25, 24);
    cupGeom.rotateZ(Math.PI / 2);

    const leftCup = new THREE.Mesh(cupGeom, helmetMat);
    leftCup.position.set(-1.24, 0.05, 0);
    headGroup.add(leftCup);

    const rightCup = new THREE.Mesh(cupGeom, helmetMat);
    rightCup.position.set(1.24, 0.05, 0);
    headGroup.add(rightCup);

    // Glowing Neon Rings on Earcup
    const ringGeom = new THREE.TorusGeometry(0.3, 0.03, 16, 32);
    ringGeom.rotateY(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const leftRing = new THREE.Mesh(ringGeom, ringMat);
    leftRing.position.set(-1.38, 0.05, 0);
    headGroup.add(leftRing);

    const rightRing = new THREE.Mesh(ringGeom, ringMat);
    rightRing.position.set(1.38, 0.05, 0);
    headGroup.add(rightRing);

    // Boom Microphone attached to headset
    const boomCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.26, 0.05, 0),
      new THREE.Vector3(-1.2, -0.4, 0.6),
      new THREE.Vector3(-0.6, -0.65, 1.1),
      new THREE.Vector3(-0.1, -0.62, 1.25)
    ]);
    const boomGeom = new THREE.TubeGeometry(boomCurve, 24, 0.03, 8, false);
    const boomMesh = new THREE.Mesh(boomGeom, bandMat);
    headGroup.add(boomMesh);

    // Microphone Tip
    const micTipGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16);
    micTipGeom.rotateZ(Math.PI / 3);
    const micTipMesh = new THREE.Mesh(micTipGeom, helmetMat);
    micTipMesh.position.set(-0.1, -0.62, 1.25);
    headGroup.add(micTipMesh);

    // Live Mic Tip LED
    const ledGeom = new THREE.SphereGeometry(0.045, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    boomMicLed = new THREE.Mesh(ledGeom, ledMat);
    boomMicLed.position.set(-0.02, -0.6, 1.34);
    headGroup.add(boomMicLed);

    // Neck / Tech Collar Support
    const neckGeom = new THREE.CylinderGeometry(0.48, 0.62, 0.7, 24);
    const neckMesh = new THREE.Mesh(neckGeom, accentMat);
    neckMesh.position.set(0, -1.2, 0);
    headGroup.add(neckMesh);

    // Shoulders base
    const shoulderGeom = new THREE.CylinderGeometry(1.6, 1.9, 0.65, 32, 1, false, 0, Math.PI);
    shoulderGeom.rotateX(Math.PI);
    const shoulderMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.8,
      roughness: 0.3
    });
    const shoulderMesh = new THREE.Mesh(shoulderGeom, shoulderMat);
    shoulderMesh.position.set(0, -1.5, 0.1);
    headGroup.add(shoulderMesh);

    // Cyber Jacket Accents (Glowing Stripes)
    const stripeGeom = new THREE.TorusGeometry(1.52, 0.025, 8, 32, Math.PI * 0.75);
    stripeGeom.rotateX(-Math.PI / 4);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const stripeMesh = new THREE.Mesh(stripeGeom, stripeMat);
    stripeMesh.position.set(0, -1.45, 0.15);
    headGroup.add(stripeMesh);
  }

  function drawVisorEyes(ctx, width, height, frameOffset) {
    ctx.clearRect(0, 0, width, height);

    // Visor dark glow backdrop
    const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width / 2);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    grad.addColorStop(1, 'rgba(7, 9, 14, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Left and Right Eye coordinates
    const eyeY = height * 0.52;
    const leftEyeX = width * 0.36;
    const rightEyeX = width * 0.64;

    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;

    if (isSpeaking) {
      // Audio Waveform expression on visor when talking!
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      for (let x = width * 0.2; x <= width * 0.8; x += 10) {
        const wave = Math.sin((x * 0.05) + frameOffset * 0.15) * 22;
        if (x === width * 0.2) ctx.moveTo(x, eyeY + wave);
        else ctx.lineTo(x, eyeY + wave);
      }
      ctx.stroke();

      // Digital sound dots
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(width * 0.28 + i * 45, eyeY - 35, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Friendly high-tech digital cyan eyes
      const eyeWidth = 52;
      const eyeHeight = 28;

      // Left Eye Pill
      ctx.beginPath();
      ctx.roundRect(leftEyeX - eyeWidth / 2, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, 14);
      ctx.fill();

      // Right Eye Pill
      ctx.beginPath();
      ctx.roundRect(rightEyeX - eyeWidth / 2, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, 14);
      ctx.fill();

      // Small pupil reflection glints
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(leftEyeX + 10, eyeY - 5, 5, 0, Math.PI * 2);
      ctx.arc(rightEyeX + 10, eyeY - 5, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createTechHalos() {
    // Outer floating holographic orbital rings
    const ring1Geom = new THREE.TorusGeometry(2.3, 0.02, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.65
    });
    techRing1 = new THREE.Mesh(ring1Geom, ring1Mat);
    techRing1.rotation.x = Math.PI / 3;
    avatarGroup.add(techRing1);

    const ring2Geom = new THREE.TorusGeometry(2.7, 0.015, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      transparent: true,
      opacity: 0.55
    });
    techRing2 = new THREE.Mesh(ring2Geom, ring2Mat);
    techRing2.rotation.x = -Math.PI / 4;
    techRing2.rotation.y = Math.PI / 6;
    avatarGroup.add(techRing2);
  }

  function createCyberParticles() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x4338ca);
    const color2 = new THREE.Color(0x0284c7);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const mixed = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function onMouseMove(event) {
    // Calculate normalized mouse coordinates (-1 to 1)
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    // Limit head tilt angles for natural human/robot motion
    targetRotationY = Math.max(-0.65, Math.min(0.65, x * 0.7));
    targetRotationX = Math.max(-0.4, Math.min(0.4, y * 0.5));
  }

  function onAvatarClick() {
    // Gentle nod / greeting bounce animation when clicked
    if (window.gsap) {
      window.gsap.to(headGroup.position, {
        y: 0.45,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
      window.gsap.to(headGroup.rotation, {
        z: 0.08,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }

    // Trigger voice greeting if not currently speaking
    if (window.AudioMicManager && !window.AudioMicManager.isIntroPlaying) {
      window.AudioMicManager.playVoiceGreeting();
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Smooth lerp head rotation towards mouse cursor
    headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.07;
    headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.07;

    // 2. Gentle natural breathing float
    headGroup.position.y = 0.2 + Math.sin(elapsedTime * 1.8) * 0.06;

    // 3. Rotate holographic halos
    if (techRing1) {
      techRing1.rotation.z += 0.006;
      techRing1.rotation.y += 0.003;
    }
    if (techRing2) {
      techRing2.rotation.z -= 0.008;
      techRing2.rotation.x += 0.004;
    }

    // 4. Subtle particles slow drift
    if (particles) {
      particles.rotation.y = elapsedTime * 0.02;
    }

    // 5. Visor Screen Updates (Eye blinking & Speech waveforms)
    if (visorMesh && visorMesh.userData) {
      const uData = visorMesh.userData;
      uData.blinkTimer += delta;

      // Update visor display every few frames
      drawVisorEyes(uData.ctx, uData.canvas.width, uData.canvas.height, elapsedTime * 60);
      uData.texture.needsUpdate = true;
    }

    // 6. Pulse Boom Mic LED
    if (boomMicLed) {
      if (isSpeaking) {
        const pulse = 0.5 + Math.sin(elapsedTime * 12) * 0.5;
        boomMicLed.material.color.setRGB(pulse, 0.9, 0.3);
      } else {
        boomMicLed.material.color.setHex(0x10b981);
      }
    }

    renderer.render(scene, camera);
  }

  // Public Avatar Interface
  window.Avatar3D = {
    setSpeaking: function(speaking) {
      isSpeaking = !!speaking;
    },
    waveGreeting: function() {
      onAvatarClick();
    }
  };

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
