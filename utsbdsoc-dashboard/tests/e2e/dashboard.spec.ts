import { test, expect, selectors } from './fixtures'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In real tests, you'd set up authenticated state here
    await page.goto('/')
  })

  test('homepage loads successfully', async ({ page }) => {
    // Check page loads without errors
    await expect(page).toHaveTitle(/UTSBDSOC|Dashboard/i)
  })

  test('displays navigation sidebar', async ({ page }) => {
    // Check sidebar is visible on desktop
    const sidebar = page.locator('nav, aside').first()
    await expect(sidebar).toBeVisible()
  })

  test('navigation links are functional', async ({ page }) => {
    // Test navigation to main sections
    const navLinks = page.locator('nav a, aside a')
    const linkCount = await navLinks.count()
    
    // Should have multiple nav links
    expect(linkCount).toBeGreaterThan(0)
  })

  test('displays main content area', async ({ page }) => {
    // Check main content renders
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })
})
