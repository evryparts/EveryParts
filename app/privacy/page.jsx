export const metadata = {
  title: "Privacy Policy — EveryPart.ie",
  description: "How EveryPart.ie collects and uses your data",
};

const h = { fontSize: 22, margin: "34px 0 10px" };
const p = { color: "var(--dim)", fontSize: 15, lineHeight: 1.65, margin: "0 0 14px" };

export default function Privacy() {
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
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <span
            className="display"
            style={{ background: "var(--orange)", color: "var(--bg)", fontSize: 20, padding: "1px 9px", borderRadius: 4 }}
          >
            EP
          </span>
          <span className="display" style={{ fontSize: 22 }}>
            EVERYPART<span style={{ color: "var(--orange)" }}>.IE</span>
          </span>
        </a>
        <a href="/" style={{ marginLeft: "auto", color: "var(--dim)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          ← Back to home
        </a>
      </header>

      <main className="container" style={{ paddingTop: 44, paddingBottom: 80, maxWidth: 720 }}>
        <h1 className="display" style={{ fontSize: 38, margin: "0 0 6px" }}>
          Privacy <span style={{ color: "var(--orange)" }}>Policy</span>
        </h1>
        <p style={{ ...p, color: "var(--faint)", fontSize: 13 }}>Last updated: 12 June 2026</p>

        <p style={p}>
          EveryPart.ie ("we", "us") is an Irish car parts marketplace, currently in
          pre-launch. This policy explains what personal data we collect, why, and the
          rights you have over it under the EU General Data Protection Regulation
          (GDPR). The data controller is EveryPart.ie, contactable at{" "}
          <a href="mailto:info@everypart.ie">info@everypart.ie</a>.
        </p>

        <h2 className="display" style={h}>1. What we collect and why</h2>
        <p style={p}>
          <strong>Launch list:</strong> if you join the launch list we collect your email
          address, used only to tell you about the launch of EveryPart.ie. Legal basis:
          your consent. You can withdraw it any time by emailing us or unsubscribing.
        </p>
        <p style={p}>
          <strong>Founding seller applications:</strong> if you apply as a seller we
          collect your business name, seller type, county, phone number, and email
          address, used to review your application and set up your seller account at
          launch. Legal basis: taking steps at your request before entering a contract.
        </p>
        <p style={p}>
          <strong>Part alerts:</strong> if you set up a part alert we collect your email
          and the details of the part and car you're looking for, used to notify you
          about matching parts. Legal basis: your consent.
        </p>
        <p style={p}>
          <strong>Reg lookups:</strong> when you type a registration number on our
          homepage it is read in your browser to show the year and county — it is not
          sent to or stored on our servers.
        </p>

        <h2 className="display" style={h}>2. Where your data lives</h2>
        <p style={p}>
          Your data is stored in our database hosted by Supabase in the eu-west-1 region
          (Dublin, Ireland), so it stays in the EU. Our website is served by Vercel,
          which processes technical data (such as IP addresses in server logs) to
          deliver the site; this may involve transfers outside the EU protected by
          standard contractual clauses. We use these companies as data processors — we
          do not sell your data or share it with advertisers.
        </p>

        <h2 className="display" style={h}>3. Cookies</h2>
        <p style={p}>
          We don't use advertising or analytics tracking cookies on this site. If that
          changes, we'll update this policy and ask for consent where required.
        </p>

        <h2 className="display" style={h}>4. How long we keep data</h2>
        <p style={p}>
          Launch list emails are kept until launch communications are complete or you
          unsubscribe, whichever is sooner. Seller application data is kept while your
          application or account is active. You can ask us to delete your data at any
          time (see your rights below).
        </p>

        <h2 className="display" style={h}>5. Your rights</h2>
        <p style={p}>
          Under the GDPR you can ask us for access to your data, correction, deletion,
          restriction of processing, data portability, and you can object to processing
          or withdraw consent at any time. To use any of these rights, email{" "}
          <a href="mailto:info@everypart.ie">info@everypart.ie</a> and we'll respond
          within one month. You also have the right to complain to the Data Protection
          Commission (Ireland's supervisory authority) at{" "}
          <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">
            dataprotection.ie
          </a>.
        </p>

        <h2 className="display" style={h}>6. Changes to this policy</h2>
        <p style={p}>
          As EveryPart launches new features (seller accounts, search, payments), this
          policy will be updated to cover them. The "last updated" date at the top shows
          the current version.
        </p>

        <p style={{ ...p, marginTop: 30 }}>
          Questions about your data? Email{" "}
          <a href="mailto:info@everypart.ie">info@everypart.ie</a>.
        </p>
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
        <a href="/terms" style={{ color: "var(--faint)" }}>Terms</a>
        <a href="/privacy" style={{ color: "var(--faint)" }}>Privacy</a>
        <a href="mailto:info@everypart.ie" style={{ color: "var(--faint)" }}>info@everypart.ie</a>
      </footer>
    </div>
  );
}
