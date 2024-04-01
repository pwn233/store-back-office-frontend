export class CustomError extends Error {
  http_status_code: number;
  constructor(http_status_code: number, name: string, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);

    // Set custom properties
    this.name = name;
    this.http_status_code = http_status_code;
  }
  getDetails(): { http_status_code: number; name: string; message: string } {
    return {
      http_status_code: this.http_status_code,
      name: this.name,
      message: this.message,
    } as ErrorResponse;
  }
}

export interface ErrorResponse {
  http_status_code: number;
  name: string;
  message: string;
}
