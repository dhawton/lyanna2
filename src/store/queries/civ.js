import { gql } from "apollo-boost";

export const CIV_CHARACTER_LIST = gql`
  query {
    me {
      id
      characters {
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
      }
    }
  }
`;

export const CREATE_CHARACTER = gql`
  mutation(
    $firstname: String!
    $lastname: String!
    $address: String!
    $city: String!
    $gender: String!
    $race: String!
    $dob: Date!
    $haircolor: String!
    $height_feet: Int!
    $height_inches: Int!
    $weight: Int!
    $photo: String!
    $licensestatus: String!
  ) {
    CharacterCreate(
      firstname: $firstname
      lastname: $lastname
      address: $address
      city: $city
      gender: $gender
      race: $race
      dob: $dob
      haircolor: $haircolor
      height_feet: $height_feet
      height_inches: $height_inches
      weight: $weight
      photo: $photo
      licensestatus: $licensestatus
    ) {
      id
    }
  }
`;

export const EDIT_CHARACTER = gql`
  mutation(
    $id: ID!
    $firstname: String
    $lastname: String
    $address: String
    $city: String
    $gender: String
    $race: String
    $dob: Date
    $haircolor: String
    $height_feet: Int
    $height_inches: Int
    $weight: Int
    $photo: String
    $licensestatus: String
  ) {
    editCharacter(
      id: $id
      firstname: $firstname
      lastname: $lastname
      address: $address
      city: $city
      gender: $gender
      race: $race
      dob: $dob
      haircolor: $haircolor
      height_feet: $height_feet
      height_inches: $height_inches
      weight: $weight
      photo: $photo
      licensestatus: $licensestatus
    ) {
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
    }
  }
`;

export const DELETE_CHARACTER = gql`
  mutation($id: ID!) {
    deleteCharacter(id: $id) {
      id
    }
  }
`;

export const GET_CHARACTER = gql`
  query($id: ID!) {
    Character(id: $id) {
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
    }
  }
`;

export const SEARCH_CHARACTERS = gql`
  query($idnumber: String, $firstname: String, $lastname: String, $dob: Date) {
    CharacterSearch(idnumber: $idnumber, firstname: $firstname, lastname: $lastname, dob: $dob) {
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
        issuer
        casenumber
        licenseplate
        make
        model
        color
        address
        city
        warrant_active
        violations
        created_at
      }
    }
  }
`;

export const GET_CHARACTER_VEHICLES = gql`
  query($id: ID!) {
    Character(id: $id) {
      id
      vehicles {
        id
        licenseplate
        color
        make
        model
        insurance
        stolen
      }
    }
  }
`;

export const EDIT_VEHICLE = gql`
  mutation(
    $oldlicenseplate: String!
    $licenseplate: String!
    $character_id: Int!
    $make: String!
    $model: String!
    $color: String!
    $insurance: Boolean!
    $stolen: Boolean!
  ) {
    editVehicle(
      oldlicenseplate: $oldlicenseplate
      licenseplate: $licenseplate
      character_id: $character_id
      make: $make
      model: $model
      color: $color
      insurance: $insurance
      stolen: $stolen
    ) {
      id
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation($licenseplate: String!) {
    deleteVehicle(licenseplate: $licenseplate) {
      id
    }
  }
`;

export const SEARCH_VEHICLE = gql`
  query($licenseplate: String, $make: String, $model: String, $color: String) {
    VehicleSearch(licenseplate: $licenseplate, make: $make, model: $model, color: $color) {
      id
      licenseplate
      make
      model
      color
      insurance
      stolen
      character {
        id
        idnumber
        firstname
        lastname
        address
        city
      }
    }
  }
`;
