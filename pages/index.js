import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────
// BECOME HER ANYWAY™ — THE 8-AREA LIFE AUDIT
//
// ⚙️ ONE SETTING — flip depending on where the tool lives:
//   true  = LEAD MAGNET (cold traffic): captures email, routes to a call
//   false = CLIENT DIAGNOSTIC (inside program): no email, gives a 7-day plan
// ─────────────────────────────────────────────────────────────
const LEAD_MAGNET = true;

// ⚙️ Replace with your Calendly / TidyCal link
const BOOKING_URL = "#book";

const C = {
  ink: "#1a1416",
  paper: "#f7f0ea",
  blush: "#e8c4c0",
  rose: "#c97b84",
  wine: "#7a3b47",
  gold: "#c9a356",
  soft: "#efe2da",
  muted: "#6a5b5f",
};

const DISPLAY = "'Playfair Display', Georgia, serif";
const BODY = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Jost', 'Century Gothic', sans-serif";

const AREAS = [
  {
    key: "self",
    name: "Self & Identity",
    tag: "Who you believe you are",
    prompt:
      "How aligned do you feel with the woman you're becoming — not who you were, who you ARE now?",
    low: "You're still answering to an old version of yourself.",
    high: "You move like her. You've already decided.",
  },
  {
    key: "mindset",
    name: "Mindset & Beliefs",
    tag: "The stories running the show",
    prompt:
      "When something hard happens, how quickly do you return to belief instead of spiraling?",
    low: "The doubt gets the first and last word.",
    high: "You catch the story and rewrite it on the spot.",
  },
  {
    key: "health",
    name: "Health & Energy",
    tag: "The body that carries the vision",
    prompt:
      "How well is your physical energy supporting the life and pace you actually want?",
    low: "You're running on fumes and willpower.",
    high: "Your body is an asset, not an obstacle.",
  },
  {
    key: "money",
    name: "Money & Wealth",
    tag: "Your relationship with receiving",
    prompt:
      "How in-control and expansive do you feel about money — earning it, keeping it, growing it?",
    low: "Money feels like something that happens TO you.",
    high: "You direct it. You expect more of it.",
  },
  {
    key: "work",
    name: "Work & Purpose",
    tag: "The thing you're here to build",
    prompt:
      "How much does your daily work reflect the mission you actually care about?",
    low: "You're busy, but not aimed at anything.",
    high: "Most of your effort points at the real vision.",
  },
  {
    key: "relationships",
    name: "Love & Relationships",
    tag: "Who gets close to you",
    prompt:
      "How nourished and seen do you feel by the closest relationships in your life?",
    low: "You give more than you get back.",
    high: "Your circle reflects who you're becoming.",
  },
  {
    key: "growth",
    name: "Growth & Learning",
    tag: "Your rate of becoming",
    prompt:
      "How intentionally are you growing — learning, stretching, being mentored — right now?",
    low: "You've been coasting on what you already know.",
    high: "You're in active expansion, on purpose.",
  },
  {
    key: "environment",
    name: "Space & Environment",
    tag: "The room you decide in",
    prompt:
      "How much do your physical spaces and daily inputs support the woman you're becoming?",
    low: "Your environment fights your future self.",
    high: "Everything around you agrees with the vision.",
  },
];

function tier(avg) {
  if (avg >= 8.5)
    return {
      word: "Sovereign",
      note: "She's already her. Now you protect and expand it.",
    };
  if (avg >= 7)
    return {
      word: "Ascending",
      note: "The momentum is real. Time to remove the few drags.",
    };
  if (avg >= 5)
    return {
      word: "Becoming",
      note: "You're in the messy, powerful middle. This is the work.",
    };
  if (avg >= 3)
    return {
      word: "Awakening",
      note: "Something in you knows it's time. Good — let's aim it.",
    };
  return {
    word: "The Threshold",
    note: "You're standing at the start. Honest scores are the bravest start.",
  };
}

function SectionTitle({ children }) {
  return (
    <h3
      style={{
        fontFamily: DISPLAY,
        fontSize: "clamp(24px,4.5vw,36px)",
        fontWeight: 700,
        margin: "0 0 8px",
        borderTop: `1px solid ${C.blush}`,
        paddingTop: 28,
      }}
    >
      {children}
    </h3>
  );
}

function Step({ n, children }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <span
        style={{
          color: C.blush,
          fontFamily: DISPLAY,
          fontStyle: "italic",
          fontSize: 18,
        }}
      >
        {n}.
      </span>
      <span>{children}</span>
    </div>
  );
}

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      input::placeholder { color: #c9a9a3; opacity: 1; }
      @media print { button { display: none !important; } }
    `}</style>
  );
}

export default function LifeAudit() {
  const [stage, setStage] = useState("welcome"); // welcome | audit | gate | results
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({});

  const current = AREAS[idx];
  const answered = Object.keys(scores).length;
  const progress = Math.round((answered / AREAS.length) * 100);
  const setScore = (k, v) => setScores((s) => ({ ...s, [k]: v }));

  const goNext = () => {
    if (idx < AREAS.length - 1) setIdx(idx + 1);
    else setStage(LEAD_MAGNET ? "gate" : "results");
  };
  const goBack = () => (idx > 0 ? setIdx(idx - 1) : setStage("welcome"));

  const values = AREAS.map((a) => scores[a.key] || 0);
  const avg = values.reduce((a, b) => a + b, 0) / AREAS.length;
  const sorted = [...AREAS].sort(
    (a, b) => (scores[a.key] || 0) - (scores[b.key] || 0)
  );
  const focus = sorted.slice(0, 3);
  const strengths = [...sorted].reverse().slice(0, 2);
  const t = tier(avg);

  const book = () =>
    BOOKING_URL === "#book"
      ? document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })
      : window.open(BOOKING_URL, "_blank");

  const submitLead = async () => {
    setSubmitting(true);
    const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (url) {
      try {
        // no-cors: response is opaque but the data arrives at Apps Script
        await fetch(url, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ name, email, scores, avg }),
        });
      } catch {
        // Never block the user from seeing their results
      }
    }
    setSubmitting(false);
    setStage("results");
  };

  const wrap = {
    minHeight: "100vh",
    background: `radial-gradient(circle at 20% 10%, ${C.soft} 0%, ${C.paper} 45%)`,
    color: C.ink,
    fontFamily: BODY,
  };
  const inner = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "clamp(28px,6vw,72px) clamp(20px,5vw,48px)",
  };
  const kicker = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: "0.42em",
    textTransform: "uppercase",
    color: C.rose,
    fontWeight: 500,
  };
  const btn = (filled = true) => ({
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    padding: "16px 38px",
    borderRadius: 2,
    cursor: "pointer",
    border: `1px solid ${C.wine}`,
    background: filled ? C.wine : "transparent",
    color: filled ? C.paper : C.wine,
    transition: "all .25s ease",
    fontWeight: 500,
  });

  const radar = () => {
    const size = 320,
      c = size / 2,
      r = c - 48;
    const pts = AREAS.map((a, i) => {
      const ang = (Math.PI * 2 * i) / AREAS.length - Math.PI / 2;
      const v = (scores[a.key] || 0) / 10;
      return {
        x: c + Math.cos(ang) * r * v,
        y: c + Math.sin(ang) * r * v,
        ox: c + Math.cos(ang) * r,
        oy: c + Math.sin(ang) * r,
        lx: c + Math.cos(ang) * (r + 30),
        ly: c + Math.sin(ang) * (r + 30),
        a,
      };
    });
    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: "100%", maxWidth: 360 }}
      >
        {[0.25, 0.5, 0.75, 1].map((ring, i) => (
          <polygon
            key={i}
            points={AREAS.map((a, j) => {
              const ang = (Math.PI * 2 * j) / AREAS.length - Math.PI / 2;
              return `${c + Math.cos(ang) * r * ring},${
                c + Math.sin(ang) * r * ring
              }`;
            }).join(" ")}
            fill="none"
            stroke={C.blush}
            strokeWidth="1"
            opacity={0.5}
          />
        ))}
        {pts.map((p, i) => (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={p.ox}
            y2={p.oy}
            stroke={C.blush}
            strokeWidth="1"
            opacity={0.4}
          />
        ))}
        <polygon
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={C.rose}
          fillOpacity="0.28"
          stroke={C.wine}
          strokeWidth="2"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={C.wine} />
        ))}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            fontSize="8.5"
            fontFamily={SANS}
            fill={C.ink}
            textAnchor={
              Math.abs(p.lx - c) < 8 ? "middle" : p.lx > c ? "start" : "end"
            }
            dominantBaseline="middle"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            {p.a.name.split(" & ")[0]}
          </text>
        ))}
      </svg>
    );
  };

  // ───── WELCOME ─────
  if (stage === "welcome") {
    return (
      <div style={wrap}>
        <Fonts />
        <div
          style={{
            ...inner,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={kicker}>Become Her Anyway™</div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(44px,9vw,88px)",
              lineHeight: 0.98,
              margin: "22px 0 8px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            The 8-Area
            <br />
            <em style={{ color: C.wine, fontStyle: "italic" }}>Life Audit</em>
          </h1>
          <p
            style={{
              fontSize: "clamp(18px,3vw,23px)",
              lineHeight: 1.5,
              maxWidth: 480,
              margin: "18px 0 6px",
              color: "#4a3c40",
            }}
          >
            You can't become her by accident. In the next ten honest minutes,
            you'll see exactly where your life agrees with the vision — and
            where it's quietly holding you back.
          </p>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              letterSpacing: "0.05em",
              color: C.rose,
              margin: "8px 0 36px",
            }}
          >
            8 areas · ~10 minutes · scored, mapped & turned into a plan
          </p>
          <div style={{ marginBottom: 30 }}>
            <label
              style={{ ...kicker, display: "block", marginBottom: 10 }}
            >
              First, your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Her name is…"
              style={{
                fontFamily: DISPLAY,
                fontSize: 26,
                fontStyle: "italic",
                background: "transparent",
                border: "none",
                borderBottom: `1.5px solid ${C.rose}`,
                color: C.ink,
                padding: "8px 2px",
                width: "min(100%,380px)",
                outline: "none",
              }}
            />
          </div>
          <div>
            <button
              style={btn(true)}
              onClick={() => setStage("audit")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.ink)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = C.wine)
              }
            >
              Begin the Audit →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── AUDIT ─────
  if (stage === "audit") {
    const val = scores[current.key] || 0;
    return (
      <div style={wrap}>
        <Fonts />
        <div style={inner}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <span style={kicker}>
              0{idx + 1}{" "}
              <span style={{ color: C.blush }}>/ 08</span>
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: "0.2em",
                color: C.rose,
              }}
            >
              {progress}% COMPLETE
            </span>
          </div>
          <div
            style={{
              height: 2,
              background: C.soft,
              marginBottom: 48,
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: C.wine,
                transition: "width .4s ease",
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ ...kicker, color: C.rose }}>{current.tag}</div>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(34px,7vw,58px)",
              lineHeight: 1.02,
              margin: "12px 0 22px",
              fontWeight: 700,
            }}
          >
            {current.name}
          </h2>
          <p
            style={{
              fontSize: "clamp(19px,3.4vw,25px)",
              lineHeight: 1.45,
              color: "#3f3236",
              maxWidth: 560,
              marginBottom: 40,
            }}
          >
            {current.prompt}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: SANS,
              fontSize: 11.5,
              color: C.rose,
              marginBottom: 14,
              maxWidth: 560,
            }}
          >
            <span style={{ maxWidth: 150 }}>{current.low}</span>
            <span style={{ maxWidth: 150, textAlign: "right" }}>
              {current.high}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "clamp(4px,1.4vw,10px)",
              maxWidth: 560,
              marginBottom: 44,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setScore(current.key, n)}
                style={{
                  flex: 1,
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: `1.5px solid ${n <= val ? C.wine : C.blush}`,
                  background: n <= val ? C.wine : "transparent",
                  color: n <= val ? C.paper : C.rose,
                  fontFamily: SANS,
                  fontSize: "clamp(11px,2.4vw,15px)",
                  cursor: "pointer",
                  transition: "all .18s ease",
                  fontWeight: 500,
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button style={btn(false)} onClick={goBack}>
              ← Back
            </button>
            <button
              style={{
                ...btn(true),
                opacity: val ? 1 : 0.4,
                pointerEvents: val ? "auto" : "none",
              }}
              onClick={goNext}
            >
              {idx < AREAS.length - 1 ? "Next →" : "See My Results →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── EMAIL GATE (lead-magnet mode only) ─────
  if (stage === "gate") {
    const valid = /\S+@\S+\.\S+/.test(email);
    return (
      <div style={wrap}>
        <Fonts />
        <div
          style={{
            ...inner,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={kicker}>One step from your results</div>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(34px,7vw,60px)",
              lineHeight: 1.02,
              margin: "16px 0 14px",
              fontWeight: 700,
            }}
          >
            Where should I send
            <br />
            <em style={{ color: C.wine, fontStyle: "italic" }}>her</em>{" "}
            results?
          </h2>
          <p
            style={{
              fontSize: "clamp(18px,3vw,22px)",
              color: "#4a3c40",
              maxWidth: 480,
              lineHeight: 1.45,
              marginBottom: 30,
            }}
          >
            Drop your email and I'll show your full map right now — plus send
            you the one move that closes your biggest gap, so you actually use
            it.
          </p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && valid && !submitting && submitLead()}
            placeholder="you@email.com"
            type="email"
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              fontStyle: "italic",
              background: "transparent",
              border: "none",
              borderBottom: `1.5px solid ${C.rose}`,
              color: C.ink,
              padding: "8px 2px",
              width: "min(100%,420px)",
              outline: "none",
              marginBottom: 30,
            }}
          />
          <div>
            <button
              style={{
                ...btn(true),
                opacity: valid && !submitting ? 1 : 0.4,
                pointerEvents: valid && !submitting ? "auto" : "none",
              }}
              onClick={submitLead}
            >
              {submitting ? "Saving…" : "Show My Results →"}
            </button>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: C.muted,
                marginTop: 16,
              }}
            >
              NO SPAM · UNSUBSCRIBE ANYTIME · JUST HER WORK
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ───── RESULTS ─────
  return (
    <div style={wrap}>
      <Fonts />
      <div style={inner}>
        <div style={kicker}>
          {name ? `${name}'s Audit` : "Your Audit"} · Become Her Anyway™
        </div>
        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(38px,8vw,74px)",
            lineHeight: 1,
            margin: "16px 0 4px",
            fontWeight: 700,
          }}
        >
          You are{" "}
          <em style={{ color: C.wine, fontStyle: "italic" }}>{t.word}</em>.
        </h1>
        <p
          style={{
            fontSize: "clamp(18px,3vw,23px)",
            color: "#4a3c40",
            maxWidth: 520,
            lineHeight: 1.45,
            marginBottom: 8,
          }}
        >
          {t.note}
        </p>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 13,
            letterSpacing: "0.1em",
            color: C.rose,
            marginBottom: 40,
          }}
        >
          OVERALL ALIGNMENT · {avg.toFixed(1)} / 10
        </p>

        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 48px" }}>
          {radar()}
        </div>

        <SectionTitle>What's already working</SectionTitle>
        <p style={{ fontSize: 18, color: "#4a3c40", marginBottom: 20 }}>
          Don't skip past these. Your highest areas are the proof that you can
          move a number — and the foundation everything else gets built on.
        </p>
        {strengths.map((a) => (
          <div
            key={a.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 0",
              borderBottom: `1px solid ${C.soft}`,
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 30,
                fontWeight: 700,
                color: C.gold,
                minWidth: 44,
              }}
            >
              {scores[a.key]}
            </div>
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {a.name}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: C.muted,
                  fontStyle: "italic",
                }}
              >
                {a.tag}
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 44 }}>
          <SectionTitle>Your 3 focus areas</SectionTitle>
          <p style={{ fontSize: 18, color: "#4a3c40", marginBottom: 20 }}>
            These are your lowest three. Not your failures — your leverage. A
            two-point lift in any one of these will change how the whole map
            feels.
          </p>
        </div>
        {focus.map((a, i) => (
          <div
            key={a.key}
            style={{
              display: "flex",
              gap: 18,
              padding: "20px 0",
              borderBottom: `1px solid ${C.soft}`,
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 46,
                fontWeight: 700,
                color: C.rose,
                lineHeight: 1,
                minWidth: 54,
              }}
            >
              0{i + 1}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {a.name}
                </span>
                <span
                  style={{ fontFamily: SANS, fontSize: 12, color: C.rose }}
                >
                  scored {scores[a.key]}/10
                </span>
              </div>
              <p
                style={{
                  fontSize: 17.5,
                  color: "#4a3c40",
                  lineHeight: 1.4,
                  margin: "6px 0 0",
                }}
              >
                {a.low}
              </p>
            </div>
          </div>
        ))}

        {/* next step block */}
        <div
          style={{
            marginTop: 48,
            padding: "clamp(24px,5vw,40px)",
            background: C.ink,
            color: C.paper,
            borderRadius: 4,
          }}
        >
          <div style={{ ...kicker, color: C.blush }}>Your Next Step</div>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(26px,5vw,40px)",
              lineHeight: 1.05,
              margin: "12px 0 18px",
              fontWeight: 700,
            }}
          >
            The one move for the next 7 days
          </h3>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.5,
              color: "#e8dcd6",
              marginBottom: 18,
            }}
          >
            Don't try to fix all three at once — that's how women stay stuck.
            Pick{" "}
            <em style={{ color: C.blush }}>{focus[0].name}</em> only. This
            week, choose one small, visible action that the higher-scoring
            version of you would take without thinking. Do it before you feel
            ready.
          </p>
          <div
            style={{
              display: "grid",
              gap: 10,
              fontFamily: SANS,
              fontSize: 14.5,
              color: "#e8dcd6",
              marginBottom: LEAD_MAGNET ? 26 : 0,
            }}
          >
            <Step n="1">
              Name the ONE action in {focus[0].name.split(" & ")[0]} you've
              been avoiding.
            </Step>
            <Step n="2">
              Schedule it. A vision with no date is just a wish.
            </Step>
            <Step n="3">
              Tell one person — accountability is identity made public.
            </Step>
            <Step n="4">
              Re-take this audit in 30 days and watch the shape change.
            </Step>
          </div>
          {LEAD_MAGNET && (
            <>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "#e8dcd6",
                  marginBottom: 22,
                }}
              >
                And if you want a real set of eyes on this map — your exact
                gaps, in your voice, with a plan — that's what a call is for.
                No pressure, no pitch you didn't ask for. Just an honest
                conversation about her.
              </p>
              <button
                style={{
                  ...btn(true),
                  border: `1px solid ${C.blush}`,
                  background: C.blush,
                  color: C.ink,
                }}
                onClick={book}
              >
                Book My Free Call →
              </button>
            </>
          )}
        </div>

        {/* closing */}
        <div style={{ marginTop: 44, textAlign: "center" }}>
          <p
            style={{
              fontFamily: DISPLAY,
              fontStyle: "italic",
              fontSize: "clamp(22px,4vw,30px)",
              color: C.wine,
              marginBottom: 6,
              lineHeight: 1.2,
            }}
          >
            "You don't rise to the level of your goals.
            <br />
            You fall to the level of your identity."
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <button style={btn(true)} onClick={() => window.print()}>
              Save / Print My Results
            </button>
            <button
              style={btn(false)}
              onClick={() => {
                setScores({});
                setIdx(0);
                setEmail("");
                setStage("welcome");
              }}
            >
              Start Over
            </button>
          </div>
        </div>

        <div id="book" />
      </div>
    </div>
  );
}
