import { Member, Event, Task, EOPItem, EventFile, MeetingMinutes, Notification } from '../types'

export const mockMembers: Member[] = [
  {
    id: 'm1',
    email: 'president@utsbdsoc.com',
    full_name: 'Wasif Karim',
    role: 'admin',
    team: 'general',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wasif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    email: 'events@utsbdsoc.com',
    full_name: 'Sarah Ahmed',
    role: 'team_lead',
    team: 'events',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm3',
    email: 'marketing@utsbdsoc.com',
    full_name: 'Rohan Gupta',
    role: 'team_lead',
    team: 'marketing',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm4',
    email: 'finance@utsbdsoc.com',
    full_name: 'Anika Rahman',
    role: 'team_lead',
    team: 'finance',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anika',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm5',
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
    id: 'e1',
    name: 'Boishakhi Mela 2026',
    date: '2026-04-14T10:00:00Z',
    venue: 'UTS Great Hall',
    estimated_attendance: 500,
    description: 'Annual Bengali New Year celebration with food, music, and cultural performances.',
    status: 'planning',
    collab_clubs: ['UTS Music Society', 'UTS Foodies'],
    main_contact_id: 'm2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e2',
    name: 'Grammys Night',
    date: '2026-05-20T18:00:00Z',
    venue: 'The Underground',
    estimated_attendance: 150,
    description: 'A formal awards night for the society members.',
    status: 'active',
    main_contact_id: 'm2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e3',
    name: 'Freshers Welcome 2025',
    date: '2025-03-10T14:00:00Z',
    venue: 'UTS Tower Building',
    estimated_attendance: 200,
    status: 'post_event',
    main_contact_id: 'm2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockTasks: Task[] = [
  {
    id: 't1',
    event_id: 'e1',
    title: 'Venue Booking',
    category: 'General',
    status: 'completed',
    assignee_id: 'm2',
    assignee: mockMembers[1],
    deadline: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 't2',
    event_id: 'e1',
    title: 'Sponsorship Proposal',
    category: 'Contracts & Proposals',
    status: 'in_progress',
    assignee_id: 'm5',
    assignee: mockMembers[4],
    deadline: '2026-02-10',
    notes: 'Drafting the new gold tier package.',
    created_at: new Date().toISOString(),
  },
  {
    id: 't3',
    event_id: 'e1',
    title: 'Poster Design',
    category: 'Marketing',
    status: 'not_started',
    assignee_id: 'm3',
    assignee: mockMembers[2],
    deadline: '2026-03-01',
    created_at: new Date().toISOString(),
  },
  {
    id: 't4',
    event_id: 'e2',
    title: 'Awards Selection',
    category: 'Event Program',
    status: 'blocked',
    assignee_id: 'm1',
    assignee: mockMembers[0],
    deadline: '2026-04-30',
    notes: 'Waiting for member voting to close.',
    created_at: new Date().toISOString(),
  },
]

export const mockEOPItems: EOPItem[] = [
  {
    id: 'eop1',
    event_id: 'e1',
    item_key: 'risk_assessment',
    label: 'Risk Assessment',
    is_required: true,
    is_completed: false,
  },
  {
    id: 'eop2',
    event_id: 'e1',
    item_key: 'food_handling',
    label: 'Food Handling Certificate',
    is_required: true,
    is_completed: false,
  },
  {
    id: 'eop3',
    event_id: 'e1',
    item_key: 'facilities_request',
    label: 'Facilities Request',
    is_required: true,
    is_completed: true,
    file_url: '#',
    uploaded_by: 'm2',
    uploaded_at: new Date().toISOString(),
  },
]

export const mockFiles: EventFile[] = [
  {
    id: 'f1',
    event_id: 'e1',
    file_name: 'Budget_Draft_v1.xlsx',
    file_url: '#',
    category: 'Finance',
    uploaded_by_id: 'm4',
    uploaded_by: mockMembers[3],
    uploaded_at: new Date().toISOString(),
    file_size_bytes: 1024 * 45,
  },
]

export const mockMinutes: MeetingMinutes[] = [
  {
    id: 'min1',
    event_id: 'e1',
    meeting_date: '2026-01-05',
    attendees: ['Wasif Karim', 'Sarah Ahmed', 'Anika Rahman'],
    agenda: 'Initial planning for Boishakhi Mela',
    discussion: 'Decided on UTS Great Hall as the venue. Sarah to handle booking.',
    action_items: [
      { description: 'Book Great Hall', assignee_id: 'm2', create_task: true },
    ],
    created_at: new Date().toISOString(),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    member_id: 'm1',
    type: 'task_overdue',
    title: 'Task Overdue',
    body: 'Venue Booking for Grammys Night is 2 days overdue.',
    is_read: false,
    link: '/events/e2',
    created_at: new Date().toISOString(),
  },
]
