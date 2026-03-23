export type MemberRole = 'admin' | 'team_lead' | 'member'
export type TeamName = 'events' | 'marketing' | 'finance' | 'sponsorship' | 'it' | 'general'
export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed'
export type EventStatus = 'planning' | 'active' | 'post_event' | 'archived'

export interface Member {
  id: string
  email: string
  full_name: string
  role: MemberRole
  team: TeamName
  avatar_url?: string
  created_at: string
}

export interface Event {
  id: string
  name: string
  date: string
  venue?: string
  estimated_attendance?: number
  description?: string
  status: EventStatus
  collab_clubs?: string[]
  main_contact_id?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  event_id: string
  title: string
  category: string
  status: TaskStatus
  assignee_id?: string
  assignee?: Member
  deadline?: string
  notes?: string
  completed_at?: string
  created_at: string
}

export interface EOPItem {
  id: string
  event_id: string
  item_key: string
  label: string
  is_required: boolean
  is_completed: boolean
  file_url?: string
  uploaded_by?: string
  uploaded_at?: string
}

export interface EventFile {
  id: string
  event_id: string
  file_name: string
  file_url: string
  category: string
  uploaded_by_id: string
  uploaded_by?: Member
  uploaded_at: string
  file_size_bytes?: number
}

export interface MeetingMinutes {
  id: string
  event_id: string
  meeting_date: string
  attendees: string[]
  apologies?: string[]
  agenda: string
  discussion: string
  action_items: ActionItem[]
  created_at: string
}

export interface ActionItem {
  description: string
  assignee_id?: string
  deadline?: string
  create_task: boolean
}

export interface Notification {
  id: string
  member_id: string
  type: string
  title: string
  body: string
  is_read: boolean
  link?: string
  created_at: string
}
