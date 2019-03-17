export const licensestatus = ["Valid", "Suspended", "Revoked", "Learner's Permit", "ID Card"];

export const cities = [
  "Chumash",
  "Grapeseed",
  "Harmony",
  "Los Santos",
  "Mirror Park",
  "Paleto Bay",
  "Port of Los Santos",
  "Rockford Hills",
  "Sandy Shores",
  "Unincorporated Blaine County",
  "Vespucci",
  "Vinewood",
  "Vinewood Hills",
  "Zancudo"
];

export const citiesUpper = () => {
  const c = [];
  cities.forEach(v => {
    c.push(v.toUpper);
  });
  return c;
};

export const agencies = {
  Highway: "SASP",
  State: "SASP",
  Sheriff: "BCSO",
  Police: "LSPD",
  Court: "Court",
  Intelligence: "SADI"
};

export const agencyLongNames = {
  highway: "San Andreas State Police",
  sheriff: "Blaine County Sheriff's Office",
  police: "Los Santos Police Department",
  intel: "San Andreas Department of Intelligence"
};

export const agencyRoleToDB = {
  highway: "State",
  state: "State",
  sheriff: "Sheriff",
  police: "Police",
  intel: "Intelligence"
};

export const agencyAbbreviations = {
  police: "LSPD",
  sheriff: "BCSO",
  highway: "SASP",
  intel: "SADI"
};

export const agencySuperShort = {
  police: "PD",
  sheriff: "BC",
  highway: "SP",
  intel: "DI"
};

export const unitPrefixes = "abcdefghijklmnopqrstuvwyz".toUpperCase().split("");
