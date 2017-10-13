// @flow

/* eslint-disable import/unambiguous */
module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod')
    : require('./configureStore.dev')
