import { v4 as uuidv4 } from "uuid";

export const generateUniqueFileName = (originalFileName) => {
  const fileExtension = originalFileName.split(".").pop();
  const uniqueId = uuidv4();
  return `${uniqueId}.${fileExtension}`;
};
