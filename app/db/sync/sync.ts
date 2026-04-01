import { synchronize } from "@nozbe/watermelondb/sync";
import database from "..";

export default async function sync() {
  console.log("calling sync now");

  console.log("database", database);

  try {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        // PULL CHANGES Server → Client

        console.log("pulling from server");

        const response = await fetch("http://localhost:3000/sync/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            last_pulled_at: lastPulledAt,
            schema_version: schemaVersion,
            migration: migration,
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        console.log("✅ Pull successful");

        const { changes, timestamp } = await response.json();

        console.log("changes", changes, "timestamp", timestamp);

        return { changes, timestamp }; // ✅ REQUIRED
      },

      pushChanges: async ({ changes, lastPulledAt }) => {
        // PUSH CHANGES Client → Server

        console.log("RAW CHANGES:", JSON.stringify(changes, null, 2));

        const response = await fetch(`http://localhost:3000/sync/push`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        console.log("✅ Push successful");
      },
      migrationsEnabledAtVersion: 1,
    });

    console.log("✅ Sync completed successfully");
  } catch (error) {
    console.error("❌ Sync failed:", error);
    throw error;
  }
}
