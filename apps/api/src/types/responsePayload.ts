export type ErrorType = string | Error | unknown;

export interface SuccessResponse<T = unknown> {
    success: true;
    message: string;
    data: T;
}

export interface ErrorResponse {
    success: false;
    message: string;
    error: ErrorType;
}

// Export ResponsePayload type
export type ResponsePayload<T = unknown> = SuccessResponse<T> | ErrorResponse;
