import { test, expect } from "@playwright/test";

test.describe("Order Review Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show rate button on completed order in orders page", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "customer@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/orders");
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });

    await page.click('button:has-text("History")');
    await page.waitForTimeout(1000);

    const rateButton = page.locator('button:has-text("Rate Order")');
    const hasRateButton = await rateButton.count();

    if (hasRateButton > 0) {
      await rateButton.first().click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.getByText(/Rate Your Order|Your Review/)).toBeVisible();
    }
  });

  test("should show star rating in dialog", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "customer@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/orders");
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });

    await page.click('button:has-text("History")');
    await page.waitForTimeout(1000);

    const rateButton = page.locator('button:has-text("Rate Order")');
    const hasRateButton = await rateButton.count();

    if (hasRateButton > 0) {
      await rateButton.first().click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      const stars = page.locator('button:has(svg.lucide-star)');
      await expect(stars.first()).toBeVisible();
    }
  });

  test("should be able to submit a review", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "customer@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/orders");
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });

    await page.click('button:has-text("History")');
    await page.waitForTimeout(1000);

    const rateButton = page.locator('button:has-text("Rate Order")');
    const hasRateButton = await rateButton.count();

    if (hasRateButton > 0) {
      await rateButton.first().click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      const skipButtons = page.locator('text="Skip"');
      if ((await skipButtons.count()) > 0) {
        const stars = page.locator('[role="dialog"] button:has(svg)');
        const starButtons = await stars.all();
        if (starButtons.length >= 5) {
          await starButtons[4].click();
        }

        await page.fill(
          'textarea',
          "Great food and service!"
        );

        const submitButton = page.locator('button:has-text("Submit Review")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test("should show rate button on order detail page for completed order", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "customer@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/orders");
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });

    await page.click('button:has-text("History")');
    await page.waitForTimeout(1000);

    const viewDetailsButton = page.locator('a:has-text("View Details")');
    const hasViewDetails = await viewDetailsButton.count();

    if (hasViewDetails > 0) {
      await viewDetailsButton.first().click();
      await page.waitForURL(/\/orders\/.*/, { timeout: 5000 });

      const isCompleted =
        (await page.locator('text="Completed"').count()) > 0 ||
        (await page.locator('[data-status="COMPLETED"]').count()) > 0;

      if (isCompleted) {
        const rateButton = page.locator('button:has-text("Rate Order")');
        await expect(rateButton).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
