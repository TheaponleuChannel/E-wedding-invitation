/* ==========================================================================
   WEDDING DATA — Single source of truth
   --------------------------------------------------------------------------
   Change ONLY this file to adapt the invitation for another couple.
   Every section (hero, countdown, story, schedule, venue, gallery, RSVP…)
   is rendered from this object.
   ========================================================================== */

const WEDDING_DATA = {
  /* ---- General ---------------------------------------------------------- */
  meta: {
    siteTitle: "សិរីមង្គលអាពាហ៍ពិពាហ៍ | សុភាព បញ្ញា & ស្រីនាថ ពេជ្រ",
    description:
      "លិខិតអញ្ជើញអេឡិចត្រូនិច — ពិធីមង្គលការរបស់លោក សុភាព បញ្ញា និងកញ្ញា ស្រីនាថ ពេជ្រ ថ្ងៃសៅរ៍ ទី២១ ខែវិច្ឆិកា ឆ្នាំ២០២៦ នៅរាជធានីភ្នំពេញ។",
  },

  /* ---- Personalized guest links -----------------------------------------
     Each invitee can receive a unique URL carrying their name:
       https://your-domain.com/?to=ឈ្មោះភ្ញៀវ        (works everywhere)
       https://your-domain.com/to/ឈ្មោះភ្ញៀវ        (pretty URL — needs a rewrite rule)
     The name is shown on the invitation and pre-filled in the RSVP form. */
  guest: {
    enabled: true,
    param: "to",            /* query parameter name  */
    pathPrefix: "to",       /* pretty-URL path segment  /to/Name  */
    label: "សូមគោរពអញ្ជើញ",
    inviteeLabel: "ជូនចំពោះ",
    maxLength: 60,
  },

  /* ---- Couple ----------------------------------------------------------- */
  couple: {
    groom: {
      name: "សុភាព បញ្ញា",
      nameLatin: "Sopheak Panha",
      role: "កូនកំលោះ",
      roleEn: "The Groom",
      phone: "012 345 678",
      phoneLatin: "012345678",
      initial: "S",
    },
    bride: {
      name: "ស្រីនាថ ពេជ្រ",
      nameLatin: "Srey Neath Pich",
      role: "កូនក្រមុំ",
      roleEn: "The Bride",
      phone: "098 765 432",
      phoneLatin: "098765432",
      initial: "N",
    },
  },

  /* ---- Date ------------------------------------------------------------- */
  date: {
    /* ISO string — the countdown counts down to this moment (18:30 local) */
    iso: "2026-11-21T06:00:00+07:00",
    display: "ថ្ងៃសៅរ៍ ទី២១ ខែវិច្ឆិកា ឆ្នាំ២០២៦",
    displayEn: "Saturday · November 21, 2026",
    buddhistEra: "ព.ស.២៥៦៩",
  },

  /* ---- Hero ------------------------------------------------------------- */
  hero: {
    blessing: "សិរីមង្គលអាពាហ៍ពិពាហ៍",
    groomPrefix: "លោក",
    bridePrefix: "កញ្ញា",
    ampersand: "&",
    invitation: [
      "សូមគោរពអញ្ជើញ",
      "លោកអ្នកអញ្ជើញចូលរួមជាអធិបតី",
      "ក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ",
    ],
    cta: "បើកលិខិតអញ្ជើញ 💌",
    ctaTarget: "#invitation",
    photo: "images/hero-couple.jpg",
    photoAlt: "រូបថតគូស្វាមីភរិយាក្នុងឈុតបុរាណខ្មែរ",
  },

  /* ---- Countdown -------------------------------------------------------- */
  countdown: {
    title: "រាប់ថយក្រោយទៅកាន់ថ្ងៃមង្គលការ",
    titleEn: "Counting Down To Our Big Day",
    labels: {
      days: "ថ្ងៃ",
      hours: "ម៉ោង",
      minutes: "នាទី",
      seconds: "វិនាទី",
    },
    labelsEn: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    finished: "ថ្ងៃមង្គលការបានមកដល់ហើយ! 🎉",
  },

  /* ---- Couple story ----------------------------------------------------- */
  story: {
    title: "រឿងរ៉ាវស្នេហារបស់យើង",
    titleEn: "Our Love Story",
    items: [
      {
        icon: "🌸",
        year: "២០២១",
        yearEn: "2021",
        title: "ជំនួបដំបូង",
        titleEn: "First Meeting",
        text: "យើងបានជួបគ្នាដំបូងនៅក្នុងពិធីខួបកំណើតមិត្តភក្តិរួមគ្នា ដោយចៃដន្យដ៏ផ្អែមល្ហែមមួយ។ ស្នាមញញឹមដំបូងនោះ បានក្លាយជាដើមចំណុចនៃរឿងរ៉ាវស្នេហារបស់យើងខ្ញុំ។",
        image: "images/reception-joy.jpg",
      },
      {
        icon: "🍽️",
        year: "២០២២",
        yearEn: "2022",
        title: "កាលបរិច្ឆេទដំបូង",
        titleEn: "First Date",
        text: "លើកដំបូងដែលយើងបានទៅញ៉ាំអាហារជុំគ្នាតែពីរនាក់ នៅភោជនីយដ្ឋានតូចមួយជាប់មាត់ទន្លេ។ ចាប់ពីថ្ងៃនោះមក យើងដឹងថាចង់ចំណាយពេលវេលាជាមួយគ្នាកាន់តែច្រើន។",
        image: "images/table-decor.jpg",
      },
      {
        icon: "💍",
        year: "២០២៥",
        yearEn: "2025",
        title: "ពិធីភ្ជាប់ពាក្យ",
        titleEn: "Engagement",
        text: "នៅចំពោះមុខឪពុកម្តាយ និងសាច់ញាតិទាំងសងខាង យើងបានភ្ជាប់ពាក្យជាផ្លូវការ ដោយមានចិត្តរីករាយ និងសេចក្តីស្រឡាញ់យ៉ាងជ្រាលជ្រៅ។",
        image: "images/engagement.jpg",
      },
      {
        icon: "🤍",
        year: "២០២៦",
        yearEn: "2026",
        title: "ថ្ងៃមង្គលការ",
        titleEn: "Wedding Day",
        text: "ថ្ងៃដ៏ពិសេសបំផុតក្នុងជីវិតរបស់យើង ដែលយើងនឹងចាប់ផ្តើមដំណើរជីវិតថ្មីជាមួយគ្នា ក្រោមពរជ័យពីមនុស្សជាទីស្រឡាញ់ទាំងអស់គ្នា។",
        image: "images/hero-couple.jpg",
      },
    ],
  },

  /* ---- Ceremony schedule ------------------------------------------------ */
  schedule: {
    title: "កម្មវិធីមង្គលការ",
    titleEn: "Wedding Ceremony",
    groups: [
      {
        icon: "🌅",
        label: "ពេលព្រឹក",
        labelEn: "Morning",
        events: [
          {
            time: "06:00",
            title: "ពិធីហែជំនូន",
            text: "កូនកំលោះដង្ហែជំនូនទៅកាន់ផ្ទះកូនក្រមុំ តាមប្រពៃណីខ្មែរ",
            icon: "🎁",
          },
          {
            time: "07:00",
            title: "ពិធីក្រុងពាលី",
            text: "បួងសួងគោរពដល់ទេវតារក្សា និងបុព្វការីជន សុំសិរីសួស្តី",
            icon: "🕯️",
          },
          {
            time: "08:00",
            title: "ពិធីសូត្រមន្ត",
            text: "ព្រះសង្ឃសូត្រមន្តជូនពរ និងប្រោះស្រោចទឹកមន្ត",
            icon: "📿",
          },
        ],
      },
      {
        icon: "🌸",
        label: "ពេលរសៀល",
        labelEn: "Afternoon",
        events: [
          {
            time: "14:00",
            title: "ពិធីសែនព្រេន",
            text: "គោរពឪពុកម្តាយ និងញាតិជាន់ខ្ពស់ទាំងសងខាង តាមប្រពៃណី",
            icon: "🙏",
          },
          {
            time: "15:00",
            title: "ពិធីចងដៃ",
            text: "ប្រទានពរ និងចងអំបោះហស្សនាវាស៍ជូនគូស្វាមីភរិយាថ្មី",
            icon: "🎀",
          },
        ],
      },
      {
        icon: "🌙",
        label: "ពេលល្ងាច",
        labelEn: "Evening",
        events: [
          {
            time: "17:30",
            title: "ទទួលភ្ញៀវ",
            text: "សូមគោរពទទួលភ្ញៀវកិត្តិយសទាំងអស់ នៅមុខសាល",
            icon: "🤝",
          },
          {
            time: "18:30",
            title: "ពិធីហូបភោជនាហារ",
            text: "ភោជនាហាររួមគ្នាក្នុងបរិយាកាសរីករាយ និងកក់ក្តៅ",
            icon: "🍽️",
          },
          {
            time: "19:00",
            title: "ពិធីជប់លៀង",
            text: "រាំសប្បាយ និងអបអរសាទរជាមួយគូស្វាមីភរិយាថ្មី",
            icon: "🎉",
          },
        ],
      },
    ],
  },

  /* ---- Venue ------------------------------------------------------------ */
  venue: {
    title: "ទីតាំងរៀបចំពិធី",
    titleEn: "The Venue",
    name: "សាលមង្គលការ គ្រីស្តាល់ ហ្គ្រេន",
    nameEn: "Crystal Grand Wedding Hall",
    address: [
      "អគារលេខ ១២៨ ផ្លូវជាតិលេខ ៦១",
      "សង្កាត់ចាក់អង្រែលើ ខណ្ឌមានជ័យ",
      "រាជធានីភ្នំពេញ",
    ],
    notes: [
      { icon: "🅿️", text: "ចំណតរថយន្តធំទូលាយ" },
      { icon: "🗺️", text: "នៅជិតស្ពានអ្នកលឿងថ្មី" },
      { icon: "🕘", text: "សូមមកដល់មុនម៉ោង ១៧:៣០" },
    ],
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Crystal+Grand+Wedding+Hall+Phnom+Penh",
    mapButton: "បើក Google Maps 📍",
  },

  /* ---- Gallery ---------------------------------------------------------- */
  gallery: {
    title: "អនុស្សាវរីយ៍របស់យើង",
    titleEn: "Our Moments",
    photos: [
      { src: "images/hero-couple.jpg", alt: "គូស្វាមីភរិយាក្នុងឈុតបុរាណខ្មែរ", caption: "ថ្ងៃដ៏ស្រស់បំព្រងរបស់យើង" },
      { src: "images/angkor-portrait.jpg", alt: "គូស្វាមីភរិយានៅប្រាសាទបុរាណ", caption: "ដំណើរកម្សាន្តនៅប្រាសាទ" },
      { src: "images/bride-portrait.jpg", alt: "រូបថតកូនក្រមុំ", caption: "សម្រស់កូនក្រមុំ" },
      { src: "images/garden-walk.jpg", alt: "គូស្វាមីភរិយាដើរលេងក្នុងសួនច្បារ", caption: "រសៀលដ៏ស្ងប់ស្ងាត់" },
      { src: "images/engagement.jpg", alt: "ពិធីភ្ជាប់ពាក្យ ជំនូនមាស", caption: "ពិធីភ្ជាប់ពាក្យ" },
      { src: "images/ceremony-hands.jpg", alt: "ដៃគូស្នេហាជាមួយខ្សែអំបោះពរ", caption: "ចំណងដៃស្នេហា" },
      { src: "images/table-decor.jpg", alt: "ការតុបតែងតុភោជនាហារ", caption: "បរិយាកាសយប់មង្គលការ" },
      { src: "images/reception-joy.jpg", alt: "ភាពរីករាយក្នុងពិធីមង្គលការ", caption: "សំណើចរួមគ្នា" },
      { src: "images/sunset-silhouette.jpg", alt: "ស្រមោលគូស្វាមីភរិយាពេលថ្ងៃលិច", caption: "ពេលថ្ងៃលិច" },
      { src: "images/lotus-detail.jpg", alt: "ផ្កាឈូក និងទៀនអមពិធី", caption: "ផ្កាឈូកសំណាងល្អ" },
    ],
  },

  /* ---- Invitation card -------------------------------------------------- */
  invitation: {
    title: "លិខិតអញ្ជើញ",
    titleEn: "The Invitation",
    lines: [
      "យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ",
      "លោកអ្នក និងក្រុមគ្រួសារ",
      "ចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ",
      "ដើម្បីចែករំលែកនូវសេចក្តីស្រឡាញ់",
      "និងអនុស្សាវរីយ៍ដ៏មានតម្លៃជាមួយយើងខ្ញុំ។",
    ],
    signOff: "សូមអរគុណចំពោះកិត្តិយសរបស់លោកអ្នក",
  },

  /* ---- RSVP ------------------------------------------------------------- */
  rsvp: {
    title: "សូមបញ្ជាក់ការចូលរួម",
    titleEn: "RSVP",
    intro: "សូមលោកអ្នកមេត្តាបំពេញទម្រង់ខាងក្រោម ដើម្បីយើងខ្ញុំអាចរៀបចំកន្លែងអង្គុយបានសមរម្យ។",
    fields: {
      name: "ឈ្មោះ",
      namePlaceholder: "សូមបំពេញឈ្មោះរបស់លោកអ្នក",
      phone: "លេខទូរស័ព្ទ",
      phonePlaceholder: "0XX XXX XXXX",
      guests: "ចំនួនភ្ញៀវ",
      guestsPlaceholder: "ចំនួនអ្នកចូលរួម",
      attend: "តើលោកអ្នកអាចចូលរួមបានទេ?",
      attendYes: "✓ ចូលរួម",
      attendNo: "✓ មិនអាចចូលរួម",
    },
    submit: "បញ្ជូនការឆ្លើយតប",
    successTitle: "សូមអរគុណចំពោះការឆ្លើយតប! 🙏",
    successText: "យើងខ្ញុំរំភើបរីករាយណាស់ដែលបានឮដំណឹងពីលោកអ្នក។ សូមជួបគ្នាក្នុងថ្ងៃមង្គលការ!",
    successAgain: "បំពេញម្តងទៀត",
  },

  /* ---- Wishes / Guestbook ---------------------------------------------- */
  wishes: {
    title: "សារជូនពរ",
    titleEn: "Blessings & Wishes",
    intro: "សូមទុកសារជូនពរដល់គូស្វាមីភរិយាថ្មី នៅក្នុងទំព័រនេះ។",
    namePlaceholder: "ឈ្មោះរបស់លោកអ្នក",
    messagePlaceholder: "សូមសរសេរសារជូនពរ...",
    submit: "ផ្ញើរសារជូនពរ",
    empty: "មិនទាន់មានសារជូនពរនៅឡើយទេ — សូមក្លាយជាដំបូង!",
    seed: [
      {
        name: "លោក សុវណ្ណ ភារម្យ",
        message:
          "សូមជូនពរឲ្យគូស្វាមីភរិយាថ្មីមានសេចក្តីសុខ សេចក្តីចម្រើន និងស្នេហាផ្អែមល្ហែមអស់មួយជីវិត! 🙏🌸",
        time: "២ ថ្ងៃមុន",
      },
      {
        name: "អ្នកស្រី ចន្ទ្រា សុខា",
        message:
          "ជូនពរឲ្យប្តីប្រពន្ធថ្មីស្រឡាញ់គ្នារហូតចាស់កោងខ្នង មានសុភមង្គលគ្រប់ពេលវេលា! 💍❤️",
        time: "១ ថ្ងៃមុន",
      },
      {
        name: "លោក ដារ៉ា ប៊ុនធឿន",
        message:
          "សូមឲ្យថ្ងៃមង្គលការនេះ ជាដើមចំណុចនៃជីវិតដ៏ស្រស់បំព្រងរបស់អ្នកទាំងពីរ។ សូមអបអរសាទរ! 🥂✨",
        time: "១២ ម៉ោងមុន",
      },
    ],
  },

  /* ---- Contact ---------------------------------------------------------- */
  contact: {
    title: "ទំនាក់ទំនង",
    titleEn: "Contact Us",
    intro: "សម្រាប់ព័ត៌មានបន្ថែម សូមទាក់ទងមកយើងខ្ញុំផ្ទាល់។",
    callButton: "ហៅទូរស័ព្ទ 📞",
  },

  /* ---- Music ------------------------------------------------------------ */
  music: {
    src: "audio/wedding-music.wav",
    volume: 0.42,
    labelPlay: "បើកតន្ត្រី",
    labelPause: "បញ្ឈប់តន្ត្រី",
  },

  /* ---- Navigation ------------------------------------------------------- */
  nav: [
    { href: "#home", icon: "🏠", label: "ទំព័រដើម" },
    { href: "#couple", icon: "❤️", label: "គូស្នេហ៍" },
    { href: "#schedule", icon: "📅", label: "កម្មវិធី" },
    { href: "#venue", icon: "📍", label: "ទីតាំង" },
    { href: "#gallery", icon: "📸", label: "រូបភាព" },
    { href: "#rsvp", icon: "💌", label: "RSVP" },
  ],

  /* ---- Footer ----------------------------------------------------------- */
  footer: {
    thanks: "សូមអរគុណសម្រាប់វត្តមាន",
    thanks2: "និងក្តីស្រឡាញ់របស់លោកអ្នក",
    withLove: "With Love ❤️",
      copyright: "© ២០២៦ · សិរីមង្គលអាពាហ៍ពិពាហ៍",
  },
};

/* Expose globally so the app (and console) can read the config */
if (typeof window !== "undefined") window.WEDDING_DATA = WEDDING_DATA;
