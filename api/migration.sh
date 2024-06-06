#!/bin/sh
set -e
bun run migrate & PID=$!
wait $PID
echo "Migrations complete, starting server..."