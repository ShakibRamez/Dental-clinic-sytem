// app.js — shared UI helpers (theme, toast, API, formatting)
(function () {
  // ---------- Theme ----------
  const getTheme = () => localStorage.getItem('theme') || 'light';
  const applyTheme = t => document.documentElement.setAttribute('data-bs-theme', t);
  applyTheme(getTheme());
  window.toggleTheme = function () {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
    document.querySelectorAll('iframe').forEach(f => {
      try { f.contentDocument.documentElement.setAttribute('data-bs-theme', next); } catch (e) {}
    });
    window.dispatchEvent(new Event('themechange'));
    return next;
  };
  window.addEventListener('storage', e => { if (e.key === 'theme') applyTheme(getTheme()); });

  // ---------- Toast (replaces blocking alert()) ----------
  function stack() {
    let s = document.querySelector('.toast-stack');
    if (!s) { s = document.createElement('div'); s.className = 'toast-stack'; s.setAttribute('role', 'status'); document.body.appendChild(s); }
    return s;
  }
  window.toast = function (msg, type = 'info', ms = 3500) {
    const el = document.createElement('div');
    el.className = 'app-toast ' + type;
    const icon = { success: 'check-circle-fill text-success', danger: 'x-circle-fill text-danger', warning: 'exclamation-triangle-fill text-warning', info: 'info-circle-fill text-primary' }[type];
    el.innerHTML = `<i class="bi bi-${icon.split(' ')[0]} ${icon.split(' ')[1]} fs-5"></i><span></span>`;
    el.querySelector('span').textContent = msg;
    stack().appendChild(el);
    setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 300); }, ms);
  };
  window.alert = function (text) {
    const s = String(text);
    const type = s.startsWith('✅') ? 'success' : s.startsWith('❌') ? 'danger' : s.startsWith('⚠') ? 'warning' : 'info';
    window.toast(s.replace(/^[✅❌⚠️\s]+/u, '').split('\n')[0], type);
  };

  // ---------- Helpers ----------
  window.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.fmtNum = n => Number(n || 0).toLocaleString('fa-IR');
  window.fmtMoney = n => fmtNum(n) + ' ؋';
  window.api = async function (url, opts = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts,
      body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body,
    });
    if (res.status === 401) { sessionStorage.clear(); (window.top || window).location.replace('login.html'); throw new Error('unauthorized'); }
    if (!res.ok) throw new Error((await res.text()) || res.statusText);
    return res.status === 204 ? null : res.json();
  };
})();

// ================= تقویم و قالب‌بندی افغانی =================
// هجری شمسی با نام ماه‌های افغانی، هفته از شنبه، جمعه تعطیل، منطقهٔ زمانی کابل (UTC+4:30)
(function () {
  const TZ = 'Asia/Kabul';
  const MONTHS = ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'];
  const DAYS = { Saturday: 'شنبه', Sunday: 'یکشنبه', Monday: 'دوشنبه', Tuesday: 'سه‌شنبه', Wednesday: 'چهارشنبه', Thursday: 'پنجشنبه', Friday: 'جمعه' };
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const faDigits = s => String(s).replace(/\d/g, d => FA[d]);
  const latDigits = s => String(s).replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => d.charCodeAt(0) - 1632);

  const fmtP = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' });
  function parts(d = new Date()) {
    const o = {};
    fmtP.formatToParts(d).forEach(p => { o[p.type] = p.value; });
    return { y: parseInt(o.year || o.relatedYear, 10), m: parseInt(o.month, 10), d: parseInt(o.day, 10), wd: DAYS[o.weekday] || o.weekday };
  }
  const pad = n => String(n).padStart(2, '0');
  const AF = {
    MONTHS, DAYS, faDigits, latDigits, parts,
    date:   (d) => { const p = parts(d); return faDigits(p.d) + ' ' + MONTHS[p.m - 1] + ' ' + faDigits(p.y); },
    long:   (d) => { const p = parts(d); return p.wd + '، ' + faDigits(p.d) + ' ' + MONTHS[p.m - 1] + ' ' + faDigits(p.y); },
    numeric:(d) => { const p = parts(d); return faDigits(p.y + '/' + pad(p.m) + '/' + pad(p.d)); },
    time:   (d = new Date()) => '\u2066' + faDigits(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)) + '\u2069',
    hour:   (d = new Date()) => parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(d), 10),
    fromISO:(iso) => new Date(iso + 'T12:00:00+04:30'),                 // مقدار input[type=date]
    daysAgo:(n) => new Date(Date.now() - n * 864e5),
    greeting: () => { const h = AF.hour(); return h < 5 ? 'شب بخیر' : h < 12 ? 'صبح بخیر' : h < 17 ? 'روز بخیر' : h < 20 ? 'عصر بخیر' : 'شب بخیر'; },
  };
  window.AF = AF;
  window.afDate = AF.date; window.afDateLong = AF.long; window.afNumeric = AF.numeric;

  // زیر هر input[type=date] معادل افغانی (شمسی) نمایش داده می‌شود
  function dateHints() {
    document.querySelectorAll('input[type="date"]:not([data-af])').forEach(inp => {
      inp.dataset.af = '1';
      const h = document.createElement('small'); h.className = 'af-date-hint d-block mt-1';
      inp.insertAdjacentElement('afterend', h);
      const upd = () => { h.textContent = inp.value ? 'تاریخ شمسی: ' + AF.long(AF.fromISO(inp.value)) : ''; };
      inp.addEventListener('input', upd); inp.addEventListener('change', upd); upd();
    });
  }

  // ================= انیمیشن‌ها =================
  function stagger() {
    document.querySelectorAll('.glass-card:not(.modal-content), .stat-card').forEach((el, i) => {
      if (!el.style.animationDelay) el.style.animationDelay = Math.min(i * 70, 560) + 'ms';
    });
  }
  function countUp(el) {
    const txt = el.textContent, m = txt.match(/[0-9۰-۹٠-٩][0-9۰-۹٠-٩,٬.٫]*/);
    if (!m || el._busy) return;
    const tok = m[0], persian = /[۰-۹]/.test(tok), grouped = /[,٬]/.test(tok);
    const target = parseFloat(latDigits(tok).replace(/[,٬]/g, '').replace('٫', '.'));
    if (!isFinite(target) || target === 0) return;
    const pre = txt.slice(0, m.index), post = txt.slice(m.index + tok.length), t0 = performance.now(), dur = 900;
    el._busy = true;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      let s = grouped ? v.toLocaleString('en-US') : String(v);
      el.textContent = pre + (persian ? faDigits(s) : s) + post;
      if (k < 1) requestAnimationFrame(step); else { el.textContent = txt; setTimeout(() => (el._busy = false), 30); }
    })(t0);
  }
  function numbers() {
    document.querySelectorAll('.stat-number').forEach(el => {
      countUp(el);
      if (!el._obs) { el._obs = new MutationObserver(() => countUp(el)); el._obs.observe(el, { childList: true, characterData: true, subtree: true }); }
    });
  }
  const ready = f => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f();
  ready(() => { stagger(); dateHints(); setTimeout(numbers, 150); });
})();
