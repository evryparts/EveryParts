"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const COUNTIES = [
  "Dublin","Cork","Galway","Limerick","Waterford","Antrim","Armagh","Carlow",
  "Cavan","Clare","Derry","Donegal","Down","Fermanagh","Kerry","Kildare",
  "Kilkenny","Laois","Leitrim","Longford","Louth","Mayo","Meath","Monaghan",
  "Offaly","Roscommon","Sligo","Tipperary","Tyrone","Westmeath","Wexford","Wicklow",
];

export default function Sell() {
  const [form, setForm] = useState({
    business_name: "",
    seller_type: "breaker",
    county: "Dublin",
    phone: "",
    email: "",
  });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [errMsg, setErrMsg] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.business_name.trim()) return fail("Add your business or personal name.");
    if (!form.phone.trim()) return fail("Add a phone number so buyers and we can reach you.");
    if (!form.email.trim() || !form.email.includes("@")) return fail("That email doesn't look right.");

    setState("sending");
    const { error } = await supabase.from("sellers").insert({
      business_name: form.business_name.trim(),
      seller_type: form.seller_type,
      county: form.county,
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
    });

    if (error) {
      if (error.code === "23505") return fail("This email is already registered — you're in!");
      return fail("Something went wrong sending the form. Try again in a minute.");
    }
    setState("done");
  };

  const fail = (msg) => {
    setErrMsg(msg);
    setState("error");
  };

  return (
    <div>
      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
          <span className="display" style={{ fontSize: 22, color: "var(--text)" }}>
            EVERYPART<span style={{ color: "var(--orange)" }}>.IE</span>
          </span>
        </a>
      </header>

      <main className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 600 }}>
        <p
          className="display"
          style={{ color: "var(--orange)", fontSize: 14, letterSpacing: 3, margin: "0 0 10px" }}
        >
          FOUNDING SELLERS
        </p>
        <h1 className="display" style={{ fontSize: 38, lineHeight: 1.05, margin: "0 0 12px" }}>
          Sell your parts to all of Ireland
        </h1>
        <p style={{ color: "var(--dim)", fontSize: 15, lineHeight: 1.55, margin: "0 0 8px" }}>
          Breakers yard, garage, or selling parts off one car — sign up now and
          you're in before the doors open.
        </p>
        <p style={{ color: "var(--green)", fontSize: 14, fontWeight: 700, margin: "0 0 26px" }}>
          Founding sellers get free listings and priority placement at launch.
        </p>

        {state === "done" ? (
          <div className="panel" style={{ padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>✓</div>
            <h2 className="display" style={{ fontSize: 26, margin: "8px 0" }}>
              You're in — welcome aboard
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14, lineHeight: 1.5 }}>
              We'll be in touch by email before launch with your seller account
              and how to add your first listings. Anything urgent —{" "}
              <a href="mailto:info@everypart.ie" style={{ color: "var(--orange)" }}>
                info@everypart.ie
              </a>
            </p>
          </div>
        ) : (
          <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="type">I'm selling as a…</label>
              <select id="type" value={form.seller_type} onChange={set("seller_type")}>
                <option value="breaker">Breakers yard / dismantler</option>
                <option value="garage">Garage / mechanic</option>
                <option value="private">Private seller</option>
              </select>
            </div>
            <div>
              <label htmlFor="name">Business / your name</label>
              <input id="name" placeholder="e.g. Dublin Car Breakers" value={form.business_name} onChange={set("business_name")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="county">County</label>
                <select id="county" value={form.county} onChange={set("county")}>
                  {COUNTIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="phone">Phone</label>
                <input id="phone" placeholder="08X XXX XXXX" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.ie" value={form.email} onChange={set("email")} />
            </div>

            {state === "error" && <div className="notice-err">{errMsg}</div>}

            <button className="btn" onClick={submit} disabled={state === "sending"}>
              {state === "sending" ? "SENDING…" : "SIGN UP AS A FOUNDING SELLER"}
            </button>
            <p style={{ fontSize: 12, color: "var(--faint)", margin: 0 }}>
              We'll only use these details to set up your seller account and
              contact you about the launch.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
