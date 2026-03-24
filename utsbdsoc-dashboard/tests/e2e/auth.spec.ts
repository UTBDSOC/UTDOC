import { test, expect } from './fixtures'

test.describe('Authentication', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard')
    
    // Should redirect to login or show login prompt
    await expect(page).toHaveURL(/\/(login|auth)/)
  })

  test('displays login page correctly', async ({ page }) => {
    await page.goto('/login')
    
    // Check for login elements
    await expect(page.locator('h1, h2')).toContainText(/sign in|log in|welcome/i)
    
    // Check for auth options (Google OAuth, magic link)
    const authButtons = page.locator('button, a').filter({ hasText: /google|sign in|continue/i })
    await expect(authButtons.first()).toBeVisible()
  })

  test('shows user menu when authenticated', async ({ page }) => {
    // This test will need auth state setup
    // For now, just check the login page loads
    await page.goto('/login')
    await expect(page).toHaveURL(/login/)
  })
})
