import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FaceIcon from '@material-ui/icons/Face';
import dateFormat from 'date-fns/format';

import Context from '../../context';

const PinContent = ({ classes }) => {
  const {
    state: {
      currentPin: {
        _id,
        createdAt,
        title,
        image,
        content,
        latitude,
        longitude,
        author,
        comments,
      },
    },
  } = useContext(Context);

  return (
    <div className={classes.root}>
      <Typography
        component='h2'
        variant='h4'
        color='primary'
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        className={classes.text}
        component='h3'
        variant='h6'
        color='inherit'
        gutterBottom
      >
        <FaceIcon className={classes.icon} /> {author.name}
      </Typography>
      <Typography
        className={classes.text}
        variant='subtitle2'
        color='inherit'
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />  {dateFormat(Number.parseInt(createdAt), 'MMM Do, YYYY')}
      </Typography>
      <Typography
        variant='subtitle1'
        color='inherit'
        gutterBottom
      >
        {content}
      </Typography>
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%'
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default withStyles(styles)(PinContent);
