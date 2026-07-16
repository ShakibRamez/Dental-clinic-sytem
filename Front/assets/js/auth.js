// auth.js - سیستم لاگین امن (نسخه نهایی)


// فعال کردن لینک فعال در سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});



<<<<<<< HEAD
// auth.js - سیستم لاگین امن 
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";
=======
// دریافت یوزر و پسورد از فرم لاگین
async function getUsers() {
    const response = await fetch('/api/users')
    const users = await response.json();
    return users;
}

>>>>>>> 1a8241998f75647f9defa5eb81b3c967ad0597e0

// لاگین کردن
async function login(username, password) {
    console.log(result);
    const response = await fetch("/api/users/login", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if(result.status){
        return true;
    }
    return false;


}












// چک کردن لاگین
async function checkLogin() {
    const isLoggedIn = await fetch("/api/users/checkLogin");
    console.log('isLoggedIn');
    if (!isLoggedIn.status) {
        alert("⚠️ شما وارد نشده‌اید!\nلطفاً ابتدا لاگین کنید.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// خروج از سیستم
async function logout() {
    if (confirm("آیا از خروج مطمئن هستید؟")) {
        const response = await fetch("/api/users/logout");
        if(response.status){
            window.location.href = "login.html";
        }
    }
}

// نمایش نام کاربر لاگین شده
// function getCurrentUser() {
//     return sessionStorage.getItem("username") || "کاربر";
// }

// اجرا خودکار چک لاگین (به جز صفحه لاگین)
if (!window.location.pathname.endsWith("login.html")) {
    console.log('run check');
    checkLogin();
}
console.log('object1'); 