import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      width: '100%',
    },
    selectors: {
      flex: 1,
    },
    selector: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    selectorIcon: {
      marginRight: theme.spacing(1),
    },
    swapButton: {
      marginLeft: theme.spacing(1),
    }
  })
))
