import gql from 'graphql-tag';

export const pinAddedSubscription = gql`
  subscription {
    pinAdded {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`;

export const pinDeletedSubscription = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;

export const pinUpdatedSubscription = gql`
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`;
