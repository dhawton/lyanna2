import { gql } from "apollo-boost";

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

export const GET_BOLOS = gql`
  query($server_id: ID!) {
    BOLOs(server_id: $server_id) {
      id
      server_id
      person_info
      vehicle_info
      details
      status
      created_at
      updated_at
    }
  }
`;

export const GET_SERVER_CALLS_USERS = gql`
  query($id: ID!) {
    server(id: $id) {
      id
      channel_held
      signedons {
        id
        identifier
        session_identifier
        session_name
        status
        department {
          id
          role
          name
        }
      }
      calls {
        id
        callnumber
        type
        address
        city
        description
        assigned
        status
        created_at
      }
    }
  }
`;

export const TOGGLE_HOLD = gql`
  mutation($id: ID!) {
    ToggleHold(server_id: $id) {
      id
    }
  }
`;
