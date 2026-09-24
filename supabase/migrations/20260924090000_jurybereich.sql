-- Jurybereich für die neuland-Einreichungen.
-- Zugänge legt die Geschäftsstelle an, die Rolle entscheidet über die Sicht.

CREATE TABLE public.jury_zugaenge (
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

CREATE UNIQUE INDEX jury_zugaenge_email_idx ON public.jury_zugaenge (lower(email));

GRANT ALL ON public.jury_zugaenge TO service_role;
ALTER TABLE public.jury_zugaenge ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER jury_zugaenge_updated_at
BEFORE UPDATE ON public.jury_zugaenge
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Eine Wertung je Jurymitglied und Einreichung.
CREATE TABLE public.jury_wertungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  einreichung_id uuid NOT NULL REFERENCES public.neuland_einreichungen(id) ON DELETE CASCADE,
  juror_id uuid NOT NULL REFERENCES public.jury_zugaenge(id) ON DELETE CASCADE,
  punkte smallint CHECK (punkte BETWEEN 1 AND 10),
  kommentar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (einreichung_id, juror_id)
);

CREATE INDEX jury_wertungen_einreichung_idx ON public.jury_wertungen (einreichung_id);

GRANT ALL ON public.jury_wertungen TO service_role;
ALTER TABLE public.jury_wertungen ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER jury_wertungen_updated_at
BEFORE UPDATE ON public.jury_wertungen
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
