// utils/httpClient.ts
import type { FetchError } from 'ofetch';
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface CustomRequestOptions {
    query?: Record<string, string>;
    headers?: HeadersInit;
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
            if ((error as FetchError).response?.status === 401) {
                const router = useRouter();
                router.push('/login');
            }
            throw error;
        }
    }

    public async get<TResponse>(endpoint: string, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('GET', endpoint, options);
    }

    public async post<TResponse, TBody>(
        endpoint: string,
        body: TBody,
        options?: CustomRequestOptions
    ): Promise<TResponse> {
        return this.request<TResponse>('POST', endpoint, { ...options, body });
    }

    public async put<TResponse, TBody>(
        endpoint: string,
        body: TBody,
        options?: CustomRequestOptions
    ): Promise<TResponse> {
        return this.request<TResponse>('PUT', endpoint, { ...options, body });
    }

    public async delete<TResponse>(endpoint: string, options?: CustomRequestOptions): Promise<TResponse> {
        return this.request<TResponse>('DELETE', endpoint, options);
    }

    public async patch<TResponse, TBody>(
        endpoint: string,
        body: TBody,
        options?: CustomRequestOptions
    ): Promise<TResponse> {
        return this.request<TResponse>('PATCH', endpoint, { ...options, body });
    }
}
