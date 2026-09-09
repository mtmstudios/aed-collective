import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  ladeArtikel,
  ladeZuordnung,
  verschiebeBild,
  type ArtikelRow,
  type ImageRow,
  type SectionRow,
} from "@/lib/bildzuordnung.functions";
import { pruefeAdminPasswort } from "@/lib/bildrechte.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/bildzuordnung")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Bild-Zuordnung – interne Verwaltung" },
      { name: "description", content: "Interne Zuordnung importierter Bilder zu Artikelabschnitten." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Bildzuordnung,
});

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "Unbekannte Quelle";
  }
}

function BildKachel({
  bild,
  onDragStart,
  children,
}: {
  bild: ImageRow;
  onDragStart: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", bild.id);
        onDragStart();
      }}
      title={bild.source_url || "Keine Quelle hinterlegt"}
      className="cursor-grab rounded-lg border bg-white p-2 active:cursor-grabbing"
    >
      <img
        src={bild.image_url}
        alt=""
        loading="lazy"
        className="h-24 w-full rounded object-cover"
      />
      {children}
    </div>
  );
}

function Bildzuordnung() {
  const [passwort, setPasswort] = useState("");
  const [freigegeben, setFreigegeben] = useState(false);
  const [pwFehler, setPwFehler] = useState(false);
  const [laedt, setLaedt] = useState(false);

  const [artikel, setArtikel] = useState<ArtikelRow[]>([]);
  const [artikelId, setArtikelId] = useState<string>("");
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [gezogen, setGezogen] = useState<string | null>(null);

  const pruefen = useServerFn(pruefeAdminPasswort);
  const artikelLaden = useServerFn(ladeArtikel);
  const zuordnungLaden = useServerFn(ladeZuordnung);
  const verschieben = useServerFn(verschiebeBild);

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
      const { artikel: liste } = await artikelLaden({ data: { passwort: pw } });
      setArtikel(liste);
      if (liste[0]) {
        setArtikelId(liste[0].id);
        await daten(pw, liste[0].id);
      }
    } finally {
      setLaedt(false);
    }
  }

  async function daten(pw: string, id: string) {
    const res = await zuordnungLaden({ data: { passwort: pw, artikelId: id } });
    setSections(res.sections);
    setImages(res.images);
  }

  async function zuweisen(bildId: string, sectionId: string | null, position: number) {
    await verschieben({ data: { passwort, bildId, sectionId, position } });
    await daten(passwort, artikelId);
  }

  const nichtZugeordnet = useMemo(
    () => images.filter((b) => b.section_id === null),
    [images],
  );

  const quellenGruppen = useMemo(() => {
    const map = new Map<string, ImageRow[]>();
    for (const b of nichtZugeordnet) {
      const key = b.source_url || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return [...map.entries()];
  }, [nichtZugeordnet]);

  if (!freigegeben) {
    return (
      <div className="mx-auto max-w-sm p-8">
        <h1 className="mb-4 text-xl font-semibold">Bild-Zuordnung</h1>
        <Label htmlFor="pw">Passwort</Label>
        <Input
          id="pw"
          type="password"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && anmelden(passwort)}
          className="mt-1"
        />
        {pwFehler && <p className="mt-2 text-sm text-red-600">Falsches Passwort.</p>}
        <Button className="mt-4" disabled={laedt} onClick={() => anmelden(passwort)}>
          Öffnen
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-xl font-semibold">Bild-Zuordnung</h1>

      <div className="mb-6">
        <Label htmlFor="artikel">Artikel</Label>
        <select
          id="artikel"
          className="mt-1 block rounded-md border px-3 py-2 text-sm"
          value={artikelId}
          onChange={async (e) => {
            setArtikelId(e.target.value);
            await daten(passwort, e.target.value);
          }}
        >
          {artikel.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Linke Spalte */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
            Importierte Bilder ({nichtZugeordnet.length})
          </h2>
          {quellenGruppen.length === 0 && (
            <p className="text-sm text-gray-500">Alle Bilder sind zugeordnet.</p>
          )}
          {quellenGruppen.map(([quelle, bilder]) => (
            <div key={quelle} className="mb-3 rounded-xl bg-gray-100 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                {domain(quelle)} · {bilder.length}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {bilder.map((b) => (
                  <BildKachel key={b.id} bild={b} onDragStart={() => setGezogen(b.id)}>
                    <select
                      className="mt-2 w-full rounded border px-1 py-1 text-xs"
                      value=""
                      onChange={(e) =>
                        e.target.value && zuweisen(b.id, e.target.value, 9999)
                      }
                    >
                      <option value="">Abschnitt wählen …</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.heading}
                        </option>
                      ))}
                    </select>
                  </BildKachel>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Rechte Spalte */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Artikelstruktur</h2>
          {sections.map((s) => {
            const bilder = images
              .filter((b) => b.section_id === s.id)
              .sort((a, b) => a.order_in_section - b.order_in_section);
            return (
              <div
                key={s.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || gezogen;
                  if (id) void zuweisen(id, s.id, 9999);
                }}
                className="mb-3 rounded-xl bg-gray-100 p-3"
              >
                <p className="mb-2 text-sm font-medium">{s.heading}</p>
                {bilder.length === 0 && (
                  <p className="text-xs text-gray-500">Bilder hierher ziehen</p>
                )}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {bilder.map((b, i) => (
                    <div
                      key={b.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = e.dataTransfer.getData("text/plain") || gezogen;
                        if (id && id !== b.id) void zuweisen(id, s.id, i);
                      }}
                    >
                      <BildKachel bild={b} onDragStart={() => setGezogen(b.id)}>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span>{i + 1}</span>
                          <button
                            type="button"
                            className="underline"
                            onClick={() => zuweisen(b.id, null, 0)}
                          >
                            lösen
                          </button>
                        </div>
                      </BildKachel>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain") || gezogen;
              if (id) void zuweisen(id, null, 0);
            }}
            className="mb-3 rounded-xl bg-gray-100 p-3"
          >
            <p className="mb-2 text-sm font-medium">Nicht zugeordnet ({nichtZugeordnet.length})</p>
            {nichtZugeordnet.length === 0 ? (
              <p className="text-xs text-gray-500">Keine offenen Bilder.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {nichtZugeordnet.map((b) => (
                  <BildKachel key={b.id} bild={b} onDragStart={() => setGezogen(b.id)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
