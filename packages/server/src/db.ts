import { getConnectionManager, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import config from '../ormconfig';

useContainer(Container);

export async function connect() {
    const manager = getConnectionManager();
    const con = manager.create(config);
    await con.connect();
}

export async function close() {
    // return mongoose.disconnect();
}

module.exports = { connect, close };
