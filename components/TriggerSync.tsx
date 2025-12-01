import React from "react";
import { Button, View } from "react-native";

import sync from "@/app/db/sync/sync";

export default function TriggerSync() {
  return (
    <View>
      <Button title="Run Sync" onPress={sync} />
    </View>
  );
}
