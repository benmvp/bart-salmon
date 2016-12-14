const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: [
        path.join(__dirname, '../../app/index.web.js'),
    ],
    output: {
        path: path.join(__dirname, '../public/'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /(\.web)?\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: path.join(__dirname, '../../app')
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
                include: path.join(__dirname, '../../app')
            },
        ],
    },
    resolve: {
        alias: {
            // allows for single component that can work on Web & Native!
            'react-native': 'react-native-web'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV: JSON.stringify('production'),
                PLATFORM_ENV: JSON.stringify('web'),
            },
        }),
        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ],
}
