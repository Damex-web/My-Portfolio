const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const themeToggle = document.getElementById("themeToggle");
const themeStorageKey = "dcy-portfolio-theme";

function getSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    return savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "light";
  } catch (error) {
    console.error("Unable to read the saved theme preference.", error);
    return "light";
  }
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  const nextThemeLabel = `Switch to ${isDark ? "light" : "dark"} theme`;
  themeToggle.setAttribute("aria-label", nextThemeLabel);
  themeToggle.title = nextThemeLabel;
}

setTheme(getSavedTheme());

themeToggle.addEventListener("click", function () {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);

  try {
    window.localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    console.error("Unable to save the theme preference.", error);
  }
});

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

/* SCROLL-SPY */
const sections = document.querySelectorAll("section[id]");
const spy = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) {
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + entry.target.id,
          );
        });
      }
    });
  },
  { threshold: 0.5 },
);
sections.forEach(function (s) {
  spy.observe(s);
});

/* PROJECT FILTER */
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach(function (card) {
      card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
    });
  });
});

/* STICKY NAVBAR SHADOW */
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});
