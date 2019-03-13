import { gql } from 'apollo-boost';

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
