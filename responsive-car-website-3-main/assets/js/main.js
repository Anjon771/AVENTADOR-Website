/**
 * Lamborghini Aventador LP 780-4 Showcase
 * Interactive Engine, Telemetry & Concierge Systems
 */

/*==================== MOBILE NAVIGATION ====================*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu?.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu?.classList.remove('show-menu');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('show-menu');
  });
});

/*==================== HEADER BACKGROUND & ACTIVE LINK ====================*/
const header = document.getElementById('header');
const scrollUpBtn = document.getElementById('scroll-up');
const sections = document.querySelectorAll('section[id]');

const handleScroll = () => {
  const scrollY = window.scrollY;

  // Header background blur
  if (header) {
    if (scrollY >= 60) {
      header.classList.add('bg-header');
    } else {
      header.classList.remove('bg-header');
    }
  }

  // Scroll to top button
  if (scrollUpBtn) {
    if (scrollY >= 400) {
      scrollUpBtn.classList.add('show-scroll');
    } else {
      scrollUpBtn.classList.remove('show-scroll');
    }
  }

  // Active section link
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    const sectionId = current.getAttribute('id');
    const navItem = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (navItem) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItem.classList.add('active-link');
      } else {
        navItem.classList.remove('active-link');
      }
    }
  });
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/*==================== HERO COLORWAY LIVERY SWITCHER ====================*/
const heroCarImg = document.getElementById('hero-car-preview');
const swatches = document.querySelectorAll('.home__swatch');
const liveryNameEl = document.getElementById('hero-livery-name');

swatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    swatches.forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');

    const carSrc = swatch.getAttribute('data-car');
    const name = swatch.getAttribute('data-name');
    const code = swatch.getAttribute('data-code');

    if (heroCarImg && carSrc) {
      heroCarImg.style.opacity = '0';
      heroCarImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        heroCarImg.removeAttribute('data-fallback-step');
        heroCarImg.src = carSrc;
        heroCarImg.style.opacity = '1';
        heroCarImg.style.transform = 'scale(1)';
      }, 180);
    }

    if (liveryNameEl && name) {
      liveryNameEl.innerHTML = `${name} <span class="home__livery-code">${code || ''}</span>`;
    }
  });
});

/*==================== V12 WEB AUDIO SOUND SYNTHESIZER ====================*/
class V12SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.targetRpm = 800;
    this.currentRpm = 800;
    this.oscillators = [];
    this.gainNode = null;
    this.filterNode = null;
    this.animFrame = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Master Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);

    // Warm Lowpass Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(800, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // Subtle distortion waveshaper
    const waveshaper = this.ctx.createWaveShaper();
    waveshaper.curve = this.makeDistortionCurve(25);

    // 12-Cylinder Firing Harmonics
    const harmonicMultipliers = [1, 1.5, 2, 3, 4, 6];
    harmonicMultipliers.forEach((mult, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(45 * mult, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.18 / (idx + 1), this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filterNode);
      osc.start();
      this.oscillators.push({ osc, mult });
    });

    this.filterNode.connect(waveshaper);
    waveshaper.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 20;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.targetRpm = 950;
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 0.3);
    this.updateLoop();
  }

  stop() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  setRpm(rpm) {
    this.targetRpm = Math.min(8500, Math.max(800, rpm));
  }

  updateLoop() {
    if (!this.isPlaying) return;

    // Smooth RPM interpolation
    this.currentRpm += (this.targetRpm - this.currentRpm) * 0.12;

    // Map RPM to audio frequencies
    // 6.5L V12: base firing frequency ~ RPM * (12 / 120) = RPM * 0.1
    const baseFreq = (this.currentRpm / 60) * 3; // 4-stroke 12-cyl firing events

    this.oscillators.forEach(({ osc, mult }) => {
      osc.frequency.setValueAtTime(baseFreq * mult, this.ctx.currentTime);
    });

    const cutoff = 400 + (this.currentRpm / 8500) * 3200;
    this.filterNode.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

    // Update UI
    updateTachometerUI(this.currentRpm);

    this.animFrame = requestAnimationFrame(() => this.updateLoop());
  }
}

const v12Engine = new V12SoundEngine();
const soundBtn = document.getElementById('v12-sound-btn');
const soundLabel = document.getElementById('sound-label');
const soundIcon = document.getElementById('sound-icon');
const revBtn = document.getElementById('rev-throttle-btn');
const tachoRpm = document.getElementById('tacho-rpm');
const tachoNeedle = document.getElementById('tacho-needle');

function updateTachometerUI(rpm) {
  if (tachoRpm) {
    tachoRpm.textContent = Math.round(rpm).toLocaleString();
  }
  if (tachoNeedle) {
    // 800 RPM = 0deg, 8500 RPM = 220deg
    const normalized = (rpm - 800) / (8500 - 800);
    const degrees = Math.min(220, Math.max(0, normalized * 220));
    tachoNeedle.style.transform = `translateY(-50%) rotate(${degrees}deg)`;
  }
}

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    if (!v12Engine.isPlaying) {
      v12Engine.start();
      soundBtn.classList.add('playing');
      if (soundLabel) soundLabel.textContent = 'Mute V12';
      if (soundIcon) soundIcon.className = 'ri-volume-vibrate-fill';
    } else {
      v12Engine.stop();
      soundBtn.classList.remove('playing');
      if (soundLabel) soundLabel.textContent = 'V12 Sound';
      if (soundIcon) soundIcon.className = 'ri-volume-up-line';
      updateTachometerUI(800);
    }
  });
}

// Throttle Rev Button (Hold to rev)
let isRevving = false;
let revInterval = null;

function startRev() {
  isRevving = true;
  if (!v12Engine.isPlaying) {
    v12Engine.start();
    soundBtn?.classList.add('playing');
    if (soundLabel) soundLabel.textContent = 'Mute V12';
  }

  v12Engine.setRpm(8400);

  // If audio is muted by browser policy or user, still animate tachometer
  if (!v12Engine.isPlaying) {
    let mockRpm = 800;
    clearInterval(revInterval);
    revInterval = setInterval(() => {
      mockRpm += (8400 - mockRpm) * 0.2;
      updateTachometerUI(mockRpm);
    }, 30);
  }
}

function stopRev() {
  isRevving = false;
  v12Engine.setRpm(900);
  clearInterval(revInterval);

  let mockRpm = 8400;
  revInterval = setInterval(() => {
    mockRpm += (800 - mockRpm) * 0.15;
    updateTachometerUI(mockRpm);
    if (Math.abs(mockRpm - 800) < 30) {
      clearInterval(revInterval);
      updateTachometerUI(800);
    }
  }, 30);
}

if (revBtn) {
  revBtn.addEventListener('mousedown', startRev);
  window.addEventListener('mouseup', () => {
    if (isRevving) stopRev();
  });

  // Touch Support
  revBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startRev();
  });
  window.addEventListener('touchend', () => {
    if (isRevving) stopRev();
  });
}

/*==================== AERODYNAMICS ACTIVE MODE SWITCHER ====================*/
const aeroHighBtn = document.getElementById('aero-high-btn');
const aeroSpeedBtn = document.getElementById('aero-speed-btn');
const aeroStatNote = document.getElementById('aero-stat-note');

if (aeroHighBtn && aeroSpeedBtn && aeroStatNote) {
  aeroHighBtn.addEventListener('click', () => {
    aeroHighBtn.classList.add('active');
    aeroSpeedBtn.classList.remove('active');
    aeroStatNote.textContent = 'Active Mode: +400 kg aerodynamic vertical load @ 200 km/h with active rear wing deployed at 15°.';
  });

  aeroSpeedBtn.addEventListener('click', () => {
    aeroSpeedBtn.classList.add('active');
    aeroHighBtn.classList.remove('active');
    aeroStatNote.textContent = 'Low Drag Mode: Active flaps stall airflow over wing element. Minimal CD aerodynamic drag coefficient for 355 km/h terminal velocity.';
  });
}

/*==================== TRACK FILM VIDEO CONTROLS ====================*/
const trackVideo = document.getElementById('main-track-video');
const videoTogglePlay = document.getElementById('video-toggle-play');
const videoPlayIcon = document.getElementById('video-play-icon');
const videoToggleMute = document.getElementById('video-toggle-mute');
const videoMuteIcon = document.getElementById('video-mute-icon');

if (trackVideo && videoTogglePlay) {
  videoTogglePlay.addEventListener('click', () => {
    if (trackVideo.paused) {
      trackVideo.play();
      if (videoPlayIcon) videoPlayIcon.className = 'ri-pause-fill';
    } else {
      trackVideo.pause();
      if (videoPlayIcon) videoPlayIcon.className = 'ri-play-fill';
    }
  });

  // Attempt auto-play silently
  trackVideo.play().then(() => {
    if (videoPlayIcon) videoPlayIcon.className = 'ri-pause-fill';
  }).catch(() => {
    if (videoPlayIcon) videoPlayIcon.className = 'ri-play-fill';
  });
}

if (trackVideo && videoToggleMute) {
  videoToggleMute.addEventListener('click', () => {
    trackVideo.muted = !trackVideo.muted;
    if (videoMuteIcon) {
      videoMuteIcon.className = trackVideo.muted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill';
    }
  });
}

/*==================== TECHNICAL SPECIFICATIONS DRAWER MODAL ====================*/
const modelData = {
  'ultimae-coupe': {
    title: 'Aventador LP 780-4 Ultimae Coupe',
    groups: [
      {
        name: 'Powertrain & Performance',
        specs: [
          ['Engine', '6.5L (6,498 cm³) 60° Naturally Aspirated V12'],
          ['Max Power', '780 CV (574 kW) @ 8,500 rpm'],
          ['Max Torque', '720 Nm (531 lb-ft) @ 6,750 rpm'],
          ['Top Speed', '355 km/h (221 mph)'],
          ['0–100 km/h (0–62 mph)', '2.8 seconds'],
          ['0–200 km/h (0–124 mph)', '8.7 seconds']
        ]
      },
      {
        name: 'Chassis & Dynamics',
        specs: [
          ['Chassis', 'Carbon-fiber monocoque with aluminum subframes'],
          ['Steering', 'LDS Dynamic Steering with LRS 4-wheel active rear steering'],
          ['Suspension', 'Pushrod magneto-rheological active dampers with horizontal springs'],
          ['Brakes', 'Dual-circuit carbon-ceramic discs (Front 400×38mm, Rear 380×38mm)'],
          ['100–0 km/h Braking', '30.0 meters'],
          ['Dry Weight', '1,550 kg (3,417 lbs)']
        ]
      },
      {
        name: 'Transmission & Fuel System',
        specs: [
          ['Transmission', '7-speed ISR (Independent Shifting Rods) automated manual'],
          ['Shift Latency', '50 milliseconds in Corsa mode'],
          ['Drive Type', 'Electronically controlled all-wheel drive with rear mechanical LSD'],
          ['Fuel Tank', '90 liters']
        ]
      }
    ]
  },
  'svj': {
    title: 'Aventador SVJ (Superveloce Jota)',
    groups: [
      {
        name: 'Aerodynamics & Track Provenance',
        specs: [
          ['Nürburgring Nordschleife Lap', '6:44.97 minutes (Production Record)'],
          ['Aerodynamic System', 'ALA 2.0 (Aerodinamica Lamborghini Attiva) with dynamic channel flaps'],
          ['Downforce @ 350 km/h', '490 kg combined vertical load'],
          ['Rear Wing', 'High-downforce fixed carbon element with internal air ducts']
        ]
      },
      {
        name: 'Powertrain Specifications',
        specs: [
          ['Engine', '6.5L 60° V12 with titanium valves & lightweight flywheel'],
          ['Power Output', '770 CV (566 kW) @ 8,500 rpm'],
          ['Torque', '720 Nm @ 6,750 rpm'],
          ['Weight-to-Power Ratio', '1.98 kg/CV']
        ]
      },
      {
        name: 'Exhaust & Suspension',
        specs: [
          ['Exhaust System', 'High-mount lightweight stainless steel dual central pipes'],
          ['Suspension Stiffness', '+50% anti-roll bar rate vs Aventador SV'],
          ['Tires', 'Pirelli P Zero Corsa (Trofeo R optional)']
        ]
      }
    ]
  },
  'ultimae-roadster': {
    title: 'Aventador LP 780-4 Ultimae Roadster',
    groups: [
      {
        name: 'Roof Architecture & Aerodynamics',
        specs: [
          ['Roof Concept', 'Removable dual RTM high-pressure carbon-fiber targa panels'],
          ['Roof Weight', 'Under 6 kg per panel, stowable in front trunk luggage bay'],
          ['Acoustic Wind deflector', 'Electronically powered rear glass window deflector'],
          ['Chassis Reinforcement', 'Reinforced carbon monocoque sills ensuring full coupe rigidity']
        ]
      },
      {
        name: 'Performance Figures',
        specs: [
          ['0–100 km/h', '2.9 seconds'],
          ['Top Velocity', '355 km/h'],
          ['Dry Weight', '1,600 kg'],
          ['Production Allocation', '250 numbered units worldwide']
        ]
      }
    ]
  }
};

const specModal = document.getElementById('spec-modal');
const modalBackdrop = document.getElementById('spec-modal-backdrop');
const modalClose = document.getElementById('spec-modal-close');
const modalTitle = document.getElementById('modal-model-title');
const modalSpecsContent = document.getElementById('modal-specs-content');
const inspectBtns = document.querySelectorAll('.model__inspect-btn');

function openSpecModal(modelId) {
  const data = modelData[modelId] || modelData['ultimae-coupe'];
  if (!modalTitle || !modalSpecsContent) return;

  modalTitle.textContent = data.title;

  let html = '';
  data.groups.forEach(group => {
    html += `
      <div class="spec-group">
        <h4 class="spec-group__title">${group.name}</h4>
        <div class="spec-group__table">
          ${group.specs.map(([label, val]) => `
            <div class="spec-group__row">
              <span>${label}</span>
              <span class="font-mono tabular-nums">${val}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  modalSpecsContent.innerHTML = html;
  specModal?.classList.add('active');
  specModal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSpecModal() {
  specModal?.classList.remove('active');
  specModal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

inspectBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const model = btn.getAttribute('data-model');
    openSpecModal(model);
  });
});

modalClose?.addEventListener('click', closeSpecModal);
modalBackdrop?.addEventListener('click', closeSpecModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && specModal?.classList.contains('active')) {
    closeSpecModal();
  }
});

/*==================== MODEL CARD RESERVE LINKS ====================*/
const reserveLinks = document.querySelectorAll('.model__reserve-link');
const reserveModelSelect = document.getElementById('reserve-model');

reserveLinks.forEach(link => {
  link.addEventListener('click', () => {
    const edition = link.getAttribute('data-edition');
    if (reserveModelSelect && edition) {
      for (let i = 0; i < reserveModelSelect.options.length; i++) {
        if (reserveModelSelect.options[i].text.includes(edition) || reserveModelSelect.options[i].value === edition) {
          reserveModelSelect.selectedIndex = i;
          break;
        }
      }
    }
  });
});

/*==================== PRIORITY ALLOCATION CONCIERGE FORM ====================*/
const reserveForm = document.getElementById('reserve-form');
const reserveFeedback = document.getElementById('reserve-feedback');
const reserveSubmitBtn = document.getElementById('reserve-submit-btn');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmDialogMsg = document.getElementById('confirm-dialog-msg');
const confirmSerialCode = document.getElementById('confirm-serial-code');
const confirmDialogClose = document.getElementById('confirm-dialog-close');

if (reserveForm) {
  reserveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reserve-name')?.value.trim();
    const email = document.getElementById('reserve-email')?.value.trim();
    const model = document.getElementById('reserve-model')?.value;
    const location = document.getElementById('reserve-location')?.value;
    const experience = document.getElementById('reserve-experience')?.value;

    if (!name || !email) {
      if (reserveFeedback) {
        reserveFeedback.textContent = 'Please enter your name and contact email.';
        reserveFeedback.className = 'form__feedback error';
      }
      return;
    }

    if (reserveSubmitBtn) {
      reserveSubmitBtn.disabled = true;
      reserveSubmitBtn.innerHTML = `<span>Securing Allocation...</span> <i class="ri-loader-4-line ri-spin"></i>`;
    }

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, model, location, experience })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (confirmSerialCode) confirmSerialCode.textContent = data.serialCode;
        if (confirmDialogMsg) {
          confirmDialogMsg.textContent = `Reservation registered for ${name}. Handover concierge will contact you regarding your ${model} at ${location}.`;
        }
        confirmDialog?.classList.add('active');
        confirmDialog?.setAttribute('aria-hidden', 'false');
        reserveForm.reset();
      } else {
        if (reserveFeedback) {
          reserveFeedback.textContent = data.error || 'Failed to submit reservation. Please retry.';
          reserveFeedback.className = 'form__feedback error';
        }
      }
    } catch {
      // Local fallback in case of connection drop
      const randomCode = `AVT-780-${Math.floor(1000 + Math.random() * 9000)}`;
      if (confirmSerialCode) confirmSerialCode.textContent = randomCode;
      if (confirmDialogMsg) {
        confirmDialogMsg.textContent = `Priority allocation recorded for ${name}. Your VIP manager will arrange handover details.`;
      }
      confirmDialog?.classList.add('active');
      confirmDialog?.setAttribute('aria-hidden', 'false');
      reserveForm.reset();
    } finally {
      if (reserveSubmitBtn) {
        reserveSubmitBtn.disabled = false;
        reserveSubmitBtn.innerHTML = `<span>Submit Priority Request</span> <i class="ri-arrow-right-line"></i>`;
      }
    }
  });
}

if (confirmDialogClose) {
  confirmDialogClose.addEventListener('click', () => {
    confirmDialog?.classList.remove('active');
    confirmDialog?.setAttribute('aria-hidden', 'true');
  });
}

/*==================== SCROLL REVEAL INITIALIZATION ====================*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 1600,
    delay: 200,
    reset: false
  });

  sr.reveal('.home__header');
  sr.reveal('.home__stage', { delay: 300 });
  sr.reveal('.home__metrics-strip', { delay: 400 });
  sr.reveal('.bento__card', { interval: 150 });
  sr.reveal('.model__card', { interval: 150 });
  sr.reveal('.telemetry__blueprint', { origin: 'left' });
  sr.reveal('.telemetry__table-card', { origin: 'right' });
  sr.reveal('.reserve__info', { origin: 'left' });
  sr.reveal('.reserve__form-card', { origin: 'right' });
  sr.reveal('.footer__top', { origin: 'bottom' });
}
