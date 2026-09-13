import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["OWNER", "ADMIN", "MANAGER", "CASHIER", "INVENTORY_STAFF"];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const ownerRole = await prisma.role.upsert({
    where: { name: "OWNER" },
    update: {},
    create: { name: "OWNER" },
  });

  await prisma.user.upsert({
    where: { email: "admin@retailflow.local" },
    update: { roleId: ownerRole.id, isActive: true },
    create: {
      email: "admin@retailflow.local",
      name: "Admin",
      passwordHash: "seed-placeholder",
      roleId: ownerRole.id,
      isActive: true,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
