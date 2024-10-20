import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";

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
      <Scoreboard
        playerData={playerData}
        caption="Scoreboard awaiting confirmation"
        input={true}
      />
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
