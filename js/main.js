/* ============================================================
   MELKITZEDEK — main.js  v=20260626
   ============================================================ */
(function () {
  'use strict';

  /* ── Helpers ── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[melki] ' + name + ':', e); }
  }

  /* ── Nav ── */
  function initNav() {
    var nav = $('.nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 40) {
        nav.classList.add('solid');
      } else {
        nav.classList.remove('solid');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Burger / mobile menu */
    var burger = $('.nav__burger');
    var mobile = $('.nav__mobile');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        mobile.classList.toggle('open');
        document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
      });
      $$('.nav__mobile a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobile.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* Smooth scroll for anchor links */
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Hero ── */
  function initHero() {
    var bg = $('.hero__bg');
    if (!bg) return;
    var img = bg.querySelector('img');
    if (!img) return;
    if (img.complete) {
      bg.classList.add('is-loaded');
    } else {
      img.addEventListener('load', function () { bg.classList.add('is-loaded'); });
    }
  }

  /* ── Reveal on scroll ── */
  function initReveals() {
    var els = $$('.r');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });

    /* Safety timeout — reveal everything after 6s */
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('on'); });
    }, 6000);
  }

  /* ── Radio player ── */
  function initRadio() {
    var audio = document.getElementById('radio-audio');
    if (!audio) return;

    var playBtn   = document.getElementById('radio-play');
    var wave      = $('.radio__wave');
    var volSlider = $('.radio__vol-slider');
    var navPill   = document.getElementById('nav-radio-btn');

    var playing = false;

    function setPlaying(val) {
      playing = val;
      if (playing) {
        audio.play().catch(function () { setPlaying(false); });
        if (wave) wave.classList.add('playing');
        if (playBtn) {
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
        }
      } else {
        audio.pause();
        if (wave) wave.classList.remove('playing');
        if (playBtn) {
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>';
        }
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () { setPlaying(!playing); });
    }

    if (navPill) {
      navPill.addEventListener('click', function () {
        var radioSec = document.getElementById('radio');
        if (radioSec) {
          var offset = 64;
          var top = radioSec.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
        setTimeout(function () { setPlaying(!playing); }, 400);
      });
    }

    if (volSlider) {
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', function () {
        audio.volume = parseFloat(volSlider.value);
      });
    }

    /* Build waveform bars */
    if (wave && wave.children.length === 0) {
      for (var i = 0; i < 24; i++) {
        var bar = document.createElement('span');
        bar.style.height = (Math.floor(Math.random() * 22) + 6) + 'px';
        wave.appendChild(bar);
      }
    }
  }

  /* ── Contact form ── */
  function initContactForm() {
    var form = $('form[name="contact"]');
    if (!form) return;
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    });
  }

  /* ── Prayer form ── */
  function initPrayerForm() {
    var form = $('form[name="prayer"]');
    if (!form) return;
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }
    });
  }

  /* ── GSAP (optional) ── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var heroBg = $('.hero__bg img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    safe(initNav,         'nav');
    safe(initHero,        'hero');
    safe(initReveals,     'reveals');
    safe(initRadio,       'radio');
    safe(initContactForm, 'contact-form');
    safe(initPrayerForm,  'prayer-form');
    safe(initGSAP,        'gsap');
  });

})();
