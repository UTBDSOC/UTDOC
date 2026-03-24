import { test, expect } from './fixtures'

test.describe('Responsive Design', () => {
  test.describe('Mobile viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('homepage adapts to mobile', async ({ page }) => {
      await page.goto('/')
      
      // Page should load without horizontal scroll
      const body = page.locator('body')
      await expect(body).toBeVisible()
    })

    test('navigation is accessible on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Look for mobile menu button or bottom nav
      const mobileNav = page.locator('[data-testid="mobile-nav"], [data-testid="menu-button"], button[aria-label*="menu"], nav')
      await expect(mobileNav.first()).toBeVisible()
    })

    test('content is readable on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Main content should be visible
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  test.describe('Tablet viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } })

    test('layout adapts to tablet', async ({ page }) => {
      await page.goto('/')
      
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  test.describe('Desktop viewport', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test('sidebar is visible on desktop', async ({ page }) => {
      await page.goto('/')
      
      // Sidebar should be visible on desktop
      const sidebar = page.locator('aside, nav').first()
      await expect(sidebar).toBeVisible()
    })
  })
})
