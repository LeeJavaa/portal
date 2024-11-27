import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
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
    case "hp":
      return hardpointHeaders;
    case "snd":
      return sndHeaders;
    case "cntrl":
      return controlHeaders;
    default:
      return hardpointHeaders;
  }
};

const getBorderClass = (confidence, isModified) => {
  if (isModified) return "";
  switch (confidence) {
    case "medium":
      return "border-warning";
    case "low":
      return "border-destructive";
    default:
      return "";
  }
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

const ScoreboardRow = ({ player, isLastRow, headers, playerIndex, form }) => {
  const [modifiedFields, setModifiedFields] = useState({});

  const handleInputChange = (key, value) => {
    const currentStats = form.getValues("player_stats");

    const updatedPlayer = { ...currentStats[playerIndex] };

    if (Array.isArray(updatedPlayer[key])) {
      updatedPlayer[key] = [value, updatedPlayer[key][1]];
    } else {
      updatedPlayer[key] = value;
    }

    const updatedStats = [...currentStats];
    updatedStats[playerIndex] = updatedPlayer;

    form.setValue("player_stats", updatedStats);

    setModifiedFields((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  return (
    <TableRow>
      {headers.map(({ key }) => (
        <TableCell
          key={key}
          className={`border-r text-center py-1 ${
            isLastRow ? "border-b" : ""
          } ${key === "name" ? "border-l w-[250px]" : ""}`}
        >
          <Input
            defaultValue={
              Array.isArray(player[key]) ? player[key][0] : player[key]
            }
            className={`${
              key === "name" ? "pl-2 uppercase font-medium" : "text-center px-0"
            } border-0 ring-offset-0 focus-visible:ring-offset-0 ${getBorderClass(
              Array.isArray(player[key]) ? player[key][1] : "low",
              modifiedFields[key]
            )}`}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function Scoreboard({ gameMode, playerData, caption, form }) {
  const headers = getHeaders(gameMode);

  // Create array of players with empty rows to ensure we have at least 8 rows
  const filledPlayerData = [
    ...playerData,
    ...Array(Math.max(0, 8 - playerData.length)).fill({}),
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
              playerIndex={index}
              form={form}
            />
            {index === 3 && <EmptyRow columnCount={headers.length} />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
