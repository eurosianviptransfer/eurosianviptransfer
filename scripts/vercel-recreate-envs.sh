#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/vercel-recreate-envs.sh <env-file> <environment>
# Example: ./scripts/vercel-recreate-envs.sh .env.production production

FILE="$1"
ENV="$2"

if [[ -z "$FILE" || -z "$ENV" ]]; then
  echo "Usage: $0 <env-file> <environment>" >&2
  exit 2
fi

if [[ ! -f "$FILE" ]]; then
  echo "File not found: $FILE" >&2
  if command -v vercel >/dev/null 2>&1; then
    echo "Attempting to pull envs from Vercel to create $FILE..."
    if vercel env pull "$FILE" --environment "$ENV" 2>/dev/null; then
      echo "Pulled envs to $FILE"
    else
      echo "Failed to pull envs. Please run: vercel env pull $FILE --environment $ENV" >&2
      exit 2
    fi
  else
    exit 2
  fi
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Install with: npm i -g vercel" >&2
  exit 3
fi

echo "Recreating Vercel envs in environment: $ENV from file: $FILE"

echo "Ensure you have linked the project (run 'vercel' or 'vercel link') and are logged in."

while IFS= read -r raw_line || [[ -n "$raw_line" ]]; do
  line="$(echo -n "$raw_line" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
  [[ -z "$line" || "${line:0:1}" == "#" ]] && continue

  # support lines like 'export KEY=VALUE' and trim whitespace
  line="${line#export }"
  KEY="${line%%=*}"
  VALUE="${line#*=}"
  KEY="$(echo -n "$KEY" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
  VALUE="$(echo -n "$VALUE" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"

  # strip surrounding single or double quotes from VALUE
  if [[ "$VALUE" =~ ^\".*\"$ || "$VALUE" =~ ^\'.*\'$ ]]; then
    VALUE="$(echo "$VALUE" | sed -E 's/^"(.*)"$/\1/; s/^\'\''(.*)\'\''$/\1/')"
  fi

  echo "Adding $KEY to $ENV"

  # Always pipe the value into vercel to avoid argument-order issues
  if printf '%s\n' "$VALUE" | vercel env add "$KEY" "$ENV" --yes 2>/dev/null; then
    echo "Added $KEY"
  else
    echo "Failed to add $KEY (vercel CLI output above)" >&2
  fi

done < "$FILE"

echo "Done. Verify with: vercel env ls"
