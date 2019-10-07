import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Context from '../../context';
import { logInUser } from '../../context/actions';
import { meQuery } from '../../graphql/queries';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    const { id_token: idToken } = googleUser.getAuthResponse();

    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken },
    });

    const { me } = await client.request(meQuery);

    dispatch(logInUser(me));
  };

  return (
    <div>
      <GoogleLogin
        clientId='17846108568-h45esd9trs7ko8l0bi2m4cdqqgklqrs7.apps.googleusercontent.com'
        onSuccess={onSuccess}
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
