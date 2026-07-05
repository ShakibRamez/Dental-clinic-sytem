// فعال کردن لینک فعال در سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});



// auth.js - سیستم لاگین امن (نسخه نهایی)

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

// لاگین کردن
function login(username, password) {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("loginTime", Date.now());
        return true;
    }
    return false;
}

// چک کردن لاگین
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
        alert("⚠️ شما وارد نشده‌اید!\nلطفاً ابتدا لاگین کنید.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// خروج از سیستم
function logout() {
    if (confirm("آیا از خروج مطمئن هستید؟")) {
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// نمایش نام کاربر لاگین شده
function getCurrentUser() {
    return sessionStorage.getItem("username") || "کاربر";
}

// اجرا خودکار چک لاگین (به جز صفحه لاگین)
if (!window.location.pathname.endsWith("login.html")) {
    checkLogin();
}