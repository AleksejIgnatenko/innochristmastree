// apolloClient.js
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

// Create an HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:5062/graphql/',
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5062/graphql/',
  options: {
    reconnect: true,
  },
});

// Using the split function to send data to each link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket for subscriptions
  httpLink // Use HTTP for queries and mutations
);

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;