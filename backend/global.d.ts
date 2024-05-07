namespace NodeJS {
    interface ProcessEnv {
        EXPRESS_PORT: number;
        AUTHORIZATION_CODE: string;
        DB_HOST: string,
        DB_PORT: number,
        DB_USER: string,
        DB_PASSWORD: string,
        DB_DATABASE: string
    };
}