import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export type TestUser = {
  email: string;
  password: string;
  role: 'customer' | 'merchant' | 'driver' | 'admin';
};

export const testUsers: Record<string, TestUser> = {
  customer: {
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
  },
  merchant: {
    email: 'merchant@test.com',
    password: 'password123',
    role: 'merchant',
  },
  driver: {
    email: 'driver@test.com',
    password: 'password123',
  role: 'driver',
  },
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  },
};

/**
 * Login helper function
 */
export async function login(page: Page, user: TestUser) {
  await page.goto('/login');
  
  // Wait for login form to be visible
  await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({
    timeout: 10000,
  });

  // Fill in credentials
  await page.locator('input[type="email"], input[name="email"]').first().fill(user.email);
  await page.locator('input[type="password"], input[name="password"]').first().fill(user.password);
  
  // Click login button
  await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();
  
  // Wait for navigation after login
  await page.waitForURL('**', { waitUntil: 'networkidle', timeout: 15000 });
  
  // Verify we're logged in (check for some authenticated element)
  await page.waitForTimeout(1000);
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Try to find and click logout button
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), [data-testid="logout-button"]').first();
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL('**/login', { timeout: 5000 }).catch(() => {});
  }
}

/**
 * Create an order for testing
 */
export async function createTestOrder(page: Page): Promise<string | null> {
  try {
    // Navigate to restaurants/menu page
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Find and click on a restaurant
    const restaurantCard = page.locator('[data-testid="restaurant-card"], .restaurant-card, a[href*="/restaurant/"], a[href*="/merchant/"]').first();
    if (await restaurantCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await restaurantCard.click();
      await page.waitForTimeout(1000);
      
      // Add items to cart
      const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-testid="add-to-cart"]').first();
      if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await addToCartButton.click();
        await page.waitForTimeout(500);
        
        // Go to checkout
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Order"), a[href*="/checkout"]').first();
        if (await checkoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await checkoutButton.click();
          await page.waitForTimeout(1000);
          
          // Complete the order
          const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Confirm"), button[type="submit"]').first();
          if (await placeOrderButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await placeOrderButton.click();
            await page.waitForTimeout(2000);
            
            // Try to extract order ID from URL or page
            const currentUrl = page.url();
            const orderIdMatch = currentUrl.match(/order[s]?\/([a-f0-9-]+)/i);
            if (orderIdMatch) {
              return orderIdMatch[1];
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to create test order:', error);
    return null;
  }
}

/**
 * Wait for WebSocket connection
 */
export async function waitForSocketConnection(page: Page, timeout: number = 5000) {
  // Wait for socket.io connection
  await page.waitForFunction(
    () => {
      // Check if socket.io is loaded and connected
      return (window as any).socketConnected === true || 
             document.querySelector('[data-socket-status="connected"]') !== null;
    },
    { timeout }
  ).catch(() => {
    console.log('Socket connection not detected, continuing anyway...');
  });
}

/**
 * Extended test with fixtures
 */
type TestFixtures = {
  customerPage: Page;
  merchantPage: Page;
  driverPage: Page;
};

export const test = base.extend<TestFixtures>({
  customerPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, testUsers.customer);
    await use(page);
    await context.close();
  },
  
  merchantPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, testUsers.merchant);
    await use(page);
    await context.close();
  },
  
  driverPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, testUsers.driver);
    await use(page);
    await context.close();
  },
});

export { expect };
