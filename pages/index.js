import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────
// BECOME HER ANYWAY™ — THE 8-AREA LIFE AUDIT
// ⚙️ true  = LEAD MAGNET  |  false = CLIENT DIAGNOSTIC
// ─────────────────────────────────────────────────────────────
const LEAD_MAGNET = true;
const BOOKING_URL = "https://stan.store/DestineePierreArtistry/p/book-a-11-call-with-me-96cslfgn";

// ── Brand palette ─────────────────────────────────────────────
const C = {
  black:     "#0C0C0A",
  offBlack:  "#1A1A16",
  white:     "#FDFAF5",
  cream:     "#F2EAD3",
  sand:      "#E5D9BC",
  warmGray:  "#C8BFAA",
  gold:      "#C9A84C",
  goldLight: "#D9BA6F",
  goldDark:  "#9A7A2E",
  olive:     "#6E7C42",
  oliveDark: "#4E5A2E",
  earth:     "#8C6E4A",
  bark:      "#5C4433",
  stone:     "#A89070",
  muted:     "#7A6E5E",
  soft:      "#EDE4CC",
};

const DISPLAY = "'Playfair Display', Georgia, serif";
const BODY    = "'Cormorant Garamond', Georgia, serif";
const SANS    = "'Jost', 'Century Gothic', sans-serif";

const AREAS = [
  {
    key: "self", name: "Self & Identity", tag: "Who you believe you are",
    prompt: "How aligned do you feel with the woman you're becoming — not who you were, who you ARE now?",
    low:  "You're still answering to an old version of yourself.",
    high: "You move like her. You've already decided.",
  },
  {
    key: "mindset", name: "Mindset & Beliefs", tag: "The stories running the show",
    prompt: "When something hard happens, how quickly do you return to belief instead of spiraling?",
    low:  "The doubt gets the first and last word.",
    high: "You catch the story and rewrite it on the spot.",
  },
  {
    key: "health", name: "Health & Energy", tag: "The body that carries the vision",
    prompt: "How well is your physical energy supporting the life and pace you actually want?",
    low:  "You're running on fumes and willpower.",
    high: "Your body is an asset, not an obstacle.",
  },
  {
    key: "money", name: "Money & Wealth", tag: "Your relationship with receiving",
    prompt: "How in-control and expansive do you feel about money — earning it, keeping it, growing it?",
    low:  "Money feels like something that happens TO you.",
    high: "You direct it. You expect more of it.",
  },
  {
    key: "work", name: "Work & Purpose", tag: "The thing you're here to build",
    prompt: "How much does your daily work reflect the mission you actually care about?",
    low:  "You're busy, but not aimed at anything.",
    high: "Most of your effort points at the real vision.",
  },
  {
    key: "relationships", name: "Love & Relationships", tag: "Who gets close to you",
    prompt: "How nourished and seen do you feel by the closest relationships in your life?",
    low:  "You give more than you get back.",
    high: "Your circle reflects who you're becoming.",
  },
  {
    key: "growth", name: "Growth & Learning", tag: "Your rate of becoming",
    prompt: "How intentionally are you growing — learning, stretching, being mentored — right now?",
    low:  "You've been coasting on what you already know.",
    high: "You're in active expansion, on purpose.",
  },
  {
    key: "environment", name: "Space & Environment", tag: "The room you decide in",
    prompt: "How much do your physical spaces and daily inputs support the woman you're becoming?",
    low:  "Your environment fights your future self.",
    high: "Everything around you agrees with the vision.",
  },
];

function tier(avg) {
  if (avg >= 8.5) return { word: "Sovereign",     note: "She's already her. Now you protect and expand it." };
  if (avg >= 7)   return { word: "Ascending",      note: "The momentum is real. Time to remove the few drags." };
  if (avg >= 5)   return { word: "Becoming",       note: "You're in the messy, powerful middle. This is the work." };
  if (avg >= 3)   return { word: "Awakening",      note: "Something in you knows it's time. Good — let's aim it." };
  return           { word: "The Threshold",  note: "You're standing at the start. Honest scores are the bravest start." };
}

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${C.black}; }
      input::placeholder { color: ${C.stone}; opacity: 1; }
      ::selection { background: ${C.gold}; color: ${C.black}; }
      @media print { button { display: none !important; } }

      .score-btn {
        flex: 1; aspect-ratio: 1; border-radius: 50%;
        border: 1.5px solid ${C.warmGray};
        background: transparent;
        color: ${C.muted};
        font-family: ${SANS}; font-size: clamp(11px, 2vw, 14px); font-weight: 500;
        cursor: pointer; transition: all .2s ease;
      }
      .score-btn:hover { border-color: ${C.gold}; color: ${C.gold}; }
      .score-btn.active {
        background: ${C.black};
        border-color: ${C.gold};
        color: ${C.gold};
      }
      .primary-btn {
        font-family: ${SANS}; font-size: 12px; font-weight: 600;
        letter-spacing: .22em; text-transform: uppercase;
        padding: 16px 42px; border-radius: 0; cursor: pointer;
        border: 1.5px solid ${C.gold};
        background: ${C.gold}; color: ${C.black};
        transition: all .25s ease;
      }
      .primary-btn:hover { background: ${C.goldDark}; border-color: ${C.goldDark}; }
      .primary-btn:disabled { opacity: .4; cursor: not-allowed; }
      .ghost-btn {
        font-family: ${SANS}; font-size: 12px; font-weight: 500;
        letter-spacing: .18em; text-transform: uppercase;
        padding: 14px 36px; border-radius: 0; cursor: pointer;
        border: 1px solid ${C.warmGray};
        background: transparent; color: ${C.muted};
        transition: all .25s ease;
      }
      .ghost-btn:hover { border-color: ${C.stone}; color: ${C.stone}; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp .55s ease both; }
    `}</style>
  );
}

// ── Radar Chart ────────────────────────────────────────────────
function Radar({ scores }) {
  const size = 340, c = size / 2, r = c - 52;
  const pts = AREAS.map((a, i) => {
    const ang = (Math.PI * 2 * i) / AREAS.length - Math.PI / 2;
    const v = (scores[a.key] || 0) / 10;
    return {
      x:  c + Math.cos(ang) * r * v,
      y:  c + Math.sin(ang) * r * v,
      ox: c + Math.cos(ang) * r,
      oy: c + Math.sin(ang) * r,
      lx: c + Math.cos(ang) * (r + 34),
      ly: c + Math.sin(ang) * (r + 34),
      a,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 380 }}>
      {[0.25, 0.5, 0.75, 1].map((ring, i) => (
        <polygon key={i}
          points={AREAS.map((a, j) => {
            const ang = (Math.PI * 2 * j) / AREAS.length - Math.PI / 2;
            return `${c + Math.cos(ang) * r * ring},${c + Math.sin(ang) * r * ring}`;
          }).join(" ")}
          fill="none" stroke={C.olive} strokeWidth="1" opacity={0.3} />
      ))}
      {pts.map((p, i) => (
        <line key={i} x1={c} y1={c} x2={p.ox} y2={p.oy} stroke={C.warmGray} strokeWidth="1" opacity={0.3} />
      ))}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={C.gold} fillOpacity="0.18"
        stroke={C.gold} strokeWidth="2"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.gold} />
      ))}
      {pts.map((p, i) => (
        <text key={i} x={p.lx} y={p.ly}
          fontSize="8" fontFamily={SANS} fill={C.cream}
          textAnchor={Math.abs(p.lx - c) < 8 ? "middle" : p.lx > c ? "start" : "end"}
          dominantBaseline="middle"
          style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {p.a.name.split(" & ")[0]}
        </text>
      ))}
    </svg>
  );
}

export default function LifeAudit() {
  const [stage, setStage]       = useState("welcome");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idx, setIdx]           = useState(0);
  const [scores, setScores]     = useState({});

  const current  = AREAS[idx];
  const answered = Object.keys(scores).length;
  const progress = Math.round((answered / AREAS.length) * 100);
  const setScore = (k, v) => setScores((s) => ({ ...s, [k]: v }));

  const goNext = () => {
    if (idx < AREAS.length - 1) setIdx(idx + 1);
    else setStage(LEAD_MAGNET ? "gate" : "results");
  };
  const goBack = () => (idx > 0 ? setIdx(idx - 1) : setStage("welcome"));

  const values    = AREAS.map((a) => scores[a.key] || 0);
  const avg       = values.reduce((a, b) => a + b, 0) / AREAS.length;
  const sorted    = [...AREAS].sort((a, b) => (scores[a.key] || 0) - (scores[b.key] || 0));
  const focus     = sorted.slice(0, 3);
  const strengths = [...sorted].reverse().slice(0, 2);
  const t         = tier(avg);


  const submitLead = async () => {
    setSubmitting(true);
    try {
      const params = new URLSearchParams({ name, email, avg: String(avg) });
      await fetch("https://hooks.zapier.com/hooks/catch/27813997/4b0xkmm/", {
        method: "POST",
        mode: "no-cors",
        body: params,
      });
    } catch { /* never block results */ }
    setSubmitting(false);
    setStage("results");
  };

  const kicker = {
    fontFamily: SANS, fontSize: 10, fontWeight: 600,
    letterSpacing: "0.38em", textTransform: "uppercase", color: C.gold,
  };

  // ───── WELCOME ─────────────────────────────────────────────
  if (stage === "welcome") {
    return (
      <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: BODY }}>
        <Fonts />

        {/* Hero */}
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", maxWidth: 820,
          margin: "0 auto", padding: "clamp(40px,8vw,96px) clamp(24px,6vw,64px)",
        }}>
          <div className="fade-up" style={{ ...kicker, marginBottom: 28 }}>
            Become Her Anyway™
          </div>

          <h1 className="fade-up" style={{
            fontFamily: DISPLAY, fontSize: "clamp(52px,11vw,104px)",
            lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.02em",
            marginBottom: 8, animationDelay: ".08s",
          }}>
            The 8-Area<br />
            <em style={{ color: C.gold, fontStyle: "italic" }}>Life Audit</em>
          </h1>

          {/* Gold rule */}
          <div className="fade-up" style={{
            width: 72, height: 2, background: C.gold,
            margin: "28px 0", animationDelay: ".14s",
          }} />

          <p className="fade-up" style={{
            fontSize: "clamp(18px,2.8vw,24px)", lineHeight: 1.55,
            color: C.warmGray, maxWidth: 520, marginBottom: 8,
            fontFamily: BODY, animationDelay: ".18s",
          }}>
            You can't become her by accident. In the next ten honest minutes,
            you'll see exactly where your life agrees with the vision — and
            where it's quietly holding you back.
          </p>

          <p className="fade-up" style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.14em",
            color: C.stone, marginBottom: 48, animationDelay: ".22s",
          }}>
            8 AREAS · ~10 MINUTES · SCORED, MAPPED & TURNED INTO A PLAN
          </p>

          {/* Name input */}
          <div className="fade-up" style={{ marginBottom: 36, animationDelay: ".26s" }}>
            <label style={{ ...kicker, fontSize: 9, display: "block", marginBottom: 14 }}>
              First, your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setStage("audit")}
              placeholder="Her name is…"
              style={{
                fontFamily: DISPLAY, fontSize: "clamp(22px,4vw,32px)",
                fontStyle: "italic", background: "transparent",
                border: "none", borderBottom: `1px solid ${C.stone}`,
                color: C.white, padding: "10px 2px",
                width: "min(100%, 420px)", outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = C.gold)}
              onBlur={(e)  => (e.target.style.borderBottomColor = C.stone)}
            />
          </div>

          <div className="fade-up" style={{ animationDelay: ".3s" }}>
            <button className="primary-btn" onClick={() => setStage("audit")}>
              Begin the Audit →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── AUDIT ────────────────────────────────────────────────
  if (stage === "audit") {
    const val = scores[current.key] || 0;

    return (
      <div style={{ minHeight: "100vh", background: C.cream, color: C.black, fontFamily: BODY }}>
        <Fonts />

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: C.black, padding: "0",
        }}>
          {/* Olive progress fill */}
          <div style={{ height: 3, background: C.offBlack }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.olive}, ${C.gold})`,
              transition: "width .4s ease",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "12px 24px",
          }}>
            <span style={{ fontFamily: SANS, fontSize: 11, color: C.stone, letterSpacing: "0.2em" }}>
              BECOME HER ANYWAY™
            </span>
            <span style={{ fontFamily: SANS, fontSize: 11, color: C.gold, letterSpacing: "0.15em" }}>
              {String(idx + 1).padStart(2, "0")} / 08
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: 760, margin: "0 auto",
          padding: "clamp(40px,6vw,72px) clamp(24px,5vw,52px)",
        }}>
          <div className="fade-up" style={{ ...kicker, color: C.olive, marginBottom: 12, fontSize: 9 }}>
            {current.tag}
          </div>

          <h2 className="fade-up" style={{
            fontFamily: DISPLAY, fontSize: "clamp(38px,7.5vw,64px)",
            lineHeight: 1, fontWeight: 700, color: C.black,
            margin: "0 0 6px", animationDelay: ".06s",
          }}>
            {current.name}
          </h2>

          {/* Gold underline accent */}
          <div style={{ width: 48, height: 2, background: C.gold, margin: "20px 0 28px" }} />

          <p className="fade-up" style={{
            fontSize: "clamp(18px,3vw,24px)", lineHeight: 1.5,
            color: C.bark, maxWidth: 580, marginBottom: 44,
            fontFamily: BODY, fontStyle: "italic", animationDelay: ".1s",
          }}>
            {current.prompt}
          </p>

          {/* Scale labels */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: SANS, fontSize: 10, color: C.stone,
            letterSpacing: "0.06em", maxWidth: 560, marginBottom: 12,
          }}>
            <span style={{ maxWidth: 160 }}>{current.low}</span>
            <span style={{ maxWidth: 160, textAlign: "right" }}>{current.high}</span>
          </div>

          {/* Score buttons */}
          <div style={{ display: "flex", gap: "clamp(4px,1.2vw,9px)", maxWidth: 560, marginBottom: 48 }}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <button
                key={n}
                onClick={() => setScore(current.key, n)}
                className={`score-btn${n <= val ? " active" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button className="ghost-btn" onClick={goBack}>← Back</button>
            <button
              className="primary-btn"
              disabled={!val}
              onClick={goNext}
            >
              {idx < AREAS.length - 1 ? "Next →" : "See My Results →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── EMAIL GATE ────────────────────────────────────────────
  if (stage === "gate") {
    const valid = /\S+@\S+\.\S+/.test(email);

    return (
      <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: BODY }}>
        <Fonts />
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", maxWidth: 720,
          margin: "0 auto", padding: "clamp(40px,8vw,96px) clamp(24px,6vw,64px)",
        }}>
          <div className="fade-up" style={{ ...kicker, marginBottom: 24 }}>
            One step from your results
          </div>

          <h2 className="fade-up" style={{
            fontFamily: DISPLAY, fontSize: "clamp(38px,8vw,72px)",
            lineHeight: 1, fontWeight: 700, margin: "0 0 28px",
            animationDelay: ".08s",
          }}>
            Where should I send<br />
            <em style={{ color: C.gold }}>her</em> results?
          </h2>

          <p className="fade-up" style={{
            fontSize: "clamp(17px,2.6vw,21px)", color: C.warmGray,
            maxWidth: 460, lineHeight: 1.5, marginBottom: 36,
            animationDelay: ".14s",
          }}>
            Drop your email and I'll show your full map right now — plus send
            you the one move that closes your biggest gap.
          </p>

          <div className="fade-up" style={{ marginBottom: 32, animationDelay: ".18s" }}>
            <label style={{ ...kicker, fontSize: 9, display: "block", marginBottom: 14 }}>
              Your email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && valid && !submitting && submitLead()}
              placeholder="you@email.com"
              type="email"
              style={{
                fontFamily: DISPLAY, fontSize: "clamp(20px,3.5vw,28px)",
                fontStyle: "italic", background: "transparent",
                border: "none", borderBottom: `1px solid ${C.stone}`,
                color: C.white, padding: "10px 2px",
                width: "min(100%, 440px)", outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = C.gold)}
              onBlur={(e)  => (e.target.style.borderBottomColor = C.stone)}
            />
          </div>

          <div className="fade-up" style={{ animationDelay: ".22s" }}>
            <button
              className="primary-btn"
              disabled={!valid || submitting}
              onClick={submitLead}
            >
              {submitting ? "Saving…" : "Show My Results →"}
            </button>
            <p style={{
              fontFamily: SANS, fontSize: 10, letterSpacing: "0.1em",
              color: C.stone, marginTop: 18,
            }}>
              NO SPAM · UNSUBSCRIBE ANYTIME · JUST HER WORK
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ───── RESULTS ───────────────────────────────────────────────
  return (
    <div style={{ background: C.black, color: C.white, fontFamily: BODY }}>
      <Fonts />

      {/* ── Hero banner ── */}
      <div style={{
        maxWidth: 820, margin: "0 auto",
        padding: "clamp(56px,8vw,96px) clamp(24px,6vw,64px) clamp(40px,5vw,64px)",
      }}>
        <div style={{ ...kicker, marginBottom: 22 }}>
          {name ? `${name}'s Audit` : "Your Audit"} · Become Her Anyway™
        </div>

        <h1 style={{
          fontFamily: DISPLAY, fontSize: "clamp(44px,9vw,88px)",
          lineHeight: 0.95, fontWeight: 700, marginBottom: 14,
        }}>
          You are{" "}
          <em style={{ color: C.gold, fontStyle: "italic" }}>{t.word}</em>.
        </h1>

        <p style={{
          fontSize: "clamp(17px,2.6vw,22px)", color: C.warmGray,
          maxWidth: 500, lineHeight: 1.5, marginBottom: 10,
        }}>
          {t.note}
        </p>

        <p style={{
          fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
          color: C.gold, marginBottom: 56,
        }}>
          OVERALL ALIGNMENT · {avg.toFixed(1)} / 10
        </p>

        {/* Radar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Radar scores={scores} />
        </div>
      </div>

      {/* ── Light section ── */}
      <div style={{ background: C.cream }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(48px,7vw,80px) clamp(24px,6vw,64px)" }}>

          {/* Strengths */}
          <div style={{
            fontFamily: SANS, fontSize: 10, fontWeight: 600,
            letterSpacing: "0.34em", color: C.olive, marginBottom: 12,
          }}>
            What's Already Working
          </div>
          <h3 style={{
            fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,36px)",
            fontWeight: 700, color: C.black, borderBottom: `1px solid ${C.sand}`,
            paddingBottom: 20, marginBottom: 8,
          }}>
            Your two highest areas
          </h3>
          <p style={{ fontSize: 16, color: C.earth, marginBottom: 24 }}>
            Don't skip past these. Your highest areas are the proof that you can move a number.
          </p>

          {strengths.map((a) => (
            <div key={a.key} style={{
              display: "flex", alignItems: "center", gap: 20,
              padding: "16px 0", borderBottom: `1px solid ${C.sand}`,
            }}>
              <div style={{
                fontFamily: DISPLAY, fontSize: 36, fontWeight: 700,
                color: C.gold, minWidth: 52,
              }}>
                {scores[a.key]}
              </div>
              <div>
                <div style={{
                  fontFamily: SANS, fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.black, marginBottom: 3,
                }}>
                  {a.name}
                </div>
                <div style={{ fontSize: 15, color: C.muted, fontStyle: "italic" }}>
                  {a.tag}
                </div>
              </div>
            </div>
          ))}

          {/* Focus areas */}
          <div style={{ marginTop: 52 }}>
            <div style={{
              fontFamily: SANS, fontSize: 10, fontWeight: 600,
              letterSpacing: "0.34em", color: C.olive, marginBottom: 12,
            }}>
              Where to Focus
            </div>
            <h3 style={{
              fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,36px)",
              fontWeight: 700, color: C.black, borderBottom: `1px solid ${C.sand}`,
              paddingBottom: 20, marginBottom: 8,
            }}>
              Your 3 leverage points
            </h3>
            <p style={{ fontSize: 16, color: C.earth, marginBottom: 24 }}>
              These aren't failures — they're your leverage. A two-point lift in any
              one of these changes how the whole map feels.
            </p>
          </div>

          {focus.map((a, i) => (
            <div key={a.key} style={{
              display: "flex", gap: 22,
              padding: "24px 0", borderBottom: `1px solid ${C.sand}`,
            }}>
              <div style={{
                fontFamily: DISPLAY, fontSize: 52, fontWeight: 700,
                color: C.sand, lineHeight: 1, minWidth: 60,
              }}>
                0{i + 1}
              </div>
              <div>
                <div style={{
                  display: "flex", alignItems: "baseline",
                  gap: 12, flexWrap: "wrap", marginBottom: 6,
                }}>
                  <span style={{
                    fontFamily: SANS, fontSize: 12, fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: C.black,
                  }}>
                    {a.name}
                  </span>
                  <span style={{
                    fontFamily: SANS, fontSize: 11, fontWeight: 500,
                    color: C.olive, letterSpacing: "0.06em",
                  }}>
                    {scores[a.key]} / 10
                  </span>
                </div>
                <p style={{ fontSize: 16, color: C.bark, lineHeight: 1.45 }}>
                  {a.low}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Next step block (dark) ── */}
      <div style={{ background: C.offBlack }}>
        <div style={{
          maxWidth: 820, margin: "0 auto",
          padding: "clamp(48px,7vw,80px) clamp(24px,6vw,64px)",
        }}>
          <div style={{ ...kicker, marginBottom: 18 }}>Your Next Step</div>
          <h3 style={{
            fontFamily: DISPLAY, fontSize: "clamp(30px,5vw,48px)",
            lineHeight: 1.05, fontWeight: 700, color: C.white,
            marginBottom: 20,
          }}>
            The one move for the next 7 days
          </h3>

          <p style={{
            fontSize: "clamp(16px,2.4vw,19px)", lineHeight: 1.6,
            color: C.warmGray, marginBottom: 28,
          }}>
            Don't try to fix all three at once — that's how women stay stuck.
            Pick{" "}
            <em style={{ color: C.gold }}>{focus[0].name}</em> only. Choose one
            small, visible action the higher-scoring version of you would take
            without thinking. Do it before you feel ready.
          </p>

          <div style={{ display: "grid", gap: 14, marginBottom: LEAD_MAGNET ? 36 : 0 }}>
            {[
              `Name the ONE action in ${focus[0].name.split(" & ")[0]} you've been avoiding.`,
              "Schedule it. A vision with no date is just a wish.",
              "Tell one person — accountability is identity made public.",
              "Re-take this audit in 30 days and watch the shape change.",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: `1.5px solid ${C.gold}`, color: C.gold,
                  fontFamily: SANS, fontSize: 11, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: "clamp(14px,2vw,16px)", color: C.warmGray,
                  lineHeight: 1.5, paddingTop: 4,
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {LEAD_MAGNET && (
            <>
              <div style={{
                height: 1, background: C.warmGray, opacity: 0.15,
                margin: "32px 0",
              }} />
              <p style={{
                fontSize: "clamp(16px,2.4vw,19px)", lineHeight: 1.6,
                color: C.warmGray, marginBottom: 28,
              }}>
                And if you want a real set of eyes on this map — your exact gaps,
                in your voice, with a plan — that's what a call is for.
              </p>
              <a
                href="https://stan.store/DestineePierreArtistry/p/book-a-11-call-with-me-96cslfgn"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn"
                style={{ display: "inline-block", textDecoration: "none" }}
              >
                Book My Free Call →
              </a>
            </>
          )}
        </div>
      </div>

      {/* ── Olive closing section ── */}
      <div style={{ background: C.oliveDark }}>
        <div style={{
          maxWidth: 820, margin: "0 auto",
          padding: "clamp(40px,6vw,64px) clamp(24px,6vw,64px)",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: DISPLAY, fontStyle: "italic",
            fontSize: "clamp(20px,3.5vw,28px)", color: C.cream,
            lineHeight: 1.3, marginBottom: 36,
          }}>
            "You don't rise to the level of your goals.<br />
            You fall to the level of your identity."
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="primary-btn" onClick={() => window.print()}>
              Save / Print Results
            </button>
            <button className="ghost-btn"
              style={{ borderColor: C.cream, color: C.cream }}
              onClick={() => { setScores({}); setIdx(0); setEmail(""); setStage("welcome"); }}>
              Start Over
            </button>
          </div>
        </div>
      </div>

      <div id="book" />
    </div>
  );
}
