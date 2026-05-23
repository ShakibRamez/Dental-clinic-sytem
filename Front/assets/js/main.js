// فعال کردن لینک فعال در سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// //اجازه ورد به صفحات فقط در صورت لاگین بودن
//   if (localStorage.getItem("isLoggedIn") !== "true") {
//       alert("شما وارد سیستم نشده‌اید! لطفاً ابتدا لاگین کنید.");
//       window.location.href = "login.html";
//   }


const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

// لاگین کردن
function login(username, password) {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("loginTime", Date.now());
        return true;
    }
    return false;
}

// چک کردن لاگین
function checkLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
        alert("⚠️ شما وارد نشده‌اید!\nلطفاً ابتدا لاگین کنید.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// خروج
function logout() {
    if (confirm("آیا از خروج مطمئن هستید؟")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

// نمایش نام کاربر
function getCurrentUser() {
    return localStorage.getItem("username") || "";
}

// اگر صفحه login نبود، چک کن
if (!window.location.pathname.endsWith("login.html") && 
    !window.location.pathname.endsWith("index.html")) {
    checkLogin();
}