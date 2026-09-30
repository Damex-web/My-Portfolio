const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");

hamburger.addEventListener("click", function () {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});


navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.forEach(function (item) {
      item.classList.remove("active");
    });
    link.classList.add("active");

    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});
