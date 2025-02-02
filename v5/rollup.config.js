import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appsPath = path.resolve(__dirname, 'apps/based');
const directories = fs.readdirSync(appsPath).filter(file => {
    return fs.statSync(path.join(appsPath, file)).isDirectory();
});

export default directories.map(dir => {
    const inputPath = path.resolve(appsPath, dir, `${dir}.js`);
    return {
        input: inputPath,
        output: {
            file: path.resolve(__dirname, 'dist', dir, `${dir}.js`),
            format: 'esm',
            name: dir
        },
        plugins: [
            nodeResolve(),
            commonjs()
        ]
    };
});
