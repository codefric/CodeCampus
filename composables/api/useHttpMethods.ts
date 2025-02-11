import { HttpClient } from '~/utils/httpClient';
import type { WatchSource } from 'vue';

type MultiWatchSources = (WatchSource<unknown> | object)[];

interface UseHttpOptions {
    immediate?: boolean;
    watch?: MultiWatchSources;
}

export function useHttp(baseURL: string) {
    const client = new HttpClient(baseURL);

    function useGet<TResponse>(endpoint: string, options?: CustomRequestOptions & UseHttpOptions) {
        const { immediate = true, watch, ...requestOptions } = options || {};

        return useAsyncData(`get-${endpoint}`, () => client.get<TResponse>(endpoint, requestOptions), {
            immediate,
            watch,
        });
    }

    function usePost<TResponse, TBody>(
        endpoint: string,
        defaultBody?: TBody,
        options?: CustomRequestOptions & UseHttpOptions
    ) {
        const body = ref(defaultBody);
        const { immediate = false, watch, ...requestOptions } = options || {};

        async function execute(newBody?: TBody) {
            if (newBody) {
                body.value = newBody;
            }
            return client.post<TResponse, TBody>(endpoint, body.value as TBody, requestOptions);
        }

        const asyncData = useAsyncData(`post-${endpoint}`, () => execute(), { immediate, watch });

        return {
            ...asyncData,
            execute,
            body,
        };
    }

    function usePut<TResponse, TBody>(
        endpoint: string,
        defaultBody?: TBody,
        options?: CustomRequestOptions & UseHttpOptions
    ) {
        const body = ref(defaultBody);
        const { immediate = false, watch, ...requestOptions } = options || {};

        async function execute(newBody?: TBody) {
            if (newBody) {
                body.value = newBody;
            }
            return client.put<TResponse, TBody>(endpoint, body.value as TBody, requestOptions);
        }

        const asyncData = useAsyncData(`put-${endpoint}`, () => execute(), { immediate, watch });

        return {
            ...asyncData,
            execute,
            body,
        };
    }

    function useDelete<TResponse>(endpoint: string, options?: CustomRequestOptions & UseHttpOptions) {
        const { immediate = false, watch, ...requestOptions } = options || {};

        async function execute() {
            return client.delete<TResponse>(endpoint, requestOptions);
        }

        const asyncData = useAsyncData(`delete-${endpoint}`, () => execute(), { immediate, watch });

        return {
            ...asyncData,
            execute,
        };
    }

    function usePatch<TResponse, TBody>(
        endpoint: string,
        defaultBody?: TBody,
        options?: CustomRequestOptions & UseHttpOptions
    ) {
        const body = ref(defaultBody);
        const { immediate = false, watch, ...requestOptions } = options || {};

        async function execute(newBody?: TBody) {
            if (newBody) {
                body.value = newBody;
            }
            return client.patch<TResponse, TBody>(endpoint, body.value as TBody, requestOptions);
        }

        const asyncData = useAsyncData(`patch-${endpoint}`, () => execute(), { immediate, watch });

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
