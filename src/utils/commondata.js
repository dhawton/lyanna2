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
  intel: "SADI",
  fire: "SAFD"
};

export const agencySuperShort = {
  police: "PD",
  sheriff: "BC",
  highway: "SP",
  intel: "DI",
  fire: "FD"
};

export const unitPrefixes = "abcdefghijklmnopqrstuvwyz".toUpperCase().split("");

export const fire = [
  {
    station: 1,
    name: "Rockford Hills",
    closed: false,
    companies: {
      ambulance: [11, 12],
      engine: [11, 12],
      brush: null,
      rescue: [11],
      tower: [11]
    }
  },
  {
    station: 2,
    name: "Davis",
    closed: false,
    companies: {
      ambulance: [21],
      engine: [21],
      brush: null,
      rescue: [21],
      tower: [21]
    }
  },
  {
    station: 3,
    name: "El Burro Heights",
    closed: false,
    companies: {
      ambulance: [31],
      engine: [31],
      brush: [31],
      rescue: [31],
      tower: [31]
    }
  },
  {
    station: 4,
    name: "Airport",
    closed: false,
    companies: {
      ambulance: [41],
      engine: [41],
      brush: [41],
      rescue: [41],
      tower: null
    }
  },
  {
    station: 5,
    name: "Zancudo",
    closed: false,
    companies: {
      ambulance: [51],
      engine: [51],
      brush: [51],
      rescue: [51],
      tower: null
    }
  },
  {
    station: 6,
    name: "Sandy Shores",
    closed: true,
    companies: {
      ambulance: null,
      engine: null,
      brush: null,
      rescue: null,
      tower: null
    }
  },
  {
    station: 7,
    name: "Paleto Bay",
    closed: false,
    companies: {
      ambulance: [71],
      engine: [71],
      brush: [71],
      rescue: [71],
      tower: null
    }
  }
];

export const fireunitid = {
  ambulance: "A",
  engine: "E",
  brush: "B",
  rescue: "R",
  tower: "T"
};

export const fireunitradio = {
  ambulance: "Ambulance",
  engine: "Engine",
  brush: "Brush",
  rescue: "Rescue",
  tower: "Tower"
};

export const firefullname = {
  ambulance: "Ambulance",
  engine: "Engine",
  brush: "Brush",
  rescue: "Rescue Squad",
  tower: "Tower Ladder"
};

export const fireshortname = {
  ambulance: "Amb",
  engine: "Eng",
  brush: "Brsh",
  rescue: "Resc",
  tower: "Twr"
};
