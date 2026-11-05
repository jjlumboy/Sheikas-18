// ====================================================================
// 18th Birthday Debut Invitation Web Application Logic
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initBackgroundMusic();
  loadEntourageData();
  initRsvpForm();
});

// --------------------------------------------------------------------
// 1. LIVE COUNTDOWN TIMER (November 14, 2026 6:00:00 PM)
// Standard 12-hour formatting
// --------------------------------------------------------------------
function initCountdownTimer() {
  const targetDate = new Date('November 14, 2026 6:00:00 PM').getTime();
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  const bannerEl = document.getElementById('timer-started-banner');
  const gridEl = document.getElementById('countdown-grid');

  function update() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (gridEl) gridEl.style.display = 'none';
      if (bannerEl) bannerEl.style.display = 'block';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// --------------------------------------------------------------------
// 2. BACKGROUND MUSIC & FLOATING VINYL TOGGLE
// Satisfies mobile browser autoplay policy via first touch/click anywhere
// --------------------------------------------------------------------
let audioPlaying = false;

function initBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  const vinylBtn = document.getElementById('vinyl-disc-btn');
  const musicPill = document.getElementById('music-pill');
  const musicLabel = document.getElementById('music-label');

  if (!audio || !vinylBtn) return;

  function updateAudioState(isPlaying) {
    audioPlaying = isPlaying;
    if (isPlaying) {
      vinylBtn.classList.add('spinning');
      if (musicLabel) musicLabel.textContent = 'Playing';
      if (musicPill) musicPill.style.opacity = '1';
    } else {
      vinylBtn.classList.remove('spinning');
      if (musicLabel) musicLabel.textContent = 'Paused';
    }
  }

  function playMusic() {
    audio.play().then(() => {
      updateAudioState(true);
    }).catch(err => {
      console.log('[Audio Autoplay Notice] Waiting for user interaction:', err.message);
    });
  }

  function pauseMusic() {
    audio.pause();
    updateAudioState(false);
  }

  // Floating Vinyl Button Toggle
  vinylBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Mobile First-Tap / Click Autoplay handler
  function handleFirstInteraction() {
    if (audio.paused && !audioPlaying) {
      playMusic();
    }
    // Remove listeners once triggered
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('pointerdown', handleFirstInteraction);
  }

  window.addEventListener('click', handleFirstInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
  window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
}

// --------------------------------------------------------------------
// 3. COLLAPSIBLE ACCORDIONS & ENTOURAGE DATA (4 Categories x 18 Lines)
// --------------------------------------------------------------------
async function loadEntourageData() {
  try {
    const res = await fetch('entourage.json');
    const data = await res.json();

    const roses = (data.roses && data.roses.length) ? data.roses : getRosesListObjects();
    const gifts = (data.gifts && data.gifts.length) ? data.gifts : getGiftsListObjects();
    const bills = (data.bills && data.bills.length) ? data.bills : getBillsListObjects();
    const shots = (data.shots && data.shots.length) ? data.shots : getShotsListObjects();

    renderAccordionList('roses-list', roses, '🌹 18 Roses & Dances');
    renderAccordionList('gifts-list', gifts, '🕯️ 18 Gifts');
    renderAccordionList('bills-list', bills, '💵 18 Bills');
    renderAccordionList('shots-list', shots, '🥃 18 Shots');
  } catch (err) {
    console.warn('[Entourage] Could not fetch entourage.json, generating from script arrays', err);
    generateFallbackEntourage();
  }

  // Setup accordion toggle listeners
  setupAccordionInteractions();
}

function getRosesListObjects() {
  const list = (typeof rosesList !== 'undefined' && rosesList.length) ? rosesList : [
    "Prince Abel Misa", "Zhion Ardaniel", "Karl Chester Lucas", 
    "Rey Mendoza", "Jozhua Neal Dizon", "Anthony Tabucol", "Nico Jambalos", "Karl Simon Flores", 
    "Sebastian Rafael Milan", "Rafael Pagasartonga", "Zhangie Rey Sevilla", "Vj Vicencio", 
    "Wesley Hamos", "Jonar Pillas", "Freence Jhernee Mejos", "Ahmad Walter Lumboy", 
    "Zimran Keefe Shafir Ardaniel", "Jhon Walter Lumboy"
  ];

  return list.map((name, i) => ({
    order: i + 1,
    name: name,
    role: i === 0 ? 'First Dance' : (i === list.length - 1 ? 'Last Dance' : 'Rose & Dance')
  }));
}

function getGiftsListObjects() {
  const list = (typeof giftsList !== 'undefined' && giftsList.length) ? giftsList : [
    "Alira Chanelle Lumboy", "Abegail Joice Pillas", "Leira Jane Encila", "Alyza Monique Platilla", 
    "Kaycee Licono", "Jaztien Rain Soriano", "Jhena Leoligao", "Ma. Cristina Barreto", 
    "Kiaren Umipig", "Rhian Jane Petaño", "Geramie Celestra", "Sarah Jane Perdiguerra", 
    "Shairish Aramil", "Lyian Ashley Tugbang", "Rhegine Latiban", "Chellsy Marie Onilongo", 
    "Kwincy Pillas", "Florabel Misa"
  ];

  return list.map((name, i) => ({
    order: i + 1,
    name: name,
    role: 'Gift & Keepsake'
  }));
}

function getBillsListObjects() {
  const list = (typeof billsList !== 'undefined' && billsList.length) ? billsList : [
    "Ps. Enone Cerda", "Ps. Julie Villarta", "Merinel Dizon", "Aura Villaflor", 
    "Loida Fernandez", "Crisenia Mejos", "Belle Pillas", "Leiticia Hamos", 
    "Janice Pillas", "Princess Hamos", "Ira Mapula", "Jherico Guipe", 
    "Zharby Pillas", "Floyd Mejos", "Jalen Suelila", "Annaliza Gura", 
    "Sofia Naraine Onilongo", "Jhon Walter Pillas"
  ];

  return list.map((name, i) => ({
    order: i + 1,
    name: name,
    role: 'Prosperity & Blessings'
  }));
}

function getShotsListObjects() {
  const list = (typeof shotsList !== 'undefined' && shotsList.length) ? shotsList : [
    "Lhance Rain Ramos", "Leur Ali Ramos", "Raiko Renz Ramos", "Fatima Lumboy", "Denelle Dizon", 
    "Nel-Irem Dizon", "Prince Ian Cordero", "Rudy Misa", "Ruel Ramos", 
    "Duke Dimafelix", "Raymark Villador", "Nyoy Cariño", 
    "Julian Orallo", "Mark Rusell Tamiao", "Nhoa Mercado", "Jarem Sistina", 
    "Keith Reyes", "Saldy Mangampo"
  ];

  return list.map((name, i) => ({
    order: i + 1,
    name: name,
    role: 'Cheers & Toast'
  }));
}

function renderAccordionList(containerId, items, categoryTitle) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Ensure exactly 18 items are represented
  const full18 = [];
  for (let i = 1; i <= 18; i++) {
    const existing = items.find(item => item.order === i);
    full18.push(existing || { order: i, name: `[Slot ${i} Placeholder]`, role: categoryTitle.split(' ')[1] || 'Guest' });
  }

  container.innerHTML = full18.map(item => `
    <div class="entourage-item">
      <span class="entourage-num">${String(item.order).padStart(2, '0')}</span>
      <span class="entourage-name">${item.name}</span>
      <span class="entourage-role">${item.role || item.note || ''}</span>
    </div>
  `).join('');
}

function generateFallbackEntourage() {
  const build18 = (title, prefix) => Array.from({ length: 18 }, (_, i) => ({
    order: i + 1,
    name: `[${prefix} ${i + 1}]`,
    role: title
  }));

  renderAccordionList('roses-list', getRosesListObjects(), '🌹 18 Roses & Dances');
  renderAccordionList('gifts-list', getGiftsListObjects(), '🕯️ 18 Gifts');
  renderAccordionList('bills-list', getBillsListObjects(), '💵 18 Bills');
  renderAccordionList('shots-list', getShotsListObjects(), '🥃 18 Shots');
}

function setupAccordionInteractions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const group = this.closest('.accordion-group');
      const body = group.querySelector('.accordion-body');
      const isOpen = group.classList.contains('open');

      // Close all other accordions for a neat mobile accordion experience
      document.querySelectorAll('.accordion-group').forEach(otherGroup => {
        if (otherGroup !== group) {
          otherGroup.classList.remove('open');
          const otherBody = otherGroup.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isOpen) {
        group.classList.remove('open');
        body.style.maxHeight = null;
      } else {
        group.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

// Check if guest name matches any entourage role
function getEntourageMatch(nameInput) {
  if (!nameInput) return null;
  const clean = nameInput.trim().toLowerCase();

  const isMatch = (list) => {
    if (!Array.isArray(list)) return false;
    return list.some(entry => {
      const entryName = (typeof entry === 'string') ? entry : (entry && entry.name ? entry.name : '');
      return entryName.trim().toLowerCase() === clean;
    });
  };

  const matchedRoles = [];
  const rList = (typeof rosesList !== 'undefined' && rosesList.length) ? rosesList : (window.rosesList || []);
  const gList = (typeof giftsList !== 'undefined' && giftsList.length) ? giftsList : (window.giftsList || []);
  const bList = (typeof billsList !== 'undefined' && billsList.length) ? billsList : (window.billsList || []);
  const sList = (typeof shotsList !== 'undefined' && shotsList.length) ? shotsList : (window.shotsList || []);

  if (isMatch(rList)) matchedRoles.push("18 Roses & Dances 🌹");
  if (isMatch(gList)) matchedRoles.push("18 Gifts 🕯️");
  if (isMatch(bList)) matchedRoles.push("18 Bills 💵");
  if (isMatch(sList)) matchedRoles.push("18 Shots 🥃");

  return matchedRoles.length > 0 ? matchedRoles.join(" & ") : null;
}

// --------------------------------------------------------------------
// 4. RSVP FORM LOGIC
// - Collects ONLY: Guest Name & Attendance Status
// - Dynamic Stay Preference box when Attending
// - Strictly ONE guest name (Enforcing "No Plus One" rule)
// - Programmatic deadline lockout after November 12, 2026
// - Entourage role recognition pop-up alert
// --------------------------------------------------------------------
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const stayBox = document.getElementById('stay-field-container');
  const guestNameInput = document.getElementById('guest_name');
  const submitBtn = document.getElementById('submit-rsvp-btn');
  const deadlineLockout = document.getElementById('deadline-lockout-notice');
  const attendingRadios = document.querySelectorAll('input[name="attendance_status"]');

  // Check deadline: November 12, 2026 23:59:59 PHT (UTC+8)
  const deadlineMs = new Date('2026-11-12T23:59:59+08:00').getTime();
  if (Date.now() > deadlineMs) {
    if (form) form.style.display = 'none';
    if (deadlineLockout) deadlineLockout.style.display = 'block';
    return;
  }

  // Toggle visible stay option box when Attending is checked
  attendingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = document.querySelector('input[name="attendance_status"]:checked');
      if (selected && selected.value === 'Attending') {
        stayBox.style.display = 'block';
        // Select 'Night Only' as default if neither is selected yet
        const selectedStay = document.querySelector('input[name="stay_type"]:checked');
        if (!selectedStay) {
          const defaultStay = document.getElementById('stay-night');
          if (defaultStay) defaultStay.checked = true;
        }
      } else {
        stayBox.style.display = 'none';
      }
    });
  });

  // Client validation & dynamic Title Case formatting for Guest Name
  guestNameInput.addEventListener('input', () => {
    const start = guestNameInput.selectionStart;
    const end = guestNameInput.selectionEnd;
    const raw = guestNameInput.value;
    const titleCased = raw.replace(/\b([a-z])/g, (m) => m.toUpperCase());

    if (raw !== titleCased) {
      guestNameInput.value = titleCased;
      if (start !== null && end !== null) {
        guestNameInput.setSelectionRange(start, end);
      }
    }

    const val = guestNameInput.value;
    const plusOneRegex = /(\band\b|\bwith\b|\bplus\b|\bplus\s*one\b|\b\+1\b|[&+,/])/i;
    if (plusOneRegex.test(val)) {
      guestNameInput.setCustomValidity('Strict "No Plus One" venue policy: Please enter only ONE name.');
    } else {
      guestNameInput.setCustomValidity('');
    }
  });

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = guestNameInput.value.trim();
    const statusRadio = document.querySelector('input[name="attendance_status"]:checked');

    if (!name) {
      alert('Please enter your full name.');
      guestNameInput.focus();
      return;
    }

    if (!statusRadio) {
      alert('Please select whether you will attend or decline.');
      return;
    }

    const attendanceStatus = statusRadio.value;
    let stayType = null;
    if (attendanceStatus === 'Attending') {
      const stayRadio = document.querySelector('input[name="stay_type"]:checked');
      stayType = stayRadio ? stayRadio.value : 'Night Only';
    }

    // Single name enforcement check
    const plusOneRegex = /(\band\b|\bwith\b|\bplus\b|\bplus\s*one\b|\b\+1\b|[&+,/])/i;
    if (plusOneRegex.test(name)) {
      alert('Strict Venue Capacity Notice: Please enter only ONE guest name. Plus ones cannot be accommodated.');
      guestNameInput.focus();
      return;
    }

    // Check entourage role match
    const entourageRole = getEntourageMatch(name);
    const stayVal = (attendanceStatus === 'Attending') ? (stayType || 'Night Only') : 'N/A';

    // Construct alert pop-up message
    let alertMessage = "";
    if (attendanceStatus === "Attending") {
      if (entourageRole) {
        alertMessage = "🌹 Welcome, " + name + "!\n\n" +
                       "Role: " + entourageRole + "\n" +
                       "Stay Preference: " + stayVal + "\n\n" +
                       "Your RSVP has been confirmed. We can't wait to celebrate with you! 🥂✨";
      } else {
        alertMessage = "✨ Welcome, " + name + "!\n\n" +
                       "Stay Preference: " + stayVal + "\n\n" +
                       "Your RSVP has been confirmed. We look forward to celebrating with you! 🥂";
      }
    } else {
      if (entourageRole) {
        alertMessage = "🍷 Thank you for letting us know, " + name + ".\n\n" +
                       "You will be truly missed as part of Sheika's " + entourageRole + ".";
      } else {
        alertMessage = "🍷 Thank you for letting us know, " + name + ". You will be missed!";
      }
    }

    // Show alert pop-up recognizing entourage role and stay preference
    alert(alertMessage);

    // Disable button while processing
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Saving RSVP...</span>';

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: name,
          attendance_status: attendanceStatus,
          stay_type: stayType
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit RSVP.');
      }

      // Success! Reset form and show celebratory confirmation
      form.reset();
      stayBox.style.display = 'none';

      const entourageDisplay = entourageRole ? entourageRole : 'Special Guest';

      if (attendanceStatus === 'Attending') {
        triggerConfettiCelebration();
        showModal({
          icon: entourageRole ? '🌹✨' : '🥂✨',
          title: 'RSVP Confirmed!',
          message: `
            Welcome, <strong>${name}</strong>!<br>
            <div class="modal-detail-box">
              <div class="modal-detail-row">
                <span class="modal-detail-label">Entourage Role:</span>
                <span class="modal-detail-val">${entourageDisplay}</span>
              </div>
              <div class="modal-detail-row">
                <span class="modal-detail-label">Stay Preference:</span>
                <span class="modal-detail-val">${stayType}</span>
              </div>
            </div>
            We can't wait to celebrate with you on November 14, 2026 at La Lucei! 🥂✨
          `
        });
      } else {
        showModal({
          icon: '🍷🤍',
          title: 'Response Received',
          message: `
            Thank you for letting us know, <strong>${name}</strong>.<br>
            <div class="modal-detail-box">
              <div class="modal-detail-row">
                <span class="modal-detail-label">Entourage Role:</span>
                <span class="modal-detail-val">${entourageDisplay}</span>
              </div>
            </div>
            You will be warmly remembered and truly missed!
          `
        });
      }
    } catch (err) {
      alert(err.message || 'An error occurred while saving your RSVP. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Confirm My RSVP</span> <span style="font-size:1.2rem;">✨</span>';
    }
  });
}

// --------------------------------------------------------------------
// 5. CONFETTI BURST (Canvas-based, zero-dependency)
// --------------------------------------------------------------------
function triggerConfettiCelebration() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#9E1530', '#721224', '#C5A059', '#E6CE9F', '#FFFFFF', '#F43F5E'];
  const confettiCount = 120;
  const particles = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() * 80 - 40),
      y: canvas.height * 0.45,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      drag: 0.98,
      opacity: 1
    });
  }

  let animationId;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotationSpeed;
      if (elapsed > 1800) p.opacity -= 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < 3500) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// --------------------------------------------------------------------
// 6. CELEBRATION MODAL
// --------------------------------------------------------------------
function showModal({ icon, title, message }) {
  const overlay = document.getElementById('celebration-modal');
  const iconEl = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-msg');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = message;

  overlay.classList.add('active');

  const closeModal = () => overlay.classList.remove('active');
  if (closeBtn) closeBtn.onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
}

// Automatically play music on any user interaction (scroll, click, touch)
function playMusicOnInteraction() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.play().then(() => {
      // Remove listeners once music starts playing successfully
      window.removeEventListener('scroll', playMusicOnInteraction);
      window.removeEventListener('click', playMusicOnInteraction);
      window.removeEventListener('touchstart', playMusicOnInteraction);
    }).catch(error => {
      console.log("Playback prevented by browser until interaction occurs.");
    });
  }
}

// Listen for scrolling, clicking, or touching the screen
window.addEventListener('scroll', playMusicOnInteraction);
window.addEventListener('click', playMusicOnInteraction);
window.addEventListener('touchstart', playMusicOnInteraction);

