import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => (
  createStyles({
    heading: {
      marginLeft: theme.spacing(1),
    },
    trainBubble: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
))
