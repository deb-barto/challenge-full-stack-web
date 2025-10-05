#!/usr/bin/env sh
set -eu

echo "[entrypoint] prisma generate…"
npx prisma generate 1>/dev/null

echo "[entrypoint] applying schema…"
if npx prisma migrate deploy; then
  echo "[entrypoint] migrate deploy ok"
else
  echo "[entrypoint] migrate deploy falhou"
fi

echo "[entrypoint] garantindo schema com db push…"
npx prisma db push

echo "[entrypoint] running seed (idempotent)…"
npx tsx prisma/seed.ts || echo "[entrypoint] seed falhou (ignorado)"

echo "[entrypoint] starting api…"
exec node dist/server.js