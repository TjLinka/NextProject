export const getCatalogSchema = [
  "section_id",
  "agent_id",
  "i_name",
  "i_articul",
  "catalog_id",
  "isadmin",
  "i_stock_id",
  "i_creator_id",
  "i_show_lk",
  "i_frontend_id",
  "find_str",
];

export const getCreateDialogSchema = [
  "id",
  "name",
  "title",
  "sender_id",
  "reciever_id",
  "status_id",
  "create_dte",
];
export const DialogListSchema = [
  "i_status",
  "i_create_dte_beg",
  "i_create_dte_end",
  "i_close_dte_beg",
  "i_close_dte_end",
  "i_sender_id",
  "i_reciever_id",
  // "i_partner_id",
];

export const DialogMessagesReqSchema = [
  "agent_id",
  "agent2_id",
  "i_catalog_id",
  "i_title",
  "i_title_id",
  "start_id",
  "show_cnt",
  "beg_dte",
  "end_dte",
  "i_dialog_id",
];
export const CreateMessageReqSchema = [
  "reciever_id",
  "sender_id",
  "text",
  "catalog_id",
  "title",
  "title_id",
  "dialog_id",
];


export const StructureReqSchema = [
  "agent_id",
  "comdte",
  "active_all",
  "i_lo",
  "i_amount",
  "i_rank_beg",
  "i_rank_end",
  "offset",
  "show_cnt",
  "root_agent",
  "i_email",
  "i_lastname",
  "i_firstname",
  "i_phone",
  "i_root_agent",
  "i_parent",
  "i_status",
  "level_agent",
  "i_agent_id",
  "i_fio",
];