#!/bin/bash
set -e

echo "🚀 Starting Next.js Migration..."

# 1. Move Prisma Directory
if [ -d "server/prisma" ]; then
    echo "📦 Moving Prisma folder to root..."
    # Copy content first to be safe, then remove if successful? Or just move.
    # On Windows/Bash mv usually works fine.
    if [ -d "prisma" ]; then
        echo "⚠️  'prisma' folder already exists at root. Merging/Skipping..."
    else
        mv server/prisma prisma
    fi
else
    echo "ℹ️  'server/prisma' not found (already moved?)"
fi

# 2. Clean up Workspace Config
if [ -f "pnpm-workspace.yaml" ]; then
    echo "🗑️  Removing pnpm-workspace.yaml..."
    rm pnpm-workspace.yaml
fi

# 3. Scaffold Next.js Directories
echo "ZE Creating directory structure..."
mkdir -p app/api
mkdir -p components
mkdir -p lib
mkdir -p hooks
mkdir -p public

# 4. Move Client Components (Drafting the move)
if [ -d "client/components" ]; then
    echo "📦 Moving client components..."
    cp -r client/components/* components/ 2>/dev/null || echo "No components to move or already moved."
fi

# 5. Move Hooks
if [ -d "client/hooks" ]; then
    echo "📦 Moving client hooks..."
    cp -r client/hooks/* hooks/ 2>/dev/null || echo "No hooks to move."
fi

# 6. Install Dependencies
echo "📥 Installing dependencies (this might take a moment)..."
pnpm install

echo "✅ Migration script finished."
