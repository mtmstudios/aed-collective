import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Vorschau – aed e.V." },
      { name: "description", content: "Diese Vorschau ist passwortgeschützt." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Vorschau – aed e.V." },
      { property: "og:description", content: "Diese Vorschau ist passwortgeschützt." },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [fehler, setFehler] = useState(false);
  const [laedt, setLaedt] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setLaedt(true);
    setFehler(false);
    try {
      const res = await unlock({ data: { password } });
      if (res.ok) {
        await router.invalidate();
        await router.navigate({ to: "/" });
      } else {
        setFehler(true);
      }
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md">
        <img src="/aed-logo.png" alt="aed e.V." width={500} height={276} className="h-12 w-auto" />
        <h1 className="display-md mt-8">Vorschau</h1>
        <p className="prose-editorial mt-3">
          Diese Website ist noch nicht öffentlich. Bitte gib das Passwort ein.
        </p>
        <form onSubmit={onSubmit} className="mt-8">
          <label htmlFor="password" className="eyebrow">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full border border-ink bg-card px-4 py-3 font-sans text-base text-foreground outline-none focus:border-brand"
          />
          {fehler && (
            <p className="mt-3 font-sans text-sm text-foreground">Passwort nicht korrekt.</p>
          )}
          <button type="submit" disabled={laedt} className="btn-solid mt-6 disabled:opacity-60">
            {laedt ? "Prüfen …" : "Ansehen"}
          </button>
        </form>
      </div>
    </div>
  );
}
