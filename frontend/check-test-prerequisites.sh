# Chat E2E Test - Quick Setup Checker (Linux/Mac)
#!/bin/bash

echo "========================================"
echo "Chat E2E Test - Quick Setup Checker"
echo "========================================"
echo ""

echo "Checking prerequisites..."
echo ""

# Check if Redis is running
echo "[1/4] Checking Redis..."
if docker ps 2>/dev/null | grep -q redis; then
    echo "✓ Redis is running"
else
    echo "✗ Redis is NOT running"
    echo ""
    echo "Starting Redis..."
    if docker run -d --name redis -p 6379:6379 redis:alpine 2>/dev/null; then
        echo "✓ Redis started successfully"
    else
        echo "✗ Failed to start Redis"
        echo "  Make sure Docker is installed and running"
        echo "  Or start Redis manually"
    fi
fi
echo ""

# Check if backend is accessible
echo "[2/4] Checking Backend..."
if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✓ Backend is running"
else
    echo "✗ Backend is NOT running"
    echo "  Please start backend manually:"
    echo "  cd backend"
    echo "  pnpm dev"
fi
echo ""

# Check if frontend is accessible
echo "[3/4] Checking Frontend..."
if curl -s http://localhost:4000 >/dev/null 2>&1; then
    echo "✓ Frontend is running"
else
    echo "✗ Frontend is NOT running"
    echo "  Note: Playwright can auto-start frontend"
    echo "  Or start manually: cd frontend && pnpm dev"
fi
echo ""

# Check if Playwright is installed
echo "[4/4] Checking Playwright..."
if [ -d "node_modules/@playwright/test" ]; then
    echo "✓ Playwright is installed"
else
    echo "✗ Playwright is NOT installed"
    echo "  Run: pnpm install"
fi
echo ""

echo "========================================"
echo "Setup Status Summary"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure all services are running (especially Redis)"
echo "2. Seed database if not done: cd backend && pnpm prisma db seed"
echo "3. Run tests: pnpm test:e2e"
echo ""
echo "For detailed guide, see: e2e/README.md"
echo "For evaluation report, see: e2e/TEST_EVALUATION_REPORT.md"
echo ""
