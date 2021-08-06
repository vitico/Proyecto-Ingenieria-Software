/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from 'path';
import ora from 'ora';

const moduleAlias = require('module-alias');
moduleAlias.addAlias('@hhapp/server', __dirname);
import {
    useSeeding,
    useRefreshDatabase,
    configureConnection,
    getConnectionOptions,
    runSeeder,
    createConnection,
    importSeed,
} from 'typeorm-seeding';
import 'reflect-metadata';
import { importFiles, loadFiles } from 'typeorm-seeding/dist/utils/file.util';

async function run() {
    console.log('Starting');
    const root = path.join(__dirname, '..');
    configureConnection({ root });
    await useRefreshDatabase({ root });

    const option = await getConnectionOptions();

    const spinner = ora('Loading ormconfig').start();
    // Find all factories and seed with help of the config
    spinner.start('Import Factories');
    const factoryFiles = loadFiles(option.factories);
    try {
        await importFiles(factoryFiles);
        spinner.succeed('Factories are imported');
    } catch (error) {
        panic(spinner, error, 'Could not import factories!');
    }
    // Show seeds in the console
    spinner.start('Importing Seeders');
    const seedFiles = loadFiles(option.seeds);
    let seedFileObjects: any[] = [];
    try {
        seedFileObjects = await Promise.all(
            seedFiles.map((seedFile) => importSeed(seedFile))
        );
        spinner.succeed('Seeders are imported');
    } catch (error) {
        panic(spinner, error, 'Could not import seeders!');
    }

    // Get database connection and pass it to the seeder
    spinner.start('Connecting to the database');
    try {
        await createConnection();
        spinner.succeed('Database connected');
    } catch (error) {
        panic(
            spinner,
            error,
            'Database connection failed! Check your typeORM config file.'
        );
    }

    // Run seeds
    for (const seedFileObject of seedFileObjects) {
        spinner.start(`Executing ${seedFileObject.name} Seeder`);
        try {
            await runSeeder(seedFileObject);
            spinner.succeed(`Seeder ${seedFileObject.name} executed`);
        } catch (error) {
            panic(spinner, error, `Could not run the seed ${seedFileObject.name}!`);
        }
    }
}
run();

function panic(spinner: ora.Ora, error: Error, message: string) {
    spinner.fail(message);
    console.error(error);
    process.exit(1);
}
