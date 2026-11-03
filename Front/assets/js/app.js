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
  function fillDates() {
    document.querySelectorAll('[data-af-ago]').forEach(e => { e.textContent = AF.numeric(AF.daysAgo(+e.dataset.afAgo)); });
    document.querySelectorAll('[data-af-year]').forEach(e => { e.textContent = AF.faDigits(AF.parts().y); });
  }
  ready(() => { fillDates(); stagger(); dateHints(); setTimeout(numbers, 150); });
})();

// ================= صفحه‌بندی (Pagination) =================
// هر لیست/جدول بعد از تعداد مشخص (پیش‌فرض ۱۰ مورد) به صفحهٔ بعد می‌رود.
// با تغییر داده‌ها (ثبت، حذف، جست‌وجو) خودکار دوباره محاسبه می‌شود.
(function () {
  const AUTO = { patientsBody: 10, appointmentsBody: 10, visitsBody: 10, invoicesBody: 10, inventoryBody: 10, usersBody: 10, backupsBody: 10, doctorsContainer: 6, plansContainer: 6 };
  const fa = n => (window.AF ? AF.faDigits(n) : String(n));

  function paginate(container, def) {
    if (!container || container._pager) return;
    const key = 'pgSize:' + location.pathname.split('/').pop() + ':' + container.id;
    const sizes = def <= 6 ? [6, 12, 24, 0] : [5, 10, 20, 50, 0];
    let size = parseInt(localStorage.getItem(key), 10);
    if (isNaN(size) || !sizes.includes(size)) size = def;
    let page = 1, prevCount = -1, queued = false;

    const bar = document.createElement('div');
    bar.className = 'pager d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3';
    bar.innerHTML = '<div class="small text-muted pager-info"></div><nav aria-label="صفحه‌بندی"><ul class="pagination pagination-sm mb-0 pager-pages"></ul></nav>' +
      '<label class="d-flex align-items-center gap-2 small text-muted mb-0">در هر صفحه<select class="form-select form-select-sm w-auto">' +
      sizes.map(s => `<option value="${s}">${s ? fa(s) : 'همه'}</option>`).join('') + '</select></label>';
    const host = container.closest('.table-responsive') || (container.tagName === 'TBODY' ? container.closest('table') : container);
    host.insertAdjacentElement('afterend', bar);
    const info = bar.querySelector('.pager-info'), ul = bar.querySelector('ul'), sel = bar.querySelector('select');
    sel.value = size;
    sel.onchange = () => { size = parseInt(sel.value, 10); localStorage.setItem(key, size); page = 1; render(true); };

    function pageList(cur, total) {                     // ۱ … ۴ ۵ ۶ … ۹
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      const s = new Set([1, total, cur, cur - 1, cur + 1]);
      if (cur <= 3) [2, 3, 4].forEach(x => s.add(x));
      if (cur >= total - 2) [total - 1, total - 2, total - 3].forEach(x => s.add(x));
      const arr = [...s].filter(x => x >= 1 && x <= total).sort((a, b) => a - b), out = [];
      arr.forEach((x, i) => { if (i && x - arr[i - 1] > 1) out.push('…'); out.push(x); });
      return out;
    }

    function render(animate) {
      queued = false;
      const items = [...container.children];
      const total = items.length;
      if (prevCount !== -1 && Math.abs(total - prevCount) > 1) page = 1;   // جست‌وجو/فیلتر → از صفحهٔ اول
      prevCount = total;
      const per = size || total || 1, pages = Math.max(1, Math.ceil(total / per));
      page = Math.min(Math.max(1, page), pages);
      const from = (page - 1) * per, to = from + per;
      let k = 0;
      items.forEach((el, i) => {
        const show = i >= from && i < to;
        el.classList.toggle('pg-hide', !show);
        if (show) { el.style.animationDelay = Math.min(k++ * 40, 400) + 'ms'; if (animate) { el.style.animationName = 'none'; void el.offsetWidth; el.style.animationName = ''; } }
      });
      bar.classList.toggle('d-none', total === 0);
      info.textContent = total ? `نمایش ${fa(from + 1)} تا ${fa(Math.min(to, total))} از ${fa(total)} مورد` : '';
      ul.innerHTML = '';
      const li = (html, p, cls = '') => {
        const e = document.createElement('li'); e.className = 'page-item ' + cls;
        e.innerHTML = `<a class="page-link" href="#" ${p ? '' : 'tabindex="-1"'}>${html}</a>`;
        if (p) e.firstChild.onclick = ev => { ev.preventDefault(); page = p; render(true); host.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
        ul.appendChild(e);
      };
      ul.classList.toggle('d-none', pages <= 1);
      li('<i class="bi bi-chevron-right"></i> قبلی', page > 1 ? page - 1 : 0, page === 1 ? 'disabled' : '');
      pageList(page, pages).forEach(x => x === '…' ? li('…', 0, 'disabled') : li(fa(x), x, x === page ? 'active' : ''));
      li('بعدی <i class="bi bi-chevron-left"></i>', page < pages ? page + 1 : 0, page === pages ? 'disabled' : '');
    }

    const mo = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => render(false)); } });
    mo.observe(container, { childList: true });
    container._pager = { render, go: p => { page = p; render(true); } };
    render(false);
  }
  window.paginate = paginate;

  const ready = f => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f();
  ready(() => {
    Object.entries(AUTO).forEach(([id, n]) => paginate(document.getElementById(id), n));
    document.querySelectorAll('[data-paginate]').forEach(c => paginate(c, parseInt(c.dataset.paginate, 10) || 10));
  });
})();
