export const licensestatus = ["Valid", "Suspended", "Revoked", "Learner's Permit", "ID Card"];

export const offenseToFine = {
  FU: 250000,
  F1: 150000,
  F2: 75000,
  MA: 25000
};

export const offenseToBail = {
  FU: offenseToFine.FU * 0.25,
  F1: offenseToFine.FA * 0.25,
  F2: offenseToFine.FB * 0.25,
  MA: offenseToFine.MA * 0.25,
  MB: offenseToFine.MB * 0.25
};

export const offenseToTime = {
  FU: 15 * 60,
  F1: 10 * 60,
  F2: 5 * 60,
  MA: 1 * 60
};

export const cities = [
  "Chumash",
  "Davis",
  "Del Perro",
  "Del Perro Beach",
  "Downtown",
  "Downtown Vinewood",
  "East Vinewood",
  "El Burro Heights",
  "Fort Zancudo",
  "Grapeseed",
  "Harmony",
  "La Mesa",
  "La Puerta",
  "Little Seoul",
  "Los Santos",
  "Mirror Park",
  "Paleto Bay",
  "Port of Los Santos",
  "Rockford Hills",
  "Sandy Shores",
  "Blaine County",
  "Vespucci",
  "Vinewood",
  "Vinewood Hills"
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
  state: "San Andreas State Police",
  // sheriff: "Blaine Borough Police",
  police: "Los Santos Police",
  intel: "San Andreas Department of Investigations"
};

export const agencyRoleToDB = {
  highway: "Highway",
  state: "Highway",
  sheriff: "Sheriff",
  police: "Police",
  intel: "Investigations"
};

export const agencyAbbreviations = {
  police: "LSPD",
  sheriff: "BBPD",
  highway: "SASP",
  state: "SASP",
  intel: "SADI",
  fire: "SAFD"
};

export const agencySuperShort = {
  police: "PD",
  sheriff: "BB",
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
  ambulance: "M",
  engine: "E",
  brush: "B",
  rescue: "R",
  tower: "T"
};

export const fireunitradio = {
  ambulance: "Medic",
  engine: "Engine",
  brush: "Brush",
  rescue: "Rescue",
  tower: "Tower"
};

export const firefullname = {
  ambulance: "Medic",
  engine: "Engine",
  brush: "Brush",
  rescue: "Rescue Squad",
  tower: "Tower Ladder"
};

export const fireshortname = {
  ambulance: "Med",
  engine: "Eng",
  brush: "Brsh",
  rescue: "Resc",
  tower: "Twr"
};
