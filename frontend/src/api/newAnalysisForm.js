const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const getPresignedUploadUrl = async (fileName, fileType) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/generate_upload_scoreboard_url?file_name=${encodeURIComponent(
        fileName
      )}&file_type=${encodeURIComponent(fileType)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting the presigned upload URL:", error);
    throw error;
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // S3 returns 204 No Content on successful upload
    if (response.status === 204) {
      return true;
    } else {
      const responseData = await response.text();
      console.log("Unexpected response:", responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

export const initiateScoreboardProcessing = async (fileName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process_scoreboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_name: fileName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error initiating scoreboard processing:", error);
    throw error;
  }
};
