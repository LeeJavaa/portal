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

export const TOURNAMENTS = {
  CHAMPS: {
    id: "1",
    name: "Call of Duty Championships 2024",
  },
  MAJOR4FIN: {
    id: "2",
    name: "Major IV Finalse",
  },
  MAJOR3FIN: {
    id: "3",
    name: "Major III Finals",
  },
  MAJOR2FIN: {
    id: "4",
    name: "Major II Finals",
  },
  MAJOR1FIN: {
    id: "5",
    name: "Major I Finals",
  },
};

export const PLAYERS = {
  KENNY: {
    dirty: "Kenny",
    clean: "Kenny",
  },
  DASHY: {
    dirty: "Dashy",
    clean: "Dashy",
  },
  PRED: {
    dirty: "Pred",
    clean: "Pred",
  },
  SHOTZZY: {
    dirty: "Shotzzy",
    clean: "Shotzzy",
  },
  SIB: {
    dirty: "Sib",
    clean: "Sib",
  },
  KISMET: {
    dirty: "Kismet",
    clean: "Kismet",
  },
  SKYZ: {
    dirty: "Skyz",
    clean: "Skyz",
  },
  HYDRA: {
    dirty: "Hydra",
    clean: "Hydra",
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
