import type { Prompt, OutputMessage, SessionStats, ConnectionStatus } from './gemini-types';

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Pohela Boishakh Event Plan',
    content: 'Create a detailed event plan for our Pohela Boishakh celebration including venue setup, cultural performances schedule, food stall arrangements, and volunteer coordination.',
    category: 'event-planning',
    createdAt: new Date('2026-03-20'),
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Recruitment Campaign Draft',
    content: 'Draft an engaging recruitment post for new UTSBDSOC members. Highlight our cultural events, networking opportunities, and community spirit. Include emojis and make it Instagram-friendly.',
    category: 'recruitment',
    createdAt: new Date('2026-03-19'),
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Gallery Photo Captions',
    content: 'Generate creative and culturally meaningful captions for our Durga Puja 2025 photo gallery. Include both English and Bengali text where appropriate.',
    category: 'gallery',
    createdAt: new Date('2026-03-18'),
    isFavorite: true,
  },
  {
    id: '4',
    title: 'Sponsor Outreach Email',
    content: 'Write a professional email template for reaching out to potential sponsors for our upcoming cultural festival. Emphasize our reach among UTS students and the Sydney Bengali community.',
    category: 'event-planning',
    createdAt: new Date('2026-03-17'),
    isFavorite: false,
  },
  {
    id: '5',
    title: 'Event Budget Analysis',
    content: 'Analyze our event budget for the upcoming semester. We have $5000 allocated. Break down costs for: venue ($1500), catering ($2000), decorations ($500), marketing ($300), and contingency.',
    category: 'event-planning',
    createdAt: new Date('2026-03-16'),
    isFavorite: false,
  },
  {
    id: '6',
    title: 'Volunteer Role Descriptions',
    content: 'Create clear and concise role descriptions for event volunteers including: Stage Manager, Food Coordinator, Registration Desk, Photography Lead, and Crowd Management.',
    category: 'recruitment',
    createdAt: new Date('2026-03-15'),
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Social Media Calendar',
    content: 'Design a two-week social media content calendar leading up to our Eid celebration event. Include post ideas, hashtags, and optimal posting times for Instagram and Facebook.',
    category: 'general',
    createdAt: new Date('2026-03-14'),
    isFavorite: true,
  },
];

export const mockMessages: OutputMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Create a detailed event plan for our Pohela Boishakh celebration including venue setup, cultural performances schedule, food stall arrangements, and volunteer coordination.',
    timestamp: new Date('2026-03-23T10:30:00'),
    tokenCount: 42,
  },
  {
    id: '2',
    role: 'assistant',
    content: `# 🎉 Pohela Boishakh Celebration Event Plan

## Venue Setup (UTS Building 10, Level 5)

### Morning Setup (8:00 AM - 10:00 AM)
- **Stage Area**: Main presentation zone with traditional red & white draping
- **Photo Booth**: Alpona floor design backdrop with props
- **Registration Desk**: Near entrance with QR check-in system

### Decoration Elements
- Traditional *pata chitra* banners
- Marigold garlands at entry points  
- Mango leaf *toran* above doorways

---

## Cultural Performances Schedule

| Time | Performance | Duration |
|------|------------|----------|
| 11:00 AM | Rabindra Sangeet Opening | 20 min |
| 11:30 AM | Classical Dance - Kathak | 15 min |
| 12:00 PM | Baul Music Performance | 25 min |
| 12:30 PM | Lunch Break | 45 min |
| 1:15 PM | Poetry Recitation | 20 min |
| 1:45 PM | Folk Dance Medley | 30 min |
| 2:30 PM | Closing Ceremony | 15 min |

---

## Food Stall Arrangements

### Stall 1: Sweet Corner 🍬
- Roshogolla, Sandesh, Mishti Doi

### Stall 2: Savory Delights 🍛
- Panta Bhat with Ilish, Begun Bhaja

### Stall 3: Drinks & Snacks 🥤
- Aam Pora Shorbot, Jhal Muri

---

## Volunteer Coordination

**Total Volunteers Needed: 15**

- Stage Crew (3): Setup, sound check, performer coordination
- Food Team (4): Serving, restocking, hygiene maintenance  
- Registration (2): Check-in, wristband distribution
- Photography (2): Event coverage, social media updates
- Floaters (4): General assistance, crowd management

*All volunteers report at 7:30 AM for briefing.*`,
    timestamp: new Date('2026-03-23T10:30:15'),
    tokenCount: 387,
  },
];

export const mockStats: SessionStats = {
  tokensUsed: 12450,
  tokensLimit: 50000,
  latencyMs: 1240,
  costUsd: 0.037,
  requestsToday: 23,
  requestsLimit: 100,
};

export const mockConnection: ConnectionStatus = {
  isConnected: true,
  model: 'gemini-2.0-flash',
  lastPing: new Date(),
};

export const categoryLabels: Record<Prompt['category'], string> = {
  'event-planning': 'Event Planning',
  'recruitment': 'Recruitment',
  'gallery': 'Gallery',
  'general': 'General',
};

export const categoryEmojis: Record<Prompt['category'], string> = {
  'event-planning': '🎪',
  'recruitment': '👥',
  'gallery': '📸',
  'general': '💡',
};
