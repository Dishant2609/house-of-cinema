import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite"
import path from "path";
import runableAnalyticsPlugin from "./vite/plugins/runable-analytics-plugin";
import honoDevPlugin from "./vite/plugins/hono-dev-plugin";

const root = path.resolve(__dirname, "../..");

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, root, '');
	const localEnv = loadEnv(mode, __dirname, '');
	Object.assign(process.env, env, localEnv);

	return {
		define: {
			'import.meta.env.VITE_TMDB_API_KEY': JSON.stringify(localEnv.VITE_TMDB_API_KEY || env.VITE_TMDB_API_KEY || 'd95d937e9a07bd2f0cfa6816b9f2d4fd'),
		},
		plugins: [honoDevPlugin(), react(), runableAnalyticsPlugin(), tailwind()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src/web"),
			},
		},
		server: {
			port: 4200,
			allowedHosts: true,
			hmr: { overlay: false, }
		}
	};
});
