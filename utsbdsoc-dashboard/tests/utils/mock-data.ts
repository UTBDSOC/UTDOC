// Mock user data
export const mockUser = {
  id: 'user-123',
  email: 'test@utsbdsoc.com',
  name: 'Test User',
  role: 'member',
}

// Mock event data
export const mockEvent = {
  id: 'event-123',
  name: 'Pohela Boishakh 2026',
  date: new Date('2026-04-14'),
  status: 'planning',
  description: 'Bengali New Year celebration',
}

// Mock task data
export const mockTask = {
  id: 'task-123',
  title: 'Book venue',
  status: 'pending',
  assigneeId: 'user-123',
  eventId: 'event-123',
  dueDate: new Date('2026-04-01'),
}

// Mock team member data
export const mockTeamMember = {
  id: 'member-123',
  name: 'Test Member',
  role: 'Events Director',
  team: 'events',
  avatar: null,
}
