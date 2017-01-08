const path = require('path')
const webpack = require('webpack')

const baseConfig = require('./web.base.config.js')

const PATH_TO_BABELRC_WEB = path.join(__dirname, './.babelrc.web.json')

module.exports = Object.assign(
    {},
    baseConfig,
    {
        devtool: 'source-map',
        module: Object.assign(
            {},
            baseConfig.module,
            {
                loaders: [
                    ...baseConfig.module.loaders,
                    {
                        test: /(\.web)?\.jsx?$/,
                        exclude: /node_modules/,
                        include: path.join(__dirname, '../../app'),
                        loader: `babel-loader?cacheDirectory=true&extends=${PATH_TO_BABELRC_WEB}`,
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
