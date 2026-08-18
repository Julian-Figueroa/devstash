// Quick connectivity check for the Neon Postgres database via the Prisma
// driver adapter. Run with: npm run db:test
import "dotenv/config";

import { db } from "@/lib/db";

async function main() {
  const [{ now }] = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
  console.log(`✔ Connected to the database — server time: ${now.toISOString()}`);

  const itemTypeCount = await db.itemType.count();
  console.log(`✔ ItemType rows: ${itemTypeCount}`);
}

main()
  .catch((error) => {
    console.error("✘ Database connection failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
