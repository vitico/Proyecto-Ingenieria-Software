/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	workspaceRoot: '..',
	'extends': '@snowpack/app-scripts-react',
	plugins: [
		['@canarise/snowpack-eslint-plugin', {
			globs: ['src/**/*.tsx', 'src/**/*.ts'], // You should provide this
			options: { /* any eslint options here */ },
		}],
		[
			'@snowpack/plugin-webpack',
			{
				/**
				 * Plugin Options
				 *
				 * https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack#readme
				 *
				 * */
			},
		],
	],
	alias: {
		'@': './src',
	},
	optimize: {
		/* Example: Bundle your final build: */
		// "bundle": true,
	},
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
		open:"none"
	},
	buildOptions: {
		/* ... */
	},
};
