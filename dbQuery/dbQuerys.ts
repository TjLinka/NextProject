"use server";
import {
  query,
  queryOne,
  withDatabase,
  resolveBlobFields,
} from "@/lib/firebird";
import { buildParams, makeReq, makeReqSingle } from "@/utils/dbUtils";
import { getIdFromToken } from "@/utils/getIdFromToken";
import {
  CreateMessageReqSchema,
  DialogListSchema,
  DialogMessagesReqSchema,
  getCatalogSchema,
  getCreateDialogSchema,
  StructureReqSchema,
} from "./dbReuestSchemas";
import { createMessageSchema } from "./zodValidators";
import moment from "moment";

export const getDashboard = async () => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    query(db, "SELECT * FROM DASHBOARD(?)", [agentId]),
  );
  const data = res.map((r) => {
    return {
      [`params_${r.id}`]: {
        name: r.name,
        dte: r.dte,
        num: r.num,
        str: r.str,
      },
    };
  });
  // console.log({...data});

  return data;
};
export const getBalance = async () => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    query(db, "SELECT * FROM SP_GET_AGENT_ACCOUNTS(?)", [agentId]),
  );
  console.log(res);

  return res;
};
export const getProfileData = async <T>() => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    queryOne<T>(db, "SELECT * FROM SP_AGENTSGET(?)", [agentId]),
  );
  return res;
};

export const getCatalog = async (
  find_str: string | null = null,
  section_id: number | null = null,
  i_name = null,
  i_articul = null,
  catalog_id = null,
  isadmin = null,
  i_stock_id = null,
  i_creator_id = null,
  i_show_lk = null,
  i_frontend_id = null,
) => {
  const agent_id = await getIdFromToken();
  const res = await withDatabase((db) => {
    return query(
      db,
      "SELECT * FROM SP_GET_CATALOG_IN_SECTIONS(?,?,?,?,?,?,?,?,?,?,?)",
      buildParams(getCatalogSchema, {
        find_str,
        section_id,
        i_name,
        agent_id,
        i_articul,
        catalog_id,
        isadmin,
        i_stock_id,
        i_creator_id,
        i_show_lk,
        i_frontend_id,
      }),
    );
  });
  res.forEach((p) => {
    p.image_url = `${process.env.IMG_URL}/GoodsPics/${p.id}_0.jpg?salt=${Math.random(0, 999999)}`;
  });
  return res;
};

// ПОЛЬЗОВАТЕЛЬ

export const getPersonalAccountInfo = async (
  from: Date | null = null,
  to: Date | null = null,
) => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    query(db, "SELECT * FROM SP_AGENTPERSACCOUNTFILTERGET(?,?,?,?)", [
      agentId,
      from,
      to,
      0,
    ]),
  );
  return res;
};
export const getSponsorInfo = async <T>() => {
  const agentId = await getIdFromToken();
  const res1 = await withDatabase((db) =>
    queryOne<T>(db, "SELECT * FROM SP_AGENTSGET(?)", [agentId]),
  );
  if (res1) {
    const res2 = await withDatabase((db) =>
      queryOne<T>(db, "SELECT * FROM SP_AGENTSGET(?)", [res1.id_parent]),
    );

    return res2;
  }
};
export const getSocials = async () => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    query(db, "SELECT * FROM AGENT_SOCIAL_MEDIA(?)", [agentId]),
  );

  return res;
};

// ДИАЛОГА

export const getDialogs = async () => {
  const agent_id = await getIdFromToken();

  const params = buildParams(DialogListSchema, {
    i_status: null,
    i_create_dte_beg: null,
    i_create_dte_end: null,
    i_close_dte_beg: null,
    i_close_dte_end: null,
    i_sender_id: agent_id,
    i_reciever_id: null,
  });

  const res = await withDatabase((db) =>
    query(db, "SELECT * FROM GET_DIALOGS(?,?,?,?,?,?,?)", params),
  );

  return res;
};

export const getDialogMessages = async (i_dialog_id: number | null = null) => {
  const agentId = await getIdFromToken();
  const res = await withDatabase((db) =>
    query(
      db,
      `SELECT * FROM GET_DIALOG_MESSAGES(${Array(10).fill("?").join(",")})`,
      buildParams(DialogMessagesReqSchema, {
        agent_id: agentId,
        agent2_id: null,
        i_catalog_id: null,
        i_title: null,
        i_title_id: null,
        start_id: null,
        show_cnt: null,
        beg_dte: null,
        end_dte: null,
        i_dialog_id,
      }),
    ),
  );
  const resolved = await Promise.all(res.map(resolveBlobFields));
  return resolved;
};

export const createDialog = async (
  name: string | null = null,
  title: string | null = null,
  reciever_id: string | number | null = null,
) => {
  const agent_id = await getIdFromToken();
  const res = await withDatabase((db) => {
    return queryOne(
      db,
      "SELECT * FROM DIALOGS_UPD(?,?,?,?,?,?,?)",
      buildParams(getCreateDialogSchema, {
        id: null,
        name,
        title,
        sender_id: agent_id,
        reciever_id,
        status_id: null,
        create_dte: null,
      }),
    );
  });
  return res;
};

export const createMessage = async (
  text: string,
  dialog_id: number | string,
) => {
  const agent_id = await getIdFromToken();

  const parsed = createMessageSchema.safeParse({ text });

  if (!parsed.success) {
    throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
  }

  const res = await withDatabase((db) => {
    return queryOne(
      db,
      "SELECT * FROM SEND_MESSAGE(?,?,?,?,?,?,?)",
      buildParams(CreateMessageReqSchema, {
        reciever_id: 0,
        sender_id: agent_id,
        text: text,
        catalog_id: null,
        title: "",
        title_id: null,
        dialog_id: Number(dialog_id),
      }),
    );
  });
  return res;
};

// Заказы
export const getOrdersList = async (from: unknown, to: unknown) => {
  const agentId = await getIdFromToken();
  console.log(from, to);

  return await makeReq("SP_WEBSHOPGETBYAGENTFILTER", [agentId, from, to, null]);
};

export const getOrderInfo = async (doc_id: string | number) => {
  const agent_id = await getIdFromToken();
  const res1 = await makeReqSingle("GET_SALE_METADATA", [doc_id, agent_id]);
  const res2 = await makeReq("GET_SALE_DETAIL", [doc_id, agent_id]);
  const res3 = await makeReqSingle("GET_DELIVERY", [doc_id]);
  return {
    sale: res1,
    cart: res2,
    delivery: res3,
  };
};

// Маркетинг
// // Структура
export const getStructureData = async (
  root_agent?: unknown,
  i_root_agent?: unknown,
  // i_parent?: unknown,
  level_agent?: unknown,
  i_agent_id?: unknown,
) => {
  const agentId = await getIdFromToken();
  const res = await makeReq("GET_STRUCT_TABLE", [
    ...buildParams(StructureReqSchema, {
      agent_id: agentId,
      comdte: null,
      active_all: null,
      i_lo: null,
      i_amount: null,
      i_rank_beg: null,
      i_rank_end: null,
      offset: null,
      show_cnt: null,
      root_agent: root_agent ? String(root_agent) : null,
      i_email: null,
      i_lastname: null,
      i_firstname: null,
      i_phone: null,
      i_root_agent: root_agent ? String(i_root_agent) : null,
      i_parent: null,
      i_status: null,
      level_agent,
      i_agent_id: root_agent ? String(i_agent_id) : null,
      i_fio: null,
    }),
  ]);
  console.log(res);

  return res;
};

// Новости
export const getNewsList = async () => {
  const res = await makeReq("SP_NEWSGET", [null, 0, 0]);
  res.forEach((n) => {
    n.image_url = `${process.env.IMG_URL}/NewsPics/${n.id}.jpg?salt=${Math.random(0, 999999)}`;
  });
  return res;
};
export const getNews = async (id: number) => {
  return await makeReqSingle("SP_NEWSGET", [id, 0, 0]);
};

// Вывод средств

export const getWithdrawList = async (
  doc_id: string | null = null,
  from = null,
  to = null,
  status: string | number | null = null,
) => {
  console.log(doc_id);

  const agentId = await getIdFromToken();
  const res = await makeReq("ACCOUNT_WITHDRAW_GET", [
    agentId,
    doc_id,
    from,
    to,
    status,
    0,
  ]);
  console.log(res);
  return res;
};

// MISC
export const getSponsorForRegistration = async (hash: string) => {
  const res = await makeReqSingle("AGENTS_ID_HASH_GET ", [hash]);
  const { id, name } = await makeReqSingle("SP_AGENTSGET", [res.id]);
  return {
    sponsor_id: id,
    sponsor_name: name,
  };
};
