import winston from 'winston';
import { WinstonGraylog } from '@pskzcompany/winston-graylog';

const cj = require('color-json');
const colorize = require('@buzuli/json');

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    // winston.format.splat(),
    // winston.format.timestamp(),
    // winston.format.errors(),
    // winston.format.colorize({ all: true }),
    // winston.format.simple()

    winston.format.splat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.prettyPrint(),
    winston.format.printf(({ timestamp, level, message, stack = '', ...rest }) => {
        /* console.log('rest keys', Object.keys(rest));
         let restJS = cj(
             rest,
             {
                 separator: 'yellow',
                 string: 'yellow',
                 number: 'blue',
                 boolean: 'magenta',
                 null: 'red',
                 key: 'green',
             },
             undefined,
             4
         );
         restJS = restJS == '\u001b[33m{}\u001b[0m' ? '' : restJS;*/
        let restJS = colorize(rest, {
            indent: 4,
        });

        restJS = restJS == '{}' ? '' : restJS;

        if (stack) stack = `\n${stack}\n`;
        return `[ ${timestamp} ][ ${level} ]: ${message} ${stack} ${restJS}`;
    })

    // winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // winston.format.colorize({ all: true }),
    // winston.format.prettyPrint(),
    // // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
export const logger = winston.createLogger({
    exitOnError: false,
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: format,
            level: 'debug',
        }),
        new WinstonGraylog({
            level: 'debug',
            graylog: 'gelf://192.168.1.104:12201',
            defaultMeta: {
                environment: 'production',
                release: '1.0.1',
            },
        }),
    ],
});
