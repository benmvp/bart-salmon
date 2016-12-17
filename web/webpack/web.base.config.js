const path = require('path')
const webpack = require('webpack')

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
                    'sass?sourceMap'
                ],
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
        })
    ],
}
