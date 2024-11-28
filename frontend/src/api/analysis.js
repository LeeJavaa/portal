const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const getMapAnalysis = async (id, filters = {}) => {
  try {
    const payload = {
      id: parseInt(id),
      team: filters.team || null,
      players: filters.players || null,
    };

    const response = await fetch(`${API_BASE_URL}/map_analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch map analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.map_analysis;
  } catch (error) {
    throw new Error(`Failed to fetch map analysis: ${error.message}`);
  }
};

export const getSeriesAnalysis = async (id, filters = {}) => {
  try {
    const payload = {
      id: parseInt(id),
      team: filters.team || null,
      players: filters.players || null,
    };

    const response = await fetch(`${API_BASE_URL}/series_analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch series analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.series_analysis;
  } catch (error) {
    throw new Error(`Failed to fetch series analysis: ${error.message}`);
  }
};

export const getCustomAnalysis = async (id, filters = {}) => {
  try {
    const payload = {
      id: parseInt(id),
      team: filters.team || null,
      players: filters.players || null,
    };

    const response = await fetch(`${API_BASE_URL}/custom_analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch custom analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.custom_analysis;
  } catch (error) {
    throw new Error(`Failed to fetch custom analysis: ${error.message}`);
  }
};

export const getScoreboardUrl = async (fileName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/view_scoreboard_url?file_name=${encodeURIComponent(
        fileName
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch scoreboard URL: ${response.status}`);
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    throw new Error(`Failed to fetch scoreboard URL: ${error.message}`);
  }
};

export const deleteMapAnalysis = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/map_analysis`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: parseInt(id) }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete map analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    throw new Error(`Failed to delete map analysis: ${error.message}`);
  }
};

export const deleteSeriesAnalysis = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/series_analysis`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: parseInt(id) }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete series analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    throw new Error(`Failed to delete series analysis: ${error.message}`);
  }
};

export const deleteCustomAnalysis = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/custom_analysis`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: parseInt(id) }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete custom analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    throw new Error(`Failed to delete custom analysis: ${error.message}`);
  }
};
