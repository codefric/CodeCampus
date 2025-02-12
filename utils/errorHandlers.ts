import { HttpStatusCode } from '~/types/http';

export const defaultErrorMessages: Record<HttpStatusCode, string> = {
    // 2xx Success
    [HttpStatusCode.OK]: 'The request was successful.',
    [HttpStatusCode.CREATED]: 'The resource was created successfully.',
    [HttpStatusCode.ACCEPTED]: 'The request has been accepted for processing.',
    [HttpStatusCode.NO_CONTENT]: 'The request was successful but there is no content to return.',

    // 3xx Redirection
    [HttpStatusCode.MOVED_PERMANENTLY]: 'The resource has been permanently moved.',
    [HttpStatusCode.FOUND]: 'The resource has been temporarily moved.',
    [HttpStatusCode.NOT_MODIFIED]: 'The resource has not been modified.',
    [HttpStatusCode.TEMPORARY_REDIRECT]: 'The request should be repeated with another URI.',
    [HttpStatusCode.PERMANENT_REDIRECT]: 'The request and all future requests should be repeated using another URI.',

    // 4xx Client Errors
    [HttpStatusCode.BAD_REQUEST]: 'Invalid request. Please check your input.',
    [HttpStatusCode.UNAUTHORIZED]: 'Authentication required. Please log in.',
    [HttpStatusCode.FORBIDDEN]: 'You do not have permission to access this resource.',
    [HttpStatusCode.NOT_FOUND]: 'The requested resource was not found.',
    [HttpStatusCode.METHOD_NOT_ALLOWED]: 'This operation is not allowed.',
    [HttpStatusCode.CONFLICT]: 'A conflict occurred with the current state.',
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: 'Unable to process the request.',
    [HttpStatusCode.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',

    // 5xx Server Errors
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'An internal server error occurred.',
    [HttpStatusCode.NOT_IMPLEMENTED]: 'The server does not support this functionality.',
    [HttpStatusCode.BAD_GATEWAY]: 'The server received an invalid response.',
    [HttpStatusCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.',
    [HttpStatusCode.GATEWAY_TIMEOUT]: 'The server request timed out.',
};
