#!/usr/bin/env bash
# Update the live site in one command.
#
#   ./deploy.sh                 pull, push and deploy
#   ./deploy.sh "new rooms"     same, with a note on the version
#
# Steps: git pull -> clasp push -> clasp deploy (same deployment, so the URL never changes).
# The deployment ID is read from the file .deployment-id next to this script.
# It isn't secret, so it's fine to commit it.

set -euo pipefail
cd "$(dirname "$0")"

NOTE="${1:-update $(date '+%Y-%m-%d %H:%M')}"
ID_FILE=".deployment-id"

if [[ ! -s "$ID_FILE" ]]; then
  echo "Missing $ID_FILE: the ID of your web app deployment."
  echo
  echo "Your deployments:"
  clasp deployments || true
  echo
  echo "Copy the ID of the web app deployment (it starts with AKfy, NOT the one marked @HEAD)"
  echo "and save it:"
  echo "    echo AKfy... > $ID_FILE"
  exit 1
fi
DEPLOYMENT_ID="$(tr -d '[:space:]' < "$ID_FILE")"

echo "1/3  git pull"
git pull --ff-only

echo "2/3  clasp push"
clasp push --force

echo "3/3  clasp deploy"
clasp deploy --deploymentId "$DEPLOYMENT_ID" --description "$NOTE"

echo
echo "Done. Same URL, new version: $NOTE"
