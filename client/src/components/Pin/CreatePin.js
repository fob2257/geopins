import React, { useState, useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import axios from 'axios';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import { default as keysConfig } from '../../keys.config';

import Context from '../../context';
import {
  deleteDraft,
  addPin,
} from '../../context/actions';

import { createPinMutation } from '../../graphql/mutations';

import { useClient } from '../../useClient';

const CreatePin = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const mobileSize = useMediaQuery('(max-width: 650px)');

  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const client = useClient();

  const handleDeleteDraft = () => {
    setTitle('');
    setImage(null);
    setContent('');

    dispatch(deleteDraft());
  };

  const handleImageUpload = async () => {
    const cloudName = keysConfig.CloudName;
    const uploadPreset = keysConfig.UploadPreset;
    const data = new FormData();

    data.append('file', image);
    data.append('cloud_name', cloudName);
    data.append('upload_preset', uploadPreset);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);

    return res.data.url;
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();

      const { draft: { latitude, longitude } } = state;

      const { createPin: pin } = await client.request(createPinMutation, {
        title,
        image: url,
        content,
        latitude,
        longitude,
      });
      // console.log(pin);

      // dispatch(addPin(pin));
      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} />
        Pin location
      </Typography>
      <div>
        <TextField
          name='title'
          label='Title'
          placeholder='Insert pin title'
          onChange={e => setTitle(e.target.value)}
        />
        <input
          accept='image/*'
          id='image'
          type='file'
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor='image'>
          <Button
            style={{ color: image && 'green' }}
            component='span'
            size='small'
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          rows={mobileSize ? '3' : '6'}
          margin='normal'
          fullWidth
          variant='outlined'
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type='submit'
          className={classes.button}
          variant='contained'
          color='secondary'
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  },
  input: {
    display: 'none'
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
