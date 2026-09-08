import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  speichereEntwurf,
  ladeEinreichung,
  reicheEin,
  type EinreichungForm,
} from "@/lib/einreichung.functions";
import {
  BEWERBUNGSSCHLUSS,
  ERLAUBTE_TYPEN,
  KATEGORIEN,
  LIMITS,
  MAX_DATEIGROESSE_MB,
  MAX_DETAILFOTOS,
  istGeschlossen,
  schlussFormatiert,
} from "@/config/neuland-einreichung";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/neuland/einreichung")({
  head: () => ({
    meta: [
      { title: "Einreichung neuland 2027 – Online-Formular | aed e.V." },
      {
        name: "description",
        content:
          "Online-Einreichung für den Nachwuchswettbewerb neuland 2027: Bewerbung starten, zwischenspeichern und später mit Einreichungs-Nummer fortsetzen.",
      },
      { property: "og:title", content: "Einreichung neuland 2027 | aed e.V." },
      { property: "og:description", content: "Formular für die Einreichung zum Wettbewerb neuland 2027." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EinreichungPage,
});

type Datei = { path: string; name: string; size?: number };

const LEER: EinreichungForm = {
  vorname: "",
  nachname: "",
  email: "",
  telefon: "",
  institution: "",
  kategorie: "",
  projekttitel: "",
  kurzbeschreibung: "",
  idee: "",
  umsetzung: "",
  nutzen: "",
  nachhaltigkeit: "",
  titelbild: null,
  detailfotos: [],
  video_link: "",
  rechte_bestaetigt: false,
};

const SCHRITTE = ["Stammdaten", "Projektangaben", "Kriterien", "Medien", "Bestätigung"];

function istEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function istUrl(v: string) {
  if (!v.trim()) return true;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function uploadDatei(file: File): Promise<Datei> {
  if (!ERLAUBTE_TYPEN.includes(file.type)) throw new Error(`${file.name}: nur JPG oder PNG erlaubt.`);
  if (file.size > MAX_DATEIGROESSE_MB * 1024 * 1024)
    throw new Error(`${file.name}: größer als ${MAX_DATEIGROESSE_MB} MB.`);
  const endung = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${endung}`;
  const { error } = await supabase.storage.from("neuland-einreichungen").upload(path, file);
  if (error) throw new Error(error.message);
  return { path, name: file.name, size: file.size };
}

function EinreichungPage() {
  const geschlossen = istGeschlossen();
  const [ansicht, setAnsicht] = useState<"start" | "fortsetzen" | "formular" | "fertig">("start");
  const [schritt, setSchritt] = useState(0);
  const [form, setForm] = useState<EinreichungForm>(LEER);
  const [einreichungsId, setEinreichungsId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("entwurf");
  const [nurLesen, setNurLesen] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [neuAngelegt, setNeuAngelegt] = useState(false);

  const speichern = useServerFn(speichereEntwurf);
  const laden = useServerFn(ladeEinreichung);
  const absenden = useServerFn(reicheEin);

  const set = <K extends keyof EinreichungForm>(k: K, v: EinreichungForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function zwischenspeichern(still = false) {
    setFehler(null);
    if (!istEmail(form.email)) {
      setFehler("Zum Speichern wird eine gültige E-Mail-Adresse benötigt (Schritt 1).");
      setSchritt(0);
      return false;
    }
    setBusy(true);
    try {
      const res = await speichern({ data: { einreichungsId, daten: form } });
      setEinreichungsId(res.row.einreichungs_id);
      setStatus(res.row.status);
      if (res.neu) setNeuAngelegt(true);
      if (!still) setMeldung(`Zwischenstand gespeichert (${res.row.einreichungs_id}).`);
      return true;
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function schrittValide(i: number): string | null {
    if (i === 0) {
      if (!form.vorname.trim() || !form.nachname.trim()) return "Bitte Vor- und Nachname angeben.";
      if (!istEmail(form.email)) return "Bitte eine gültige E-Mail-Adresse angeben.";
      if (!form.kategorie) return "Bitte eine Kategorie wählen.";
    }
    if (i === 1) {
      if (!form.projekttitel.trim()) return "Bitte einen Projekttitel angeben.";
      if (!form.kurzbeschreibung.trim()) return "Bitte eine Kurzbeschreibung angeben.";
    }
    if (i === 2) {
      if (!form.idee.trim() || !form.umsetzung.trim() || !form.nutzen.trim() || !form.nachhaltigkeit.trim())
        return "Bitte alle vier Kriterien-Felder ausfüllen.";
    }
    if (i === 3) {
      if (!form.titelbild) return "Bitte ein Titelbild hochladen.";
      if (!istUrl(form.video_link)) return "Bitte einen gültigen Video-Link angeben (http/https).";
    }
    return null;
  }

  async function weiter() {
    const f = schrittValide(schritt);
    if (f) {
      setFehler(f);
      return;
    }
    setFehler(null);
    if (!nurLesen) await zwischenspeichern(true);
    setSchritt((s) => Math.min(s + 1, SCHRITTE.length - 1));
  }

  async function zurueck() {
    setFehler(null);
    if (!nurLesen) await zwischenspeichern(true);
    setSchritt((s) => Math.max(s - 1, 0));
  }

  const alleFelderOk = SCHRITTE.every((_, i) => i === 4 || !schrittValide(i));
  const absendbar = alleFelderOk && form.rechte_bestaetigt && !nurLesen;

  async function einreichen() {
    setFehler(null);
    if (!einreichungsId) {
      const ok = await zwischenspeichern(true);
      if (!ok) return;
    }
    setBusy(true);
    try {
      const id = einreichungsId ?? (await speichern({ data: { einreichungsId: null, daten: form } })).row.einreichungs_id;
      const res = await absenden({ data: { einreichungsId: id, email: form.email, daten: form } });
      setEinreichungsId(res.row.einreichungs_id);
      setStatus("eingereicht");
      setAnsicht("fertig");
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Einreichen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">neuland 2027</p>
        <h1 className="display-lg mt-2">Online-Einreichung</h1>
        <p className="mt-3 text-muted-foreground">
          Bewerbungsschluss: {schlussFormatiert()} Uhr
          <span className="sr-only"> ({BEWERBUNGSSCHLUSS})</span>
        </p>

        {geschlossen && (
          <div className="mt-6 border border-line bg-muted p-4 text-sm">
            Der Bewerbungsschluss für neuland 2027 ist erreicht.
          </div>
        )}

        {fehler && (
          <div className="mt-6 border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {fehler}
          </div>
        )}
        {meldung && !fehler && (
          <div className="mt-6 border border-line bg-muted p-4 text-sm">{meldung}</div>
        )}

        {ansicht === "start" && (
          <StartAnsicht
            geschlossen={geschlossen}
            onNeu={() => {
              setForm(LEER);
              setEinreichungsId(null);
              setNeuAngelegt(false);
              setNurLesen(false);
              setSchritt(0);
              setMeldung(null);
              setAnsicht("formular");
            }}
            onFortsetzen={() => {
              setMeldung(null);
              setFehler(null);
              setAnsicht("fortsetzen");
            }}
          />
        )}

        {ansicht === "fortsetzen" && (
          <FortsetzenAnsicht
            busy={busy}
            onAbbrechen={() => setAnsicht("start")}
            onLaden={async (id, email) => {
              setBusy(true);
              setFehler(null);
              try {
                const res = await laden({ data: { einreichungsId: id, email } });
                const r = res.row as Record<string, unknown>;
                setForm({
                  ...LEER,
                  ...Object.fromEntries(
                    Object.keys(LEER).map((k) => [k, (r[k] ?? LEER[k as keyof EinreichungForm]) as unknown]),
                  ),
                } as EinreichungForm);
                setEinreichungsId(String(r["einreichungs_id"]));
                setStatus(String(r["status"]));
                setNurLesen(res.geschlossen);
                setSchritt(0);
                setAnsicht("formular");
                setMeldung(
                  res.geschlossen
                    ? "Der Bewerbungsschluss ist erreicht – die Angaben werden nur noch schreibgeschützt angezeigt."
                    : `Bewerbung ${r["einreichungs_id"]} geladen (Status: ${r["status"]}).`,
                );
              } catch (e) {
                setFehler(e instanceof Error ? e.message : "Laden fehlgeschlagen.");
              } finally {
                setBusy(false);
              }
            }}
          />
        )}

        {ansicht === "formular" && (
          <div className="mt-8">
            {einreichungsId && (
              <IdHinweis id={einreichungsId} status={status} hervorheben={neuAngelegt} />
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Schritt {schritt + 1} von {SCHRITTE.length}: {SCHRITTE[schritt]}
                </span>
                {nurLesen && <span className="text-muted-foreground">schreibgeschützt</span>}
              </div>
              <Progress className="mt-2" value={((schritt + 1) / SCHRITTE.length) * 100} />
            </div>

            <fieldset disabled={nurLesen} className="mt-8 space-y-6">
              {schritt === 0 && (
                <>
                  <Feld label="Vorname *">
                    <Input value={form.vorname} onChange={(e) => set("vorname", e.target.value)} />
                  </Feld>
                  <Feld label="Nachname *">
                    <Input value={form.nachname} onChange={(e) => set("nachname", e.target.value)} />
                  </Feld>
                  <Feld label="E-Mail-Adresse *" hinweis="Wird zusammen mit der Einreichungs-Nummer für die Rückkehr benötigt.">
                    <Input
                      type="email"
                      value={form.email}
                      disabled={!!einreichungsId}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Feld>
                  <Feld label="Telefon (optional)">
                    <Input value={form.telefon} onChange={(e) => set("telefon", e.target.value)} />
                  </Feld>
                  <Feld label="Institution / Hochschule / Organisation (optional)">
                    <Input value={form.institution} onChange={(e) => set("institution", e.target.value)} />
                  </Feld>
                  <Feld label="Kategorie *">
                    <Select value={form.kategorie || undefined} onValueChange={(v) => set("kategorie", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {KATEGORIEN.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Feld>
                </>
              )}

              {schritt === 1 && (
                <>
                  <Feld label="Projekttitel *">
                    <Input value={form.projekttitel} onChange={(e) => set("projekttitel", e.target.value)} />
                  </Feld>
                  <ZaehlFeld
                    label="Kurzbeschreibung *"
                    wert={form.kurzbeschreibung}
                    max={LIMITS.kurzbeschreibung}
                    onChange={(v) => set("kurzbeschreibung", v)}
                  />
                </>
              )}

              {schritt === 2 && (
                <>
                  <ZaehlFeld label="Idee / Ausgangsfrage *" wert={form.idee} max={LIMITS.idee} onChange={(v) => set("idee", v)} />
                  <ZaehlFeld
                    label="Umsetzung / Lösungsansatz *"
                    wert={form.umsetzung}
                    max={LIMITS.umsetzung}
                    onChange={(v) => set("umsetzung", v)}
                  />
                  <ZaehlFeld label="Nutzen / Zielgruppe *" wert={form.nutzen} max={LIMITS.nutzen} onChange={(v) => set("nutzen", v)} />
                  <ZaehlFeld
                    label="Nachhaltigkeits- / Innovationsaspekt *"
                    wert={form.nachhaltigkeit}
                    max={LIMITS.nachhaltigkeit}
                    onChange={(v) => set("nachhaltigkeit", v)}
                  />
                </>
              )}

              {schritt === 3 && (
                <>
                  <Feld label="Titelbild *" hinweis={`Nur JPG oder PNG, max. ${MAX_DATEIGROESSE_MB} MB.`}>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setBusy(true);
                        setFehler(null);
                        try {
                          set("titelbild", await uploadDatei(f));
                        } catch (err) {
                          setFehler(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                    {form.titelbild && (
                      <p className="mt-2 text-sm text-muted-foreground">Hochgeladen: {form.titelbild.name}</p>
                    )}
                  </Feld>

                  <Feld
                    label="Detailfotos (optional)"
                    hinweis={`Maximal ${MAX_DETAILFOTOS} Dateien, JPG oder PNG, je max. ${MAX_DATEIGROESSE_MB} MB.`}
                  >
                    <Input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (!files.length) return;
                        if (form.detailfotos.length + files.length > MAX_DETAILFOTOS) {
                          setFehler(`Es sind maximal ${MAX_DETAILFOTOS} Detailfotos möglich.`);
                          return;
                        }
                        setBusy(true);
                        setFehler(null);
                        try {
                          const neu: Datei[] = [];
                          for (const f of files) neu.push(await uploadDatei(f));
                          set("detailfotos", [...form.detailfotos, ...neu]);
                        } catch (err) {
                          setFehler(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                    {form.detailfotos.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {form.detailfotos.map((d) => (
                          <li key={d.path} className="flex items-center justify-between gap-4">
                            <span>{d.name}</span>
                            <button
                              type="button"
                              className="underline"
                              onClick={() => set("detailfotos", form.detailfotos.filter((x) => x.path !== d.path))}
                            >
                              entfernen
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Feld>

                  <Feld label="Video-Link (optional)" hinweis="z. B. YouTube- oder Vimeo-Link">
                    <Input
                      type="url"
                      placeholder="https://"
                      value={form.video_link}
                      onChange={(e) => set("video_link", e.target.value)}
                    />
                  </Feld>
                </>
              )}

              {schritt === 4 && (
                <>
                  <Zusammenfassung form={form} />
                  <div className="flex items-start gap-3 border border-line p-4">
                    <Checkbox
                      id="rechte"
                      checked={form.rechte_bestaetigt}
                      onCheckedChange={(v) => set("rechte_bestaetigt", v === true)}
                    />
                    <Label htmlFor="rechte" className="text-sm font-normal leading-relaxed">
                      Ich bestätige die Nutzungs- und Veröffentlichungsrechte gemäß{" "}
                      <a href="#" className="underline">
                        Einverständniserklärung
                      </a>{" "}
                      (Platzhaltertext).
                    </Label>
                  </div>
                </>
              )}
            </fieldset>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <Button variant="outline" onClick={zurueck} disabled={busy || schritt === 0}>
                Zurück
              </Button>
              {schritt < SCHRITTE.length - 1 && (
                <Button onClick={weiter} disabled={busy}>
                  Weiter
                </Button>
              )}
              {schritt === SCHRITTE.length - 1 && (
                <Button onClick={einreichen} disabled={busy || !absendbar}>
                  Bewerbung einreichen
                </Button>
              )}
              <Button variant="secondary" onClick={() => zwischenspeichern(false)} disabled={busy || nurLesen}>
                Zwischenspeichern
              </Button>
              <Button variant="ghost" onClick={() => setAnsicht("start")} disabled={busy}>
                Zur Übersicht
              </Button>
            </div>
          </div>
        )}

        {ansicht === "fertig" && einreichungsId && (
          <div className="mt-10 border border-line p-8">
            <h2 className="display-sm">Bewerbung eingereicht</h2>
            <p className="mt-3 text-muted-foreground">
              Vielen Dank. Die Bewerbung wurde übermittelt und kann bis zum Bewerbungsschluss über die
              Einreichungs-Nummer und die E-Mail-Adresse weiter bearbeitet werden.
            </p>
            <IdHinweis id={einreichungsId} status="eingereicht" hervorheben />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setAnsicht("formular")}>
                Bewerbung weiter bearbeiten
              </Button>
              <Button variant="ghost" onClick={() => setAnsicht("start")}>
                Zur Übersicht
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StartAnsicht({
  geschlossen,
  onNeu,
  onFortsetzen,
}: {
  geschlossen: boolean;
  onNeu: () => void;
  onFortsetzen: () => void;
}) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="border border-line p-6">
        <h2 className="display-sm">Neue Bewerbung</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Formular in fünf Schritten ausfüllen. Der Zwischenstand kann jederzeit gespeichert werden.
        </p>
        <Button className="mt-6 w-full" onClick={onNeu} disabled={geschlossen}>
          Neue Bewerbung starten
        </Button>
        {geschlossen && (
          <p className="mt-3 text-sm text-muted-foreground">
            Der Bewerbungsschluss für neuland 2027 ist erreicht.
          </p>
        )}
      </div>
      <div className="border border-line p-6">
        <h2 className="display-sm">Bewerbung fortsetzen</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Mit Einreichungs-Nummer (z. B. NL27-001) und der angegebenen E-Mail-Adresse.
        </p>
        <Button variant="outline" className="mt-6 w-full" onClick={onFortsetzen}>
          Bestehende Bewerbung fortsetzen
        </Button>
      </div>
    </div>
  );
}

function FortsetzenAnsicht({
  busy,
  onLaden,
  onAbbrechen,
}: {
  busy: boolean;
  onLaden: (id: string, email: string) => void;
  onAbbrechen: () => void;
}) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="mt-10 max-w-md border border-line p-6">
      <h2 className="display-sm">Bewerbung fortsetzen</h2>
      <div className="mt-6 space-y-4">
        <Feld label="Einreichungs-Nummer">
          <Input placeholder="NL27-001" value={id} onChange={(e) => setId(e.target.value)} />
        </Feld>
        <Feld label="E-Mail-Adresse">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Feld>
      </div>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => onLaden(id, email)} disabled={busy || !id.trim() || !istEmail(email)}>
          Bewerbung laden
        </Button>
        <Button variant="ghost" onClick={onAbbrechen} disabled={busy}>
          Abbrechen
        </Button>
      </div>
    </div>
  );
}

function IdHinweis({ id, status, hervorheben }: { id: string; status: string; hervorheben: boolean }) {
  const [kopiert, setKopiert] = useState(false);
  return (
    <div className="mt-6 border border-line bg-muted p-6">
      <p className="text-sm text-muted-foreground">Einreichungs-Nummer (Status: {status})</p>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <span className="display-sm">{id}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(id);
            setKopiert(true);
            setTimeout(() => setKopiert(false), 2000);
          }}
        >
          {kopiert ? "Kopiert" : "ID kopieren"}
        </Button>
      </div>
      {hervorheben && (
        <p className="mt-3 text-sm font-medium">
          Bitte notiert euch diese Einreichungs-Nummer – sie wird zusammen mit der E-Mail-Adresse zum
          Fortsetzen der Bewerbung gebraucht.
        </p>
      )}
    </div>
  );
}

function Feld({
  label,
  hinweis,
  children,
}: {
  label: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hinweis && <p className="text-xs text-muted-foreground">{hinweis}</p>}
    </div>
  );
}

function ZaehlFeld({
  label,
  wert,
  max,
  onChange,
}: {
  label: string;
  wert: string;
  max: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {wert.length} / {max}
        </span>
      </div>
      <Textarea rows={4} maxLength={max} value={wert} onChange={(e) => onChange(e.target.value.slice(0, max))} />
    </div>
  );
}

function Zusammenfassung({ form }: { form: EinreichungForm }) {
  const zeilen: Array<[string, string]> = [
    ["Vorname", form.vorname],
    ["Nachname", form.nachname],
    ["E-Mail", form.email],
    ["Telefon", form.telefon || "–"],
    ["Institution", form.institution || "–"],
    ["Kategorie", form.kategorie || "–"],
    ["Projekttitel", form.projekttitel],
    ["Kurzbeschreibung", form.kurzbeschreibung],
    ["Idee / Ausgangsfrage", form.idee],
    ["Umsetzung / Lösungsansatz", form.umsetzung],
    ["Nutzen / Zielgruppe", form.nutzen],
    ["Nachhaltigkeit / Innovation", form.nachhaltigkeit],
    ["Titelbild", form.titelbild?.name ?? "–"],
    ["Detailfotos", form.detailfotos.map((d) => d.name).join(", ") || "–"],
    ["Video-Link", form.video_link || "–"],
  ];
  return (
    <div className="border border-line">
      <h2 className="border-b border-line p-4 text-sm font-medium">Zusammenfassung</h2>
      <dl className="divide-y divide-line">
        {zeilen.map(([k, v]) => (
          <div key={k} className="grid gap-1 p-4 sm:grid-cols-3">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="whitespace-pre-wrap text-sm sm:col-span-2">{v || "–"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
