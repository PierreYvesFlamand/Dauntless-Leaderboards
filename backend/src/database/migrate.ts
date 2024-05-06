// @ts-ignore
import DbMigrate from 'simple-mysql-migrate';
import config from '../../config';

export async function migrate() {
    try {
        const migration = new DbMigrate({            
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE,
        });

        migration.setMigrationPath('./src/database/migrations');
        await migration.migrate();
    } catch (error) {
        console.error(error);
        throw new Error();
    }
}