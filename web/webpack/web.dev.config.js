const path = require('path')
const webpack = require('webpack')

const baseConfig = require('./web.base.config.js')

const PATH_TO_BABELRC_WEB = path.join(__dirname, './.babelrc.web.json')

module.exports = Object.assign({}, baseConfig, {
    entry: Object.assign({}, baseConfig.entry, {
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            baseConfig.entry.app
        ]
    }),
    module: Object.assign({}, baseConfig.module, {
        loaders: [
            ...baseConfig.module.loaders,
            {
                test: /(\.web)?\.jsx?$/,
                exclude: /node_modules/,
                include: path.join(__dirname, '../../src'),
                loaders: [
                    'react-hot',
                    `babel-loader?extends=${PATH_TO_BABELRC_WEB}`
                ]
            }
        ]
    }),
    devServer: {
        contentBase: path.join(__dirname, '../public'),
        stats: 'errors-only',
        historyApiFallback: true
    },
    plugins: [...baseConfig.plugins, new webpack.NoErrorsPlugin()]
})
