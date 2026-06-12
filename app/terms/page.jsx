export const metadata = {
  title: "Terms of Use — EveryPart.ie",
  description: "Terms of use for EveryPart.ie",
};

const h = { fontSize: 22, margin: "34px 0 10px" };
const p = { color: "var(--dim)", fontSize: 15, lineHeight: 1.65, margin: "0 0 14px" };

export default function Terms() {
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
          Terms of <span style={{ color: "var(--orange)" }}>Use</span>
        </h1>
        <p style={{ ...p, color: "var(--faint)", fontSize: 13 }}>Last updated: 12 June 2026</p>

        <p style={p}>
          Welcome to EveryPart.ie ("EveryPart", "we", "us"). These terms apply to your
          use of the EveryPart.ie website. By using the site you agree to them. If you
          don't agree, please don't use the site. You can contact us any time at{" "}
          <a href="mailto:info@everypart.ie">info@everypart.ie</a>.
        </p>

        <h2 className="display" style={h}>1. What EveryPart is</h2>
        <p style={p}>
          EveryPart.ie is an Irish marketplace for car parts, currently in its pre-launch
          phase. Right now the site lets you join our launch mailing list and, if you run
          a breakers yard, garage, or sell parts privately, apply to become a founding
          seller. Features described on the site (such as part search and listings) are
          previews of what's coming and are not yet live services.
        </p>

        <h2 className="display" style={h}>2. The launch list</h2>
        <p style={p}>
          If you join the launch list, you're asking us to email you about the launch of
          EveryPart.ie. You can unsubscribe at any time by emailing us or using the
          unsubscribe option in any email we send.
        </p>

        <h2 className="display" style={h}>3. Founding seller applications</h2>
        <p style={p}>
          Applying to be a founding seller is an application, not a guarantee — we review
          and approve sellers at our discretion. Founding seller benefits (free listings
          and priority placement during the launch period) are as described on the site
          at the time you apply and may be updated for future sellers. We may introduce
          paid plans later; we'll tell you before anything starts costing money.
        </p>
        <p style={p}>
          If you list parts when listings go live, you're responsible for your listings:
          they must be accurate, lawful, and describe parts you actually have the right
          to sell. You keep ownership of your listing content and give us permission to
          display it on EveryPart.ie and in our marketing of the marketplace.
        </p>

        <h2 className="display" style={h}>4. Our role</h2>
        <p style={p}>
          EveryPart is a platform that connects buyers with sellers. When sales go live,
          contracts for parts will be between the buyer and the seller — we're not a
          party to those sales, and we don't inspect, own, or warrant parts listed by
          sellers. Nothing in these terms affects statutory rights that consumers have
          under Irish and EU law.
        </p>

        <h2 className="display" style={h}>5. Acceptable use</h2>
        <p style={p}>
          Don't misuse the site: no unlawful content, no false or misleading
          applications, no attempting to break, scrape, overload, or interfere with the
          site or its security, and no using it to spam or harm others. We can suspend
          or remove access and applications that breach these terms.
        </p>

        <h2 className="display" style={h}>6. Liability</h2>
        <p style={p}>
          The site is provided "as is" during pre-launch. To the fullest extent permitted
          by law, we're not liable for indirect losses arising from your use of the site.
          Nothing in these terms excludes or limits liability that cannot be excluded
          under Irish law, including liability for death or personal injury caused by
          negligence or for fraud.
        </p>

        <h2 className="display" style={h}>7. Changes</h2>
        <p style={p}>
          We may update these terms as the service develops. The "last updated" date at
          the top tells you when they last changed. Significant changes that affect
          founding sellers will be communicated by email.
        </p>

        <h2 className="display" style={h}>8. Governing law</h2>
        <p style={p}>
          These terms are governed by the laws of Ireland, and the Irish courts have
          jurisdiction over any disputes, without affecting any mandatory consumer
          protections that apply where you live.
        </p>

        <p style={{ ...p, marginTop: 30 }}>
          Questions? Email <a href="mailto:info@everypart.ie">info@everypart.ie</a>.
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
