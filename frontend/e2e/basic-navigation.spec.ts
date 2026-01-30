import { test, expect } from '@playwright/test';

/**
 * Basic Navigation Test
 * Test untuk verify bahwa aplikasi bisa diakses dan basic navigation works
 */

test.describe('Basic App Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if page loaded
    expect(page.url()).toContain('localhost:4000');
    
    // Log all visible text
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains login/register:', bodyText?.toLowerCase().includes('login') || bodyText?.toLowerCase().includes('register'));
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Try to find login link or button
    const loginLink = page.locator('a[href*="/login"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign in"), a:has-text("Sign in")').first();
    
    const loginLinkExists = await loginLink.count() > 0;
    console.log('Login link found:', loginLinkExists);
    
    if (loginLinkExists) {
      await loginLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
      
      // Check if on login page
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      expect(currentUrl).toMatch(/login|signin/i);
    } else {
      // Maybe we're already on login page
      await page.goto('/login');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      await page.screenshot({ path: 'test-results/login-page-direct.png', fullPage: true });
    }
    
    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    
    const hasEmailInput = await emailInput.count() > 0;
    const hasPasswordInput = await passwordInput.count() > 0;
    
    console.log('Has email input:', hasEmailInput);
    console.log('Has password input:', hasPasswordInput);
    
    expect(hasEmailInput).toBe(true);
    expect(hasPasswordInput).toBe(true);
  });

  test('should attempt login with test credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Find login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first();
    
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    
    // Fill in test credentials
    await emailInput.fill('customer@example.com');
    await passwordInput.fill('password123');
    
    await page.screenshot({ path: 'test-results/before-login.png', fullPage: true });
    
    // Click login
    await loginButton.click();
    
    // Wait a bit for response
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/after-login-attempt.png', fullPage: true });
    
    // Check current URL
    const currentUrl = page.url();
    console.log('URL after login attempt:', currentUrl);
    
    // Check for error messages
    const errorMessages = await page.locator('text=/error|invalid|incorrect/i').all();
    if (errorMessages.length > 0) {
      for (const error of errorMessages) {
        const errorText = await error.textContent();
        console.log('Error message:', errorText);
      }
    }
    
    // Check if we're still on login page (login failed) or redirected (login success)
    const stillOnLoginPage = currentUrl.includes('/login');
    console.log('Still on login page:', stillOnLoginPage);
    
    if (stillOnLoginPage) {
      console.log('⚠️ Login failed - user may not exist. Please create test user: customer@example.com / password123');
    } else {
      console.log('✅ Login successful!');
    }
  });
});
