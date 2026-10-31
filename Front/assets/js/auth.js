// auth.js — session handling (no credentials stored on the client)
const isLoginPage = () => /(^|\/)login(\.html)?\/?$/.test(location.pathname);

async function login(username, password) {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return { ok: false, message: res.status === 401 ? 'نام کاربری یا رمز عبور اشتباه است' : 'خطا در ورود، دوباره تلاش کنید' };
    const { user } = await res.json();
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('full_name', user.full_name || user.username);
    sessionStorage.setItem('user_name', user.username);
    return { ok: true };
  } catch {
    return { ok: false, message: 'ارتباط با سرور برقرار نشد' };
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
  return {full_name: sessionStorage.getItem('full_name'), user_name: sessionStorage.getItem('user_name')};
}

async function getAllUsers(){
  try{
    const response = await fetch("/api/users");

    if(!response.ok){
      throw new Error("Failed To Fetch Users!")
    }

    const users = await response.json();

    return users;
  }catch(error){
    console.error(error);
    return error;
  }
}

if (!isLoginPage()) checkLogin();
