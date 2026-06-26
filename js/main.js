/* ============================================================
   MELKITZEDEK — main.js  v=20260626
   ============================================================ */
(function () {
  'use strict';

  /* ── Sanity ── */
  var SANITY_PROJECT = '1jow8pp9';
  var SANITY_DATASET = 'production';
  var SANITY_CDN     = 'https://cdn.sanity.io';

  function sanityQuery(query) {
    var url = SANITY_CDN + '/v2021-10-21/data/query/' + SANITY_DATASET
      + '?projectId=' + SANITY_PROJECT
      + '&query=' + encodeURIComponent(query);
    return fetch(url).then(function (r) { return r.json(); }).then(function (d) { return d.result; });
  }

  function imageUrl(ref, width) {
    if (!ref) return null;
    var id = ref.replace(/^image-/, '').replace(/-([a-zA-Z]+)$/, '.$1');
    var base = SANITY_CDN + '/images/' + SANITY_PROJECT + '/' + SANITY_DATASET + '/' + id;
    return width ? base + '?w=' + width + '&auto=format' : base + '?auto=format';
  }

  /* ── DOM helpers ── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  /* Set text on an element — does nothing if value is empty */
  function txt(sel, val) {
    if (!val) return;
    var el = $(sel);
    if (el) el.textContent = val;
  }

  /* Set src on an <img> */
  function img(sel, url, alt) {
    if (!url) return;
    var el = $(sel);
    if (!el) return;
    el.src = url;
    if (alt) el.alt = alt;
  }

  /* Set href on an <a> */
  function href(sel, url) {
    if (!url) return;
    var el = $(sel);
    if (el) el.href = url;
  }

  /* Set innerHTML (for headings with <em> italic parts) */
  function heading(sel, full, italic) {
    if (!full) return;
    var el = $(sel);
    if (!el) return;
    if (italic && full.indexOf(italic) !== -1) {
      el.innerHTML = full.replace(italic, '<em>' + italic + '</em>');
    } else {
      el.textContent = full;
    }
  }

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[melki] ' + name + ':', e); }
  }

  /* ══════════════════════════════════════════════════════════
     NAV — solid on scroll, mobile menu, smooth anchor scroll
  ══════════════════════════════════════════════════════════ */
  function initNav() {
    var nav = $('.nav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
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

  /* ══════════════════════════════════════════════════════════
     HERO — Ken Burns zoom on image load
  ══════════════════════════════════════════════════════════ */
  function initHero() {
    var bg = $('.hero__bg');
    if (!bg) return;
    var i = bg.querySelector('img');
    if (!i) return;
    if (i.complete) bg.classList.add('is-loaded');
    else i.addEventListener('load', function () { bg.classList.add('is-loaded'); });
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEALS
     IntersectionObserver: adds class "on" when element enters
     viewport → CSS animates opacity 0→1 + translateY 24→0
  ══════════════════════════════════════════════════════════ */
  function initReveals() {
    var els = $$('.r');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('on'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('on'); }); }, 6000);
  }

  /* ══════════════════════════════════════════════════════════
     RADIO PLAYER
     HTML5 <audio> play/pause, waveform animation, volume
  ══════════════════════════════════════════════════════════ */
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
      audio.volume = parseFloat(volSlider.value) / 100;
      volSlider.addEventListener('input', function () { audio.volume = parseFloat(volSlider.value) / 100; });
    }
    if (wave && wave.children.length === 0) {
      for (var i = 0; i < 24; i++) {
        var bar = document.createElement('span');
        bar.style.height = (Math.floor(Math.random() * 22) + 6) + 'px';
        wave.appendChild(bar);
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     HOMEPAGE CONTENT (Sanity → DOM)

     Fetches the single "homepage" document.
     Every field maps to one element on the page via:
       txt(selector, value)     → el.textContent = value
       img(selector, url)       → el.src = url
       heading(sel, full, italic) → el.innerHTML with <em> wrap

     If a field is empty in the CMS, the hardcoded HTML stays
     unchanged — so the page always has content even if the
     CMS document hasn't been filled in yet.
  ══════════════════════════════════════════════════════════ */
  function initHomepageContent() {
    var q = '*[_type=="homepage"][0]{'
      + 'heroBg,heroEyebrow,heroTitle,heroTitleItalic,heroSubtitle,heroCta1,heroCta2,'
      + 'stat1Value,stat1Label,stat2Value,stat2Label,stat3Value,stat3Label,stat4Value,stat4Label,'
      + 'sermonsEyebrow,sermonsTitle,sermonsViewAll,'
      + 'aboutImage,aboutEyebrow,aboutTitle,aboutTitleItalic,aboutBody,aboutCta,'
      + 'eventsEyebrow,eventsTitle,'
      + 'ministriesEyebrow,ministriesTitle,'
      + 'devEyebrow,devTitle,devQuote,devReference,devBody,'
      + 'prayerEyebrow,prayerTitle,prayerSubtitle,'
      + 'visitEyebrow,visitTitle,visitTitleItalic,visitSubtitle,visitCta1,visitCta2,'
      + 'visitTime1Label,visitTime1Time,visitTime1Sub,visitTime2Label,visitTime2Time,visitTime2Sub,'
      + 'contactEyebrow,contactTitle,contactHours,contactFormTitle'
      + '}';

    sanityQuery(q).then(function (hp) {
      if (!hp) return;

      /* Hero */
      if (hp.heroBg && hp.heroBg.asset) img('.hero__bg img', imageUrl(hp.heroBg.asset._ref, 1920), 'Hero');
      txt('.hero__eyebrow', hp.heroEyebrow);
      heading('.hero__title', hp.heroTitle, hp.heroTitleItalic);
      txt('.hero__sub', hp.heroSubtitle);
      txt('.hero__actions .btn-gold', hp.heroCta1);
      txt('.hero__actions .btn-outline-white', hp.heroCta2);

      /* Stats bar — each stat has a value span + label span */
      var stats = document.querySelectorAll('.hero__stat');
      /* stats[0]=stat1, stats[1]=stat2, stats[2]=stat3, stats[3]=stat4 */
      var sd = [
        { v: hp.stat1Value, l: hp.stat1Label },
        { v: hp.stat2Value, l: hp.stat2Label },
        { v: hp.stat3Value, l: hp.stat3Label },
        { v: hp.stat4Value, l: hp.stat4Label },
      ];
      stats.forEach(function (stat, i) {
        if (!sd[i]) return;
        var numEl = stat.querySelector('.hero__stat-num');
        var lblEl = stat.querySelector('.hero__stat-label');
        if (numEl && sd[i].v) numEl.textContent = sd[i].v;
        if (lblEl && sd[i].l) lblEl.textContent = sd[i].l;
      });

      /* Sermons section header */
      txt('.sermons .eyebrow', hp.sermonsEyebrow);
      txt('#sermons-heading', hp.sermonsTitle);
      if (hp.sermonsViewAll) href('.sermons .link-more', hp.sermonsViewAll);

      /* About */
      if (hp.aboutImage && hp.aboutImage.asset) img('.about__img img', imageUrl(hp.aboutImage.asset._ref, 800), 'Our congregation');
      txt('.about__text .eyebrow', hp.aboutEyebrow);
      heading('.about__text .section-title', hp.aboutTitle, hp.aboutTitleItalic);
      txt('.about__body', hp.aboutBody);
      txt('.about__text .btn-outline-dark', hp.aboutCta);

      /* Events section header */
      txt('.events .eyebrow', hp.eventsEyebrow);
      txt('#events-heading', hp.eventsTitle);

      /* Ministries section header */
      txt('.ministries .eyebrow', hp.ministriesEyebrow);
      txt('#min-heading', hp.ministriesTitle);

      /* Devotional */
      txt('.dp__devotional .eyebrow', hp.devEyebrow);
      txt('.dp__devotional .section-title', hp.devTitle);
      if (hp.devQuote) {
        var qp = $('.dp__quote p');
        if (qp) qp.textContent = '“' + hp.devQuote + '”';
      }
      txt('.dp__quote footer', hp.devReference);
      txt('.dp__body', hp.devBody);

      /* Prayer */
      txt('.dp__prayer .eyebrow', hp.prayerEyebrow);
      txt('.dp__prayer .section-title', hp.prayerTitle);
      txt('.dp__prayer-sub', hp.prayerSubtitle);

      /* Visit CTA */
      txt('.visit__text .eyebrow', hp.visitEyebrow);
      heading('.visit__title', hp.visitTitle, hp.visitTitleItalic);
      txt('.visit__sub', hp.visitSubtitle);
      txt('.visit__actions .btn-gold', hp.visitCta1);
      txt('.visit__actions .btn-outline-white', hp.visitCta2);
      txt('.visit__time-card:nth-child(1) .visit__time-label', hp.visitTime1Label);
      txt('.visit__time-card:nth-child(1) .visit__time',       hp.visitTime1Time);
      txt('.visit__time-card:nth-child(1) .visit__time-sub',   hp.visitTime1Sub);
      txt('.visit__time-card:nth-child(2) .visit__time-label', hp.visitTime2Label);
      txt('.visit__time-card:nth-child(2) .visit__time',       hp.visitTime2Time);
      txt('.visit__time-card:nth-child(2) .visit__time-sub',   hp.visitTime2Sub);

      /* Contact section */
      txt('.contact .eyebrow', hp.contactEyebrow);
      txt('#contact-heading', hp.contactTitle);
      txt('.contact__list li:nth-child(2) span', hp.contactHours);
      txt('.contact__form-title', hp.contactFormTitle);

    }).catch(function (e) { console.warn('[melki] homepage:', e); });
  }

  /* ══════════════════════════════════════════════════════════
     SETTINGS (Sanity → DOM)
     Site-wide values: contact info, social links, radio URL,
     service times, footer tagline
  ══════════════════════════════════════════════════════════ */
  function initSettings() {
    sanityQuery('*[_type=="settings"][0]{churchName,tagline,phone,email,address,mapUrl,facebook,instagram,youtube,radioStreamUrl,tuneInUrl,radioDescription,sundayTime,wednesdayTime}')
      .then(function (s) {
        if (!s) return;

        /* Radio */
        if (s.radioStreamUrl) {
          var audio = document.getElementById('radio-audio');
          if (audio) audio.src = s.radioStreamUrl;
        }
        txt('.radio__name', s.churchName ? s.churchName + ' Radio' : null);
        txt('#radio-now', s.radioDescription);
        href('.radio__tunein', s.tuneInUrl);
        href('.footer__socials a[aria-label="TuneIn Radio"]', s.tuneInUrl);

        /* Social links — appear in both nav and footer */
        $$('a[aria-label="Facebook"]').forEach(function (a)  { if (s.facebook)  a.href = s.facebook; });
        $$('a[aria-label="Instagram"]').forEach(function (a) { if (s.instagram) a.href = s.instagram; });
        $$('a[aria-label="YouTube"]').forEach(function (a)   { if (s.youtube)   a.href = s.youtube; });

        /* Contact info */
        if (s.address) txt('.contact__list li:nth-child(1) span', s.address);
        if (s.email) {
          $$('a[href^="mailto"]').forEach(function (a) { a.href = 'mailto:' + s.email; a.textContent = s.email; });
        }
        if (s.phone) {
          var tel = $('a[href^="tel"]');
          if (tel) { tel.href = 'tel:' + s.phone.replace(/\s/g, ''); tel.textContent = s.phone; }
        }
        if (s.mapUrl) href('a[href*="maps"]', s.mapUrl);

        /* Footer */
        txt('.footer__tagline', s.tagline);
        if (s.churchName) txt('.footer__copy', '© 2026 ' + s.churchName);

        /* Footer service times column */
        var ftItems = $$('.footer__col:last-child ul li');
        if (ftItems[0] && s.sundayTime)    ftItems[0].textContent = 'Sunday ' + s.sundayTime;
        if (ftItems[1] && s.wednesdayTime) ftItems[1].textContent = 'Wednesday ' + s.wednesdayTime;
        if (ftItems[3] && s.email) {
          ftItems[3].innerHTML = '<a href="mailto:' + s.email + '">' + s.email + '</a>';
        }

        /* Nav church name */
        txt('.nav__name', s.churchName);

      }).catch(function (e) { console.warn('[melki] settings:', e); });
  }

  /* ══════════════════════════════════════════════════════════
     SERMONS (Sanity → DOM)
     Fetches 3 newest sermons, replaces the grid HTML.
     Falls back to hardcoded cards if Sanity returns nothing.
  ══════════════════════════════════════════════════════════ */
  function initSermons() {
    var grid = $('.sermons__grid');
    if (!grid) return;
    sanityQuery('*[_type=="sermon"] | order(date desc)[0...3]{_id,title,date,pastor,scripture,videoUrl,thumbnail}')
      .then(function (sermons) {
        if (!sermons || !sermons.length) return;
        grid.innerHTML = sermons.map(function (s) {
          var d = new Date(s.date);
          var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          var thumb = (s.thumbnail && s.thumbnail.asset) ? imageUrl(s.thumbnail.asset._ref, 600) : 'assets/img/sermons.jpg';
          var link  = s.videoUrl || '#';
          return '<article class="s-card r">'
            + '<div class="s-card__thumb">'
            + '<img src="' + thumb + '" alt="' + s.title + '" loading="lazy" />'
            + '<div class="s-card__overlay"></div>'
            + '<div class="s-card__play"><svg viewBox="0 0 44 44" fill="none" width="44" height="44"><circle cx="22" cy="22" r="22" fill="rgba(13,27,62,0.6)"/><polygon points="18,14 32,22 18,30" fill="white"/></svg></div>'
            + '</div>'
            + '<div class="s-card__body">'
            + '<p class="s-card__date">' + dateStr + '</p>'
            + '<h3 class="s-card__title">' + s.title + '</h3>'
            + '<p class="s-card__meta">' + (s.pastor || '') + (s.scripture ? ' · ' + s.scripture : '') + '</p>'
            + '<a href="' + link + '" class="s-card__link" target="_blank" rel="noopener">Watch now →</a>'
            + '</div></article>';
        }).join('');
        $$('.s-card.r', grid).forEach(function (el) {
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      }).catch(function (e) { console.warn('[melki] sermons:', e); });
  }

  /* ══════════════════════════════════════════════════════════
     EVENTS (Sanity → DOM)
     Fetches 5 upcoming events sorted by date ascending.
  ══════════════════════════════════════════════════════════ */
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
            + '<div class="e-item__date"><p class="e-item__month">' + months[d.getMonth()] + '</p><p class="e-item__day">' + d.getDate() + '</p></div>'
            + '<div class="e-item__sep" aria-hidden="true"></div>'
            + '<div class="e-item__info"><h3 class="e-item__title">' + ev.title + '</h3>'
            + '<p class="e-item__when">' + (ev.time || '') + (ev.location ? ' · ' + ev.location : '') + '</p></div>'
            + (ev.badge ? '<span class="e-item__badge">' + ev.badge + '</span>' : '')
            + '</article>';
        }).join('');
        $$('.e-item.r', list).forEach(function (el) {
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      }).catch(function (e) { console.warn('[melki] events:', e); });
  }

  /* ══════════════════════════════════════════════════════════
     MINISTRIES (Sanity → DOM)
     Each ministry has title, description, and an icon key.
     The icon key maps to an SVG path in the icons object.
  ══════════════════════════════════════════════════════════ */
  function initMinistries() {
    var grid = $('.min__grid');
    if (!grid) return;
    var icons = {
      cross:  '<path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      music:  '<path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.8"/>',
      people: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      book:   '<path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      heart:  '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      star:   '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      home:   '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      globe:  '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" stroke-width="1.8"/>',
    };
    sanityQuery('*[_type=="ministry"] | order(order asc){_id,title,description,icon}')
      .then(function (ministries) {
        if (!ministries || !ministries.length) return;
        grid.innerHTML = ministries.map(function (m, i) {
          var delay = i > 0 ? ' r-d' + Math.min(i, 4) : '';
          var path = icons[m.icon] || icons['cross'];
          return '<div class="min__card r' + delay + '">'
            + '<div class="min__icon"><svg viewBox="0 0 24 24" fill="none">' + path + '</svg></div>'
            + '<h3 class="min__title">' + m.title + '</h3>'
            + '<p class="min__desc">' + (m.description || '') + '</p>'
            + '</div>';
        }).join('');
        $$('.min__card.r', grid).forEach(function (el) {
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      }).catch(function (e) { console.warn('[melki] ministries:', e); });
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

  /* ── GSAP parallax (optional) ── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    var heroBg = $('.hero__bg img');
    if (heroBg) {
      gsap.to(heroBg, { yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    safe(initNav,             'nav');
    safe(initHero,            'hero');
    safe(initReveals,         'reveals');
    safe(initRadio,           'radio');
    safe(initHomepageContent, 'homepage');
    safe(initSettings,        'settings');
    safe(initSermons,         'sermons');
    safe(initEvents,          'events');
    safe(initMinistries,      'ministries');
    safe(initForms,           'forms');
    safe(initGSAP,            'gsap');
  });

})();
