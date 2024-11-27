import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  hardpointHeaders,
  sndHeaders,
  controlHeaders,
} from "@/data/scoreboard";

const getHeaders = (gameMode) => {
  switch (gameMode) {
    case "hardpoint":
      return hardpointHeaders;
    case "search and destroy":
      return sndHeaders;
    case "control":
      return controlHeaders;
    default:
      return hardpointHeaders;
  }
};

const transformPlayerData = (playerName, stats) => {
  return {
    name: playerName,
    kills: stats.kills,
    deaths: stats.deaths,
    kd: stats.kills.toString() + "/" + stats.deaths.toString(),
    assists: stats.assists,
    non_traded_kills: stats.ntk,
    highest_streak: stats.highest_streak,
    damage: stats.damage,
    mode_stat_one: stats.mode_stat_one,
    mode_stat_two: stats.mode_stat_two,
    mode_stat_three: stats.mode_stat_three,
    mode_stat_four: stats.mode_stat_four,
    mode_stat_five: stats.mode_stat_five,
    mode_stat_six: stats.mode_stat_six,
  };
};

const EmptyRow = ({ columnCount }) => (
  <TableRow>
    {[...Array(columnCount)].map((_, index) => (
      <TableCell
        key={index}
        className={`py-5 ${
          index === 0 ? "border-l" : index === columnCount - 1 ? "border-r" : ""
        }`}
      ></TableCell>
    ))}
  </TableRow>
);

const ScoreboardRow = ({ player, isLastRow, headers }) => {
  return (
    <TableRow>
      {headers.map(({ key }) => (
        <TableCell
          key={key}
          className={`border-r py-3 ${isLastRow ? "border-b" : ""} ${
            key === "name"
              ? "border-l w-[250px] pl-2 uppercase font-medium"
              : "text-center px-0"
          }`}
        >
          {player[key]}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function StaticScoreboard({ gameMode, playerData, caption }) {
  const headers = getHeaders(gameMode.toLowerCase());

  // Transform the player_performance_data object into an array of players
  const transformedPlayerData = playerData
    ? Object.entries(playerData).map(([playerName, stats]) =>
        transformPlayerData(playerName, stats)
      )
    : [];

  // Create array of players with empty rows to ensure we have at least 8 rows
  const filledPlayerData = [
    ...transformedPlayerData,
    ...Array(Math.max(0, 8 - transformedPlayerData.length)).fill({}),
  ];

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map(({ key, label }) => (
            <TableHead
              key={key}
              className={`text-center border-r border-t ${
                key === "name" ? "border-l w-[250px]" : ""
              }`}
            >
              {key === "name" ? "" : label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filledPlayerData.map((player, index) => (
          <React.Fragment key={index}>
            <ScoreboardRow
              player={player}
              isLastRow={index === filledPlayerData.length - 1}
              headers={headers}
            />
            {index === 3 && <EmptyRow columnCount={headers.length} />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
