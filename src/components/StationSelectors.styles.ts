import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2),
    },
    selector: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    selectorIcon: {
      marginRight: theme.spacing(1),
    },
  })
))
