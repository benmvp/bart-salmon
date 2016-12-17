const path = require('path')
const webpack = require('webpack')

const baseConfig = require('./web.base.config.js')

module.exports = Object.assign(
    {},
    baseConfig,
    {
        module: Object.assign(
            {},
            baseConfig.module,
            {
                loaders: [
                    ...baseConfig.module.loaders,
                    {
                        test: /(\.web)?\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: path.join(__dirname, '../../app')
                    }
                ],
            }
        ),
        plugins: [
            ...baseConfig.plugins,
            // optimizations
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
            }),
        ]
    }
)
