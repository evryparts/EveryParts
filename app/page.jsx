"use client";

import { useState } from "react";
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

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [hovered, setHovered] = useState(null);

  const join = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setState("error");
      return;
    }
    setState("sending");
    const { error } = await supabase.from("launch_signups").insert({ email: clean });
    if (error && error.code !== "23505") {
      // 23505 = already signed up — treat as success
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <div>
      {/* Header */}
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

      <main className="container" style={{ paddingTop: 44, paddingBottom: 80 }}>
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

        <h1 className="display" style={{ fontSize: 46, lineHeight: 1.05, margin: "0 0 14px" }}>
          Every part. Every Irish car.
          <br />
          <span style={{ color: "var(--orange)" }}>One search.</span>
        </h1>

        <p style={{ color: "var(--dim)", fontSize: 17, lineHeight: 1.55, margin: "0 0 28px", maxWidth: 560 }}>
          Type your reg. Tap the part on your car. See used parts from breakers
          nationwide and brand-new parts shipped to your door — side by side.
          No more ringing around.
        </p>

        {/* The signature: clickable car teaser */}
        <div className="panel" style={{ padding: 20, marginBottom: 30 }}>
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
              {hovered || "THIS IS HOW IT'LL WORK — TAP A PART"}
            </strong>
            <span style={{ fontSize: 12, color: "var(--faint)" }}>preview</span>
          </div>
          <svg
            viewBox="0 0 500 230"
            style={{ width: "100%", height: "auto", display: "block" }}
            role="img"
            aria-label="Interactive car preview — hover to highlight parts"
          >
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
            {ZONES.map((z, i) => (
              <rect
                key={i}
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx="6"
                style={{
                  fill: hovered === z.label ? "rgba(255,138,0,.35)" : "rgba(255,255,255,0)",
                  stroke: hovered === z.label ? "var(--orange)" : "transparent",
                  strokeWidth: 2,
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
                onMouseEnter={() => setHovered(z.label)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(z.label)}
                aria-label={z.label}
              />
            ))}
          </svg>
        </div>

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
        <a href="mailto:info@everypart.ie" style={{ color: "var(--faint)" }}>
          info@everypart.ie
        </a>
      </footer>
    </div>
  );
}
