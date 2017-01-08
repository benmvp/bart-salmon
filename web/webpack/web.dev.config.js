const path = require('path')
const webpack = require('webpack')

const baseConfig = require('./web.base.config.js')

const PATH_TO_BABELRC_WEB = path.join(__dirname, './.babelrc.web.json')

module.exports = Object.assign(
    {},
    baseConfig,
    {
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
                        include: path.join(__dirname, '../../app'),
                        loaders: [
                            'react-hot',
                            `babel-loader?cacheDirectory=true&extends=${PATH_TO_BABELRC_WEB}`
                        ]
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
