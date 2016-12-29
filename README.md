# Bart Salmon

[![Build Status](https://travis-ci.org/benmvp/bart-salmon.svg?branch=master)](https://travis-ci.org/benmvp/bart-salmon)

An app aiming to maximize likelihood of getting a [Bart](http://www.bart.gov/) seat by suggesting backwards routes (like salmon). It's sort of like Waze for Bart.

## Technologies used

Bart Salmon is both a web and native app, aiming to provide a useful service as well as an opportunity to learn new technologies:

- **UI:** [React](https://facebook.github.io/react/) & [React Native](https://facebook.github.io/react-native/) sharing code
- **Styling:** [React CSS Modules](https://github.com/gajus/babel-plugin-react-css-modules), [SASS](http://sass-lang.com/), [Autoprefixer](https://github.com/postcss/autoprefixer) & [Sass Lint](https://github.com/sasstools/sass-lint)
- **Data Flow:** [Redux](http://redux.js.org/) & [Lodash](https://lodash.com/)
- **Routing:** [React Router](https://github.com/ReactTraining/react-router) (React) & _TBD_ (React Native)
- **API:** [Bart API](http://api.bart.gov/docs/overview/index.aspx)
- **Bundling:** [Webpack](https://webpack.github.io/) (with hot module reloading) & [Babel](http://babeljs.io/)
- **Static Typing:** [Flow](https://flowtype.org/) & [ESLint](http://eslint.org/)
- **Testing:** [Jest](https://facebook.github.io/jest/) & [Enzyme](https://github.com/airbnb/enzyme)
