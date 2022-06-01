import typescript from '@rollup/plugin-typescript';

const external = ['react', 'use-sync-external-store/with-selector'];

export default [
    {
        input: './src/index.ts',
        external,
        output: [
            {
                dir: 'dist/es',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({
                declaration: true,
                outDir: 'dist/es'
            })
        ]
    },
    {
        input: './src/index.ts',
        external,
        output: [
            {
                dir: 'dist/cjs',
                format: 'cjs',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({
                declaration: false
            })
        ]
    }
];
