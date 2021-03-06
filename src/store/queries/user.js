import { gql } from "apollo-boost";

export const CHECK_AUTH = gql`
  query {
    me {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      token
      expiresAt
    }
  }
`;

export const REFRESH_TOKEN = gql`
  query {
    RefreshToken {
      token
      expiresAt
    }
  }
`;

export const PING = gql`
  mutation($id: ID!) {
    Ping(id: $id) {
      id
    }
  }
`;

export const SIGNON = gql`
  mutation(
    $identifier: String
    $department: Int!
    $server: Int!
    $prefix: String
    $character_id: Int!
    $session_identifier: String
  ) {
    signon(
      identifier: $identifier
      department: $department
      server: $server
      prefix: $prefix
      character_id: $character_id
      session_identifier: $session_identifier
    ) {
      id
      identifier
      session_identifier
      session_name
      status
      steam
    }
  }
`;

export const CHANGE_STATUS = gql`
  mutation($identifier: String, $status: String) {
    ChangeStatus(identifier: $identifier, status: $status) {
      id
      status
    }
  }
`;

export const CHANGE_IDENTIFIER = gql`
  mutation($id: ID, $new_identifier: String) {
    ChangeIdentifier(id: $id, new_identifier: $new_identifier) {
      id
    }
  }
`;

export const CHANGE_SIGNON = gql`
  mutation($id: ID, $identifier: String!, $new_identifier: String, $dept: String!) {
    ChangeSignOn(id: $id, identifier: $identifier, new_identifier: $new_identifier, dept: $dept) {
      id
      session_identifier
    }
  }
`;

export const SIGNOFF = gql`
  mutation($id: Int) {
    SignOff(id: $id) {
      id
    }
  }
`;
