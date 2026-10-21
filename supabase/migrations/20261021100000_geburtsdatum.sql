-- Geburtsdatum der einreichenden Person.
--
-- Teilnahmeberechtigt ist nach §9 der Teilnahmebedingungen, wer zum
-- Einsendeschluss nicht älter als 28 Jahre ist. Bisher wurde das nirgends
-- abgefragt; die Angabe ist für die Prüfung der Teilnahmeberechtigung nötig.
--
-- Die Spalte bleibt ohne NOT NULL, damit die bereits vorhandenen Einreichungen
-- gültig bleiben. Erzwungen wird die Angabe beim Absenden des Formulars.

ALTER TABLE public.neuland_einreichungen
  ADD COLUMN IF NOT EXISTS geburtsdatum date;
