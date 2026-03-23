import { PrismaClient, TaskCategory, Team, MemberRole } from "../src/generated/prisma";

const prisma = new PrismaClient();

const taskTemplates = [
  // General
  { text: "Book venue / confirm availability", category: TaskCategory.GENERAL, defaultTeam: Team.LOGISTICS, sortOrder: 1 },
  { text: "Create event timeline / run sheet", category: TaskCategory.GENERAL, defaultTeam: Team.OPERATIONS, sortOrder: 2 },
  { text: "Confirm event date with all stakeholders", category: TaskCategory.GENERAL, defaultTeam: Team.OPERATIONS, sortOrder: 3 },
  { text: "Arrange equipment (AV, tables, chairs)", category: TaskCategory.GENERAL, defaultTeam: Team.LOGISTICS, sortOrder: 4 },

  // Contracts & Proposals
  { text: "Draft event proposal for ActivateUTS", category: TaskCategory.CONTRACTS_PROPOSALS, defaultTeam: Team.OPERATIONS, isEopRelated: true, sortOrder: 1 },
  { text: "Submit EOP to ActivateUTS", category: TaskCategory.CONTRACTS_PROPOSALS, defaultTeam: Team.OPERATIONS, isEopRelated: true, sortOrder: 2 },
  { text: "Draft MOU with collaborating clubs", category: TaskCategory.CONTRACTS_PROPOSALS, defaultTeam: Team.OPERATIONS, sortOrder: 3 },
  { text: "Confirm sponsorship agreements", category: TaskCategory.CONTRACTS_PROPOSALS, defaultTeam: Team.FINANCE, sortOrder: 4 },

  // Marketing
  { text: "Design event poster / social media assets", category: TaskCategory.MARKETING, defaultTeam: Team.CREATIVE, sortOrder: 1 },
  { text: "Write event description / captions", category: TaskCategory.MARKETING, defaultTeam: Team.MARKETING, sortOrder: 2 },
  { text: "Schedule social media posts (Instagram, Facebook)", category: TaskCategory.MARKETING, defaultTeam: Team.MARKETING, sortOrder: 3 },
  { text: "Create Facebook event page", category: TaskCategory.MARKETING, defaultTeam: Team.MARKETING, sortOrder: 4 },
  { text: "Send email blast to mailing list", category: TaskCategory.MARKETING, defaultTeam: Team.MARKETING, sortOrder: 5 },

  // Event Program
  { text: "Finalise event program / agenda", category: TaskCategory.EVENT_PROGRAM, defaultTeam: Team.OPERATIONS, sortOrder: 1 },
  { text: "Confirm guest speakers / performers", category: TaskCategory.EVENT_PROGRAM, defaultTeam: Team.OPERATIONS, sortOrder: 2 },
  { text: "Prepare MC script / talking points", category: TaskCategory.EVENT_PROGRAM, defaultTeam: Team.CREATIVE, sortOrder: 3 },
  { text: "Organise icebreakers / activities", category: TaskCategory.EVENT_PROGRAM, defaultTeam: Team.CREATIVE, sortOrder: 4 },

  // Decorations
  { text: "Plan decoration theme / mood board", category: TaskCategory.DECORATIONS, defaultTeam: Team.CREATIVE, sortOrder: 1 },
  { text: "Purchase / source decoration materials", category: TaskCategory.DECORATIONS, defaultTeam: Team.CREATIVE, sortOrder: 2 },
  { text: "Set up decorations on event day", category: TaskCategory.DECORATIONS, defaultTeam: Team.CREATIVE, sortOrder: 3 },

  // Food & Catering
  { text: "Get catering quotes (min 3 vendors)", category: TaskCategory.FOOD_CATERING, defaultTeam: Team.LOGISTICS, sortOrder: 1 },
  { text: "Confirm catering order and dietary requirements", category: TaskCategory.FOOD_CATERING, defaultTeam: Team.LOGISTICS, sortOrder: 2 },
  { text: "Arrange food pickup / delivery logistics", category: TaskCategory.FOOD_CATERING, defaultTeam: Team.LOGISTICS, sortOrder: 3 },

  // Finance
  { text: "Create event budget spreadsheet", category: TaskCategory.FINANCE, defaultTeam: Team.FINANCE, isEopRelated: true, sortOrder: 1 },
  { text: "Submit reimbursement claims", category: TaskCategory.FINANCE, defaultTeam: Team.FINANCE, sortOrder: 2 },
  { text: "Track ticket sales / registrations", category: TaskCategory.FINANCE, defaultTeam: Team.FINANCE, sortOrder: 3 },
  { text: "Prepare post-event financial report", category: TaskCategory.FINANCE, defaultTeam: Team.FINANCE, isEopRelated: true, sortOrder: 4 },
];

async function main() {
  console.log("Seeding task templates...");

  for (const template of taskTemplates) {
    await prisma.taskTemplate.upsert({
      where: { id: template.text.slice(0, 36) }, // won't match, forces create
      update: {},
      create: {
        text: template.text,
        category: template.category,
        defaultTeam: template.defaultTeam ?? null,
        isEopRelated: template.isEopRelated ?? false,
        sortOrder: template.sortOrder,
      },
    });
  }

  console.log(`Seeded ${taskTemplates.length} task templates`);

  // Seed test members
  const admin = await prisma.member.upsert({
    where: { email: "admin@utsbdsoc.org" },
    update: {},
    create: {
      email: "admin@utsbdsoc.org",
      name: "Test Admin",
      role: MemberRole.PRESIDENT,
      team: Team.OPERATIONS,
      positionTitle: "President",
      isActive: true,
    },
  });

  const member = await prisma.member.upsert({
    where: { email: "member@utsbdsoc.org" },
    update: {},
    create: {
      email: "member@utsbdsoc.org",
      name: "Test Member",
      role: MemberRole.GENERAL_EXEC,
      team: Team.MARKETING,
      positionTitle: "Marketing Lead",
      isActive: true,
    },
  });

  console.log(`Seeded test members: ${admin.name}, ${member.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
