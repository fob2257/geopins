const { gql } = require('apollo-server');

module.exports = gql`
    type User {
      _id: ID
      name: String
      givenName: String
      familyName: String
      email: String
      picture: String
      createdAt: String
    }

    type Pin {
      _id: ID
      title: String
      content: String
      image: String
      latitude: Float
      longitude: Float
      author: User
      comments: [Comment]
      createdAt: String
    }

    type Comment {
      text: String
      author: User
      createdAt: String
    }

    input CreatePinInput {
      title: String
      image: String
      content: String
      latitude: Float
      longitude: Float
    }

    type Query {
      me: User
      getPins: [Pin!]!
    }

    type Mutation {
      createPin(input: CreatePinInput!): Pin
      deletePin(pinId: ID!): Pin
      createComment(pinId: ID!, text: String!): Pin
    }

    type Subscription {
      pinAdded: Pin
      pinDeleted: Pin
      pinUpdated: Pin
    }
`;
