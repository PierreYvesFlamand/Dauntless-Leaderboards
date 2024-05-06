import mysql, { QueryResult, ResultSetHeader } from 'mysql2/promise';
import { migrate } from './migrate';
import config from '../../config';

export default {
    db: {} as mysql.Connection,

    async init() {
        try {
            this.db = await mysql.createConnection({
                host: config.DB_HOST,
                port: config.DB_PORT,
                user: config.DB_USER,
                password: config.DB_PASSWORD,
                database: config.DB_DATABASE,
                timezone: 'Z'
            });

            await migrate();
        } catch (error) {
            console.log(error);
            console.log('Retry database connection in 5 seconds');
            await new Promise(resolve => setTimeout(resolve, 1000 * 5));
            await this.init();
        }
    },

    async query(query: string, params: (string | number)[] = []) {
        try {
            return this.db.query(query, params);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    async insert(query: string, params: (string | number)[] = []) {
        try {
            return this.db.query<ResultSetHeader>(query, params);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    async select<T extends QueryResult>(query: string, params: (string | number)[] = []) {
        try {
            return this.db.query<T>(query, params);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }
};