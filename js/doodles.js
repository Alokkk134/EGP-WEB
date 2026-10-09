/* =====================================================================
   Margin doodles — the physics, chemistry and maths sketches that run
   down both sides of the page, as if drawn in an exercise book's margin.
   Each side is one 300 x 1800 tile, repeated down the page as an SVG
   pattern.  The SVG is inline so the page's own handwriting font
   (Caveat) is available to the formulas.
   ===================================================================== */
(function () {
  const INK = '#1f2a44', RED = '179,54,43', BLUE = '78,104,150', GOLD = '192,138,44';
  const fill = (rgb, a) => 'rgba(' + rgb + ',' + a + ')';
  const f2 = n => Math.round(n * 10) / 10;

  /* a formula in handwriting; ^x and _x become super- and subscripts */
  function hand(x, y, s, size, rot, color) {
    let cur = 0;   /* baseline offset so far: each run moves relative to it */
    const parts = s.split(/([\^_]\{[^}]*\}|[\^_].)/).filter(Boolean).map(p => {
      const script = p[0] === '^' || p[0] === '_';
      const t = script ? (p[1] === '{' ? p.slice(2, -1) : p.slice(1)) : p;
      const target = !script ? 0 : p[0] === '^' ? -size * 0.38 : size * 0.22;
      const dy = f2(target - cur); cur = target;
      return '<tspan dy="' + dy + '"' + (script ? ' font-size="' + Math.round(size * 0.62) + '"' : '') + '>' +
        t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</tspan>';
    }).join('');
    return '<text x="' + x + '" y="' + y + '" font-family="Caveat, cursive" font-size="' + size + '" fill="' + (color || INK) +
      '" transform="rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')">' + parts + '</text>';
  }

  /* ------------------------------------------------- left margin: maths */
  function left() {
    let s = '';
    /* ruler */
    let t = '<rect x="0" y="0" width="236" height="44" rx="3" fill="' + fill(GOLD, 0.2) + '"/>';
    for (let i = 0; i <= 45; i++) {
      const x = 8 + i * 5, len = i % 10 === 0 ? 16 : i % 5 === 0 ? 11 : 6;
      t += '<path d="M' + x + ' 0 v' + len + '" stroke-width="1.1"/>';
      if (i % 10 === 0) t += '<text x="' + x + '" y="30" font-family="Newsreader, serif" font-size="10" fill="' + INK + '" stroke="none" text-anchor="middle">' + i / 10 + '</text>';
    }
    s += '<g transform="translate(18 64) rotate(-6)">' + t + '</g>';
    s += hand(36, 186, 'F = ma', 32, -4);

    /* protractor */
    const cx = 122, cy = 352, R = 100;
    t = '<path d="M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy + ' Z" fill="' + fill(BLUE, 0.12) + '"/>';
    t += '<path d="M' + (cx - 64) + ' ' + cy + ' A64 64 0 0 1 ' + (cx + 64) + ' ' + cy + '" stroke-width="1.2"/>';
    for (let a = 0; a <= 180; a += 10) {
      const th = Math.PI - (a * Math.PI) / 180, len = a % 30 === 0 ? 15 : 8;
      t += '<path d="M' + f2(cx + R * Math.cos(th)) + ' ' + f2(cy - R * Math.sin(th)) + ' L' +
        f2(cx + (R - len) * Math.cos(th)) + ' ' + f2(cy - (R - len) * Math.sin(th)) + '" stroke-width="1.1"/>';
    }
    t += '<circle cx="' + cx + '" cy="' + (cy - 2) + '" r="3" fill="' + INK + '" stroke="none"/>';
    t += '<path d="M' + cx + ' ' + cy + ' L' + f2(cx + 88 * Math.cos(Math.PI / 3)) + ' ' + f2(cy - 88 * Math.sin(Math.PI / 3)) + '" stroke="' + fill(RED, 0.9) + '" stroke-width="1.6"/>';
    s += t + hand(cx + 34, cy - 14, '60°', 20, 0, fill(RED, 0.95));

    /* pencil */
    s += '<g transform="translate(40 500) rotate(-32)">' +
      '<rect x="0" y="0" width="190" height="20" rx="2" fill="' + fill(GOLD, 0.5) + '"/>' +
      '<path d="M0 0 L-30 10 L0 20 Z" fill="#f1dcc0"/><path d="M-30 10 l9 -3 v6 Z" fill="' + INK + '"/>' +
      '<rect x="190" y="0" width="16" height="20" fill="' + fill(RED, 0.45) + '"/>' +
      '<path d="M0 7 h190 M0 13 h190" stroke-width=".9" opacity=".5"/></g>';
    s += hand(28, 640, 'π ≈ 3.14159', 30, -3);

    /* compass, mid-arc */
    s += '<path d="M124 676 v-26" stroke-width="2.4"/><circle cx="124" cy="684" r="8" fill="' + fill(GOLD, 0.45) + '"/>' +
      '<path d="M119 690 L72 852 M129 690 L176 852" stroke-width="2.6"/>' +
      '<path d="M72 852 l-3 14" stroke-width="1.4"/><path d="M176 852 l-5 10 l9 2 Z" fill="' + INK + '"/>' +
      '<path d="M66 878 A70 70 0 0 0 186 878" stroke-dasharray="5 6" stroke="' + fill(RED, 0.8) + '"/>';

    /* a parabola on axes */
    let pts = [];
    for (let x = 42; x <= 208; x += 6) pts.push(x + ' ' + f2(940 + 130 * (1 - Math.pow((x - 125) / 83, 2))));
    s += '<path d="M30 1084 V918 M24 926 l6 -10 l6 10 M22 1074 H238 M230 1068 l10 6 l-10 6" stroke-width="1.5"/>' +
      '<path d="M' + pts.join(' L') + '" stroke="' + fill(RED, 0.85) + '" stroke-width="2.2"/>' +
      '<circle cx="125" cy="1070" r="3.5" fill="' + INK + '" stroke="none"/>';
    s += hand(150, 960, 'y = x^2', 26, 0);
    s += hand(24, 1150, '∫_0^1 x^2 dx = 1/3', 26, -3);

    /* set square */
    s += '<path d="M40 1200 L40 1360 L176 1360 Z" fill="' + fill(BLUE, 0.16) + '"/>' +
      '<path d="M60 1252 L60 1340 L126 1340 Z" stroke-width="1.3"/>' +
      '<path d="M40 1220 h9 M40 1240 h6 M40 1260 h9 M40 1280 h6 M40 1300 h9 M40 1320 h6 M40 1340 h9" stroke-width="1.1"/>';
    s += hand(22, 1426, 'sin^2θ + cos^2θ = 1', 24, -2);

    /* a sine wave */
    pts = [];
    for (let x = 20; x <= 250; x += 5) pts.push(x + ' ' + f2(1492 - 24 * Math.sin(((x - 20) / 230) * Math.PI * 3)));
    s += '<path d="M16 1492 H254" stroke-width="1" stroke-dasharray="3 5"/>' +
      '<path d="M' + pts.join(' L') + '" stroke="' + fill(BLUE, 0.95) + '" stroke-width="2"/>';

    /* fountain pen */
    s += '<g transform="translate(120 1636) rotate(-38)">' +
      '<rect x="-100" y="-10" width="150" height="20" rx="10" fill="' + fill(BLUE, 0.4) + '"/>' +
      '<rect x="-30" y="-10" width="9" height="20" fill="' + fill(GOLD, 0.6) + '"/>' +
      '<path d="M-96 -10 v-6 h46" stroke-width="1.6"/>' +
      '<path d="M50 -8 L92 0 L50 8 Z" fill="' + fill(GOLD, 0.35) + '"/><path d="M58 0 h26" stroke-width="1"/></g>';
    s += hand(36, 1760, '√2 = 1.414', 28, -4);
    return s;
  }

  /* ------------------------------ right margin: physics and chemistry */
  function right() {
    let s = '';
    /* atom */
    s += '<g transform="translate(206 112)">' +
      '<ellipse rx="70" ry="24" fill="' + fill(BLUE, 0.1) + '"/>' +
      '<ellipse rx="70" ry="24" transform="rotate(60)"/><ellipse rx="70" ry="24" transform="rotate(-60)"/>' +
      '<circle r="9" fill="' + fill(GOLD, 0.85) + '" stroke="none"/><circle cx="70" r="4.5" fill="' + fill(RED, 1) + '" stroke="none"/></g>';
    s += hand(118, 240, 'H_2O', 36, -5);
    s += hand(206, 276, 'NaCl', 28, 4);

    /* conical flask */
    s += '<path d="M190 300 v52 L142 444 Q138 456 152 458 H268 Q282 456 278 444 L230 352 v-52"/>' +
      '<path d="M184 300 h52" stroke-width="2.4"/>' +
      '<path d="M160 412 Q210 400 260 412 L278 444 Q282 456 268 458 H152 Q138 456 142 444 Z" fill="' + fill(RED, 0.28) + '" stroke="none"/>' +
      '<path d="M160 412 Q210 400 260 412"/>' +
      '<circle cx="190" cy="434" r="5"/><circle cx="222" cy="426" r="3.5"/><circle cx="206" cy="386" r="3"/>' +
      '<path d="M200 322 h20 M200 336 h12" stroke-width="1.2" opacity=".6"/>';

    /* benzene ring */
    let hex = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; hex.push(f2(200 + 48 * Math.cos(a)) + ' ' + f2(570 + 48 * Math.sin(a))); }
    s += '<path d="M' + hex.join(' L') + ' Z" fill="' + fill(GOLD, 0.12) + '"/>' +
      '<circle cx="200" cy="570" r="29"/><path d="M200 522 V496" />';
    s += hand(186, 488, 'OH', 26, 0);

    /* test tubes in a rack */
    [[140, RED, 0.35, 738], [186, BLUE, 0.35, 716], [232, GOLD, 0.5, 752]].forEach(([x, c, a, ly]) => {
      s += '<path d="M' + (x - 13) + ' ' + ly + ' V786 a13 13 0 0 0 26 0 V' + ly + ' Z" fill="' + fill(c, a) + '" stroke="none"/>' +
        '<path d="M' + (x - 13) + ' 656 V786 a13 13 0 0 0 26 0 V656"/><path d="M' + (x - 17) + ' 656 h34" stroke-width="2"/>';
    });
    s += '<rect x="112" y="700" width="150" height="12" rx="2" fill="' + fill(GOLD, 0.3) + '"/>' +
      '<path d="M118 712 V812 M256 712 V812 M104 812 H270" stroke-width="2"/>';
    s += hand(108, 878, 'PV = nRT', 32, -3);

    /* horseshoe magnet */
    s += '<path d="M140 926 V994 a60 60 0 0 0 120 0 V926 H230 V994 a30 30 0 0 1 -60 0 V926 Z" fill="' + fill(BLUE, 0.12) + '"/>' +
      '<rect x="140" y="926" width="30" height="24" fill="' + fill(RED, 0.55) + '"/>' +
      '<rect x="230" y="926" width="30" height="24" fill="' + fill(BLUE, 0.55) + '"/>' +
      '<text x="155" y="945" font-family="Newsreader, serif" font-size="14" text-anchor="middle" fill="#fff" stroke="none">N</text>' +
      '<text x="245" y="945" font-family="Newsreader, serif" font-size="14" text-anchor="middle" fill="#fff" stroke="none">S</text>' +
      '<path d="M128 916 q-14 -18 6 -32 M272 916 q14 -18 -6 -32" stroke-dasharray="4 5" stroke-width="1.3"/>';

    /* convex lens bringing rays to a focus */
    s += '<path d="M80 1150 H296" stroke-width="1" stroke-dasharray="4 5"/>' +
      '<ellipse cx="196" cy="1150" rx="13" ry="62" fill="' + fill(BLUE, 0.16) + '"/>' +
      '<path d="M86 1106 H196 L272 1150 M86 1150 H272 M86 1194 H196 L272 1150" stroke="' + fill(RED, 0.85) + '" stroke-width="1.6"/>' +
      '<circle cx="272" cy="1150" r="3.5" fill="' + INK + '" stroke="none"/>';
    s += hand(264, 1180, 'F', 24, 0);
    s += hand(132, 1262, 'λ = h/p', 32, -4);

    /* a circuit: cell, resistor, bulb */
    s += '<path d="M112 1302 H170 M190 1302 H268 V1352 l-8 5 l16 7 l-16 7 l16 7 l-16 7 l8 5 V1414 H112 V1384 M112 1356 V1302"/>' +
      '<path d="M174 1286 v32" stroke-width="2.4"/><path d="M186 1294 v16" stroke-width="3.4"/>' +
      '<circle cx="112" cy="1370" r="14" fill="' + fill(GOLD, 0.35) + '"/><path d="M102 1360 l20 20 M122 1360 l-20 20" stroke-width="1.3"/>';
    s += hand(152, 1282, '+  −', 18, 0);

    /* beaker */
    s += '<path d="M152 1544 V1590 Q152 1600 162 1600 H250 Q260 1600 260 1590 V1544 Z" fill="' + fill(BLUE, 0.25) + '" stroke="none"/>' +
      '<path d="M146 1466 h8 V1590 Q154 1600 162 1600 H250 Q260 1600 260 1590 V1466 h6"/>' +
      '<path d="M156 1490 h10 M156 1510 h6 M156 1530 h10 M156 1550 h6 M156 1570 h10" stroke-width="1.2"/>' +
      '<path d="M152 1544 H260" stroke-width="1.2"/>';
    s += hand(132, 1684, 'E = mc^2', 34, -3);
    s += hand(104, 1752, '6.022 × 10^{23}', 26, 2);
    return s;
  }

  function panel(side, body) {
    const id = 'doodle-' + side;
    return '<svg width="100%" height="100%" aria-hidden="true" focusable="false">' +
      '<defs><pattern id="' + id + '" width="300" height="1800" patternUnits="userSpaceOnUse">' +
      '<g fill="none" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + '</g>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }

  document.querySelectorAll('.margin-doodles').forEach(el => {
    const r = el.classList.contains('r');
    el.innerHTML = panel(r ? 'r' : 'l', r ? right() : left());
  });

  /* ===================================================================
     The sky behind the whole page: three depths of academic sketches.
     far  — big, pale, slow: graph paper, a galaxy, a constellation,
            the periodic table, a geometry construction, giant Σ and π
     mid  — diagrams: DNA, Bohr atom, pendulum, Pythagoras, an incline,
            a water molecule, a spring, a reaction
     near — small, quick: Greek letters, symbols and stars
     Each is a repeating tile that drifts at its own speed as the page
     scrolls, so the layers read as distance rather than wallpaper.
     =================================================================== */
  const SERIF = '"Instrument Serif", Georgia, serif';
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function star4(x, y, r, color) {
    const k = r * 0.2;
    return '<path d="M' + x + ' ' + (y - r) + ' Q' + (x + k) + ' ' + (y - k) + ' ' + (x + r) + ' ' + y + ' Q' + (x + k) + ' ' + (y + k) + ' ' +
      x + ' ' + (y + r) + ' Q' + (x - k) + ' ' + (y + k) + ' ' + (x - r) + ' ' + y + ' Q' + (x - k) + ' ' + (y - k) + ' ' + x + ' ' + (y - r) + ' Z" fill="' + color + '" stroke="none"/>';
  }
  function glyph(x, y, s, size, rot) {
    return '<text x="' + x + '" y="' + y + '" font-family=\'' + SERIF + '\' font-size="' + size + '" fill="none" stroke="' + INK +
      '" stroke-width="1.6" transform="rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')">' + s + '</text>';
  }

  function far() {
    let s = '';
    /* graph paper with a charging curve plotted on it */
    let g = '<rect width="360" height="280" fill="' + fill(BLUE, 0.05) + '" stroke="none"/>';
    for (let i = 0; i <= 18; i++) g += '<path d="M' + i * 20 + ' 0 V280" stroke-width="' + (i % 5 ? 0.6 : 1.3) + '"/>';
    for (let j = 0; j <= 14; j++) g += '<path d="M0 ' + j * 20 + ' H360" stroke-width="' + (j % 5 ? 0.6 : 1.3) + '"/>';
    let pts = [];
    for (let x = 0; x <= 360; x += 8) pts.push(x + ' ' + f2(270 - 230 * (1 - Math.exp(-x / 80))));
    g += '<path d="M' + pts.join(' L') + '" stroke="' + fill(RED, 1) + '" stroke-width="2.6"/>';
    s += '<g transform="translate(60 90) rotate(-4)">' + g + '</g>';
    s += hand(70, 420, 'q = Q(1 − e^{−t/RC})', 34, -4);

    /* a spiral galaxy, the logo's cousin */
    const gx = 1180, gy = 210;
    for (const ph of [0, Math.PI]) {
      for (let t = 0.4; t < 3.6 * Math.PI; t += 0.16) {
        const r = 9 * Math.exp(0.27 * t);
        s += '<circle cx="' + f2(gx + r * Math.cos(t + ph)) + '" cy="' + f2(gy + r * Math.sin(t + ph) * 0.62) + '" r="' + f2(2.6 - t * 0.17) + '" fill="' + INK + '" stroke="none"/>';
      }
    }
    s += '<circle cx="' + gx + '" cy="' + gy + '" r="16" fill="' + fill(GOLD, 0.6) + '" stroke="none"/>';

    /* Ursa Major, joined in dotted pencil */
    const U = [[300, 640], [372, 628], [434, 662], [494, 694], [506, 772], [600, 782], [618, 706]];
    s += '<path d="M' + U.slice(0, 5).map(p => p.join(' ')).join(' L') + ' L' + U[5].join(' ') + ' L' + U[6].join(' ') + ' L' + U[3].join(' ') +
      '" stroke-dasharray="3 7" stroke-width="1.6"/>';
    U.forEach(([x, y], i) => { s += star4(x, y, i % 3 ? 9 : 13, fill(GOLD, 0.95)); });
    s += hand(560, 840, 'Ursa Major', 30, -3);

    /* a geometry construction: circumcircle, triangle, incircle */
    const ox = 470, oy = 1080, R = 175;
    const tri = [0, 1, 2].map(i => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3; return [f2(ox + R * Math.cos(a)), f2(oy + R * Math.sin(a))]; });
    s += '<circle cx="' + ox + '" cy="' + oy + '" r="' + R + '" stroke-width="1.6"/>' +
      '<path d="M' + tri.map(p => p.join(' ')).join(' L') + ' Z" fill="' + fill(BLUE, 0.06) + '" stroke-width="1.8"/>' +
      '<circle cx="' + ox + '" cy="' + oy + '" r="' + R / 2 + '" stroke="' + fill(RED, 1) + '" stroke-width="1.6"/>' +
      tri.map(p => '<path d="M' + p.join(' ') + ' L' + ox + ' ' + oy + '" stroke-dasharray="6 6" stroke-width="1.2"/>').join('') +
      '<circle cx="' + ox + '" cy="' + oy + '" r="4" fill="' + INK + '" stroke="none"/>';
    s += hand(ox + 10, oy + 26, 'O', 26, 0);

    /* a strip of the periodic table */
    const rows = [[['Li', 3], ['Be', 4], ['B', 5], ['C', 6], ['N', 7], ['O', 8], ['F', 9], ['Ne', 10]],
      [['Na', 11], ['Mg', 12], ['Al', 13], ['Si', 14], ['P', 15], ['S', 16], ['Cl', 17], ['Ar', 18]]];
    rows.forEach((row, r) => row.forEach(([el, z], c) => {
      const x = 840 + c * 68, y = 980 + r * 68;
      const tint = el === 'C' ? fill(GOLD, 0.3) : el === 'O' ? fill(BLUE, 0.22) : el === 'Na' ? fill(RED, 0.18) : 'none';
      s += '<rect x="' + x + '" y="' + y + '" width="64" height="64" fill="' + tint + '" stroke-width="1.4"/>' +
        '<text x="' + (x + 6) + '" y="' + (y + 15) + '" font-family="Newsreader, serif" font-size="11" fill="' + INK + '" stroke="none">' + z + '</text>' +
        '<text x="' + (x + 32) + '" y="' + (y + 47) + '" font-family=\'' + SERIF + '\' font-size="30" text-anchor="middle" fill="' + INK + '" stroke="none">' + el + '</text>';
    }));
    s += hand(880, 1300, 'e^{iπ} + 1 = 0', 46, -3);

    /* two giant outlined letters, very faint */
    s += glyph(930, 640, 'Σ', 330, 6) + glyph(90, 1540, 'π', 300, -8);
    return s;
  }

  function mid() {
    let s = '';
    /* DNA double helix */
    const a = [], b = [];
    for (let y = 60; y <= 460; y += 6) {
      a.push(f2(170 + 46 * Math.sin(y / 38)) + ' ' + y);
      b.push(f2(170 + 46 * Math.sin(y / 38 + Math.PI)) + ' ' + y);
    }
    for (let y = 70; y <= 450; y += 18) {
      const xa = 170 + 46 * Math.sin(y / 38), xb = 170 + 46 * Math.sin(y / 38 + Math.PI);
      if (Math.abs(xa - xb) < 18) continue;
      s += '<path d="M' + f2(xa) + ' ' + y + ' H' + f2(xb) + '" stroke="' + fill(((y / 18) | 0) % 2 ? RED : BLUE, 0.8) + '" stroke-width="2.2"/>';
    }
    s += '<path d="M' + a.join(' L') + '" stroke-width="2.6"/><path d="M' + b.join(' L') + '" stroke-width="2.6"/>';

    /* Bohr model of sodium: 2, 8, 1 */
    const bx = 720, by = 180;
    s += '<circle cx="' + bx + '" cy="' + by + '" r="14" fill="' + fill(GOLD, 0.7) + '" stroke="none"/>';
    [[42, 2], [74, 8], [106, 1]].forEach(([r, n], k) => {
      s += '<circle cx="' + bx + '" cy="' + by + '" r="' + r + '" stroke-width="1.4"/>';
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2 + k * 0.5;
        s += '<circle cx="' + f2(bx + r * Math.cos(t)) + '" cy="' + f2(by + r * Math.sin(t)) + '" r="5" fill="' + fill(RED, 0.9) + '" stroke="none"/>';
      }
    });
    s += hand(830, 318, 'Na — 2, 8, 1', 30, -3);

    /* a pendulum */
    const px = 430, py = 480, L = 190, th = 0.44;
    const ex = f2(px + L * Math.sin(th)), ey = f2(py + L * Math.cos(th));
    s += '<path d="M370 ' + py + ' H490" stroke-width="2.4"/>' +
      '<path d="M380 ' + py + ' l-10 -12 M400 ' + py + ' l-10 -12 M420 ' + py + ' l-10 -12 M440 ' + py + ' l-10 -12 M460 ' + py + ' l-10 -12 M480 ' + py + ' l-10 -12" stroke-width="1.2"/>' +
      '<path d="M' + px + ' ' + py + ' V' + (py + L) + '" stroke-dasharray="5 6" stroke-width="1.2"/>' +
      '<path d="M' + px + ' ' + py + ' L' + ex + ' ' + ey + '" stroke-width="1.8"/>' +
      '<path d="M' + f2(px - L * Math.sin(th)) + ' ' + ey + ' A' + L + ' ' + L + ' 0 0 0 ' + ex + ' ' + ey + '" stroke-dasharray="4 7" stroke="' + fill(RED, 0.9) + '"/>' +
      '<circle cx="' + ex + '" cy="' + ey + '" r="17" fill="' + fill(BLUE, 0.35) + '"/>' +
      '<path d="M' + px + ' ' + (py + 60) + ' A60 60 0 0 0 ' + f2(px + 60 * Math.sin(th)) + ' ' + f2(py + 60 * Math.cos(th)) + '" stroke-width="1.2"/>';
    s += hand(px + 12, py + 92, 'θ', 24, 0);
    s += hand(296, 744, 'T = 2π √(l/g)', 32, -3);

    /* Pythagoras: squares on all three sides */
    s += '<path d="M760 700 H880 V820 H760 Z" fill="' + fill(BLUE, 0.16) + '"/>' +
      '<path d="M760 610 V700 H670 V610 Z" fill="' + fill(RED, 0.16) + '"/>' +
      '<path d="M880 700 L760 610 L850 490 L970 580 Z" fill="' + fill(GOLD, 0.2) + '"/>' +
      '<path d="M760 610 L760 700 L880 700 Z" stroke-width="2.4"/><path d="M760 688 h12 v12" stroke-width="1.2"/>';
    s += hand(700, 884, 'a^2 + b^2 = c^2', 34, -3);

    /* a block on an incline, with its forces */
    const ux = 0.872, uy = 0.49, cx = 262, cy = 892;
    s += '<path d="M100 1000 H420 L100 820 Z" fill="' + fill(GOLD, 0.1) + '" stroke-width="2"/>' +
      '<path d="M372 1000 A48 48 0 0 1 378 976" stroke-width="1.3"/>' +
      '<g transform="translate(' + cx + ' ' + cy + ') rotate(29.4)"><rect x="-34" y="-46" width="68" height="46" fill="' + fill(BLUE, 0.2) + '"/></g>';
    const bcx = f2(cx + 23 * uy), bcy = f2(cy - 23 * ux);
    const arrowTo = (x2, y2, color) => {
      const ang = Math.atan2(y2 - bcy, x2 - bcx);
      return '<path d="M' + bcx + ' ' + bcy + ' L' + f2(x2) + ' ' + f2(y2) + ' M' + f2(x2 - 12 * Math.cos(ang - 0.45)) + ' ' + f2(y2 - 12 * Math.sin(ang - 0.45)) +
        ' L' + f2(x2) + ' ' + f2(y2) + ' L' + f2(x2 - 12 * Math.cos(ang + 0.45)) + ' ' + f2(y2 - 12 * Math.sin(ang + 0.45)) + '" stroke="' + color + '" stroke-width="2.2"/>';
    };
    s += arrowTo(bcx, bcy + 96, fill(RED, 0.95)) + arrowTo(bcx + 84 * uy, bcy - 84 * ux, INK) + arrowTo(bcx - 80 * ux, bcy - 80 * uy, fill(BLUE, 1));
    s += hand(bcx + 8, bcy + 110, 'mg', 24, 0) + hand(bcx + 48, bcy - 84, 'N', 24, 0) + hand(bcx - 100, bcy - 52, 'f', 24, 0);
    s += hand(352, 994, 'θ', 22, 0);

    /* the reaction that makes water */
    s += hand(520, 1020, '2H_2 + O_2 → 2H_2O', 38, -2);

    /* a spring and a mass */
    let z = 'M740 1110 H760';
    for (let i = 0; i < 9; i++) z += ' L' + (768 + i * 14) + ' ' + (i % 2 ? 1124 : 1096);
    z += ' L896 1110 H904';
    s += '<path d="M740 1060 V1160" stroke-width="2.6"/>' +
      '<path d="M740 1070 l-12 10 M740 1090 l-12 10 M740 1110 l-12 10 M740 1130 l-12 10 M740 1150 l-12 10" stroke-width="1.2"/>' +
      '<path d="' + z + '" stroke-width="2"/><rect x="904" y="1084" width="62" height="52" fill="' + fill(RED, 0.2) + '"/>' +
      '<path d="M740 1136 H1000" stroke-width="1.4"/>';
    s += hand(800, 1210, 'F = −kx', 32, -3);

    /* a water molecule, bond angle and all */
    const O = [200, 1130], h = 62, ha = (52.25 * Math.PI) / 180;
    const H1 = [f2(O[0] - h * Math.sin(ha)), f2(O[1] + h * Math.cos(ha))], H2 = [f2(O[0] + h * Math.sin(ha)), H1[1]];
    s += '<path d="M' + O.join(' ') + ' L' + H1.join(' ') + ' M' + O.join(' ') + ' L' + H2.join(' ') + '" stroke-width="3"/>' +
      '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="24" fill="' + fill(RED, 0.4) + '"/>' +
      '<circle cx="' + H1[0] + '" cy="' + H1[1] + '" r="14" fill="' + fill(BLUE, 0.35) + '"/>' +
      '<circle cx="' + H2[0] + '" cy="' + H2[1] + '" r="14" fill="' + fill(BLUE, 0.35) + '"/>' +
      '<path d="M' + f2(O[0] - 34 * Math.sin(ha)) + ' ' + f2(O[1] + 34 * Math.cos(ha)) + ' A34 34 0 0 0 ' + f2(O[0] + 34 * Math.sin(ha)) + ' ' + f2(O[1] + 34 * Math.cos(ha)) + '" stroke-width="1.3"/>';
    s += hand(176, 1236, '104.5°', 26, 0);
    return s;
  }

  function near() {
    const R = rng(29);
    const marks = ['Δ', 'α', 'β', 'γ', 'Ω', '∞', '≈', '±', '√', '∂', 'θ', 'λ', 'μ', 'φ', '∑', '÷', '×', '∴', 'ε', '∠', '≠', 'ħ', '°C', '%'];
    let s = '', k = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) {
      const x = f2(c * 140 + 24 + R() * 92), y = f2(r * 126 + 36 + R() * 80), rot = f2((R() - 0.5) * 30);
      const pick = R();
      if (pick < 0.22) s += star4(x, y, f2(5 + R() * 6), fill(GOLD, 0.95));
      else if (pick < 0.3) s += '<path d="M' + (x - 6) + ' ' + y + ' h12 M' + x + ' ' + (y - 6) + ' v12" stroke-width="1.6"/>';
      else s += '<text x="' + x + '" y="' + y + '" font-family="Georgia, \'Times New Roman\', serif" font-style="italic" font-size="' + f2(18 + R() * 16) +
        '" fill="' + INK + '" stroke="none" transform="rotate(' + rot + ' ' + x + ' ' + y + ')">' + marks[k++ % marks.length] + '</text>';
    }
    return s;
  }

  const SKY = { far: [far, 1400, 1600], mid: [mid, 1100, 1300], near: [near, 700, 760] };
  const skyLayers = [];
  document.querySelectorAll('.sky-layer').forEach(el => {
    const [draw, w, h] = SKY[el.dataset.depth];
    const id = 'sky-' + el.dataset.depth;
    el.style.setProperty('--tile', h + 'px');
    el.innerHTML = '<svg width="100%" height="100%" aria-hidden="true" focusable="false"><defs><pattern id="' + id +
      '" width="' + w + '" height="' + h + '" patternUnits="userSpaceOnUse"><g fill="none" stroke="' + INK +
      '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + draw() + '</g></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
    skyLayers.push({ el, speed: +el.dataset.speed, tile: h, sway: +el.dataset.sway });
  });
  if (!skyLayers.length) return;

  /* depth: each layer drifts at its own fraction of the scroll, and on a
     desktop leans a few pixels toward the pointer — the farther, the less */
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
  function frame() {
    raf = 0;
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    const y = still ? 0 : scrollY;
    for (const l of skyLayers) {
      const off = (y * l.speed) % l.tile;
      l.el.style.transform = 'translate3d(' + f2(mx * l.sway) + 'px,' + f2(-off + my * l.sway) + 'px,0)';
    }
    if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  if (!still) {
    addEventListener('scroll', kick, { passive: true });
    if (matchMedia('(pointer: fine)').matches) {
      addEventListener('pointermove', e => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; kick(); }, { passive: true });
    }
  }
  frame();
  requestAnimationFrame(() => document.querySelector('.sky').classList.add('on'));
})();
