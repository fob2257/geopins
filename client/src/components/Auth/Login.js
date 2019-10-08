import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


import { default as keysConfig } from '../../keys.config';

import Context from '../../context';
import { logInUser, isLoggedIn } from '../../context/actions';

import { meQuery } from '../../graphql/queries';

import { baseUrl } from '../../useClient';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const { id_token: idToken } = googleUser.getAuthResponse();

      const client = new GraphQLClient(baseUrl, {
        headers: { authorization: idToken },
      });

      const { me } = await client.request(meQuery);

      dispatch(logInUser(me));
      dispatch(isLoggedIn(googleUser.isSignedIn()));
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = error => {
    console.error(error);
    dispatch(logInUser(false));
  };

  return (
    <div className={classes.root}>
      <Typography
        component='h1'
        variant='h3'
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 144)' }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId={keysConfig.OAuthClientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        theme='dark'
        buttonText='Login with Google'
        isSignedIn
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default withStyles(styles)(Login);
