import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import styles from "./tailwind.css";
import Navigation from "./navigation";
import Footer from "./footer";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      integrity:
        "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV",
      crossOrigin: "anonymous",
    },
    { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32/32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16/16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
};

export default function App() {
  const location = useLocation();

  const canonicalPath = location.pathname.endsWith("/")
    ? location.pathname.slice(0, -1)
    : location.pathname;
  const canonical = `https://www.algobreath.com${canonicalPath}`;

  const ogImage = "https://www.algobreath.com/og-image.png";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:type" content="website" />
        <meta name="og:image" content={ogImage} />
        <meta name="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tomtnar" />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={canonical} />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
