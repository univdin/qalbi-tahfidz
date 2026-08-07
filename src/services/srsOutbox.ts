import { openDB } from "idb";

export interface SrsOutboxEntry {
  id: number;
  op: "upsert_hifz_card";
  payload: Record<string, unknown>;
  createdAt: string;
}

const DB_NAME = "QalbiTahfidzProductionDB";
const DB_VERSION = 1;

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("surahs")) {
        db.createObjectStore("surahs");
      }
      if (!db.objectStoreNames.contains("audio_recordings")) {
        db.createObjectStore("audio_recordings");
      }
      if (!db.objectStoreNames.contains("srs_outbox")) {
        db.createObjectStore("srs_outbox", { autoIncrement: true });
      }
    },
  });
}

export async function enqueueSrsOutbox(
  payload: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  await db.add("srs_outbox", {
    op: "upsert_hifz_card",
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function getSrsOutboxEntries(): Promise<SrsOutboxEntry[]> {
  const db = await getDb();
  const entries = (await db.getAll("srs_outbox")) as SrsOutboxEntry[];
  return entries.sort((a, b) => a.id - b.id);
}

export async function removeSrsOutboxEntry(id: number): Promise<void> {
  const db = await getDb();
  await db.delete("srs_outbox", id);
}

export async function clearSrsOutbox(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("srs_outbox", "readwrite");
  await tx.store.clear();
  await tx.done;
}
