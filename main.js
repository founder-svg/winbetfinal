/* ══════════════════════════════════════════════════════════════
   WINBET — MAIN JAVASCRIPT
   WixFox Digital Solutions
══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM READY ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initHeroSlider();
  initGallerySlider();
  initDropdownMenu();
  initSchedule();
  initCountdown();
  initNextMatchCountdown();
  initWinPopup();
  initSocialPopup();
  initWaPopup();
  initLiveUserCount();
  initScheduleFilters();
});

/* ══════════════════════════════════════════════════════════════
   TICKER — duplicate spans for seamless loop
══════════════════════════════════════════════════════════════ */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  // Clone contents to ensure seamless loop
  track.innerHTML += track.innerHTML;
}

/* ══════════════════════════════════════════════════════════════
   HERO SLIDER
══════════════════════════════════════════════════════════════ */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  let current = 0;
  let timer   = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  // Expose for HTML onclick
  window.goToSlide = (idx) => {
    clearInterval(timer);
    goTo(idx);
    autoPlay();
  };

  autoPlay();
}

/* ══════════════════════════════════════════════════════════════
   GALLERY SLIDER
══════════════════════════════════════════════════════════════ */
function initGallerySlider() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.gallery-slide');
  let current  = 0;

  function next() {
    current = (current + 1) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  setInterval(next, 4000);
}

/* ══════════════════════════════════════════════════════════════
   DROPDOWN MENU
══════════════════════════════════════════════════════════════ */
function initDropdownMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('dropdownMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   HERO COUNTDOWN (5 min urgency)
══════════════════════════════════════════════════════════════ */
function initCountdown() {
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');
  if (!minsEl || !secsEl) return;

  let total = 5 * 60; // 5 minutes

  const tick = setInterval(() => {
    if (total <= 0) {
      total = 5 * 60; // reset for demo
    }
    total--;
    const m = Math.floor(total / 60);
    const s = total % 60;
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ══════════════════════════════════════════════════════════════
   IPL 2026 SCHEDULE DATA & RENDERER
══════════════════════════════════════════════════════════════ */
const IPL_MATCHES = [
  { id: 1,  date: '2026-03-22', time: '15:30', teams: 'KKR vs RCB',   venue: 'Eden Gardens, Kolkata',     status: 'today'    },
  { id: 2,  date: '2026-03-22', time: '19:30', teams: 'MI vs CSK',    venue: 'Wankhede Stadium, Mumbai',  status: 'today'    },
  { id: 3,  date: '2026-03-23', time: '15:30', teams: 'DC vs PBKS',   venue: 'Arun Jaitley Stadium, Delhi', status: 'upcoming' },
  { id: 4,  date: '2026-03-23', time: '19:30', teams: 'SRH vs RR',    venue: 'Rajiv Gandhi Intl., Hyderabad', status: 'upcoming' },
  { id: 5,  date: '2026-03-24', time: '19:30', teams: 'GT vs LSG',    venue: 'Narendra Modi Stadium, Ahmedabad', status: 'upcoming' },
  { id: 6,  date: '2026-03-25', time: '19:30', teams: 'RCB vs MI',    venue: 'M Chinnaswamy, Bengaluru',  status: 'upcoming' },
  { id: 7,  date: '2026-03-26', time: '19:30', teams: 'CSK vs KKR',   venue: 'MA Chidambaram, Chennai',   status: 'upcoming' },
  { id: 8,  date: '2026-03-27', time: '15:30', teams: 'RR vs DC',     venue: 'Sawai Mansingh, Jaipur',    status: 'upcoming' },
  { id: 9,  date: '2026-03-27', time: '19:30', teams: 'PBKS vs SRH',  venue: 'IS Bindra, Mohali',         status: 'upcoming' },
  { id: 10, date: '2026-03-28', time: '19:30', teams: 'LSG vs GT',    venue: 'Ekana, Lucknow',            status: 'upcoming' },
  { id: 11, date: '2026-04-15', time: '19:30', teams: 'Qualifier 1',  venue: 'TBD',                       status: 'playoff'  },
  { id: 12, date: '2026-04-16', time: '19:30', teams: 'Eliminator',   venue: 'TBD',                       status: 'playoff'  },
  { id: 13, date: '2026-04-18', time: '19:30', teams: 'Qualifier 2',  venue: 'TBD',                       status: 'playoff'  },
  { id: 14, date: '2026-04-20', time: '19:30', teams: 'IPL Final 🏆', venue: 'TBD',                       status: 'playoff'  },
];

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
}

function renderMatches(filter = 'ALL') {
  const list = document.getElementById('scheduleList');
  if (!list) return;

  let data = IPL_MATCHES;
  if (filter === 'TODAY')     data = IPL_MATCHES.filter(m => m.status === 'today');
  if (filter === 'THIS_WEEK') data = IPL_MATCHES.filter(m => ['today','upcoming'].includes(m.status)).slice(0,6);
  if (filter === 'PLAYOFFS')  data = IPL_MATCHES.filter(m => m.status === 'playoff');

  if (!data.length) {
    list.innerHTML = '<p style="padding:24px 20px;color:var(--muted);font-family:Rajdhani,sans-serif;">No matches for this filter.</p>';
    return;
  }

  list.innerHTML = data.map(m => {
    const badgeClass = m.status === 'live' ? 'live' :
                       m.status === 'today' ? 'today' :
                       m.status === 'playoff' ? 'playoff' : 'upcoming';
    const badgeText  = m.status === 'live' ? '● LIVE' :
                       m.status === 'today' ? 'TODAY · ' + m.time :
                       m.status === 'playoff' ? '🏆 PLAYOFF' : m.time;
    return `
      <div class="match-row">
        <div class="match-date">${formatDate(m.date)}</div>
        <div>
          <div class="match-teams">${m.teams}</div>
          <div class="match-venue">📍 ${m.venue}</div>
        </div>
        <div>
          <span class="match-badge ${badgeClass}">${badgeText}</span>
        </div>
      </div>`;
  }).join('');
}

function initSchedule() {
  const lastEl = document.getElementById('scheduleLastUpdated');
  if (lastEl) {
    const now = new Date();
    lastEl.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  renderMatches('ALL');
}

/* ══════════════════════════════════════════════════════════════
   SCHEDULE FILTERS
══════════════════════════════════════════════════════════════ */
function initScheduleFilters() {
  document.querySelectorAll('.sch-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sch-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMatches(btn.dataset.filter);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   NEXT MATCH COUNTDOWN
══════════════════════════════════════════════════════════════ */
function initNextMatchCountdown() {
  const bannerTeams = document.getElementById('nxmTeams');
  const bannerMeta  = document.getElementById('nxmMeta');
  const hEl  = document.getElementById('nxmH');
  const mEl  = document.getElementById('nxmM');
  const sEl  = document.getElementById('nxmS');
  if (!bannerTeams || !hEl) return;

  // Find next match
  const now  = new Date();
  let next   = null;

  for (const m of IPL_MATCHES) {
    const dt = new Date(`${m.date}T${m.time}:00+05:30`);
    if (dt > now) { next = { ...m, dt }; break; }
  }

  if (!next) {
    bannerTeams.textContent = 'Season Completed';
    hEl.textContent = mEl.textContent = sEl.textContent = '00';
    return;
  }

  bannerTeams.textContent = next.teams;
  if (bannerMeta) bannerMeta.textContent = `${formatDate(next.date)} · ${next.time} IST · ${next.venue}`;

  function tick() {
    const diff = next.dt - new Date();
    if (diff <= 0) {
      hEl.textContent = mEl.textContent = sEl.textContent = '00';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════════════
   WIN POPUP (Social Proof)
══════════════════════════════════════════════════════════════ */
const WIN_DATA = [
  { name: 'Rahul K.', amount: '₹5,200', city: 'Mumbai' },
  { name: 'Priya S.',  amount: '₹12,500', city: 'Delhi' },
  { name: 'Arjun V.',  amount: '₹8,200',  city: 'Ahmedabad' },
  { name: 'Neha M.',   amount: '₹3,750',  city: 'Pune' },
  { name: 'Vikas T.',  amount: '₹21,000', city: 'Hyderabad' },
  { name: 'Simran D.', amount: '₹6,400',  city: 'Chandigarh' },
  { name: 'Rohan J.',  amount: '₹9,850',  city: 'Bangalore' },
  { name: 'Anita P.',  amount: '₹4,100',  city: 'Kolkata' },
];

function initWinPopup() {
  const popup  = document.getElementById('winPopup');
  const nameEl = popup?.querySelector('.win-popup-name');
  const amtEl  = popup?.querySelector('.win-popup-amount');
  const timeEl = popup?.querySelector('.win-popup-time');
  if (!popup || !nameEl) return;

  let idx = 0;

  function show() {
    const d = WIN_DATA[idx % WIN_DATA.length];
    idx++;
    nameEl.textContent = `${d.name} · ${d.city}`;
    amtEl.textContent  = d.amount;
    timeEl.textContent = 'just now';

    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4500);
  }

  // First pop after 6s, then every 12s
  setTimeout(() => { show(); setInterval(show, 12000); }, 6000);
}

/* ══════════════════════════════════════════════════════════════
   SOCIAL POPUP (one-time after 20s)
══════════════════════════════════════════════════════════════ */
function initSocialPopup() {
  const popup   = document.getElementById('socialPopup');
  const closeBtn = document.getElementById('socialPopupClose');
  if (!popup) return;

  if (!sessionStorage.getItem('socialPopupDone')) {
    setTimeout(() => {
      popup.classList.add('show');
      sessionStorage.setItem('socialPopupDone', '1');
    }, 20000);
  }

  closeBtn?.addEventListener('click', () => popup.classList.remove('show'));
}

/* ══════════════════════════════════════════════════════════════
   WHATSAPP POPUP
══════════════════════════════════════════════════════════════ */
function initWaPopup() {
  const card = document.getElementById('waPopupCard');
  const btn  = document.getElementById('waPopupBtn');
  if (!card || !btn) return;

  // Auto-open after 5s (first visit)
  if (!sessionStorage.getItem('waPopupShown')) {
    setTimeout(() => {
      card.classList.add('open');
      sessionStorage.setItem('waPopupShown', '1');
    }, 5000);
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (card.classList.contains('open') &&
        !card.contains(e.target) &&
        !btn.contains(e.target)) {
      card.classList.remove('open');
    }
  });
}

// Global toggle (used by HTML onclick)
window.toggleWaPopup = function () {
  const card = document.getElementById('waPopupCard');
  if (card) card.classList.toggle('open');
};

/* ══════════════════════════════════════════════════════════════
   LIVE USER COUNT (animated fake counter)
══════════════════════════════════════════════════════════════ */
function initLiveUserCount() {
  const el = document.getElementById('liveCount');
  if (!el) return;

  let base = 138 + Math.floor(Math.random() * 20);

  function update() {
    const delta = Math.floor(Math.random() * 7) - 3;
    base = Math.max(100, Math.min(250, base + delta));
    el.textContent = `🔥 ${base} users are online now`;
  }

  update();
  setInterval(update, 7000);
}
