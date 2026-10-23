#!/usr/bin/env bash
set -e

echo "⛳ Setting up GRAPHING GOLF (Vite + React 18 + TypeScript)..."
mkdir -p src/data src/game src/scene/effects src/ui src/audio src/styles

echo "📦 Installing dependencies..."
npm install

echo "✅ Validating all 18 levels against math & collision engine..."
npx tsx src/game/validateLevels.ts

echo "🚀 Ready! Starting development server..."
npm run dev
