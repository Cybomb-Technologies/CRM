import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

// Custom plugins
import inlineEditPlugin from './plugins/visual-editor/vite-plugin-react-inline-editor.js';
import editModeDevPlugin from './plugins/visual-editor/vite-plugin-edit-mode.js';
import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';

const isDev = process.env.NODE_ENV !== 'production';

// -------------------- LOGGER FIX --------------------
const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}
	loggerError(msg, options);
};

// -------------------- INDEX.HTML SCRIPT INJECTION --------------------
const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		const tags = [
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: `window.onerror = (msg, src, line, col, err) => {
					window.parent.postMessage({
						type: 'horizons-runtime-error',
						message: msg,
						error: err ? err.stack : null
					}, '*');
				};`,
				injectTo: 'head',
			}
		];

		return { html, tags };
	}
};

// -------------------- FINAL CLEAN CONFIG --------------------
export default defineConfig({
	customLogger: logger,

	plugins: [
		...(isDev ? [
			inlineEditPlugin(),
			editModeDevPlugin(),
			iframeRouteRestorationPlugin(),
			selectionModePlugin()
		] : []),
		react(),
		addTransformIndexHtml
	],

	server: {
		cors: true,
		allowedHosts: true,
		historyApiFallback: true, // <-- IMPORTANT FIX
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		}
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
	},

	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			]
		}
	}
});
