import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const uri = process.env.NODE_ENV === 'production' ? 'wss://fob2257-geopins.herokuapp.com/graphql'
  : 'ws://localhost:4000/graphql';

const wsLink = new WebSocketLink({
  uri,
  options: { reconnect: true },
});

const apolloClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

export default (props) => (
  <ApolloProvider client={apolloClient}>
    {props.children}
  </ApolloProvider>
);
