#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && cd .. && pwd )

echo "🏗️ preparing project"
pnpm install
pnpm run build

echo "🍎 preparing environment"
cd $SCRIPT_DIR/apps/backoffice-v2
cp .env.example .env

cd $SCRIPT_DIR/services/workflows-service
cp .env.example .env

echo ""
echo "📈 seeding database"
pnpm run docker:db
pnpm run db:reset:dev

echo "✅ all done; use"
echo "  pnpm run dev"
echo "and open 🌐 http://localhost:5173 to start hacking"