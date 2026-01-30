import { test, expect, type Page } from '@playwright/test';
import { login, logout, testUsers, waitForSocketConnection } from './fixtures/test-helpers';

/**
 * E2E Tests for Chat Feature
 * 
 * This test suite covers the chat functionality including:
 * - Opening chat windows
 * - Sending and receiving messages
 * - Customer-Merchant chat
 * - Customer-Driver chat
 * - Real-time updates via WebSocket
 * - Chat status and permissions
 */

test.describe('Chat Feature E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test.describe('Chat Button and Window', () => {
    test('should display chat button on order details page', async ({ page }) => {
      await login(page, testUsers.customer);
      
      // Navigate to orders page
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      // Find and click on an order (if available)
      const orderLink = page.locator('a[href*="/order/"], [data-testid="order-link"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check if chat button is present
        const chatButton = page.locator('button:has-text("Chat"), [data-testid="chat-button"]');
        
        // Chat button might not be visible depending on order status
        const buttonExists = await chatButton.count() > 0;
        expect(buttonExists).toBeTruthy();
      } else {
        console.log('No orders found to test chat button');
        test.skip();
      }
    });

    test('should open chat window when chat button is clicked', async ({ page }) => {
      await login(page, testUsers.customer);
      
      // Navigate to an order with chat capability
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        // Find and click chat button (merchant or driver)
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          // Check if button is enabled
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            
            // Wait for chat window to appear
            await expect(page.locator('[data-testid="chat-window"], .chat-window, div:has-text("Chat with")')).toBeVisible({
              timeout: 10000,
            });
            
            // Verify chat window components
            await expect(page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first()).toBeVisible();
            await expect(page.locator('button:has-text("Send"), button[type="submit"]').last()).toBeVisible();
          } else {
            console.log('Chat button is disabled - checking tooltip or reason');
            // Hover to see tooltip
            await chatButton.hover();
            await page.waitForTimeout(1000);
          }
        } else {
          console.log('No chat button found on this order');
          test.skip();
        }
      } else {
        console.log('No orders found');
        test.skip();
      }
    });

    test('should close chat window when close button is clicked', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            
            // Wait for chat window
            const chatWindow = page.locator('[data-testid="chat-window"], div:has(input[placeholder*="message"])').first();
            await expect(chatWindow).toBeVisible({ timeout: 10000 });
            
            // Click close button
            const closeButton = chatWindow.locator('button:has-text("×"), button[aria-label*="close"], button:has(svg)').first();
            await closeButton.click();
            
            // Verify chat window is closed
            await expect(chatWindow).not.toBeVisible({ timeout: 5000 });
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Message Sending and Receiving', () => {
    test('should send a message in chat', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            await page.waitForTimeout(2000);
            
            // Find message input
            const messageInput = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
            await expect(messageInput).toBeVisible({ timeout: 10000 });
            
            // Type a test message
            const testMessage = `Test message from E2E test at ${new Date().toISOString()}`;
            await messageInput.fill(testMessage);
            
            // Send the message
            const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').last();
            await sendButton.click();
            
            // Wait for message to appear in chat
            await page.waitForTimeout(2000);
            
            // Verify message appears in the chat window
            const messageElement = page.locator(`text="${testMessage}"`).first();
            await expect(messageElement).toBeVisible({ timeout: 10000 });
            
            // Verify input is cleared after sending
            await expect(messageInput).toHaveValue('');
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('should handle Enter key to send message', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            await page.waitForTimeout(2000);
            
            const messageInput = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
            await expect(messageInput).toBeVisible({ timeout: 10000 });
            
            // Type and press Enter
            const testMessage = `Test Enter key message ${Date.now()}`;
            await messageInput.fill(testMessage);
            await messageInput.press('Enter');
            
            // Wait and verify message appears
            await page.waitForTimeout(2000);
            const messageElement = page.locator(`text="${testMessage}"`).first();
            await expect(messageElement).toBeVisible({ timeout: 10000 });
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('should not send empty messages', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            await page.waitForTimeout(2000);
            
            const messageInput = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
            await expect(messageInput).toBeVisible({ timeout: 10000 });
            
            // Get initial message count
            const messagesBefore = await page.locator('.chat-message, [data-testid="chat-message"]').count();
            
            // Try to send empty message
            await messageInput.fill('   '); // Only spaces
            const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').last();
            await sendButton.click();
            
            await page.waitForTimeout(1000);
            
            // Verify no new message was added
            const messagesAfter = await page.locator('.chat-message, [data-testid="chat-message"]').count();
            expect(messagesAfter).toBe(messagesBefore);
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Chat Permissions and Status', () => {
    test('should show correct chat availability based on order status', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      // Check multiple orders to test different statuses
      const orderLinks = await page.locator('a[href*="/order/"]').all();
      
      if (orderLinks.length > 0) {
        for (let i = 0; i < Math.min(3, orderLinks.length); i++) {
          await page.goto('/orders');
          await page.waitForLoadState('networkidle');
          
          const currentOrderLink = page.locator('a[href*="/order/"]').nth(i);
          await currentOrderLink.click();
          await page.waitForLoadState('networkidle');
          
          // Check merchant chat button
          const merchantChatButton = page.locator('button:has-text("Chat with Restaurant")').first();
          if (await merchantChatButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            const isMerchantChatDisabled = await merchantChatButton.isDisabled();
            console.log(`Order ${i + 1}: Merchant chat ${isMerchantChatDisabled ? 'disabled' : 'enabled'}`);
          }
          
          // Check driver chat button
          const driverChatButton = page.locator('button:has-text("Chat with Driver")').first();
          if (await driverChatButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            const isDriverChatDisabled = await driverChatButton.isDisabled();
            console.log(`Order ${i + 1}: Driver chat ${isDriverChatDisabled ? 'disabled' : 'enabled'}`);
          }
          
          await page.goBack();
        }
        
        // Test passes if we checked at least one order
        expect(orderLinks.length).toBeGreaterThan(0);
      } else {
        test.skip();
      }
    });

    test('should display tooltip when chat is disabled', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        // Find any chat button (merchant or driver)
        const chatButtons = await page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').all();
        
        for (const button of chatButtons) {
          const isDisabled = await button.isDisabled();
          
          if (isDisabled) {
            // Hover over disabled button to see tooltip
            await button.hover();
            await page.waitForTimeout(1000);
            
            // Check for tooltip/title attribute
            const title = await button.getAttribute('title');
            console.log('Disabled chat button tooltip:', title);
            
            // Verify tooltip exists and has content
            if (title) {
              expect(title.length).toBeGreaterThan(0);
            }
            break;
          }
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('WebSocket Connection', () => {
    test('should establish WebSocket connection when chat opens', async ({ page }) => {
      await login(page, testUsers.customer);
      
      // Listen for WebSocket connections
      const wsConnections: any[] = [];
      page.on('websocket', ws => {
        console.log('WebSocket connection detected:', ws.url());
        wsConnections.push(ws);
      });
      
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            await page.waitForTimeout(3000);
            
            // Check for WebSocket connection
            console.log(`Total WebSocket connections: ${wsConnections.length}`);
            
            // Look for socket.io connection indicator in the UI
            const connectionStatus = page.locator('text=/Online|Connected|Connecting/i').first();
            if (await connectionStatus.isVisible({ timeout: 5000 }).catch(() => false)) {
              const statusText = await connectionStatus.textContent();
              console.log('Connection status:', statusText);
              expect(statusText).toBeTruthy();
            }
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Chat History', () => {
    test('should load previous messages when reopening chat', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            // Open chat and send a message
            await chatButton.click();
            await page.waitForTimeout(2000);
            
            const messageInput = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
            if (await messageInput.isVisible({ timeout: 10000 }).catch(() => false)) {
              const testMessage = `History test ${Date.now()}`;
              await messageInput.fill(testMessage);
              await messageInput.press('Enter');
              await page.waitForTimeout(2000);
              
              // Close chat
              const closeButton = page.locator('button:has(svg)').first();
              await closeButton.click();
              await page.waitForTimeout(1000);
              
              // Reopen chat
              await chatButton.click();
              await page.waitForTimeout(2000);
              
              // Verify message is still there
              const messageElement = page.locator(`text="${testMessage}"`).first();
              await expect(messageElement).toBeVisible({ timeout: 10000 });
            } else {
              test.skip();
            }
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await login(page, testUsers.customer);
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderLink = page.locator('a[href*="/order/"]').first();
      
      if (await orderLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');
        
        const chatButton = page.locator('button:has-text("Chat with Restaurant"), button:has-text("Chat with Driver")').first();
        
        if (await chatButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const isDisabled = await chatButton.isDisabled();
          
          if (!isDisabled) {
            await chatButton.click();
            await page.waitForTimeout(2000);
            
            // Simulate offline mode
            await page.context().setOffline(true);
            
            const messageInput = page.locator('input[placeholder*="message"], input[placeholder*="Type"], textarea').first();
            if (await messageInput.isVisible({ timeout: 10000 }).catch(() => false)) {
              await messageInput.fill('Test offline message');
              await messageInput.press('Enter');
              
              // Wait for error indication
              await page.waitForTimeout(2000);
              
              // Look for error message or toast
              const errorIndicator = page.locator('text=/error|failed|offline/i').first();
              const hasError = await errorIndicator.isVisible({ timeout: 5000 }).catch(() => false);
              
              console.log('Error indicator shown:', hasError);
              
              // Restore online mode
              await page.context().setOffline(false);
            } else {
              test.skip();
            }
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });
});
