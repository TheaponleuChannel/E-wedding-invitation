# 🌸 Khmer E-Wedding Invitation

**សិរីមង្គលអាពាហ៍ពិពាហ៍** — a premium digital wedding invitation for a Cambodian wedding, blending traditional Khmer wedding culture with modern web design.

Soft cream & gold luxury aesthetic · Angkor-inspired ornament · Khmer-first typography · romantic animations · fully responsive · zero dependencies.

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [How the Project Works](#-how-the-project-works)
- [Configuration Guide (js/data.js)](#-configuration-guide-jsdatajs)
- [Customizing Images & Music](#-customizing-images--music)
- [Design System (CSS Tokens)](#-design-system-css-tokens)
- [Development Guide](#-development-guide)
- [SEO, Accessibility & Performance](#-seo-accessibility--performance)
- [Publish Your Project](#-publish-your-project)
- [Personalized Guest Links](#-personalized-guest-links)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [Tech Stack](#-tech-stack)

---

## 🚀 Quick Start

### Requirements

- Any modern browser (Chrome, Edge, Safari, Firefox)
- *Optional* — a tiny static file server (Python **or** Node, one command)
- *Optional* — Python 3 if you want to regenerate the background music

No build step. No `npm install`. No frameworks. Open and it runs.

### Run the project

**Option A — static server (recommended):**

```bash
# from the project root (khmer-wedding/)
python3 -m http.server 8080
#   →  http://localhost:8080
```

```bash
# or with Node
npx serve .        # or: npx http-server -p 8080
```

**Option B — just open the file:**

Double-click `index.html` (or `open index.html`). Everything works from `file://`
because scripts are plain (non-module) and assets are relative paths.

> 💡 A local server is only *recommended* so the environment matches production
> (especially audio playback and Google Fonts loading).

---

## 📁 Project Structure

```
khmer-wedding/
├── index.html              # Semantic shell: meta/SEO, fonts, JSON-LD, #app root
├── css/
│   └── styles.css          # Full design system + components + responsive + animations
├── js/
│   ├── data.js             # ⭐ WEDDING_DATA — the ONE config object (edit this!)
│   └── app.js              # Component templates + all interactions (SPA-style render)
├── images/                 # 10 photography assets (replaceable, same filenames)
│   ├── hero-couple.jpg     # hero portrait (4:5)
│   ├── bride-portrait.jpg
│   ├── angkor-portrait.jpg
│   └── …                   # + engagement, garden-walk, table-decor, etc.
├── audio/
│   └── wedding-music.wav   # Original ambient background music (looping, 96s)
├── tools/
│   ├── make_music.py       # Python stdlib music generator (recreate/retune the track)
│   └── make_links.py       # Personalized guest-link generator (one URL per invitee)
└── README.md
```

---

## ⚙️ How the Project Works

The site is a **tiny render pipeline** with a single source of truth:

```
┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  js/data.js  │ ───▶ │    js/app.js     │ ───▶ │   index.html     │
│ WEDDING_DATA │      │   Components()   │      │   <div id="app"> │
│  (content)   │      │  + Controllers   │      │   (rendered DOM) │
└──────────────┘      └──────────────────┘      └──────────────────┘
                              │
                              ▼
                      css/styles.css
                      (design system)
```

### 1. `js/data.js` — content

Declares one global object, `WEDDING_DATA`, holding **every** piece of content:
names, date, story timeline, ceremony schedule, venue, gallery photos, RSVP copy,
contact numbers, music settings, navigation, footer. Nothing is hard-coded in
markup — change this file and the whole invitation updates.

### 2. `js/app.js` — components + behavior

An IIFE with two halves:

**Components** — pure functions returning HTML strings (reusable, easy to read):

| Component        | Renders                                            |
|------------------|----------------------------------------------------|
| `Nav()`          | Floating desktop pill + mobile bottom bar          |
| `Hero()`         | Full-screen hero with names, photo frame, CTA      |
| `Countdown()`    | Days / Hours / Minutes / Seconds timer             |
| `Story()`        | Vertical love-story timeline                       |
| `Schedule()`     | Morning / Afternoon / Evening ceremony cards       |
| `Venue()`        | Venue card + custom SVG map (`VenueMap()`)         |
| `Gallery()`      | Masonry gallery + lightbox markup                  |
| `Invitation()`   | Ornate invitation card with monogram               |
| `Rsvp()`         | RSVP form + success animation panel                |
| `Wishes()`       | Guestbook form + message cards                     |
| `Contact()`      | Groom/Bride call cards                             |
| `Footer()`, `MusicButton()`, `Petals()`, `SectionHead()`, `ORN.*` | helpers |

All components are mounted in one place:

```js
app.innerHTML = `
  ${Nav()} ${Petals()}
  <main> ${Hero()} ${Countdown()} … ${Contact()} </main>
  ${Footer()} ${MusicButton()}
`;
```

**Controllers** — behavior wired after render:

- `Smooth scrolling` — all in-page anchors
- `IntersectionObserver` scroll-reveal (`.reveal` → `.is-visible`)
- `Countdown` — ticks to `WEDDING_DATA.date.iso` every second
- `Lightbox` — open/close, next/prev, keyboard arrows + Esc, mobile swipe
- `RSVP` — validation, success animation, petal burst, saves to `localStorage["kw_rsvp"]`
- `Wishes` — add/display messages, persists to `localStorage["kw_wishes"]`, XSS-safe output
- `Music` — play/pause toggle; starts **only after the visitor's first interaction** (never autoplays)
- `Nav active state` — scroll-spy + sliding gold indicator (`aria-current="page"`)

### 3. `css/styles.css` — design system

CSS custom properties (tokens) drive the entire look — colors, gold gradients,
Khmer/English font stacks, shadows, and the SVG Angkor-scale background pattern.
Each section has its own component block; responsive rules live at the bottom
(1080px / 960px / 640px breakpoints + `prefers-reduced-motion` support).

### 4. `index.html` — shell & metadata

Sets `lang="km"`, fonts (Noto Sans Khmer, Battambang, Playfair Display, Inter),
Open Graph tags, JSON-LD `WeddingEvent` structured data, a skip-link, and a
`<noscript>` fallback. The `#app` div is filled by `app.js` on load.

---

## 📝 Configuration Guide (`js/data.js`)

> **This is the only file you must edit to adapt the invitation to another couple.**

| Section       | What to change                                                            |
|---------------|---------------------------------------------------------------------------|
| `meta`        | Page title & description (SEO)                                            |
| `guest`       | Personalized guest links: URL parameter name, labels, max length         |
| `couple`      | Groom/Bride: `name`, `nameLatin`, `role`, `phone`, `initial` (monogram)   |
| `date`        | `iso` (countdown target, **with timezone!**), `display`, `displayEn`      |
| `hero`        | Blessing text, invitation lines, CTA label/target, hero photo + alt text  |
| `countdown`   | Labels & the "day has come" message                                       |
| `story`       | Timeline items: `icon`, `year`, `title`, `text`, `image` (4 milestones)   |
| `schedule`    | Ceremony groups & events (`time`, `title`, `text`, `icon`)                |
| `venue`       | Hall name, address lines, notes, Google Maps link, map button label       |
| `gallery`     | Photo list: `src`, `alt`, `caption`                                       |
| `invitation`  | Invitation card lines & sign-off                                          |
| `rsvp`        | Form labels, placeholders, success copy                                   |
| `wishes`      | Guestbook labels + seeded example messages (`seed`)                       |
| `contact`     | Call button label (numbers come from `couple`)                            |
| `music`       | Audio `src`, `volume`, button labels                                      |
| `nav`         | Menu items (icon, label, anchor)                                          |
| `footer`      | Thank-you text & copyright                                                |

### Example — swap in the real couple & date

```js
couple: {
  groom: { name: "លោក រតនា សុខា", nameLatin: "Ratana Sokha", /* … */ },
  bride: { name: "កញ្ញា នាថ ចន្ទ្រា", nameLatin: "Neath Chantrea", /* … */ },
},
date: {
  iso: "2027-02-14T06:00:00+07:00",   // ⚠️ include the timezone (+07:00 for Cambodia)
  display: "ថ្ងៃអាទិត្យ ទី១៤ ខែកុម្ភៈ ឆ្នាំ២០២៧",
  displayEn: "Sunday · February 14, 2027",
},
```

Then update `meta`, `index.html` `<title>`/OG tags, and the JSON-LD block to match.

---

## 🖼️ Customizing Images & Music

### Images

Replace any file in `images/` using the **same filename** — no code changes needed.
Recommended sizes: hero `4:5` portrait (e.g. 900×1200), gallery `3:2` or `4:5`.
Add or remove gallery entries via `gallery.photos` in `data.js`.

### Background music

- Format: `audio/wedding-music.wav` (mono 32 kHz, 96 s, loops seamlessly).
- To use your own track: drop an `.mp3`/`.wav`/`.ogg` into `audio/` and set `music.src` in `data.js`.
- To regenerate the original synthesized Khmer-style ambient track (or retune it):

  ```bash
  python3 tools/make_music.py   # pure stdlib, writes audio/wedding-music.wav
  ```

  Edit `NOTES`, `phrases`, `DURATION`, or `SEED` at the top of the script to
  compose a different melody. No audio libraries required.

> 🔇 Music policy: the browser's autoplay rules are respected — audio starts softly
> **after** the visitor's first click/tap/keypress, and the floating ♪ button
> (bottom-right) toggles play/pause at any time.

---

## 🎨 Design System (CSS Tokens)

All visual identity lives in `:root` of `styles.css`:

```css
--ivory / --cream / --paper     /* warm background layers      */
--gold / --gold-deep / --gold-light / --gold-shine   /* gold palette + gradient */
--maroon / --ink / --ink-soft   /* text & accents              */
--font-kh / --font-kh-display   /* Noto Sans Khmer / Battambang */
--font-display / --font-en      /* Playfair Display / Inter      */
--pattern                       /* SVG Angkor-scale background   */
```

Change a token and the whole site follows. Reusable classes:
`.btn--primary`, `.btn--ghost`, `.section-head`, `.eyebrow`, `.gold-text`,
`.reveal` (scroll-in), `.orn-*` (SVG ornaments).

---

## 🛠️ Development Guide

### Add a new section

1. Add its content to `WEDDING_DATA` in `js/data.js`.
2. Write a component function in `js/app.js` (copy the pattern of `Contact()`).
3. Mount it inside `<main>` in the render template.
4. If it should appear in the menu, add it to `data.js → nav` and the
   `sections` array in the scroll-spy block of `app.js`.
5. Style it with tokens in `styles.css` (wrap key blocks in `.reveal` for the
   scroll animation).

### Reusable pieces already available

- `SectionHead(title, titleEn)` — centered Khmer title + English eyebrow + gold divider
- `ORN.divider() / ORN.corner() / ORN.lotus() / ORN.photoFrame()` — inline SVG ornaments
- `escapeHTML()` — always use it for user-generated or dynamic text
- `prefersReducedMotion()` — gate any new animation behind it

### Data flow rules

- Components **read** `WEDDING_DATA` — never hard-code text in templates.
- User-generated content (RSVP, wishes) goes to `localStorage`:
  - `kw_rsvp` — array of RSVP responses (name, phone, guests, attend, timestamp)
  - `kw_wishes` — guestbook entries (max 50)
- There is no backend by design. To collect RSVPs server-side, POST the payload
  in the `rsvpForm` submit handler (e.g. to Formspree, Google Forms, or your API).

### Visual QA checklist

- [ ] Mobile (≤ 640px): bottom nav, stacked hero, 2-column gallery
- [ ] Tablet (~768–960px): single-column timeline & schedule
- [ ] Desktop (≥ 960px): floating pill nav with sliding gold indicator
- [ ] Lightbox: arrows, Esc, swipe
- [ ] Countdown ticks; after the date it shows the finished message
- [ ] First click starts music; ♪ button pauses/plays

---

## 🔍 SEO, Accessibility & Performance

- **SEO** — semantic landmarks (`header/nav/main/section/article/footer`),
  one `<h1>` (couple names), `lang="km"`, meta description, Open Graph tags,
  and JSON-LD `WeddingEvent` rich-result data.
- **Accessibility** — skip-link, visible focus rings, labeled form controls,
  `aria-current` on the active menu item, `aria-pressed` on the music button,
  lightbox `role="dialog"` + keyboard support, `prefers-reduced-motion`
  honored (animations disabled), color contrast on cream/gold checked.
- **Performance** — zero dependencies, one CSS file, two small JS files,
  `loading="lazy"` + `decoding="async"` on gallery images, `fetchpriority="high"`
  hero image, `preload="none"` on audio (5.9 MB WAV never blocks first paint),
  relative asset paths, CSS-driven animations (GPU-friendly transforms).

---

## 🌐 Publish Your Project

The site is 100% static — publishing means **uploading one folder**. All three
options below are **free** and take about 5 minutes. No build step, no server code.

### Option 1 — Netlify (recommended, easiest)

1. Go to [app.netlify.com](https://app.netlify.com) and sign up (GitHub or email).
2. Click **"Add new site" → "Deploy manually"**.
3. **Drag the whole `khmer-wedding/` folder** onto the page.
4. Done — your site is live at `https://RANDOM-NAME.netlify.app`.
5. Make it pretty: **Site settings → Change site name** → e.g.
   `https`​`://sopheak-neath-wedding.netlify.app`.
6. Updates: drag the folder onto the same page again (or connect a GitHub repo
   for automatic deploys on every push).

### Option 2 — Vercel

```bash
cd khmer-wedding
npx vercel          # log in when asked, accept defaults
npx vercel --prod   # publish to production → https://your-project.vercel.app
```

Or push the folder to GitHub → [vercel.com](https://vercel.com) → **Add New →
Project → Import** → Deploy.

### Option 3 — GitHub Pages

1. Create a new GitHub repository and push the **contents** of `khmer-wedding/`
   (`index.html` must be at the repo root):

   ```bash
   cd khmer-wedding
   git init && git add . && git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/wedding.git
   git push -u origin main
   ```

2. Repo **Settings → Pages → Source: "Deploy from a branch"** → `main` / `(root)`.
3. Live at `https://YOUR-USER.github.io/wedding/` (may take 1–2 minutes).

### Custom domain (optional but lovely)

Buy a domain (~$10/year — Namecheap, Porkbun, Google Domains, etc.), e.g.
`sopheak-neath.com`, then in your host's dashboard:

| Host      | Where                                          |
|-----------|------------------------------------------------|
| Netlify   | Domain management → Add a custom domain        |
| Vercel    | Settings → Domains → Add                       |
| GitHub    | Settings → Pages → Custom domain               |

Then set the DNS records your host shows you (usually one `CNAME` or `A` record).
HTTPS certificates are issued automatically on all three hosts.

> ✅ Tip: assets use **relative paths**, so the site also works from a sub-path
> like `https://user.github.io/wedding/` — no configuration needed.

---

## 💌 Personalized Guest Links

Give every invitee a **unique URL that greets them by name**. When they open it:

- a gold ✉️ tag shows **"សូមគោរពអញ្ជើញ — [their name]"** in the hero,
- the invitation card shows **"ជូនចំពោះ — [their name]"**,
- the browser tab carries their name,
- the **RSVP form is pre-filled** with their name.

### URL formats

```
https://your-domain.com/?to=សុខ រតនា          ← works on every host (recommended)
https://your-domain.com/to/សុខ រតនា          ← "pretty" URL (needs a rewrite rule)
```

Names may be **Khmer or English**; spaces and Unicode are handled automatically.
Opening the plain site (no parameter) shows the normal generic invitation.

### Generate the links

**One by one** — just append the name (browsers encode it for you):

```
https://sopheak-neath.netlify.app/?to=Sokha Vandy
```

**Batch — the generator script** (recommended):

```bash
# guests.txt → one name per line
printf '%s\n' "សុខ រតនា" "Sokha Vandy" "ចន្ទ្រា សុខា" > guests.txt

python3 tools/make_links.py --base https://sopheak-neath.netlify.app --file guests.txt
```

Output:

```
សុខ រតនា
  https://sopheak-neath.netlify.app/?to=%E1%9E%9F%E1%9E%BB%E1%9E%81%20%E1%9E%9A%E1%9E%8F%E1%9E%93%E1%9E%B6

Sokha Vandy
  https://sopheak-neath.netlify.app/?to=Sokha%20Vandy
  ...
```

Handy flags:

| Flag         | Purpose                                                        |
|--------------|----------------------------------------------------------------|
| `--whatsapp` | Also prints a ready-to-send `wa.me` share link per guest 🌸     |
| `--pretty`   | Emits `/to/Name` links instead of `?to=Name`                   |
| `--csv`      | `name,link` rows for Excel / Google Sheets                     |
| `--param`    | Use another query key (default `to`)                           |

**Google Sheets bulk formula** (if you keep the guest list in a sheet):

```
=CONCAT("https://sopheak-neath.netlify.app/?to=", ENCODEURL(A2))
```

### Pretty URLs (optional)

`?to=` links work everywhere with zero setup. For `/to/Name` links, add a
rewrite rule so unknown paths still load the invitation:

- **Netlify** — create `public/_redirects` (or `_redirects` in the site root) with:
  ```
  /to/*  /index.html  200
  ```
- **Vercel** — add `vercel.json` in the site root:
  ```json
  { "rewrites": [{ "source": "/to/:name", "destination": "/index.html" }] }
  ```
- **GitHub Pages** — no rewrite support → keep using `?to=` links.

### Sending the invitation

WhatsApp / Telegram / Messenger / SMS — paste the personal link with a note:

> សូមគោរពអញ្ជើញ លោក សុខ រតនា ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 🌸
> https://sopheak-neath.netlify.app/?to=សុខ រតនា

`--whatsapp` generates exactly this message for each guest automatically.

### Configure / disable

Everything lives in `data.js → guest`:

```js
guest: {
  enabled: true,        /* false = ignore URL names entirely */
  param: "to",          /* query parameter name             */
  pathPrefix: "to",     /* pretty-URL segment  /to/Name     */
  label: "សូមគោរពអញ្ជើញ",
  inviteeLabel: "ជូនចំពោះ",
  maxLength: 60,
},
```

> 🔒 Note: guest names are cosmetic (client-side only) — they make each link feel
> personal, but they are **not** access control. Don't put secrets in the URL.

---

## ❓ Troubleshooting & FAQ

**Fonts look different in the preview iframe / offline.**
Google Fonts are loaded from the CDN. Without network access the site falls
back to system fonts (`Khmer OS`, Georgia, etc.) — layout still works.
In production (with internet) the intended Khmer/Playfair/Inter fonts appear.

**Music doesn't start by itself.**
Expected — browsers block autoplay. It starts after the first interaction;
visitors can also tap the ♪ button manually.

**Countdown shows the wrong remaining time.**
Check `date.iso` includes the correct offset (`+07:00` for Cambodia).
`new Date(iso)` is parsed as an absolute instant.

**My personalized link doesn't show the guest name.**
Check the format: `https://your-domain.com/?to=Name` (note the `?to=`).
If you use `/to/Name` links, the host needs the rewrite rule described in
[Pretty URLs](#pretty-urls-optional). Also verify `guest.enabled` is `true`
in `data.js`. Names must be URL-safe — use `tools/make_links.py` to encode them.

**RSVP/wishes disappear in another browser.**
They persist in `localStorage` per device/browser by design (no backend).
Export/collect them by reading `localStorage["kw_rsvp"]` in the console.

**Can I use this for a non-Khmer wedding?**
Yes — `data.js` is language-agnostic content. Adjust fonts in `styles.css`
tokens and the `lang` attribute in `index.html`.

---

## 🧰 Tech Stack

- **HTML5** — semantic, SEO-ready, JSON-LD structured data
- **CSS3** — custom properties, Grid, flexbox, `columns` masonry, keyframe
  animations, `svh` units, `backdrop-filter`, `prefers-reduced-motion`
- **Vanilla JavaScript (ES2020)** — component template functions,
  IntersectionObserver, localStorage — **no frameworks, no dependencies**
- **Python 3 (optional tool)** — stdlib-only music synthesizer (`tools/make_music.py`)

---

<div align="center">

**សូមអរគុណសម្រាប់វត្តមាន និងក្តីស្រឡាញ់របស់លោកអ្នក** 🤍

*With Love ❤️*

</div>
