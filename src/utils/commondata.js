export const licensestatus = ["Valid", "Suspended", "Revoked", "Learner's Permit", "ID Card"];

export const offenseToFine = {
  FU: 250000,
  F1: 150000,
  F2: 75000,
  MA: 25000,
  MB: 2000
};

export const offenseToBail = {
  FU: offenseToFine.FU * 0.25,
  FA: offenseToFine.FA * 0.25,
  FB: offenseToFine.FB * 0.25,
  FC: offenseToFine.FC * 0.25,
  MA: offenseToFine.MA * 0.25,
  MB: offenseToFine.MB * 0.25
};

export const offenseToTime = {
  FU: 15 * 60,
  FA: 9 * 60,
  FB: 5 * 60,
  MA: 2 * 60,
  MB: 0.5 * 60
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
  Police: "SAPD",
  Court: "Court",
  Intelligence: "SADI"
};

export const agencyLongNames = {
  highway: "San Andreas State Troopers",
  sheriff: "Blaine Borough Police",
  police: "San Andreas Police",
  intel: "San Andreas Department of Investigations"
};

export const agencyRoleToDB = {
  highway: "State",
  state: "State",
  sheriff: "Sheriff",
  police: "Police",
  intel: "Investigations"
};

export const agencyAbbreviations = {
  police: "SAPD",
  sheriff: "BBPD",
  highway: "SAST",
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
