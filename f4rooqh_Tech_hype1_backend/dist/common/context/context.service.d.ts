export declare const REQUEST_ID_KEY = "requestId";
export declare class ContextService {
    private readonly logger;
    private getStore;
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
    getRequestId(): string | undefined;
}
