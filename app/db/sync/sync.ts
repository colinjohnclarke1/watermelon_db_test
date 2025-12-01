import { synchronize } from "@nozbe/watermelondb/sync";
import database from "..";

export default async function sync() {
  console.log("calling sync now");

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

        console.log("🚀 ~ sync ~ 4:", changes);

        console.log("pushing changes to server");

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

// export default async function sync() {
//   console.log("Testing sync endpoint...");

//   try {
//     // Test PULL endpoint
//     console.log("📥 Testing PULL endpoint...");
//     const pullResponse = await fetch("http://localhost:3000/sync/pull", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         last_pulled_at: Date.now(),
//       }),
//     });

//     if (!pullResponse.ok) {
//       throw new Error(`Pull failed: ${await pullResponse.text()}`);
//     }

//     const pullData = await pullResponse.json();
//     console.log("✅ PULL Response:", JSON.stringify(pullData, null, 2));

//     // Test PUSH endpoint (with empty changes)
//     console.log("\n📤 Testing PUSH endpoint...");
//     const testChanges = {
//       users: { created: [], updated: [], deleted: [] },
//       // Add other tables as needed
//     };

//     const pushResponse = await fetch("http://localhost:3000/sync/push", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(testChanges),
//     });

//     if (!pushResponse.ok) {
//       throw new Error(`Push failed: ${await pushResponse.text()}`);
//     }

//     console.log("✅ PUSH successful");
//     console.log("✅ Endpoint test completed successfully");
//   } catch (error) {
//     console.error("❌ Endpoint test failed:", error);
//     throw error;
//   }
// }
