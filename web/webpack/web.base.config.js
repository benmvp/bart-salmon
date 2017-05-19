const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const APP_PATH = path.join(__dirname, '../../app')
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: path.join(APP_PATH, 'index.web.js'),
        shims: ['airbnb-js-shims/target/es2015', 'whatwg-fetch']
    },
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
                    'style',
                    'css',
                    'postcss',
                    'sass'
                ],
                include: APP_PATH
            },
            {
                test: /\.json$/,
                loaders: ['json'],
                include: APP_PATH
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                loader: 'url-loader',
                query: {
                    name: '[name].[hash:16].[ext]'
                }
            }
        ],
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV: JSON.stringify(NODE_ENV),
                PLATFORM_ENV: JSON.stringify('web'),
            },
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin('shims', 'shims.js')
    ],
}
