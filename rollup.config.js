import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: './src/index.ts',
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
