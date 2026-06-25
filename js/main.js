/* ============================================================
   MELKITZEDEK v2 — main.js (Bold Modern Redesign)
   IIFE — no ES modules — works everywhere
   v=20260625b
   ============================================================ */
(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[melki:" + name + "]", e); }
  }

  /* ── NAV ── */
  function initNav() {
    var nav    = document.getElementById("nav");
    var burger = document.getElementById("burger");
    var menu   = document.getElementById("mobile-menu");
    if (!nav) return;

    function update() {
      var scrolled = window.scrollY > 80;
      if (scrolled) nav.classList.add("solid"); else nav.classList.remove("solid");
      /* Switch to light nav on light sections */
      var hero = document.querySelector(".hero");
      if (hero) {
        var heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom < 0) nav.classList.add("nav--light"); else nav.classList.remove("nav--light");
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    update();

    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.setAttribute("aria-expanded", open);
        menu.setAttribute("aria-hidden", !open);
        document.body.style.overflow = open ? "hidden" : "";
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ── SMOOTH SCROLL ── */
  function initScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 68;
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ── REVEAL — IntersectionObserver ── */
  function initReveals() {
    var items = document.querySelectorAll(".r");
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -3% 0px" });
    items.forEach(function (el) { io.observe(el); });
    /* Safety: 6s fallback */
    setTimeout(function () {
      document.querySelectorAll(".r:not(.on)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("on");
      });
    }, 6000);
  }

  /* ── HERO IMAGE SUBTLE ZOOM ON LOAD ── */
  function initHeroImg() {
    var wrap = document.getElementById("hero-img");
    if (!wrap) return;
    var img = wrap.querySelector("img");
    if (!img) return;
    if (img.complete) { wrap.classList.add("is-loaded"); return; }
    img.addEventListener("load", function () { wrap.classList.add("is-loaded"); });
  }

  /* ── GSAP PARALLAX & SCROLL EFFECTS ── */
  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero image parallax */
    var heroImg = document.querySelector(".hero__img");
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    /* Mission quote letter stagger */
    var mq = document.querySelector(".mission__quote");
    if (mq) {
      gsap.fromTo(mq, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: mq, start: "top 80%" }
      });
    }

    /* Sermon cards stagger */
    var cards = document.querySelectorAll(".s-card");
    if (cards.length) {
      gsap.fromTo(cards, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".sermons__grid", start: "top 82%" }
      });
    }

    /* Event items stagger */
    var eItems = document.querySelectorAll(".e-item");
    if (eItems.length) {
      gsap.fromTo(eItems, { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power2.out",
        scrollTrigger: { trigger: ".e-list", start: "top 82%" }
      });
    }
  }

  /* ── PHOTO CREDITS ── */
  function initCredits() {
    var el = document.getElementById("photo-credits");
    if (!el) return;
    fetch("assets/credits.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.length) return;
        el.innerHTML = data.map(function (c) {
          return '<a href="' + (c.license_url || "#") + '" target="_blank" rel="noopener">'
            + (c.title || "photo") + ' &copy; ' + (c.creator || "unknown") + "</a>";
        }).join(" · ");
      })
      .catch(function () {});
  }

  /* ── CONTACT FORM ── */
  function initForm() {
    var form = document.querySelector(".contact__form form");
    if (!form) return;
    form.addEventListener("submit", function () {
      var btn = form.querySelector("[type=submit]");
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
    });
  }

  /* ── BOOT ── */
  function boot() {
    safe(initNav,      "nav");
    safe(initScroll,   "scroll");
    safe(initReveals,  "reveals");
    safe(initHeroImg,  "heroImg");
    safe(initGsap,     "gsap");
    safe(initCredits,  "credits");
    safe(initForm,     "form");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
