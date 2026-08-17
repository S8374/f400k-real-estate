import { AsyncLocalStorage } from 'async_hooks';
export type RequestContextStore = Map<string, any>;
export declare const requestContext: AsyncLocalStorage<RequestContextStore>;
