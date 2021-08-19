/**
 * @type { import("typeorm").ConnectionOptions}
 */

module.exports = {
    type: 'postgres',
    port: 5432,
    database: 'ingsoft',
    host: '192.168.1.104',
    username: 'postgres',
    password: 'changeme',
    entities: [__dirname + '/src/models/*.ts'],
    synchronize: true,
    dropSchema: false,
    seeds: [__dirname + '/src/seeds/**/*{.ts,.js}'],
    factories: [__dirname + '/src/factories/**/*{.ts,.js}'],
};
