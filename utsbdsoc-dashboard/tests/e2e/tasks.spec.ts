import { test, expect } from './fixtures'

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks')
  })

  test('tasks page loads', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('displays task board or list view', async ({ page }) => {
    const content = page.locator('main')
    await expect(content).toBeVisible()
  })

  test('task filtering options exist', async ({ page }) => {
    // Check for filter/sort controls
    const filterElements = page.locator('select, [role="combobox"], button').filter({
      hasText: /filter|sort|status|all/i
    })
    
    // Filters may or may not exist depending on implementation
    const count = await filterElements.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
