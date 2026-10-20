#!/usr/bin/env bash
# Gera um par RSA 2048 para assinar (privada) e validar (pública) os JWTs da API.
# Formato: PEM base64 em uma linha, sem cabeçalhos — o mesmo das env vars do Render.
#   ./scripts/gen-jwt-keys.sh            → grava/atualiza JWT_PUBLIC_KEY e JWT_PRIVATE_KEY em api/.env (dev)
#   ./scripts/gen-jwt-keys.sh --print    → só imprime (para colar no Environment do Render; um par por ambiente)
set -euo pipefail
cd "$(dirname "$0")/.."

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$tmp/private.pem" 2>/dev/null
openssl pkey -in "$tmp/private.pem" -pubout -out "$tmp/public.pem"
oneline() { grep -v -- '-----' "$1" | tr -d '\n'; }
pub=$(oneline "$tmp/public.pem")
priv=$(oneline "$tmp/private.pem")

if [[ "${1:-}" == "--print" ]]; then
  printf 'JWT_PUBLIC_KEY=%s\nJWT_PRIVATE_KEY=%s\n' "$pub" "$priv"
  exit 0
fi

[[ -f .env ]] || cp .env.example .env
sed -i.bak '/^JWT_PUBLIC_KEY=/d; /^JWT_PRIVATE_KEY=/d' .env && rm -f .env.bak
printf 'JWT_PUBLIC_KEY=%s\nJWT_PRIVATE_KEY=%s\n' "$pub" "$priv" >> .env
echo "Chaves JWT gravadas em api/.env (não versionado)."
