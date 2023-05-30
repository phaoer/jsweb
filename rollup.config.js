import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
	input: "src/index.js",
	output: [
		{
			file: "dist/cjs/index.cjs",
			format: "cjs",
		},
		{
			file: "dist/esm/index.js",
			format: "esm",
		},
		{
			file: "dist/index.js",
			format: "umd",
			name: "jsweb",
		},
	],
	plugins: [
		resolve({ mainFields: ["jsnext", "preferBuiltins", "browser"] }),
		json(),
		babel({
			exclude: "node_modules/**",
			babelHelpers: "runtime",
		}),
		commonjs(),
		terser(),
	],
};
