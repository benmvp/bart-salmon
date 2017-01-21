# Bart Salmon TODO list

## Alpha

- [x] Add Google Analytics to web app
- [x] Fix JavaScript tests for "salmon algorithm"
- [x] Add more ETDs mock data for other time periods (morning rush, evening rush, etc)
- [x] Implement Redux layer
- [x] Test Redux layer
- [ ] Build responsive React web app (w/ [`react-native-web`](https://github.com/necolas/react-native-web/))
- [x] Add [`redux-persist`](https://github.com/rt2zz/redux-persist) to keep origin & destination selections across app loads
- [ ] Decrease "riskiness" factor to 0
- [ ] Send GA track page when switching routes
- [x] Clean train info so that `minutes` is always a number
- [ ] Build React Native app
- [ ] Add JavaScript error logging ([Sentry](https://sentry.io/) or [Bugsnag](https://bugsnag.com/))

## Beta

- [ ] Add configuration page: number of salmon routes, backwards wait time riskiness, max salmon time
- [ ] More info page (include links to native app)
- [ ] Tap for more train info: number of cars, train color
- [ ] Switch to `lodash/fp`
- [ ] Pick station based on location
- [ ] Add button to swap stations/direction
- [ ] Add ability to pick a salmon route and get updates while on it
- [ ] Add acceptance testing framework ([NightwatchJS](http://nightwatchjs.org/), [Intern](https://theintern.github.io/), [WebDriverIO](http://webdriver.io/), [CodeceptJS](http://codecept.io/), etc.)


## v1

- [ ] Help/support page
- [ ] Receive notifications when there are Bart delays
- [ ] Display error message toasts in UI
- [ ] Add monetization (most likely ads)
- [ ] Transform to progressive web app (i.e. use Service Workers)
