export const baseHeaders = [
  { key: "name", label: "NAME" },
  { key: "kd", label: "K/D" },
  { key: "assists", label: "ASSISTS" },
  { key: "non_traded_kills", label: "NTK" },
];

export const hardpointHeaders = [
  ...baseHeaders,
  { key: "highest_streak", label: "HS" },
  { key: "damage", label: "DMG" },
  { key: "hill_time", label: "HT" },
  { key: "average_hill_time", label: "AVG HT" },
  { key: "objective_kills", label: "OBJ KILLS" },
  { key: "contested_hill_time", label: "CONT HT" },
  { key: "kills_per_hill", label: "KPH" },
  { key: "damage_per_hill", label: "DPH" },
];

export const sndHeaders = [
  ...baseHeaders,
  { key: "bombs_planted", label: "PLANTS" },
  { key: "bombs_defused", label: "DEFUSES" },
  { key: "first_bloods", label: "FB" },
  { key: "first_deaths", label: "FD" },
  { key: "kills_per_round", label: "KPR" },
  { key: "damage_per_round", label: "DPR" },
];

export const controlHeaders = [
  ...baseHeaders,
  { key: "tiers_captured", label: "CAPS" },
  { key: "objective_kills", label: "OBJ KILLS" },
  { key: "offense_kills", label: "OFF KILLS" },
  { key: "defense_kills", label: "DEF KILLS" },
  { key: "kills_per_round", label: "KPR" },
  { key: "damage_per_round", label: "DPR" },
];
