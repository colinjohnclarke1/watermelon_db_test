import database from "@/app/db";
import { withObservables } from "@nozbe/watermelondb/react";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define the shape of a WorkOrder
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  description: string;
  categoryName: string;
  locationName: string;
  clientName: string;
  workOrderStatusName: string;
  actionCount: number;
  visitCount: number;
  // Add more fields if needed
}

// Props for WorkOrderCard
interface WorkOrderCardProps {
  item: WorkOrder;
  onEdit: (item: WorkOrder) => void;
  onDelete: (id: string) => void;
}

// WorkOrderCard now triggers the modal handlers
const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => (
  <TouchableOpacity style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.workOrderNumber}>{item.workOrderNumber}</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.workOrderStatusName}</Text>
      </View>
    </View>

    <Text style={styles.description} numberOfLines={2}>
      {item.description}
    </Text>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{item.categoryName}</Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{item.locationName}</Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Client:</Text>
      <Text style={styles.value}>{item.clientName}</Text>
    </View>

    <View style={styles.countsRow}>
      <View style={styles.countBadge}>
        <Text style={styles.countLabel}>Actions</Text>
        <Text style={styles.countValue}>{item.actionCount}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countLabel}>Visits</Text>
        <Text style={styles.countValue}>{item.visitCount}</Text>
      </View>
    </View>

    <View style={styles.cardActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => onEdit(item)}
      >
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => onDelete(item.id)}
      >
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  handleUpdate: (item: WorkOrder) => void; // opens modal in edit mode
  handleDelete: (id: string) => void; // triggers delete
}

// Main list component
const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  workOrders,
  handleUpdate,
  handleDelete,
}) => {
  return (
    <FlatList
      data={workOrders}
      renderItem={({ item }) => (
        <WorkOrderCard
          item={item}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

// Wrap with observables
const enhance = withObservables([""], () => ({
  workOrders: database.get("work_orders").query().observe(),
}));

export default enhance(WorkOrdersList);

// Reuse your styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workOrderNumber: { fontSize: 18, fontWeight: "bold", color: "#333" },
  statusBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: "#1976D2", fontSize: 12, fontWeight: "600" },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", width: 80 },
  value: { fontSize: 14, color: "#666", flex: 1 },
  countsRow: { flexDirection: "row", marginTop: 12, marginBottom: 12, gap: 12 },
  countBadge: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  countLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  countValue: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#F44336" },
  actionButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
