interface UniqueVisitorsInsight {
  count: number;
  fromCache: boolean;
  fetchedAt: number;
}

const UNIQUE_VISITORS_CACHE_KEY = 'splendor_debug_unique_visitors_30d';
const UNIQUE_VISITORS_CACHE_TTL_MS = 5 * 60 * 1000;

interface UniqueVisitorsCacheRecord {
  count: number;
  fetchedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readUniqueVisitorsCache(): UniqueVisitorsCacheRecord | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(UNIQUE_VISITORS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UniqueVisitorsCacheRecord;
    if (typeof parsed.count !== 'number' || typeof parsed.fetchedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeUniqueVisitorsCache(record: UniqueVisitorsCacheRecord): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(UNIQUE_VISITORS_CACHE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage write failures in private mode.
  }
}

export async function fetchUniqueVisitorsLast30Days(): Promise<UniqueVisitorsInsight> {
  const cache = readUniqueVisitorsCache();
  const now = Date.now();
  if (cache && now - cache.fetchedAt < UNIQUE_VISITORS_CACHE_TTL_MS) {
    return { ...cache, fromCache: true };
  }

  if (!import.meta.env.DEV) {
    throw new Error('Unique visitors insight is debug-only and available in development mode.');
  }

  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
  const projectId = import.meta.env.VITE_POSTHOG_PROJECT_ID;
  const personalApiKey = import.meta.env.VITE_POSTHOG_PERSONAL_API_KEY;

  if (!projectId || !personalApiKey) {
    throw new Error('Missing VITE_POSTHOG_PROJECT_ID or VITE_POSTHOG_PERSONAL_API_KEY.');
  }

  const response = await fetch(`${apiHost}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${personalApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query:
          'SELECT count(DISTINCT person_id) AS unique_users FROM events WHERE timestamp >= now() - INTERVAL 30 DAY',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`PostHog API error (${response.status})`);
  }

  const data = (await response.json()) as {
    columns?: string[];
    results?: Array<Record<string, unknown> | unknown[]>;
  };

  let countRaw: unknown;
  const firstRow = data.results?.[0];

  if (Array.isArray(firstRow)) {
    const uniqueUsersColumnIndex =
      data.columns?.findIndex((column) => column === 'unique_users') ?? 0;
    const safeIndex = uniqueUsersColumnIndex >= 0 ? uniqueUsersColumnIndex : 0;
    countRaw = firstRow[safeIndex];
  } else {
    countRaw = (firstRow as Record<string, unknown> | undefined)?.unique_users;
  }

  const count = typeof countRaw === 'number' ? countRaw : Number(countRaw ?? 0);
  const record: UniqueVisitorsCacheRecord = {
    count: Number.isFinite(count) ? count : 0,
    fetchedAt: now,
  };

  writeUniqueVisitorsCache(record);
  return { ...record, fromCache: false };
}

