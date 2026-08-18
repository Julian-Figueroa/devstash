// Quick connectivity + seed-data check for the Neon Postgres database via
// the Prisma driver adapter. Run with: npm run db:test
import "dotenv/config";

import { db } from "@/lib/db";

async function main() {
  const [{ now }] = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
  console.log(`✔ Connected to the database — server time: ${now.toISOString()}`);

  const itemTypeCount = await db.itemType.count();
  console.log(`✔ ItemType rows: ${itemTypeCount}`);

  const user = await db.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      collections: {
        orderBy: { name: "asc" },
        include: {
          defaultType: true,
          items: {
            include: { item: { include: { itemType: true, tags: { include: { tag: true } } } } },
          },
        },
      },
    },
  });

  if (!user) {
    console.log("✘ Demo user not found — run `npm run db:seed` first.");
    process.exitCode = 1;
    return;
  }

  console.log(`\n✔ Demo user: ${user.name} <${user.email}> (plan: ${user.plan})`);
  console.log(`✔ Collections: ${user.collections.length}`);

  let itemCount = 0;
  for (const collection of user.collections) {
    console.log(
      `\n  📁 ${collection.name} (${collection.slug}) — default type: ${collection.defaultType?.name ?? "none"}`
    );
    for (const { item } of collection.items) {
      itemCount++;
      const tags = item.tags.map(({ tag }) => tag.name).join(", ");
      console.log(`     • [${item.itemType.name}] ${item.title}${tags ? ` — tags: ${tags}` : ""}`);
    }
  }

  console.log(`\n🌱 ${itemCount} items across ${user.collections.length} collections — seed data looks good.`);
}

main()
  .catch((error) => {
    console.error("✘ Database check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
