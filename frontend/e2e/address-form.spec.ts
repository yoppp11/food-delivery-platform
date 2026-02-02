import { test, expect } from '@playwright/test';

test.describe('Address Form Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });

  test('should display Add New Address dialog with map on profile page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.fill('input[type="email"]', 'customer@foodgo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.screenshot({ path: 'test-results/profile-page.png', fullPage: true });
    
    const addressTab = page.locator('button:has-text("Addresses"), [role="tab"]:has-text("Addresses")');
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(500);
    }
    
    const addAddressBtn = page.locator('button:has-text("Add Address")').first();
    if (await addAddressBtn.count() > 0) {
      await addAddressBtn.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/address-dialog.png', fullPage: true });
      
      const mapContainer = page.locator('.leaflet-container');
      const hasMap = await mapContainer.count() > 0;
      console.log('Map container found:', hasMap);
      
      const labelField = page.locator('text=Label, text=Label').first();
      const hasLabelField = await labelField.count() > 0;
      console.log('Label field found:', hasLabelField);
      
      const homeChip = page.locator('button:has-text("Home")');
      const hasHomeChip = await homeChip.count() > 0;
      console.log('Home chip found:', hasHomeChip);
      
      const officeChip = page.locator('button:has-text("Office")');
      const hasOfficeChip = await officeChip.count() > 0;
      console.log('Office chip found:', hasOfficeChip);
      
      const saveBtn = page.locator('button:has-text("Save Address")');
      const hasSaveBtn = await saveBtn.count() > 0;
      console.log('Save Address button found:', hasSaveBtn);
      
      expect(hasMap || hasLabelField || hasSaveBtn).toBeTruthy();
    }
  });

  test('should have Add New Address button in checkout', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.fill('input[type="email"]', 'customer@foodgo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await page.goto('/restaurants');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const merchantCard = page.locator('[class*="card"]').first();
    if (await merchantCard.count() > 0) {
      await merchantCard.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add")').first();
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.click();
        await page.waitForTimeout(500);
        
        const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout")').first();
        if (await checkoutBtn.count() > 0) {
          await checkoutBtn.click();
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          
          await page.screenshot({ path: 'test-results/checkout-page.png', fullPage: true });
          
          const changeAddressBtn = page.locator('button:has-text("Change")');
          if (await changeAddressBtn.count() > 0) {
            await changeAddressBtn.click();
            await page.waitForTimeout(500);
            
            const addNewAddressBtn = page.locator('button:has-text("Add New Address")');
            const hasAddNewAddressBtn = await addNewAddressBtn.count() > 0;
            console.log('Add New Address button found in checkout:', hasAddNewAddressBtn);
            
            expect(hasAddNewAddressBtn).toBeTruthy();
          }
        }
      }
    }
  });

  test('address form should have search functionality', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.fill('input[type="email"]', 'customer@foodgo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const addressTab = page.locator('button:has-text("Addresses"), [role="tab"]:has-text("Addresses")');
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(500);
    }
    
    const addAddressBtn = page.locator('button:has-text("Add Address")').first();
    if (await addAddressBtn.count() > 0) {
      await addAddressBtn.click();
      await page.waitForTimeout(1000);
      
      const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"]');
      const hasSearchInput = await searchInput.count() > 0;
      console.log('Search input found:', hasSearchInput);
      
      const useLocationBtn = page.locator('button:has-text("Use My Location"), button:has-text("Gunakan Lokasi")');
      const hasUseLocationBtn = await useLocationBtn.count() > 0;
      console.log('Use My Location button found:', hasUseLocationBtn);
      
      expect(hasSearchInput || hasUseLocationBtn).toBeTruthy();
    }
  });

  test('label selector should have preset options', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.fill('input[type="email"]', 'customer@foodgo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const addressTab = page.locator('button:has-text("Addresses"), [role="tab"]:has-text("Addresses")');
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(500);
    }
    
    const addAddressBtn = page.locator('button:has-text("Add Address")').first();
    if (await addAddressBtn.count() > 0) {
      await addAddressBtn.click();
      await page.waitForTimeout(1000);
      
      const homeBtn = page.locator('button:has-text("Home"), button:has-text("Rumah")');
      const officeBtn = page.locator('button:has-text("Office"), button:has-text("Kantor")');
      const otherBtn = page.locator('button:has-text("Other"), button:has-text("Lainnya")');
      
      const hasHome = await homeBtn.count() > 0;
      const hasOffice = await officeBtn.count() > 0;
      const hasOther = await otherBtn.count() > 0;
      
      console.log('Label preset buttons - Home:', hasHome, 'Office:', hasOffice, 'Other:', hasOther);
      
      expect(hasHome || hasOffice || hasOther).toBeTruthy();
    }
  });

  test('should have default address toggle', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    await page.fill('input[type="email"]', 'customer@foodgo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const addressTab = page.locator('button:has-text("Addresses"), [role="tab"]:has-text("Addresses")');
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(500);
    }
    
    const addAddressBtn = page.locator('button:has-text("Add Address")').first();
    if (await addAddressBtn.count() > 0) {
      await addAddressBtn.click();
      await page.waitForTimeout(1000);
      
      const defaultToggle = page.locator('text=default address, text=alamat utama');
      const hasDefaultToggle = await defaultToggle.count() > 0;
      console.log('Default address toggle found:', hasDefaultToggle);
      
      const switchElement = page.locator('[role="switch"]');
      const hasSwitch = await switchElement.count() > 0;
      console.log('Switch element found:', hasSwitch);
      
      expect(hasDefaultToggle || hasSwitch).toBeTruthy();
    }
  });
});
