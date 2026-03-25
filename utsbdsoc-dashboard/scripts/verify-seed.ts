import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function run(): Promise<void> {
  const [members, events, tasks, templates] = await Promise.all([
    prisma.member.count(),
    prisma.event.count(),
    prisma.task.count(),
    prisma.taskTemplate.count(),
  ])

  console.log('Seed Verification Report')
  console.log('------------------------')
  console.log(`Members: ${members}`)
  console.log(`Events: ${events}`)
  console.log(`Tasks: ${tasks}`)
  console.log(`Task Templates: ${templates}`)

  const failures: string[] = []
  if (members < 1) failures.push('[Seed] Expected at least 1 member')
  if (templates < 1) failures.push('[Seed] Expected at least 1 task template')

  if (failures.length > 0) {
    failures.forEach((f) => console.error(f))
    process.exitCode = 1
  }
}

run()
  .catch((error) => {
    console.error('[Seed] Verification failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
