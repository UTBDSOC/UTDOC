import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function run(): Promise<void> {
  console.log('[DB] Starting reset...')
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "notifications",
      "meeting_minutes",
      "inter_club_agreements",
      "event_files",
      "eop_items",
      "tasks",
      "event_members",
      "events",
      "task_templates",
      "members"
    RESTART IDENTITY CASCADE;
  `)
  console.log('[DB] Tables truncated')
}

run()
  .catch((error) => {
    console.error('[DB] Reset failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
