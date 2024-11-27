export const baseHeaders = [
  { key: "name", label: "NAME" },
  { key: "kd", label: "K/D" },
  { key: "assists", label: "ASSISTS" },
  { key: "non_traded_kills", label: "NTK" },
  { key: "highest_streak", label: "HS" },
  { key: "damage", label: "DMG" },
];

export const hardpointHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "HT" },
  { key: "mode_stat_two", label: "AVG HT" },
  { key: "mode_stat_three", label: "OBJ KILLS" },
  { key: "mode_stat_four", label: "CONT HT" },
  { key: "mode_stat_five", label: "KPH" },
  { key: "mode_stat_six", label: "DPH" },
];

export const sndHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "PLANTS" },
  { key: "mode_stat_two", label: "DEFUSES" },
  { key: "mode_stat_three", label: "FB" },
  { key: "mode_stat_four", label: "FD" },
  { key: "mode_stat_five", label: "KPR" },
  { key: "mode_stat_six", label: "DPR" },
];

export const controlHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "CAPS" },
  { key: "mode_stat_two", label: "OBJ KILLS" },
  { key: "mode_stat_three", label: "OFF KILLS" },
  { key: "mode_stat_four", label: "DEF KILLS" },
  { key: "mode_stat_five", label: "KPR" },
  { key: "mode_stat_six", label: "DPR" },
];
