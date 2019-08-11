# Bart Salmon

[![Build Status](https://travis-ci.org/benmvp/bart-salmon.svg?branch=master)](https://travis-ci.org/benmvp/bart-salmon)
[![Coverage Status](https://coveralls.io/repos/github/benmvp/bart-salmon/badge.svg?branch=master)](https://coveralls.io/github/benmvp/bart-salmon?branch=master)

An app aiming to maximize likelihood of getting a [Bart](http://www.bart.gov/) seat by suggesting backwards routes (like salmon). It's sort of like Waze for Bart.

## Technologies used

Bart Salmon is both a web and native app, aiming to provide a useful service as well as an opportunity to learn new technologies:

- **UI:** [React](https://facebook.github.io/react/)
- **Styling:** Inline CSS
- **Data Flow:** [Lodash](https://lodash.com/) & [Redux](http://redux.js.org/) (w/ [Redux Thunk](https://github.com/gaearon/redux-thunk) & [Async Functions](https://github.com/tc39/ecmascript-asyncawait))
- **API:** [Bart API](http://api.bart.gov/docs/overview/index.aspx)
- **Build Tooling:** [Create React App](https://github.com/facebookincubator/create-react-app)
- **Static Checking:** [TypeScript](https://www.typescriptlang.org/index.html) & [ESLint](http://eslint.org/)
- **Testing:** [Jest](https://facebook.github.io/jest/) & [Enzyme](https://github.com/airbnb/enzyme)
- **Continuous Integration & Delivery:** [Travis CI](https://travis-ci.org/benmvp/bart-salmon), [Netlify](https://www.netlify.com/) & [Coveralls](https://coveralls.io/github/benmvp/bart-salmon?branch=master)
- **Environments:** Chrome, Firefox, Edge & Safari 10+
