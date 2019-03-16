import { gql } from "apollo-boost";

export const GET_CASES = gql`
  query {
    cases {
      id
      title
      status
      created_by
      created_at
      notes {
        id
        case_id
        body
        created_by
        created_at
      }
      suspects {
        id
        case_id
        character_id
        license
        character {
          id
          idnumber
          firstname
          lastname
          address
          city
          gender
          race
          dob
          haircolor
          height_feet
          height_inches
          weight
          photo
          licensestatus
          documents {
            id
            type
            agency
            violations
            warrant_active
          }
        }
      }
    }
  }
`;

export const GET_CASE = gql`
  query($id: ID!) {
    case(id: $id) {
      id
      title
      status
      created_by
      created_at
      notes {
        id
        case_id
        body
        created_by
        created_at
      }
      suspects {
        id
        case_id
        character_id
        license
        character {
          id
          idnumber
          firstname
          lastname
          address
          city
          gender
          race
          dob
          haircolor
          height_feet
          height_inches
          weight
          photo
          licensestatus
          documents {
            id
            type
            agency
            violations
            warrant_active
          }
        }
      }
    }
  }
`;

export const EDIT_CASE = gql`
  mutation($id: ID!, $title: String, $status: String) {
    ICase(id: $id, title: $title, status: $status) {
      id
    }
  }
`;

export const CASE_ADD_ENTRY = gql`
  mutation($case_id: Int!, $body: String, $created_by: String) {
    ICaseNote(case_id: $case_id, body: $body, created_by: $created_by) {
      id
    }
  }
`;

export const EDIT_CASE_SUSPECTS = gql`
  mutation($id: Int, $case_id: Int, $character_id: Int, $idnumber: String, $status: String) {
    ICaseSuspect(
      id: $id
      character_id: $character_id
      case_id: $case_id
      idnumber: $idnumber
      status: $status
    ) {
      id
    }
  }
`;
