# Melkitzedek — Church Website v2

Premium minimalist website for Iglesia Melkitzedek, Tegucigalpa, Honduras.  
Pure HTML + CSS + vanilla JS. No build step. No framework.

---

## Project structure

```
melkitzedeke-websitev2/
├── index.html           ← Main website
├── styles.css           ← All styles and design tokens
├── favicon.svg          ← Site icon
├── robots.txt           ← Search engine rules
├── js/
│   └── main.js          ← Animations and interactions
├── lib/
│   ├── gsap.min.js      ← Animation library (local copy)
│   └── ScrollTrigger.min.js
├── assets/
│   ├── img/             ← All site images (replace with real photos)
│   └── credits.json     ← Stock photo attributions
├── admin/
│   ├── index.html       ← Decap CMS entry point
│   └── config.yml       ← CMS collections and fields
├── .gitignore
├── .htaccess            ← Cache headers for Apache / Hostinger
├── _redirects           ← Netlify URL rules (required for CMS)
└── netlify.toml         ← Netlify build and cache config
```

---

## Design tokens

Edit CSS variables at the top of styles.css:

- --black  #0A0A0A  → backgrounds
- --coral  #FF4500  → accent color
- --white  #FFFFFF
- --off    #F7F6F3  → light section background

---

## Open in VS Code

```bash
code /Users/mariomeza/Desktop/Personal/Dev/Websites/melkitzedeke-websitev2
```

Recommended extensions: Live Server, Prettier, YAML

---

## Deploy updates

```bash
git add .
git commit -m "your message"
git push
```

Netlify redeploys automatically in ~30 seconds.

---

## CMS setup (Decap CMS)

1. Netlify dashboard → Identity → Enable Identity → set to Invite only
2. Identity → Services → Enable Git Gateway
3. Identity → Invite users → enter staff emails
4. Staff visit https://your-site.netlify.app/admin and log in

---

## Replace placeholder content

- Photos: swap files in assets/img/ (hero.jpg, community.jpg, sermons.jpg, events.jpg)
- Text: edit index.html directly
- Address / phone / email: Contact section in index.html
- Social links: Footer section in index.html
