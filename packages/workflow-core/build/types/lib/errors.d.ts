export declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string, cause?: unknown);
}
