import { gql } from 'apollo-boost';

export const GET_SERVERS = gql`
  query {
    servers {
      id
      name
      active
    }
  }
`;

export const GET_DEPARTMENTS_AND_ROLES = gql`
  query {
    departments {
      id
      name
      role
    }
    me {
      id
      name
      community_identifier
      roles {
        id
        role
      }
    }
  }
`;
