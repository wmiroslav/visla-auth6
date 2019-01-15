export interface IToken {
    access_token: string;
    token_type: string;
    refresh_token?: string;
    [key: string]: any;
}
