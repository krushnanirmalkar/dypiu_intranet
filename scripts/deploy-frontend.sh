#!/usr/bin/env bash
set -euo pipefail

REPO="/opt/dypiu-intranet/repo"
LIVE="/var/www/dypiu-intranet"
BRANCH="dev"

cd "$REPO"

echo "== DYPIU Frontend Deployment =="

# Must be on dev
CURRENT_BRANCH="$(git branch --show-current)"
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "ERROR: Expected branch '$BRANCH', currently on '$CURRENT_BRANCH'."
  exit 1
fi

# Refuse deployment with uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: Repository has uncommitted changes."
  git status --short
  exit 1
fi

echo "Fetching latest Git state..."
git fetch origin "$BRANCH"

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "ERROR: Local dev is not identical to origin/dev."
  echo "Local : $LOCAL"
  echo "Remote: $REMOTE"
  echo "Pull/review changes before deploying."
  exit 1
fi

echo "Building commit:"
git log -1 --oneline

npm run build

test -f dist/index.html

echo "Deploying frontend..."
sudo rsync -av --delete "$REPO/dist/" "$LIVE/"

echo "$(git rev-parse HEAD) $(date -Is)" | sudo tee "$LIVE/.deployed-version" >/dev/null

echo "Deployment complete."
echo "Commit: $(git rev-parse --short HEAD)"
