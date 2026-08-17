export declare const config: {
    readonly node_env: string | undefined;
    readonly port: string | undefined;
    readonly database_url: string;
    readonly jwt: {
        readonly jwt_secret: string;
        readonly expires_in: string;
        readonly refresh_token_secret: string;
        readonly refresh_token_expires_in: string;
        readonly reset_pass_secret: string;
        readonly reset_pass_token_expires_in: string;
    };
};
