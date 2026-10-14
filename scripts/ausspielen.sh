#!/usr/bin/env bash
#
# Baut die Anwendung für Node und schiebt sie auf den Server.
#
#   HETZNER_ZIEL=benutzer@hostname:/usr/home/benutzer/aed ./scripts/ausspielen.sh
#
# Optional:
#   NEUSTART_BEFEHL   Befehl, der danach per SSH ausgeführt wird, um die
#                     Node-Anwendung neu zu starten. Ohne Angabe passiert das
#                     von Hand in konsoleH.
#
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -z "${HETZNER_ZIEL:-}" ]; then
  echo "HETZNER_ZIEL fehlt, z. B. benutzer@hostname:/usr/home/benutzer/aed" >&2
  exit 1
fi

echo "1/3  Bauen"
npm run build:node

preset=$(grep -o '"preset": "[^"]*"' .output/nitro.json | head -1)
if ! echo "$preset" | grep -q "node-server"; then
  echo "Abbruch: Der Build ist nicht für Node, sondern $preset" >&2
  exit 1
fi

echo "2/3  Übertragen nach $HETZNER_ZIEL"
# --delete räumt alte Dateien weg; die Dateiablage und die .env liegen
# außerhalb von .output und sind davon nicht betroffen.
rsync -az --delete --info=stats1 .output/ "$HETZNER_ZIEL/.output/"

echo "3/3  Neustart"
if [ -n "${NEUSTART_BEFEHL:-}" ]; then
  ssh "${HETZNER_ZIEL%%:*}" "$NEUSTART_BEFEHL"
  echo "     Neustart ausgelöst"
else
  echo "     Kein NEUSTART_BEFEHL gesetzt – Anwendung bitte in konsoleH neu starten."
fi

echo "Fertig."
