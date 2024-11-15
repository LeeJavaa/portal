export const GAME_MODES = {
  HARDPOINT: {
    code: "hp",
    name: "Hardpoint",
    identifiers: ["hardpoint"],
  },
  SEARCH: {
    code: "snd",
    name: "Search and Destroy",
    identifiers: ["search"],
  },
  CONTROL: {
    code: "cntrl",
    name: "Control",
    identifiers: ["control"],
  },
};

export const MAPS = {
  HIGHRISE: {
    code: "highrise",
    name: "Highrise",
  },
  INVASION: {
    code: "invasion",
    name: "Invasion",
  },
  KARACHI: {
    code: "karachi",
    name: "Karachi",
  },
  RIO: {
    code: "rio",
    name: "Rio",
  },
  SIXSTAR: {
    code: "sixstar",
    name: "Six Star",
  },
  SUBBASE: {
    code: "subbase",
    name: "Sub Base",
  },
  VISTA: {
    code: "vista",
    name: "Vista",
  },
};

export const TEAMS = {
  OPTIC: {
    code: "ot",
    name: "OpTic Texas",
    identifiers: ["optic texas", "optic", "optictexas"],
  },
  NYSL: {
    code: "nysl",
    name: "New York Subliners",
    identifiers: [
      "new york subliners",
      "nysl",
      "subliners",
      "newyorksubliners",
    ],
  },
  FAZE: {
    code: "af",
    name: "Atlanta FaZe",
    identifiers: ["atlanta faze", "faze", "atlantafaze"],
  },
  ULTRA: {
    code: "tu",
    name: "Toronto Ultra",
    identifiers: ["toronto ultra", "ultra", "torontoultra"],
  },
};

export const getGameMode = (mode) => {
  const gameMode = Object.values(GAME_MODES).find((gm) =>
    gm.identifiers.some((id) => mode.includes(id))
  );
  return gameMode?.code || "";
};

export const getMapName = (map) => {
  const mapEntry = Object.values(MAPS).find((m) => m.code === map);
  return mapEntry?.code || "";
};

export const getTeamCode = (teamName) => {
  const team = Object.values(TEAMS).find((t) =>
    t.identifiers.some((id) => teamName.includes(id))
  );
  return team?.code || "";
};
