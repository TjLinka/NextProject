import { query, queryOne, withDatabase } from "@/lib/firebird";
import { getIdFromToken } from "./getIdFromToken";

export function buildParams<T extends string>(
  schema: readonly T[],
  values: Partial<Record<T, unknown>>,
): unknown[] {
  return schema.map((key) => values[key] ?? null);
}


export const makeReqSingle = async (proccedur: string, params: unknown[]) => {
  const res = await withDatabase((db) => {
    return queryOne(
      db,
      `SELECT * FROM ${proccedur}(${Array(params.length).fill("?").join(",")})`,
      [...params],
    );
  })
  
  return res
}
export const makeReq = async (proccedur: string, params: unknown[]) => {
  const res = await withDatabase((db) => {
    return query(
      db,
      `SELECT * FROM ${proccedur}(${Array(params.length).fill("?").join(",")})`,
      [...params],
    );
  })
  
  return res
}
