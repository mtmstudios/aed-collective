#!/bin/sh
# Beendet die laufende Node-Anwendung auf dem Hetzner-Webhosting.
#
# Hetzner startet sie bei der nächsten Anfrage von selbst wieder – dann mit den
# frisch hochgeladenen Dateien. Ohne diesen Schritt läuft der alte Prozess
# weiter und sucht Dateien, die "rsync --delete" gerade entfernt hat; die Seite
# antwortet dann auf jeder Adresse mit Fehler 500.
#
# Das Skript gehört auf den Server und wird von dort aufgerufen:
#
#     ssh -p 222 benutzer@host "sh ~/aed/hetzner-neustart.sh"
#
# Der Umweg über eine Datei ist Absicht: Stünde das Suchmuster in der
# SSH-Befehlszeile, fände pgrep den eigenen Aufruf und beendete ihn mit.

set -e

MUSTER='bin/node .*start\.mjs'

pids=$(pgrep -f "$MUSTER" || true)

if [ -z "$pids" ]; then
  echo "Kein laufender Prozess gefunden – die Anwendung startet bei der nächsten Anfrage."
  exit 0
fi

echo "Beende: $pids"
for pid in $pids; do
  kill "$pid" 2>/dev/null || true
done

# Kurz Zeit zum geordneten Beenden lassen, sonst notfalls hart.
i=0
while [ "$i" -lt 10 ]; do
  sleep 1
  [ -z "$(pgrep -f "$MUSTER" || true)" ] && break
  i=$((i + 1))
done

uebrig=$(pgrep -f "$MUSTER" || true)
if [ -n "$uebrig" ]; then
  echo "Reagiert nicht, beende hart: $uebrig"
  for pid in $uebrig; do
    kill -9 "$pid" 2>/dev/null || true
  done
  sleep 2
fi

if [ -n "$(pgrep -f "$MUSTER" || true)" ]; then
  echo "Prozess ließ sich nicht beenden." >&2
  exit 1
fi

echo "Beendet. Die nächste Anfrage startet die Anwendung neu."
