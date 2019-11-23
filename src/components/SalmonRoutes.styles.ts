import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    additionalTime: {
      paddingLeft: theme.spacing(1),
    },
    arrow: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    stationArrow: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
))
