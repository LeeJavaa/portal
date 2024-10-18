import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";

const playerData = [
  {
    name: "KENNY",
    kd: "29/19",
    assists: "6",
    ntk: "23",
    highestStreak: "2",
    dmg: "5173",
    ht: "0:53",
    avgHt: "0:04",
    objKills: "5",
    contHt: "0:04",
    kph: "2.45",
    dph: "436.81",
  },
];

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

const ScoreboardRow = ({ player, isLastRow }) => (
  <TableRow>
    <TableCell
      className={`font-medium border-r w-[250px] py-1 border-l ${
        isLastRow ? "border-b" : ""
      }`}
    >
      <Input
        defaultValue={player.name}
        className="border-0 pl-2 ring-offset-0 focus-visible:ring-offset-0"
      />
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
        className={`border-r py-1 ${isLastRow ? "border-b" : ""}`}
      >
        <Input
          defaultValue={player[key]}
          className="text-center border-0 px-0 focus-visible:ring-offset-0"
        />
      </TableCell>
    ))}
  </TableRow>
);

const ScoreboardTable = () => {
  return (
    <Table>
      <TableCaption>Scoreboard awaiting confirmation</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px] border-r border-t border-l"></TableHead>
          <TableHead className="text-center border-r border-t">K/D</TableHead>
          <TableHead className="text-center border-r border-t">
            Assists
          </TableHead>
          <TableHead className="text-center border-r border-t">NTK</TableHead>
          <TableHead className="text-center border-r border-t">
            Highest Streak
          </TableHead>
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
            <ScoreboardRow player={playerData[0]} isLastRow={index === 7} />
            {index === 3 && <EmptyRow />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default function ScoreboardDisplay({ setFormStep }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Alert variant="destructive" className="border-2 mb-2">
        <AlertTitle className="font-bold">Can you fix this for us?</AlertTitle>
        <AlertDescription className=" font-medium">
          Unfortunately our algorithms aren't perfect. Do you mind updating any
          incorrect values? We highlighted a few for you.
        </AlertDescription>
      </Alert>
      <ScoreboardTable />
      <div className="w-full flex gap-2">
        <Button type="button" onClick={() => setFormStep(4)}>
          Confirm
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button type="button" variant={"ghost"} onClick={() => setFormStep(2)}>
          Go back
        </Button>
      </div>
    </div>
  );
}
