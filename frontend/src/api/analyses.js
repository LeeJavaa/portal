const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const getMapAnalyses = async (filters = {}) => {
  try {
    const response = await fetch(`http://localhost:8000/api/map_analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
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
