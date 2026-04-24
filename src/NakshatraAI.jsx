import { useState, useEffect, useRef } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#060410",
  surface: "#0e0820",
  card: "#150d2e",
  cardHover: "#1d1240",
  gold: "#e8b84b",
  goldLight: "#f5d07a",
  saffron: "#ff6b1a",
  purple: "#7c3aed",
  purpleLight: "#a78bfa",
  text: "#f0e6ff",
  muted: "#7c6a9e",
  border: "#231650",
  success: "#22c55e",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ZODIAC = [
  { name: "Aries", symbol: "♈", ruler: "Mars", element: "Fire", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", symbol: "♉", ruler: "Venus", element: "Earth", dates: "Apr 20 – May 20" },
  { name: "Gemini", symbol: "♊", ruler: "Mercury", element: "Air", dates: "May 21 – Jun 20" },
  { name: "Cancer", symbol: "♋", ruler: "Moon", element: "Water", dates: "Jun 21 – Jul 22" },
  { name: "Leo", symbol: "♌", ruler: "Sun", element: "Fire", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", symbol: "♍", ruler: "Mercury", element: "Earth", dates: "Aug 23 – Sep 22" },
  { name: "Libra", symbol: "♎", ruler: "Venus", element: "Air", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", symbol: "♏", ruler: "Mars", element: "Water", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", symbol: "♐", ruler: "Jupiter", element: "Fire", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn", symbol: "♑", ruler: "Saturn", element: "Earth", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius", symbol: "♒", ruler: "Saturn", element: "Air", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", symbol: "♓", ruler: "Jupiter", element: "Water", dates: "Feb 19 – Mar 20" },
];

const GRAHAS = [
  { name: "Sun", symbol: "☉", color: "#FFD700", glyph: "Su" },
  { name: "Moon", symbol: "☽", color: "#C8C8D4", glyph: "Mo" },
  { name: "Mars", symbol: "♂", color: "#FF6B4A", glyph: "Ma" },
  { name: "Mercury", symbol: "☿", color: "#6EE7B7", glyph: "Me" },
  { name: "Jupiter", symbol: "♃", color: "#FFA040", glyph: "Ju" },
  { name: "Venus", symbol: "♀", color: "#F472B6", glyph: "Ve" },
  { name: "Saturn", symbol: "♄", color: "#818CF8", glyph: "Sa" },
  { name: "Rahu", symbol: "☊", color: "#CD853F", glyph: "Ra" },
  { name: "Ketu", symbol: "☋", color: "#F87171", glyph: "Ke" },
];

const LIFE_AREAS = ["Career", "Finance", "Health", "Love", "Relationships", "Peace of Mind", "Spiritual Growth", "Education"];

const REMEDIES = {
  Career: [
    { name: "Surya Japa", mantra: "Om Hraam Hreem Hraum Sah Suryaya Namah", count: 108, deity: "Surya Dev", benefit: "Career growth & authority" },
    { name: "Ganesha Vandana", mantra: "Om Gam Ganapataye Namah", count: 21, deity: "Ganesha", benefit: "Remove career obstacles" },
  ],
  Finance: [
    { name: "Lakshmi Stuti", mantra: "Om Shreem Mahalakshmiyei Namah", count: 108, deity: "Lakshmi Devi", benefit: "Wealth & prosperity" },
    { name: "Kubera Mantra", mantra: "Om Yakshaya Kuberaya Vaishravanaya Namah", count: 11, deity: "Kubera", benefit: "Financial abundance" },
  ],
  Health: [
    { name: "Maha Mrityunjaya", mantra: "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityormuksheeya Mamritat", count: 108, deity: "Shiva", benefit: "Healing & longevity" },
    { name: "Dhanvantari Mantra", mantra: "Om Namo Bhagavate Vasudevaya Dhanvantaraye Amrita Kalasha Hastaya Namah", count: 21, deity: "Dhanvantari", benefit: "Physical wellbeing" },
  ],
  Love: [
    { name: "Radha Krishna Mantra", mantra: "Om Kleem Krishnaya Namah", count: 108, deity: "Krishna", benefit: "Attract love & romance" },
    { name: "Venus Beej Mantra", mantra: "Om Draam Dreem Droum Sah Shukraya Namah", count: 108, deity: "Shukra Dev", benefit: "Love & beauty" },
  ],
  Relationships: [
    { name: "Parvati Mantra", mantra: "Om Hreem Shreem Parvatiputraya Namah", count: 108, deity: "Parvati", benefit: "Harmonious bonds" },
    { name: "Satyanarayana Puja", mantra: "Om Namo Bhagavate Vasudevaya", count: 108, deity: "Vishnu", benefit: "Family harmony" },
  ],
  "Peace of Mind": [
    { name: "Gayatri Mantra", mantra: "Om Bhur Bhuvah Swah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat", count: 108, deity: "Gayatri Devi", benefit: "Clarity & inner peace" },
    { name: "Shanti Path", mantra: "Om Shanti Shanti Shantihi", count: 21, deity: "Universal", benefit: "Deep stillness" },
  ],
  "Spiritual Growth": [
    { name: "Panchakshara Mantra", mantra: "Om Namah Shivaya", count: 108, deity: "Shiva", benefit: "Spiritual awakening" },
    { name: "Hare Krishna Mahamantra", mantra: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare", count: 108, deity: "Krishna", benefit: "Divine connection" },
  ],
  Education: [
    { name: "Saraswati Vandana", mantra: "Om Aim Saraswatyai Namah", count: 108, deity: "Saraswati", benefit: "Intelligence & learning" },
    { name: "Budha Beej Mantra", mantra: "Om Braam Breem Broum Sah Budhaya Namah", count: 17, deity: "Budha Dev", benefit: "Memory & focus" },
  ],
};

// ─── Real Vedic Astrology Engine (Meeus Keplerian Elements + Lahiri) ────────
function toRad(d) { return d * Math.PI / 180; }
function norm360(d) { return ((d % 360) + 360) % 360; }

function julianDay(year, month, day, hourUT) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25*(year+4716)) + Math.floor(30.6001*(month+1)) + day + hourUT/24 + B - 1524.5;
}

function lahiriAyanamsa(JD) {
  const y = (JD - 2415020.0) / 365.25;
  return 22.46047 + (50.2388475 * y) / 3600;
}

function solveKepler(M, e) {
  let E = M;
  for (let i = 0; i < 15; i++) E -= (E - e*Math.sin(E) - M) / (1 - e*Math.cos(E));
  return E;
}

function helioXY(L0, dL, a, e, de, i0, di, O0, dO, w0, dw, T) {
  const L   = norm360(L0 + dL*T);
  const ec  = e + de*T;
  const inc = toRad(i0 + di*T);
  const OM  = toRad(norm360(O0 + dO*T));
  const LP  = toRad(norm360(w0 + dw*T));
  const om  = LP - OM;
  const M   = toRad(norm360(L - norm360(w0 + dw*T)));
  const E   = solveKepler(M, ec);
  const nu  = 2*Math.atan2(Math.sqrt(1+ec)*Math.sin(E/2), Math.sqrt(1-ec)*Math.cos(E/2));
  const r   = a*(1 - ec*Math.cos(E));
  const x   = r*(Math.cos(OM)*Math.cos(nu+om) - Math.sin(OM)*Math.sin(nu+om)*Math.cos(inc));
  const y   = r*(Math.sin(OM)*Math.cos(nu+om) + Math.cos(OM)*Math.sin(nu+om)*Math.cos(inc));
  return { x, y, r };
}

function calcPlanetsRaw(JD) {
  const T  = (JD - 2451545.0) / 36525;
  const T2 = T * T;

  // Sun (geocentric)
  const Ms  = norm360(357.52911 + 35999.05029*T - 0.0001537*T2);
  const Cr  = (1.914602-0.004817*T)*Math.sin(toRad(Ms)) + 0.019993*Math.sin(toRad(2*Ms)) + 0.000289*Math.sin(toRad(3*Ms));
  const L0s = norm360(280.46646 + 36000.76983*T);
  const sun = norm360(L0s + Cr);

  // Moon
  const Lm = norm360(218.3165 + 481267.8813*T);
  const Mm = norm360(134.9634 + 477198.8676*T);
  const Fm = norm360(93.2721  + 483202.0175*T);
  const Dm = norm360(297.8502 + 445267.1115*T);
  const moon = norm360(Lm
    + 6.2886*Math.sin(toRad(Mm))  + 1.2740*Math.sin(toRad(2*Dm-Mm))
    + 0.6583*Math.sin(toRad(2*Dm))+ 0.2136*Math.sin(toRad(2*Mm))
    - 0.1851*Math.sin(toRad(Ms))  - 0.1143*Math.sin(toRad(2*Fm))
    + 0.0588*Math.sin(toRad(2*Dm-2*Mm)));

  // Rahu (mean lunar node, retrograde)
  const rahu = norm360(125.0445 - 1934.1363*T + 0.002075*T2);
  const ketu = norm360(rahu + 180);

  // Earth heliocentric (for geocentric conversion)
  const Re = 1.000140 - 0.016708*Math.cos(toRad(Ms)) - 0.000141*Math.cos(toRad(2*Ms));
  const xe = Re * Math.cos(toRad(norm360(sun + 180)));
  const ye = Re * Math.sin(toRad(norm360(sun + 180)));

  // Keplerian elements (Meeus Table 33.a, J2000) — Mercury, Venus, Mars, Saturn
  const ELEMS = {
    merc: [252.250906,149472.6746358,0.38709927,0.20563593,0.00001906,7.00497902,-0.00594749,48.33076593,-0.12534081,77.45779628,0.16047689],
    venu: [181.979801,58517.8156760, 0.72333566,0.00677672,-0.00004107,3.39467605,-0.00078890,76.67984255,-0.27769418,131.60246718,0.00268329],
    mars: [355.433000,19140.2964471, 1.52371034,0.09339410, 0.00007882,1.84969142,-0.00813131,49.55953891,-0.29257343,336.04084002,0.44441088],
    satu: [49.954244, 1222.1138488,  9.53667594,0.05386179,-0.00050991,2.48599187, 0.00193609,113.66242448,-0.28867794,92.59887831,-0.41897216],
  };

  const geoLon = (key) => {
    const [L0,dL,a,e,de,i0,di,O0,dO,w0,dw] = ELEMS[key];
    const { x, y } = helioXY(L0,dL,a,e,de,i0,di,O0,dO,w0,dw, T);
    return norm360(Math.atan2(y - ye, x - xe) * 180 / Math.PI);
  };

  // Jupiter: VSOP87 truncated series (much more accurate than simple Kepler)
  const tau = T / 10;
  const vs = (terms) => terms.reduce((s,[A,B,C]) => s + A*Math.cos(B+C*tau), 0);
  const JL0=[[59954691,0,0],[9695899,5.0619179,529.6909651],[573610,1.444062,1059.381930],[306389,5.417347,522.577418],[97178,4.14264,536.80451],[72903,3.64043,21.34065],[64264,3.41145,7.11355],[39806,2.29377,543.91820]];
  const JL1=[[52993480757,0,0],[489741,4.220667,529.690965],[228919,6.026475,7.113547],[27655,4.57266,1059.38193]];
  const JL2=[[47234,4.32148,529.69097],[38966,0,0],[30629,2.93021,7.11355]];
  const JR0=[[520887429,0,0],[25209327,3.49108640,529.69096509],[610600,3.841154,1059.381930],[282029,2.574199,206.185548]];
  const L_jup_hel = norm360(((vs(JL0)+vs(JL1)*tau+vs(JL2)*tau*tau)*1e-8)*180/Math.PI);
  const R_jup = vs(JR0)*1e-8;
  const xj = R_jup*Math.cos(toRad(L_jup_hel));
  const yj = R_jup*Math.sin(toRad(L_jup_hel));
  const jupi = norm360(Math.atan2(yj-ye, xj-xe)*180/Math.PI);

  return {
    sun, moon,
    mars: geoLon('mars'),
    merc: geoLon('merc'),
    jupi,
    venu: geoLon('venu'),
    satu: geoLon('satu'),
    rahu, ketu,
  };
}

function calcLagna(JD, latDeg, lonDeg) {
  const T   = (JD - 2451545.0) / 36525;
  const GST = norm360(280.46061837 + 360.98564736629*(JD-2451545) + 0.000387933*T*T);
  const LST = norm360(GST + lonDeg);
  const eps = toRad(23.4393 - 0.013*T);
  const ramc = toRad(LST), lat = toRad(latDeg);
  const y = -Math.cos(ramc);
  const x = Math.sin(ramc)*Math.cos(eps) + Math.tan(lat)*Math.sin(eps);
  let asc = norm360(Math.atan2(y, x) * 180 / Math.PI);
  if (Math.cos(ramc) > 0) asc = norm360(asc + 180);
  return asc;
}

// Exaltation / Debilitation / Own sign status
const PLANET_STATUS_MAP = {
  sun:  { ex:0,  exd:10, de:6,  ded:10, own:[4]       },
  moon: { ex:1,  exd:3,  de:7,  ded:3,  own:[3]       },
  mars: { ex:9,  exd:28, de:3,  ded:28, own:[0,7]     },
  merc: { ex:5,  exd:15, de:11, ded:15, own:[2,5]     },
  jupi: { ex:3,  exd:5,  de:9,  ded:5,  own:[8,11]    },
  venu: { ex:11, exd:27, de:5,  ded:27, own:[1,6]     },
  satu: { ex:6,  exd:20, de:0,  ded:20, own:[9,10]    },
  rahu: { ex:1,  exd:20, de:7,  ded:20, own:[]        },
  ketu: { ex:7,  exd:20, de:1,  ded:20, own:[]        },
};

function getPlanetStatus(key, sign) {
  const m = PLANET_STATUS_MAP[key];
  if (!m) return null;
  if (sign === m.ex) return 'exalted';
  if (sign === m.de) return 'debilitated';
  if (m.own.includes(sign)) return 'own';
  return null;
}

function getZodiacIdx(dob) {
  const d  = new Date(dob);
  const JD = julianDay(d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate(), 12);
  const raw = calcPlanetsRaw(JD);
  return Math.floor(norm360(raw.sun - lahiriAyanamsa(JD)) / 30);
}

// ─── House Lords (sign rulers) ───────────────────────────────────────────────
const SIGN_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
// Traditional lords (Mars for Scorpio, Jupiter for Pisces/Sagittarius, Saturn for Cap/Aquarius)

function getHouseLord(lagnaSign, houseNum) {
  const signIdx = (lagnaSign + houseNum - 1) % 12;
  return SIGN_LORDS[signIdx];
}

// ─── Nakshatra Data ───────────────────────────────────────────────────────────
const NAKSHATRAS = [
  {name:"Ashwini",          short:"Ashwi", start:0,       lord:"Ketu"   },
  {name:"Bharani",          short:"Bhar",  start:13.3333, lord:"Venus"  },
  {name:"Krittika",         short:"Krit",  start:26.6667, lord:"Sun"    },
  {name:"Rohini",           short:"Rohi",  start:40,      lord:"Moon"   },
  {name:"Mrigashira",       short:"Mrig",  start:53.3333, lord:"Mars"   },
  {name:"Ardra",            short:"Ardr",  start:66.6667, lord:"Rahu"   },
  {name:"Punarvasu",        short:"Puna",  start:80,      lord:"Jupiter"},
  {name:"Pushya",           short:"Push",  start:93.3333, lord:"Saturn" },
  {name:"Ashlesha",         short:"Ashl",  start:106.6667,lord:"Mercury"},
  {name:"Magha",            short:"Magh",  start:120,     lord:"Ketu"   },
  {name:"Purva Phalguni",   short:"PPha",  start:133.3333,lord:"Venus"  },
  {name:"Uttara Phalguni",  short:"UPha",  start:146.6667,lord:"Sun"    },
  {name:"Hasta",            short:"Hast",  start:160,     lord:"Moon"   },
  {name:"Chitra",           short:"Chit",  start:173.3333,lord:"Mars"   },
  {name:"Swati",            short:"Swat",  start:186.6667,lord:"Rahu"   },
  {name:"Vishakha",         short:"Vish",  start:200,     lord:"Jupiter"},
  {name:"Anuradha",         short:"Anur",  start:213.3333,lord:"Saturn" },
  {name:"Jyeshtha",         short:"Jyes",  start:226.6667,lord:"Mercury"},
  {name:"Mula",             short:"Mula",  start:240,     lord:"Ketu"   },
  {name:"Purva Ashadha",    short:"PAsh",  start:253.3333,lord:"Venus"  },
  {name:"Uttara Ashadha",   short:"UAsh",  start:266.6667,lord:"Sun"    },
  {name:"Shravana",         short:"Shra",  start:280,     lord:"Moon"   },
  {name:"Dhanishta",        short:"Dhan",  start:293.3333,lord:"Mars"   },
  {name:"Shatabhisha",      short:"Shat",  start:306.6667,lord:"Rahu"   },
  {name:"Purva Bhadrapada", short:"PBha",  start:320,     lord:"Jupiter"},
  {name:"Uttara Bhadrapada",short:"UBha",  start:333.3333,lord:"Saturn" },
  {name:"Revati",           short:"Reva",  start:346.6667,lord:"Mercury"},
];

function getNakshatra(sid) {
  const s = ((sid % 360) + 360) % 360;
  const idx = Math.min(Math.floor(s / 13.3333), 26);
  const nak = NAKSHATRAS[idx];
  const pada = Math.min(Math.floor((s - nak.start) / (13.3333 / 4)) + 1, 4);
  return { ...nak, pada };
}

// ─── Vimshottari Dasha Engine ────────────────────────────────────────────────
const DASHA_ORDER  = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_YEARS  = {Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const DASHA_COLORS = {Ketu:'#F87171',Venus:'#F472B6',Sun:'#FFD700',Moon:'#C8C8D4',Mars:'#FF6B4A',Rahu:'#CD853F',Jupiter:'#FFA040',Saturn:'#818CF8',Mercury:'#6EE7B7'};

// Nakshatra lord sequence (matches 27 nakshatras, repeating DASHA_ORDER cycle)
const NAK_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
                   'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
                   'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

function calcDashas(moonSid, birthDateStr, birthTimeStr) {
  // Moon nakshatra index (0-based)
  const nakIdx  = Math.min(Math.floor(moonSid / 13.3333), 26);
  const nakStart = nakIdx * 13.3333;
  const nakSpan  = 13.3333;
  const elapsed  = (moonSid - nakStart) / nakSpan;   // fraction elapsed
  const remaining = 1 - elapsed;

  const startLord = NAK_LORDS[nakIdx];
  const startIdx  = DASHA_ORDER.indexOf(startLord);
  const startYears = DASHA_YEARS[startLord];

  // Birth datetime
  let birthMs;
  try {
    const [y,m,d] = birthDateStr.split('-').map(Number);
    let h = 0, mn = 0;
    if (birthTimeStr) { const [hh,mm] = birthTimeStr.split(':').map(Number); h=hh; mn=mm; }
    birthMs = new Date(y, m-1, d, h, mn).getTime();
  } catch(e) { birthMs = Date.now(); }

  // The first dasha started before birth by (elapsed * startYears) years
  const msPerYear = 365.25 * 24 * 3600 * 1000;
  let currentStart = birthMs - elapsed * startYears * msPerYear;

  const dashas = [];
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const years = DASHA_YEARS[lord];
    const end = currentStart + years * msPerYear;
    dashas.push({ lord, start: currentStart, end, years });
    currentStart = end;
  }

  const now = Date.now();
  const mahaIdx = dashas.findIndex(d => d.start <= now && now < d.end);
  const maha = dashas[mahaIdx >= 0 ? mahaIdx : 0];

  // Antardasha within mahadasha
  const mahaLordIdx = DASHA_ORDER.indexOf(maha.lord);
  let antarStart = maha.start;
  const antardashas = [];
  for (let i = 0; i < 9; i++) {
    const aLord = DASHA_ORDER[(mahaLordIdx + i) % 9];
    const aDuration = (maha.years * DASHA_YEARS[aLord] / 120) * msPerYear;
    const aEnd = antarStart + aDuration;
    antardashas.push({ lord: aLord, start: antarStart, end: aEnd });
    antarStart = aEnd;
  }
  const antarIdx = antardashas.findIndex(d => d.start <= now && now < d.end);
  const antar = antardashas[antarIdx >= 0 ? antarIdx : 0];

  // Pratyantardasha within antardasha
  const antarLordIdx = DASHA_ORDER.indexOf(antar.lord);
  const antarDurMs = antar.end - antar.start;
  let pratStart = antar.start;
  const pratdashas = [];
  for (let i = 0; i < 9; i++) {
    const pLord = DASHA_ORDER[(antarLordIdx + i) % 9];
    const pDuration = antarDurMs * DASHA_YEARS[pLord] / 120;
    const pEnd = pratStart + pDuration;
    pratdashas.push({ lord: pLord, start: pratStart, end: pEnd });
    pratStart = pEnd;
  }
  const pratIdx = pratdashas.findIndex(d => d.start <= now && now < d.end);
  const prat = pratdashas[pratIdx >= 0 ? pratIdx : 0];

  const fmt = (ms) => {
    const d = new Date(ms);
    return `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getFullYear()}`;
  };
  const pct = (d) => Math.round(((now - d.start) / (d.end - d.start)) * 100);

  return {
    nakshatra: nakIdx,
    startLord,
    dashas: dashas.map(d => ({ ...d, startFmt: fmt(d.start), endFmt: fmt(d.end) })),
    maha:  { ...maha,  startFmt: fmt(maha.start),  endFmt: fmt(maha.end),  pct: pct(maha)  },
    antar: { ...antar, startFmt: fmt(antar.start), endFmt: fmt(antar.end), pct: pct(antar) },
    prat:  { ...prat,  startFmt: fmt(prat.start),  endFmt: fmt(prat.end),  pct: pct(prat)  },
    antardashas: antardashas.map(d => ({ ...d, startFmt: fmt(d.start), endFmt: fmt(d.end) })),
  };
}

// City coordinates lookup


const CITY_COORDS = {
  "Delhi":[28.61,77.21],"Mumbai":[19.08,72.88],"Bangalore":[12.97,77.59],
  "Chennai":[13.08,80.27],"Kolkata":[22.57,88.36],"Hyderabad":[17.38,78.47],
  "Pune":[18.52,73.86],"Ahmedabad":[23.02,72.57],"Jaipur":[26.91,75.79],
  "Lucknow":[26.85,80.95],"Kanpur":[26.45,80.35],"Nagpur":[21.15,79.09],
  "Indore":[22.72,75.86],"Bhopal":[23.26,77.41],"Patna":[25.59,85.14],
  "Vadodara":[22.31,73.18],"Surat":[21.17,72.83],"Coimbatore":[11.02,76.97],
  "Kochi":[9.93,76.27],"Dehradun":[30.32,78.03],"Chandigarh":[30.73,76.78],
  "Amritsar":[31.63,74.87],"Ludhiana":[30.90,75.85],"Agra":[27.18,78.01],
  "Varanasi":[25.32,83.00],"Rewari":[28.19,76.62],"Gurgaon":[28.46,77.03],
  "Noida":[28.54,77.39],"Faridabad":[28.41,77.31],"Rohtak":[28.89,76.61],
  "Hisar":[29.15,75.72],"Panipat":[29.39,76.97],"Karnal":[29.69,76.99],
  "Dubai":[25.20,55.27],"Abu Dhabi":[24.47,54.37],"Riyadh":[24.69,46.72],
  "London":[51.51,-0.13],"New York":[40.71,-74.01],"Toronto":[43.65,-79.38],
  "Singapore":[1.35,103.82],"Sydney":[-33.87,151.21],"Melbourne":[-37.81,144.96],
  "Tokyo":[35.68,139.69],"Bangkok":[13.75,100.52],"Kuala Lumpur":[3.14,101.69],
  "Kathmandu":[27.70,85.32],"Colombo":[6.93,79.85],"Dhaka":[23.72,90.41],
  "Karachi":[24.86,67.01],"Lahore":[31.55,74.35],"Islamabad":[33.72,73.06],
};

function getPlanets(dob, tob, pobStr) {
  const d = new Date(dob);
  let hourIST = 12;
  if (tob) { const [h,m] = tob.split(':').map(Number); hourIST = h + m/60; }
  let hourUT = hourIST - 5.5;
  let year = d.getUTCFullYear(), month = d.getUTCMonth()+1, day = d.getUTCDate();
  if (hourUT < 0)  { hourUT += 24; day -= 1; }
  if (hourUT >= 24){ hourUT -= 24; day += 1; }

  const JD   = julianDay(year, month, day, hourUT);
  const ayan = lahiriAyanamsa(JD);
  const raw  = calcPlanetsRaw(JD);

  // Get coords for place
  let latDeg = 28.19, lonDeg = 76.62;
  if (pobStr) {
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
      if (pobStr.toLowerCase().includes(city.toLowerCase())) {
        [latDeg, lonDeg] = coords; break;
      }
    }
  }

  const lagnaT    = calcLagna(JD, latDeg, lonDeg);
  const lagnaSid  = norm360(lagnaT - ayan);
  const lagnaSign = Math.floor(lagnaSid / 30);
  const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  const toSid   = t => norm360(t - ayan);
  const toHouse = sid => ((Math.floor(sid/30) - lagnaSign + 12) % 12) + 1;
  const rawNext = calcPlanetsRaw(JD + 1);
  const isRetro = key => { let d = norm360(rawNext[key]-raw[key]); if(d>180)d-=360; return d<0; };

  const defs = [
    {key:'sun', name:'Sun',     symbol:'☉', glyph:'Su', color:'#FFD700'},
    {key:'moon',name:'Moon',    symbol:'☽', glyph:'Mo', color:'#C8C8D4'},
    {key:'mars',name:'Mars',    symbol:'♂', glyph:'Ma', color:'#FF6B4A'},
    {key:'merc',name:'Mercury', symbol:'☿', glyph:'Me', color:'#6EE7B7'},
    {key:'jupi',name:'Jupiter', symbol:'♃', glyph:'Ju', color:'#FFA040'},
    {key:'venu',name:'Venus',   symbol:'♀', glyph:'Ve', color:'#F472B6'},
    {key:'satu',name:'Saturn',  symbol:'♄', glyph:'Sa', color:'#818CF8'},
    {key:'rahu',name:'Rahu',    symbol:'☊', glyph:'Ra', color:'#CD853F'},
    {key:'ketu',name:'Ketu',    symbol:'☋', glyph:'Ke', color:'#F87171'},
  ];

  return {
    lagnaSign,
    lagnaDeg:  +(lagnaSid % 30).toFixed(1),
    lagnaName: SIGN_NAMES[lagnaSign],
    planets: defs.map(p => {
      const sid    = toSid(raw[p.key]);
      const sign   = Math.floor(sid / 30);
      const degree = +(sid % 30).toFixed(1);
      const house  = toHouse(sid);
      const retro  = isRetro(p.key);
      const status = getPlanetStatus(p.key, sign);
      const nak    = getNakshatra(sid);
      return { ...p, sid, sign, degree, house, retro, status, signName: SIGN_NAMES[sign], nakshatra: nak.name, nakshort: nak.short, nakLord: nak.lord, pada: nak.pada };
    })
  };
}

// ─── Claude AI Call ───────────────────────────────────────────────────────────
async function fetchAIHoroscope({ name, zodiac, planets, area, period, pob }) {
  const dominantPlanets = planets.slice(0, 4).map(p => `${p.name} in House ${p.house}`).join(", ");
  const prompt = `You are a compassionate, authentic Vedic astrologer. Generate a ${period} horoscope reading for ${name || "the seeker"}.

Birth details:
- Zodiac sign: ${zodiac.name} (${zodiac.element}, ruled by ${zodiac.ruler})
- Key planetary placements: ${dominantPlanets}
- Birth place: ${pob || "undisclosed"}
- Focus area: ${area}

Write a warm, insightful, practical ${period} Vedic horoscope for the area of "${area}". 
- 3-4 sentences max
- Be specific and actionable, not vague
- Reference actual Vedic astrology concepts (dashas, transits, yogas) naturally
- End with one practical, grounded suggestion
- Tone: wise, encouraging, honest — never fear-based
- Do NOT use phrases like "as an AI" or disclaimers`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "The stars are aligning... please try again.";
}

async function fetchAIRemedy({ name, zodiac, area }) {
  const prompt = `You are a knowledgeable Vedic astrologer. For ${name || "the seeker"} (${zodiac.name}, ${zodiac.element} sign, ruled by ${zodiac.ruler}), suggest one additional personalized Vedic remedy for "${area}".

Format your response as JSON only (no markdown, no extra text):
{
  "name": "remedy name",
  "mantra": "the mantra text",
  "count": number (11, 21, or 108),
  "deity": "deity name",
  "benefit": "short benefit description",
  "instructions": "2-sentence special instruction for this person based on their sign"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "{}";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch { return null; }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
  @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes glow { 0%,100%{box-shadow:0 0 10px #e8b84b33} 50%{box-shadow:0 0 35px #e8b84b99} }
  @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
  .tab-btn:hover{background:#1d1240 !important}
  .card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 40px #e8b84b18 !important}
  .pill:hover{background:#2d1f5e !important}
  .area-active{background:linear-gradient(135deg,#e8b84b22,#7c3aed22) !important; border-color:#e8b84b !important}
  input,select{outline:none;color-scheme:dark}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:2px}
  .loading-dots::after{content:''; animation:dots 1.5s infinite}
  @keyframes dots{0%{content:''}33%{content:'.'}66%{content:'..'}100%{content:'...'}}
`;

function Stars() {
  const pts = Array.from({length:80},(_,i)=>({
    x:(i*137.508)%100, y:(i*89.3)%100,
    s:((i%4)+1)*0.6, d:(i%10)*0.4,
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
      {pts.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.s,height:p.s,borderRadius:"50%",
          background:i%5===0?"#ff6b1a":"#e8b84b",
          animation:`twinkle ${2+p.d}s ease-in-out infinite`,
          animationDelay:`${p.d}s`,
        }}/>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:24}}>
      <div style={{
        width:40,height:40,borderRadius:"50%",
        border:`3px solid ${C.border}`,
        borderTopColor:C.gold,
        animation:"spin 0.8s linear infinite",
      }}/>
      <div style={{color:C.muted,fontSize:13}}>Consulting the stars<span className="loading-dots"/></div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({tab,setTab}) {
  const tabs=[{id:"home",icon:"✦",label:"Home"},{id:"kundli",icon:"⬡",label:"Kundli"},{id:"horo",icon:"🔮",label:"Forecast"},{id:"remedies",icon:"🕉️",label:"Remedies"}];
  return (
    <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,4,16,0.96)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:520,margin:"0 auto",padding:"14px 16px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{fontSize:26,animation:"spin 25s linear infinite",color:C.gold}}>✦</div>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:19,fontWeight:700,color:C.gold,letterSpacing:"0.05em"}}>NakshatraAI</div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase"}}>by अTechnicalMonk</div>
          </div>
          <div style={{marginLeft:"auto",background:`${C.purple}33`,border:`1px solid ${C.purple}`,borderRadius:20,padding:"3px 10px",fontSize:10,color:C.purpleLight}}>✨ AI</div>
        </div>
        <div style={{display:"flex",gap:2}}>
          {tabs.map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id)} style={{
              flex:1,padding:"8px 2px",border:"none",cursor:"pointer",
              borderRadius:"8px 8px 0 0",
              background:tab===t.id?C.card:"transparent",
              borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
              color:tab===t.id?C.gold:C.muted,
              fontSize:10,fontWeight:tab===t.id?700:400,transition:"all 0.2s",
            }}>
              <div style={{fontSize:15,marginBottom:2}}>{t.icon}</div>{t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({onStart}) {
  return (
    <div style={{padding:"28px 20px",maxWidth:520,margin:"0 auto",animation:"fadeUp 0.6s ease"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:72,animation:"pulse 3s ease-in-out infinite",marginBottom:12}}>🪐</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:C.purpleLight,letterSpacing:"0.15em",marginBottom:6,textTransform:"uppercase"}}>अTechnicalMonk presents</div>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:28,color:C.gold,margin:"0 0 8px",lineHeight:1.2}}>NakshatraAI</h1>
        <p style={{color:C.muted,lineHeight:1.8,fontFamily:"'Crimson Pro',serif",fontSize:16}}>
          Ancient Vedic wisdom, now powered by AI. Get your personalised Kundli, real-time AI horoscopes, and scriptural remedies — free.
        </p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
        {[
          {icon:"⬡",title:"AI Kundli",desc:"Birth chart + Navagraha",tag:"Free"},
          {icon:"🔮",title:"AI Forecast",desc:"Real-time horoscopes",tag:"AI"},
          {icon:"🕉️",title:"Remedies",desc:"Mantra & ritual sadhana",tag:"Free"},
          {icon:"🤖",title:"AI Remedy",desc:"Personalised by Claude",tag:"AI"},
        ].map((f,i)=>(
          <div key={i} className="card-hover" style={{
            background:C.card,border:`1px solid ${C.border}`,borderRadius:14,
            padding:16,transition:"all 0.3s",animation:`fadeUp 0.5s ease ${i*0.08}s both`,
          }}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:26}}>{f.icon}</div>
              <div style={{
                fontSize:9,padding:"2px 7px",borderRadius:10,height:"fit-content",
                background:f.tag==="AI"?`${C.purple}33`:`${C.gold}22`,
                color:f.tag==="AI"?C.purpleLight:C.gold,border:`1px solid ${f.tag==="AI"?C.purple:C.gold}44`
              }}>{f.tag}</div>
            </div>
            <div style={{color:C.gold,fontWeight:700,fontSize:13,fontFamily:"'Cinzel',serif"}}>{f.title}</div>
            <div style={{color:C.muted,fontSize:11,marginTop:3}}>{f.desc}</div>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{
        width:"100%",padding:16,border:"none",cursor:"pointer",
        background:`linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
        color:"#fff",fontSize:15,fontWeight:700,borderRadius:14,
        fontFamily:"'Cinzel',serif",letterSpacing:"0.08em",
        animation:"glow 2.5s ease-in-out infinite",transition:"transform 0.2s",
      }}>✦ Begin Your Sadhana ✦</button>

      <p style={{textAlign:"center",color:C.muted,fontSize:11,marginTop:14,lineHeight:1.6}}>
        🔒 No login required &nbsp;•&nbsp; 🕉️ Authentic Vedic wisdom &nbsp;•&nbsp; 🤖 Powered by Claude AI
      </p>
      <div style={{textAlign:"center",marginTop:20,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
        <div style={{color:C.muted,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Crafted with 🙏 by</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:C.purpleLight,fontWeight:700}}>अTechnicalMonk</div>
        <div style={{color:C.muted,fontSize:10,marginTop:3}}>© 2025 NakshatraAI · All rights reserved</div>
      </div>
    </div>
  );
}

// ─── North Indian Kundli Chart — Correct Diamond SVG ────────────────────────
// 12 triangular/diamond wedges formed by outer square + inner diamond + diagonals
// Anti-clockwise from H1 (top triangle = Lagna)
function KundliChart({ planets, zi }) {
  const SZ = 300;
  const H = SZ/2, Q = SZ/4, Q3 = SZ*3/4;

  // Key points
  const A=[0,0], B=[SZ,0], C=[SZ,SZ], D=[0,SZ];
  const Lp=[0,H], F=[SZ,H], G=[H,SZ];
  const I=[H,Q], J=[Q3,H], K=[H,Q3], L=[Q,H];

  const pts = (arr) => arr.map(p=>p.join(",")).join(" ");
  const cx  = (arr) => arr.reduce((s,p)=>s+p[0],0)/arr.length;
  const cy  = (arr) => arr.reduce((s,p)=>s+p[1],0)/arr.length;

  // 12 house polygons (anti-clockwise, H1=top Lagna)
  const HOUSES = [
    { n:1,  poly:[A,B,I],     lagna:true  },  // top big triangle  = LAGNA
    { n:2,  poly:[A,I,L],     lagna:false },  // top-left inner
    { n:3,  poly:[A,Lp,L],    lagna:false },  // left-top triangle
    { n:4,  poly:[Lp,K,L],    lagna:false },  // left inner diamond
    { n:5,  poly:[Lp,D,K],    lagna:false },  // left-bottom triangle
    { n:6,  poly:[D,K,G],     lagna:false },  // bottom-left inner
    { n:7,  poly:[D,C,K],     lagna:false },  // bottom big triangle
    { n:8,  poly:[C,K,J],     lagna:false },  // bottom-right inner
    { n:9,  poly:[C,F,J],     lagna:false },  // right-bottom triangle
    { n:10, poly:[F,J,I],     lagna:false },  // right inner diamond
    { n:11, poly:[B,F,I],     lagna:false },  // right-top triangle
    { n:12, poly:[B,I,J],     lagna:false },  // top-right inner
  ];

  const houseMap = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach(p => { if (houseMap[p.house]) houseMap[p.house].push(p); });
  const signFor = n => ZODIAC[(zi + n - 1) % 12];

  return (
    <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}
      style={{ display:"block", margin:"0 auto", borderRadius:4 }}>
      <defs>
        <linearGradient id="lgFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0.08"/>
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={SZ} height={SZ} fill="#0a0618"/>

      {/* House polygons */}
      {HOUSES.map(({ n, poly, lagna }) => {
        const sign = signFor(n);
        const ps   = houseMap[n] || [];
        const pcx  = cx(poly);
        const pcy  = cy(poly);
        return (
          <g key={n}>
            <polygon
              points={pts(poly)}
              fill={lagna ? "url(#lgFill)" : "none"}
              stroke="#2d1f5e"
              strokeWidth={1.5}
            />
            {/* Sign symbol */}
            <text x={pcx} y={pcy - 8} fontSize={12}
              fill={lagna ? "#e8b84b" : "#7c6a9e"}
              textAnchor="middle" dominantBaseline="middle">{sign.symbol}</text>
            {/* Sign name */}
            <text x={pcx} y={pcy + 6} fontSize={6.5} fill="#5a4a7a"
              textAnchor="middle">{sign.name.slice(0,3)}</text>
            {/* House number — small, at a corner */}
            <text
              x={lagna ? pcx : pcx + (pcx < H ? -8 : pcx > H ? 8 : 0)}
              y={pcy + (pcy < H ? -10 : pcy > H ? 10 : 0) - 2}
              fontSize={7} fill={lagna ? "#e8b84b88" : "#3d2a6e"}
              textAnchor="middle" fontWeight="700">{n}</text>
            {/* Lagna label */}
            {lagna && (
              <text x={pcx} y={pcy + 18} fontSize={7} fill="#e8b84b"
                textAnchor="middle" fontFamily="Cinzel,serif">ASC</text>
            )}
            {/* Planet glyphs */}
            {ps.map((p, i) => {
              const cols = ps.length > 1 ? 2 : 1;
              const col  = i % cols;
              const row  = Math.floor(i / cols);
              const ox   = cols > 1 ? (col === 0 ? -10 : 10) : 0;
              return (
                <text key={p.name}
                  x={pcx + ox}
                  y={pcy + 20 + row * 11}
                  fontSize={8.5} fill={p.color}
                  textAnchor="middle" fontWeight="700">
                  {p.glyph}{p.retro ? "®" : ""}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* Outer border */}
      <rect x={1} y={1} width={SZ-2} height={SZ-2}
        fill="none" stroke="#e8b84b" strokeWidth={1.5} strokeOpacity={0.5}/>
    </svg>
  );
}

// ─── Place Search with Autocomplete ──────────────────────────────────────────
const CITIES = [
  "Agra","Ahmedabad","Ajmer","Amritsar","Aurangabad","Bangalore","Bhopal","Bhubaneswar",
  "Chennai","Coimbatore","Dehradun","Delhi","Goa","Gurgaon","Guwahati","Hyderabad",
  "Indore","Jaipur","Jammu","Jodhpur","Kanpur","Kochi","Kolkata","Lucknow","Ludhiana",
  "Madurai","Mumbai","Mysore","Nagpur","Nashik","Noida","Patna","Pune","Raipur",
  "Rajkot","Ranchi","Shimla","Srinagar","Surat","Thiruvananthapuram","Udaipur",
  "Varanasi","Visakhapatnam",
  "Abu Dhabi","Bangkok","Berlin","Dubai","Frankfurt","Hong Kong","Karachi","Kathmandu",
  "Kuala Lumpur","London","Los Angeles","Melbourne","Moscow","New York","Paris",
  "Riyadh","Singapore","Sydney","Tokyo","Toronto","Colombo","Dhaka","Lahore",
];

function PlaceSearch({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const handleInput = (val) => {
    setQuery(val);
    onChange(val);
    if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
    const starts = CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase()));
    const includes = CITIES.filter(c => !c.toLowerCase().startsWith(val.toLowerCase()) && c.toLowerCase().includes(val.toLowerCase()));
    setSuggestions([...starts, ...includes].slice(0, 7));
    setOpen(true);
  };

  const select = (city) => {
    setQuery(city);
    onChange(city);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div style={{ position:"relative", width:"100%", marginBottom:12 }}>
      <input
        style={{
          width:"100%", padding:"12px 14px", background:C.card,
          border:`1px solid ${open && suggestions.length ? C.gold : C.border}`,
          borderRadius: open && suggestions.length ? "10px 10px 0 0" : 10,
          color:C.text, fontSize:14, boxSizing:"border-box", fontFamily:"inherit",
          transition:"border 0.2s",
        }}
        placeholder="Type city name..."
        value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && suggestions.length > 0 && (
        <div style={{
          position:"absolute", top:"100%", left:0, right:0, zIndex:999,
          background:C.card, border:`1px solid ${C.gold}`, borderTop:"none",
          borderRadius:"0 0 10px 10px", overflow:"hidden",
          boxShadow:`0 8px 24px #00000099`,
        }}>
          {suggestions.map((city, i) => (
            <div key={i} onMouseDown={() => select(city)}
              style={{
                padding:"10px 14px", cursor:"pointer", fontSize:13, color:C.text,
                borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}33` : "none",
                display:"flex", alignItems:"center", gap:8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color:C.gold }}>📍</span>{city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Kundli Screen ────────────────────────────────────────────────────────────
function KundliScreen({profile,setProfile}) {
  const [form,setForm]=useState(profile||{name:"",dob:"",tob:"",pob:""});
  const [kundli,setKundli]=useState(profile?.dob?profile:null);
  const [loading,setLoading]=useState(false);

  const SIGN_NAMES=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  const STATUS_CONFIG = {
    exalted:     {label:'Exalted',    color:'#22c55e', bg:'#22c55e22', icon:'⬆'},
    debilitated: {label:'Debilitated',color:'#ef4444', bg:'#ef444422', icon:'⬇'},
    own:         {label:'Own Sign',   color:'#e8b84b', bg:'#e8b84b22', icon:'🏠'},
  };

  const generate=()=>{
    if(!form.name||!form.dob)return;
    setLoading(true);
    setTimeout(()=>{
      const result = getPlanets(form.dob, form.tob, form.pob);
      const moonPlanet = result.planets.find(p => p.name === 'Moon');
      const dasha = calcDashas(moonPlanet ? moonPlanet.sid : 0, form.dob, form.tob);
      const lagnaSign = result.lagnaSign;
      const zodiac = ZODIAC[lagnaSign];
      const k = { ...form, lagnaSign, lagnaDeg:result.lagnaDeg, lagnaName:result.lagnaName,
                  planets:result.planets, zodiac, zi:lagnaSign, dasha };
      setKundli(k);
      setProfile(k);
      setLoading(false);
    },1200);
  };

  const inp={width:"100%",padding:"12px 14px",background:C.card,
    border:`1px solid ${C.border}`,borderRadius:10,color:C.text,
    fontSize:14,boxSizing:"border-box",marginBottom:12,fontFamily:"inherit"};
  const lbl={color:C.muted,fontSize:11,marginBottom:5,display:"block",letterSpacing:"0.1em",textTransform:"uppercase"};

  return (
    <div style={{padding:"20px",maxWidth:520,margin:"0 auto",animation:"fadeUp 0.5s ease"}}>
      <h2 style={{fontFamily:"'Cinzel',serif",color:C.gold,margin:"0 0 4px",fontSize:22}}>⬡ Your Kundli</h2>
      <p style={{color:C.muted,marginBottom:22,fontFamily:"'Crimson Pro',serif",fontSize:15}}>Enter your birth details to generate your Vedic birth chart</p>

      <label style={lbl}>Full Name</label>
      <input style={inp} placeholder="Enter your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <label style={lbl}>Date of Birth</label>
      <input style={inp} type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={lbl}>Time of Birth (IST)</label>
          <input style={{...inp,marginBottom:0}} type="time" value={form.tob} onChange={e=>setForm({...form,tob:e.target.value})}/>
        </div>
        <div>
          <label style={lbl}>Place of Birth</label>
          <PlaceSearch value={form.pob} onChange={v=>setForm({...form,pob:v})}/>
        </div>
      </div>

      <button onClick={generate} disabled={!form.name||!form.dob||loading} style={{
        width:"100%",padding:14,border:"none",cursor:"pointer",borderRadius:12,
        background:!form.name||!form.dob?C.border:`linear-gradient(135deg,${C.purple},${C.saffron})`,
        color:"#fff",fontSize:15,fontWeight:700,marginBottom:24,
        fontFamily:"'Cinzel',serif",opacity:loading?0.7:1,transition:"all 0.3s",
      }}>{loading?"✦ Calculating...":"✦ Generate Kundli"}</button>

      {kundli&&(
        <div style={{animation:"fadeUp 0.5s ease"}}>

          {/* Hero */}
          <div style={{background:`linear-gradient(135deg,${C.purple}44,${C.saffron}22)`,
            border:`1px solid ${C.gold}44`,borderRadius:18,padding:18,marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:4}}>{kundli.zodiac?.symbol||'⬡'}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:20,color:C.gold,fontWeight:700}}>{kundli.name}</div>
            <div style={{color:C.purpleLight,fontSize:13,marginTop:3}}>
              Lagna: {kundli.lagnaName} {kundli.lagnaDeg}° · {kundli.zodiac?.element}
            </div>
            <div style={{color:C.muted,fontSize:11,marginTop:2}}>{kundli.pob||"Birth Place"}</div>
          </div>

          {/* Chart */}
          <div style={{marginBottom:14}}>
            <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:13,marginBottom:8}}>⬡ North Indian Birth Chart</div>
            <KundliChart planets={kundli.planets} zi={kundli.lagnaSign}/>
            {/* Legend */}
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8,justifyContent:"center"}}>
              {kundli.planets.map(p=>(
                <div key={p.name} style={{display:"flex",alignItems:"center",gap:3,
                  background:C.card,border:`1px solid ${p.status?STATUS_CONFIG[p.status]?.color+'44':C.border}`,
                  borderRadius:6,padding:"4px 8px",fontSize:10}}>
                  <span style={{color:p.color,fontWeight:700}}>{p.glyph}</span>
                  <div>
                    <div style={{display:"flex",gap:3,alignItems:"center"}}>
                      <span style={{color:C.text,fontWeight:600}}>{p.name}</span>
                      {p.retro&&<span style={{color:'#f59e0b',fontSize:8}}>℞</span>}
                      {p.status&&<span style={{color:STATUS_CONFIG[p.status]?.color,fontSize:8}}>{STATUS_CONFIG[p.status]?.icon}</span>}
                    </div>
                    <div style={{color:C.muted,fontSize:8}}>{p.degree}° · {p.nakshort} P{p.pada}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navagraha Detail Cards */}
          <div style={{marginBottom:14}}>
            <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:13,marginBottom:8}}>🪐 Navagraha Details</div>
            {kundli.planets.map((p,i)=>{
              const sc = p.status ? STATUS_CONFIG[p.status] : null;
              return (
                <div key={i} style={{
                  background:C.card,
                  border:`1px solid ${sc ? sc.color+'44' : C.border}`,
                  borderRadius:12,padding:"10px 14px",marginBottom:8,
                  display:"flex",alignItems:"center",gap:12,
                  animation:`fadeUp 0.3s ease ${i*0.04}s both`,
                }}>
                  {/* Planet symbol */}
                  <div style={{fontSize:22,color:p.color,minWidth:28,textAlign:"center"}}>{p.symbol}</div>
                  {/* Main info */}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{color:C.text,fontWeight:700,fontSize:13}}>{p.name}</span>
                      {p.retro&&(
                        <span style={{background:'#f59e0b22',color:'#f59e0b',fontSize:8,
                          padding:"1px 5px",borderRadius:4,fontWeight:700}}>℞ Retro</span>
                      )}
                      {sc&&(
                        <span style={{background:sc.bg,color:sc.color,fontSize:8,
                          padding:"1px 5px",borderRadius:4,fontWeight:700}}>{sc.icon} {sc.label}</span>
                      )}
                    </div>
                    {/* Degree + Sign */}
                    <div style={{color:C.purpleLight,fontSize:11,marginBottom:2}}>
                      {p.degree}° {p.signName} · H{p.house}
                    </div>
                    {/* Nakshatra */}
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{color:C.gold,fontSize:10,fontWeight:600}}>✦ {p.nakshatra}</span>
                      <span style={{background:`${C.gold}22`,color:C.gold,fontSize:9,
                        padding:"1px 5px",borderRadius:4}}>P{p.pada}</span>
                      <span style={{color:C.muted,fontSize:9}}>Nak♟: {p.nakLord}</span>
                    </div>
                    {/* House Lord */}
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                      <span style={{color:C.muted,fontSize:9}}>
                        H{p.house} Lord: <span style={{
                          color: DASHA_COLORS[getHouseLord(kundli.lagnaSign, p.house)] || C.purpleLight,
                          fontWeight:600
                        }}>{getHouseLord(kundli.lagnaSign, p.house)}</span>
                      </span>
                    </div>
                  </div>
                  {/* House badge */}
                  <div style={{textAlign:"center",minWidth:32}}>
                    <div style={{background:sc?sc.bg:`${C.purple}33`,color:sc?sc.color:C.purpleLight,
                      borderRadius:8,padding:"4px 8px",fontSize:12,fontWeight:700}}>H{p.house}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Insights */}
          <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:16,padding:16}}>
            <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:13,marginBottom:12}}>✦ Key Insights</div>
            {[
              ["Ascendant","Lagna", `${kundli.lagnaName} ${kundli.lagnaDeg}°`],
              ["Moon Sign","Chandra Rashi", kundli.planets.find(p=>p.name==="Moon")?.signName||"—"],
              ["Sun Sign","Surya Rashi",   kundli.planets.find(p=>p.name==="Sun")?.signName||"—"],
              ["Mahadasha","Current Dasha", kundli.dasha ? `${kundli.dasha.maha.lord} (until ${kundli.dasha.maha.endFmt})` : kundli.planets[0]?.name||"—"],
              ["Antardasha","Sub-period", kundli.dasha ? `${kundli.dasha.antar.lord} (until ${kundli.dasha.antar.endFmt})` : "—"],
              ["Atmakaraka","Soul Planet",  [...kundli.planets].sort((a,b)=>b.degree-a.degree)[0]?.name||"—"],
            ].map(([eng,sans,val],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:i<4?`1px solid ${C.border}33`:"none"}}>
                <div>
                  <div style={{color:C.text,fontSize:12}}>{eng}</div>
                  <div style={{color:C.muted,fontSize:10,fontStyle:"italic"}}>{sans}</div>
                </div>
                <div style={{color:C.purpleLight,fontSize:13,fontWeight:600}}>{val}</div>
              </div>
            ))}
          </div>

          {/* ── Vimshottari Dasha ── */}
          {kundli.dasha && (
            <div style={{marginTop:14}}>
              <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:13,marginBottom:10}}>
                ⏳ Vimshottari Dasha
              </div>

              {/* Active Dasha Summary */}
              <div style={{background:`linear-gradient(135deg,${C.purple}33,${C.card})`,
                border:`1px solid ${C.gold}44`,borderRadius:16,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div>
                    <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Mahadasha</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                      <div style={{width:10,height:10,borderRadius:"50%",
                        background:DASHA_COLORS[kundli.dasha.maha.lord]}}/>
                      <span style={{color:DASHA_COLORS[kundli.dasha.maha.lord],
                        fontSize:18,fontWeight:700,fontFamily:"'Cinzel',serif"}}>
                        {kundli.dasha.maha.lord}
                      </span>
                    </div>
                    <div style={{color:C.muted,fontSize:10,marginTop:2}}>
                      {kundli.dasha.maha.startFmt} → {kundli.dasha.maha.endFmt}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Antardasha</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,justifyContent:"flex-end"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",
                        background:DASHA_COLORS[kundli.dasha.antar.lord]}}/>
                      <span style={{color:DASHA_COLORS[kundli.dasha.antar.lord],
                        fontSize:15,fontWeight:700}}>
                        {kundli.dasha.antar.lord}
                      </span>
                    </div>
                    <div style={{color:C.muted,fontSize:10,marginTop:2}}>
                      {kundli.dasha.antar.startFmt} → {kundli.dasha.antar.endFmt}
                    </div>
                  </div>
                </div>

                {/* Pratyantardasha */}
                <div style={{background:`${C.surface}`,borderRadius:8,padding:"6px 10px",
                  display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{color:C.muted,fontSize:10}}>Pratyantardasha</div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:7,height:7,borderRadius:"50%",
                      background:DASHA_COLORS[kundli.dasha.prat.lord]}}/>
                    <span style={{color:DASHA_COLORS[kundli.dasha.prat.lord],fontSize:12,fontWeight:600}}>
                      {kundli.dasha.prat.lord}
                    </span>
                    <span style={{color:C.muted,fontSize:10}}>
                      ({kundli.dasha.prat.startFmt} → {kundli.dasha.prat.endFmt})
                    </span>
                  </div>
                </div>

                {/* Progress bars */}
                <div style={{marginBottom:4}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:C.muted,fontSize:10}}>{kundli.dasha.maha.lord} Mahadasha progress</span>
                    <span style={{color:C.gold,fontSize:10}}>{kundli.dasha.maha.pct}%</span>
                  </div>
                  <div style={{background:C.surface,borderRadius:6,height:5,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:6,
                      background:`linear-gradient(90deg,${DASHA_COLORS[kundli.dasha.maha.lord]},${C.gold})`,
                      width:`${kundli.dasha.maha.pct}%`,transition:"width 1s ease"}}/>
                  </div>
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:C.muted,fontSize:10}}>{kundli.dasha.antar.lord} Antardasha progress</span>
                    <span style={{color:C.purpleLight,fontSize:10}}>{kundli.dasha.antar.pct}%</span>
                  </div>
                  <div style={{background:C.surface,borderRadius:6,height:5,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:6,
                      background:`linear-gradient(90deg,${DASHA_COLORS[kundli.dasha.antar.lord]},${C.purpleLight})`,
                      width:`${kundli.dasha.antar.pct}%`,transition:"width 1s ease"}}/>
                  </div>
                </div>
              </div>

              {/* Full Dasha Timeline */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
                <div style={{color:C.gold,fontSize:12,fontFamily:"'Cinzel',serif",marginBottom:10}}>
                  📅 120-Year Dasha Timeline
                </div>
                {kundli.dasha.dashas.map((d,i) => {
                  const isActive = d.start <= Date.now() && Date.now() < d.end;
                  return (
                    <div key={i} style={{
                      display:"flex",alignItems:"center",gap:8,padding:"6px 0",
                      borderBottom:i<8?`1px solid ${C.border}33`:"none",
                      opacity: isActive ? 1 : 0.6,
                    }}>
                      <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,
                        background:DASHA_COLORS[d.lord],
                        boxShadow:isActive?`0 0 8px ${DASHA_COLORS[d.lord]}`:""}}/>
                      <div style={{flex:1}}>
                        <span style={{color:isActive?DASHA_COLORS[d.lord]:C.text,
                          fontWeight:isActive?700:400,fontSize:12}}>{d.lord}</span>
                        {isActive && <span style={{color:C.gold,fontSize:9,marginLeft:6,
                          background:`${C.gold}22`,padding:"1px 5px",borderRadius:4}}>ACTIVE</span>}
                      </div>
                      <div style={{color:C.muted,fontSize:10,textAlign:"right"}}>
                        {d.startFmt} → {d.endFmt}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Horoscope Screen ─────────────────────────────────────────────────────────
function HoroscopeScreen({profile}) {
  const [area1,setArea1]=useState("Career");
  const [area2,setArea2]=useState("Health");
  const [period,setPeriod]=useState("daily");
  const [forecasts,setForecasts]=useState({});
  const [loading,setLoading]=useState({});
  const noProfile=!profile?.dob;

  const fetchForecast=async(area)=>{
    if(!profile?.dob)return;
    const key=`${area}-${period}`;
    if(forecasts[key])return;
    setLoading(l=>({...l,[area]:true}));
    try{
      const text=await fetchAIHoroscope({
        name:profile.name,
        zodiac:profile.zodiac||ZODIAC[getZodiacIdx(profile.dob)],
        planets:profile.planets||getPlanets(profile.dob,profile.tob,profile.pob).planets,
        area,period,pob:profile.pob,
      });
      setForecasts(f=>({...f,[key]:text}));
    }catch(e){
      setForecasts(f=>({...f,[key]:"Unable to connect to the stars. Please try again."}));
    }
    setLoading(l=>({...l,[area]:false}));
  };

  useEffect(()=>{
    if(profile?.dob){fetchForecast(area1);fetchForecast(area2);}
  },[area1,area2,period,profile]);

  const ForecastCard=({area,accent})=>{
    const key=`${area}-${period}`;
    const text=forecasts[key];
    const isLoading=loading[area];
    return (
      <div style={{
        background:C.card,border:`1px solid ${accent}44`,borderRadius:16,
        padding:20,marginBottom:14,animation:"fadeUp 0.5s ease",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"'Cinzel',serif",color:accent,fontSize:15,fontWeight:700}}>{area}</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.success,animation:"pulse 2s infinite"}}/>
            <div style={{background:`${accent}22`,color:accent,fontSize:10,padding:"3px 10px",borderRadius:12}}>
              {period==="daily"?"Today":"This Week"} · AI
            </div>
          </div>
        </div>
        {isLoading?(
          <Spinner/>
        ):text?(
          <p style={{color:C.text,fontSize:14,lineHeight:1.8,margin:0,fontFamily:"'Crimson Pro',serif",fontSize:16}}>{text}</p>
        ):(
          <p style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>Tap to generate your AI forecast...</p>
        )}
        {!isLoading&&text&&(
          <button onClick={()=>{const k=`${area}-${period}`;setForecasts(f=>{const n={...f};delete n[k];return n;});fetchForecast(area);}} style={{
            marginTop:12,background:"transparent",border:`1px solid ${C.border}`,
            color:C.muted,fontSize:11,padding:"5px 12px",borderRadius:8,cursor:"pointer",
          }}>🔄 Refresh</button>
        )}
      </div>
    );
  };

  return (
    <div style={{padding:"20px",maxWidth:520,margin:"0 auto",animation:"fadeUp 0.5s ease"}}>
      <h2 style={{fontFamily:"'Cinzel',serif",color:C.gold,margin:"0 0 4px",fontSize:22}}>🔮 AI Forecast</h2>
      <p style={{color:C.muted,fontSize:13,marginBottom:20,fontFamily:"'Crimson Pro',serif",fontSize:15}}>
        {noProfile?"Generate your Kundli first for personalised AI forecasts":"Real-time Vedic horoscopes powered by Claude AI"}
      </p>

      {noProfile&&(
        <div style={{background:`${C.saffron}11`,border:`1px solid ${C.saffron}44`,borderRadius:14,padding:16,marginBottom:20,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8}}>⬡</div>
          <div style={{color:C.saffron,fontSize:13,fontWeight:600}}>Generate your Kundli first</div>
          <div style={{color:C.muted,fontSize:12,marginTop:4}}>Go to the Kundli tab and enter your birth details for personalised AI horoscopes</div>
        </div>
      )}

      {/* Toggle */}
      <div style={{display:"flex",background:C.card,borderRadius:10,padding:4,marginBottom:18,border:`1px solid ${C.border}`}}>
        {["daily","weekly"].map(v=>(
          <button key={v} onClick={()=>setPeriod(v)} style={{
            flex:1,padding:"8px",border:"none",cursor:"pointer",borderRadius:7,
            background:period===v?`linear-gradient(135deg,${C.purple},${C.saffron})`:"transparent",
            color:period===v?"#fff":C.muted,fontSize:13,fontWeight:600,
            transition:"all 0.2s",textTransform:"capitalize",
          }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
        ))}
      </div>

      {/* Area pills */}
      <div style={{marginBottom:18}}>
        <div style={{color:C.muted,fontSize:10,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>Choose 2 Focus Areas</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {LIFE_AREAS.map(a=>{
            const isA1=a===area1,isA2=a===area2;
            return (
              <button key={a} className="pill" onClick={()=>{
                if(!isA1&&!isA2)setArea1(a);
                else if(isA2){setArea2(area1);setArea1(a);}
              }} style={{
                padding:"5px 12px",border:`1px solid ${isA1||isA2?C.gold:C.border}`,
                borderRadius:20,cursor:"pointer",fontSize:11,
                background:isA1?`${C.gold}22`:isA2?`${C.purple}33`:C.card,
                color:isA1?C.gold:isA2?C.purpleLight:C.muted,
                fontWeight:isA1||isA2?700:400,transition:"all 0.2s",
              }}>{isA1?"⭐ ":isA2?"✦ ":""}{a}</button>
            );
          })}
        </div>
      </div>

      <ForecastCard area={area1} accent={C.gold}/>
      <ForecastCard area={area2} accent={C.purpleLight}/>

      {/* Panchang */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
        <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:13,marginBottom:12}}>📅 Today's Panchang</div>
        {[["Tithi","Shukla Paksha Panchami"],["Nakshatra","Rohini"],["Yoga","Siddhi"],["Karana","Bav"],["Muhurta","10:30–12:00 AM"],["Rahu Kalam","03:00–04:30 PM"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}22`}}>
            <span style={{color:C.muted,fontSize:12}}>{k}</span>
            <span style={{color:C.text,fontSize:12}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Planet Remedies Data ─────────────────────────────────────────────────────
const PLANET_REMEDY_DATA = {
  Sun:     { mantra:"Om Hraam Hreem Hraum Sah Suryaya Namah",     beej:"Om Hraam",  count:108, day:"Sunday",    deity:"Surya Dev",          gem:"Ruby",            metal:"Gold",    charityColor:"#FFD700", charity:"Wheat & jaggery",  color:"#FFD700", desc:"Strengthens soul, authority, father relations, health & vitality" },
  Moon:    { mantra:"Om Shraam Shreem Shraum Sah Chandraya Namah",beej:"Om Shraam", count:108, day:"Monday",    deity:"Shiva / Chandra Dev", gem:"Pearl",           metal:"Silver",  charityColor:"#C8C8D4", charity:"Rice & milk",      color:"#C8C8D4", desc:"Improves mind, emotions, mother relations & mental peace" },
  Mars:    { mantra:"Om Kraam Kreem Kraum Sah Bhaumaya Namah",    beej:"Om Kraam",  count:108, day:"Tuesday",   deity:"Hanuman / Mangal",    gem:"Red Coral",       metal:"Copper",  charityColor:"#FF6B4A", charity:"Red lentils",      color:"#FF6B4A", desc:"Boosts courage, energy, siblings & property matters" },
  Mercury: { mantra:"Om Braam Breem Braum Sah Budhaya Namah",     beej:"Om Braam",  count:17,  day:"Wednesday", deity:"Vishnu / Budha Dev",  gem:"Emerald",         metal:"Bronze",  charityColor:"#6EE7B7", charity:"Green vegetables", color:"#6EE7B7", desc:"Enhances intelligence, communication, business & education" },
  Jupiter: { mantra:"Om Graam Greem Graum Sah Gurave Namah",      beej:"Om Graam",  count:16,  day:"Thursday",  deity:"Brihaspati / Vishnu", gem:"Yellow Sapphire", metal:"Gold",    charityColor:"#FFA040", charity:"Turmeric & yellow sweets", color:"#FFA040", desc:"Blesses wisdom, wealth, children, guru & spiritual growth" },
  Venus:   { mantra:"Om Draam Dreem Draum Sah Shukraya Namah",    beej:"Om Draam",  count:108, day:"Friday",    deity:"Lakshmi / Shukra",    gem:"Diamond / Zircon",metal:"Silver",  charityColor:"#F472B6", charity:"White sweets",     color:"#F472B6", desc:"Attracts love, beauty, luxury, arts & relationships" },
  Saturn:  { mantra:"Om Praam Preem Praum Sah Shanaischaraya Namah",beej:"Om Praam",count:19,  day:"Saturday",  deity:"Shani Dev / Hanuman", gem:"Blue Sapphire",   metal:"Iron",    charityColor:"#818CF8", charity:"Sesame & iron",    color:"#818CF8", desc:"Brings discipline, karma, longevity & removes obstacles" },
  Rahu:    { mantra:"Om Bhraam Bhreem Bhraum Sah Rahave Namah",   beej:"Om Bhraam", count:18,  day:"Saturday",  deity:"Durga / Saraswati",   gem:"Hessonite (Gomed)",metal:"Lead",   charityColor:"#CD853F", charity:"Dark blankets",    color:"#CD853F", desc:"Controls obsession, illusion, foreign connections & ambition" },
  Ketu:    { mantra:"Om Sraam Sreem Sraum Sah Ketave Namah",      beej:"Om Sraam",  count:7,   day:"Tuesday",   deity:"Ganesha / Bhairav",   gem:"Cats Eye (Lehsunia)", metal:"Iron", charityColor:"#F87171", charity:"Sesame & blankets",color:"#F87171", desc:"Aids spirituality, moksha, mysticism & past karma" },
};

const HOUSE_EFFECTS = {
  1:"Self, health, personality & appearance",2:"Wealth, family & speech",
  3:"Courage, siblings & short travels",4:"Home, mother, vehicles & happiness",
  5:"Children, intelligence, creativity & past merit",6:"Enemies, debts, disease & service",
  7:"Marriage, partnerships & business",8:"Longevity, transformation, occult & inheritance",
  9:"Luck, dharma, father, guru & long travels",10:"Career, status, authority & public life",
  11:"Gains, desires, income & social circle",12:"Losses, foreign lands, moksha & expenses",
};

// ─── Audio Japa Player ────────────────────────────────────────────────────────
function MantraAudio({ mantra, isPlaying, onToggle, speed }) {
  const utterRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    return () => {
      window.speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      const chant = () => {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(mantra);
        u.rate  = speed || 0.7;
        u.pitch = 0.8;
        u.lang  = 'hi-IN';
        // fallback to any available voice
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang.startsWith('hi')) || voices[0];
        if (hindiVoice) u.voice = hindiVoice;
        utterRef.current = u;
        window.speechSynthesis.speak(u);
      };
      chant();
      // repeat after each utterance ends
      utterRef.current && (utterRef.current.onend = chant);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying, mantra, speed]);

  return null;
}

// ─── Remedies Screen ──────────────────────────────────────────────────────────
function RemediesScreen({profile}) {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [count, setCount]   = useState(0);
  const [done, setDone]     = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed]   = useState(0.65);
  const [view, setView]     = useState('planets'); // 'planets' | 'japa'

  const planets = profile?.planets || [];

  // Sort planets by house for display
  const sortedPlanets = [...planets].sort((a,b) => a.house - b.house);

  const startJapa = (planet) => {
    setSelectedPlanet(planet);
    setCount(0);
    setDone(false);
    setIsPlaying(false);
    setView('japa');
  };

  const tap = () => {
    if (!selectedPlanet || done) return;
    const n = count + 1;
    setCount(n);
    const rem = PLANET_REMEDY_DATA[selectedPlanet.name];
    if (rem && n >= rem.count) setDone(true);
  };

  const remedy = selectedPlanet ? PLANET_REMEDY_DATA[selectedPlanet.name] : null;

  if (view === 'japa' && selectedPlanet && remedy) {
    const pct = Math.min((count / remedy.count) * 100, 100);
    return (
      <div style={{padding:"20px",maxWidth:520,margin:"0 auto",animation:"fadeUp 0.4s ease"}}>
        <MantraAudio mantra={remedy.mantra} isPlaying={isPlaying} speed={speed}/>

        <button onClick={()=>{setView('planets');setIsPlaying(false);window.speechSynthesis?.cancel();}} style={{
          background:"transparent",border:`1px solid ${C.border}`,color:C.muted,
          padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,marginBottom:16,
        }}>← Back to Planets</button>

        {/* Planet Header */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:4}}>{selectedPlanet.symbol}</div>
          <div style={{fontFamily:"'Cinzel',serif",color:remedy.color,fontSize:20,fontWeight:700}}>
            {selectedPlanet.name} Sadhana
          </div>
          <div style={{color:C.muted,fontSize:12,marginTop:2}}>
            {selectedPlanet.degree}° {selectedPlanet.signName} · H{selectedPlanet.house}
            {selectedPlanet.retro ? " · ℞ Retrograde" : ""}
          </div>
          <div style={{color:C.muted,fontSize:11,marginTop:2}}>
            🪷 {remedy.deity} · {remedy.day}
          </div>
        </div>

        {/* Mantra Card */}
        <div style={{background:C.card,border:`1px solid ${remedy.color}44`,
          borderRadius:16,padding:18,marginBottom:16,textAlign:"center"}}>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Beej Mantra</div>
          <div style={{color:remedy.color,fontSize:13,fontStyle:"italic",lineHeight:1.8,marginBottom:4,fontFamily:"'Crimson Pro',serif"}}>
            "{remedy.mantra}"
          </div>
          <div style={{color:C.muted,fontSize:11}}>Chant {remedy.count}× · {remedy.day} morning</div>
        </div>

        {/* Audio Controls */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:16}}>
          <div style={{color:C.gold,fontSize:12,fontWeight:600,marginBottom:10}}>🔊 Audio Chanting</div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <button onClick={()=>setIsPlaying(!isPlaying)} style={{
              flex:1,padding:"10px",border:"none",cursor:"pointer",borderRadius:10,
              background:isPlaying?`linear-gradient(135deg,#ef4444,#dc2626)`:`linear-gradient(135deg,${remedy.color},${C.gold})`,
              color:"#fff",fontSize:13,fontWeight:700,transition:"all 0.2s",
            }}>
              {isPlaying ? "⏸ Pause Chanting" : "▶ Start Audio Japa"}
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:C.muted,fontSize:11}}>Speed:</span>
            {[["Slow",0.5],["Normal",0.65],["Fast",0.85]].map(([label,val])=>(
              <button key={label} onClick={()=>setSpeed(val)} style={{
                padding:"4px 10px",border:`1px solid ${speed===val?C.gold:C.border}`,
                borderRadius:6,cursor:"pointer",fontSize:11,
                background:speed===val?`${C.gold}22`:C.card,
                color:speed===val?C.gold:C.muted,transition:"all 0.2s",
              }}>{label}</button>
            ))}
          </div>
          {!('speechSynthesis' in window) && (
            <div style={{color:"#ef4444",fontSize:11,marginTop:8}}>
              ⚠ Audio not supported in this browser
            </div>
          )}
        </div>

        {/* Mala Counter */}
        <div style={{textAlign:"center",marginBottom:16}}>
          <div onClick={tap} style={{
            width:160,height:160,borderRadius:"50%",margin:"0 auto",cursor:done?"default":"pointer",
            background:done?`linear-gradient(135deg,${C.gold},${C.saffron})`:`radial-gradient(circle at 35% 35%,${remedy.color}66,${C.surface})`,
            border:`3px solid ${done?C.gold:remedy.color}66`,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            boxShadow:done?`0 0 50px ${C.gold}66`:`0 0 20px ${remedy.color}33`,
            animation:!done?"pulse 2.5s ease-in-out infinite":"none",transition:"all 0.3s",
          }}>
            <div style={{fontSize:done?32:26,marginBottom:2}}>{done?"🙏":"🕉️"}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:32,
              color:done?"#fff":remedy.color,fontWeight:700,lineHeight:1}}>{count}</div>
            <div style={{color:done?"#ffffffaa":C.muted,fontSize:11,marginTop:2}}>of {remedy.count}</div>
          </div>
          <div style={{background:C.surface,borderRadius:10,height:6,margin:"12px auto",
            maxWidth:200,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:10,transition:"width 0.3s",
              width:`${pct}%`,background:`linear-gradient(90deg,${remedy.color},${C.gold})`}}/>
          </div>
          {done ? (
            <div style={{color:C.gold,fontFamily:"'Cinzel',serif",fontSize:15}}>
              ✦ Sadhana Complete ✦<br/>
              <span style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>Om Shanti 🙏</span>
            </div>
          ) : (
            <div style={{color:C.muted,fontSize:12}}>Tap circle to count · {remedy.count-count} remaining</div>
          )}
        </div>

        {/* Remedy Details */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
          <div style={{color:C.gold,fontSize:13,fontWeight:700,marginBottom:10,fontFamily:"'Cinzel',serif"}}>
            🪬 Complete Remedy
          </div>
          {[
            ["💎 Gemstone", remedy.gem],
            ["🔩 Metal", remedy.metal],
            ["🎨 Wear Color", remedy.charityColor ? "" : remedy.color],
            ["🤲 Charity", remedy.charity],
            ["📿 Japa Day", remedy.day + " at sunrise"],
            ["🪷 Deity", remedy.deity],
          ].map(([k,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",
              padding:"6px 0",borderBottom:i<5?`1px solid ${C.border}22`:"none"}}>
              <span style={{color:C.muted,fontSize:12}}>{k}</span>
              <span style={{color:C.text,fontSize:12,fontWeight:500}}>{v || remedy.color}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Planet list view
  return (
    <div style={{padding:"20px",maxWidth:520,margin:"0 auto",animation:"fadeUp 0.5s ease"}}>
      <h2 style={{fontFamily:"'Cinzel',serif",color:C.gold,margin:"0 0 4px",fontSize:22}}>🕉️ Planetary Remedies</h2>
      <p style={{color:C.muted,marginBottom:20,fontFamily:"'Crimson Pro',serif",fontSize:15}}>
        {planets.length > 0 ? "Remedies based on your Navagraha placements" : "Generate your Kundli first for personalised remedies"}
      </p>

      {planets.length === 0 && (
        <div style={{background:`${C.saffron}11`,border:`1px solid ${C.saffron}44`,
          borderRadius:14,padding:16,textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:24,marginBottom:8}}>⬡</div>
          <div style={{color:C.saffron,fontSize:13,fontWeight:600}}>Go to Kundli tab first</div>
          <div style={{color:C.muted,fontSize:12,marginTop:4}}>Enter your birth details to get personalised planetary remedies</div>
        </div>
      )}

      {/* Show all 9 planets with their remedy priority */}
      {(planets.length > 0 ? sortedPlanets : GRAHAS.map(g=>({...g,house:'-',degree:0,signName:'',retro:false,status:null}))).map((p,i) => {
        const rem = PLANET_REMEDY_DATA[p.name];
        if (!rem) return null;
        const sc = p.status ? STATUS_CONFIG[p.status] : null;
        return (
          <div key={i} className="card-hover" onClick={()=>startJapa(p)} style={{
            background:C.card,
            border:`1px solid ${sc?sc.color+'44':C.border}`,
            borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",
            transition:"all 0.3s",animation:`fadeUp 0.3s ease ${i*0.05}s both`,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {/* Planet symbol */}
              <div style={{fontSize:28,color:rem.color,minWidth:36,textAlign:"center"}}>{p.symbol}</div>

              {/* Info */}
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{color:rem.color,fontWeight:700,fontSize:14,fontFamily:"'Cinzel',serif"}}>{p.name}</span>
                  {p.retro && <span style={{background:'#f59e0b22',color:'#f59e0b',fontSize:9,padding:"1px 5px",borderRadius:4}}>℞</span>}
                  {sc && <span style={{background:sc.bg,color:sc.color,fontSize:9,padding:"1px 5px",borderRadius:4}}>{sc.icon} {sc.label}</span>}
                  {p.house !== '-' && (
                    <span style={{background:`${rem.color}22`,color:rem.color,fontSize:9,padding:"1px 6px",borderRadius:10}}>H{p.house}</span>
                  )}
                </div>
                {p.signName && (
                  <div style={{color:C.muted,fontSize:11,marginBottom:3}}>
                    {p.degree}° {p.signName} · {HOUSE_EFFECTS[p.house]?.split(',')[0]}
                  </div>
                )}
                <div style={{color:C.muted,fontSize:10,fontStyle:"italic",lineHeight:1.4}}>{rem.desc}</div>
              </div>

              {/* Day badge + arrow */}
              <div style={{textAlign:"center"}}>
                <div style={{background:`${rem.color}22`,color:rem.color,fontSize:10,
                  padding:"3px 8px",borderRadius:8,marginBottom:4,fontWeight:600}}>{rem.day.slice(0,3)}</div>
                <div style={{color:C.muted,fontSize:10}}>×{rem.count}</div>
                <div style={{color:C.muted,fontSize:14,marginTop:4}}>›</div>
              </div>
            </div>

            {/* Mantra preview */}
            <div style={{marginTop:10,padding:"8px 10px",background:`${C.surface}`,
              borderRadius:8,color:C.muted,fontSize:11,fontStyle:"italic",lineHeight:1.5}}>
              🔊 "{rem.beej}..." · Gem: {rem.gem}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("home");
  const [profile,setProfile]=useState(null);

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Crimson Pro',sans-serif",position:"relative",overflowX:"hidden"}}>
      <style>{css}</style>
      <Stars/>
      <div style={{position:"relative",zIndex:1}}>
        <Header tab={tab} setTab={setTab}/>
        <div style={{paddingBottom:48}}>
          {tab==="home"&&<HomeScreen onStart={()=>setTab("kundli")}/>}
          {tab==="kundli"&&<KundliScreen profile={profile} setProfile={setProfile}/>}
          {tab==="horo"&&<HoroscopeScreen profile={profile}/>}
          {tab==="remedies"&&<RemediesScreen profile={profile}/>}
        </div>
      </div>
    </div>
  );
}
