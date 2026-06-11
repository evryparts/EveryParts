import "./globals.css";

export const metadata = {
  title: "EveryPart.ie — Every part. Every Irish car. One search.",
  description:
    "Ireland's new car parts marketplace. Used parts from breakers nationwide and brand-new parts shipped to your door — matched to your exact car. Launching soon.",
  metadataBase: new URL("https://everypart.ie"),
  openGraph: {
    title: "EveryPart.ie — launching soon",
    description:
      "Every part for every Irish car, in one search. Join the launch list or list your parts as a founding seller.",
    locale: "en_IE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;800&family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
