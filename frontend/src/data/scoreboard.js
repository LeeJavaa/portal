export const baseHeaders = [
  { key: "name", label: "NAME" },
  { key: "kd", label: "K/D" },
  { key: "assists", label: "ASS." },
  { key: "non_traded_kills", label: "NTK" },
  { key: "highest_streak", label: "HS" },
  { key: "damage", label: "DMG" },
];

export const hardpointHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "HT" },
  { key: "mode_stat_two", label: "AVG HT" },
  { key: "mode_stat_three", label: "OBJ Ks" },
  { key: "mode_stat_four", label: "CONT HT" },
  { key: "mode_stat_five", label: "KPH" },
  { key: "mode_stat_six", label: "DPH" },
];

export const sndHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "PLNTS" },
  { key: "mode_stat_two", label: "DEFs" },
  { key: "mode_stat_three", label: "FB" },
  { key: "mode_stat_four", label: "FD" },
  { key: "mode_stat_five", label: "KPR" },
  { key: "mode_stat_six", label: "DPR" },
];

export const controlHeaders = [
  ...baseHeaders,
  { key: "mode_stat_one", label: "CAPS" },
  { key: "mode_stat_two", label: "OBJ Ks" },
  { key: "mode_stat_three", label: "OFF Ks" },
  { key: "mode_stat_four", label: "DEF Ks" },
  { key: "mode_stat_five", label: "KPR" },
  { key: "mode_stat_six", label: "DPR" },
];
