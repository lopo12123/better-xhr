import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default defineConfig({
    input: [
        'lib/core.ts',
        'lib/use_axios.ts',
        'lib/index.ts'
    ],
    output:
        {
            dir: 'dist',
            format: 'esm',
            sourcemap: 'inline',
            plugins: [terser()]
        },
    plugins: [typescript({tsconfig: './tsconfig.json'})],
})