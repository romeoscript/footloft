import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
  const email = "test@example.com";
  const password = "password123";

  console.log(`Testing login for ${email}...`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("User not found");
      return;
    }

    console.log("User found:", user.email);
    console.log("Password hash exists:", !!user.passwordHash);

    if (!user.passwordHash) {
      console.error("No password hash found for user");
      return;
    }

    const isValid = await compare(password, user.passwordHash);

    if (isValid) {
      console.log("✅ Login successful! Password matches.");
    } else {
      console.error("❌ Login failed! Password does not match.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
