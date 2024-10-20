import React from "react";
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

const EmptyRow = () => (
  <TableRow>
    {[...Array(12)].map((_, index) => (
      <TableCell
        key={index}
        className={`py-5 ${
          index === 0 ? "border-l" : index === 11 ? "border-r" : ""
        }`}
      ></TableCell>
    ))}
  </TableRow>
);

const ScoreboardRow = ({ player, isLastRow, input }) => (
  <TableRow>
    <TableCell
      className={`font-medium border-r w-[250px] border-l ${
        isLastRow ? "border-b" : ""
      } ${input ? "py-1" : ""}`}
    >
      {input ? (
        <Input
          defaultValue={player.name}
          className="border-0 pl-2 ring-offset-0 focus-visible:ring-offset-0"
        />
      ) : (
        <span className="text-center">{player.name}</span>
      )}
    </TableCell>
    {[
      "kd",
      "assists",
      "ntk",
      "highestStreak",
      "dmg",
      "ht",
      "avgHt",
      "objKills",
      "contHt",
      "kph",
      "dph",
    ].map((key) => (
      <TableCell
        key={key}
        className={`border-r text-center ${isLastRow ? "border-b" : ""} ${
          input ? "py-1" : ""
        }`}
      >
        {input ? (
          <Input
            defaultValue={player[key]}
            className="text-center border-0 px-0 focus-visible:ring-offset-0"
          />
        ) : (
          <span className="">{player[key]}</span>
        )}
      </TableCell>
    ))}
  </TableRow>
);

export default function Scoreboard({ playerData, caption, input }) {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px] border-r border-t border-l"></TableHead>
          <TableHead className="text-center border-r border-t">K/D</TableHead>
          <TableHead className="text-center border-r border-t">
            Assists
          </TableHead>
          <TableHead className="text-center border-r border-t">NTK</TableHead>
          <TableHead className="text-center border-r border-t">HS</TableHead>
          <TableHead className="text-center border-r border-t">DMG</TableHead>
          <TableHead className="text-center border-r border-t">HT</TableHead>
          <TableHead className="text-center border-r border-t">
            Avg HT
          </TableHead>
          <TableHead className="text-center border-r border-t">
            OBJ Kills
          </TableHead>
          <TableHead className="text-center border-r border-t">
            Cont. HT
          </TableHead>
          <TableHead className="text-center border-r border-t">KPH</TableHead>
          <TableHead className="text-center border-r border-t">DPH</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(8)].map((_, index) => (
          <React.Fragment key={index}>
            <ScoreboardRow
              player={playerData[0]}
              isLastRow={index === 7}
              input={input}
            />
            {index === 3 && <EmptyRow />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
