"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const ZONES = [
  { x: 20, y: 95, w: 75, h: 70, label: "Front Bumper" },
  { x: 95, y: 80, w: 105, h: 45, label: "Bonnet" },
  { x: 70, y: 95, w: 30, h: 35, label: "Headlight" },
  { x: 198, y: 52, w: 20, h: 28, label: "Wing Mirror" },
  { x: 205, y: 80, w: 80, h: 85, label: "Front Door" },
  { x: 287, y: 80, w: 75, h: 85, label: "Rear Door" },
  { x: 364, y: 70, w: 70, h: 55, label: "Boot" },
  { x: 425, y: 95, w: 35, h: 35, label: "Rear Light" },
  { x: 420, y: 125, w: 60, h: 45, label: "Rear Bumper" },
  { x: 110, y: 150, w: 60, h: 60, label: "Alloy Wheel" },
  { x: 350, y: 150, w: 60, h: 60, label: "Alloy Wheel" },
];

const ENGINE_ZONES = [
  { x: 30, y: 26, w: 440, h: 24, label: "Radiator" },
  { x: 55, y: 68, w: 90, h: 60, label: "Battery" },
  { x: 170, y: 64, w: 160, h: 120, label: "Engine Cover" },
  { x: 234, y: 84, w: 32, h: 32, label: "Oil Filler Cap" },
  { x: 350, y: 68, w: 95, h: 64, label: "Air Filter Box" },
  { x: 350, y: 144, w: 60, h: 50, label: "Washer Bottle" },
  { x: 58, y: 140, w: 70, h: 54, label: "ECU" },
  { x: 138, y: 148, w: 46, h: 46, label: "Alternator" },
];

// Irish county codes on number plates
const COUNTY_CODES = {
  C: "Cork", CE: "Clare", CN: "Cavan", CW: "Carlow", D: "Dublin",
  DL: "Donegal", G: "Galway", KE: "Kildare", KK: "Kilkenny", KY: "Kerry",
  L: "Limerick", LD: "Longford", LH: "Louth", LM: "Leitrim", LS: "Laois",
  MH: "Meath", MN: "Monaghan", MO: "Mayo", OY: "Offaly", RN: "Roscommon",
  SO: "Sligo", T: "Tipperary", W: "Waterford", WH: "Westmeath",
  WX: "Wexford", WW: "Wicklow",
};

const MAKES = {
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Caddy", "Jetta", "Touran", "Other"],
  Toyota: ["Corolla", "Yaris", "Avensis", "Auris", "RAV4", "C-HR", "Land Cruiser", "Other"],
  Ford: ["Focus", "Fiesta", "Mondeo", "Kuga", "Transit", "Ranger", "Other"],
  Hyundai: ["i30", "i20", "i10", "Tucson", "Santa Fe", "Kona", "Other"],
  Nissan: ["Qashqai", "Juke", "Micra", "Note", "X-Trail", "Leaf", "Other"],
  Skoda: ["Octavia", "Fabia", "Superb", "Kodiaq", "Rapid", "Other"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Other"],
  BMW: ["3 Series", "5 Series", "1 Series", "X3", "X5", "Other"],
  "Mercedes-Benz": ["C-Class", "E-Class", "A-Class", "GLC", "Other"],
  Opel: ["Astra", "Corsa", "Insignia", "Mokka", "Other"],
  Peugeot: ["208", "308", "2008", "3008", "508", "Other"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Other"],
  Kia: ["Sportage", "Ceed", "Rio", "Niro", "Other"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "Other"],
  Other: ["Other"],
};

// Parse an Irish reg: 131-D-12345 / 08-KE-1234 / 142-WX-987
function parseIrishReg(input) {
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, " ").trim();
  const m = cleaned.match(/^(\d{2,3})\s*([A-Z]{1,2})\s*(\d{1,6})$/);
  if (!m) return null;

  const [, yearPart, countyCode, seq] = m;
  const county = COUNTY_CODES[countyCode];
  if (!county) return null;

  let year, half = null;
  if (yearPart.length === 3) {
    // 2013+ format: 131 / 132
    year = 2000 + parseInt(yearPart.slice(0, 2), 10);
    half = yearPart[2] === "1" ? "Jan–Jun" : yearPart[2] === "2" ? "Jul–Dec" : null;
    if (!half) return null;
  } else {
    // 1987–2012 format: two digits
    const yy = parseInt(yearPart, 10);
    year = yy >= 87 ? 1900 + yy : 2000 + yy;
  }
  if (year < 1987 || year > new Date().getFullYear() + 1) return null;

  return { year, half, county, seq, reg: `${yearPart}-${countyCode}-${seq}` };
}

const STEPS = [
  { n: "1", title: "Type your reg", text: "We read the year and county straight off the plate." },
  { n: "2", title: "Tap the part", text: "Your car appears — tap the bumper, door, light, whatever you need." },
  { n: "3", title: "Compare prices", text: "Used parts from breakers nationwide beside brand-new, side by side." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("body");

  const [alertEmail, setAlertEmail] = useState("");
  const [alertState, setAlertState] = useState("idle");

  const [regInput, setRegInput] = useState("");
  const [regInfo, setRegInfo] = useState(null);
  const [regError, setRegError] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const carRef = useRef(null);

  // Gently bring the car into view when it first appears
  useEffect(() => {
    if (regInfo && carRef.current) {
      carRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [regInfo]);

  const lookup = () => {
    const parsed = parseIrishReg(regInput);
    if (!parsed) {
      setRegError(true);
      setRegInfo(null);
      setSelected(null);
      return;
    }
    setRegError(false);
    setRegInfo(parsed);
    setMake("");
    setModel("");
    setSelected(null);
    setView("body");
    setAlertState("idle");
  };

  const saveAlert = async () => {
    const clean = alertEmail.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setAlertState("error");
      return;
    }
    setAlertState("sending");
    const { error } = await supabase.from("part_alerts").insert({
      email: clean,
      part_category: selected,
      car_make: make || null,
      car_model: model && model !== "Other" ? model : null,
      car_year: regInfo ? regInfo.year : null,
    });
    if (error && error.code !== "23505") {
      setAlertState("error");
      return;
    }
    setAlertState("done");
  };

  const join = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setState("error");
      return;
    }
    setState("sending");
    const { error } = await supabase.from("launch_signups").insert({ email: clean });
    if (error && error.code !== "23505") {
      setState("error");
      return;
    }
    setState("done");
  };

  const carLabel = regInfo
    ? `${regInfo.year}${regInfo.half ? " (" + regInfo.half + ")" : ""}${make ? " " + make : ""}${model && model !== "Other" ? " " + model : ""} · ${regInfo.county} reg`
    : null;

  return (
    <div>
      <style>{`
        @keyframes epFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        .ep-reveal { animation: epFadeUp .45s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .ep-reveal { animation: none; }
        }
      `}</style>

      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          className="display"
          style={{
            background: "var(--orange)",
            color: "var(--bg)",
            fontSize: 20,
            padding: "1px 9px",
            borderRadius: 4,
          }}
        >
          EP
        </div>
        <span className="display" style={{ fontSize: 22 }}>
          EVERYPART<span style={{ color: "var(--orange)" }}>.IE</span>
        </span>
        <a
          href="/sell"
          style={{
            marginLeft: "auto",
            color: "var(--dim)",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sell parts →
        </a>
      </header>

      <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <p
          className="display"
          style={{
            color: "var(--orange)",
            fontSize: 15,
            letterSpacing: 3,
            margin: "0 0 10px",
          }}
        >
          LAUNCHING SOON ACROSS IRELAND
        </p>

        <h1 className="display" style={{ fontSize: 48, lineHeight: 1.05, margin: "0 0 14px" }}>
          Every part. Every Irish car.
          <br />
          <span style={{ color: "var(--orange)" }}>One search.</span>
        </h1>

        <p style={{ color: "var(--dim)", fontSize: 17, lineHeight: 1.55, margin: "0 0 26px", maxWidth: 560 }}>
          Used parts from breakers nationwide and brand-new parts shipped to
          your door — side by side. No more ringing around.
        </p>

        {/* How it works */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 26,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "12px 14px",
                borderLeft: "3px solid var(--orange)",
                background: "var(--panel, #18212b)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <span
                className="display"
                style={{ color: "var(--orange)", fontSize: 26, lineHeight: 1 }}
              >
                {s.n}
              </span>
              <div>
                <strong style={{ fontSize: 14, display: "block", marginBottom: 2 }}>
                  {s.title}
                </strong>
                <span style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.4 }}>
                  {s.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* LIVE reg reader */}
        <div className="panel" style={{ padding: 22, marginBottom: 18 }}>
          <strong className="display" style={{ fontSize: 17, letterSpacing: 1, color: "var(--orange)" }}>
            START HERE — TYPE YOUR REG
          </strong>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                border: "2px solid var(--line)",
                borderRadius: 8,
                overflow: "hidden",
                flex: "1 1 220px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  background: "#003399",
                  color: "#ffcc00",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                <span>★</span>
                <span>IRL</span>
              </div>
              <input
                value={regInput}
                onChange={(e) => {
                  setRegInput(e.target.value);
                  setRegError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
                placeholder="141-D-12345"
                aria-label="Registration number"
                style={{
                  border: "none",
                  borderRadius: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: 2,
                  color: "var(--bg)",
                  textTransform: "uppercase",
                  background: "#fff",
                }}
              />
            </div>
            <button className="btn" onClick={lookup} style={{ fontSize: 18 }}>
              READ MY REG
            </button>
          </div>

          {!regInfo && !regError && (
            <p style={{ fontSize: 12, color: "var(--faint)", margin: "10px 0 0" }}>
              Works with any Irish plate from 1987 on — your car appears once
              we've read it.
            </p>
          )}

          {regError && (
            <div className="notice-err" style={{ marginTop: 12 }}>
              That doesn't look like an Irish reg — try the format 141-D-12345 or 08-KE-1234.
            </div>
          )}

          {regInfo && (
            <div className="ep-reveal" style={{ marginTop: 14 }}>
              <div
                style={{
                  background: "#1f3a26",
                  color: "var(--green)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span>✓ READ:</span>
                <span>
                  {regInfo.year}
                  {regInfo.half ? ` (${regInfo.half})` : ""} · {regInfo.county} registered
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div>
                  <label htmlFor="make">Make</label>
                  <select
                    id="make"
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value);
                      setModel("");
                    }}
                  >
                    <option value="">Select make…</option>
                    {Object.keys(MAKES).map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="model">Model</label>
                  <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                    <option value="">{make ? "Select model…" : "Pick make first"}</option>
                    {make && MAKES[make].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "var(--faint)", margin: "10px 0 0" }}>
                At launch, full vehicle details (make, model, engine) will load
                automatically from the reg.
              </p>
            </div>
          )}
        </div>

        {/* Interactive car — appears once a valid reg is read */}
        {regInfo && (
          <div ref={carRef} className="panel ep-reveal" style={{ padding: 20, marginBottom: 30 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <strong className="display" style={{ fontSize: 17, letterSpacing: 1, color: "var(--orange)" }}>
                {hovered || selected
                  ? (hovered || selected).toUpperCase()
                  : `YOUR CAR: ${carLabel.toUpperCase()} — TAP A PART`}
              </strong>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {["body", "engine"].map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setView(v);
                      setHovered(null);
                      setSelected(null);
                      setAlertState("idle");
                    }}
                    className="display"
                    style={{
                      background: view === v ? "var(--orange)" : "transparent",
                      color: view === v ? "var(--bg)" : "var(--dim)",
                      border: "1px solid " + (view === v ? "var(--orange)" : "var(--line)"),
                      borderRadius: 6,
                      padding: "3px 12px",
                      fontSize: 14,
                      letterSpacing: 1,
                      cursor: "pointer",
                    }}
                  >
                    {v === "body" ? "BODY" : "ENGINE BAY"}
                  </button>
                ))}
              </div>
            </div>
            <svg
              viewBox="0 0 500 230"
              style={{ width: "100%", height: "auto", display: "block" }}
              role="img"
              aria-label="Interactive car preview — tap to highlight parts"
            >
              {view === "body" ? (
                <>
                  <path
                    d="M30 160 L35 120 Q40 95 80 92 L120 88 Q140 60 175 55 L300 55 Q345 58 368 75 L420 88 Q460 95 465 125 L468 160 Z"
                    fill="var(--line)"
                    stroke="#3d4f61"
                    strokeWidth="2"
                  />
                  <path d="M150 88 Q160 64 180 62 L240 62 L240 88 Z" fill="#1a2630" />
                  <path d="M250 62 L300 62 Q330 64 348 80 L350 88 L250 88 Z" fill="#1a2630" />
                  <circle cx="140" cy="180" r="32" fill="var(--bg)" stroke="#3d4f61" strokeWidth="3" />
                  <circle cx="140" cy="180" r="14" fill="var(--line)" />
                  <circle cx="380" cy="180" r="32" fill="var(--bg)" stroke="#3d4f61" strokeWidth="3" />
                  <circle cx="380" cy="180" r="14" fill="var(--line)" />
                  <rect x="72" y="100" width="22" height="14" rx="3" fill="#3d4f61" />
                  <rect x="432" y="100" width="20" height="14" rx="3" fill="#552d2d" />
                </>
              ) : (
                <>
                  <rect x="20" y="14" width="460" height="202" rx="16" fill="var(--line)" stroke="#3d4f61" strokeWidth="2" />
                  <rect x="30" y="26" width="440" height="24" rx="5" fill="#1a2630" stroke="#3d4f61" strokeWidth="1.5" />
                  <rect x="68" y="60" width="14" height="10" rx="2" fill="#3d4f61" />
                  <rect x="118" y="60" width="14" height="10" rx="2" fill="#552d2d" />
                  <rect x="55" y="68" width="90" height="60" rx="7" fill="#1a2630" stroke="#3d4f61" strokeWidth="2" />
                  <rect x="170" y="64" width="160" height="120" rx="12" fill="#243240" stroke="#3d4f61" strokeWidth="2" />
                  <line x1="190" y1="130" x2="310" y2="130" stroke="#3d4f61" strokeWidth="3" />
                  <line x1="190" y1="150" x2="310" y2="150" stroke="#3d4f61" strokeWidth="3" />
                  <line x1="190" y1="170" x2="310" y2="170" stroke="#3d4f61" strokeWidth="3" />
                  <circle cx="250" cy="100" r="15" fill="#3d4f61" stroke="#1a2630" strokeWidth="2" />
                  <path d="M350 100 L330 100" stroke="#3d4f61" strokeWidth="8" />
                  <rect x="350" y="68" width="95" height="64" rx="8" fill="#1a2630" stroke="#3d4f61" strokeWidth="2" />
                  <circle cx="365" cy="144" r="6" fill="#3d4f61" />
                  <rect x="350" y="144" width="60" height="50" rx="8" fill="#1d2c3a" stroke="#3d4f61" strokeWidth="2" />
                  <rect x="58" y="140" width="70" height="54" rx="6" fill="#1a2630" stroke="#3d4f61" strokeWidth="2" />
                  <line x1="70" y1="194" x2="70" y2="202" stroke="#3d4f61" strokeWidth="3" />
                  <line x1="85" y1="194" x2="85" y2="202" stroke="#3d4f61" strokeWidth="3" />
                  <line x1="100" y1="194" x2="100" y2="202" stroke="#3d4f61" strokeWidth="3" />
                  <circle cx="161" cy="171" r="23" fill="#1a2630" stroke="#3d4f61" strokeWidth="2" />
                  <circle cx="161" cy="171" r="9" fill="#3d4f61" />
                </>
              )}
              {(view === "body" ? ZONES : ENGINE_ZONES).map((z, i) => (
                <rect
                  key={view + i}
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="6"
                  style={{
                    fill:
                      hovered === z.label || selected === z.label
                        ? "rgba(255,138,0,.35)"
                        : "rgba(255,255,255,0)",
                    stroke:
                      hovered === z.label || selected === z.label
                        ? "var(--orange)"
                        : "transparent",
                    strokeWidth: 2,
                    cursor: "pointer",
                    transition: "all .15s ease",
                  }}
                  onMouseEnter={() => setHovered(z.label)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    setSelected(selected === z.label ? null : z.label);
                    setAlertState("idle");
                  }}
                  aria-label={z.label}
                />
              ))}
            </svg>

            {selected && (
              <div
                className="ep-reveal"
                style={{
                  marginTop: 12,
                  padding: "12px 16px",
                  borderLeft: "3px solid var(--orange)",
                  background: "rgba(255,138,0,.08)",
                  borderRadius: "0 8px 8px 0",
                  fontSize: 14,
                  color: "var(--dim)",
                }}
              >
                <strong style={{ color: "var(--orange)" }}>{selected}</strong> for
                your {carLabel} — searches open at launch. Want first dibs?
                We'll email you the moment one's listed.
                {alertState === "done" ? (
                  <div className="notice-ok" style={{ marginTop: 10 }}>
                    ✓ Alert set — we'll email you when one comes in.
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={alertEmail}
                      onChange={(e) => {
                        setAlertEmail(e.target.value);
                        if (alertState === "error") setAlertState("idle");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && saveAlert()}
                      aria-label="Email for part alert"
                      style={{ flex: "1 1 200px" }}
                    />
                    <button
                      className="btn"
                      onClick={saveAlert}
                      disabled={alertState === "sending"}
                      style={{ fontSize: 14 }}
                    >
                      {alertState === "sending" ? "SETTING…" : "ALERT ME"}
                    </button>
                  </div>
                )}
                {alertState === "error" && (
                  <div className="notice-err" style={{ marginTop: 8 }}>
                    That email didn't go through — check it and try again.
                  </div>
                )}
                <p style={{ fontSize: 11, color: "var(--faint)", margin: "8px 0 0" }}>
                  One email when a match is listed — that's it. See our{" "}
                  <a href="/privacy" style={{ color: "var(--faint)" }}>Privacy Policy</a>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Email capture */}
        <div className="panel" style={{ padding: 24 }}>
          <h2 className="display" style={{ fontSize: 24, margin: "0 0 6px" }}>
            Be first in when we open
          </h2>
          <p style={{ color: "var(--dim)", fontSize: 14, margin: "0 0 16px" }}>
            Leave your email and we'll tell you the moment EveryPart goes live.
            No spam — one email, maybe two.
          </p>

          {state === "done" ? (
            <div className="notice-ok">✓ You're on the list. See you at launch!</div>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && join()}
                aria-label="Email address"
                style={{ flex: "1 1 240px" }}
              />
              <button className="btn" onClick={join} disabled={state === "sending"}>
                {state === "sending" ? "JOINING…" : "JOIN THE LAUNCH LIST"}
              </button>
            </div>
          )}
          {state === "error" && (
            <div className="notice-err" style={{ marginTop: 12 }}>
              That email didn't go through — check it and try again.
            </div>
          )}
          <p style={{ fontSize: 11, color: "var(--faint)", margin: "12px 0 0" }}>
            By joining you consent to us emailing you about the launch. Unsubscribe
            any time. See our <a href="/privacy" style={{ color: "var(--faint)" }}>Privacy Policy</a>.
          </p>
        </div>

        {/* Seller pitch */}
        <div
          className="panel"
          style={{
            padding: 24,
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            borderColor: "var(--orange)",
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <h2 className="display" style={{ fontSize: 22, margin: "0 0 4px" }}>
              Breakers yard or garage?
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14, margin: 0 }}>
              Become a founding seller — free listings, priority placement at
              launch, and your stock in front of all of Ireland.
            </p>
          </div>
          <a className="ghost" href="/sell">
            BECOME A FOUNDING SELLER
          </a>
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "18px 20px",
          fontSize: 12,
          color: "var(--faint)",
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <span>© 2026 EveryPart.ie</span>
        <a href="/terms" style={{ color: "var(--faint)" }}>
          Terms
        </a>
        <a href="/privacy" style={{ color: "var(--faint)" }}>
          Privacy
        </a>
        <a href="mailto:info@everypart.ie" style={{ color: "var(--faint)" }}>
          info@everypart.ie
        </a>
      </footer>
    </div>
  );
}
