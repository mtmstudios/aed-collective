import type { ErrorComponentProps } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { isUnlocked } from "@/lib/gate.functions";
import { ladeBildnachweise } from "@/lib/bildnachweise.functions";
import { BildnachweisProvider } from "@/data/bildnachweise";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-ink hover:text-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-ink hover:text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-brand bg-transparent px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-ink hover:text-background"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith("/unlock")) return;
    const { unlocked } = await isUnlocked();
    if (!unlocked) throw redirect({ to: "/unlock", search: { ziel: location.pathname } });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "aed e.V. – Architecture Engineering Design Stuttgart" },
      {
        name: "description",
        content:
          "Veranstaltungen, Austausch, Förderung: Der aed e.V. Stuttgart verbindet Architektur, Engineering und Design – inklusive Nachwuchswettbewerb neuland.",
      },
      { name: "author", content: "aed e.V." },
      { property: "og:site_name", content: "aed e.V." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
      // Vorschaubild beim Teilen in LinkedIn, Facebook und WhatsApp. Ohne
      // dieses Bild zeigen die Dienste nur einen grauen Kasten – gerade für
      // die Veranstaltungshinweise des Vereins der sichtbarste Unterschied.
      // Die Adresse muss vollständig sein, relative Pfade werden ignoriert.
      { property: "og:image", content: "https://www.aed-stuttgart.de/teilen-vorschau.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Teilnehmende einer aed-Führung in Warnwesten auf einer Baustelle",
      },
      { name: "twitter:image", content: "https://www.aed-stuttgart.de/teilen-vorschau.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/favicon-180.png", sizes: "180x180" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          // Ohne url, logo und sameAs erkennen Suchmaschinen und Sprachmodelle
          // den Verein nicht als dieselbe Einrichtung wieder, die auf anderen
          // Seiten erwähnt wird. Genau daran hängt, ob der aed in einer Antwort
          // namentlich genannt und verlinkt wird.
          "@id": "https://www.aed-stuttgart.de/#organisation",
          name: "aed e.V.",
          legalName:
            "aed Verein zur Förderung von Architektur, Engineering und Design in Stuttgart e.V.",
          url: "https://www.aed-stuttgart.de",
          logo: "https://www.aed-stuttgart.de/aed-logo.png",
          image: "https://www.aed-stuttgart.de/teilen-vorschau.jpg",
          description: "Verein für Architektur, Engineering und Design in Stuttgart",
          foundingDate: "2004",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Olgastraße 138",
            postalCode: "70180",
            addressLocality: "Stuttgart",
            addressCountry: "DE",
          },
          telephone: "+49 160 8894377",
          email: "info@aed-stuttgart.de",
          sameAs: [
            "https://www.facebook.com/aedStuttgart",
            "https://www.instagram.com/aed_stuttgart/",
            "https://www.linkedin.com/in/aed-stuttgart-e-v-421977101",
          ],
        }),
      },
    ],
  }),
  // Fotonachweise einmal je Seitenaufruf aus dem Bildverzeichnis holen
  loader: () => ladeBildnachweise(),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { nachweise, gesperrt } = Route.useLoaderData();
  const istGate = useRouterState({
    select: (s) => s.location.pathname.startsWith("/unlock"),
  });

  if (istGate) {
    return (
      <QueryClientProvider client={queryClient}>
        <main id="inhalt">
          <Outlet />
        </main>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BildnachweisProvider werte={nachweise} gesperrt={gesperrt}>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </BildnachweisProvider>
    </QueryClientProvider>
  );
}
