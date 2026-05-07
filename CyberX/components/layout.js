/* ============================================
   CYBERX — Layout Engine v3
   Navbar · Footer · Transitions · Mobile
   ============================================ */

const CX = {
  base: () => window.location.pathname.includes('/pages/') ? '../' : '',

  pages: {
    'Home':        { href:'index.html',             icon:'⌂', file:'index.html'      },
    'Lectures':    { href:'pages/lectures.html',    icon:'▶', file:'lectures.html'   },
    'CTF Arena':   { href:'pages/ctf.html',         icon:'⚑', file:'ctf.html'        },
    'Codex':       { href:'pages/codex.html',       icon:'#', file:'codex.html'      },
    'Labs':        { href:'pages/labs.html',        icon:'◫', file:'labs.html'       },
    'Leaderboard': { href:'pages/leaderboard.html', icon:'◈', file:'leaderboard.html'},
  },

  navLinks: ['Lectures','CTF Arena','Codex','Labs','Leaderboard'],
};

/* ============ BUILD NAVBAR ============ */
function buildNav(active) {
  const b = CX.base();

  const links = CX.navLinks.map(name => {
    const p = CX.pages[name];
    const isActive = name === active;
    return `
      <a href="${b}${p.href}" class="nav-link${isActive ? ' is-active' : ''}" data-page="${name}">
        <span class="nav-link__icon">${p.icon}</span>
        <span class="nav-link__label">${name}</span>
        <span class="nav-link__bar"></span>
        ${isActive ? '<span class="nav-link__pulse"></span>' : ''}
      </a>`;
  }).join('');

  return `
<header class="cx-header" id="cxHeader">
  <div class="cx-header__inner">

    <!-- Logo -->
    <a href="${b}index.html" class="cx-logo" data-page="home">
      <div class="cx-logo__mark">
        <div class="cx-logo__hex">
          <span class="cx-logo__hex-inner">CX</span>
        </div>
      </div>
      <div class="cx-logo__text">
        <span class="cx-logo__name">CyberX</span>
        <span class="cx-logo__tag">v4.2.1</span>
      </div>
    </a>

    <!-- Desktop Nav -->
    <nav class="cx-nav" role="navigation" aria-label="Main">
      ${links}
    </nav>

    <!-- Actions -->
    <div class="cx-actions">
      <div class="cx-live-badge">
        <span class="dot-live"></span>
        <span>LIVE</span>
      </div>
      <a href="${b}pages/enroll.html" class="cx-enroll-btn">
        Enroll
      </a>
      <a href="${b}pages/signin.html" class="cx-signin-btn" data-page="signin">
        Sign In
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button class="cx-burger" id="cxBurger" onclick="toggleMobileMenu()" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>

  <!-- Mobile Menu -->
  <div class="cx-mobile-menu" id="cxMobileMenu" aria-hidden="true">
    <div class="cx-mobile-menu__inner">
      <div class="cx-mobile-menu__links">
        ${CX.navLinks.map(name => {
          const p = CX.pages[name];
          const isActive = name === active;
          return `<a href="${b}${p.href}" class="cx-mobile-link${isActive?' is-active':''}" onclick="closeMobileMenu()">
            <span class="cx-mobile-link__icon">${p.icon}</span>
            <span>${name}</span>
            ${isActive ? '<span class="cx-mobile-link__dot"></span>' : ''}
          </a>`;
        }).join('')}
      </div>
      <div class="cx-mobile-menu__footer">
        <a href="${b}pages/signin.html" class="btn btn-primary" style="width:100%;justify-content:center">
          Sign In →
        </a>
        <div class="cx-mobile-menu__status">
          <span class="dot-live" style="width:6px;height:6px"></span>
          <span>Season IV · 38 online · 8 lectures live</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Header scanline -->
  <div class="cx-header__scan"></div>
</header>
<div class="cx-header__spacer"></div>`;
}

/* ============ BUILD FOOTER ============ */
function buildFooter() {
  const b = CX.base();
  return `
<footer class="cx-footer">
  <canvas class="cx-footer__matrix" id="footerCanvas"></canvas>

  <div class="cx-footer__glow-1"></div>
  <div class="cx-footer__glow-2"></div>

  <div class="container cx-footer__content">

    <!-- Brand col -->
    <div class="cx-footer__brand">
      <div class="cx-footer__logo">
        <div class="cx-logo__hex" style="width:40px;height:40px;font-size:13px">
          <span class="cx-logo__hex-inner">CX</span>
        </div>
        <div>
          <div class="cx-footer__logo-name">CyberX</div>
          <div class="cx-footer__logo-sub">ENCYCLOPAEDIA CYBERNETICA</div>
        </div>
      </div>
      <p class="cx-footer__desc">
        A live platform, a growing compendium, and a community of practitioners.
        From first principles to advanced exploit development — all indexed, all live.
      </p>
      <div class="cx-footer__subscribe">
        <input type="email" placeholder="operator@cyberx.sh" class="cx-footer__input"/>
        <button class="btn btn-primary btn-sm">Subscribe</button>
      </div>
      <div class="cx-footer__socials">
        <button class="cx-footer__social" aria-label="Discord">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.13.14 18.2.2 18.24a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
        </button>
        <button class="cx-footer__social" aria-label="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </button>
        <button class="cx-footer__social" aria-label="Twitter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button class="cx-footer__social" aria-label="RSS">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
        </button>
      </div>
    </div>

    <!-- Link columns -->
    <div class="cx-footer__col">
      <h4 class="cx-footer__col-title">Learn</h4>
      <ul>
        <li><a href="${b}pages/codex.html">Codex Reference</a></li>
        <li><a href="${b}pages/lectures.html">Live Lectures <span class="badge badge-green" style="font-size:9px;padding:2px 6px">8 LIVE</span></a></li>
        <li><a href="${b}pages/ctf.html">CTF Arena <span class="badge badge-blue" style="font-size:9px;padding:2px 6px">S4</span></a></li>
        <li><a href="${b}pages/labs.html">Lab Environments</a></li>
        <li><a href="${b}pages/leaderboard.html">Leaderboard</a></li>
        <li><a href="#">Certifications</a></li>
      </ul>
    </div>

    <div class="cx-footer__col">
      <h4 class="cx-footer__col-title">Platform</h4>
      <ul>
        <li><a href="#">About CyberX</a></li>
        <li><a href="${b}pages/pricing.html">Pricing <span class="badge badge-purple" style="font-size:9px;padding:2px 6px">NEW</span></a></li>
        <li><a href="#">API Access</a></li>
        <li><a href="#">Instructor Portal</a></li>
        <li><a href="#">Changelog <span class="badge badge-gray" style="font-size:9px;padding:2px 6px">v4.2.1</span></a></li>
        <li><a href="#">Status</a></li>
      </ul>
    </div>

    <div class="cx-footer__col">
      <h4 class="cx-footer__col-title">Community</h4>
      <ul>
        <li><a href="#">Discord Server <span class="badge badge-green" style="font-size:9px;padding:2px 6px">ONLINE</span></a></li>
        <li><a href="#">Write-ups</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Hall of Fame</a></li>
        <li><a href="#">Bug Bounty</a></li>
        <li><a href="#">Contribute</a></li>
      </ul>
    </div>
  </div>

  <!-- Status bar -->
  <div class="cx-footer__statusbar">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div class="cx-footer__status-items">
        <div class="cx-footer__status-item">
          <span class="dot-live" style="width:5px;height:5px"></span>
          ALL SYSTEMS OPERATIONAL
        </div>
        <div class="cx-footer__status-item">CTF ARENA · 38 ONLINE</div>
        <div class="cx-footer__status-item">SEASON IV · 12 DAYS LEFT</div>
        <div class="cx-footer__status-item hidden-mobile">94 LECTURES INDEXED</div>
        <div class="cx-footer__status-item hidden-mobile">API · 12MS LATENCY</div>
      </div>
      <div class="cx-footer__copy">© 2025 CyberX. All rights reserved.</div>
    </div>
  </div>
</footer>`;
}

/* ============ PAGE TRANSITION ============ */
function injectTransition() {
  const el = document.createElement('div');
  el.id = 'cxTransition';
  el.className = 'cx-page-transition';
  el.innerHTML = `
    <div class="cx-page-transition__content">
      <div class="cx-page-transition__hex">
        <span>CX</span>
      </div>
      <div class="cx-page-transition__label">CyberX</div>
      <div class="cx-page-transition__bar">
        <div class="cx-page-transition__bar-fill"></div>
      </div>
      <div class="cx-page-transition__hint" id="transHint">Loading…</div>
    </div>
    <canvas id="transCanvas" class="cx-page-transition__matrix"></canvas>
  `;
  document.body.appendChild(el);

  // Fade out on load
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.classList.add('hidden');
      setTimeout(() => el.style.pointerEvents = 'none', 500);
    }, 100);
  });

  // Intercept all internal link clicks
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || a.target === '_blank') return;
    if (!href.endsWith('.html') && !href.endsWith('/')) return;

    e.preventDefault();
    const names = {
      'lectures':'Lectures', 'ctf':'CTF Arena', 'codex':'Codex',
      'labs':'Labs', 'leaderboard':'Leaderboard', 'pricing':'Pricing',
      'signin':'Sign In', 'index':'Home'
    };
    const key = Object.keys(names).find(k => href.includes(k)) || 'page';
    const hint = document.getElementById('transHint');
    if (hint) hint.textContent = `→ ${names[key] || 'Loading'}`;

    el.style.pointerEvents = 'all';
    el.classList.remove('hidden');
    startTransMatrix();
    setTimeout(() => { window.location.href = href; }, 500);
  });
}

let transMatrixRunning = false;
function startTransMatrix() {
  const canvas = document.getElementById('transCanvas');
  if (!canvas || transMatrixRunning) return;
  transMatrixRunning = true;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = 'ABCDEF0123456789アイウエオ<>{}[]#$@!';
  const cols = Math.floor(canvas.width / 18);
  const drops = Array(cols).fill(0);
  const frame = () => {
    ctx.fillStyle = 'rgba(6,9,16,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = '13px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.fillText(c, i * 18, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  };
  frame();
}

/* ============ MOBILE MENU ============ */
function toggleMobileMenu() {
  const menu = document.getElementById('cxMobileMenu');
  const burger = document.getElementById('cxBurger');
  if (!menu || !burger) return;
  const open = menu.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMobileMenu() {
  const menu = document.getElementById('cxMobileMenu');
  const burger = document.getElementById('cxBurger');
  if (menu) menu.classList.remove('is-open');
  if (burger) burger.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* ============ HEADER SCROLL ============ */
function initHeaderScroll() {
  const header = document.getElementById('cxHeader');
  if (!header) return;
  let lastY = 0;
  const handler = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 50);
    header.classList.toggle('is-hidden', y > lastY + 10 && y > 200);
    header.classList.toggle('is-visible', y < lastY - 10);
    lastY = y;
  };
  window.addEventListener('scroll', handler, { passive: true });
}

/* ============ FOOTER MATRIX CANVAS ============ */
function initFooterMatrix() {
  const canvas = document.getElementById('footerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const chars = 'ABCDEF0123456789アイウエオカキクケコ#$<>[]';
  const fs = 13;
  const cols = () => Math.floor(canvas.width / fs);
  let drops = Array(cols()).fill(1);

  setInterval(() => {
    ctx.fillStyle = 'rgba(9,13,24,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fs}px JetBrains Mono, monospace`;
    const c = cols();
    if (drops.length !== c) drops = Array(c).fill(1);
    drops.forEach((y, i) => {
      ctx.globalAlpha = Math.random() * 0.4 + 0.05;
      ctx.fillStyle = '#00ff88';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
      if (y * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    });
    ctx.globalAlpha = 1;
  }, 50);
}

/* ============ INIT ============ */
function initLayout(active = '') {
  const navEl   = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl)    navEl.innerHTML   = buildNav(active);
  if (footerEl) footerEl.innerHTML = buildFooter();

  injectGlobalStyles();
  injectTransition();
  initHeaderScroll();
  initFooterMatrix();

  // Animate page in
  document.body.classList.add('cx-page-loaded');
}

/* ============ INJECTED GLOBAL STYLES ============ */
function injectGlobalStyles() {
  if (document.getElementById('cx-global-styles')) return;
  const s = document.createElement('style');
  s.id = 'cx-global-styles';
  s.textContent = `

/* ========= HEADER ========= */
.cx-header {
  position:fixed; top:0; left:0; right:0; z-index:900;
  height:var(--nav-h);
  background:rgba(6,9,16,0.7);
  backdrop-filter:blur(20px) saturate(1.5);
  border-bottom:1px solid rgba(0,255,136,0.08);
  transition:transform 0.35s var(--ease), background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.cx-header.is-scrolled {
  background:rgba(6,9,16,0.95);
  border-bottom-color:rgba(0,255,136,0.12);
  box-shadow:0 4px 40px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,136,0.04);
}
.cx-header.is-hidden  { transform:translateY(-100%); }
.cx-header.is-visible { transform:translateY(0); }
.cx-header__inner {
  max-width:var(--max-w); margin:0 auto; padding:0 20px;
  height:100%; display:flex; align-items:center; gap:20px;
  position:relative;
}
@media(min-width:768px) { .cx-header__inner { padding:0 32px; gap:32px; } }
@media(min-width:1024px){ .cx-header__inner { padding:0 48px; gap:40px; } }
.cx-header__scan {
  position:absolute; bottom:-1px; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent 0%, var(--neon-green) 50%, transparent 100%);
  opacity:0; transition:opacity 0.3s;
  animation:headerScan 4s ease-in-out infinite;
}
@keyframes headerScan {
  0%,100% { opacity:0; transform:scaleX(0); }
  50%      { opacity:0.6; transform:scaleX(1); }
}
.cx-header__spacer { height:var(--nav-h); }

/* ========= LOGO ========= */
.cx-logo {
  display:flex; align-items:center; gap:10px; flex-shrink:0;
  text-decoration:none; transition:opacity 0.2s;
}
.cx-logo:hover { opacity:0.85; }
.cx-logo__hex {
  width:36px; height:36px; position:relative;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.cx-logo__hex::before {
  content:'';
  position:absolute; inset:0;
  background:linear-gradient(135deg, var(--neon-green), var(--neon-blue));
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  opacity:0.9;
}
.cx-logo__hex-inner {
  position:relative; z-index:1;
  font-family:var(--font-mono); font-size:12px; font-weight:700;
  color:#060910; letter-spacing:0.5px;
}
.cx-logo__text { display:flex; flex-direction:column; gap:0; }
.cx-logo__name {
  font-family:var(--font-display); font-size:17px; font-weight:700;
  color:var(--text-0); letter-spacing:-0.01em; line-height:1;
}
.cx-logo__tag {
  font-family:var(--font-mono); font-size:9px; color:var(--text-3);
  letter-spacing:1px; text-transform:uppercase; line-height:1;
}

/* ========= NAV LINKS ========= */
.cx-nav {
  display:none; align-items:center; gap:2px; flex:1; justify-content:center;
}
@media(min-width:900px) { .cx-nav { display:flex; } }

.nav-link {
  position:relative; display:flex; align-items:center; gap:6px;
  font-family:var(--font-mono); font-size:12px; color:var(--text-3);
  padding:7px 13px; border-radius:var(--r-md); text-decoration:none;
  transition:color 0.2s, background 0.2s; overflow:hidden;
}
.nav-link:hover { color:var(--text-1); background:rgba(255,255,255,0.04); }
.nav-link__icon { font-size:11px; transition:color 0.2s; }
.nav-link:hover .nav-link__icon { color:var(--neon-green); }

/* Underline bar */
.nav-link__bar {
  position:absolute; bottom:4px; left:13px; right:13px;
  height:1.5px; background:var(--neon-green); border-radius:2px;
  transform:scaleX(0); transform-origin:left;
  transition:transform 0.25s var(--ease);
}
.nav-link:hover .nav-link__bar { transform:scaleX(0.5); opacity:0.6; }

/* ACTIVE state */
.nav-link.is-active {
  color:var(--text-1);
  background:linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,212,255,0.04));
}
.nav-link.is-active .nav-link__icon { color:var(--neon-green); }
.nav-link.is-active .nav-link__bar  { transform:scaleX(1); opacity:1; }

/* Glowing dot on active page */
.nav-link__pulse {
  position:absolute; top:5px; right:5px;
  width:5px; height:5px; border-radius:50%;
  background:var(--neon-green);
  box-shadow:0 0 8px var(--neon-green), 0 0 16px rgba(0,255,136,0.5);
  animation:livePulse 2s infinite;
}

/* ========= ACTIONS ========= */
.cx-actions { display:flex; align-items:center; gap:10px; margin-left:auto; }
.cx-live-badge {
  display:none; align-items:center; gap:6px;
  font-family:var(--font-mono); font-size:10px; color:var(--neon-green);
  letter-spacing:2px; padding:5px 12px; border-radius:var(--r-full);
  border:1px solid rgba(0,255,136,0.25); background:rgba(0,255,136,0.06);
  cursor:default;
}
@media(min-width:768px) { .cx-live-badge { display:flex; } }
.cx-signin-btn {
  display:flex; align-items:center; gap:7px;
  font-family:var(--font-mono); font-size:12px; font-weight:600;
  color:#060910; background:var(--neon-green); padding:8px 18px;
  border-radius:var(--r-md); text-decoration:none;
  border:1px solid var(--neon-green);
  transition:all 0.2s var(--ease); letter-spacing:0.3px;
}
.cx-signin-btn:hover {
  background:#00e67a; transform:translateY(-1px);
  box-shadow:0 0 20px rgba(0,255,136,0.4), 0 6px 20px rgba(0,0,0,0.4);
  color:#060910;
}
.cx-signin-btn svg { transition:transform 0.2s; }
.cx-signin-btn:hover svg { transform:translateX(3px); }

/* ========= BURGER ========= */
.cx-burger {
  display:flex; flex-direction:column; gap:5px; padding:6px;
  border:1px solid var(--border-1); border-radius:var(--r-sm);
  background:rgba(255,255,255,0.03); transition:all 0.2s; flex-shrink:0;
}
.cx-burger:hover { border-color:rgba(0,255,136,0.3); background:rgba(0,255,136,0.05); }
.cx-burger span {
  display:block; width:18px; height:1.5px;
  background:var(--text-1); border-radius:1px; transition:all 0.25s var(--ease);
}
.cx-burger.is-open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.cx-burger.is-open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.cx-burger.is-open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
@media(min-width:900px) { .cx-burger { display:none; } }

/* ========= MOBILE MENU ========= */
.cx-mobile-menu {
  position:fixed; top:var(--nav-h); left:0; right:0; bottom:0;
  background:rgba(6,9,16,0.98); backdrop-filter:blur(24px);
  z-index:850; transform:translateX(100%);
  transition:transform 0.35s var(--ease);
  overflow-y:auto; display:flex; flex-direction:column;
}
.cx-mobile-menu.is-open { transform:translateX(0); }
.cx-mobile-menu__inner {
  display:flex; flex-direction:column;
  padding:24px 24px 40px; min-height:100%;
}
.cx-mobile-menu__links { display:flex; flex-direction:column; gap:4px; flex:1; }
.cx-mobile-link {
  display:flex; align-items:center; gap:14px;
  font-family:var(--font-mono); font-size:15px; color:var(--text-2);
  padding:16px 12px; border-radius:var(--r-md);
  border:1px solid transparent; text-decoration:none;
  transition:all 0.2s; position:relative;
}
.cx-mobile-link:hover {
  color:var(--text-1); background:rgba(255,255,255,0.04);
  border-color:var(--border-1);
}
.cx-mobile-link.is-active {
  color:var(--neon-green);
  background:rgba(0,255,136,0.06);
  border-color:rgba(0,255,136,0.15);
}
.cx-mobile-link__icon { font-size:16px; width:24px; text-align:center; }
.cx-mobile-link__dot {
  position:absolute; right:14px; width:7px; height:7px; border-radius:50%;
  background:var(--neon-green); box-shadow:0 0 10px var(--neon-green);
  animation:livePulse 2s infinite;
}
.cx-mobile-menu__footer { padding-top:24px; border-top:1px solid var(--border-1); }
.cx-mobile-menu__status {
  display:flex; align-items:center; gap:8px; margin-top:14px;
  font-family:var(--font-mono); font-size:10px; color:var(--text-3);
  letter-spacing:1px;
}

/* ========= PAGE TRANSITION ========= */
.cx-page-transition {
  position:fixed; inset:0; z-index:9999;
  background:var(--bg-0);
  display:flex; align-items:center; justify-content:center;
  transition:opacity 0.45s var(--ease);
  opacity:1;
}
.cx-page-transition.hidden { opacity:0; pointer-events:none; }
.cx-page-transition__matrix {
  position:absolute; inset:0; width:100%; height:100%; opacity:0.3;
}
.cx-page-transition__content {
  position:relative; z-index:1; text-align:center;
}
.cx-page-transition__hex {
  width:64px; height:64px; margin:0 auto 16px;
  display:flex; align-items:center; justify-content:center;
  position:relative;
}
.cx-page-transition__hex::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,var(--neon-green),var(--neon-blue));
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  animation:spin 2s linear infinite;
}
.cx-page-transition__hex span {
  position:relative; z-index:1;
  font-family:var(--font-mono); font-size:16px; font-weight:700; color:#060910;
}
.cx-page-transition__label {
  font-family:var(--font-display); font-size:20px; font-weight:700;
  color:var(--text-0); margin-bottom:16px; letter-spacing:-0.01em;
}
.cx-page-transition__bar {
  width:160px; height:2px; background:rgba(255,255,255,0.08);
  border-radius:2px; overflow:hidden; margin:0 auto 12px;
}
.cx-page-transition__bar-fill {
  height:100%; background:linear-gradient(90deg,var(--neon-green),var(--neon-blue));
  border-radius:2px; animation:barPulse 1.5s ease-in-out infinite;
}
@keyframes barPulse { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:0} 100%{width:0%;margin-left:100%} }
.cx-page-transition__hint {
  font-family:var(--font-mono); font-size:12px; color:var(--text-3); letter-spacing:1px;
}

/* ========= PAGE LOAD ANIMATION ========= */
.cx-page-loaded .anim-on-load {
  animation:fadeUp 0.6s var(--ease-out) forwards;
}

/* ========= FOOTER ========= */
.cx-footer {
  background:var(--bg-0); border-top:1px solid rgba(0,255,136,0.08);
  position:relative; overflow:hidden; margin-top:80px;
}
.cx-footer__matrix {
  position:absolute; top:0; left:0; width:100%; height:240px; opacity:0.06; pointer-events:none;
}
.cx-footer__glow-1 {
  position:absolute; width:500px; height:500px; border-radius:50%; pointer-events:none;
  background:radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%);
  top:-200px; left:-100px;
}
.cx-footer__glow-2 {
  position:absolute; width:400px; height:400px; border-radius:50%; pointer-events:none;
  background:radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 70%);
  bottom:-100px; right:-50px;
}
.cx-footer__content {
  display:grid; gap:48px; padding:64px 0 48px;
  position:relative; z-index:1;
  grid-template-columns:1fr;
}
@media(min-width:640px)  { .cx-footer__content { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px) { .cx-footer__content { grid-template-columns:2fr 1fr 1fr 1fr; } }

.cx-footer__logo {
  display:flex; align-items:center; gap:12px; margin-bottom:16px;
}
.cx-footer__logo-name {
  font-family:var(--font-display); font-size:20px; font-weight:700;
  color:var(--text-0); line-height:1;
}
.cx-footer__logo-sub {
  font-family:var(--font-mono); font-size:9px; color:var(--text-3);
  letter-spacing:2px; text-transform:uppercase; margin-top:2px;
}
.cx-footer__desc {
  font-size:14px; color:var(--text-2); line-height:1.7;
  margin-bottom:24px; max-width:320px;
}
.cx-footer__subscribe {
  display:flex; gap:8px; margin-bottom:20px;
}
.cx-footer__input {
  flex:1; background:rgba(255,255,255,0.04); border:1px solid var(--border-1);
  border-radius:var(--r-md); padding:9px 14px; font-family:var(--font-mono);
  font-size:13px; color:var(--text-1); outline:none;
  transition:border-color 0.2s, box-shadow 0.2s;
}
.cx-footer__input::placeholder { color:var(--text-3); }
.cx-footer__input:focus {
  border-color:rgba(0,255,136,0.3);
  box-shadow:0 0 0 3px rgba(0,255,136,0.06);
}
.cx-footer__socials { display:flex; gap:8px; }
.cx-footer__social {
  width:36px; height:36px; display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,0.04); border:1px solid var(--border-1);
  border-radius:var(--r-md); color:var(--text-2);
  cursor:pointer; transition:all 0.2s;
}
.cx-footer__social:hover {
  background:rgba(0,255,136,0.08); border-color:rgba(0,255,136,0.25);
  color:var(--neon-green); transform:translateY(-2px);
}
.cx-footer__col-title {
  font-family:var(--font-mono); font-size:10px; color:var(--text-3);
  letter-spacing:2.5px; text-transform:uppercase; margin-bottom:16px;
  padding-bottom:10px; border-bottom:1px solid var(--border-1);
}
.cx-footer__col ul { display:flex; flex-direction:column; gap:10px; }
.cx-footer__col ul li a {
  font-size:14px; color:var(--text-2); display:flex; align-items:center; gap:8px;
  transition:color 0.15s; text-decoration:none;
}
.cx-footer__col ul li a:hover { color:var(--text-1); }
.cx-footer__statusbar {
  border-top:1px solid rgba(255,255,255,0.04); padding:12px 0;
  position:relative; z-index:1;
}
.cx-footer__status-items {
  display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  font-family:var(--font-mono); font-size:10px; color:var(--text-3); letter-spacing:0.5px;
}
.cx-footer__status-item { display:flex; align-items:center; gap:6px; }
.cx-footer__copy {
  font-family:var(--font-mono); font-size:10px; color:var(--text-3);
}
.hidden-mobile { display:none; }
@media(min-width:768px) { .hidden-mobile { display:flex; } }

/* ========= TICKER BAR ========= */
.ticker-bar {
  background:var(--bg-0); border-bottom:1px solid rgba(0,255,136,0.08);
  height:36px; display:flex; align-items:center; overflow:hidden;
  padding:0 20px; gap:16px;
}
@media(min-width:768px) { .ticker-bar { padding:0 32px; } }
.ticker-bar__left {
  font-family:var(--font-mono); font-size:10px; color:var(--text-3);
  letter-spacing:1.5px; display:flex; align-items:center; gap:12px;
  flex-shrink:0; white-space:nowrap;
}
.ticker-bar__right {
  font-family:var(--font-mono); font-size:10px; color:var(--text-3);
  letter-spacing:1px; overflow:hidden; white-space:nowrap;
  flex:1; mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent);
}
.ticker-badge {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(0,212,255,0.08); color:var(--neon-blue);
  border:1px solid rgba(0,212,255,0.2); border-radius:var(--r-sm);
  font-family:var(--font-mono); font-size:9px; letter-spacing:1.5px;
  padding:2px 9px; flex-shrink:0;
}
  .cx-enroll-btn {
  display:inline-flex; align-items:center;
  font-family:var(--font-mono); font-size:12px; font-weight:600;
  letter-spacing:0.3px; padding:8px 18px; border-radius:var(--r-md);
  border:1px solid rgba(0,255,136,0.35); color:var(--neon-green);
  text-decoration:none; transition:all 0.2s;
}
.cx-enroll-btn:hover {
  background:var(--neon-green); color:#000;
  transform:translateY(-1px);
  box-shadow:0 0 20px rgba(0,255,136,0.35);
}
  `;
  document.head.appendChild(s);
}
