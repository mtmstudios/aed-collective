CREATE TABLE public.bildrechte (
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.bildrechte TO service_role;

ALTER TABLE public.bildrechte ENABLE ROW LEVEL SECURITY;

CREATE INDEX bildrechte_kategorie_idx ON public.bildrechte (kategorie);

CREATE TRIGGER bildrechte_updated_at
BEFORE UPDATE ON public.bildrechte
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();