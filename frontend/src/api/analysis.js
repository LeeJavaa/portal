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
