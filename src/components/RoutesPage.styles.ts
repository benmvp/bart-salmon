import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    root: {
      flex: 1,

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stationSelectors: {
      width: '100%',
      padding: theme.spacing(2),
    },
    stationSelector: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    stationSelectorIcon: {
      marginRight: theme.spacing(1),
    },
    stationSelectorFormControl: {
      flex: 1,
    },
    arrivals: {
      width: '100%',
    },
    salmonRoutes: {
      flex: 1,
      width: '100%',
    },
  })
))
