/* =====================================================================
   The notebook's spreads, drawn from data.js.
   Every spread is painted onto a 1760 x 1240 canvas with exactly the
   geometry the sketchbook engine expects: paper from 5.1% to 94.9% across,
   21.8% to 78.2% down, the gutter at the middle.  The page curl, the
   gutter shadow and the magnifier all assume those numbers, so the
   layout below never draws outside them.
   ===================================================================== */
(function () {
  const W = 1760, H = 1240;
  const X0 = 90, X1 = 1670, Y0 = 270, Y1 = 970, G = 880, R = 34;
  const L = { x: X0, w: G - X0 };          /* left page  */
  const Rp = { x: G, w: X1 - G };          /* right page */

  const C = {
    ink: '#1f2a44', soft: 'rgba(31,42,68,.88)', pencil: '#5b5446',
    red: '#b3362b', gold: '#c08a2c', rule: 'rgba(78,112,160,.17)', margin: 'rgba(190,64,52,.26)'
  };
  const HAND = '"Caveat", "Segoe Print", cursive';
  const SERIF = '"Instrument Serif", Georgia, serif';

  function rng(seed) {
    let s = (seed * 2654435761) >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function canvas() { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }

  /* ---------------------------------------------------------- the paper */
  function bookPath(x, x0, y0, x1, y1, r) {
    x.beginPath();
    x.moveTo(G, y0); x.lineTo(x1 - r, y0); x.quadraticCurveTo(x1, y0, x1, y0 + r);
    x.lineTo(x1, y1 - r); x.quadraticCurveTo(x1, y1, x1 - r, y1);
    x.lineTo(x0 + r, y1); x.quadraticCurveTo(x0, y1, x0, y1 - r);
    x.lineTo(x0, y0 + r); x.quadraticCurveTo(x0, y0, x0 + r, y0);
    x.closePath();
  }

  let base = null;
  function paper() {
    if (base) return base;
    const c = canvas(), x = c.getContext('2d');
    /* the page block underneath, so the book has a little thickness */
    x.save(); x.translate(0, 8); bookPath(x, X0 + 5, Y0, X1 - 5, Y1, R); x.fillStyle = '#d6ccb6'; x.fill(); x.restore();
    x.save(); x.translate(0, 4); bookPath(x, X0 + 2, Y0, X1 - 2, Y1, R); x.fillStyle = '#e8e0ce'; x.fill(); x.restore();
    bookPath(x, X0, Y0, X1, Y1, R); x.fillStyle = '#f5f0e5'; x.fill();

    /* cold-press grain */
    const r = rng(7), id = x.getImageData(X0, Y0, X1 - X0, Y1 - Y0), d = id.data, w = X1 - X0;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const p = i / 4, px = p % w, py = (p / w) | 0;
      const n = (r() - 0.5) * 11 + Math.sin(px * 0.021 + Math.sin(py * 0.013) * 3) * 1.6;
      d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9;
    }
    x.putImageData(id, X0, Y0);

    x.save(); bookPath(x, X0, Y0, X1, Y1, R); x.clip();
    /* the gutter falls away into shadow */
    let g = x.createLinearGradient(G - 170, 0, G + 170, 0);
    g.addColorStop(0, 'rgba(92,70,38,0)'); g.addColorStop(0.36, 'rgba(92,70,38,.06)');
    g.addColorStop(0.47, 'rgba(80,60,30,.20)'); g.addColorStop(0.5, 'rgba(70,52,26,.34)');
    g.addColorStop(0.53, 'rgba(80,60,30,.20)'); g.addColorStop(0.64, 'rgba(92,70,38,.06)');
    g.addColorStop(1, 'rgba(92,70,38,0)');
    x.fillStyle = g; x.fillRect(G - 170, Y0, 340, Y1 - Y0);
    /* pages curve up toward their outer edges and catch less light there */
    for (const [a, b] of [[X0, X0 + 70], [X1, X1 - 70]]) {
      g = x.createLinearGradient(a, 0, b, 0);
      g.addColorStop(0, 'rgba(110,86,50,.10)'); g.addColorStop(1, 'rgba(110,86,50,0)');
      x.fillStyle = g; x.fillRect(Math.min(a, b), Y0, 70, Y1 - Y0);
    }
    g = x.createLinearGradient(0, Y0, 0, Y0 + 40);
    g.addColorStop(0, 'rgba(110,86,50,.07)'); g.addColorStop(1, 'rgba(110,86,50,0)');
    x.fillStyle = g; x.fillRect(X0, Y0, X1 - X0, 40);
    x.restore();

    x.strokeStyle = 'rgba(70,52,28,.32)'; x.lineWidth = 1.4;
    x.beginPath(); x.moveTo(G, Y0 + 3); x.lineTo(G, Y1 - 3); x.stroke();
    base = c; return c;
  }

  function ruled(x, page) {
    x.save();
    x.strokeStyle = C.rule; x.lineWidth = 1.3;
    for (let y = Y0 + 112; y < Y1 - 30; y += 40) {
      x.beginPath(); x.moveTo(page.x + 26, y); x.lineTo(page.x + page.w - 26, y); x.stroke();
    }
    x.strokeStyle = C.margin; x.lineWidth = 1.6;
    const mx = page.x + (page === L ? 74 : 72);
    x.beginPath(); x.moveTo(mx, Y0 + 20); x.lineTo(mx, Y1 - 20); x.stroke();
    x.restore();
  }

  /* ------------------------------------------------------ pen and ink */
  function text(x, s, px, py, o) {
    o = o || {};
    x.save();
    x.translate(px, py);
    if (o.rot) x.rotate(o.rot);
    x.font = (o.weight || 400) + ' ' + (o.size || 36) + 'px ' + (o.font || HAND);
    x.fillStyle = o.color || C.ink;
    x.globalAlpha = o.alpha == null ? 1 : o.alpha;
    x.textAlign = o.align || 'left';
    x.textBaseline = 'alphabetic';
    /* a little pen pressure: the regular-weight hand and the slender serif
       get a thin stroke of their own ink so they read firmly at phone size */
    const size = o.size || 36, font = o.font || HAND;
    const press = font === HAND ? ((o.weight || 400) >= 700 ? 0 : size * 0.03) : font === SERIF ? size * 0.014 : 0;
    if (press) { x.strokeStyle = x.fillStyle; x.lineWidth = press; x.lineJoin = 'round'; x.strokeText(s, 0, 0); }
    x.fillText(s, 0, 0);
    const m = x.measureText(s).width;
    x.restore();
    return m;
  }
  function measure(x, s, size, font, weight) {
    x.save(); x.font = (weight || 400) + ' ' + size + 'px ' + (font || HAND);
    const m = x.measureText(s).width; x.restore(); return m;
  }
  function wrap(x, s, maxW, size, font, weight) {
    const words = s.split(' '), lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (line && measure(x, t, size, font, weight) > maxW) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }
  function para(x, s, px, py, maxW, lh, o) {
    const lines = wrap(x, s, maxW, o.size, o.font, o.weight);
    lines.forEach((ln, i) => text(x, ln, px, py + i * lh, o));
    return lines.length;
  }
  function stroke(x, color, width, alpha) {
    x.strokeStyle = color; x.lineWidth = width; x.globalAlpha = alpha == null ? 1 : alpha;
    x.lineCap = 'round'; x.lineJoin = 'round';
  }
  /* a red-pen ring, drawn the way a hand draws one: a little more than a
     full turn, never quite closing on itself */
  function ring(x, cx, cy, rx, ry, seed, color) {
    const r = rng(seed);
    x.save(); stroke(x, color || C.red, 3.4, 0.9);
    x.beginPath();
    const a0 = -2.2 + r() * 0.4, turns = Math.PI * 2 * 1.12;
    for (let i = 0; i <= 64; i++) {
      const t = i / 64, a = a0 + t * turns;
      const k = 1 + Math.sin(t * 9 + r() * 0.3) * 0.025 + (t - 0.5) * 0.05;
      const px = cx + Math.cos(a) * rx * k, py = cy + Math.sin(a) * ry * k;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    x.stroke(); x.restore();
  }
  function tick(x, px, py, s, color) {
    x.save(); stroke(x, color || C.red, 3.6, 0.92);
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + s * 0.25, py + s * 0.35, px + s * 0.38, py + s * 0.5);
    x.quadraticCurveTo(px + s * 0.6, py - s * 0.2, px + s * 1.05, py - s * 0.62);
    x.stroke(); x.restore();
  }
  function squiggle(x, px, py, w, color, seed) {
    const r = rng(seed || 3);
    x.save(); stroke(x, color || C.red, 2.8, 0.85);
    x.beginPath(); x.moveTo(px, py);
    for (let i = 1; i <= 24; i++) x.lineTo(px + (w * i) / 24, py + Math.sin(i * 1.25) * 3.2 + (r() - 0.5) * 1.2);
    x.stroke(); x.restore();
  }
  function underline(x, px, py, w, color, width) {
    x.save(); stroke(x, color || C.ink, width || 2.4, 0.8);
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + w * 0.5, py + 3, px + w, py - 2); x.stroke(); x.restore();
  }
  function strike(x, px, py, w) {
    x.save(); stroke(x, C.red, 3.2, 0.85);
    x.beginPath(); x.moveTo(px - 6, py + 4); x.lineTo(px + w + 6, py - 6); x.stroke(); x.restore();
  }
  function star(x, cx, cy, s, color) {
    x.save(); x.fillStyle = color || C.gold; x.globalAlpha = 0.95;
    x.beginPath(); x.moveTo(cx, cy - s);
    x.quadraticCurveTo(cx + s * 0.16, cy - s * 0.16, cx + s, cy);
    x.quadraticCurveTo(cx + s * 0.16, cy + s * 0.16, cx, cy + s);
    x.quadraticCurveTo(cx - s * 0.16, cy + s * 0.16, cx - s, cy);
    x.quadraticCurveTo(cx - s * 0.16, cy - s * 0.16, cx, cy - s);
    x.fill(); x.restore();
  }
  function arrow(x, x0, y0, x1, y1, color) {
    x.save(); stroke(x, color || C.red, 3, 0.85);
    const mx = (x0 + x1) / 2 + (y1 - y0) * 0.25, my = (y0 + y1) / 2 - (x1 - x0) * 0.25;
    x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo(mx, my, x1, y1); x.stroke();
    const a = Math.atan2(y1 - my, x1 - mx);
    x.beginPath();
    x.moveTo(x1 - Math.cos(a - 0.5) * 18, y1 - Math.sin(a - 0.5) * 18); x.lineTo(x1, y1);
    x.lineTo(x1 - Math.cos(a + 0.5) * 18, y1 - Math.sin(a + 0.5) * 18);
    x.stroke(); x.restore();
  }
  /* a watercolour wash: many faint overlapping blots, darker where they pool */
  function wash(x, cx, cy, rad, rgb, seed, strength) {
    const r = rng(seed), k = strength || 1;
    x.save(); x.globalCompositeOperation = 'multiply';
    for (let i = 0; i < 30; i++) {
      const a = r() * Math.PI * 2, d = r() * rad * 0.42;
      const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.9, rr = rad * (0.45 + r() * 0.5);
      const g = x.createRadialGradient(px, py, rr * 0.2, px, py, rr);
      g.addColorStop(0, 'rgba(' + rgb + ',' + 0.07 * k + ')');
      g.addColorStop(0.82, 'rgba(' + rgb + ',' + 0.05 * k + ')');
      g.addColorStop(0.95, 'rgba(' + rgb + ',' + 0.09 * k + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g; x.beginPath(); x.arc(px, py, rr, 0, Math.PI * 2); x.fill();
    }
    x.restore();
  }
  function date(x, s, px, py) {
    x.save(); x.font = '600 22px "Newsreader", Georgia, serif'; x.fillStyle = 'rgba(52,44,32,.88)';
    x.textAlign = 'right'; x.letterSpacing = '3px'; x.fillText(s.toUpperCase(), px, py); x.restore();
  }
  function stamp(x, logo, px, py, s) {
    if (!logo) return;
    x.save(); x.globalAlpha = 0.55; x.translate(px, py); x.rotate(-0.08);
    x.drawImage(logo, -s / 2, -s / 2, s, s); x.restore();
  }

  /* ---------------------------------------------------------- photographs */
  function polaroid(x, cx, cy, w, h, rot, opt) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    if (opt.empty) {
      x.save(); stroke(x, C.pencil, 2.4, 0.7); x.setLineDash([12, 10]);
      x.strokeRect(-w / 2, -h / 2, w, h); x.restore();
      text(x, opt.label || 'your photo here', 0, 8, { size: 34, color: C.pencil, align: 'center', alpha: 0.85 });
      x.restore(); return;
    }
    x.shadowColor = 'rgba(60,44,22,.28)'; x.shadowBlur = 22; x.shadowOffsetY = 9;
    x.fillStyle = '#fcf9f2'; x.fillRect(-w / 2, -h / 2, w, h);
    x.shadowColor = 'transparent';
    const pad = 18, pw = w - pad * 2, ph = h - pad - 74;
    const px = -w / 2 + pad, py = -h / 2 + pad;
    x.save(); x.beginPath(); x.rect(px, py, pw, ph); x.clip();
    if (opt.photo) {
      const im = opt.photo, s = Math.max(pw / im.width, ph / im.height);
      x.filter = 'sepia(.28) saturate(.82) contrast(1.04)';
      x.drawImage(im, px + (pw - im.width * s) / 2, py + (ph - im.height * s) / 2.6, im.width * s, im.height * s);
      x.filter = 'none';
    } else {
      x.fillStyle = '#efe8d9'; x.fillRect(px, py, pw, ph);
      wash(x, 0, py + ph * 0.5, pw * 0.62, opt.tint.join(','), opt.seed, 0.85);
      x.font = '400 ' + Math.round(pw * 0.46) + 'px ' + SERIF; x.fillStyle = 'rgba(31,42,68,.9)';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(opt.initials, 0, py + ph * 0.52);
    }
    x.restore();
    x.strokeStyle = 'rgba(60,44,22,.12)'; x.lineWidth = 1; x.strokeRect(px, py, pw, ph);
    if (opt.caption) text(x, opt.caption, 0, h / 2 - 26, { size: 32, align: 'center', color: C.soft, rot: -0.01 });
    /* a strip of tape holding it in */
    x.save(); x.translate(0, -h / 2 + 2); x.rotate(0.06);
    x.fillStyle = 'rgba(226,212,170,.62)'; x.fillRect(-58, -18, 116, 36);
    x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(-58, -18, 116, 8);
    x.restore();
    x.restore();
  }

  function initials(name) {
    return name.replace(/^(Md\.|Dr\.)\s*/, '').split(/\s+/).map(w => w[0]).slice(0, 2).join('');
  }

  /* ------------------------------------------------------------ spreads */
  function cover(x, D, A) {
    ruled(x, Rp);
    const cx = L.x + L.w / 2;
    if (A.logo) x.drawImage(A.logo, cx - 120, Y0 + 40, 240, 240);
    text(x, D.name, cx, Y0 + 350, { font: SERIF, size: 60, align: 'center' });
    text(x, 'Class 11 & 12 coaching · ' + D.city, cx, Y0 + 400, { size: 34, align: 'center', color: C.pencil });
    const t = 'Results Diary · ' + D.resultYear;
    text(x, t, cx, Y0 + 490, { size: 54, weight: 700, align: 'center', color: C.red, rot: -0.02 });
    squiggle(x, cx - measure(x, t, 54, HAND, 700) / 2, Y0 + 512, measure(x, t, 54, HAND, 700), C.red, 5);
    text(x, 'since ' + D.since, cx, Y0 + 600, { size: 30, align: 'center', color: C.pencil, alpha: 0.85 });

    const lx = Rp.x + 104;
    text(x, D.resultYear + ', in numbers', lx, Y0 + 92, { font: SERIF, size: 50 });
    D.stats.forEach((s, i) => {
      const y = Y0 + 200 + i * 128;
      const v = text(x, s.value, lx, y, { size: 78, weight: 700, color: i === 0 ? C.red : C.ink, rot: -0.015 });
      if (i === 0) ring(x, lx + v / 2, y - 26, v / 2 + 30, 50, 11);
      para(x, s.label, lx + 190, y - 30, 440, 40, { size: 35, color: C.soft });
    });
    star(x, X1 - 90, Y0 + 70, 18);
    date(x, 'Chas · ' + D.resultYear, X1 - 48, Y1 - 34);
  }

  /* a letter from the founder, with his photograph taped in */
  function founderNote(x, D, A) {
    const F = D.founder;
    ruled(x, Rp);
    text(x, 'From the founder\'s desk', L.x + 74, Y0 + 66, { size: 32, color: C.pencil });
    polaroid(x, L.x + 228, Y0 + 368, 300, 368, -0.05, {
      photo: A.founder, initials: initials(F.name), tint: [96, 120, 168], seed: 77, caption: F.name
    });
    const nx = L.x + 418;
    text(x, F.name.split(' ')[0], nx, Y0 + 262, { font: SERIF, size: 66 });
    text(x, F.name.split(' ').slice(1).join(' '), nx, Y0 + 324, { font: SERIF, size: 66 });
    text(x, F.role, nx, Y0 + 380, { size: 34, color: C.soft });
    text(x, 'teaching since ' + F.since, nx, Y0 + 422, { size: 32, color: C.pencil });
    arrow(x, nx + 120, Y0 + 520, L.x + 392, Y0 + 452);
    text(x, 'the man behind', nx + 64, Y0 + 556, { size: 34, weight: 700, color: C.red, rot: -0.03 });
    text(x, 'the results', nx + 84, Y0 + 594, { size: 34, weight: 700, color: C.red, rot: -0.03 });
    star(x, G - 64, Y0 + 210, 16);

    const rx = Rp.x + 100;
    text(x, 'Dear student,', rx, Y0 + 80, { size: 46, weight: 700 });
    const n = para(x, F.letter, rx, Y0 + 150, 530, 48, { size: 38, color: C.soft });
    const sy = Y0 + 150 + n * 48 + 34;
    const sw = text(x, '— ' + F.name, rx + 230, sy, { size: 46, weight: 700, color: C.red, rot: -0.04 });
    squiggle(x, rx + 230, sy + 16, sw, C.red, 9);
    const eq = F.equation;
    text(x, eq, rx, Y1 - 78, { size: 36, weight: 700, rot: -0.01 });
    underline(x, rx, Y1 - 62, measure(x, eq, 36, HAND, 700), C.ink, 2);
    date(x, 'CHAS · ' + D.resultYear, X1 - 48, Y1 - 30);
  }

  /* One topper to a page: their photograph, who they are, and their marks
     with the total and percentage, so that on a phone, which shows one
     page at a time, each screen is one student. */
  function session(y) { return (y - 1) + '–' + String(y).slice(2); }
  function studentPage(x, page, t, n, A) {
    ruled(x, page);
    const cl = page.x + 100, cr = page.x + page.w - 56;
    text(x, 'Toppers · ' + t.year, cl, Y0 + 62, { size: 28, color: C.pencil });
    text(x, 'No. ' + String(n).padStart(2, '0'), cr, Y0 + 62, { size: 28, color: C.pencil, align: 'right' });

    polaroid(x, cl + 112, Y0 + 246, 224, 274, n % 2 ? -0.045 : 0.04, {
      photo: A.photos[t.name], initials: initials(t.name), tint: t.tint, seed: n * 13, caption: t.name.split(' ')[0]
    });

    /* who they are */
    /* the details start level with the photo's middle, leaving the page's
       top corner free for the magnifier to rest on */
    const ni = cl + 262, nw = cr - ni;
    let y = Y0 + 200;
    wrap(x, t.name, nw, 52, SERIF).forEach(ln => { text(x, ln, ni, y, { font: SERIF, size: 52 }); y += 50; });
    y += 2;
    text(x, t.stream, ni, y, { size: 29, color: C.soft }); y += 38;
    text(x, t.board + ' · Session ' + session(t.year), ni, y, { size: 29, color: C.soft }); y += 38;
    y += para(x, t.school, ni, y, nw, 33, { size: 26, color: C.pencil }) * 33 + 16;
    const hl = wrap(x, t.highlight, nw, 33, HAND, 700);
    hl.forEach(ln => { text(x, ln, ni, y, { size: 33, weight: 700, color: C.red, rot: -0.02 }); y += 37; });
    squiggle(x, ni, y - 24, Math.min(nw, measure(x, hl[hl.length - 1], 33, HAND, 700)), C.red, n);

    /* their marks, in two columns */
    const my = Math.max(Y0 + 432, y + 28), colW = (cr - cl) / 2, rows = Math.ceil(t.marks.length / 2);
    let total = 0;
    t.marks.forEach(([sub, m], i) => {
      total += m;
      const c = i < rows ? 0 : 1, r = i < rows ? i : i - rows;
      const sx = cl + c * colW, sy = my + r * 48, end = sx + colW - (c ? 40 : 52);
      text(x, sub, sx, sy, { size: 29 });
      x.save(); x.fillStyle = 'rgba(31,42,68,.3)';
      for (let d = sx + measure(x, sub, 29) + 10; d < end - 48; d += 12) x.fillRect(d, sy - 5, 2.5, 2.5);
      x.restore();
      text(x, String(m), end, sy, { size: 34, weight: 700, align: 'right' });
      tick(x, end + 10, sy - 11, 22);
    });

    /* the total, and the percentage ringed in red pen */
    const by = Y1 - 52;
    x.save(); stroke(x, C.ink, 1.6, 0.45); x.beginPath(); x.moveTo(cl, by - 50); x.lineTo(cr - 240, by - 50); x.stroke(); x.restore();
    text(x, 'Total ' + total + ' / ' + t.marks.length * 100, cl, by, { size: 34, weight: 700 });
    const pct = (total / t.marks.length).toFixed(1) + '%';
    const pw = text(x, pct, cr - 112, by + 4, { size: 76, weight: 700, color: C.red, align: 'center', rot: -0.04 });
    ring(x, cr - 112, by - 22, pw / 2 + 28, 52, n * 7);
  }

  /* the spare page beside an odd last topper */
  function nextYearPage(x, page, D) {
    ruled(x, page);
    const cl = page.x + 100;
    text(x, 'Toppers · ' + (D.resultYear + 1), cl, Y0 + 62, { size: 28, color: C.pencil });
    polaroid(x, cl + 112, Y0 + 246, 224, 274, 0.04, { empty: true });
    text(x, 'Your name', cl + 262, Y0 + 200, { font: SERIF, size: 52 });
    text(x, 'could be here.', cl + 262, Y0 + 252, { font: SERIF, size: 52 });
    text(x, 'Admissions open · Session ' + D.session, cl, Y1 - 60, { size: 32, weight: 700, color: C.red, rot: -0.02 });
  }

  function topperSpread(x, D, A, pair, n0) {
    studentPage(x, L, pair[0], n0, A);
    if (pair[1]) studentPage(x, Rp, pair[1], n0 + 1, A);
    else nextYearPage(x, Rp, D);
  }

  function chart(x, D) {
    ruled(x, Rp);
    const lx = L.x + 110;
    text(x, 'Five years of results', lx, Y0 + 96, { font: SERIF, size: 54 });
    text(x, 'students scoring 90% and above in Class 12 boards', lx, Y0 + 144, { size: 32, color: C.pencil });
    const H0 = D.history, max = Math.max(...H0.map(h => h.above90));
    const baseY = Y1 - 92, top = Y0 + 230, bw = 76, gap = (L.w - 220 - bw * H0.length) / (H0.length - 1);
    x.save(); stroke(x, C.ink, 2.2, 0.75); x.beginPath(); x.moveTo(lx - 20, baseY); x.lineTo(G - 70, baseY + 3); x.stroke(); x.restore();
    H0.forEach((h, i) => {
      const bx = lx + i * (bw + gap), bh = (h.above90 / max) * (baseY - top - 50), by = baseY - bh;
      const last = i === H0.length - 1;
      x.save(); x.beginPath(); x.rect(bx, by, bw, bh); x.clip();
      x.fillStyle = last ? 'rgba(179,54,43,.16)' : 'rgba(78,104,150,.14)'; x.fillRect(bx, by, bw, bh);
      stroke(x, last ? C.red : C.ink, 1.6, 0.45);
      for (let d = -bh; d < bw + bh; d += 12) { x.beginPath(); x.moveTo(bx + d, by + bh); x.lineTo(bx + d + bh, by); x.stroke(); }
      x.restore();
      x.save(); stroke(x, last ? C.red : C.ink, 2.4, 0.85); x.strokeRect(bx, by, bw, bh); x.restore();
      text(x, String(h.above90), bx + bw / 2, by - 16, { size: 44, weight: 700, align: 'center', color: last ? C.red : C.ink });
      text(x, String(h.year), bx + bw / 2, baseY + 44, { size: 32, align: 'center', color: C.pencil });
      if (last) arrow(x, bx - 70, by - 90, bx - 8, by - 34);
    });

    const rx = Rp.x + 100;
    text(x, 'Best score, each year', rx, Y0 + 92, { font: SERIF, size: 48 });
    H0.slice().reverse().forEach((h, i) => {
      const y = Y0 + 176 + i * 70;
      text(x, String(h.year), rx, y, { size: 38, color: C.pencil });
      const bw2 = text(x, h.best, rx + 110, y, { size: 44, weight: 700, color: i === 0 ? C.red : C.ink });
      text(x, h.by, rx + 130 + bw2, y, { size: 36, color: C.soft });
      if (i === 0) ring(x, rx + 110 + bw2 / 2, y - 14, bw2 / 2 + 22, 34, 23);
    });
    text(x, '100% pass — every single year.', rx, Y1 - 92, { size: 40, weight: 700, color: C.red, rot: -0.02 });
    tick(x, rx + measure(x, '100% pass — every single year.', 40, HAND, 700) + 14, Y1 - 104, 34);
    date(x, 'APR ' + D.resultYear, X1 - 48, Y1 - 34);
  }

  function fees(x, D) {
    ruled(x, Rp);
    const lx = L.x + 110;
    text(x, 'What a year of', lx, Y0 + 94, { font: SERIF, size: 54 });
    text(x, 'coaching costs', lx, Y0 + 148, { font: SERIF, size: 54 });
    D.feeCompare.forEach(([a, b], i) => {
      const y = Y0 + 236 + i * 92;
      text(x, a, lx, y, { size: 36, color: C.pencil });
      const w = text(x, b, lx, y + 42, { size: 42, color: C.soft });
      strike(x, lx, y + 30, w);
    });
    const y = Y0 + 448;
    text(x, 'At ' + D.short + ':', lx, y, { size: 42, weight: 700 });
    const ow = text(x, D.feeOurs, lx + 10, y + 104, { size: 84, weight: 700, color: C.red, rot: -0.03 });
    ring(x, lx + 10 + ow / 2, y + 76, ow / 2 + 36, 56, 31);
    para(x, D.feeOursNote, lx, Y1 - 64, 560, 36, { size: 30, color: C.pencil });

    const rx = Rp.x + 100;
    text(x, 'And that includes —', rx, Y0 + 92, { font: SERIF, size: 50 });
    D.included.forEach((s, i) => {
      const yy = Y0 + 176 + i * 74;
      tick(x, rx, yy - 12, 30);
      text(x, s, rx + 52, yy, { size: 40 });
    });
    text(x, 'Same quality. A fraction of the fee.', rx, Y1 - 60, { size: 38, weight: 700, color: C.red, rot: -0.015 });
    date(x, 'Session ' + D.session, X1 - 48, Y0 + 64);
  }

  function join(x, D, A) {
    ruled(x, Rp);
    text(x, 'Toppers · ' + (D.resultYear + 1), L.x + 74, Y0 + 66, { size: 32, color: C.pencil });
    polaroid(x, L.x + 228, Y0 + 368, 300, 368, 0.04, { empty: true });
    const nx = L.x + 418;
    text(x, 'Your name', nx, Y0 + 268, { font: SERIF, size: 62 });
    text(x, 'could be here.', nx, Y0 + 328, { font: SERIF, size: 62 });
    text(x, 'Class 12 · ' + (D.resultYear + 1), nx, Y0 + 386, { size: 33, color: C.soft });
    arrow(x, nx + 40, Y0 + 470, L.x + 400, Y0 + 400);
    text(x, 'next year\'s notebook', nx + 70, Y0 + 500, { size: 34, weight: 700, color: C.red, rot: -0.03 });

    const rx = Rp.x + 100;
    text(x, 'Admissions open', rx, Y0 + 92, { font: SERIF, size: 54 });
    text(x, 'Session ' + D.session + ' · Class 11 & 12', rx, Y0 + 140, { size: 34, color: C.red, weight: 700 });
    D.batches.forEach(([a, b], i) => {
      const y = Y0 + 222 + i * 60;
      text(x, a, rx, y, { size: 38 });
      text(x, b, X1 - 70, y, { size: 36, align: 'right', color: C.soft });
    });
    const y = Y0 + 450;
    text(x, 'Visit us', rx, y, { size: 38, weight: 700 });
    text(x, D.address.line1 + ',', rx, y + 46, { size: 34, color: C.soft });
    text(x, D.address.line2 + ' ' + D.address.pin, rx, y + 88, { size: 34, color: C.soft });
    const pw = text(x, 'Call ' + D.phone, rx, Y1 - 52, { size: 44, weight: 700, color: C.red, rot: -0.02 });
    underline(x, rx, Y1 - 38, pw, C.red, 2.4);
    stamp(x, A.logo, X1 - 110, Y1 - 92, 92);
  }

  /* ------------------------------------------------------------ public */
  function load(src) {
    return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  }
  function toURL(c) {
    return new Promise(res => c.toBlob(b => res(b ? URL.createObjectURL(b) : c.toDataURL()), 'image/webp', 0.92));
  }

  /* every spread as a plain canvas — used by tools/spreads.html to check
     the whole notebook at a glance after editing data.js */
  window.drawSpreadCanvases = async function (D, logoSrc) {
    const { pages } = await prepare(D, logoSrc);
    const p = paper();
    return pages.map(pg => {
      const c = canvas(), x = c.getContext('2d');
      x.drawImage(p, 0, 0); pg.draw(x);
      return { canvas: c, title: pg.title };
    });
  };

  /* The book as the engine turns it.
     Desktop: one image per spread, both pages side by side.
     Phone (single = true): one image per PAGE.  The page being read is
     drawn on the right-hand side of a spread whose left side is left blank,
     and the phone shows only that right-hand side; so turning the page
     uses the very same curl, the leaf lifting off and away to the left to
     reveal the next page underneath, with no sliding.
     Each page also says which index rows it carries ("rows"). */
  window.buildSpreads = async function (D, logoSrc, single) {
    const { pages: spreads } = await prepare(D, logoSrc);
    const p = paper();
    let pages;
    if (!single) {
      pages = spreads;
      pages.forEach(pg => { pg.rows = pg.people || [{ title: pg.title, place: pg.place }]; });
    } else {
      pages = [];
      spreads.forEach(sp => [0, 1].forEach(h => {
        const who = sp.people ? sp.people[h] : null;
        if (sp.people && !who) {
          pages.push({ sp, h, title: 'Your name could be here', alt: 'Your name could be here next year.', rows: [] });
        } else if (who) {
          pages.push({ sp, h, title: who.title, alt: who.alt, rows: [who] });
        } else {
          pages.push({ sp, h, title: sp.title, alt: sp.alt, rows: h ? [] : [{ title: sp.title, place: sp.place, span: 1 }] });
        }
      }));
    }

    /* The cover is drawn first so the book can open at once; the rest
       follow one at a time, yielding between them so the page stays
       responsive on a slow phone. */
    let ink = null;   /* the spread last drawn without its paper, for single pages */
    const render = async pg => {
      const c = canvas(), x = c.getContext('2d');
      x.drawImage(p, 0, 0);
      if (!single) pg.draw(x);
      else {
        if (!ink || ink.sp !== pg.sp) {
          const ic = canvas(); pg.sp.draw(ic.getContext('2d')); ink = { sp: pg.sp, c: ic };
        }
        /* lift this page's ink off its own side and set it on the right */
        x.drawImage(ink.c, pg.h ? Rp.x : L.x, 0, L.w, H, Rp.x, 0, L.w, H);
      }
      pg.url = await toURL(c);
      delete pg.draw; delete pg.sp;
    };
    await render(pages[0]);
    const done = (async () => {
      for (const pg of pages.slice(1)) {
        await new Promise(r => setTimeout(r, 0));
        await render(pg);
      }
      ink = null;
      return pages;
    })();
    return { pages, done };
  };

  async function prepare(D, logoSrc) {
    if (document.fonts) {
      await Promise.all([
        '400 40px Caveat', '700 40px Caveat', '400 40px "Instrument Serif"', '500 22px Newsreader'
      ].map(f => document.fonts.load(f, 'Aa1₹').catch(() => {})));
    }
    const A = { logo: await load(logoSrc), photos: {} };
    await Promise.all(D.featured.filter(t => t.photo).map(async t => { A.photos[t.name] = await load(t.photo); }));
    if (D.founder && D.founder.photo) A.founder = await load(D.founder.photo);

    const pages = [];
    const add = (draw, meta) => pages.push({ draw, ...meta });
    add((x) => cover(x, D, A), {
      title: D.short + ' Results Diary · ' + D.resultYear, place: 'Cover',
      alt: D.name + ' results diary ' + D.resultYear + ': ' + D.stats.map(s => s.value + ' ' + s.label).join('; ')
    });
    if (D.founder) add((x) => founderNote(x, D, A), {
      title: 'A Note from ' + D.founder.name, place: D.founder.role,
      alt: 'A handwritten note from ' + D.founder.name + ', founder of ' + D.name + ': ' + D.founder.letter
    });
    /* toppers, two to a spread; each still gets its own line in the index */
    const pctOf = t => (t.marks.reduce((a, m) => a + m[1], 0) / t.marks.length).toFixed(1) + "%";
    for (let i = 0; i < D.featured.length; i += 2) {
      const pair = D.featured.slice(i, i + 2), n0 = i + 1;
      const people = pair.map(t => ({
        title: t.name + " — " + pctOf(t), place: pctOf(t) + " · " + t.board + " " + t.year,
        alt: t.name + ", " + t.stream + ", " + t.board + " session " + session(t.year) + ": " +
          t.marks.map(m => m[0] + " " + m[1]).join(", ") + "; " + pctOf(t) + ". " + t.highlight + "."
      }));
      add((x) => topperSpread(x, D, A, pair, n0), {
        title: pair.map(t => t.name + " " + pctOf(t)).join(" · "),
        place: pair.map(pctOf).join(" · "),
        people, alt: people.map(q => q.alt).join(" ")
      });
    }
    add((x) => chart(x, D), {
      title: 'Five Years of Results', place: D.history[0].year + '–' + D.history[D.history.length - 1].year,
      alt: 'Students scoring 90% and above: ' + D.history.map(h => h.year + ' — ' + h.above90).join(', ')
    });
    add((x) => fees(x, D), {
      title: 'A Fraction of the Fee', place: D.feeOurs,
      alt: 'A full year at ' + D.short + ' costs ' + D.feeOurs + ', including ' + D.included.join(', ')
    });
    add((x) => join(x, D, A), {
      title: 'Your Name Could Be Here', place: 'Admissions ' + D.session,
      alt: 'Admissions open for session ' + D.session + '. ' + D.address.line1 + ', ' + D.address.line2
    });

    return { pages };
  }
})();
