// Generates the animated SVGs used in README.md.
// Run: node scripts/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../assets/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const C = {
  bg: '#121212',
  card: '#181818',
  bubble: '#232323',
  border: '#262626',
  text: '#F5F5F5',
  muted: '#A3A3A3',
  dim: '#6B6B6B',
  accent: '#44FF62',
};
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r2 = (n) => Math.round(n * 100) / 100;

// Every element's default style is its final state, so with reduced motion
// (animation: none) the image is still complete.
const svg = (name, w, h, body, style = '', title = '') => {
  const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img"${title ? ` aria-label="${esc(title)}"` : ''}>
${title ? `<title>${esc(title)}</title>\n` : ''}<style>
text{font-family:${FONT}}
.mono{font-family:${MONO}}
.pop{transform-box:fill-box;transform-origin:center}
${style}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
${body}
</svg>
`;
  writeFileSync(OUT + name, out);
  console.log('wrote', name);
};

const frame = (w, h, stroke = C.border) =>
  `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="24" fill="${C.bg}" stroke="${stroke}"/>`;

const clipFrame = (id, w, h) =>
  `<clipPath id="${id}"><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="24"/></clipPath>`;

/* ------------------------------------------------------------------ hero */
{
  const W = 840, H = 380;
  const lines = [
    '8+ years building fast, accessible web apps',
    'React · Next.js · TypeScript · Astro',
    'Landing pages, stores, Web3, Telegram Mini Apps',
    'Lighthouse 94+ — polished to the details',
  ];
  const CW = 9, X0 = 200, PER = 5, T = lines.length * PER, win = 100 / lines.length;
  const maxW = Math.max(...lines.map((l) => l.length)) * CW;

  let style = `
@keyframes drift1{to{transform:translate(60px,30px)}}
@keyframes drift2{to{transform:translate(50px,-40px)}}
@keyframes drift3{to{transform:translate(-50px,-30px)}}
.d1{animation:drift1 9s ease-in-out infinite alternate}
.d2{animation:drift2 11s ease-in-out infinite alternate}
.d3{animation:drift3 13s ease-in-out infinite alternate}
@keyframes ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(3.2);opacity:0}}
.ping{animation:ping 1.8s cubic-bezier(0,0,.2,1) infinite}
@keyframes blink{50%{opacity:0}}
.caret{animation:blink 1s step-end infinite}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.rise{animation:rise .8s cubic-bezier(.22,1,.36,1) both}
`;
  let typed = '';
  lines.forEach((line, i) => {
    const n = line.length, w = n * CW, s = r2(i * win);
    const typeEnd = r2(s + win * 0.36), holdEnd = r2(s + win * 0.76), delEnd = r2(s + win * 0.92), hide = r2(s + win * 0.96);
    const steps = `animation-timing-function:steps(${n},end)`;
    style += `@keyframes o${i}{0%{opacity:${i === 0 ? 1 : 0}}${i > 0 ? `${s}%{opacity:1}` : ''}${hide}%{opacity:0}100%{opacity:0}}
.o${i}{animation:o${i} ${T}s step-end infinite${i > 0 ? ';opacity:0' : ''}}
@keyframes t${i}{${s > 0 ? '0%{transform:translateX(0)}' : ''}${s}%{transform:translateX(0);${steps}}${typeEnd}%{transform:translateX(${w}px)}${holdEnd}%{transform:translateX(${w}px);${steps}}${delEnd}%{transform:translateX(0)}100%{transform:translateX(0)}}
.t${i}{animation:t${i} ${T}s infinite${i === 0 ? `;transform:translateX(${w}px)` : ''}}
`;
    typed += `<g class="o${i}">
  <text class="mono" x="${X0}" y="242" font-size="15" fill="${C.text}" textLength="${w}" lengthAdjust="spacingAndGlyphs">${esc(line)}</text>
  <g class="t${i}"><rect x="${X0 - 1}" y="222" width="${maxW + 40}" height="30" fill="${C.card}"/><rect class="caret" x="${X0}" y="226" width="2" height="21" fill="${C.accent}"/></g>
</g>
`;
  });

  const stats = [
    ['8', '+', 'years in frontend', 260],
    ['5', '', 'companies, team lead', 420],
    ['94', '+', 'Lighthouse score', 580],
  ];

  const body = `<defs>
${clipFrame('hc', W, H)}
<radialGradient id="g1"><stop offset="0" stop-color="${C.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="g2"><stop offset="0" stop-color="#3B82F6" stop-opacity=".26"/><stop offset="1" stop-color="#3B82F6" stop-opacity="0"/></radialGradient>
<radialGradient id="g3"><stop offset="0" stop-color="#EC4899" stop-opacity=".22"/><stop offset="1" stop-color="#EC4899" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1" fill="#fff" fill-opacity=".09"/></pattern>
<radialGradient id="fade" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="dm"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
  <stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fff"/><stop offset=".5" stop-color="${C.accent}"/><stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#fff"/>
  <animateTransform attributeName="gradientTransform" type="translate" values="-${W} 0;${W} 0;${W} 0" keyTimes="0;.6;1" dur="7s" repeatCount="indefinite"/>
</linearGradient>
<clipPath id="tc"><rect x="180" y="214" width="508" height="44"/></clipPath>
</defs>
${frame(W, H)}
<g clip-path="url(#hc)">
  <circle class="d1" cx="420" cy="10" r="300" fill="url(#g1)"/>
  <circle class="d2" cx="110" cy="380" r="270" fill="url(#g2)"/>
  <circle class="d3" cx="760" cy="360" r="250" fill="url(#g3)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dm)"/>
</g>

<g class="rise">
  <rect x="325" y="34" width="190" height="30" rx="15" fill="${C.card}" stroke="#2F2F2F"/>
  <circle class="pop ping" cx="345" cy="49" r="4" fill="${C.accent}"/>
  <circle cx="345" cy="49" r="4" fill="${C.accent}"/>
  <text x="357" y="53.5" font-size="13" fill="#D4D4D4">Open to new projects</text>
</g>

<text class="rise" style="animation-delay:.1s" x="420" y="138" text-anchor="middle" font-size="56" font-weight="800" letter-spacing="-1.5" fill="url(#shine)">Mirislam Usmanov</text>
<text class="rise" style="animation-delay:.2s" x="420" y="180" text-anchor="middle" font-size="22" font-weight="600" fill="${C.accent}">Frontend Engineer</text>

<g class="rise" style="animation-delay:.3s">
  <rect x="140" y="212" width="560" height="48" rx="14" fill="${C.card}" stroke="${C.border}"/>
  <text class="mono" x="162" y="242" font-size="15" font-weight="700" fill="${C.accent}">~ $</text>
  <g clip-path="url(#tc)">
${typed}  </g>
</g>

<line x1="340" y1="296" x2="340" y2="350" stroke="${C.border}"/>
<line x1="500" y1="296" x2="500" y2="350" stroke="${C.border}"/>
${stats
  .map(
    ([num, plus, label, x], i) => `<g class="rise" style="animation-delay:${0.45 + i * 0.12}s">
  <text x="${x}" y="324" text-anchor="middle" font-size="30" font-weight="800" fill="${C.text}">${num}<tspan fill="${C.accent}">${plus}</tspan></text>
  <text x="${x}" y="346" text-anchor="middle" font-size="13" fill="${C.muted}">${label}</text>
</g>`
  )
  .join('\n')}`;

  svg('hero.svg', W, H, body, style, 'Mirislam Usmanov — Frontend Engineer');
}

/* ------------------------------------------------------------------ chat */
{
  const W = 840, H = 380, T = 16;
  const pct = (t) => r2((t / T) * 100);
  const msgs = [
    { me: false, text: 'Can we move the form to the first screen?', time: '10:24', at: 1.4, typing: 0.4 },
    { me: true, text: 'Done. Here’s the preview ↗', time: '10:25', at: 2.8 },
    { me: false, text: 'Nice! Can the button be a bit bigger?', time: '10:27', at: 4.8, typing: 3.8 },
    { me: true, text: 'Made it bigger, take a look.', time: '10:28', at: 6.2, reaction: 7.0 },
    { me: false, text: 'Great, approved ✅', time: '10:30', at: 8.8, typing: 7.8 },
  ];
  const OUT_START = pct(14.6), OUT_END = pct(15.4);

  let style = `
@keyframes bounce{0%,60%,100%{transform:none}30%{transform:translateY(-4px)}}
.dot{animation:bounce 1s ease-in-out infinite}
.typing,.status-typing{opacity:0}
`;
  let bubbles = '';
  const typingWindows = [];

  msgs.forEach((m, i) => {
    const y = 108 + i * 48;
    const w = Math.round(m.text.length * 6.9 + 14 + 48);
    const x = m.me ? 408 - w : 40;
    const a = pct(m.at);
    style += `@keyframes m${i}{0%,${a}%{opacity:0;transform:translateY(10px) scale(.96)}${r2(a + 3)}%,${OUT_START}%{opacity:1;transform:none}${OUT_END}%,100%{opacity:0;transform:none}}
.m${i}{animation:m${i} ${T}s cubic-bezier(.22,1,.36,1) infinite}
`;
    bubbles += `<g class="pop m${i}">
  <rect x="${x}" y="${y}" width="${w}" height="36" rx="14" fill="${m.me ? C.accent : C.bubble}"/>
  <text x="${x + 14}" y="${y + 23}" font-size="13" fill="${m.me ? C.bg : '#EDEDED'}">${esc(m.text)}</text>
  <text x="${x + w - 12}" y="${y + 23}" text-anchor="end" font-size="10" fill="${m.me ? C.bg : C.muted}" fill-opacity=".7">${m.time}</text>
</g>
`;
    if (m.reaction) {
      const r = pct(m.reaction);
      style += `@keyframes rx{0%,${r}%{opacity:0;transform:scale(.2)}${r2(r + 2)}%{opacity:1;transform:scale(1.25)}${r2(r + 4)}%,${OUT_START}%{opacity:1;transform:scale(1)}${OUT_END}%,100%{opacity:0}}
.rx{animation:rx ${T}s ease-out infinite}
`;
      bubbles += `<g class="pop rx"><circle cx="${x + w - 8}" cy="${y + 36}" r="12" fill="${C.bubble}" stroke="${C.card}" stroke-width="2"/><text x="${x + w - 8}" y="${y + 40.5}" text-anchor="middle" font-size="13" fill="#F5F5F5">👍</text></g>
`;
    }
    if (m.typing !== undefined) {
      const s = pct(m.typing);
      typingWindows.push([s, a]);
      style += `@keyframes ty${i}{0%,${s}%{opacity:0}${r2(s + 1)}%,${r2(a - 0.5)}%{opacity:1}${a}%,100%{opacity:0}}
.ty${i}{animation:ty${i} ${T}s infinite}
`;
      bubbles += `<g class="typing ty${i}">
  <rect x="40" y="${y}" width="58" height="36" rx="14" fill="${C.bubble}"/>
  ${[0, 1, 2].map((d) => `<circle class="dot" style="animation-delay:${d * 0.15}s" cx="${56 + d * 13}" cy="${y + 18}" r="3.5" fill="${C.muted}"/>`).join('')}
</g>
`;
    }
  });

  // header status: "typing…" while any typing bubble is shown
  const tf = ['0%{opacity:0}'];
  typingWindows.forEach(([s, a]) => tf.push(`${s}%{opacity:0}`, `${r2(s + 1)}%{opacity:1}`, `${r2(a - 0.5)}%{opacity:1}`, `${a}%{opacity:0}`));
  tf.push('100%{opacity:0}');
  const of = tf.map((f) => f.replace(/opacity:(\d)/, (_, v) => `opacity:${1 - +v}`));
  style += `@keyframes st{${tf.join('')}}.status-typing{animation:st ${T}s infinite}
@keyframes so{${of.join('')}}.status-online{animation:so ${T}s infinite}
`;

  // stages progress, synced with the chat
  const nodes = [476, 582.67, 689.33, 796];
  const pStart = pct(1.4), pEnd = pct(8.8), len = 320;
  style += `@keyframes prog{0%,${pStart}%{stroke-dashoffset:${len}}${pEnd}%,${OUT_START}%{stroke-dashoffset:0}${OUT_END}%,100%{stroke-dashoffset:${len}}}
.prog{animation:prog ${T}s linear infinite}
`;
  nodes.forEach((_, i) => {
    const at = r2(pStart + ((pEnd - pStart) * i) / 3);
    style += `@keyframes n${i}{0%,${at}%{fill:${C.bg};stroke:#3A3A3A}${r2(at + 1)}%,${OUT_START}%{fill:${C.accent};stroke:${C.accent}}${OUT_END}%,100%{fill:${C.bg};stroke:#3A3A3A}}
.n${i}{animation:n${i} ${T}s infinite}
`;
  });

  const body = `${frame(W, H)}
<rect x="24" y="24" width="400" height="332" rx="18" fill="${C.card}" stroke="${C.border}"/>
<circle cx="56" cy="58" r="16" fill="${C.accent}" fill-opacity=".15"/>
<text x="56" y="63" text-anchor="middle" font-size="14" font-weight="700" fill="${C.accent}">C</text>
<text x="82" y="54" font-size="14" font-weight="600" fill="${C.text}">Client</text>
<text class="status-online" x="82" y="71" font-size="12" fill="${C.accent}">online</text>
<text class="status-typing" x="82" y="71" font-size="12" fill="${C.muted}">typing…</text>
<line x1="24" y1="90" x2="424" y2="90" stroke="${C.border}"/>
${bubbles}
<text class="mono" x="460" y="70" font-size="12" font-weight="700" letter-spacing="2" fill="${C.accent}">MY APPROACH</text>
<text x="460" y="114" font-size="30" font-weight="800" letter-spacing="-.5" fill="${C.text}">You always know</text>
<text x="460" y="152" font-size="30" font-weight="800" letter-spacing="-.5" fill="${C.text}">where the project</text>
<text x="460" y="190" font-size="30" font-weight="800" letter-spacing="-.5" fill="${C.accent}">stands.</text>
<text x="460" y="228" font-size="15" fill="${C.muted}">A preview after every step and</text>
<text x="460" y="250" font-size="15" fill="${C.muted}">decisions explained in plain words.</text>
<line x1="476" y1="300" x2="796" y2="300" stroke="${C.border}" stroke-width="2"/>
<line class="prog" x1="476" y1="300" x2="796" y2="300" stroke="${C.accent}" stroke-width="2" stroke-dasharray="${len}"/>
${nodes.map((x, i) => `<circle class="n${i}" cx="${x}" cy="300" r="7" fill="${C.accent}" stroke="${C.accent}" stroke-width="2"/>`).join('\n')}
${['Design', 'Layout', 'SEO', 'Launch'].map((l, i) => `<text x="${nodes[i]}" y="332" text-anchor="middle" font-size="13" font-weight="600" fill="${C.muted}">${l}</text>`).join('\n')}`;

  svg('chat.svg', W, H, body, style, 'You always know where the project stands: a preview after every step');
}

/* ---------------------------------------------------------------- secret */
{
  const W = 840, H = 250;
  const rows = [
    { name: 'PROJECT KS', p: 0.7, bars: [40, 64, 32, 52], y: 30 },
    { name: 'PROJECT IE', p: 0.45, bars: [58, 28, 76], y: 130 },
  ];
  const R = 26, CIRC = r2(2 * Math.PI * R);
  let style = `
@keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.35}94%{opacity:1}96%{opacity:.5}97%{opacity:1}}
.stamp{animation:flicker 4s infinite}
@keyframes scan{from{transform:translateX(-60px)}to{transform:translateX(330px)}}
.scan{animation:scan 2.6s linear infinite}
@keyframes ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(3);opacity:0}}
.ping{animation:ping 1.8s cubic-bezier(0,0,.2,1) infinite}
@keyframes blink{50%{opacity:0}}
.cur{animation:blink 1s step-end infinite}
`;
  let right = '';
  rows.forEach((r, i) => {
    const cx = 520, cy = r.y + 45, off = r2(CIRC * (1 - r.p));
    style += `@keyframes ring${i}{from{stroke-dashoffset:${CIRC}}}.ring${i}{animation:ring${i} 2.2s cubic-bezier(.22,1,.36,1) ${0.4 + i * 0.3}s both}
`;
    let bx = 566;
    const bars = r.bars.map((bw) => { const s = `<rect x="${bx}" y="${r.y + 52}" width="${bw}" height="14" rx="3" fill="#2C2C2C"/>`; bx += bw + 6; return s; }).join('');
    right += `<rect x="470" y="${r.y}" width="346" height="90" rx="16" fill="${C.card}" stroke="${C.border}"/>
<circle cx="${cx}" cy="${cy}" r="${R}" stroke="${C.border}" stroke-width="5"/>
<circle class="ring${i}" cx="${cx}" cy="${cy}" r="${R}" stroke="${C.accent}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${off}" transform="rotate(-90 ${cx} ${cy})"/>
<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="${C.text}">${Math.round(r.p * 100)}%</text>
<text class="mono" x="566" y="${r.y + 38}" font-size="13" font-weight="700" letter-spacing="2" fill="${C.muted}">${r.name}</text>
<clipPath id="bc${i}"><rect x="566" y="${r.y + 52}" width="${bx - 566}" height="14"/></clipPath>
${bars}
<g clip-path="url(#bc${i})"><rect class="scan" style="animation-delay:${i * 1.1}s" x="566" y="${r.y + 52}" width="60" height="14" fill="url(#sg)"/></g>
<rect class="cur" x="${bx + 2}" y="${r.y + 52}" width="8" height="14" fill="${C.accent}"/>
<circle class="pop ping" cx="796" cy="${r.y + 20}" r="3.5" fill="${C.accent}"/>
<circle cx="796" cy="${r.y + 20}" r="3.5" fill="${C.accent}"/>
`;
  });

  const body = `<defs>
${clipFrame('sc', W, H)}
<radialGradient id="glow"><stop offset="0" stop-color="${C.accent}" stop-opacity=".16"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="sg"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
</defs>
${frame(W, H, 'rgba(68,255,98,.28)')}
<g clip-path="url(#sc)"><circle cx="80" cy="40" r="320" fill="url(#glow)"/></g>
<g class="stamp" transform="translate(40 36) rotate(-3)">
  <rect width="132" height="30" rx="6" fill="${C.accent}" fill-opacity=".08" stroke="${C.accent}" stroke-width="1.5"/>
  <text class="mono" x="66" y="20" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="3" fill="${C.accent}">TOP SECRET</text>
</g>
<text x="40" y="118" font-size="30" font-weight="800" letter-spacing="-.5" fill="${C.text}">Currently in development</text>
<text x="40" y="150" font-size="15" fill="${C.muted}">Two projects under NDA. Details soon.</text>
<text x="40" y="208" font-size="14" fill="${C.muted}">Got an invite? <tspan fill="${C.accent}" font-weight="600">Ask me on Telegram →</tspan></text>
${right}`;

  svg('secret.svg', W, H, body, style, 'Top secret: two projects under NDA currently in development');
}

/* ---------------------------------------------------------------- career */
{
  const W = 840, H = 240;
  const jobs = [
    ['2018', 'Web Pult', ['HTML/CSS Engineer'], 'SCSS · jQuery · Gulp'],
    ['2019', 'One Web', ['Web Engineer'], 'Nunjucks · WordPress'],
    ['2020', 'Margin Digital Studio', ['Technical Lead &', 'Frontend Engineer'], 'PHP · WordPress · Gulp'],
    ['2022', 'Humandone', ['Frontend Engineer'], 'React · Gatsby · Web3'],
    ['2024 — now', 'Dafna', ['Frontend Engineer'], 'Next.js · Zustand'],
  ];
  const x0 = 90, x1 = 750, step = (x1 - x0) / (jobs.length - 1), LY = 92, DUR = 2.4, DELAY = 0.3;
  const style = `
@keyframes draw{from{stroke-dashoffset:${x1 - x0}}}
.draw{animation:draw ${DUR}s linear ${DELAY}s both}
@keyframes pop{0%{transform:scale(0)}70%{transform:scale(1.3)}100%{transform:scale(1)}}
.node{animation:pop .5s cubic-bezier(.22,1,.36,1) both}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.rise{animation:rise .7s cubic-bezier(.22,1,.36,1) both}
@keyframes ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.6);opacity:0}}
.ping{animation:ping 1.8s cubic-bezier(0,0,.2,1) 3s infinite}
`;
  const items = jobs
    .map(([year, company, role, stack], i) => {
      const x = x0 + step * i, d = r2(DELAY + (DUR * i) / (jobs.length - 1));
      const last = i === jobs.length - 1;
      return `<g class="rise" style="animation-delay:${d}s">
  <text class="mono" x="${x}" y="66" text-anchor="middle" font-size="13" font-weight="700" fill="${C.accent}">${esc(year)}</text>
  <text x="${x}" y="134" text-anchor="middle" font-size="15" font-weight="700" fill="${C.text}">${esc(company)}</text>
  ${role.map((l, j) => `<text x="${x}" y="${156 + j * 17}" text-anchor="middle" font-size="12.5" fill="${C.muted}">${esc(l)}</text>`).join('')}
  <text class="mono" x="${x}" y="208" text-anchor="middle" font-size="11" fill="${C.dim}">${esc(stack)}</text>
</g>
${last ? `<circle class="pop ping" cx="${x}" cy="${LY}" r="8" fill="${C.accent}" fill-opacity=".5"/>` : ''}
<g class="pop node" style="animation-delay:${d}s"><circle cx="${x}" cy="${LY}" r="8" fill="${C.bg}" stroke="${C.accent}" stroke-width="2.5"/><circle cx="${x}" cy="${LY}" r="3" fill="${C.accent}"/></g>`;
    })
    .join('\n');

  const body = `${frame(W, H)}
<line x1="${x0}" y1="${LY}" x2="${x1}" y2="${LY}" stroke="${C.border}" stroke-width="2"/>
<line class="draw" x1="${x0}" y1="${LY}" x2="${x1}" y2="${LY}" stroke="${C.accent}" stroke-width="2" stroke-dasharray="${x1 - x0}"/>
${items}`;

  svg('career.svg', W, H, body, style, 'Career: Web Pult 2018, One Web 2019, Margin Digital Studio 2020, Humandone 2022, Dafna 2024 — now');
}

/* ---------------------------------------------------------------- skills */
{
  const W = 840;
  const groups = [
    ['Core', ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'React', 'Next.js', 'Astro', 'React Router']],
    ['Data & Quality', ['TanStack Query', 'Zustand', 'Zod', 'Axios', 'React Hook Form', 'Vitest', 'Playwright', 'Storybook']],
    ['UI & Motion', ['Sass', 'Tailwind CSS', 'Chakra UI', 'GSAP', 'Motion', 'Lottie', 'Embla Carousel', 'Figma']],
    ['Tooling & AI', ['Vite', 'Bun', 'Git', 'ESLint', 'Prettier', 'PWA', 'Claude Code', 'Codex']],
  ];
  const colX = [32, 436], colW = 372, CH = 30, GAP = 8;
  let k = 0, y = 32, body = '';
  for (let row = 0; row < 2; row++) {
    let rowH = 0;
    for (let col = 0; col < 2; col++) {
      const [label, chips] = groups[row * 2 + col];
      let x = colX[col], cy = y + 22;
      body += `<text class="mono" x="${x}" y="${y + 6}" font-size="12" font-weight="700" letter-spacing="2" fill="${C.accent}">${esc(label.toUpperCase())}</text>\n`;
      for (const chip of chips) {
        const w = Math.round(chip.length * 7.4 + 28);
        if (x + w > colX[col] + colW) { x = colX[col]; cy += CH + GAP; }
        body += `<g class="chip" style="animation-delay:${r2(k * 0.12)}s"><rect x="${x}" y="${cy}" width="${w}" height="${CH}" rx="15" fill="${C.card}" stroke="#2A2A2A"/><text x="${x + w / 2}" y="${cy + 19.5}" text-anchor="middle" font-size="13" fill="#E5E5E5">${esc(chip)}</text></g>\n`;
        x += w + GAP; k++;
      }
      rowH = Math.max(rowH, cy + CH - y);
    }
    y += rowH + 36;
  }
  const H = y - 4;
  const style = `
@keyframes wave{4%{stroke:${C.accent};fill:#1B2E1F}10%{stroke:#2A2A2A;fill:${C.card}}}
.chip rect{animation:wave ${r2(k * 0.12 + 3)}s ease-in-out infinite;animation-delay:inherit}
`;
  svg('skills.svg', W, H, `${frame(W, H)}\n${body}`, style, 'Skills: ' + groups.flatMap((g) => g[1]).join(', '));
}

/* --------------------------------------------------------------- reviews */
{
  const W = 840, H = 206, CW = 300, GAP = 16, Y = 25;
  const reviews = [
    ['Excellent work on the landing page built with React and Next.js. Thank you!', 'Bryan Finch'],
    ['Completed the CSS fixes in the shortest possible time. Very satisfied with the cooperation.', 'Illarion Panovsky'],
    ['Excellent communication and great code. Highly recommend.', 'Egor Burkaba'],
    ['Handled the layout perfectly. Polite, punctual, and highly recommended.', 'Ilya Usanov'],
    ['Reliable and conscientious. Completed 10 pages exactly according to the technical requirements.', 'dcpr'],
    ['Pleasant to work with. Mirislam understands tasks without issues and provides high-quality work.', 'Alexey Kopievsky'],
    ['Clean and readable code. Handled the complex form layout quickly. Recommended!', 'Ren Ren'],
    ['High-quality site development. All minor edits were fixed immediately. I advise everyone to work with him.', 'Andrey Petrov'],
  ];
  const wrap = (s, max = 36) => {
    const out = [''];
    for (const word of s.split(' ')) {
      const cur = out[out.length - 1];
      if ((cur + ' ' + word).trim().length > max) out.push(word);
      else out[out.length - 1] = (cur + ' ' + word).trim();
    }
    return out;
  };
  const rowW = reviews.length * (CW + GAP);
  const card = ([quote, author], x) => `<g transform="translate(${x} ${Y})">
  <rect width="${CW}" height="156" rx="16" fill="${C.card}" stroke="${C.border}"/>
  <text x="16" y="48" font-size="44" font-weight="800" fill="${C.accent}">“</text>
  ${wrap(quote).map((l, i) => `<text x="44" y="${30 + i * 19}" font-size="13.5" fill="#E5E5E5">${esc(l)}</text>`).join('')}
  <line x1="18" y1="114" x2="${CW - 18}" y2="114" stroke="${C.border}"/>
  <text x="18" y="138" font-size="13" font-weight="700" fill="${C.text}">${esc(author)}</text>
  <text x="${CW - 18}" y="138" text-anchor="end" font-size="12" letter-spacing="1" fill="${C.accent}">★★★★★</text>
</g>`;
  const cards = [0, 1].flatMap((copy) => reviews.map((r, i) => card(r, 16 + copy * rowW + i * (CW + GAP)))).join('\n');
  const style = `
@keyframes marquee{to{transform:translateX(-${rowW}px)}}
.track{animation:marquee 70s linear infinite}
`;
  const body = `<defs>
${clipFrame('rc', W, H)}
<linearGradient id="edge"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".08" stop-color="#fff"/><stop offset=".92" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="em"><rect width="${W}" height="${H}" fill="url(#edge)"/></mask>
</defs>
${frame(W, H)}
<g clip-path="url(#rc)" mask="url(#em)"><g class="track">
${cards}
</g></g>`;
  svg('reviews.svg', W, H, body, style, 'Client reviews');
}

/* ---------------------------------------------------------------- contact */
{
  const W = 840, H = 170;
  const style = `
@keyframes breathe{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
.glow{animation:breathe 5s ease-in-out infinite;transform-origin:420px 85px}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.rise{animation:rise .8s cubic-bezier(.22,1,.36,1) both}
`;
  const body = `<defs>
${clipFrame('cc', W, H)}
<radialGradient id="cg"><stop offset="0" stop-color="${C.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
</defs>
${frame(W, H, 'rgba(68,255,98,.28)')}
<g clip-path="url(#cc)"><ellipse class="glow" cx="420" cy="170" rx="380" ry="150" fill="url(#cg)"/></g>
<text class="rise" x="420" y="80" text-anchor="middle" font-size="36" font-weight="800" letter-spacing="-.8" fill="${C.text}">Have a project? <tspan fill="${C.accent}">Let’s discuss it.</tspan></text>
<text class="rise" style="animation-delay:.15s" x="420" y="116" text-anchor="middle" font-size="15" fill="${C.muted}">Landing pages, stores, services, Web3 and Telegram Mini Apps</text>`;
  svg('contact.svg', W, H, body, style, 'Have a project? Let’s discuss it.');
}

/* --------------------------------------------------------------- buttons */
const button = (name, label, primary = false) => {
  const H = 44, w = Math.round(label.length * 8.3 + 48);
  const style = primary
    ? `@keyframes sweep{0%,55%{transform:translateX(-80px)}100%{transform:translateX(${w + 80}px)}}.sweep{animation:sweep 3.2s ease-in-out infinite}`
    : '';
  const body = primary
    ? `<defs><clipPath id="p"><rect width="${w}" height="${H}" rx="22"/></clipPath>
<linearGradient id="s"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<rect width="${w}" height="${H}" rx="22" fill="${C.accent}"/>
<g clip-path="url(#p)"><g class="sweep"><rect x="0" y="0" width="60" height="${H}" fill="url(#s)" transform="skewX(-20)"/></g></g>
<text x="${w / 2}" y="27.5" text-anchor="middle" font-size="15" font-weight="700" fill="${C.bg}">${esc(label)}</text>`
    : `<rect x="0.5" y="0.5" width="${w - 1}" height="${H - 1}" rx="21.5" fill="${C.card}" stroke="#333"/>
<text x="${w / 2}" y="27.5" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(label)}</text>`;
  svg(`btn-${name}.svg`, w, H, body, style, label);
};
button('discuss', 'Discuss a project  →', true);
button('cv', 'Download CV  ↓');
button('site', 'Website  ↗');
button('email', 'Email');
button('telegram', 'Telegram');
button('linkedin', 'LinkedIn');
