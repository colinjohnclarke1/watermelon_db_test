import React from "react";
import { Button, View } from "react-native";

import database from "@/app/db";

export default function ResetDB() {
  async function resetDatabase() {
    try {
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });
      console.log("✅ Database has been reset");
      alert("Database reset successfully!");
    } catch (error) {
      console.error("❌ Failed to reset database:", error);
      throw error;
    }
  }

  return (
    <View>
      <Button title="Reset" onPress={resetDatabase} />
    </View>
  );
}
