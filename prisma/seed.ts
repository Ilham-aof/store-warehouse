import { PrismaClient, Role } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admiN1", 12);

  await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@gmail.com",
      phone: "081234567890",
      password: hashedPassword,
      role: Role.Admin,
    },
  });

  console.log("Admin account created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
