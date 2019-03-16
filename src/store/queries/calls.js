import { gql } from "apollo-boost";

export const CALL_CLEAR = gql`
  mutation($identifier: String!, $callnumber: String!) {
    CallClear(callnumber: $callnumber, identifier: $identifier) {
      callnumber
    }
  }
`;

export const CALL_CREATE = gql`
  mutation(
    $server_id: ID!
    $type: String!
    $address: String!
    $city: String!
    $description: String!
    $assigned: String!
    $status: String!
  ) {
    CallCreate(
      server_id: $server_id
      type: $type
      address: $address
      city: $city
      description: $description
      assigned: $assigned
      status: $status
    ) {
      callnumber
    }
  }
`;

export const CALL_EDIT = gql`
  mutation(
    $callnumber: String!
    $type: String
    $address: String
    $city: String
    $description: String
    $assigned: String
    $status: String
  ) {
    CallEdit(
      callnumber: $callnumber
      type: $type
      address: $address
      city: $city
      description: $description
      assigned: $assigned
      status: $status
    ) {
      callnumber
    }
  }
`;

export const CALL_ARCHIVE = gql`
  mutation($callnumber: String!) {
    CallArchive(callnumber: $callnumber) {
      id
    }
  }
`;
