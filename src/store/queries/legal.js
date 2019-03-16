import { gql } from "apollo-boost";

export const GET_CHARACTER_DOCUMENTS = gql`
  query($id: ID!) {
    documentsByCharacter(id: $id) {
      id
      type
      agency
      issuer
      casenumber
      licenseplate
      make
      model
      color
      address
      city
      violations
      fine
      warrant_active
      created_at
    }
  }
`;

export const GET_LAWS = gql`
  query {
    laws {
      id
      code
      title
      type
      fine
    }
  }
`;

export const ISSUE_DOCUMENT = gql`
  mutation(
    $character_id: Int!
    $type: String!
    $agency: String!
    $plate: String
    $make: String
    $model: String
    $color: String
    $address: String
    $city: String
    $issuer: String
    $violations: String
    $casenumber: String
    $fine: String
    $warrant_active: Boolean
  ) {
    IssueDocument(
      character_id: $character_id
      type: $type
      agency: $agency
      plate: $plate
      make: $make
      model: $model
      color: $color
      address: $address
      city: $city
      issuer: $issuer
      violations: $violations
      casenumber: $casenumber
      fine: $fine
      warrant_active: $warrant_active
    ) {
      id
    }
  }
`;
