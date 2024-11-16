const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const getPresignedUploadUrl = async (fileName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/upload_scoreboard_url?file_name=${encodeURIComponent(
        fileName
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Can't authorise this upload. Please try again.");
  }
};

export const uploadScoreboardToS3 = async (presignedUrl, fields, file) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  try {
    const response = await fetch(presignedUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      switch (response.status) {
        case 413:
          throw new Error("413: File size exceeds limit");
        case 403:
          throw new Error("403: Upload authorization expired");
        default:
          throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (response.status === 204) {
      return true;
    } else {
      const responseData = await response.text();
      return responseData;
    }
  } catch (error) {
    throw error;
  }
};

export const initiateScoreboardProcessing = async (fileName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/new_map_analysis_step_one?file_name=${encodeURIComponent(
        fileName
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Processing failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to begin scoreboard processing. Please try again.");
  }
};

export const checkScoreboardProcessingStatus = async (taskId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/new_map_analysis_step_two?task_id=${encodeURIComponent(
        taskId
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to check processing status");
  }
};

export const createMapAnalysis = async (formData) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1 * 60 * 1000); // 1 minute timeout

    const response = await fetch(
      `${API_BASE_URL}/new_map_analysis_confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create analysis");
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out after 1 minute");
    }
    throw error;
  }
};
