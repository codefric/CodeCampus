import type { AsyncDataOptions } from 'nuxt/app';
import type { WatchSource } from 'vue';
import { HttpStatusCode } from '~/types/http';
import { HttpClient } from '~/utils/httpClient';

type MultiWatchSources = (WatchSource<unknown> | object)[];

interface UseHttpOptions<T> extends Omit<AsyncDataOptions<T>, 'watch'> {
    immediate?: boolean;
    watch?: MultiWatchSources;
    errorMessages?: Partial<Record<HttpStatusCode, string>>;
}

export function useHttp(baseURL: string) {
    const client = new HttpClient(baseURL);

    function useGet<TResponse>(endpoint: string, options?: CustomRequestOptions & UseHttpOptions<TResponse>) {
        const { immediate = true, watch, errorMessages, ...requestOptions } = options || {};

        return useAsyncData<TResponse>(`get-${endpoint}`, () => client.get<TResponse>(endpoint, { ...requestOptions, errorMessages }), {
            immediate,
            watch,
            default: () => null,
        });
    }

    function usePost<TResponse, TBody>(endpoint: string, defaultBody?: TBody, options?: CustomRequestOptions & UseHttpOptions<TResponse>) {
        const body = ref(defaultBody);
        const { immediate = false, watch, errorMessages, ...requestOptions } = options || {};

        async function execute(newBody?: TBody): Promise<TResponse> {
            if (newBody !== undefined) {
                body.value = newBody;
            }

            if (body.value === undefined) {
                throw new Error('Body is required for POST request');
            }

            return client.post<TResponse, TBody>(endpoint, body.value, { ...requestOptions, errorMessages });
        }

        const asyncData = useAsyncData<TResponse>(`post-${endpoint}`, () => execute(), {
            immediate,
            watch,
            default: () => null,
        });

        return {
            ...asyncData,
            execute,
            body,
        };
    }

    function usePut<TResponse, TBody>(endpoint: string, defaultBody?: TBody, options?: CustomRequestOptions & UseHttpOptions<TResponse>) {
        const body = ref(defaultBody);
        const { immediate = false, watch, errorMessages, ...requestOptions } = options || {};

        async function execute(newBody?: TBody): Promise<TResponse> {
            if (newBody !== undefined) {
                body.value = newBody;
            }

            if (body.value === undefined) {
                throw new Error('Body is required for PUT request');
            }

            return client.put<TResponse, TBody>(endpoint, body.value, { ...requestOptions, errorMessages });
        }

        const asyncData = useAsyncData<TResponse>(`put-${endpoint}`, () => execute(), {
            immediate,
            watch,
            default: () => null,
        });

        return {
            ...asyncData,
            execute,
            body,
        };
    }

    function useDelete<TResponse>(endpoint: string, options?: CustomRequestOptions & UseHttpOptions<TResponse>) {
        const { immediate = false, watch, errorMessages, ...requestOptions } = options || {};

        async function execute(): Promise<TResponse> {
            return client.delete<TResponse>(endpoint, { ...requestOptions, errorMessages });
        }

        const asyncData = useAsyncData<TResponse>(`delete-${endpoint}`, () => execute(), {
            immediate,
            watch,
            default: () => null,
        });

        return {
            ...asyncData,
            execute,
        };
    }

    function usePatch<TResponse, TBody>(endpoint: string, defaultBody?: TBody, options?: CustomRequestOptions & UseHttpOptions<TResponse>) {
        const body = ref(defaultBody);
        const { immediate = false, watch, errorMessages, ...requestOptions } = options || {};

        async function execute(newBody?: TBody): Promise<TResponse> {
            if (newBody !== undefined) {
                body.value = newBody;
            }

            if (body.value === undefined) {
                throw new Error('Body is required for PATCH request');
            }

            return client.patch<TResponse, TBody>(endpoint, body.value, { ...requestOptions, errorMessages });
        }

        const asyncData = useAsyncData<TResponse>(`patch-${endpoint}`, () => execute(), {
            immediate,
            watch,
            default: () => null,
        });

        return {
            ...asyncData,
            execute,
            body,
        };
    }

    return {
        useGet,
        usePost,
        usePut,
        useDelete,
        usePatch,
    };
}
