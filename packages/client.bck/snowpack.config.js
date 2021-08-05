/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    plugins: [
        [
            '@snowpack/plugin-react-refresh',
            {
                babel: {
                    plugins: ['@babel/plugin-syntax-import-meta'],
                },
            },
        ],
        '@snowpack/plugin-dotenv',
        [
            '@snowpack/plugin-typescript',
            {
                /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
                tsc: 'yarn pnpify tsc',
            },
        ],
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {

    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
    },
    alias: {
        '@': './src',
    },
};
