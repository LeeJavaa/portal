const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Revalidate cache every 16 hours and 45 minutes
const CACHE_REVALIDATE_SECONDS = 60000;
// Revalidate cache for custom analyses 10 minutes
const CUSTOM_ANALYSES_CACHE_REVALIDATE_SECONDS = 600;

// Helper to generate cache key based on filters
const generateCacheKey = (filters) => {
  const sortedEntries = Object.entries(filters)
    .filter(([_, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(sortedEntries);
};

export const getMapAnalyses = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/map_analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
      next: {
        revalidate: CACHE_REVALIDATE_SECONDS,
        tags: [`analyses-${generateCacheKey(filters)}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch map analyses: ${response.status}`);
    }
    const data = await response.json();
    return data.map_analyses;
  } catch (error) {
    throw new Error("Failed to fetch map analyses");
  }
};

export const getSeriesAnalyses = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/series_analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
      next: {
        revalidate: CACHE_REVALIDATE_SECONDS,
        tags: [`analyses-${generateCacheKey(filters)}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch series analyses: ${response.status}`);
    }
    const data = await response.json();
    return data.series_analyses;
  } catch (error) {
    throw new Error("Failed to fetch series analyses");
  }
};

export const getCustomAnalyses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/custom_analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: CUSTOM_ANALYSES_CACHE_REVALIDATE_SECONDS,
        tags: ["custom-analyses"],
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch custom analyses: ${response.status}`);
    }
    const data = await response.json();
    return data.custom_analyses;
  } catch (error) {
    throw new Error("Failed to fetch custom analyses");
  }
};
