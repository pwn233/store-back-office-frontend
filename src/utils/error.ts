import { CustomError } from "@/models/common/error/error";

export const isCustomError = (data: any): data is CustomError => {
  return (
    typeof data === "object" &&
    "name" in data &&
    "message" in data &&
    "http_status_code" in data
  );
};
