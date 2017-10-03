# Bart Salmon

[![Build Status](https://travis-ci.org/benmvp/bart-salmon.svg?branch=master)](https://travis-ci.org/benmvp/bart-salmon)
[![Coverage Status](https://coveralls.io/repos/github/benmvp/bart-salmon/badge.svg?branch=master)](https://coveralls.io/github/benmvp/bart-salmon?branch=master)

An app aiming to maximize likelihood of getting a [Bart](http://www.bart.gov/) seat by suggesting backwards routes (like salmon). It's sort of like Waze for Bart.

## Technologies used

Bart Salmon is both a web and native app, aiming to provide a useful service as well as an opportunity to learn new technologies:

- **UI:** [React](https://facebook.github.io/react/) & [React Native](https://facebook.github.io/react-native/) sharing code (via [React Native for Web](https://github.com/necolas/react-native-web))
- **Styling:** Inline via CSS in JS
- **Data Flow:** [Lodash](https://lodash.com/) & [Redux](http://redux.js.org/) (w/ [Redux Thunk](https://github.com/gaearon/redux-thunk) & [Async Functions](https://github.com/tc39/ecmascript-asyncawait))
- **Routing:** [React Router](https://github.com/ReactTraining/react-router) & [React Native Router](https://github.com/aksonov/react-native-router-flux)
- **API:** [Bart API](http://api.bart.gov/docs/overview/index.aspx)
- **Build Tooling:** [Create React App](https://github.com/facebookincubator/create-react-app) & [Create React Native App](https://github.com/react-community/create-react-native-app)
- **Static Checking:** [Flow](https://flowtype.org/) & [ESLint](http://eslint.org/)
- **Testing:** [Jest](https://facebook.github.io/jest/) & [Enzyme](https://github.com/airbnb/enzyme)
- **Continuous Integration & Delivery:** [Travis CI](https://travis-ci.org/benmvp/bart-salmon) & [Coveralls](https://coveralls.io/github/benmvp/bart-salmon?branch=master)
- **Environments:** Chrome, Firefox, Edge & Safari 10+
