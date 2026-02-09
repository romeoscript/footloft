import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "adminpassword";
  const name = "Admin User";

  const passwordHash = await hash(password, 12);

  // Upsert user without role first (to avoid type error if client is stale)
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
    },
    create: {
      email,
      name,
      passwordHash,
    },
  });

  // Manually set role using raw SQL to bypass potentially stale client types
  await prisma.$executeRaw`UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = ${email}`;

  // Fetch updated user to confirm
  const updatedUser = await prisma.user.findUnique({ where: { email } });
  console.log({ user: updatedUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
