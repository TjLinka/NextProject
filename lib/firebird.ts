/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import Firebird from "node-firebird";

const options: Firebird.Options = {
  host: "127.0.0.1",
  port: 3050,
  database: "C:/DBS/PRODUCTION_COPY.FDB",
  user: "SYSDBA",
  password: "masterkey",
};

export function readBlob(blobFn: Function): Promise<string> {
  return new Promise((resolve, reject) => {
    blobFn((err: Error, name: string, e: NodeJS.EventEmitter) => {
      if (err) return resolve("");

      const chunks: Buffer[] = [];
      e.on("data", (chunk: Buffer) => chunks.push(chunk));
      e.on("end", () => {
        const buf = Buffer.concat(chunks);
        // Попробуй WIN1251
        resolve(buf.toString("latin1"));
      });
      e.on("error", reject);
    });
  });
}

// Обрабатывает все BLOB поля в объекте
export async function resolveBlobFields(
  row: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const entries = await Promise.all(
    Object.entries(row).map(async ([key, value]) => {
      if (typeof value === "function") {
        return [key, await readBlob(value)];
      }
      return [key, value];
    }),
  );
  return Object.fromEntries(entries);
}

// Универсальная функция — выполняет колбэк с db, сама открывает/закрывает соединение
export function withDatabase<T>(
  fn: (db: Firebird.Database) => Promise<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, async (err, db) => {
      if (err) return reject(err);
      try {
        const result = await fn(db);
        resolve(result);
      } catch (e) {
        reject(e);
      } finally {
        db.detach();
      }
    });
  });
}

// lib/firebird.ts — обнови функцию query

export function query<T = Record<string, unknown>>(
  db: Firebird.Database,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);

      // Конвертируем ключи в нижний регистр
      const normalized = (result as Record<string, unknown>[]).map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]),
        ),
      );

      resolve(normalized as T[]);
    });
  });
}
// Возвращает один объект или null
export function queryOne<T = Record<string, unknown>>(
  db: Firebird.Database,
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);

      const rows = result as Record<string, unknown>[];

      if (!rows || rows.length === 0) return resolve(null);

      const normalized = Object.fromEntries(
        Object.entries(rows[0]).map(([key, value]) => [key.toLowerCase(), value])
      );

      resolve(normalized as T);
    });
  });
}
// Выполнить INSERT / UPDATE / DELETE (без возврата строк)
export function execute(
  db: Firebird.Database,
  sql: string,
  params: unknown[] = [],
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.execute(sql, params, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
