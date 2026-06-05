import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFileSync } from "fs";

const AREAS = [
  {
    key: "self", name: "Self & Identity", tag: "WHO YOU BELIEVE YOU ARE",
    prompt: "How aligned do you feel with the woman you're becoming — not who you were, who you ARE now?",
    low: "You're still answering to an old version of yourself.",
    high: "You move like her. You've already decided.",
  },
  {
    key: "mindset", name: "Mindset & Beliefs", tag: "THE STORIES RUNNING THE SHOW",
    prompt: "When something hard happens, how quickly do you return to belief instead of spiraling?",
    low: "The doubt gets the first and last word.",
    high: "You catch the story and rewrite it on the spot.",
  },
  {
    key: "health", name: "Health & Energy", tag: "THE BODY THAT CARRIES THE VISION",
    prompt: "How well is your physical energy supporting the life and pace you actually want?",
    low: "You're running on fumes and willpower.",
    high: "Your body is an asset, not an obstacle.",
  },
  {
    key: "money", name: "Money & Wealth", tag: "YOUR RELATIONSHIP WITH RECEIVING",
    prompt: "How in-control and expansive do you feel about money — earning it, keeping it, growing it?",
    low: "Money feels like something that happens TO you.",
    high: "You direct it. You expect more of it.",
  },
  {
    key: "work", name: "Work & Purpose", tag: "THE THING YOU'RE HERE TO BUILD",
    prompt: "How much does your daily work reflect the mission you actually care about?",
    low: "You're busy, but not aimed at anything.",
    high: "Most of your effort points at the real vision.",
  },
  {
    key: "relationships", name: "Love & Relationships", tag: "WHO GETS CLOSE TO YOU",
    prompt: "How nourished and seen do you feel by the closest relationships in your life?",
    low: "You give more than you get back.",
    high: "Your circle reflects who you're becoming.",
  },
  {
    key: "growth", name: "Growth & Learning", tag: "YOUR RATE OF BECOMING",
    prompt: "How intentionally are you growing — learning, stretching, being mentored — right now?",
    low: "You've been coasting on what you already know.",
    high: "You're in active expansion, on purpose.",
  },
  {
    key: "environment", name: "Space & Environment", tag: "THE ROOM YOU DECIDE IN",
    prompt: "How much do your physical spaces and daily inputs support the woman you're becoming?",
    low: "Your environment fights your future self.",
    high: "Everything around you agrees with the vision.",
  },
];

const C = {
  paper:  rgb(0.969, 0.941, 0.918),
  blush:  rgb(0.910, 0.769, 0.753),
  rose:   rgb(0.788, 0.482, 0.518),
  wine:   rgb(0.478, 0.231, 0.278),
  gold:   rgb(0.788, 0.639, 0.337),
  ink:    rgb(0.102, 0.078, 0.086),
  soft:   rgb(0.937, 0.886, 0.855),
  muted:  rgb(0.416, 0.357, 0.373),
  darkText: rgb(0.247, 0.196, 0.216),
  white:  rgb(1, 1, 1),
};

const W = 612, H = 792;
const ML = 54, MR = 54;
const CW = W - ML - MR;

// baseline Y from top of page
const yt = (fromTop) => H - fromTop;
// bottom-left Y for form fields: top edge = fromTop, field height = h
const yf = (fromTop, h) => H - fromTop - h;

function wrap(text, font, size, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? cur + " " + word : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawText(page, text, x, topY, font, size, color, maxWidth, lineH = size * 1.45) {
  const lines = maxWidth ? wrap(text, font, size, maxWidth) : [text];
  let cy = yt(topY);
  for (const line of lines) {
    page.drawText(line, { x, y: cy, font, size, color });
    cy -= lineH;
  }
  return H - cy; // return fromTop of position after last line
}

function hline(page, fromTop, x1 = ML, x2 = W - MR, color = C.blush, thickness = 0.75) {
  page.drawLine({ start: { x: x1, y: yt(fromTop) }, end: { x: x2, y: yt(fromTop) }, thickness, color });
}

function pageBg(page) {
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.paper });
  page.drawRectangle({ x: 0, y: H - 5, width: W, height: 5, color: C.wine });
}

function footer(page, text) {
  page.drawText(text, { x: ML, y: 20, font: undefined, size: 0 }); // placeholder
  // We'll draw it properly below
}

async function generate() {
  const doc = await PDFDocument.create();

  const hv   = await doc.embedFont(StandardFonts.Helvetica);
  const hvB  = await doc.embedFont(StandardFonts.HelveticaBold);
  const tr   = await doc.embedFont(StandardFonts.TimesRoman);
  const tri  = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const trbi = await doc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const trb  = await doc.embedFont(StandardFonts.TimesRomanBold);

  const form = doc.getForm();

  // ─── COVER ───────────────────────────────────────────────────────────────
  {
    const page = doc.addPage([W, H]);
    pageBg(page);

    // Warm soft block at bottom third
    page.drawRectangle({ x: 0, y: 0, width: W, height: 248, color: C.soft });
    hline(page, H - 248, 0, W, C.blush, 1);

    // Brand kicker
    page.drawText("BECOME HER ANYWAY™", {
      x: ML, y: yt(46), font: hvB, size: 8.5, color: C.rose, characterSpacing: 3,
    });

    // Main title
    page.drawText("The 8-Area", {
      x: ML, y: yt(104), font: trbi, size: 54, color: C.ink,
    });
    page.drawText("Life Audit", {
      x: ML, y: yt(172), font: trbi, size: 66, color: C.wine,
    });

    hline(page, 202, ML, ML + 130, C.blush, 1.5);

    // Description
    drawText(page,
      "You can't become her by accident. In the next ten honest minutes, you'll see exactly where your life agrees with the vision — and where it's quietly holding you back.",
      ML, 228, tr, 13.5, C.darkText, CW, 21);

    page.drawText("8 AREAS  ·  ~10 MINUTES  ·  SCORED & TURNED INTO A PLAN", {
      x: ML, y: yt(310), font: hvB, size: 8, color: C.rose, characterSpacing: 1.5,
    });

    hline(page, 338);

    // Input fields
    const fields = [
      { label: "YOUR NAME",  key: "respondent.name",  x: ML,        w: 260 },
      { label: "DATE",       key: "respondent.date",  x: ML + 280,  w: 160 },
      { label: "YOUR EMAIL", key: "respondent.email", x: ML,        w: 440 },
    ];

    let fTop = 358;
    let row = 0;
    for (const fd of fields) {
      const top = row < 2 ? 358 : 418;
      if (row === 2) hline(page, 408);
      page.drawText(fd.label, {
        x: fd.x, y: yt(top), font: hvB, size: 8, color: C.rose, characterSpacing: 2,
      });
      const tf = form.createTextField(fd.key);
      tf.addToPage(page, { x: fd.x, y: yf(top + 14, 28), width: fd.w, height: 28, borderWidth: 0, backgroundColor: C.soft });
      tf.setFontSize(13);
      row++;
    }

    hline(page, 474);

    // How to use
    page.drawText("HOW TO USE THIS WORKBOOK", {
      x: ML, y: yt(496), font: hvB, size: 9, color: C.wine, characterSpacing: 2,
    });

    const steps = [
      "1.  Score each of the 8 areas honestly from 1 (not at all) to 10 (completely).",
      "2.  Don't overthink — your first instinct is almost always the most honest.",
      "3.  Fill in your scores on the Results page at the back.",
      "4.  Circle your 2 strengths and mark your 3 focus areas.",
      "5.  Choose ONE focus area and commit to one action this week.",
    ];
    let sy = 520;
    for (const s of steps) {
      drawText(page, s, ML, sy, tr, 12, C.ink, CW, 19);
      sy += 24;
    }

    hline(page, 664);

    drawText(page,
      "“You don’t rise to the level of your goals. You fall to the level of your identity.”",
      ML, 686, tri, 13.5, C.wine, CW, 22);

    page.drawText("BECOME HER ANYWAY™  ·  THE 8-AREA LIFE AUDIT", {
      x: ML, y: 20, font: hvB, size: 7, color: C.muted, characterSpacing: 1,
    });
  }

  // ─── AREA PAGES ──────────────────────────────────────────────────────────
  for (let i = 0; i < AREAS.length; i++) {
    const area = AREAS[i];
    const page = doc.addPage([W, H]);
    pageBg(page);

    // Large ghost number top-right
    const numStr = `0${i + 1}`;
    const numW = trbi.widthOfTextAtSize(numStr, 88);
    page.drawText(numStr, {
      x: W - MR - numW, y: yt(98),
      font: trbi, size: 88, color: C.blush,
    });

    // Tag
    page.drawText(area.tag, {
      x: ML, y: yt(50), font: hvB, size: 8.5, color: C.rose, characterSpacing: 2.5,
    });

    // Area name
    page.drawText(area.name, {
      x: ML, y: yt(96), font: trbi, size: 36, color: C.ink,
    });

    hline(page, 116);

    // Question prompt
    const afterPrompt = drawText(page, area.prompt, ML, 140, tri, 16, C.darkText, CW - 40, 26);

    // ── Rating scale ──────────────────────────────────────
    const scaleTopFrom = afterPrompt + 28;
    const scaleY = yt(scaleTopFrom + 17); // Y of circle centers
    const spacing = CW / 10;
    const r = 16;

    for (let n = 1; n <= 10; n++) {
      const cx = ML + spacing * (n - 1) + spacing / 2;
      page.drawCircle({ x: cx, y: scaleY, size: r, color: C.soft, borderColor: C.blush, borderWidth: 1.5 });
      const ns = String(n);
      const nw = hvB.widthOfTextAtSize(ns, 11.5);
      page.drawText(ns, { x: cx - nw / 2, y: scaleY - 5, font: hvB, size: 11.5, color: C.wine });
    }

    // Low / high axis labels
    const lowLines  = wrap(area.low,  hv, 9, CW * 0.4);
    const highLines = wrap(area.high, hv, 9, CW * 0.4);
    let lly = scaleY - r - 10;
    for (const line of lowLines) {
      page.drawText(line, { x: ML, y: lly, font: hv, size: 9, color: C.rose });
      lly -= 13;
    }
    let hly = scaleY - r - 10;
    for (const line of highLines) {
      const lw = hv.widthOfTextAtSize(line, 9);
      page.drawText(line, { x: W - MR - lw, y: hly, font: hv, size: 9, color: C.rose });
      hly -= 13;
    }

    // Score field
    const scoreSectionTop = scaleTopFrom + 55 + Math.max(lowLines.length, highLines.length) * 13;
    page.drawText("MY SCORE", {
      x: ML, y: yt(scoreSectionTop), font: hvB, size: 9, color: C.wine, characterSpacing: 2,
    });
    const sf = form.createTextField(`area.${area.key}.score`);
    sf.addToPage(page, {
      x: ML + 88, y: yf(scoreSectionTop + 2, 26), width: 46, height: 26,
      borderWidth: 1, backgroundColor: C.white,
    });
    sf.setFontSize(15);
    page.drawText("/ 10", {
      x: ML + 142, y: yt(scoreSectionTop), font: trb, size: 12, color: C.muted,
    });

    // Notes
    const notesSectionTop = scoreSectionTop + 40;
    hline(page, notesSectionTop - 8);
    page.drawText("NOTES & REFLECTIONS", {
      x: ML, y: yt(notesSectionTop), font: hvB, size: 8.5, color: C.wine, characterSpacing: 2,
    });

    const notesTop = notesSectionTop + 14;
    const notesH = H - notesTop - 44;

    // Ruled lines behind the notes field
    const lineCount = Math.floor(notesH / 22);
    for (let l = 0; l < lineCount; l++) {
      hline(page, notesTop + l * 22, ML, W - MR, C.blush, 0.4);
    }

    const nf = form.createTextField(`area.${area.key}.notes`);
    nf.enableMultiline();
    nf.addToPage(page, {
      x: ML, y: yf(notesTop, notesH), width: CW, height: notesH,
      borderWidth: 0, backgroundColor: undefined,
    });
    nf.setFontSize(12);

    // Footer
    page.drawText(`${area.name.toUpperCase()}  ·  BECOME HER ANYWAY™  ·  THE 8-AREA LIFE AUDIT`, {
      x: ML, y: 20, font: hvB, size: 7, color: C.muted, characterSpacing: 0.8,
    });
  }

  // ─── RESULTS PAGE ────────────────────────────────────────────────────────
  {
    const page = doc.addPage([W, H]);
    pageBg(page);

    page.drawText("RESULTS", {
      x: ML, y: yt(46), font: hvB, size: 9, color: C.rose, characterSpacing: 3,
    });
    page.drawText("Your Life Audit Map", {
      x: ML, y: yt(90), font: trbi, size: 40, color: C.ink,
    });
    hline(page, 110, ML, W - MR, C.wine, 1.5);

    // Table
    const c1 = ML, c2 = ML + 270, c3 = ML + 370, c4 = ML + 440;
    const rowH = 30;
    let ty = 132;

    // Header
    page.drawRectangle({ x: ML, y: yf(ty, rowH), width: CW, height: rowH, color: C.wine });
    for (const [text, x] of [["LIFE AREA", c1 + 6], ["SCORE", c2 + 6], ["STRENGTH", c3], ["FOCUS", c4]]) {
      page.drawText(text, { x, y: yt(ty + 8), font: hvB, size: 8.5, color: C.paper, characterSpacing: 1 });
    }
    ty += rowH;

    for (let i = 0; i < AREAS.length; i++) {
      const area = AREAS[i];
      page.drawRectangle({
        x: ML, y: yf(ty, rowH), width: CW, height: rowH,
        color: i % 2 === 0 ? C.soft : C.paper,
      });

      page.drawText(`${String(i + 1).padStart(2, "0")}  ${area.name}`, {
        x: c1 + 6, y: yt(ty + 8), font: tr, size: 12, color: C.ink,
      });

      // Score transfer field
      const rsf = form.createTextField(`results.${area.key}.score`);
      rsf.addToPage(page, {
        x: c2 + 6, y: yf(ty + 4, 22), width: 46, height: 22,
        borderWidth: 0, backgroundColor: undefined,
      });
      rsf.setFontSize(13);

      // Strength checkbox
      const scb = form.createCheckBox(`results.${area.key}.strength`);
      scb.addToPage(page, { x: c3 + 22, y: yf(ty + 5, 16), width: 16, height: 16 });

      // Focus checkbox
      const fcb = form.createCheckBox(`results.${area.key}.focus`);
      fcb.addToPage(page, { x: c4 + 16, y: yf(ty + 5, 16), width: 16, height: 16 });

      ty += rowH;
    }

    hline(page, ty + 6);

    // Average
    ty += 24;
    page.drawText("OVERALL AVERAGE  (add all scores ÷ 8)", {
      x: c1, y: yt(ty + 8), font: hvB, size: 9, color: C.wine, characterSpacing: 1,
    });
    const avgf = form.createTextField("results.overall.average");
    avgf.addToPage(page, {
      x: c2 + 6, y: yf(ty + 4, 26), width: 50, height: 26,
      borderWidth: 1.5, backgroundColor: C.soft,
    });
    avgf.setFontSize(16);
    page.drawText("/ 10", { x: c2 + 64, y: yt(ty + 8), font: trb, size: 12, color: C.muted });

    ty += 54;
    hline(page, ty);
    ty += 20;

    // Tier guide
    page.drawText("WHAT YOUR SCORE MEANS", {
      x: ML, y: yt(ty), font: hvB, size: 9, color: C.wine, characterSpacing: 2,
    });
    ty += 22;

    const tiers = [
      { range: "8.5 – 10",  word: "Sovereign",      note: "She's already her. Now you protect and expand it." },
      { range: "7.0 – 8.4", word: "Ascending",       note: "The momentum is real. Time to remove the few drags." },
      { range: "5.0 – 6.9", word: "Becoming",        note: "You're in the messy, powerful middle. This is the work." },
      { range: "3.0 – 4.9", word: "Awakening",       note: "Something in you knows it's time. Good — let's aim it." },
      { range: "1.0 – 2.9", word: "The Threshold",   note: "You're standing at the start. Honest scores are the bravest start." },
    ];

    for (const t of tiers) {
      page.drawText(t.range,  { x: c1,       y: yt(ty), font: hvB, size: 10, color: C.rose });
      page.drawText(t.word,   { x: c1 + 76,  y: yt(ty), font: trbi, size: 12, color: C.wine });
      drawText(page, `— ${t.note}`, c1 + 200, ty, tr, 10.5, C.ink, CW - 200, 16);
      ty += 24;
    }

    hline(page, ty + 8);
    ty += 26;

    // My result
    page.drawText("I AM:", { x: ML, y: yt(ty), font: hvB, size: 9, color: C.wine, characterSpacing: 2 });
    page.drawLine({ start: { x: ML + 50, y: yt(ty) }, end: { x: ML + 300, y: yt(ty) }, thickness: 1, color: C.blush });

    ty += 28;
    page.drawText("MY LOWEST 3 (FOCUS):", { x: ML, y: yt(ty), font: hvB, size: 9, color: C.wine, characterSpacing: 1 });
    page.drawLine({ start: { x: ML + 175, y: yt(ty) }, end: { x: W - MR, y: yt(ty) }, thickness: 1, color: C.blush });

    ty += 28;
    page.drawText("MY HIGHEST 2 (STRENGTHS):", { x: ML, y: yt(ty), font: hvB, size: 9, color: C.wine, characterSpacing: 1 });
    page.drawLine({ start: { x: ML + 210, y: yt(ty) }, end: { x: W - MR, y: yt(ty) }, thickness: 1, color: C.blush });

    page.drawText("BECOME HER ANYWAY™  ·  THE 8-AREA LIFE AUDIT", {
      x: ML, y: 20, font: hvB, size: 7, color: C.muted, characterSpacing: 0.8,
    });
  }

  // ─── NEXT STEPS PAGE ─────────────────────────────────────────────────────
  {
    const page = doc.addPage([W, H]);
    pageBg(page);

    // Dark header block
    page.drawRectangle({ x: 0, y: H - 195, width: W, height: 195, color: C.wine });

    page.drawText("YOUR NEXT STEP", {
      x: ML, y: yt(46), font: hvB, size: 9, color: C.blush, characterSpacing: 3,
    });
    page.drawText("The One Move for", {
      x: ML, y: yt(94), font: trbi, size: 36, color: C.paper,
    });
    page.drawText("the Next 7 Days", {
      x: ML, y: yt(140), font: trbi, size: 36, color: C.blush,
    });
    hline(page, 162, ML, W - MR, C.blush, 0.6);
    page.drawText("BECOME HER ANYWAY™", {
      x: ML, y: yt(184), font: hvB, size: 8, color: C.blush, characterSpacing: 2,
    });

    // Body
    let cy = 216;
    cy = drawText(page,
      "Don’t try to fix all three at once — that’s how women stay stuck. Pick your lowest-scoring area only. This week, choose one small, visible action that the higher-scoring version of you would take without thinking. Do it before you feel ready.",
      ML, cy, tr, 13, C.ink, CW, 21) + 14;

    const steps = [
      "Name the ONE action in your lowest area you’ve been avoiding.",
      "Schedule it. A vision with no date is just a wish.",
      "Tell one person — accountability is identity made public.",
      "Re-take this audit in 30 days and watch the shape change.",
    ];

    for (let i = 0; i < steps.length; i++) {
      const cx2 = ML + 15;
      const circY = yt(cy + 3);
      page.drawCircle({ x: cx2, y: circY, size: 13, color: C.wine });
      const ns = String(i + 1);
      page.drawText(ns, { x: cx2 - hvB.widthOfTextAtSize(ns, 10) / 2, y: circY - 4, font: hvB, size: 10, color: C.paper });
      cy = drawText(page, steps[i], ML + 36, cy, tr, 12.5, C.ink, CW - 36, 20) + 10;
    }

    cy += 16;
    hline(page, cy);
    cy += 22;

    // Action commitment box
    page.drawText("MY ONE ACTION THIS WEEK:", { x: ML, y: yt(cy), font: hvB, size: 9, color: C.wine, characterSpacing: 1.5 });
    cy += 16;
    page.drawRectangle({ x: ML, y: yf(cy, 64), width: CW, height: 64, color: C.soft });
    cy += 80;

    page.drawText("I WILL START BY (date):", { x: ML, y: yt(cy), font: hvB, size: 9, color: C.wine, characterSpacing: 1.5 });
    page.drawLine({ start: { x: ML + 188, y: yt(cy) }, end: { x: ML + 380, y: yt(cy) }, thickness: 1, color: C.blush });
    cy += 32;

    page.drawText("MY ACCOUNTABILITY PARTNER:", { x: ML, y: yt(cy), font: hvB, size: 9, color: C.wine, characterSpacing: 1.5 });
    page.drawLine({ start: { x: ML + 218, y: yt(cy) }, end: { x: ML + 410, y: yt(cy) }, thickness: 1, color: C.blush });
    cy += 48;

    hline(page, cy);
    cy += 22;

    drawText(page,
      "“You don’t rise to the level of your goals. You fall to the level of your identity.”",
      ML, cy, tri, 14, C.wine, CW, 23);

    page.drawText("BECOME HER ANYWAY™  ·  THE 8-AREA LIFE AUDIT  ·  © ALL RIGHTS RESERVED", {
      x: ML, y: 20, font: hvB, size: 7, color: C.muted, characterSpacing: 0.8,
    });
  }

  const bytes = await doc.save();
  writeFileSync("life-audit.pdf", bytes);
  console.log("life-audit.pdf created — " + Math.round(bytes.length / 1024) + " KB");
}

generate().catch(console.error);
