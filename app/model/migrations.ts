import {
  addColumns,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: "work_orders",
          columns: [
            { name: "priority", type: "string", isOptional: true }, // 👈 must exactly match schema
          ],
        }),
      ],
    },
  ],
});
