import { test, expect } from '@playwright/test';
import { login, testUsers } from './fixtures/test-helpers';

/**
 * Quick Chat Smoke Test
 * 
 * Test sederhana untuk quick validation bahwa chat feature berfungsi.
 * Berguna untuk debugging awal atau quick check.
 */

test.describe('Chat Smoke Test', () => {
  test('chat button exists and is clickable', async ({ page }) => {
    // Login as customer
    await login(page, testUsers.customer);
    
    // Go to orders page
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for reference
    await page.screenshot({ path: 'test-results/orders-page.png', fullPage: true });
    
    // Try to find an order
    const orderLinks = await page.locator('a[href*="/order/"]').all();
    console.log(`Found ${orderLinks.length} order(s)`);
    
    if (orderLinks.length > 0) {
      // Click first order
      await orderLinks[0].click();
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of order page
      await page.screenshot({ path: 'test-results/order-details-page.png', fullPage: true });
      
      // Look for any chat buttons
      const chatButtons = await page.locator('button:has-text("Chat")').all();
      console.log(`Found ${chatButtons.length} chat button(s)`);
      
      for (let i = 0; i < chatButtons.length; i++) {
        const button = chatButtons[i];
        const buttonText = await button.textContent();
        const isDisabled = await button.isDisabled();
        const isVisible = await button.isVisible();
        
        console.log(`Chat Button ${i + 1}:`);
        console.log(`  Text: ${buttonText}`);
        console.log(`  Visible: ${isVisible}`);
        console.log(`  Disabled: ${isDisabled}`);
        
        if (isVisible && !isDisabled) {
          console.log(`  Attempting to click button ${i + 1}...`);
          
          // Click the button
          await button.click();
          await page.waitForTimeout(3000);
          
          // Take screenshot after clicking
          await page.screenshot({ path: `test-results/chat-opened-${i + 1}.png`, fullPage: true });
          
          // Check if chat window opened
          const chatWindow = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
          const chatWindowVisible = await chatWindow.isVisible({ timeout: 5000 }).catch(() => false);
          
          console.log(`  Chat window visible: ${chatWindowVisible}`);
          
          if (chatWindowVisible) {
            console.log('✅ Chat opened successfully!');
            
            // Try to send a test message
            const testMessage = `Smoke test message ${Date.now()}`;
            await chatWindow.fill(testMessage);
            await page.screenshot({ path: 'test-results/message-typed.png', fullPage: true });
            
            await chatWindow.press('Enter');
            await page.waitForTimeout(2000);
            
            await page.screenshot({ path: 'test-results/message-sent.png', fullPage: true });
            
            // Verify message appears
            const messageInChat = await page.locator(`text="${testMessage}"`).isVisible({ timeout: 5000 }).catch(() => false);
            console.log(`  Message appeared in chat: ${messageInChat}`);
            
            expect(messageInChat).toBe(true);
            return; // Success, exit test
          } else {
            console.log('❌ Chat window did not open');
          }
        }
      }
      
      // If we get here, no chat button was clickable
      console.log('⚠️ No clickable chat buttons found or chat failed to open');
      test.fail();
    } else {
      console.log('⚠️ No orders found. Please create some test orders first.');
      test.skip();
    }
  });

  test('debug - check page HTML structure', async ({ page }) => {
    await login(page, testUsers.customer);
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    const orderLinks = await page.locator('a[href*="/order/"]').all();
    
    if (orderLinks.length > 0) {
      await orderLinks[0].click();
      await page.waitForLoadState('networkidle');
      
      // Get HTML of the page for debugging
      const html = await page.content();
      
      // Check for chat-related elements
      const hasMessageCircle = html.includes('MessageCircle');
      const hasChatText = html.toLowerCase().includes('chat');
      const hasChatButton = html.includes('button') && html.toLowerCase().includes('chat');
      
      console.log('=== Page Analysis ===');
      console.log(`Has MessageCircle icon: ${hasMessageCircle}`);
      console.log(`Has "chat" text: ${hasChatText}`);
      console.log(`Has chat button: ${hasChatButton}`);
      
      // Find all buttons
      const allButtons = await page.locator('button').all();
      console.log(`\nTotal buttons found: ${allButtons.length}`);
      
      for (let i = 0; i < Math.min(10, allButtons.length); i++) {
        const button = allButtons[i];
        const text = await button.textContent();
        const isVisible = await button.isVisible().catch(() => false);
        if (isVisible) {
          console.log(`  Button ${i + 1}: "${text?.trim()}"`);
        }
      }
      
      expect(allButtons.length).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });
});
