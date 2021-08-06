import { getConnectionManager, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
const dbHost = 'db.homelab.vitico.space';
const dbPort = '27017';
const dbName = 'movil';
useContainer(Container);
export async function connect() {
    const manager = getConnectionManager();
    const con = manager.create({
        type: 'postgres',
        port: 5432,
        database: 'ingsoft',
        host: '192.168.1.104',
        username: 'postgres',
        password: 'changeme',
        entities: [__dirname + '/models/*.ts'],
        synchronize: true,
        dropSchema: false,
    });
    await con.connect();
}

export async function close() {
    // return mongoose.disconnect();
}

module.exports = { connect, close };
