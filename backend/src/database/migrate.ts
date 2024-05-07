import config from '../../config';
import path from 'path';
// @ts-ignore
import DbMigrate from 'simple-mysql-migrate';

export async function migrate() {
    try {
        const migration = new DbMigrate({            
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE,
        });
        
        migration.setMigrationPath(path.resolve(__dirname, './migrations'));
        await migration.migrate();
    } catch (error) {
        console.error(error);
        throw new Error();
    }
}