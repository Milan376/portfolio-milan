(() => {
  "use strict";

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Remove the loading screen and show the page.
  function hideLoader() {
    document.body.classList.add("loaded");

    const loader = $("#pageLoader");

    if (loader) {
      loader.classList.add("is-hidden");
      loader.style.display = "none";
    }

    $$(".reveal, .reveal-up, .fade-in").forEach((element) => {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    });
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }

  // Disable particle canvases.
  ["#dust-canvas", "#particles-js", ".particles"].forEach((selector) => {
    const element = $(selector);
    if (element) element.style.display = "none";
  });

  // Mobile navigation.
  const menuButton = $("#menuButton");
  const mobileMenu = $("#mobileMenu");

  function closeMenu() {
    mobileMenu?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open menu");
  }

  menuButton?.addEventListener("click", () => {
    const open = mobileMenu?.classList.toggle("open") ?? false;

    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );
  });

  $$("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Smooth internal navigation.
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      closeMenu();
    });
  });

  // Navbar scroll state.
  const navbar = $("#navbar");

  window.addEventListener(
    "scroll",
    () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 80);
    },
    { passive: true }
  );

  // Project images: hide broken images rather than showing broken icons.
  $$(".project-media img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  // Contact form feedback. This does not send an email.
  const form = $("#contactForm");
  const formStatus = $("#formStatus");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formStatus) {
      formStatus.textContent =
        "This form is not connected to an email service yet. Please email chhabramilan25@gmail.com directly.";
    }
  });

  // Back-to-top button.
  $("#backToTop")?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  // Automatic footer year.
  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
