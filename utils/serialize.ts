/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/serialize.ts
export function serializeDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeDates);
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeDates(obj[key]);
    }
    return newObj;
  }
  return obj;
}
