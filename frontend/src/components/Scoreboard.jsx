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

const ScoreboardRow = ({
  player,
  isLastRow,
  input,
  headers,
  onInputChange,
}) => {
  const [modifiedFields, setModifiedFields] = useState({});
  const inputRefs = useRef({});

  const handleInputChange = (key) => {
    setModifiedFields((prev) => ({
      ...prev,
      [key]: true,
    }));

    if (onInputChange) {
      const value = inputRefs.current[key]?.value;
      onInputChange(player.name[0], key, value);
    }
  };

  return (
    <TableRow>
      {headers.map(({ key }) => (
        <TableCell
          key={key}
          className={`border-r text-center ${isLastRow ? "border-b" : ""} ${
            key === "name" ? "border-l w-[250px]" : ""
          } ${input ? "py-1" : ""}`}
        >
          {input ? (
            <Input
              ref={(el) => (inputRefs.current[key] = el)}
              defaultValue={
                Array.isArray(player[key]) ? player[key][0] : player[key]
              }
              className={`${
                key === "name"
                  ? "pl-2 uppercase font-medium"
                  : "text-center px-0"
              } border-0 ring-offset-0 focus-visible:ring-offset-0 ${getBorderClass(
                Array.isArray(player[key]) ? player[key][1] : "low",
                modifiedFields[key]
              )}`}
              onChange={() => handleInputChange(key)}
            />
          ) : (
            <span>
              {Array.isArray(player[key]) ? player[key][0] : player[key]}
            </span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function Scoreboard({
  gameMode,
  playerData,
  caption,
  input,
  onPlayerDataChange,
}) {
  const headers = getHeaders(gameMode);

  const handleInputChange = (playerName, key, value) => {
    if (onPlayerDataChange) {
      onPlayerDataChange(playerName, key, value);
    }
  };

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
              input={input}
              headers={headers}
              onInputChange={handleInputChange}
            />
            {index === 3 && <EmptyRow columnCount={headers.length} />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
