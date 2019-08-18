//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/

const config = {
    target: 'node',
    entry: './extension.ts',
    output: {
        path: __dirname,
        filename: 'extension.js',
        libraryTarget: "commonjs2",
        //devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: 'source-map',
    externals: {
        vscode: "commonjs vscode"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                /*options: {
                    compilerOptions: {
                        "module": "es6" // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                    }
                }*/
            }]
        }]
    },
}

module.exports = config;