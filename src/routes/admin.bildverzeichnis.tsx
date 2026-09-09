import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { BILD_MANIFEST } from "@/data/bild-manifest";
import {
  ladeBildverzeichnis,
  pruefeAdminPasswort,
  speichereBildrecht,
  speichereBildrechteGruppe,
  RECHTEART_OPTIONEN,
  STATUS_LABEL,
  STATUS_OPTIONEN,
  type BildrechtRow,
} from "@/lib/bildrechte.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/bildverzeichnis")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Bildverzeichnis – interne Verwaltung" },
      { name: "description", content: "Interne Erfassung der Bildrechte." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Bildverzeichnis,
});

const KATEGORIEN = ["event", "person", "projekt", "presse", "cover"] as const;
const JAHRGAENGE = ["2019", "2021", "2023", "2025"] as const;
const KAT_LABEL: Record<string, string> = {
  event: "Event",
  person: "Person",
  projekt: "Projekt",
  presse: "Presse",
  cover: "Cover",
};

const urlNachPfad = new Map(BILD_MANIFEST.map((b) => [b.pfad, b.url]));

/** Leitet aus Dateiname/Verwendung den inhaltlichen Zusammenhang (Artikel/Abschnitt) ab. */
function gruppeVon(b: BildrechtRow): { key: string; titel: string; orte: string[] } {
  const basis = b.dateiname.replace(/\.[a-z0-9]+$/i, "").replace(/-\d+$/, "");
  const orte = b.verwendungen ?? [];
  if (b.kategorie === "projekt") {
    return {
      key: `projekt:${b.jahrgang ?? "ohne"}:${basis}`,
      titel: `${basis}${b.jahrgang ? ` · Jahrgang ${b.jahrgang}` : ""}`,
      orte,
    };
  }
  if (orte.length === 1) return { key: `ort:${orte[0]}`, titel: orte[0], orte };
  if (orte.length > 1)
    return {
      key: `mehrfach:${[...orte].sort().join("|")}`,
      titel: `Mehrfach verwendet: ${[...orte].sort().join(", ")}`,
      orte,
    };
  return { key: "ohne", titel: "Aktuell nicht verwendet", orte };
}

type Gruppe = { key: string; titel: string; orte: string[]; bilder: BildrechtRow[] };

function csvFeld(wert: string | null): string {
  return `"${(wert ?? "").replace(/"/g, '""')}"`;
}

function Bildverzeichnis() {
  const [passwort, setPasswort] = useState("");
  const [freigegeben, setFreigegeben] = useState(false);
  const [pwFehler, setPwFehler] = useState(false);
  const [bilder, setBilder] = useState<BildrechtRow[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [kategorie, setKategorie] = useState("alle");
  const [jahrgang, setJahrgang] = useState("alle");
  const [suche, setSuche] = useState("");
  const [offen, setOffen] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const pruefen = useServerFn(pruefeAdminPasswort);
  const laden = useServerFn(ladeBildverzeichnis);
  const speichern = useServerFn(speichereBildrecht);
  const speichernGruppe = useServerFn(speichereBildrechteGruppe);

  useEffect(() => {
    const gespeichert = sessionStorage.getItem("aed-admin-pw");
    if (gespeichert) {
      setPasswort(gespeichert);
      void anmelden(gespeichert);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function anmelden(pw: string) {
    setLaedt(true);
    setPwFehler(false);
    try {
      const res = await pruefen({ data: { passwort: pw } });
      if (!res.ok) {
        setPwFehler(true);
        sessionStorage.removeItem("aed-admin-pw");
        return;
      }
      sessionStorage.setItem("aed-admin-pw", pw);
      setFreigegeben(true);
      const daten = await laden({ data: { passwort: pw } });
      setBilder(daten.bilder);
    } finally {
      setLaedt(false);
    }
  }

  const gefiltert = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return bilder.filter((b) => {
      if (kategorie !== "alle" && b.kategorie !== kategorie) return false;
      if (kategorie === "projekt" && jahrgang !== "alle" && b.jahrgang !== jahrgang) return false;
      if (q && !b.dateiname.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [bilder, kategorie, jahrgang, suche]);

  const geklaert = bilder.filter((b) => b.status === "geklaert").length;

  const gruppen = useMemo<Gruppe[]>(() => {
    const map = new Map<string, Gruppe>();
    for (const b of gefiltert) {
      const g = gruppeVon(b);
      if (!map.has(g.key)) map.set(g.key, { ...g, bilder: [] });
      map.get(g.key)!.bilder.push(b);
    }
    const liste = [...map.values()];
    for (const g of liste) g.bilder.sort((a, b) => a.dateiname.localeCompare(b.dateiname));
    return liste.sort((a, b) => {
      if (a.key === "ohne") return 1;
      if (b.key === "ohne") return -1;
      return a.titel.localeCompare(b.titel, "de");
    });
  }, [gefiltert]);

  function aktualisieren(pfad: string, feld: keyof BildrechtRow, wert: string | null) {
    setBilder((alt) => alt.map((b) => (b.pfad === pfad ? { ...b, [feld]: wert } : b)));
    autosave(pfad, feld, wert);
  }

  async function gruppeUebernehmen(g: Gruppe, feld: keyof BildrechtRow, wert: string | null) {
    const pfade = g.bilder.map((b) => b.pfad);
    setBilder((alt) => alt.map((b) => (pfade.includes(b.pfad) ? { ...b, [feld]: wert } : b)));
    setStatus("Speichert …");
    try {
      await speichernGruppe({ data: { passwort, pfade, werte: { [feld]: wert } } });
      setStatus("Für Gruppe gespeichert");
    } catch {
      setStatus("Speichern fehlgeschlagen");
    }
  }

  const timer = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  function autosave(pfad: string, feld: keyof BildrechtRow, wert: string | null) {
    const key = `${pfad}:${feld}`;
    if (timer.current[key]) clearTimeout(timer.current[key]);
    timer.current[key] = setTimeout(async () => {
      setStatus("Speichert …");
      try {
        await speichern({ data: { passwort, pfad, werte: { [feld]: wert } } });
        setStatus("Automatisch gespeichert");
      } catch {
        setStatus("Speichern fehlgeschlagen");
      }
    }, 600);
  }

  function csvExport() {
    const kopf = [
      "Pfad",
      "Dateiname",
      "Kategorie",
      "Jahrgang",
      "Status",
      "Urheber:in",
      "Rechteart",
      "Quelle",
      "Freigabedatum",
      "Notiz",
      "Verwendungsort",
    ];
    const zeilen = gefiltert.map((b) =>
      [
        b.pfad,
        b.dateiname,
        KAT_LABEL[b.kategorie] ?? b.kategorie,
        b.jahrgang,
        STATUS_LABEL[b.status] ?? b.status,
        b.urheber,
        b.rechteart,
        b.quelle,
        b.freigabedatum,
        b.notiz,
        (b.verwendungen ?? []).join(" | ") || "aktuell nicht verwendet",
      ]
        .map(csvFeld)
        .join(";"),
    );
    const blob = new Blob(["\uFEFF" + [kopf.join(";"), ...zeilen].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bildrechte.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function pdfExport() {
    const gruppen = new Map<string, BildrechtRow[]>();
    for (const b of gefiltert) {
      const key =
        b.kategorie === "projekt"
          ? `Projekt – Jahrgang ${b.jahrgang ?? "ohne"}`
          : (KAT_LABEL[b.kategorie] ?? b.kategorie);
      if (!gruppen.has(key)) gruppen.set(key, []);
      gruppen.get(key)!.push(b);
    }
    const origin = window.location.origin;
    const abschnitte = [...gruppen.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(
        ([titel, liste]) => `
        <h2>${titel} (${liste.length})</h2>
        ${liste
          .map(
            (b) => `<div class="zeile">
              <img src="${origin}${urlNachPfad.get(b.pfad) ?? ""}" />
              <div>
                <strong>${b.dateiname}</strong><br/>
                Status: ${STATUS_LABEL[b.status] ?? b.status}<br/>
                Urheber:in: ${b.urheber || "–"}<br/>
                Rechteart: ${b.rechteart || "–"}<br/>
                Quelle: ${b.quelle || "–"}<br/>
                Freigabedatum: ${b.freigabedatum || "–"}<br/>
                Notiz: ${b.notiz || "–"}<br/>
                Verwendungsort: ${(b.verwendungen ?? []).join(", ") || "aktuell nicht verwendet"}
              </div>
            </div>`,
          )
          .join("")}`,
      )
      .join("");

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8">
      <title>Bildrechte – Stand ${new Date().toLocaleDateString("de-DE")}</title>
      <style>
        body{font-family:system-ui,sans-serif;font-size:11px;margin:24px;color:#111}
        h1{font-size:18px} h2{font-size:14px;margin-top:24px;border-bottom:1px solid #999;page-break-after:avoid}
        .zeile{display:flex;gap:12px;padding:6px 0;border-bottom:1px solid #eee;page-break-inside:avoid}
        img{width:90px;height:70px;object-fit:cover;background:#f2f2f2}
      </style></head><body>
      <h1>Bildrechte – Momentaufnahme vom ${new Date().toLocaleDateString("de-DE")}</h1>
      <p>${gefiltert.length} Bilder</p>${abschnitte}</body></html>`);
    w.document.close();
    w.onload = () => w.print();
  }

  if (!freigegeben) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">Bildverzeichnis – interner Bereich</h1>
        <Input
          type="password"
          placeholder="Passwort"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && anmelden(passwort)}
        />
        {pwFehler && <p className="text-sm text-red-600">Falsches Passwort.</p>}
        <Button onClick={() => anmelden(passwort)} disabled={laedt}>
          {laedt ? "Prüft …" : "Anmelden"}
        </Button>
      </div>
    );
  }

  const aktuell = bilder.find((b) => b.pfad === offen) ?? null;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold">Bildverzeichnis</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {geklaert} von insgesamt {bilder.length} Bildern rechtlich geklärt
        {status && <span className="ml-3">· {status}</span>}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3 border-y py-3">
        <div>
          <Label className="text-xs">Kategorie</Label>
          <select
            className="mt-1 block h-9 rounded border px-2 text-sm"
            value={kategorie}
            onChange={(e) => setKategorie(e.target.value)}
          >
            <option value="alle">Alle</option>
            {KATEGORIEN.map((k) => (
              <option key={k} value={k}>
                {KAT_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
        {kategorie === "projekt" && (
          <div>
            <Label className="text-xs">Jahrgang</Label>
            <select
              className="mt-1 block h-9 rounded border px-2 text-sm"
              value={jahrgang}
              onChange={(e) => setJahrgang(e.target.value)}
            >
              <option value="alle">Alle</option>
              {JAHRGAENGE.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="min-w-[220px] flex-1">
          <Label className="text-xs">Suche (Dateiname)</Label>
          <Input
            className="mt-1"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="z. B. sammlung-amann"
          />
        </div>
        <Button variant="outline" onClick={pdfExport}>
          PDF-Export
        </Button>
        <Button variant="outline" onClick={csvExport}>
          CSV-Export
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {gefiltert.length} Bilder in {gruppen.length} inhaltlichen Gruppen · pinker Gruppenrahmen =
        vollständig geklärt oder an mehreren Stellen verwendet
      </p>

      <div className="mt-3 space-y-6">
        {gruppen.map((g) => {
          const alleGeklaert = g.bilder.every((b) => b.status === "geklaert");
          const mehrfach = g.orte.length > 1;
          return (
            <section
              key={g.key}
              className={`rounded p-3 ${
                alleGeklaert || mehrfach
                  ? "border-[5px] border-[#fe7fff]"
                  : "border-[5px] border-neutral-200"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                <div>
                  <h2 className="text-sm font-semibold">{g.titel}</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {g.bilder.length} Bild{g.bilder.length === 1 ? "" : "er"}
                    {mehrfach ? " · an mehreren Stellen verwendet" : ""}
                    {g.bilder.length === 1 ? " · Einzelbild" : ""}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setGruppeOffen(g.key)}>
                  Angaben für ganze Gruppe
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {g.bilder.map((b) => (
                  <button
                    key={b.pfad}
                    onClick={() => setOffen(b.pfad)}
                    className={`rounded p-2 text-left hover:bg-muted ${
                      b.status === "geklaert"
                        ? "border-[5px] border-[#fe7fff]"
                        : "border-[5px] border-neutral-200"
                    }`}
                  >
                    <img
                      src={urlNachPfad.get(b.pfad) ?? ""}
                      alt={b.dateiname}
                      loading="lazy"
                      width={240}
                      height={160}
                      className="h-24 w-full bg-muted object-cover"
                    />
                    <p className="mt-2 break-all text-[11px] leading-tight">{b.dateiname}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {KAT_LABEL[b.kategorie] ?? b.kategorie}
                      {b.jahrgang ? ` ${b.jahrgang}` : ""} · {STATUS_LABEL[b.status] ?? b.status}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Dialog open={!!aktuelleGruppe} onOpenChange={(o) => !o && setGruppeOffen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {aktuelleGruppe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{aktuelleGruppe.titel}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">
                Angaben gelten für alle {aktuelleGruppe.bilder.length} Bilder dieser Gruppe und
                werden sofort gespeichert.
              </p>
              <div className="grid gap-3">
                <div>
                  <Label className="text-xs">Status</Label>
                  <select
                    className="mt-1 block h-9 w-full rounded border px-2 text-sm"
                    value={aktuelleGruppe.bilder[0]?.status ?? "ungeklaert"}
                    onChange={(e) =>
                      void gruppeUebernehmen(aktuelleGruppe, "status", e.target.value)
                    }
                  >
                    {STATUS_OPTIONEN.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Urheber:in / Fotograf:in</Label>
                  <Input
                    className="mt-1"
                    defaultValue={aktuelleGruppe.bilder[0]?.urheber ?? ""}
                    onBlur={(e) =>
                      void gruppeUebernehmen(aktuelleGruppe, "urheber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Rechteart</Label>
                  <select
                    className="mt-1 block h-9 w-full rounded border px-2 text-sm"
                    value={aktuelleGruppe.bilder[0]?.rechteart ?? ""}
                    onChange={(e) =>
                      void gruppeUebernehmen(aktuelleGruppe, "rechteart", e.target.value)
                    }
                  >
                    <option value="">–</option>
                    {RECHTEART_OPTIONEN.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Quelle / Herkunft</Label>
                  <Input
                    className="mt-1"
                    defaultValue={aktuelleGruppe.bilder[0]?.quelle ?? ""}
                    onBlur={(e) => void gruppeUebernehmen(aktuelleGruppe, "quelle", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Freigabedatum</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    defaultValue={aktuelleGruppe.bilder[0]?.freigabedatum ?? ""}
                    onBlur={(e) =>
                      void gruppeUebernehmen(
                        aktuelleGruppe,
                        "freigabedatum",
                        e.target.value || null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Recherche-Notiz</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    defaultValue={aktuelleGruppe.bilder[0]?.notiz ?? ""}
                    onBlur={(e) => void gruppeUebernehmen(aktuelleGruppe, "notiz", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>


      <Dialog open={!!aktuell} onOpenChange={(o) => !o && setOffen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {aktuell && (
            <>
              <DialogHeader>
                <DialogTitle className="break-all text-base">{aktuell.dateiname}</DialogTitle>
              </DialogHeader>
              <img
                src={urlNachPfad.get(aktuell.pfad) ?? ""}
                alt={aktuell.dateiname}
                className="max-h-56 w-full bg-muted object-contain"
              />
              <p className="break-all text-xs text-muted-foreground">{aktuell.pfad}</p>

              <div className="rounded border bg-muted/40 p-3">
                <p className="text-xs font-medium">Verwendungsort (automatisch ermittelt)</p>
                {(aktuell.verwendungen ?? []).length ? (
                  <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
                    {aktuell.verwendungen.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">aktuell nicht verwendet</p>
                )}
              </div>

              <div className="grid gap-3">
                <div>
                  <Label className="text-xs">Status</Label>
                  <select
                    className="mt-1 block h-9 w-full rounded border px-2 text-sm"
                    value={aktuell.status}
                    onChange={(e) => aktualisieren(aktuell.pfad, "status", e.target.value)}
                  >
                    {STATUS_OPTIONEN.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Urheber:in / Fotograf:in</Label>
                  <Input
                    className="mt-1"
                    value={aktuell.urheber}
                    onChange={(e) => aktualisieren(aktuell.pfad, "urheber", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Rechteart</Label>
                  <select
                    className="mt-1 block h-9 w-full rounded border px-2 text-sm"
                    value={aktuell.rechteart}
                    onChange={(e) => aktualisieren(aktuell.pfad, "rechteart", e.target.value)}
                  >
                    <option value="">–</option>
                    {RECHTEART_OPTIONEN.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Quelle / Herkunft</Label>
                  <Input
                    className="mt-1"
                    value={aktuell.quelle}
                    onChange={(e) => aktualisieren(aktuell.pfad, "quelle", e.target.value)}
                    placeholder="z. B. Wettbewerbsjahrgang 2021"
                  />
                </div>
                <div>
                  <Label className="text-xs">Freigabedatum</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    value={aktuell.freigabedatum ?? ""}
                    onChange={(e) =>
                      aktualisieren(aktuell.pfad, "freigabedatum", e.target.value || null)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Recherche-Notiz</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    value={aktuell.notiz}
                    onChange={(e) => aktualisieren(aktuell.pfad, "notiz", e.target.value)}
                    placeholder="z. B. Anfrage an XY am 12.09. gestellt"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Änderungen werden automatisch gespeichert.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
