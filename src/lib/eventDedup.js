const seen = new Map();
const TTL = 30_000;

export function hasSeenEvent(eventId) {
  if (!eventId) return false;
  const now = Date.now();
  if (seen.has(eventId)) return true;
  seen.set(eventId, now);
  prune(now);
  return false;
}

function prune(now) {
  for (const [id, ts] of seen) {
    if (now - ts > TTL) seen.delete(id);
  }
}
