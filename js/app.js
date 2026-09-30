/* ==========================================================================
   Khmer E-Wedding — Application
   Component-based renderer + interactions. All content comes from
   WEDDING_DATA (js/data.js).
   ========================================================================== */

(function () {
  "use strict";

  const D = window.WEDDING_DATA || WEDDING_DATA;

  /* ========================================================================
     UTILITIES
     ===================================================================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHTML = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Personalized guest name from the URL -----------------------
     Supports  ?to=ឈ្មោះ  (query)  and  /to/ឈ្មោះ  (pretty path)          */
  const guestCfg = D.guest || { param: "to", pathPrefix: "to", maxLength: 60 };
  const readGuestName = () => {
    let raw = "";
    try {
      raw = new URLSearchParams(window.location.search).get(guestCfg.param) || "";
    } catch (_) { /* ignore */ }
    if (!raw && guestCfg.pathPrefix) {
      const m = window.location.pathname.match(
        new RegExp("/" + guestCfg.pathPrefix + "/([^/]+)/?$")
      );
      if (m) {
        try { raw = decodeURIComponent(m[1]); } catch (_) { raw = m[1]; }
      }
    }
    return raw.replace(/\s+/g, " ").trim().slice(0, guestCfg.maxLength || 60);
  };
  const guestName = guestCfg.enabled === false ? "" : readGuestName();

  /* ========================================================================
     ORNAMENTS — hand-drawn SVG decorations (Khmer / Angkor inspired)
     ===================================================================== */
  const ORN = {
    /* Thin gold divider with lotus-diamond center */
    divider: (w = 260) => `
      <svg class="orn-divider" viewBox="0 0 260 22" width="${w}" aria-hidden="true" focusable="false">
        <line x1="0" y1="11" x2="96" y2="11" class="orn-line"/>
        <circle cx="104" cy="11" r="2.2" class="orn-dot"/>
        <path d="M118 11 C123 3 137 3 142 11 C137 19 123 19 118 11 Z" class="orn-leaf"/>
        <path d="M130 4.5 L130 17.5" class="orn-vein"/>
        <circle cx="156" cy="11" r="2.2" class="orn-dot"/>
        <line x1="164" y1="11" x2="260" y2="11" class="orn-line"/>
      </svg>`,

    /* Corner flourish for framed cards */
    corner: (cls = "") => `
      <svg class="orn-corner ${cls}" viewBox="0 0 110 110" aria-hidden="true" focusable="false">
        <path d="M3 107 C3 55 55 3 107 3" class="orn-corner-main"/>
        <path d="M3 92 C3 48 48 3 92 3" class="orn-corner-soft"/>
        <path d="M14 107 C14 78 78 14 107 14" class="orn-corner-soft"/>
        <circle cx="3" cy="107" r="3.2" class="orn-dot"/>
        <circle cx="107" cy="3" r="3.2" class="orn-dot"/>
        <path d="M22 70 C22 48 48 22 70 22 C58 34 46 46 34 58 C30 62 26 66 22 70 Z" class="orn-corner-fill"/>
      </svg>`,

    /* Small lotus mark */
    lotus: (size = 34) => `
      <svg class="orn-lotus" viewBox="0 0 64 40" width="${size}" aria-hidden="true" focusable="false">
        <path d="M32 36 C22 28 18 18 20 8 C26 14 30 22 32 36 Z" class="lotus-petal"/>
        <path d="M32 36 C42 28 46 18 44 8 C38 14 34 22 32 36 Z" class="lotus-petal"/>
        <path d="M32 36 C20 32 10 24 8 14 C16 18 26 24 32 36 Z" class="lotus-petal"/>
        <path d="M32 36 C44 32 54 24 56 14 C48 18 38 24 32 36 Z" class="lotus-petal"/>
        <path d="M32 36 C24 34 16 30 12 24 C20 26 28 30 32 36 Z" class="lotus-petal"/>
        <path d="M32 36 C40 34 48 30 52 24 C44 26 36 30 32 36 Z" class="lotus-petal"/>
      </svg>`,

    /* Gold frame overlay for hero photo */
    photoFrame: () => `
      <svg class="orn-photo-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect x="1.6" y="1.6" width="96.8" height="96.8" rx="4" class="frame-outer"/>
        <rect x="4.4" y="4.4" width="91.2" height="91.2" rx="3" class="frame-inner"/>
      </svg>`,
  };

  /* ========================================================================
     COMPONENTS  (pure functions → HTML strings)
     ===================================================================== */

  const SectionHead = (title, titleEn) => `
    <header class="section-head reveal">
      <p class="eyebrow">${escapeHTML(titleEn)}</p>
      <h2 class="section-title">${escapeHTML(title)}</h2>
      ${ORN.divider()}
    </header>`;

  /* ---------- Nav ------------------------------------------------------- */
  const Nav = () => `
    <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
    <nav class="nav nav--desktop" aria-label="ម៉ឺនុយរុករក">
      <ul class="nav__list">
        ${D.nav.map((item) => `
          <li><a class="nav__link" href="${item.href}">
            <span class="nav__icon" aria-hidden="true">${item.icon}</span>
            <span>${escapeHTML(item.label)}</span>
          </a></li>`).join("")}
      </ul>
    </nav>
    <nav class="nav nav--mobile" aria-label="ម៉ឺនុយរុករកទូរស័ព្ទ">
      <ul class="nav__list">
        ${D.nav.map((item) => `
          <li><a class="nav__link" href="${item.href}">
            <span class="nav__icon" aria-hidden="true">${item.icon}</span>
            <span class="nav__label">${escapeHTML(item.label)}</span>
          </a></li>`).join("")}
      </ul>
    </nav>`;

  /* ---------- Petals ---------------------------------------------------- */
  const Petals = () => `
    <div class="petals" aria-hidden="true">
      ${Array.from({ length: 9 }, (_, i) => `
        <span class="petal petal--${(i % 3) + 1}" style="
          --x: ${5 + ((i * 11) % 90)}%;
          --dur: ${16 + (i % 5) * 4}s;
          --delay: ${-i * 3.4}s;
          --drift: ${20 + ((i * 13) % 60)}px;
          --size: ${12 + ((i * 7) % 12)}px;
        "></span>`).join("")}
    </div>`;

  /* ---------- Hero ------------------------------------------------------ */
  const Hero = () => {
    const h = D.hero, c = D.couple;
    return `
    <header class="hero" id="home">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="hero__inner">
        <div class="hero__content">
          <p class="hero__blessing reveal">${escapeHTML(h.blessing)}</p>
          ${ORN.divider(220).replace('class="orn-divider"', 'class="orn-divider reveal"')}
          <h1 class="hero__names reveal">
            <span class="hero__person">
              <span class="hero__prefix">${escapeHTML(h.groomPrefix)}</span>
              <span class="hero__name">${escapeHTML(c.groom.name)}</span>
              <span class="hero__latin">${escapeHTML(c.groom.nameLatin)}</span>
            </span>
            <span class="hero__ampersand" aria-hidden="true">${h.ampersand}</span>
            <span class="hero__person">
              <span class="hero__prefix">${escapeHTML(h.bridePrefix)}</span>
              <span class="hero__name">${escapeHTML(c.bride.name)}</span>
              <span class="hero__latin">${escapeHTML(c.bride.nameLatin)}</span>
            </span>
          </h1>
          <div class="hero__invite reveal">
            ${h.invitation.map((line) => `<p>${escapeHTML(line)}</p>`).join("")}
          </div>
          ${guestName ? `
          <p class="hero__guest reveal">
            <span class="hero__guest-label">${escapeHTML(guestCfg.label)}</span>
            <strong class="hero__guest-name">${escapeHTML(guestName)}</strong>
          </p>` : ""}
          <div class="hero__date reveal">
            <span class="hero__date-main">${escapeHTML(D.date.display)}</span>
            <span class="hero__date-sub">${escapeHTML(D.date.displayEn)} · ${escapeHTML(D.date.buddhistEra)}</span>
          </div>
          <a class="btn btn--primary hero__cta reveal" href="${h.ctaTarget}" data-scroll>
            ${escapeHTML(h.cta)}
          </a>
        </div>
        <figure class="hero__photo reveal">
          <div class="hero__photo-frame">
            ${ORN.corner("orn-corner--tl")}${ORN.corner("orn-corner--tr")}
            ${ORN.corner("orn-corner--bl")}${ORN.corner("orn-corner--br")}
            <img src="${h.photo}" alt="${escapeHTML(h.photoAlt)}" width="600" height="750" fetchpriority="high" decoding="async">
          </div>
          ${ORN.lotus()}
        </figure>
      </div>
      <a class="hero__scroll-hint" href="#countdown" data-scroll aria-label="រំកិលចុះក្រោម">
        <span class="hero__scroll-mouse" aria-hidden="true"></span>
      </a>
    </header>`;
  };

  /* ---------- Countdown -------------------------------------------------- */
  const Countdown = () => {
    const c = D.countdown;
    const cells = [
      ["days", c.labels.days, c.labelsEn.days],
      ["hours", c.labels.hours, c.labelsEn.hours],
      ["minutes", c.labels.minutes, c.labelsEn.minutes],
      ["seconds", c.labels.seconds, c.labelsEn.seconds],
    ];
    return `
    <section class="section countdown" id="countdown" aria-label="${escapeHTML(c.title)}">
      <div class="container">
        <header class="section-head reveal">
          <p class="eyebrow">${escapeHTML(c.titleEn)}</p>
          <h2 class="section-title section-title--sm">${escapeHTML(c.title)}</h2>
        </header>
        <div class="countdown__grid reveal" id="countdownGrid" role="timer" aria-live="polite">
          ${cells.map(([id, label, labelEn], i) => `
            <div class="countdown__cell" data-cell="${id}" style="--i:${i}">
              <div class="countdown__value"><span data-count="${id}">00</span></div>
              <div class="countdown__label">${escapeHTML(label)}</div>
              <div class="countdown__label-en">${escapeHTML(labelEn)}</div>
            </div>`).join("")}
        </div>
        <p class="countdown__finished" id="countdownFinished" hidden>${escapeHTML(c.finished)}</p>
      </div>
    </section>`;
  };

  /* ---------- Story ------------------------------------------------------ */
  const Story = () => `
    <section class="section story" id="couple">
      <div class="container">
        ${SectionHead(D.story.title, D.story.titleEn)}
        <ol class="timeline">
          ${D.story.items.map((item, i) => `
            <li class="timeline__item reveal" style="--i:${i}">
              <div class="timeline__node" aria-hidden="true"><span>${item.icon}</span></div>
              <article class="timeline__card">
                <figure class="timeline__figure">
                  <img src="${item.image}" alt="${escapeHTML(item.title)}" loading="lazy" decoding="async" width="480" height="320">
                </figure>
                <div class="timeline__body">
                  <p class="timeline__year">${escapeHTML(item.year)} <span>· ${escapeHTML(item.yearEn)}</span></p>
                  <h3 class="timeline__title">${escapeHTML(item.title)}</h3>
                  <p class="timeline__title-en">${escapeHTML(item.titleEn)}</p>
                  <p class="timeline__text">${escapeHTML(item.text)}</p>
                </div>
              </article>
            </li>`).join("")}
        </ol>
      </div>
    </section>`;

  /* ---------- Schedule ---------------------------------------------------- */
  const Schedule = () => `
    <section class="section schedule" id="schedule">
      <div class="container">
        ${SectionHead(D.schedule.title, D.schedule.titleEn)}
        <div class="schedule__groups">
          ${D.schedule.groups.map((g, gi) => `
            <div class="schedule__group reveal" style="--i:${gi}">
              <h3 class="schedule__group-title">
                <span class="schedule__group-icon" aria-hidden="true">${g.icon}</span>
                ${escapeHTML(g.label)}
                <span class="schedule__group-en">${escapeHTML(g.labelEn)}</span>
              </h3>
              <ul class="schedule__events">
                ${g.events.map((ev, ei) => `
                  <li class="event-card" style="--i:${ei}">
                    <div class="event-card__icon" aria-hidden="true">${ev.icon}</div>
                    <div class="event-card__body">
                      <time class="event-card__time">${escapeHTML(ev.time)}</time>
                      <h4 class="event-card__title">${escapeHTML(ev.title)}</h4>
                      <p class="event-card__text">${escapeHTML(ev.text)}</p>
                    </div>
                  </li>`).join("")}
              </ul>
            </div>`).join("")}
        </div>
      </div>
    </section>`;

  /* ---------- Venue ------------------------------------------------------- */
  const Venue = () => {
    const v = D.venue;
    return `
    <section class="section venue" id="venue">
      <div class="container">
        ${SectionHead(v.title, v.titleEn)}
        <div class="venue__grid">
          <div class="venue__info reveal">
            <div class="venue__card">
              ${ORN.corner("orn-corner--tl")}${ORN.corner("orn-corner--br")}
              <h3 class="venue__name">${escapeHTML(v.name)}</h3>
              <p class="venue__name-en">${escapeHTML(v.nameEn)}</p>
              ${ORN.divider(180)}
              <address class="venue__address">
                ${v.address.map((l) => `<span>${escapeHTML(l)}</span>`).join("")}
              </address>
              <ul class="venue__notes">
                ${v.notes.map((n) => `
                  <li><span aria-hidden="true">${n.icon}</span> ${escapeHTML(n.text)}</li>`).join("")}
              </ul>
              <a class="btn btn--primary" href="${v.mapLink}" target="_blank" rel="noopener noreferrer">
                ${escapeHTML(v.mapButton)}
              </a>
            </div>
          </div>
          <div class="venue__map reveal" role="img" aria-label="ផែនទីបង្ហាញទីតាំងសាលមង្គលការ">
            ${VenueMap(v)}
          </div>
        </div>
      </div>
    </section>`;
  };

  /* Stylised decorative map (SVG) — elegant, on-palette, offline-safe */
  const VenueMap = (v) => `
    <div class="mapframe">
      ${ORN.corner("orn-corner--tr")}${ORN.corner("orn-corner--bl")}
      <svg class="mapsvg" viewBox="0 0 640 460" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F7EFDD"/><stop offset="1" stop-color="#EFE2C6"/>
          </linearGradient>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#BFD6CF"/><stop offset="1" stop-color="#A5C4BC"/>
          </linearGradient>
        </defs>
        <rect width="640" height="460" fill="url(#mapBg)"/>
        <!-- blocks -->
        <g fill="#E6D4B0" opacity="0.55">
          <rect x="40" y="40" width="150" height="110" rx="10"/>
          <rect x="220" y="30" width="130" height="90" rx="10"/>
          <rect x="400" y="55" width="180" height="120" rx="10"/>
          <rect x="60" y="210" width="120" height="100" rx="10"/>
          <rect x="230" y="180" width="110" height="90" rx="10"/>
          <rect x="420" y="230" width="150" height="110" rx="10"/>
          <rect x="90" y="350" width="160" height="70" rx="10"/>
          <rect x="300" y="330" width="120" height="90" rx="10"/>
        </g>
        <!-- river -->
        <path d="M-20 380 C120 340 200 300 320 290 C440 280 520 240 660 190 L660 260 C520 305 450 340 330 350 C210 360 130 400 -20 440 Z" fill="url(#river)" opacity="0.5"/>
        <path d="M-20 380 C120 340 200 300 320 290 C440 280 520 240 660 190" fill="none" stroke="#8FB3AA" stroke-width="3" opacity="0.6"/>
        <!-- roads -->
        <g stroke="#D9BE8E" stroke-width="14" stroke-linecap="round" opacity="0.9">
          <path d="M0 170 H640"/>
          <path d="M200 0 V460"/>
          <path d="M0 300 H640" stroke-width="9"/>
          <path d="M390 0 V460" stroke-width="9"/>
        </g>
        <g stroke="#F3E6C8" stroke-width="4" stroke-dasharray="12 14" opacity="0.9">
          <path d="M0 170 H640"/>
          <path d="M200 0 V460"/>
        </g>
        <!-- labels -->
        <g fill="#8A6B3F" font-family="Inter, sans-serif" font-size="13" opacity="0.85">
          <text x="24" y="158" font-size="12">National Rd. 61</text>
          <text x="212" y="330" font-size="12" transform="rotate(-90 212 330)">Street 271</text>
          <text x="470" y="222" font-size="12" fill="#6E8F87">Bassac River</text>
        </g>
        <!-- landmark dots -->
        <g fill="#C9A45C" opacity="0.8">
          <circle cx="110" cy="95" r="5"/><circle cx="480" cy="115" r="5"/>
          <circle cx="120" cy="255" r="5"/><circle cx="500" cy="285" r="5"/>
        </g>
        <!-- venue pin -->
        <g transform="translate(320 210)">
          <circle r="46" fill="#C9A45C" opacity="0.18">
            <animate attributeName="r" values="40;58;40" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.22;0.06;0.22" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle r="26" fill="#C9A45C" opacity="0.25"/>
          <path d="M0 -34 C13 -34 24 -23 24 -10 C24 8 0 34 0 34 C0 34 -24 8 -24 -10 C-24 -23 -13 -34 0 -34 Z" fill="#B98B4E"/>
          <circle cx="0" cy="-11" r="9" fill="#FBF5E8"/>
        </g>
        <g transform="translate(320 262)">
          <rect x="-92" y="0" width="184" height="34" rx="17" fill="#FBF5E8" stroke="#C9A45C"/>
          <text x="0" y="22" text-anchor="middle" fill="#7A5A2F" font-size="14" font-family="'Noto Sans Khmer', Inter, sans-serif">Crystal Grand Hall</text>
        </g>
      </svg>
    </div>`;

  /* ---------- Gallery ------------------------------------------------------ */
  const Gallery = () => `
    <section class="section gallery" id="gallery">
      <div class="container">
        ${SectionHead(D.gallery.title, D.gallery.titleEn)}
        <div class="gallery__masonry">
          ${D.gallery.photos.map((p, i) => `
            <figure class="gallery__item reveal" style="--i:${i % 4}">
              <button class="gallery__btn" type="button" data-lightbox="${i}"
                aria-label="មើលរូបភាព៖ ${escapeHTML(p.caption)}">
                <img src="${p.src}" alt="${escapeHTML(p.alt)}" loading="lazy" decoding="async">
                <figcaption class="gallery__caption">
                  <span class="gallery__zoom" aria-hidden="true">🔍</span>
                  <span>${escapeHTML(p.caption)}</span>
                </figcaption>
              </button>
            </figure>`).join("")}
        </div>
      </div>
    </section>

    <div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="ការបង្ហាញរូបភាព">
      <button class="lightbox__close" type="button" aria-label="បិទ">✕</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="រូបមុន">‹</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" id="lightboxImg" src="" alt="">
        <figcaption class="lightbox__caption" id="lightboxCaption"></figcaption>
      </figure>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="រូបបន្ទាប់">›</button>
      <div class="lightbox__counter" id="lightboxCounter"></div>
    </div>`;

  /* ---------- Invitation card --------------------------------------------- */
  const Invitation = () => {
    const inv = D.invitation, c = D.couple;
    return `
    <section class="section invitation" id="invitation">
      <div class="container container--narrow">
        ${SectionHead(inv.title, inv.titleEn)}
        <article class="invite-card reveal">
          ${ORN.corner("orn-corner--tl")}${ORN.corner("orn-corner--tr")}
          ${ORN.corner("orn-corner--bl")}${ORN.corner("orn-corner--br")}
          <div class="invite-card__monogram" aria-hidden="true">
            <span>${escapeHTML(c.groom.initial)}</span>
            <em>&amp;</em>
            <span>${escapeHTML(c.bride.initial)}</span>
          </div>
          <p class="invite-card__blessing">${escapeHTML(D.hero.blessing)}</p>
          ${ORN.divider(200)}
          <div class="invite-card__text">
            ${guestName ? `
            <p class="invite-card__to">
              <span>${escapeHTML(guestCfg.inviteeLabel)}</span>
              <strong>${escapeHTML(guestName)}</strong>
            </p>` : ""}
            ${inv.lines.map((l) => `<p>${escapeHTML(l)}</p>`).join("")}
          </div>
          <div class="invite-card__names">
            <strong>${escapeHTML(c.groom.name)}</strong>
            <span class="invite-card__amp" aria-hidden="true">&amp;</span>
            <strong>${escapeHTML(c.bride.name)}</strong>
          </div>
          <p class="invite-card__date">${escapeHTML(D.date.display)}</p>
          <p class="invite-card__signoff">${escapeHTML(inv.signOff)}</p>
          ${ORN.lotus(42)}
        </article>
      </div>
    </section>`;
  };

  /* ---------- RSVP ---------------------------------------------------------- */
  const Rsvp = () => {
    const r = D.rsvp, f = r.fields;
    return `
    <section class="section rsvp" id="rsvp">
      <div class="container container--narrow">
        ${SectionHead(r.title, r.titleEn)}
        <p class="section-intro reveal">${escapeHTML(r.intro)}</p>
        <div class="rsvp__wrap reveal">
          <form class="rsvp__form" id="rsvpForm" novalidate>
            <div class="field">
              <label for="rsvpName">${escapeHTML(f.name)} <span class="req">*</span></label>
              <input type="text" id="rsvpName" name="name" class="input"
                placeholder="${escapeHTML(f.namePlaceholder)}" required autocomplete="name">
            </div>
            <div class="field-row">
              <div class="field">
                <label for="rsvpPhone">${escapeHTML(f.phone)} <span class="req">*</span></label>
                <input type="tel" id="rsvpPhone" name="phone" class="input"
                  placeholder="${escapeHTML(f.phonePlaceholder)}" required autocomplete="tel" inputmode="tel">
              </div>
              <div class="field">
                <label for="rsvpGuests">${escapeHTML(f.guests)}</label>
                <input type="number" id="rsvpGuests" name="guests" class="input"
                  min="1" max="20" value="1" inputmode="numeric">
              </div>
            </div>
            <fieldset class="field field--attend">
              <legend>${escapeHTML(f.attend)}</legend>
              <div class="attend-options">
                <label class="attend-option">
                  <input type="radio" name="attend" value="yes" checked>
                  <span class="attend-option__face">${escapeHTML(f.attendYes)}</span>
                </label>
                <label class="attend-option">
                  <input type="radio" name="attend" value="no">
                  <span class="attend-option__face">${escapeHTML(f.attendNo)}</span>
                </label>
              </div>
            </fieldset>
            <p class="form-error" id="rsvpError" role="alert" hidden></p>
            <button type="submit" class="btn btn--primary btn--block">${escapeHTML(r.submit)}</button>
          </form>
          <div class="rsvp__success" id="rsvpSuccess" hidden>
            <div class="success-mark" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <circle class="success-mark__ring" cx="60" cy="60" r="52"/>
                <path class="success-mark__check" d="M36 62 L53 79 L86 43"/>
              </svg>
            </div>
            <h3 class="rsvp__success-title">${escapeHTML(r.successTitle)}</h3>
            <p class="rsvp__success-text">${escapeHTML(r.successText)}</p>
            <button type="button" class="btn btn--ghost" id="rsvpAgain">${escapeHTML(r.successAgain)}</button>
          </div>
        </div>
      </div>
    </section>`;
  };

  /* ---------- Wishes --------------------------------------------------------- */
  const Wishes = () => {
    const w = D.wishes;
    return `
    <section class="section wishes" id="wishes">
      <div class="container">
        ${SectionHead(w.title, w.titleEn)}
        <p class="section-intro reveal">${escapeHTML(w.intro)}</p>
        <form class="wish-form reveal" id="wishForm">
          <div class="field">
            <label for="wishName">${escapeHTML(D.rsvp.fields.name)}</label>
            <input class="input" type="text" id="wishName" maxlength="60"
              placeholder="${escapeHTML(w.namePlaceholder)}" required>
          </div>
          <div class="field">
            <label for="wishMessage">${escapeHTML(w.title)}</label>
            <textarea class="input input--area" id="wishMessage" rows="3" maxlength="300"
              placeholder="${escapeHTML(w.messagePlaceholder)}" required></textarea>
          </div>
          <button class="btn btn--primary" type="submit">${escapeHTML(w.submit)}</button>
        </form>
        <div class="wish-grid" id="wishGrid" aria-live="polite"></div>
      </div>
    </section>`;
  };

  /* ---------- Contact --------------------------------------------------------- */
  const Contact = () => {
    const c = D.contact, cd = D.couple;
    const person = (p) => `
      <article class="contact-card reveal">
        <div class="contact-card__avatar" aria-hidden="true">${escapeHTML(p.initial)}</div>
        <p class="contact-card__role">${escapeHTML(p.role)}</p>
        <h3 class="contact-card__name">${escapeHTML(p.name)}</h3>
        <p class="contact-card__latin">${escapeHTML(p.nameLatin)}</p>
        <a class="contact-card__phone" href="tel:${escapeHTML(p.phoneLatin)}">${escapeHTML(p.phone)}</a>
        <a class="btn btn--ghost" href="tel:${escapeHTML(p.phoneLatin)}">${escapeHTML(c.callButton)}</a>
      </article>`;
    return `
    <section class="section contact" id="contact">
      <div class="container">
        ${SectionHead(c.title, c.titleEn)}
        <p class="section-intro reveal">${escapeHTML(c.intro)}</p>
        <div class="contact__grid">
          ${person(cd.groom)}
          <div class="contact__amp reveal" aria-hidden="true">
            ${ORN.lotus(40)}
            <span>&amp;</span>
            ${ORN.lotus(40)}
          </div>
          ${person(cd.bride)}
        </div>
      </div>
    </section>`;
  };

  /* ---------- Footer ----------------------------------------------------------- */
  const Footer = () => {
    const f = D.footer, c = D.couple;
    return `
    <footer class="footer">
      <div class="footer__pattern" aria-hidden="true"></div>
      <div class="container">
        ${ORN.lotus(46)}
        <p class="footer__thanks">${escapeHTML(f.thanks)}</p>
        <p class="footer__thanks">${escapeHTML(f.thanks2)}</p>
        <p class="footer__names">${escapeHTML(c.groom.name)} <span aria-hidden="true">&amp;</span> ${escapeHTML(c.bride.name)}</p>
        ${ORN.divider(220)}
        <p class="footer__love">${escapeHTML(f.withLove)}</p>
        <p class="footer__copy">${escapeHTML(f.copyright)}</p>
      </div>
    </footer>`;
  };

  /* ---------- Music button ------------------------------------------------------ */
  const MusicButton = () => `
    <button class="music-btn" id="musicBtn" type="button"
      aria-pressed="false" aria-label="${escapeHTML(D.music.labelPlay)}" title="${escapeHTML(D.music.labelPlay)}">
      <span class="music-btn__icon" aria-hidden="true">
        <span class="music-btn__note">♪</span>
        <span class="eq"><i></i><i></i><i></i><i></i></span>
      </span>
    </button>
    <audio id="weddingAudio" loop preload="none">
      <source src="${D.music.src}" type="audio/wav">
    </audio>`;

  /* ========================================================================
     MOUNT
     ===================================================================== */
  const app = $("#app");
  app.innerHTML = `
    ${Nav()}
    ${Petals()}
    <main id="main">
      ${Hero()}
      ${Countdown()}
      ${Story()}
      ${Schedule()}
      ${Venue()}
      ${Gallery()}
      ${Invitation()}
      ${Rsvp()}
      ${Wishes()}
      ${Contact()}
    </main>
    ${Footer()}
    ${MusicButton()}
  `;

  /* ========================================================================
     CONTROLLERS
     ===================================================================== */

  /* ---------- Personalize the page for this guest ------------------------- */
  if (guestName) {
    const nameInput = $("#rsvpName");
    if (nameInput) nameInput.value = guestName;
    document.title = `${guestName} · ${D.meta.siteTitle}`;
  }

  /* ---------- Smooth scrolling ------------------------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", id);
      /* Instant active feedback on menu taps */
      if (a.classList.contains("nav__link")) setActiveLink(id);
    });
  });

  /* ---------- Scroll reveal ------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Scroll progress + nav highlight ------------------------------ */
  const progress = $("#scrollProgress");
  const navLinks = $$(".nav__link");
  const navBars = $$(".nav");
  const sections = ["#home", "#couple", "#schedule", "#venue", "#gallery", "#rsvp"]
    .map((id) => $(id))
    .filter(Boolean);

  /* Create the sliding indicator inside each nav bar */
  navBars.forEach((nav) => {
    const list = nav.querySelector(".nav__list");
    if (!list) return;
    const indicator = document.createElement("span");
    indicator.className = "nav__indicator";
    indicator.setAttribute("aria-hidden", "true");
    list.appendChild(indicator);
  });

  const moveIndicator = (nav, link) => {
    const indicator = nav.querySelector(".nav__indicator");
    const list = nav.querySelector(".nav__list");
    if (!indicator || !list || !link) return;
    if (!link.getClientRects().length) return; /* nav hidden on this breakpoint */
    const lr = link.getBoundingClientRect();
    const pr = list.getBoundingClientRect();
    indicator.style.width = `${lr.width}px`;
    indicator.style.transform = `translateX(${lr.left - pr.left}px)`;
    indicator.classList.add("is-ready");
  };

  let activeHref = null;

  const repositionIndicators = () => {
    if (!activeHref) return;
    navBars.forEach((nav) =>
      moveIndicator(nav, nav.querySelector(`.nav__link[href="${activeHref}"]`))
    );
  };

  const setActiveLink = (href) => {
    if (!href) return;
    if (href !== activeHref) {
      activeHref = href;
      navLinks.forEach((l) => {
        const on = l.getAttribute("href") === href;
        l.classList.toggle("is-active", on);
        if (on) l.setAttribute("aria-current", "page");
        else l.removeAttribute("aria-current");
      });
    }
    repositionIndicators();
  };

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActiveLink("#" + entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* Initial active state (deep links supported) */
  setActiveLink(location.hash && $(location.hash) ? location.hash : "#home");

  /* Keep the indicator aligned on resize + after webfonts settle */
  let navRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(navRaf);
    navRaf = requestAnimationFrame(repositionIndicators);
  });
  window.addEventListener("load", repositionIndicators);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(repositionIndicators);
  }

  /* ---------- Countdown ----------------------------------------------------- */
  const targetTime = new Date(D.date.iso).getTime();
  const pad = (n, len = 2) => String(n).padStart(len, "0");

  const countdownEls = {
    days: $('[data-count="days"]'),
    hours: $('[data-count="hours"]'),
    minutes: $('[data-count="minutes"]'),
    seconds: $('[data-count="seconds"]'),
  };

  const updateCountdown = () => {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      Object.values(countdownEls).forEach((el) => el && (el.textContent = "00"));
      const grid = $("#countdownGrid");
      const done = $("#countdownFinished");
      if (grid) grid.hidden = true;
      if (done) done.hidden = false;
      return;
    }
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    if (countdownEls.days) countdownEls.days.textContent = pad(days);
    if (countdownEls.hours) countdownEls.hours.textContent = pad(hours);
    if (countdownEls.minutes) countdownEls.minutes.textContent = pad(minutes);
    if (countdownEls.seconds) {
      const next = pad(seconds);
      if (countdownEls.seconds.textContent !== next) {
        countdownEls.seconds.textContent = next;
        const cell = countdownEls.seconds.closest(".countdown__cell");
        if (cell && !prefersReducedMotion()) {
          cell.classList.remove("is-tick");
          void cell.offsetWidth; /* restart animation */
          cell.classList.add("is-tick");
        }
      }
    }
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Gallery lightbox ---------------------------------------------- */
  const photos = D.gallery.photos;
  const lightbox = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbCaption = $("#lightboxCaption");
  const lbCounter = $("#lightboxCounter");
  let lbIndex = 0;
  let lastFocused = null;

  const showLightbox = (i) => {
    lbIndex = (i + photos.length) % photos.length;
    const p = photos[lbIndex];
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbCaption.textContent = p.caption;
    lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;
  };

  const openLightbox = (i) => {
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    showLightbox(i);
    $(".lightbox__close").focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  };

  $$("[data-lightbox]").forEach((btn) =>
    btn.addEventListener("click", () => openLightbox(Number(btn.dataset.lightbox)))
  );
  $(".lightbox__close").addEventListener("click", closeLightbox);
  $(".lightbox__nav--prev").addEventListener("click", () => showLightbox(lbIndex - 1));
  $(".lightbox__nav--next").addEventListener("click", () => showLightbox(lbIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
  });

  /* swipe support */
  let touchX = 0, touchY = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      showLightbox(lbIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ---------- RSVP ------------------------------------------------------------ */
  const rsvpForm = $("#rsvpForm");
  const rsvpSuccess = $("#rsvpSuccess");
  const rsvpError = $("#rsvpError");

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#rsvpName").value.trim();
    const phone = $("#rsvpPhone").value.trim();
    if (!name) {
      rsvpError.textContent = "សូមបំពេញឈ្មោះរបស់លោកអ្នក។";
      rsvpError.hidden = false;
      $("#rsvpName").focus();
      return;
    }
    if (!/^[0-9+\s()-]{6,20}$/.test(phone)) {
      rsvpError.textContent = "សូមបំពេញលេខទូរស័ព្ទឲ្យបានត្រឹមត្រូវ។";
      rsvpError.hidden = false;
      $("#rsvpPhone").focus();
      return;
    }
    rsvpError.hidden = true;
    /* Persist locally so the couple can export it later */
    try {
      const saved = JSON.parse(localStorage.getItem("kw_rsvp") || "[]");
      saved.push({
        name,
        phone,
        guests: $("#rsvpGuests").value,
        attend: rsvpForm.elements.attend.value,
        at: new Date().toISOString(),
      });
      localStorage.setItem("kw_rsvp", JSON.stringify(saved));
    } catch (_) { /* private mode — ignore */ }

    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
    rsvpSuccess.classList.add("is-animated");
    burstPetals(rsvpSuccess);
    rsvpSuccess.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  });

  $("#rsvpAgain").addEventListener("click", () => {
    rsvpForm.reset();
    rsvpForm.hidden = false;
    rsvpSuccess.hidden = true;
    rsvpSuccess.classList.remove("is-animated");
  });

  /* small celebratory petal burst on success */
  function burstPetals(container) {
    if (prefersReducedMotion()) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("span");
      p.className = "burst-petal";
      p.style.setProperty("--bx", (Math.random() * 240 - 120) + "px");
      p.style.setProperty("--by", (Math.random() * -180 - 60) + "px");
      p.style.setProperty("--rot", (Math.random() * 540 - 270) + "deg");
      p.style.setProperty("--bd", (0.9 + Math.random() * 1.2) + "s");
      p.style.setProperty("--bl", (10 + Math.random() * 80) + "%");
      container.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  }

  /* ---------- Wishes ----------------------------------------------------------- */
  const WISH_KEY = "kw_wishes";
  const wishGrid = $("#wishGrid");
  const wishForm = $("#wishForm");

  const loadWishes = () => {
    try {
      const custom = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
      return [...custom, ...D.wishes.seed];
    } catch (_) {
      return [...D.wishes.seed];
    }
  };

  const renderWishes = () => {
    const items = loadWishes();
    wishGrid.innerHTML = items.length
      ? items.map((w) => `
          <article class="wish-card">
            <div class="wish-card__quote" aria-hidden="true">”</div>
            <p class="wish-card__text">${escapeHTML(w.message)}</p>
            <footer class="wish-card__foot">
              <span class="wish-card__name">${escapeHTML(w.name)}</span>
              <span class="wish-card__time">${escapeHTML(w.time || "ម្តងនេះ")}</span>
            </footer>
          </article>`).join("")
      : `<p class="wish-empty">${escapeHTML(D.wishes.empty)}</p>`;
  };
  renderWishes();

  wishForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#wishName").value.trim();
    const message = $("#wishMessage").value.trim();
    if (!name || !message) return;
    try {
      const custom = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
      custom.unshift({ name, message, time: "ឥឡូវនេះ" });
      localStorage.setItem(WISH_KEY, JSON.stringify(custom.slice(0, 50)));
    } catch (_) { /* ignore */ }
    wishForm.reset();
    renderWishes();
    const first = wishGrid.querySelector(".wish-card");
    if (first && !prefersReducedMotion()) {
      first.classList.add("wish-card--new");
    }
  });

  /* ---------- Music --------------------------------------------------------------- */
  const musicBtn = $("#musicBtn");
  const audio = $("#weddingAudio");
  let musicStarted = false;

  audio.volume = D.music.volume;

  const setMusicUI = (playing) => {
    musicBtn.classList.toggle("is-playing", playing);
    musicBtn.setAttribute("aria-pressed", String(playing));
    musicBtn.setAttribute("aria-label", playing ? D.music.labelPause : D.music.labelPlay);
    musicBtn.title = playing ? D.music.labelPause : D.music.labelPlay;
  };

  const playMusic = () => {
    audio.play().then(() => {
      musicStarted = true;
      setMusicUI(true);
    }).catch(() => setMusicUI(false));
  };

  const toggleMusic = () => {
    if (audio.paused) playMusic();
    else {
      audio.pause();
      setMusicUI(false);
    }
  };
  musicBtn.addEventListener("click", toggleMusic);

  /* start softly after the visitor's first interaction (never before) */
  const startAfterInteraction = () => {
    if (!musicStarted) playMusic();
    window.removeEventListener("pointerdown", startAfterInteraction);
    window.removeEventListener("keydown", startAfterInteraction);
    window.removeEventListener("touchstart", startAfterInteraction);
  };
  window.addEventListener("pointerdown", startAfterInteraction, { once: true });
  window.addEventListener("keydown", startAfterInteraction, { once: true });
  window.addEventListener("touchstart", startAfterInteraction, { once: true });

  /* ---------- Reduced-motion: reveal everything immediately -------------------- */
  if (prefersReducedMotion()) {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
    $$(".petal").forEach((el) => el.remove());
  }
})();
