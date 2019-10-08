import { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';

export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://fob2257-geopins.herokuapp.com/graphql'
  : 'http://localhost:4000/graphql';

export const useClient = () => {
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    const { id_token: token } = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse();

    setIdToken(token);
  }, []);

  return new GraphQLClient(baseUrl, {
    headers: { authorization: idToken },
  });
};
