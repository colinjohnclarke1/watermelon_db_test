import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WorkOrdersList, { WorkOrder } from "@/components/WorkOrdersList";
import database from "../db";

export default function WorkOrdersScreen() {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">(
    "view"
  );

  // Form state
  const [formData, setFormData] = useState({
    workOrderNumber: "",
    description: "",
    categoryName: "",
    subcategoryName: "",
    locationName: "",
    clientName: "",
    workOrderStatusName: "",
  });

  // --- Modal handlers ---

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setIsModalVisible(true);
  };

  const openEditModal = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setFormData({
      workOrderNumber: workOrder.workOrderNumber,
      description: workOrder.description,
      categoryName: workOrder.categoryName,
      subcategoryName: workOrder.subcategoryName,
      locationName: workOrder.locationName,
      clientName: workOrder.clientName,
      workOrderStatusName: workOrder.workOrderStatusName,
    });
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      workOrderNumber: "",
      description: "",
      categoryName: "",
      subcategoryName: "",
      locationName: "",
      clientName: "",
      workOrderStatusName: "",
    });
    setSelectedWorkOrder(null);
  };

  // --- CRUD operations ---

  const handleCreate = async () => {
    try {
      await database.write(async () => {
        const workOrderCollection = database.get("work_orders");
        console.log(
          "🚀 ~ handleCreate ~ workOrderCollection:",
          workOrderCollection
        );

        await workOrderCollection.create((wo: any) => {
          wo.workOrderNumber = formData.workOrderNumber;
          wo.description = formData.description;
          wo.categoryName = formData.categoryName;
          wo.subcategoryName = formData.subcategoryName;
          wo.locationName = formData.locationName;
          wo.clientName = formData.clientName;
          wo.workOrderStatusName = formData.workOrderStatusName;

          // Default required fields
          wo.clientWorkOrderID = Date.now();
          wo.categoryID = 0;
          wo.subcategoryID = 0;
          wo.clientID = 0;
          wo.assetDescription = "";
          wo.assetID = 0;
          wo.assetNumber = "";
          wo.problemTypeID = 0;
          wo.problemTypeName = "";
          wo.reportedDate = new Date().toISOString();
          wo.siteCode = "";
          wo.siteID = 0;
          wo.siteName = "";
          wo.updatedDate = new Date().toISOString();
          wo.workOrderStatusGroupID = 0;
          wo.workOrderStatusGroupName = "";
          wo.workOrderStatusID = 0;
          wo.workOrderTypeID = 0;
          wo.workOrderTypeName = "";
          wo.actionCount = 0;
          wo.visitCount = 0;
          wo.relatedWorkOrderCount = 0;
          wo.documentsCount = 0;
          wo.commentCount = 0;
        });
      });

      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error creating work order:", error);
    }
  };

  const handleUpdate = (workOrder: WorkOrder) => {
    openEditModal(workOrder);
  };

  const handleSaveUpdate = async () => {
    if (!selectedWorkOrder) return;

    console.log(formData);

    try {
      await database.write(async () => {
        await selectedWorkOrder.update((record: any) => {
          record.workOrderNumber = formData.workOrderNumber;
          record.description = formData.description;
          record.categoryName = formData.categoryName;
          record.subcategoryName = formData.subcategoryName;
          record.locationName = formData.locationName;
          record.clientName = formData.clientName;
          record.workOrderStatusName = formData.workOrderStatusName;
          record.updatedDate = new Date().toISOString();
        });

        await selectedWorkOrder.update((record: any) => {
          console.log("Record keys:", Object.keys(record));
          console.log("Record _raw:", record._raw);

          record.workOrderNumber = formData.workOrderNumber;
          // ... rest of updates
        });
      });

      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error updating work order:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await database.write(async () => {
        const workOrder = await database.get("work_orders").find(id);
        await workOrder.markAsDeleted(); // Or destroyPermanently()
      });
      console.log("Deleted work order:", id);
    } catch (error) {
      console.error("Error deleting work order:", error);
    }
  };

  // --- Form helper ---

  const renderFormField = (
    label: string,
    field: keyof typeof formData,
    multiline = false
  ) => (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        placeholder={`Enter ${label.toLowerCase()}`}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Work Orders</Text>
        <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Pass modal handlers to the list */}
      <WorkOrdersList handleUpdate={handleUpdate} handleDelete={handleDelete} />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === "view"
                  ? "Work Order Details"
                  : modalMode === "create"
                  ? "Create Work Order"
                  : "Edit Work Order"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {(modalMode === "create" || modalMode === "edit") && (
                <>
                  {renderFormField("Work Order Number", "workOrderNumber")}
                  {renderFormField("Description", "description", true)}
                  {renderFormField("Category", "categoryName")}
                  {renderFormField("Subcategory", "subcategoryName")}
                  {renderFormField("Location", "locationName")}
                  {renderFormField("Client", "clientName")}
                  {renderFormField("Status", "workOrderStatusName")}

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={
                        modalMode === "create" ? handleCreate : handleSaveUpdate
                      }
                    >
                      <Text style={styles.saveButtonText}>
                        {modalMode === "create" ? "Create" : "Save"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {modalMode === "view" && selectedWorkOrder && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Work Order Number:</Text>
                    <Text style={styles.detailValue}>
                      {selectedWorkOrder.workOrderNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>
                      {selectedWorkOrder.description}
                    </Text>
                  </View>
                  {/* Add other details here similarly */}
                  <TouchableOpacity
                    style={styles.modalEditButton}
                    onPress={() => openEditModal(selectedWorkOrder)}
                  >
                    <Text style={styles.modalEditButtonText}>
                      Edit Work Order
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Reuse your styles as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "95%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  closeButton: { fontSize: 24, color: "#666" },
  modalBody: { padding: 20 },
  formField: { marginBottom: 16 },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#f5f5f5" },
  cancelButtonText: { color: "#666", fontSize: 16, fontWeight: "600" },
  saveButton: { backgroundColor: "#007AFF" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalEditButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  modalEditButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  detailRow: { marginBottom: 16 },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  detailValue: { fontSize: 16, color: "#333" },
});
