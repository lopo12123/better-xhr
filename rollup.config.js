import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default defineConfig({
    input: [
        'lib/core.ts',
        'lib/use_axios.ts',
        'lib/use_fetch.ts',
        'lib/use_xhr.ts',
        'lib/index.ts'
    ],
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            sourcemap: 'inline',
            plugins: [terser()]
        },
        // {
        //     dir: 'dist/cjs',
        //     format: 'cjs',
        //     sourcemap: 'inline',
        //     plugins: [terser()]
        // },
    ],
    plugins: [typescript({tsconfig: './tsconfig.esm.json'})]
})