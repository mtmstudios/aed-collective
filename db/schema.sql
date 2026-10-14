-- Schema der aed-Website für eine eigene PostgreSQL-Datenbank (Hetzner).
--
-- Entstanden aus den Supabase-Migrationen unter supabase/migrations, ohne die
-- Supabase-eigenen Teile: keine RLS, keine GRANTs an service_role, keine
-- storage.objects-Policy. Der Zugriff läuft ausschließlich über den
-- Anwendungsbenutzer aus DATABASE_URL, also über Servercode – deshalb braucht
-- es keine Richtlinien auf Zeilenebene.
--
-- Einspielen:
--   psql "$DATABASE_URL" -f db/schema.sql

BEGIN;

-- Hält updated_at ohne Zutun der Anwendung aktuell.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ---------------------------------------------------------------------------
-- neuland: Einreichungen
-- ---------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.neuland_einreichung_nr_seq START 1;

CREATE TABLE IF NOT EXISTS public.neuland_einreichungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  einreichungs_id text NOT NULL UNIQUE
    DEFAULT ('NL27-' || lpad(nextval('public.neuland_einreichung_nr_seq')::text, 3, '0')),
  status text NOT NULL DEFAULT 'entwurf',
  vorname text,
  nachname text,
  email text NOT NULL,
  telefon text,
  institution text,
  kategorie text,
  projekttitel text,
  kurzbeschreibung text,
  idee text,
  umsetzung text,
  nutzen text,
  nachhaltigkeit text,
  titelbild jsonb,
  detailfotos jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_link text,
  rechte_bestaetigt boolean NOT NULL DEFAULT false,
  eingereicht_am timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS neuland_einreichungen_email_idx
  ON public.neuland_einreichungen (lower(email));

DROP TRIGGER IF EXISTS neuland_einreichungen_updated_at ON public.neuland_einreichungen;
CREATE TRIGGER neuland_einreichungen_updated_at
BEFORE UPDATE ON public.neuland_einreichungen
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Jurybereich
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.jury_zugaenge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  rolle text NOT NULL DEFAULT 'jury' CHECK (rolle IN ('jury', 'geschaeftsstelle')),
  passwort_hash text NOT NULL DEFAULT '',
  aktiv boolean NOT NULL DEFAULT true,
  letzter_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS jury_zugaenge_email_idx
  ON public.jury_zugaenge (lower(email));

DROP TRIGGER IF EXISTS jury_zugaenge_updated_at ON public.jury_zugaenge;
CREATE TRIGGER jury_zugaenge_updated_at
BEFORE UPDATE ON public.jury_zugaenge
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Eine Wertung je Jurymitglied und Einreichung.
CREATE TABLE IF NOT EXISTS public.jury_wertungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  einreichung_id uuid NOT NULL
    REFERENCES public.neuland_einreichungen(id) ON DELETE CASCADE,
  juror_id uuid NOT NULL
    REFERENCES public.jury_zugaenge(id) ON DELETE CASCADE,
  punkte smallint CHECK (punkte BETWEEN 1 AND 10),
  kommentar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (einreichung_id, juror_id)
);

CREATE INDEX IF NOT EXISTS jury_wertungen_einreichung_idx
  ON public.jury_wertungen (einreichung_id);

DROP TRIGGER IF EXISTS jury_wertungen_updated_at ON public.jury_wertungen;
CREATE TRIGGER jury_wertungen_updated_at
BEFORE UPDATE ON public.jury_wertungen
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Bildverzeichnis
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.bildrechte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pfad text NOT NULL UNIQUE,
  dateiname text NOT NULL,
  kategorie text NOT NULL,
  jahrgang text,
  status text NOT NULL DEFAULT 'ungeklaert',
  urheber text NOT NULL DEFAULT '',
  rechteart text NOT NULL DEFAULT '',
  quelle text NOT NULL DEFAULT '',
  freigabedatum date,
  notiz text NOT NULL DEFAULT '',
  verwendungen text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bildrechte_kategorie_idx ON public.bildrechte (kategorie);

DROP TRIGGER IF EXISTS bildrechte_updated_at ON public.bildrechte;
CREATE TRIGGER bildrechte_updated_at
BEFORE UPDATE ON public.bildrechte
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Artikelgerüst (Rohtexte und Bildzuordnung)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  heading text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  source_url text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL,
  order_in_section integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS images_article_idx ON public.images (article_id);
CREATE INDEX IF NOT EXISTS images_section_idx ON public.images (section_id);
CREATE INDEX IF NOT EXISTS sections_article_idx ON public.sections (article_id);

DROP TRIGGER IF EXISTS articles_updated_at ON public.articles;
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS sections_updated_at ON public.sections;
CREATE TRIGGER sections_updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS images_updated_at ON public.images;
CREATE TRIGGER images_updated_at BEFORE UPDATE ON public.images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
