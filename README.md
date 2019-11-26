# Bart Salmon

![Build Status](https://github.com/benmvp/bart-salmon/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/benmvp/bart-salmon/badge.svg?branch=master)](https://coveralls.io/github/benmvp/bart-salmon?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/benmvp/bart-salmon.svg)](https://greenkeeper.io/)

An app aiming to maximize likelihood of getting a [Bart](http://www.bart.gov/) seat by suggesting backwards routes (like salmon). It's sort of like Waze for Bart.

> The rationale is that generally the earlier someone gets on a train, the less likely it'll be full. So If someone get son a train 2 stops before their normal station, it won't yet have the passengers from the station before nor those trying to get on at their actual stop. With less passengers aboard, there is a greater likelihood for a seat.

## Running the app locally

After [cloning the repo](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository), install the app's dependency using [npm](https://docs.npmjs.com/cli/install):

```sh
npm install
```

Then, start the app:

```sh
npm start
```

## Technologies used

Bart Salmon is a mobile web, aiming to provide a useful service as well as an opportunity to learn new technologies:

- **UI:** [React](https://facebook.github.io/react/)
- **Styling:** [Material UI](https://material-ui.com/)
- **Data Flow:** [Lodash](https://lodash.com/) & [Redux](http://redux.js.org/) (w/ [Redux Thunk](https://github.com/gaearon/redux-thunk) & [Async Functions](https://github.com/tc39/ecmascript-asyncawait))
- **API:** [Bart API](http://api.bart.gov/docs/overview/index.aspx)
- **Build Tooling:** [Create React App](https://github.com/facebookincubator/create-react-app)
- **Static Checking:** [TypeScript](https://www.typescriptlang.org/index.html) & [ESLint](http://eslint.org/)
- **Testing:** [Jest](https://facebook.github.io/jest/) & [Enzyme](https://github.com/airbnb/enzyme)
- **Continuous Integration & Delivery:** [Travis CI](https://travis-ci.org/benmvp/bart-salmon), [Netlify](https://www.netlify.com/) & [Coveralls](https://coveralls.io/github/benmvp/bart-salmon?branch=master)
- **Environments:** Chrome, Firefox, Edge & Safari 10+
