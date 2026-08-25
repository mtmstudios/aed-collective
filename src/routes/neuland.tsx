import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/neuland")({
  component: NeulandLayout,
});

const subnav = [
  { to: "/neuland", label: "Überblick", exact: true },
  { to: "/neuland/wettbewerb", label: "Wettbewerb" },
  { to: "/neuland/teilnahme", label: "Teilnahme" },
  { to: "/neuland/gewinner", label: "Gewinner:innen" },
  { to: "/neuland/jury", label: "Jury" },
  { to: "/neuland/presse", label: "Presse" },
] as const;

export function NeulandSubnav() {
  return (
    <nav aria-label="neuland-Navigation" className="border-b border-ink bg-card">
      <div className="shell flex gap-6 overflow-x-auto py-4">
        {subnav.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: Boolean("exact" in item && item.exact) }}
            className="shrink-0 font-display text-sm link-brand"
            activeProps={{ className: "underline decoration-2 underline-offset-8 text-[var(--brand-deep)]" }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function NeulandLayout() {
  // Auf der Übersichtsseite wird die Subnav direkt unter das Hero-Banner gesetzt
  // (siehe neuland.index.tsx). Auf allen Unterseiten bleibt sie oben.
  const isIndex = useRouterState({
    select: (s) => {
      const p = s.location.pathname;
      return p === "/neuland" || p === "/neuland/";
    },
  });

  return (
    <div className="theme-neuland">
      {!isIndex && <NeulandSubnav />}
      <Outlet />
    </div>
  );
}
