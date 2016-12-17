const path = require('path')
const webpack = require('webpack')

const baseConfig = require('./web.base.config.js')

module.exports = Object.assign(
    {},
    baseConfig,
    {
        devtool: 'cheap-module-eval-source-map',
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            ...baseConfig.entry
        ],
        module: Object.assign(
            {},
            baseConfig.module,
            {
                loaders: [
                    ...baseConfig.module.loaders,
                    {
                        test: /(\.web)?\.js$/,
                        exclude: /node_modules/,
                        loaders: ['react-hot', 'babel-loader'],
                        include: path.join(__dirname, '../../app')
                    }
                ],
            }
        ),
        devServer: {
            contentBase: path.join(__dirname, '../public'),
            stats: 'errors-only',
        },
        plugins: [
            ...baseConfig.plugins,
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.NoErrorsPlugin(),
        ]
    }
)
