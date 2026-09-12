import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Motsense — Roads That Sense.",
    template: "%s — Motsense",
  },
  description:
    "Motsense turns roads into distributed sensing networks. Real-time traffic intelligence from the road itself — hardware, cloud platform, and developer API.",
  metadataBase: new URL("https://motsense.com"),
  openGraph: {
    title: "Motsense — Roads That Sense.",
    description:
      "Real-time traffic intelligence from the road itself. Sensing hardware, cloud platform, and a developer-friendly API.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50 text-ink-900">{children}</body>
    </html>
  );
}
