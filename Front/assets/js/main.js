// فعال کردن لینک فعال در سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

//اجازه ورد به صفحات فقط در صورت لاگین بودن
  if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("شما وارد سیستم نشده‌اید! لطفاً ابتدا لاگین کنید.");
      window.location.href = "login.html";
  }