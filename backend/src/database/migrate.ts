// @ts-ignore
import DbMigrate from 'simple-mysql-migrate';

export async function migrate() {
    try {
        const migration = new DbMigrate({
            host: '127.0.0.1',
            port: 7002,
            username: 'root',
            password: 'password',
            database: 'dauntless-leaderboards'
        });

        migration.setMigrationPath('./src/database/migrations');
        await migration.migrate();
    } catch (error) {
        console.error(error);
        throw new Error();
    }
}