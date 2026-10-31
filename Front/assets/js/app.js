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
