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
      status
      plea
      outcome
      opinion
      declaration
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
export const EDIT_DOCUMENT = gql`
  mutation(
    $id: String!
    $type: String
    $agency: String
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
    $narrative: String
    $plea: String
    $restitution: String
    $restitution_amount: String
    $declaration: String
  ) {
    EditDocument(
      id: $id
      type: $type
      agency: $agency
      licenseplate: $plate
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
      narrative: $narrative
      restitution: $restitution
      plea: $plea
      restitution_amount: $restitution_amount
      declaration: $declaration
    ) {
      id
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
    $narrative: String
    $plea: String
    $restitution: String
    $restitution_amount: String
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
      narrative: $narrative
      restitution: $restitution
      plea: $plea
      restitution_amount: $restitution_amount
    ) {
      id
    }
  }
`;

export const DEACTIVATE_WARRANT = gql`
  mutation($id: String!) {
    DeactivateWarrant(id: $id) {
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
