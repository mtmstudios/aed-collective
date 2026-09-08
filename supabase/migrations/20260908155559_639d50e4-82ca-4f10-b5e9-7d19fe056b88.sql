CREATE SEQUENCE IF NOT EXISTS public.neuland_einreichung_nr_seq START 1;

CREATE TABLE public.neuland_einreichungen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  einreichungs_id TEXT NOT NULL UNIQUE DEFAULT ('NL27-' || lpad(nextval('public.neuland_einreichung_nr_seq')::text, 3, '0')),
  status TEXT NOT NULL DEFAULT 'entwurf',
  vorname TEXT,
  nachname TEXT,
  email TEXT NOT NULL,
  telefon TEXT,
  institution TEXT,
  kategorie TEXT,
  projekttitel TEXT,
  kurzbeschreibung TEXT,
  idee TEXT,
  umsetzung TEXT,
  nutzen TEXT,
  nachhaltigkeit TEXT,
  titelbild JSONB,
  detailfotos JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_link TEXT,
  rechte_bestaetigt BOOLEAN NOT NULL DEFAULT false,
  eingereicht_am TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX neuland_einreichungen_email_idx ON public.neuland_einreichungen (lower(email));

GRANT ALL ON public.neuland_einreichungen TO service_role;
GRANT USAGE ON SEQUENCE public.neuland_einreichung_nr_seq TO service_role;

ALTER TABLE public.neuland_einreichungen ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER neuland_einreichungen_updated_at
BEFORE UPDATE ON public.neuland_einreichungen
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();