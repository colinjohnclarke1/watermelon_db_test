// model/Post.js
import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class WorkOrder extends Model {
  static table = "work_orders";

  @field("client_work_order_id") clientWorkOrderID!: number;
  @field("work_order_number") workOrderNumber!: string;
  @field("description") description!: string;
  @field("category_id") categoryID!: number;
  @field("category_name") categoryName!: string;
  @field("subcategory_id") subcategoryID!: number;
  @field("subcategory_name") subcategoryName!: string;
  @field("location_name") locationName!: string;
  @field("client_id") clientID!: number;
  @field("client_name") clientName!: string;
  @field("asset_description") assetDescription!: string;
  @field("asset_id") assetID!: number;
  @field("asset_number") assetNumber!: string;
  @field("problem_type_id") problemTypeID!: number;
  @field("problem_type_name") problemTypeName!: string;
  @field("reported_date") reportedDate!: string;
  @field("site_code") siteCode!: string;
  @field("site_id") siteID!: number;
  @field("site_name") siteName!: string;
  @field("updated_date") updatedDate!: string;
  @field("work_order_status_group_id") workOrderStatusGroupID!: number;
  @field("work_order_status_group_name") workOrderStatusGroupName!: string;
  @field("work_order_status_id") workOrderStatusID!: number;
  @field("work_order_status_name") workOrderStatusName!: string;
  @field("work_order_type_id") workOrderTypeID!: number;
  @field("work_order_type_name") workOrderTypeName!: string;
  @field("action_count") actionCount!: number;
  @field("visit_count") visitCount!: number;
  @field("related_work_order_count") relatedWorkOrderCount!: number;
  @field("documents_count") documentsCount!: number;
  @field("comment_count") commentCount!: number;
}
