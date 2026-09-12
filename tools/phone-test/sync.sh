#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== Syncing SkillForge engine & contracts to Phone Test Runner ==="
mkdir -p "$SCRIPT_DIR/src/contract/fixtures"
mkdir -p "$SCRIPT_DIR/src/contract/procedures"
mkdir -p "$SCRIPT_DIR/src/engine/__tests__"
mkdir -p "$SCRIPT_DIR/src/ui/dev"

cp "$ROOT_DIR/src/contract/"*.ts "$SCRIPT_DIR/src/contract/"
cp "$ROOT_DIR/src/contract/boardCalibration.json" "$SCRIPT_DIR/src/contract/"
cp -r "$ROOT_DIR/src/contract/fixtures/"* "$SCRIPT_DIR/src/contract/fixtures/"
cp -r "$ROOT_DIR/src/contract/procedures/"* "$SCRIPT_DIR/src/contract/procedures/"
cp "$ROOT_DIR/src/engine/"*.ts "$SCRIPT_DIR/src/engine/"
cp "$ROOT_DIR/src/engine/__tests__/"* "$SCRIPT_DIR/src/engine/__tests__/"
cp "$ROOT_DIR/src/ui/dev/MockPerception.ts" "$SCRIPT_DIR/src/ui/dev/"

echo "Sync complete! You can now run 'npx jest' inside tools/phone-test."
