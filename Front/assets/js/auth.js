// auth.js - سیستم لاگین امن (نسخه نهایی)


// فعال کردن لینک فعال در سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});


// auth.js - سیستم لاگین امن 
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";
// دریافت یوزر و پسورد از فرم لاگین
async function getUsers() {
    const response = await fetch('/api/users')
    const users = await response.json();

    return users;
}


login('ahmad', 'asd')

// لاگین کردن
async function login(username, password) {

    const response = await fetch('/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
            username,
            password
        })
    })

    const isLoggedIn = response.ok;
    if(isLoggedIn){
        sessionStorage.setItem('isLoggedIn', 'true')
        return isLoggedIn;
    }
    return isLoggedIn;
}



// چک کردن لاگین
async function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
        alert("⚠️ شما وارد نشده‌اید!\nلطفاً ابتدا لاگین کنید.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}


// اجرا خودکار چک لاگین (به جز صفحه لاگین)
if(!window.location.pathname.endsWith("login.html")) {
    checkLogin();
}





// خروج از سیستم
async function logout() {
    if (confirm("آیا از خروج مطمئن هستید؟")) {
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// نمایش نام کاربر لاگین شده
function getCurrentUser() {
    return sessionStorage.getItem("username") || "کاربر";
}











// async function login(username, password) {
//     const users = await getUsers();
//     const user = users.find(u => u.username === username && u.password_hash === password);
//     users.forEach(u => {
//         if(u.username === username && u.password_hash === password){
//             console.log(u)
//             sessionStorage.setItem('isLoggedIn', 'true')
//             return true;
//         }
//     });
//     return false;
// }
