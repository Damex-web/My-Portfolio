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

/* CONTACT FORM */
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const buttonLabel = submitBtn.querySelector(".button-label");
const formStatus = document.getElementById("formStatus");
const formSubmitEndpoint =
  "https://formsubmit.co/ajax/damexcodeyoruba@gmail.com";
const minimumSubmitTime = 3000;
let formStartedAt = Date.now();
let statusTimeout;

function showFormStatus(message, type) {
  window.clearTimeout(statusTimeout);
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.hidden = false;

  if (type === "success") {
    statusTimeout = window.setTimeout(function () {
      formStatus.hidden = true;
    }, 7000);
  }
}

contactForm.addEventListener("input", function () {
  if (!formStatus.hidden) {
    window.clearTimeout(statusTimeout);
    formStatus.hidden = true;
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }
});

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (Date.now() - formStartedAt < minimumSubmitTime) {
    showFormStatus(
      "Please wait a moment before submitting your message.",
      "error",
    );
    return;
  }

  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  submitBtn.classList.add("is-sending");
  buttonLabel.textContent = "Sending...";
  formStatus.hidden = true;

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new FormData(contactForm),
    });
    const result = await response.json();

    if (
      !response.ok ||
      (result.success !== true && result.success !== "true")
    ) {
      throw new Error(
        result.message || "The form service rejected the message.",
      );
    }

    contactForm.reset();
    formStartedAt = Date.now();
    showFormStatus(
      "Your message was submitted. I'll get back to you soon.",
      "success",
    );
  } catch (error) {
    console.error("Contact form submission failed.", error);
    showFormStatus(
      "Your message could not be sent. Please try again.",
      "error",
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.setAttribute("aria-busy", "false");
    submitBtn.classList.remove("is-sending");
    buttonLabel.textContent = "Send Message";
  }
});
