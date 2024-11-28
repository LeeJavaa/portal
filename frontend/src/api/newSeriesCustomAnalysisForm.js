const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const createSeriesAnalysis = async (mapIds, title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create_series_analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ map_ids: mapIds, title }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create series analysis");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createCustomAnalysisFromMaps = async (mapIds, title) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/create_custom_analysis_from_maps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ map_ids: mapIds, title }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create custom analysis");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createCustomAnalysisFromSeries = async (seriesIds, title) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/create_custom_analysis_from_series`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ series_ids: seriesIds, title }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create custom analysis");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
