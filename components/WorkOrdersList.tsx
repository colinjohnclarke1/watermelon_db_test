import { withObservables } from "@nozbe/watermelondb/react";

import database from "@/app/db";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Define the WorkOrder shape
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  description: string;
  categoryName: string;
  subcategoryName: string; // Add this
  locationName: string;
  clientName: string;
  workOrderStatusName: string;
  actionCount: number;
  visitCount: number;
}

// Props for WorkOrderCard
interface WorkOrderCardProps {
  item: WorkOrder;
  onEdit: (item: WorkOrder) => void;
  onDelete: (id: string) => void;
}

// WorkOrderCard component
const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
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

      <InfoRow label="Category:" value={item.categoryName} />
      <InfoRow label="Location:" value={item.locationName} />
      <InfoRow label="Client:" value={item.clientName} />

      <View style={styles.countsRow}>
        <CountBadge label="Actions" value={item.actionCount} />
        <CountBadge label="Visits" value={item.visitCount} />
      </View>

      <View style={styles.cardActions}>
        <ActionButton
          label="Edit"
          onPress={() => onEdit(item)}
          style={styles.editButton}
        />
        <ActionButton
          label="Delete"
          onPress={() => onDelete(item.id)}
          style={styles.deleteButton}
        />
      </View>
    </TouchableOpacity>
  );
};

// Reusable InfoRow
interface InfoRowProps {
  label: string;
  value: string | number;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Reusable CountBadge
interface CountBadgeProps {
  label: string;
  value: number;
}
const CountBadge: React.FC<CountBadgeProps> = ({ label, value }) => (
  <View style={styles.countBadge}>
    <Text style={styles.countLabel}>{label}</Text>
    <Text style={styles.countValue}>{value}</Text>
  </View>
);

// Reusable ActionButton
interface ActionButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}
const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  style,
}) => (
  <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress}>
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

// WorkOrdersList component
interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  handleUpdate: (item: WorkOrder) => void;
  handleDelete: (id: string) => void;
}

const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  workOrders,
  handleUpdate,
  handleDelete,
}) => (
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

// Observables enhancer

const enhance = withObservables([], () => ({
  workOrders: database
    .get("work_orders")
    .query()
    .observeWithColumns([
      "work_order_number",
      "description",
      "category_name",
      "subcategory_name",
      "location_name",
      "client_name",
      "work_order_status_name",
    ]),
}));

export default enhance(WorkOrdersList);

// Styles
interface Styles {
  card: ViewStyle;
  cardHeader: ViewStyle;
  workOrderNumber: TextStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  description: TextStyle;
  infoRow: ViewStyle;
  label: TextStyle;
  value: TextStyle;
  countsRow: ViewStyle;
  countBadge: ViewStyle;
  countLabel: TextStyle;
  countValue: TextStyle;
  cardActions: ViewStyle;
  actionButton: ViewStyle;
  editButton: ViewStyle;
  deleteButton: ViewStyle;
  actionButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
