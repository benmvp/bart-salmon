const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const appPath = path.join(__dirname, '../../app')

module.exports = {
    entry: [
        path.join(__dirname, '../../app/index.web.js'),
    ],
    output: {
        path: path.join(__dirname, '../public'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: [
                    'style?sourceMap',
                    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'postcss',
                    'sass?sourceMap'
                ],
                include: appPath
            },
            {
                test: /\.json$/,
                loaders: ['json'],
                include: appPath
            }
        ],
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV: JSON.stringify('production'),
                PLATFORM_ENV: JSON.stringify('web'),
            },
        })
    ],
}
