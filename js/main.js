/* ============================================================
   MELKITZEDEK — main.js  v=20260626
   ============================================================ */
(function () {
  'use strict';

  /* ── Sanity config ── */
  var SANITY_PROJECT = '1jow8pp9';
  var SANITY_DATASET = 'production';
  var SANITY_CDN     = 'https://cdn.sanity.io';

  function sanityQuery(query) {
    var url = SANITY_CDN + '/v2021-10-21/data/query/' + SANITY_DATASET
      + '?projectId=' + SANITY_PROJECT
      + '&query=' + encodeURIComponent(query);
    return fetch(url).then(function (r) { return r.json(); }).then(function (d) { return d.result; });
  }

  function imageUrl(ref) {
    if (!ref) return 'assets/img/sermons.jpg';
    var parts = ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1').split('-');
    return SANITY_CDN + '/images/' + SANITY_PROJECT + '/' + SANITY_DATASET + '/' + parts.join('-');
  }

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
      nav.classList.toggle('solid', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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

    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      });
    });
  }

  /* ── Hero ── */
  function initHero() {
    var bg = $('.hero__bg');
    if (!bg) return;
    var img = bg.querySelector('img');
    if (!img) return;
    if (img.complete) bg.classList.add('is-loaded');
    else img.addEventListener('load', function () { bg.classList.add('is-loaded'); });
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
    setTimeout(function () { els.forEach(function (el) { el.classList.add('on'); }); }, 6000);
  }

  /* ── Radio player ── */
  function initRadio() {
    var audio = document.getElementById('radio-audio');
    if (!audio) return;

    var playBtn   = document.getElementById('radio-play');
    var wave      = $('.radio__wave');
    var volSlider = $('.radio__vol-slider');
    var navPill   = document.getElementById('nav-radio-btn');
    var playing   = false;

    function setPlaying(val) {
      playing = val;
      if (playing) {
        audio.play().catch(function () { setPlaying(false); });
        if (wave) wave.classList.add('playing');
        if (playBtn) playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      } else {
        audio.pause();
        if (wave) wave.classList.remove('playing');
        if (playBtn) playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>';
      }
    }

    if (playBtn) playBtn.addEventListener('click', function () { setPlaying(!playing); });

    if (navPill) {
      navPill.addEventListener('click', function () {
        var sec = document.getElementById('radio');
        if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
        setTimeout(function () { setPlaying(!playing); }, 400);
      });
    }

    if (volSlider) {
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', function () { audio.volume = parseFloat(volSlider.value); });
    }

    if (wave && wave.children.length === 0) {
      for (var i = 0; i < 24; i++) {
        var bar = document.createElement('span');
        bar.style.height = (Math.floor(Math.random() * 22) + 6) + 'px';
        wave.appendChild(bar);
      }
    }
  }

  /* ── Sanity: Sermons ── */
  function initSermons() {
    var grid = $('.sermons__grid');
    if (!grid) return;

    sanityQuery('*[_type=="sermon"] | order(date desc)[0...3]{_id,title,date,pastor,scripture,videoUrl,thumbnail}')
      .then(function (sermons) {
        if (!sermons || !sermons.length) return;
        grid.innerHTML = sermons.map(function (s) {
          var d = new Date(s.date);
          var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          var thumb = s.thumbnail ? imageUrl(s.thumbnail.asset._ref) : 'assets/img/sermons.jpg';
          var link = s.videoUrl || '#';
          return '<article class="s-card r">'
            + '<div class="s-card__thumb">'
            + '<img src="' + thumb + '" alt="' + s.title + '" loading="lazy" />'
            + '<div class="s-card__overlay"></div>'
            + '<div class="s-card__play"><svg viewBox="0 0 24 24" fill="white" width="44" height="44"><circle cx="12" cy="12" r="12" fill="rgba(13,27,62,0.6)"/><polygon points="10,8 18,12 10,16"/></svg></div>'
            + '</div>'
            + '<div class="s-card__body">'
            + '<p class="s-card__date">' + dateStr + '</p>'
            + '<h3 class="s-card__title">' + s.title + '</h3>'
            + '<p class="s-card__meta">' + (s.pastor || '') + (s.scripture ? ' · ' + s.scripture : '') + '</p>'
            + '<a href="' + link + '" class="s-card__link" target="_blank" rel="noopener">Watch now →</a>'
            + '</div>'
            + '</article>';
        }).join('');

        /* re-observe new elements */
        $$('.s-card.r', grid).forEach(function (el) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
          }, { threshold: 0.05 });
          io.observe(el);
        });
      })
      .catch(function (err) { console.warn('[melki] sermons fetch:', err); });
  }

  /* ── Sanity: Events ── */
  function initEvents() {
    var list = $('.e-list');
    if (!list) return;

    sanityQuery('*[_type=="event"] | order(date asc)[0...5]{_id,title,date,time,location,badge}')
      .then(function (events) {
        if (!events || !events.length) return;
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        list.innerHTML = events.map(function (ev, i) {
          var d = new Date(ev.date + 'T12:00:00');
          var delay = i > 0 ? ' r-d' + Math.min(i, 4) : '';
          return '<article class="e-item r' + delay + '">'
            + '<div class="e-item__date">'
            + '<p class="e-item__month">' + months[d.getMonth()] + '</p>'
            + '<p class="e-item__day">' + d.getDate() + '</p>'
            + '</div>'
            + '<div class="e-item__sep" aria-hidden="true"></div>'
            + '<div class="e-item__info">'
            + '<h3 class="e-item__title">' + ev.title + '</h3>'
            + '<p class="e-item__when">' + (ev.time || '') + (ev.location ? ' · ' + ev.location : '') + '</p>'
            + '</div>'
            + (ev.badge ? '<span class="e-item__badge">' + ev.badge + '</span>' : '')
            + '</article>';
        }).join('');

        $$('.e-item.r', list).forEach(function (el) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
          }, { threshold: 0.05 });
          io.observe(el);
        });
      })
      .catch(function (err) { console.warn('[melki] events fetch:', err); });
  }

  /* ── Forms ── */
  function initForms() {
    ['contact', 'prayer'].forEach(function (name) {
      var form = $('form[name="' + name + '"]');
      if (!form) return;
      form.addEventListener('submit', function () {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      });
    });
  }

  /* ── GSAP (optional) ── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    var heroBg = $('.hero__bg img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    safe(initNav,     'nav');
    safe(initHero,    'hero');
    safe(initReveals, 'reveals');
    safe(initRadio,   'radio');
    safe(initSermons, 'sermons');
    safe(initEvents,  'events');
    safe(initForms,   'forms');
    safe(initGSAP,    'gsap');
  });

})();
