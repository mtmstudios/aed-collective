import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  anmelden,
  ladeAuswertung,
  ladeBeitrag,
  ladeBeitraege,
  ladeZugaenge,
  loescheZugang,
  pruefeToken,
  speichereWertung,
  speichereZugang,
  ROLLEN,
  ROLLEN_LABEL,
  type Beitrag,
  type BeitragDetail,
  type Sitzung,
  type Zugang,
} from "@/lib/jury.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/jurybereich")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Jurybereich – neuland" },
      { name: "description", content: "Interner Bereich für die Jury des Wettbewerbs neuland." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Jurybereich,
});

const TOKEN_SCHLUESSEL = "aed-jury-token";
const PUNKTE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function datum(wert: string | null): string {
  if (!wert) return "–";
  return new Date(wert).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function csvFeld(wert: string | number | null): string {
  return `"${String(wert ?? "").replace(/"/g, '""')}"`;
}

function Jurybereich() {
  const [token, setToken] = useState("");
  const [sitzung, setSitzung] = useState<Sitzung | null>(null);
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [status, setStatus] = useState("");

  const [beitraege, setBeitraege] = useState<Beitrag[]>([]);
  const [kategorie, setKategorie] = useState("alle");
  const [nurOffene, setNurOffene] = useState(false);
  const [detail, setDetail] = useState<BeitragDetail | null>(null);

  const [ansicht, setAnsicht] = useState<"beitraege" | "zugaenge">("beitraege");
  const [zugaenge, setZugaenge] = useState<Zugang[]>([]);
  const [neu, setNeu] = useState({ name: "", email: "", rolle: "jury", passwort: "" });

  const login = useServerFn(anmelden);
  const pruefen = useServerFn(pruefeToken);
  const listeLaden = useServerFn(ladeBeitraege);
  const detailLaden = useServerFn(ladeBeitrag);
  const wertungSpeichern = useServerFn(speichereWertung);
  const zugaengeLaden = useServerFn(ladeZugaenge);
  const zugangSpeichern = useServerFn(speichereZugang);
  const zugangLoeschen = useServerFn(loescheZugang);
  const auswertungLaden = useServerFn(ladeAuswertung);

  useEffect(() => {
    const gespeichert = sessionStorage.getItem(TOKEN_SCHLUESSEL);
    if (!gespeichert) return;
    void (async () => {
      const res = await pruefen({ data: { token: gespeichert } });
      if (res.sitzung) {
        setToken(gespeichert);
        setSitzung(res.sitzung);
        await listeHolen(gespeichert);
      } else {
        sessionStorage.removeItem(TOKEN_SCHLUESSEL);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function listeHolen(t: string) {
    const res = await listeLaden({ data: { token: t } });
    setBeitraege(res.beitraege);
    setSitzung(res.sitzung);
  }

  async function anmeldung() {
    setLaedt(true);
    setFehler("");
    try {
      const res = await login({ data: { email, passwort } });
      sessionStorage.setItem(TOKEN_SCHLUESSEL, res.token);
      setToken(res.token);
      setSitzung(res.sitzung);
      setPasswort("");
      await listeHolen(res.token);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Anmeldung fehlgeschlagen");
    } finally {
      setLaedt(false);
    }
  }

  function abmelden() {
    sessionStorage.removeItem(TOKEN_SCHLUESSEL);
    setToken("");
    setSitzung(null);
    setBeitraege([]);
    setDetail(null);
  }

  async function oeffne(id: string) {
    setStatus("Lädt …");
    try {
      const res = await detailLaden({ data: { token, id } });
      setDetail(res.beitrag);
      setStatus("");
    } catch {
      setStatus("Beitrag konnte nicht geladen werden");
    }
  }

  async function werte(punkte: number | null, kommentar: string) {
    if (!detail) return;
    setDetail({ ...detail, eigene: { punkte, kommentar } });
    setStatus("Speichert …");
    try {
      await wertungSpeichern({
        data: { token, einreichungId: detail.id, werte: { punkte, kommentar } },
      });
      setStatus("Gespeichert");
      await listeHolen(token);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Speichern fehlgeschlagen");
    }
  }

  async function zeigeZugaenge() {
    setAnsicht("zugaenge");
    const res = await zugaengeLaden({ data: { token } });
    setZugaenge(res.zugaenge);
  }

  async function zugangAnlegen() {
    setStatus("Legt an …");
    try {
      await zugangSpeichern({
        data: {
          token,
          werte: {
            name: neu.name,
            email: neu.email,
            rolle: neu.rolle as (typeof ROLLEN)[number],
            aktiv: true,
            passwort: neu.passwort,
          },
        },
      });
      setNeu({ name: "", email: "", rolle: "jury", passwort: "" });
      setStatus("Zugang angelegt");
      await zeigeZugaenge();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Anlegen fehlgeschlagen");
    }
  }

  async function csvExport() {
    const res = await auswertungLaden({ data: { token } });
    const kopf = [
      "Nummer",
      "Projekt",
      "Kategorie",
      "Hochschule",
      "Jurymitglied",
      "Punkte",
      "Kommentar",
    ];
    const zeilen = res.zeilen.map((z) =>
      [z.einreichungsId, z.projekttitel, z.kategorie, z.institution, z.juror, z.punkte, z.kommentar]
        .map(csvFeld)
        .join(";"),
    );
    const blob = new Blob(["﻿" + [kopf.join(";"), ...zeilen].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "neuland-wertungen.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const kategorien = useMemo(
    () => [...new Set(beitraege.map((b) => b.kategorie).filter(Boolean))].sort(),
    [beitraege],
  );

  const gefiltert = useMemo(
    () =>
      beitraege.filter((b) => {
        if (kategorie !== "alle" && b.kategorie !== kategorie) return false;
        if (nurOffene && b.eigene?.punkte) return false;
        return true;
      }),
    [beitraege, kategorie, nurOffene],
  );

  const eigeneFertig = beitraege.filter((b) => b.eigene?.punkte).length;
  const istBuero = sitzung?.rolle === "geschaeftsstelle";

  if (!sitzung) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 p-6">
        <h1 className="font-display text-2xl">Jurybereich</h1>
        <p className="text-sm text-muted-foreground">
          Zugang erhalten Jurymitglieder von der Geschäftsstelle.
        </p>
        <p className="text-xs text-muted-foreground">
          Erste Einrichtung: E-Mail leer lassen und das Seitenpasswort eingeben. Sobald der erste
          Zugang der Geschäftsstelle angelegt ist, gilt nur noch die persönliche Anmeldung.
        </p>
        <div>
          <Label className="text-xs">E-Mail</Label>
          <Input
            className="mt-1"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Passwort</Label>
          <Input
            className="mt-1"
            type="password"
            autoComplete="current-password"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && anmeldung()}
          />
        </div>
        {fehler && <p className="text-sm text-red-600">{fehler}</p>}
        <Button onClick={anmeldung} disabled={laedt}>
          {laedt ? "Prüft …" : "Anmelden"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Jurybereich neuland</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sitzung.name} · {ROLLEN_LABEL[sitzung.rolle]}
            {!istBuero && ` · ${eigeneFertig} von ${beitraege.length} bewertet`}
            {status && <span className="ml-3">· {status}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {istBuero && (
            <>
              <Button
                variant={ansicht === "beitraege" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnsicht("beitraege")}
              >
                Beiträge
              </Button>
              <Button
                variant={ansicht === "zugaenge" ? "default" : "outline"}
                size="sm"
                onClick={zeigeZugaenge}
              >
                Zugänge
              </Button>
              <Button variant="outline" size="sm" onClick={csvExport}>
                CSV-Export
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={abmelden}>
            Abmelden
          </Button>
        </div>
      </div>

      {ansicht === "beitraege" ? (
        <>
          <div className="mt-4 flex flex-wrap items-end gap-3 border-y py-3">
            <div>
              <Label className="text-xs">Kategorie</Label>
              <select
                className="mt-1 block h-9 rounded border px-2 text-sm"
                value={kategorie}
                onChange={(e) => setKategorie(e.target.value)}
              >
                <option value="alle">Alle</option>
                {kategorien.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            {!istBuero && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={nurOffene}
                  onChange={(e) => setNurOffene(e.target.checked)}
                />
                Nur noch nicht bewertete
              </label>
            )}
            <p className="ml-auto text-xs text-muted-foreground">{gefiltert.length} Beiträge</p>
          </div>

          {beitraege.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              Es liegen noch keine eingereichten Beiträge vor. Entwürfe, an denen noch gearbeitet
              wird, erscheinen hier bewusst nicht.
            </p>
          )}

          <div className="mt-3 overflow-x-auto rounded border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs">
                <tr>
                  <th className="w-24 p-2 font-medium">Nummer</th>
                  <th className="p-2 font-medium">Projekt</th>
                  <th className="w-56 p-2 font-medium">Kategorie</th>
                  <th className="w-28 p-2 font-medium">Eingereicht</th>
                  {istBuero ? (
                    <>
                      <th className="w-20 p-2 font-medium">Schnitt</th>
                      <th className="w-24 p-2 font-medium">Wertungen</th>
                    </>
                  ) : (
                    <th className="w-28 p-2 font-medium">Meine Wertung</th>
                  )}
                  <th className="w-20 p-2" />
                </tr>
              </thead>
              <tbody>
                {gefiltert.map((b) => (
                  <tr key={b.id} className="border-b last:border-0">
                    <td className="p-2 font-mono text-xs">{b.einreichungsId}</td>
                    <td className="p-2">
                      <p className="leading-tight">{b.projekttitel || "ohne Titel"}</p>
                      <p className="text-xs text-muted-foreground">{b.institution}</p>
                    </td>
                    <td className="p-2 text-xs">{b.kategorie}</td>
                    <td className="p-2 text-xs">{datum(b.eingereichtAm)}</td>
                    {istBuero ? (
                      <>
                        <td className="p-2">{b.schnitt ?? "–"}</td>
                        <td className="p-2">{b.anzahlWertungen ?? 0}</td>
                      </>
                    ) : (
                      <td className="p-2">
                        {b.eigene?.punkte ? (
                          <span className="font-medium">{b.eigene.punkte} / 10</span>
                        ) : (
                          <span className="text-muted-foreground">offen</span>
                        )}
                      </td>
                    )}
                    <td className="p-2 text-right">
                      <Button variant="outline" size="sm" onClick={() => oeffne(b.id)}>
                        Ansehen
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h2 className="text-sm font-semibold">Zugänge</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Passwörter werden verschlüsselt gespeichert und lassen sich nicht wieder anzeigen. Wer
            seines vergisst, bekommt hier ein neues gesetzt.
          </p>
          {sitzung.id === null && (
            <p className="mt-3 rounded border border-[#fe7fff] p-3 text-xs">
              Sie sind mit dem Einrichtungs-Passwort angemeldet. Legen Sie zuerst einen eigenen
              Zugang mit der Rolle „Geschäftsstelle“ an – danach ist dieser Einstieg gesperrt und es
              zählen nur noch die persönlichen Zugänge.
            </p>
          )}

          <div className="mt-4 grid gap-3 rounded border p-4 md:grid-cols-5">
            <div className="md:col-span-1">
              <Label className="text-xs">Name</Label>
              <Input
                className="mt-1"
                value={neu.name}
                onChange={(e) => setNeu({ ...neu, name: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">E-Mail</Label>
              <Input
                className="mt-1"
                type="email"
                value={neu.email}
                onChange={(e) => setNeu({ ...neu, email: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Rolle</Label>
              <select
                className="mt-1 block h-9 w-full rounded border px-2 text-sm"
                value={neu.rolle}
                onChange={(e) => setNeu({ ...neu, rolle: e.target.value })}
              >
                {ROLLEN.map((r) => (
                  <option key={r} value={r}>
                    {ROLLEN_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Passwort</Label>
              <Input
                className="mt-1"
                value={neu.passwort}
                onChange={(e) => setNeu({ ...neu, passwort: e.target.value })}
                placeholder="mind. 8 Zeichen"
              />
            </div>
            <div className="md:col-span-5">
              <Button size="sm" onClick={zugangAnlegen}>
                Zugang anlegen
              </Button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded border">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs">
                <tr>
                  <th className="p-2 font-medium">Name</th>
                  <th className="p-2 font-medium">E-Mail</th>
                  <th className="w-36 p-2 font-medium">Rolle</th>
                  <th className="w-32 p-2 font-medium">Letzter Login</th>
                  <th className="w-24 p-2" />
                </tr>
              </thead>
              <tbody>
                {zugaenge.map((z) => (
                  <tr key={z.id} className="border-b last:border-0">
                    <td className="p-2">{z.name}</td>
                    <td className="p-2 text-xs">{z.email}</td>
                    <td className="p-2 text-xs">{ROLLEN_LABEL[z.rolle] ?? z.rolle}</td>
                    <td className="p-2 text-xs">{datum(z.letzterLogin)}</td>
                    <td className="p-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!window.confirm(`Zugang von ${z.name} löschen?`)) return;
                          await zugangLoeschen({ data: { token, id: z.id } });
                          await zeigeZugaenge();
                        }}
                      >
                        Löschen
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {zugaenge.length === 0 && (
              <p className="p-4 text-xs text-muted-foreground">Noch keine Zugänge angelegt.</p>
            )}
          </div>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{detail.projekttitel || "ohne Titel"}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">
                {detail.einreichungsId} · {detail.kategorie} · {detail.institution} · eingereicht am{" "}
                {datum(detail.eingereichtAm)}
              </p>

              {detail.bilder.length > 0 && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {detail.bilder.map((bild) => (
                    <a key={bild.url} href={bild.url} target="_blank" rel="noreferrer">
                      <img
                        src={bild.url}
                        alt={bild.name}
                        loading="lazy"
                        className="h-32 w-full bg-muted object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              <div className="grid gap-4 text-sm">
                {[
                  ["Kurzbeschreibung", detail.kurzbeschreibung],
                  ["Idee", detail.idee],
                  ["Umsetzung", detail.umsetzung],
                  ["Nutzen", detail.nutzen],
                  ["Nachhaltigkeit", detail.nachhaltigkeit],
                ]
                  .filter(([, wert]) => wert)
                  .map(([titel, wert]) => (
                    <div key={titel}>
                      <p className="text-xs font-medium text-muted-foreground">{titel}</p>
                      <p className="mt-1 whitespace-pre-line">{wert}</p>
                    </div>
                  ))}
                {detail.videoLink && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Video</p>
                    <a
                      className="link-underline break-all text-sm"
                      href={detail.videoLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detail.videoLink}
                    </a>
                  </div>
                )}
              </div>

              {istBuero ? (
                <div className="rounded border bg-muted/40 p-3">
                  <p className="text-xs font-medium">
                    Wertungen der Jury · Schnitt {detail.schnitt ?? "–"} aus{" "}
                    {detail.anzahlWertungen ?? 0}
                  </p>
                  {detail.fremde.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">Noch keine Wertung.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm">
                      {detail.fremde.map((w, i) => (
                        <li key={`${w.juror}-${i}`}>
                          <span className="font-medium">{w.juror}</span>{" "}
                          <span className="text-muted-foreground">
                            {w.punkte ? `${w.punkte} / 10` : "ohne Punkte"}
                          </span>
                          {w.kommentar && <p className="text-muted-foreground">{w.kommentar}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Die Geschäftsstelle wertet nicht mit. Kontakt:{" "}
                    {[detail.vorname, detail.nachname].filter(Boolean).join(" ")} · {detail.email}
                    {detail.telefon ? ` · ${detail.telefon}` : ""}
                  </p>
                </div>
              ) : (
                <div className="rounded border p-3">
                  <Label className="text-xs">Meine Wertung</Label>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {PUNKTE.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => werte(p, detail.eigene?.kommentar ?? "")}
                        className={`h-9 w-9 rounded border text-sm ${
                          detail.eigene?.punkte === p
                            ? "border-transparent bg-ink text-background"
                            : "hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <Label className="mt-3 block text-xs">Kommentar</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    defaultValue={detail.eigene?.kommentar ?? ""}
                    onBlur={(e) => werte(detail.eigene?.punkte ?? null, e.target.value)}
                    placeholder="Kurze Begründung – sieht nur die Geschäftsstelle."
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Wird sofort gespeichert. 1 = schwach, 10 = herausragend.
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
