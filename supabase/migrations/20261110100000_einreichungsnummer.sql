-- Einreichungsnummern bekommen einen Zufallsteil.
--
-- Bisher war die Nummer streng fortlaufend: NL27-001, NL27-002, NL27-003.
-- Wer eine Bewerbung aufrufen oder ändern will, braucht Nummer und E-Mail –
-- die Nummer war damit praktisch geschenkt, und die E-Mail-Adresse einer
-- bestimmten Person ist oft bekannt. Mit fünf zufälligen Zeichen am Ende
-- ist die Nummer nicht mehr zu erraten.
--
-- Die laufende Zählung bleibt erhalten, die Geschäftsstelle sieht also
-- weiterhin auf einen Blick, die wievielte Bewerbung vorliegt.
--
-- Nebenbei behoben: lpad(…, 3, '0') kürzt von rechts, sobald die Zahl mehr
-- als drei Stellen hat. Ab der 1000. Einreichung wäre aus 1000 die 100
-- geworden und der Eintrag an der eindeutigen Spalte gescheitert.

BEGIN;

CREATE OR REPLACE FUNCTION public.neuland_einreichungs_kennung()
RETURNS text AS $$
DECLARE
  nummer bigint := nextval('public.neuland_einreichung_nr_seq');
  gezaehlt text;
  zufall text;
BEGIN
  gezaehlt := CASE WHEN nummer < 1000 THEN lpad(nummer::text, 3, '0') ELSE nummer::text END;
  -- gen_random_uuid() stammt aus einer kryptografisch tauglichen Quelle.
  zufall := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));
  RETURN 'NL27-' || gezaehlt || '-' || zufall;
END;
$$ LANGUAGE plpgsql VOLATILE SET search_path = public;

ALTER TABLE public.neuland_einreichungen
  ALTER COLUMN einreichungs_id SET DEFAULT public.neuland_einreichungs_kennung();

COMMIT;
