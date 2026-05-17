import { openDB } from 'idb';

const DB_NAME = 'collab-todo-offline';
const STORE = 'pending';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export async function queueMutation(mutation) {
  const db = await getDb();
  await db.put(STORE, { ...mutation, id: mutation.id || crypto.randomUUID() });
}

export async function getPendingMutations() {
  const db = await getDb();
  return db.getAll(STORE);
}

export async function clearMutation(id) {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function clearAllPending() {
  const db = await getDb();
  await db.clear(STORE);
}
