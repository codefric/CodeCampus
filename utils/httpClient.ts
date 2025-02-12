import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { FetchError } from 'ofetch';
import { HttpError, HttpStatusCode } from '../types/http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface CustomRequestOptions {
    query?: Record<string, string>;
    headers?: HeadersInit;
    errorMessages?: Partial<Record<HttpStatusCode, string>>;
}

export class HttpClient {
    private baseURL: string;
    private defaultOptions: NitroFetchOptions<NitroFetchRequest>;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    private createUrl(endpoint: string, query?: Record<string, string>): string {
        const url = new URL(`${this.baseURL}${endpoint}`);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }
        return url.toString();
    }

    private handleError(error: FetchError, customErrorMessages?: Partial<Record<HttpStatusCode, string>>): never {
        const statusCode = error.response?.status as HttpStatusCode;
        const responseData = error.response?._data;

        // Use custom error message if provided, fall back to default, or use the response error message
        const errorMessage =
            customErrorMessages?.[statusCode] ?? defaultErrorMessages[statusCode] ?? responseData?.message ?? error.message;

        // Handle specific status codes
        switch (statusCode) {
            case HttpStatusCode.UNAUTHORIZED: {
                const router = useRouter();
                router.push('/login');
                break;
            }
            case HttpStatusCode.TOO_MANY_REQUESTS:
                // Implement rate limiting handling if needed
                break;
            case HttpStatusCode.SERVICE_UNAVAILABLE:
                // Implement service unavailability handling if needed
                break;
        }

        throw new HttpError(statusCode, errorMessage, responseData);
    }

    private async request<TResponse>(
        method: HttpMethod,
        endpoint: string,
        options?: CustomRequestOptions & { body?: unknown }
    ): Promise<TResponse> {
        const url = this.createUrl(endpoint, options?.query);
        const token = useCookie('token').value;

        const fetchOptions: NitroFetchOptions<NitroFetchRequest> = {
            ...this.defaultOptions,
            method,
            headers: {
                ...this.defaultOptions.headers,
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options?.headers,
            },
            body: options?.body ? JSON.stringify(options.body) : undefined,
        };

        try {
            return await $fetch<TResponse>(url, fetchOptions);
        } catch (error) {
            if (error instanceof FetchError) {
                this.handleError(error, options?.errorMessages);
            }
            throw error;
        }
    }

    public async get<TResponse>(endpoint: string, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('GET', endpoint, options);
    }

    public async post<TResponse, TBody>(endpoint: string, body: TBody, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('POST', endpoint, { ...options, body });
    }

    public async put<TResponse, TBody>(endpoint: string, body: TBody, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('PUT', endpoint, { ...options, body });
    }

    public async delete<TResponse>(endpoint: string, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('DELETE', endpoint, options);
    }

    public async patch<TResponse, TBody>(endpoint: string, body: TBody, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('PATCH', endpoint, { ...options, body });
    }
}
