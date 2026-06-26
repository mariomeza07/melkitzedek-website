/* ============================================================
   MELKITZEDEK — main.js  v=20260626
   ============================================================ */
(function () {
  'use strict';

  /* ── Sanity config ──────────────────────────────────────────
     projectId : your Sanity project
     dataset   : "production" is the default Sanity dataset
     CDN URL   : cdn.sanity.io serves cached, fast responses
  ─────────────────────────────────────────────────────────── */
  var SANITY_PROJECT = '1jow8pp9';
  var SANITY_DATASET = 'production';
  var SANITY_CDN     = 'https://cdn.sanity.io';

  /* Sends a GROQ query to Sanity and returns the result array */
  function sanityQuery(query) {
    var url = SANITY_CDN + '/v2021-10-21/data/query/' + SANITY_DATASET
      + '?projectId=' + SANITY_PROJECT
      + '&query=' + encodeURIComponent(query);
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.result; });
  }

  /* Converts a Sanity image asset reference into a full CDN URL */
  function imageUrl(ref, width) {
    if (!ref) return null;
    /* ref format: "image-abc123-1920x1080-jpg"
       We strip "image-" prefix and convert last dash+ext to dot+ext */
    var id = ref
      .replace(/^image-/, '')
      .replace(/-([a-zA-Z]+)$/, '.$1');
    var base = SANITY_CDN + '/images/' + SANITY_PROJECT + '/' + SANITY_DATASET + '/' + id;
    return width ? base + '?w=' + width + '&auto=format' : base + '?auto=format';
  }

  /* Sets text on an element only if the CMS value is non-empty */
  function setText(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  /* Sets a background-image CSS on an element */
  function setBg(selector, url) {
    if (!url) return;
    var el = document.querySelector(selector);
    if (el) el.style.backgroundImage = 'url(' + url + ')';
  }

  /* Sets the src of an <img> element */
  function setImg(selector, url, alt) {
    if (!url) return;
    var el = document.querySelector(selector);
    if (!el) return;
    el.src = url;
    if (alt) el.alt = alt;
  }

  /* Sets an href on an <a> element */
  function setHref(selector, url) {
    if (!url) return;
    var el = document.querySelector(selector);
    if (el) el.href = url;
  }

  /* ── Helpers ── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[melki] ' + name + ':', e); }
  }

  /* ══════════════════════════════════════════════════════════
     NAV
     - Adds "solid" class when user scrolls past 40px
       (switches from transparent to white background)
     - Opens/closes mobile menu via burger button
     - Smooth scrolls to anchor sections
  ══════════════════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════════════════
     HERO
     - Adds "is-loaded" class once the background image loads
       (triggers the slow Ken Burns zoom via CSS transition)
  ══════════════════════════════════════════════════════════ */
  function initHero() {
    var bg = $('.hero__bg');
    if (!bg) return;
    var img = bg.querySelector('img');
    if (!img) return;
    if (img.complete) bg.classList.add('is-loaded');
    else img.addEventListener('load', function () { bg.classList.add('is-loaded'); });
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEALS
     - IntersectionObserver watches every element with class "r"
     - When the element enters the viewport, adds class "on"
     - CSS transitions opacity 0→1 and translateY 24px→0
     - Safety timeout reveals everything after 6s (in case
       IntersectionObserver misfires on some browsers)
  ══════════════════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════════════════
     RADIO PLAYER
     - HTML5 <audio> element with the stream src
     - Play button toggles audio.play() / audio.pause()
     - Waveform bars animate via CSS when "playing" class is set
     - Volume slider sets audio.volume (0 to 1)
     - Nav pill scrolls to radio section and toggles play
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
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', function () { audio.volume = parseFloat(volSlider.value); });
    }

    /* Build waveform bars dynamically so we can control count */
    if (wave && wave.children.length === 0) {
      for (var i = 0; i < 24; i++) {
        var bar = document.createElement('span');
        bar.style.height = (Math.floor(Math.random() * 22) + 6) + 'px';
        wave.appendChild(bar);
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     HOMEPAGE CONTENT (from Sanity)
     Fetches the single "homepage" document which controls:
       - Hero: background image, heading, subtitle, button labels
       - About: image, heading, body paragraph
       - Devotional: quote, scripture reference, body text
       - Visit: subtitle paragraph

     How it works:
       *[_type=="homepage"][0] → get the first (only) homepage doc
       {heroBg, heroTitle, ...} → only fetch these fields

     setText / setImg / setBg are helpers that find an element
     by CSS selector and update its text or image src.
     They do nothing if the CMS value is empty, so hardcoded
     HTML stays as the fallback.
  ══════════════════════════════════════════════════════════ */
  function initHomepageContent() {
    sanityQuery('*[_type=="homepage"][0]{heroBg,heroEyebrow,heroTitle,heroTitleItalic,heroSubtitle,heroCta1,heroCta2,aboutImage,aboutEyebrow,aboutTitle,aboutTitleItalic,aboutBody,devQuote,devReference,devBody,visitSubtitle}')
      .then(function (hp) {
        if (!hp) return;

        /* Hero background image */
        if (hp.heroBg && hp.heroBg.asset) {
          setImg('.hero__bg img', imageUrl(hp.heroBg.asset._ref, 1920), 'Hero background');
        }

        /* Hero text */
        setText('.hero__eyebrow span:last-child', hp.heroEyebrow);
        if (hp.heroTitle) {
          var titleEl = $('.hero__title');
          if (titleEl) {
            var italic = hp.heroTitleItalic || '';
            var plain  = hp.heroTitle.replace(italic, '').trim();
            titleEl.innerHTML = plain + (italic ? '<br /><em>' + italic + '</em>' : '');
          }
        }
        setText('.hero__sub', hp.heroSubtitle);
        setText('.hero__actions .btn-gold', hp.heroCta1);
        setText('.hero__actions .btn-outline-white', hp.heroCta2);

        /* About image */
        if (hp.aboutImage && hp.aboutImage.asset) {
          setImg('.about__img img', imageUrl(hp.aboutImage.asset._ref, 800), 'Our congregation');
        }

        /* About text */
        setText('.about__text .eyebrow', hp.aboutEyebrow);
        if (hp.aboutTitle) {
          var aboutTitleEl = $('.about__text .section-title');
          if (aboutTitleEl) {
            var aItalic = hp.aboutTitleItalic || '';
            var aPlain  = hp.aboutTitle.replace(aItalic, '').trim();
            aboutTitleEl.innerHTML = aPlain + (aItalic ? '<br /><em>' + aItalic + '</em>' : '');
          }
        }
        setText('.about__body', hp.aboutBody);

        /* Devotional */
        if (hp.devQuote) {
          var quoteEl = $('.dp__quote p');
          if (quoteEl) quoteEl.textContent = '"' + hp.devQuote + '"';
        }
        setText('.dp__quote footer', hp.devReference);
        setText('.dp__body', hp.devBody);

        /* Visit subtitle */
        setText('.visit__sub', hp.visitSubtitle);
      })
      .catch(function (err) { console.warn('[melki] homepage content:', err); });
  }

  /* ══════════════════════════════════════════════════════════
     SETTINGS (from Sanity)
     Fetches site-wide settings:
       - Contact info (phone, email, address)
       - Social media links
       - Radio stream URL + TuneIn link
       - Service times (stats bar)

     Sets href on <a> elements and text on info items.
     The audio element src is updated so the correct
     stream plays when the user clicks play.
  ══════════════════════════════════════════════════════════ */
  function initSettings() {
    sanityQuery('*[_type=="settings"][0]{churchName,tagline,phone,email,address,mapUrl,facebook,instagram,youtube,radioStreamUrl,tuneInUrl,radioDescription,sundayTime,wednesdayTime}')
      .then(function (s) {
        if (!s) return;

        /* Radio stream */
        if (s.radioStreamUrl) {
          var audio = document.getElementById('radio-audio');
          if (audio) audio.src = s.radioStreamUrl;
        }
        if (s.tuneInUrl) setHref('.radio__tunein', s.tuneInUrl);
        if (s.radioDescription) setText('.radio__now', s.radioDescription);

        /* TuneIn link in footer */
        setHref('.footer__socials a[aria-label="TuneIn Radio"]', s.tuneInUrl);

        /* Social links — nav and footer */
        $$('a[aria-label="Facebook"]').forEach(function (a) { if (s.facebook) a.href = s.facebook; });
        $$('a[aria-label="Instagram"]').forEach(function (a) { if (s.instagram) a.href = s.instagram; });
        $$('a[aria-label="YouTube"]').forEach(function (a) { if (s.youtube) a.href = s.youtube; });

        /* Contact section */
        if (s.phone) {
          var phoneEl = $('.contact__list a[href^="tel"]');
          if (phoneEl) { phoneEl.href = 'tel:' + s.phone.replace(/\s/g,''); phoneEl.textContent = s.phone; }
        }
        if (s.email) {
          $$('a[href^="mailto"]').forEach(function (a) { a.href = 'mailto:' + s.email; a.textContent = s.email; });
        }
        if (s.address) {
          var addrEl = $('.contact__list li:first-child span');
          if (addrEl) addrEl.textContent = s.address;
        }
        if (s.mapUrl) setHref('.contact__list a[href*="maps"]', s.mapUrl);

        /* Stats bar times */
        if (s.sundayTime) {
          var sunEl = $('.hero__stat-num .sun-time');
          if (sunEl) sunEl.textContent = s.sundayTime;
        }

        /* Footer tagline */
        setText('.footer__tagline', s.tagline);

        /* Footer church name */
        setText('.footer__copy', s.churchName ? '© 2026 ' + s.churchName : null);
      })
      .catch(function (err) { console.warn('[melki] settings:', err); });
  }

  /* ══════════════════════════════════════════════════════════
     SERMONS (from Sanity)
     Fetches the 3 most recent sermons ordered by date.
     Replaces the entire sermons grid with new cards.
     If Sanity returns nothing, the hardcoded HTML cards stay.

     imageUrl() converts a Sanity image reference like
     "image-abc123-1920x1080-jpg" into a full CDN URL.
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
            + '</div>'
            + '</article>';
        }).join('');

        $$('.s-card.r', grid).forEach(function (el) {
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      })
      .catch(function (err) { console.warn('[melki] sermons:', err); });
  }

  /* ══════════════════════════════════════════════════════════
     EVENTS (from Sanity)
     Same pattern as sermons — fetches up to 5 upcoming events,
     replaces the event list HTML.
     Date is parsed with T12:00:00 appended to avoid timezone
     issues where new Date("2026-07-04") could show July 3.
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
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      })
      .catch(function (err) { console.warn('[melki] events:', err); });
  }

  /* ══════════════════════════════════════════════════════════
     MINISTRIES (from Sanity)
     Fetches ministry cards and replaces the grid.
     Each ministry has a title, description, and icon key.
     The icon key maps to an SVG path below.
     If Sanity returns nothing, hardcoded cards stay visible.
  ══════════════════════════════════════════════════════════ */
  function initMinistries() {
    var grid = $('.min__grid');
    if (!grid) return;

    /* SVG paths keyed by icon name */
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
          var iconPath = icons[m.icon] || icons['cross'];
          return '<div class="min__card r' + delay + '">'
            + '<div class="min__icon">'
            + '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' + iconPath + '</svg>'
            + '</div>'
            + '<h3 class="min__title">' + m.title + '</h3>'
            + '<p class="min__desc">' + (m.description || '') + '</p>'
            + '</div>';
        }).join('');

        $$('.min__card.r', grid).forEach(function (el) {
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
          }, { threshold: 0.05 }).observe(el);
        });
      })
      .catch(function (err) { console.warn('[melki] ministries:', err); });
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
      gsap.to(heroBg, {
        yPercent: 15, ease: 'none',
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
    safe(initHomepageContent, 'homepage-content');
    safe(initSettings,        'settings');
    safe(initSermons,         'sermons');
    safe(initEvents,          'events');
    safe(initMinistries,      'ministries');
    safe(initForms,           'forms');
    safe(initGSAP,            'gsap');
  });

})();
