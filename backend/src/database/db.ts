import mysql, { QueryResult, ResultSetHeader } from 'mysql2/promise';
import { migrate } from './migrate';

let db!: mysql.Connection;

export default {
    db: {} as mysql.Connection,

    async init() {
        try {
            this.db = await mysql.createConnection({
                host: '127.0.0.1',
                port: 7002,
                user: 'root',
                password: 'password',
                database: 'dauntless-leaderboards',
                timezone: 'Z'
            });

            await migrate();
        } catch (error) {
            console.error(error);
            process.exit();
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