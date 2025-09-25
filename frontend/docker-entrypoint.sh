#!/bin/sh
set -e

# Ensure writable build directories when bind-mounted from host with differing UID
mkdir -p .next
chown -R nextjs:nodejs .next || true

exec "$@"