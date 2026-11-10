// auth.js — session handling (no credentials stored on the client)
const isLoginPage = () => /(^|\/)login(\.html)?\/?$/.test(location.pathname);

// فهرست کاربران (برای تشخیص نقش در صفحهٔ loading)
async function getUsers() {
  const res = await fetch('/api/users', { credentials: 'same-origin' });
  if (!res.ok) throw new Error('users ' + res.status);
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { throw new Error('پاسخ /api/users JSON نیست'); }
}

async function getCurrentRole() {
  const me = sessionStorage.getItem('user_name');
  const users = await getUsers();
  const u = (Array.isArray(users) ? users : users.users || []).find(x => x.username === me);
  return (u && u.role ? String(u.role) : '').toLowerCase();
}

async function login(username, password) {
  let res;
  try {
    res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    console.error('[login] network error:', err);
    const hint = location.protocol === 'file:' ? ' (صفحه با file:// باز شده؛ باید از طریق سرور باز شود)' : ' (سرور بک‌اند روشن نیست یا آدرس /api درست نیست)';
    return { ok: false, message: 'ارتباط با سرور برقرار نشد' + hint };
  }
  if (res.status === 401 || res.status === 400) return { ok: false, message: 'نام کاربری یا رمز عبور اشتباه است' };
  if (!res.ok) { console.error('[login] HTTP', res.status); return { ok: false, message: 'خطای سرور (' + res.status + ')' }; }
  try {
    const data = await res.json();
    const user = data.user || data;
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('full_name', user.full_name || user.username || username);
    sessionStorage.setItem('user_name', user.username || username);
    return { ok: true };
  } catch (err) {
    console.error('[login] bad response shape:', err);
    return { ok: false, message: 'پاسخ سرور نامعتبر است (انتظار JSON با فیلد user)' };
  }
}

function checkLogin() {
  if (sessionStorage.getItem('isLoggedIn') === 'true') return true;
  (window.top || window).location.replace('login.html');
  return false;
}

function logout() {
  if (!confirm('آیا از خروج مطمئن هستید؟')) return;
  sessionStorage.clear();
  (window.top || window).location.replace('login.html');
}

function getCurrentUser() {
  return sessionStorage.getItem('full_name') || sessionStorage.getItem('user_name') || 'کاربر';
}

if (!isLoginPage()) checkLogin();
