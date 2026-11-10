-- Mitgliedsanträge in der Datenbank festhalten.
--
-- Bisher existierte ein Antrag ausschließlich als Mail an die Geschäftsstelle.
-- Schlug der Versand fehl, war er ersatzlos verloren – und die absendende
-- Person sah trotzdem eine Bestätigung. Ab jetzt wird der Antrag zuerst
-- gespeichert, die Mail ist nur noch die Benachrichtigung darüber.

BEGIN;

CREATE TABLE IF NOT EXISTS public.mitgliedsantraege (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vorname text NOT NULL,
  nachname text NOT NULL,
  email text NOT NULL,
  organisation text NOT NULL DEFAULT '',
  typ text NOT NULL DEFAULT 'Personenmitgliedschaft',
  nachricht text NOT NULL DEFAULT '',
  datenschutz_bestaetigt boolean NOT NULL DEFAULT false,
  gemeldet_am timestamptz,
  versandfehler text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mitgliedsantraege_offen_idx
  ON public.mitgliedsantraege (created_at DESC)
  WHERE gemeldet_am IS NULL;

DROP TRIGGER IF EXISTS mitgliedsantraege_updated_at ON public.mitgliedsantraege;
CREATE TRIGGER mitgliedsantraege_updated_at
BEFORE UPDATE ON public.mitgliedsantraege
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
