interface UniqueVisitorsInsight {
  count: number;
  fromCache: boolean;
  fetchedAt: number;
}

export interface UsersByRegionInsight {
  rows: Array<{
    country: string;
    region: string;
    uniqueUsers: number;
  }>;
  fromCache: boolean;
  fetchedAt: number;
}

const UNIQUE_VISITORS_CACHE_KEY = 'splendor_debug_unique_visitors_30d';
const USERS_BY_REGION_CACHE_KEY = 'splendor_debug_users_by_region_30d';
const UNIQUE_VISITORS_CACHE_TTL_MS = 5 * 60 * 1000;

interface UniqueVisitorsCacheRecord {
  count: number;
  fetchedAt: number;
}

interface UsersByRegionCacheRecord {
  rows: UsersByRegionInsight['rows'];
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

function readUsersByRegionCache(): UsersByRegionCacheRecord | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(USERS_BY_REGION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UsersByRegionCacheRecord;
    if (!Array.isArray(parsed.rows) || typeof parsed.fetchedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeUsersByRegionCache(record: UsersByRegionCacheRecord): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(USERS_BY_REGION_CACHE_KEY, JSON.stringify(record));
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

export async function fetchUsersByCountryRegionLast30Days(): Promise<UsersByRegionInsight> {
  const cache = readUsersByRegionCache();
  const now = Date.now();
  if (cache && now - cache.fetchedAt < UNIQUE_VISITORS_CACHE_TTL_MS) {
    return { ...cache, fromCache: true };
  }

  if (!import.meta.env.DEV) {
    throw new Error('Users-by-region insight is debug-only and available in development mode.');
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
        query: `SELECT
  coalesce(nullIf(properties['$geoip_country_name'], ''), 'Unknown') AS country,
  coalesce(nullIf(properties['$geoip_subdivision_1_name'], ''), 'Unknown') AS region,
  count(DISTINCT person_id) AS unique_users
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
GROUP BY country, region
ORDER BY unique_users DESC
LIMIT 20`,
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

  const col = (name: string, fallback: number): number => {
    const idx = data.columns?.findIndex((c) => c === name) ?? -1;
    return idx >= 0 ? idx : fallback;
  };

  const countryIdx = col('country', 0);
  const regionIdx = col('region', 1);
  const usersIdx = col('unique_users', 2);

  const rows = (data.results ?? []).map((row) => {
    if (Array.isArray(row)) {
      const country = String(row[countryIdx] ?? 'Unknown');
      const region = String(row[regionIdx] ?? 'Unknown');
      const uniqueUsersRaw = row[usersIdx];
      const uniqueUsers =
        typeof uniqueUsersRaw === 'number' ? uniqueUsersRaw : Number(uniqueUsersRaw ?? 0);
      return {
        country,
        region,
        uniqueUsers: Number.isFinite(uniqueUsers) ? uniqueUsers : 0,
      };
    }

    const record = row as Record<string, unknown>;
    const uniqueUsersRaw = record.unique_users;
    const uniqueUsers =
      typeof uniqueUsersRaw === 'number' ? uniqueUsersRaw : Number(uniqueUsersRaw ?? 0);
    return {
      country: String(record.country ?? 'Unknown'),
      region: String(record.region ?? 'Unknown'),
      uniqueUsers: Number.isFinite(uniqueUsers) ? uniqueUsers : 0,
    };
  });

  const record: UsersByRegionCacheRecord = { rows, fetchedAt: now };
  writeUsersByRegionCache(record);
  return { ...record, fromCache: false };
}

