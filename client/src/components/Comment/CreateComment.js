import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';

import Context from '../../context';
import { createComment } from '../../context/actions';
import { createCommentMutation } from '../../graphql/mutations';
import { useClient } from '../../useClient';

const CreateComment = ({ classes }) => {
  const { state, dispatch } = useContext(Context);

  const client = useClient();
  const [comment, setComment] = useState('');

  const handleSubmitComment = async () => {
    const { currentPin: { _id: pinId } } = state;

    const { createComment: payload } = await client.request(createCommentMutation, { pinId, text: comment });

    dispatch(createComment(payload));
    setComment('');
  };

  return (
    <React.Fragment>
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          onClick={() => setComment('')}
          disabled={!comment.trim()}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          multiline={true}
          placeholder='Add Comment'
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton
          className={classes.sendButton}
          onClick={() => handleSubmitComment()}
          disabled={!comment.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </React.Fragment>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: 'red'
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
