import { getConnectionManager } from 'typeorm';

const dbHost = 'db.homelab.vitico.space';
const dbPort = '27017';
const dbName = 'movil';

export async function connect() {

    let manager = getConnectionManager();
    let con = manager.create({
        type: 'postgres',
        port: 5432,
        database: 'ingsoft',
        host: '192.168.1.104',
        username: 'postgres',
        password: 'changeme',
        entities: [
            __dirname + "/models/*.ts"
        ],
        synchronize: true
        // dropSchema: true
    });
    await con.connect();
}

export async function close() {
    // return mongoose.disconnect();
}

module.exports = { connect, close };