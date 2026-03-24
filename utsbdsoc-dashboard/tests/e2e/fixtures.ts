import { test as base, expect } from '@playwright/test'

/**
 * Custom test fixtures for UTSBDSOC Dashboard E2E tests
 */

// Extend base test with custom fixtures
export const test = base.extend<{
  // Add custom fixtures here as needed
}>({
  // Custom fixtures will be added here
})

export { expect }

/**
 * Test data factories
 */
export const testData = {
  user: {
    email: 'test@utsbdsoc.com',
    name: 'Test User',
  },
  event: {
    name: 'Pohela Boishakh 2026',
    description: 'Bengali New Year celebration',
  },
  task: {
    title: 'Book venue',
    description: 'Find and book a suitable venue for the event',
  },
}

/**
 * Common page selectors
 */
export const selectors = {
  nav: {
    sidebar: '[data-testid="sidebar"]',
    dashboardLink: '[data-testid="nav-dashboard"]',
    eventsLink: '[data-testid="nav-events"]',
    tasksLink: '[data-testid="nav-tasks"]',
    teamLink: '[data-testid="nav-team"]',
  },
  auth: {
    loginButton: '[data-testid="login-button"]',
    logoutButton: '[data-testid="logout-button"]',
    userMenu: '[data-testid="user-menu"]',
  },
  dashboard: {
    statsCards: '[data-testid="stats-card"]',
    eventsList: '[data-testid="events-list"]',
    overduePanel: '[data-testid="overdue-panel"]',
  },
  events: {
    eventCard: '[data-testid="event-card"]',
    createButton: '[data-testid="create-event"]',
    eventForm: '[data-testid="event-form"]',
  },
  tasks: {
    taskCard: '[data-testid="task-card"]',
    statusSelect: '[data-testid="status-select"]',
    assigneeSelect: '[data-testid="assignee-select"]',
  },
}
