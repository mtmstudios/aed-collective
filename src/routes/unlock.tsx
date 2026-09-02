import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  createPreviewLink,
  gateStatus,
  lockSite,
  redeemToken,
  unlockSite,
} from "@/lib/gate.functions";

type Suche = { token?: string };

export const Route = createFileRoute("/unlock")({
  validateSearch: (search: Record<string, unknown>): Suche => ({
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  loader: () => gateStatus(),
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

function restdauer(until: number): string {
  const ms = until - Date.now();
  if (ms <= 0) return "abgelaufen";
  const tage = Math.floor(ms / 86400000);
  const stunden = Math.floor((ms % 86400000) / 3600000);
  const minuten = Math.floor((ms % 3600000) / 60000);
  if (tage > 0) return `${tage} Tag${tage === 1 ? "" : "e"}, ${stunden} Std.`;
  if (stunden > 0) return `${stunden} Std., ${minuten} Min.`;
  return `${minuten} Min.`;
}

function Unlock() {
  const router = useRouter();
  const { token } = Route.useSearch();
  const status = Route.useLoaderData();
  const unlock = useServerFn(unlockSite);
  const redeem = useServerFn(redeemToken);
  const linkErzeugen = useServerFn(createPreviewLink);
  const sperren = useServerFn(lockSite);

  const [fehler, setFehler] = useState(false);
  const [laedt, setLaedt] = useState(false);
  const [tokenFehler, setTokenFehler] = useState(false);
  const [tage, setTage] = useState(7);
  const [link, setLink] = useState<string | null>(null);
  const [kopiert, setKopiert] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const res = await redeem({ data: { token } });
      if (res.ok) {
        await router.invalidate();
        await router.navigate({ to: "/" });
      } else {
        setTokenFehler(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  async function onLink() {
    const res = await linkErzeugen({ data: { days: tage } });
    if (res.ok) {
      setKopiert(false);
      setLink(`${window.location.origin}/unlock?token=${encodeURIComponent(res.token)}`);
    }
  }

  const _ = tick;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md">
        <img src="/aed-logo.png" alt="aed e.V." width={500} height={276} className="h-12 w-auto" />
        <h1 className="display-md mt-8">Vorschau</h1>

        {status.unlocked ? (
          <>
            <p className="prose-editorial mt-3">
              Diese Vorschau ist auf diesem Gerät per Cookie entsperrt. Zugriff noch gültig für{" "}
              <strong>{restdauer(status.until)}</strong> (bis{" "}
              {new Date(status.until).toLocaleString("de-DE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              ).
            </p>

            <div className="mt-8 border border-ink p-5">
              <h2 className="eyebrow">Preview-Link erstellen</h2>
              <p className="prose-editorial mt-2 text-sm">
                Zeitlich begrenzter Link mit Token – entsperrt die Vorschau ohne Passwort.
              </p>
              <label htmlFor="tage" className="eyebrow mt-4 block">
                Gültigkeit
              </label>
              <select
                id="tage"
                value={tage}
                onChange={(e) => setTage(Number(e.target.value))}
                className="mt-2 w-full border border-ink bg-card px-4 py-3 font-sans text-base text-foreground outline-none focus:border-brand"
              >
                <option value={1}>1 Tag</option>
                <option value={7}>7 Tage</option>
                <option value={14}>14 Tage</option>
                <option value={30}>30 Tage</option>
                <option value={90}>90 Tage</option>
              </select>
              <button type="button" onClick={onLink} className="btn-solid mt-4">
                Link erzeugen
              </button>

              {link && (
                <div className="mt-4">
                  <textarea
                    readOnly
                    value={link}
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full border border-ink bg-card px-3 py-2 font-sans text-xs text-foreground outline-none"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(link);
                      setKopiert(true);
                    }}
                    className="btn-outline mt-3"
                  >
                    {kopiert ? "Kopiert" : "Link kopieren"}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={async () => {
                await sperren({});
                await router.invalidate();
              }}
              className="btn-outline mt-6"
            >
              Vorschau wieder sperren
            </button>
          </>
        ) : (
          <>
            <p className="prose-editorial mt-3">
              Diese Website ist noch nicht öffentlich. Bitte gib das Passwort ein.
            </p>
            {tokenFehler && (
              <p className="mt-3 font-sans text-sm text-foreground">
                Dieser Preview-Link ist ungültig oder abgelaufen.
              </p>
            )}
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
          </>
        )}
      </div>
    </div>
  );
}
