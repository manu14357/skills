import { MAX_EDITS_PER_HOUR, MAX_SUBMISSIONS_PER_HOUR } from "./constants";

type Mode = "submit" | "edit";

type LocalBucket = {
  count: number;
  expiresAt: number;
};

const localStore = new Map<string, LocalBucket>();

function getLimitForMode(mode: Mode): number {
  return mode === "submit" ? MAX_SUBMISSIONS_PER_HOUR : MAX_EDITS_PER_HOUR;
}

export async function enforceRateLimit(ip: string, mode: Mode): Promise<{ allowed: boolean; remaining: number }> {
  const key = `${mode}:${ip}`;
  const now = Date.now();
  const limit = getLimitForMode(mode);
  const bucket = localStore.get(key);

  if (!bucket || now > bucket.expiresAt) {
    localStore.set(key, {
      count: 1,
      expiresAt: now + 60 * 60 * 1000
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  localStore.set(key, bucket);

  return { allowed: true, remaining: limit - bucket.count };
}
