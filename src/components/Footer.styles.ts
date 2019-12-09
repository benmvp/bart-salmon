import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    message: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
    }
  })
))
