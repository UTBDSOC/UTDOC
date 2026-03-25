import { Member, Event, Task, EOPItem, EventFile, MeetingMinutes, Notification } from '../types'

export const mockMembers: Member[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'president@utsbdsoc.com',
    full_name: 'Wasif Karim',
    role: 'admin',
    team: 'general',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wasif',
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'events@utsbdsoc.com',
    full_name: 'Sarah Ahmed',
    role: 'team_lead',
    team: 'events',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    email: 'marketing@utsbdsoc.com',
    full_name: 'Rohan Gupta',
    role: 'team_lead',
    team: 'marketing',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    created_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'finance@utsbdsoc.com',
    full_name: 'Anika Rahman',
    role: 'team_lead',
    team: 'finance',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anika',
    created_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    email: 'sponsor@utsbdsoc.com',
    full_name: 'Zayed Khan',
    role: 'member',
    team: 'sponsorship',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zayed',
    created_at: new Date().toISOString(),
  },
]

export const mockEvents: Event[] = [
  {
    id: 'eeeeeeee-1111-4111-8111-111111111111',
    name: 'Boishakhi Mela 2026',
    date: '2026-04-14T10:00:00Z',
    venue: 'UTS Great Hall',
    estimated_attendance: 500,
    description: 'Annual Bengali New Year celebration with food, music, and cultural performances.',
    status: 'planning',
    collab_clubs: ['UTS Music Society', 'UTS Foodies'],
    main_contact_id: '22222222-2222-4222-8222-222222222222',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'eeeeeeee-2222-4222-8222-222222222222',
    name: 'Grammys Night',
    date: '2026-05-20T18:00:00Z',
    venue: 'The Underground',
    estimated_attendance: 150,
    description: 'A formal awards night for the society members.',
    status: 'active',
    main_contact_id: '22222222-2222-4222-8222-222222222222',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'eeeeeeee-3333-4333-8333-333333333333',
    name: 'Freshers Welcome 2025',
    date: '2025-03-10T14:00:00Z',
    venue: 'UTS Tower Building',
    estimated_attendance: 200,
    status: 'post_event',
    main_contact_id: '22222222-2222-4222-8222-222222222222',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockTasks: Task[] = [
  {
    id: '77777777-1111-4111-8111-111111111111',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    title: 'Venue Booking',
    category: 'General',
    status: 'completed',
    assignee_id: '22222222-2222-4222-8222-222222222222',
    assignee: mockMembers[1],
    deadline: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: '77777777-2222-4222-8222-222222222222',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    title: 'Sponsorship Proposal',
    category: 'Contracts & Proposals',
    status: 'in_progress',
    assignee_id: '55555555-5555-4555-8555-555555555555',
    assignee: mockMembers[4],
    deadline: '2026-02-10',
    notes: 'Drafting the new gold tier package.',
    created_at: new Date().toISOString(),
  },
  {
    id: '77777777-3333-4333-8333-333333333333',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    title: 'Poster Design',
    category: 'Marketing',
    status: 'not_started',
    assignee_id: '33333333-3333-4333-8333-333333333333',
    assignee: mockMembers[2],
    deadline: '2026-03-01',
    created_at: new Date().toISOString(),
  },
  {
    id: '77777777-4444-4444-8444-444444444444',
    event_id: 'eeeeeeee-2222-4222-8222-222222222222',
    title: 'Awards Selection',
    category: 'Event Program',
    status: 'blocked',
    assignee_id: '11111111-1111-4111-8111-111111111111',
    assignee: mockMembers[0],
    deadline: '2026-04-30',
    notes: 'Waiting for member voting to close.',
    created_at: new Date().toISOString(),
  },
]

export const mockEOPItems: EOPItem[] = [
  {
    id: 'ee000000-1111-4111-8111-111111111111',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    item_key: 'risk_assessment',
    label: 'Risk Assessment',
    is_required: true,
    is_completed: false,
  },
  {
    id: 'ee000000-2222-4222-8222-222222222222',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    item_key: 'food_handling',
    label: 'Food Handling Certificate',
    is_required: true,
    is_completed: false,
  },
  {
    id: 'ee000000-3333-4333-8333-333333333333',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    item_key: 'facilities_request',
    label: 'Facilities Request',
    is_required: true,
    is_completed: true,
    file_url: '#',
    uploaded_by: '22222222-2222-4222-8222-222222222222',
    uploaded_at: new Date().toISOString(),
  },
]

export const mockFiles: EventFile[] = [
  {
    id: 'ffffffff-1111-4111-8111-111111111111',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    file_name: 'Budget_Draft_v1.xlsx',
    file_url: '#',
    category: 'Finance',
    uploaded_by_id: '44444444-4444-4444-8444-444444444444',
    uploaded_by: mockMembers[3],
    uploaded_at: new Date().toISOString(),
    file_size_bytes: 1024 * 45,
  },
]

export const mockMinutes: MeetingMinutes[] = [
  {
    id: 'dddddddd-1111-4111-8111-111111111111',
    event_id: 'eeeeeeee-1111-4111-8111-111111111111',
    meeting_date: '2026-01-05',
    attendees: ['Wasif Karim', 'Sarah Ahmed', 'Anika Rahman'],
    agenda: 'Initial planning for Boishakhi Mela',
    discussion: 'Decided on UTS Great Hall as the venue. Sarah to handle booking.',
    action_items: [
      { description: 'Book Great Hall', assignee_id: '22222222-2222-4222-8222-222222222222', create_task: true },
    ],
    created_at: new Date().toISOString(),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'nnnnnnnn-1111-4111-8111-111111111111',
    member_id: '11111111-1111-4111-8111-111111111111',
    type: 'task_overdue',
    title: 'Task Overdue',
    body: 'Venue Booking for Grammys Night is 2 days overdue.',
    is_read: false,
    link: '/events/eeeeeeee-2222-4222-8222-222222222222',
    created_at: new Date().toISOString(),
  },
]
