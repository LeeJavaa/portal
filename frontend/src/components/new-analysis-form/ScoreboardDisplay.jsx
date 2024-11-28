import { useEffect, useState } from "react";
import Scoreboard from "@/components/new-analysis-form/Scoreboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

export default function ScoreboardDisplay({ form, setFormStep, data }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const currentPlayerStats = form.getValues("player_stats");
    const isPlayerStatsEmpty = !currentPlayerStats;
    if (data?.player_stats && isPlayerStatsEmpty) {
      form.setValue("player_stats", data.player_stats);
    }
    setIsDataLoaded(true);
  }, [data, form]);

  const handleConfirm = () => {
    const isValid = form.trigger("player_stats");
    if (isValid) {
      setFormStep(4);
    }
  };

  if (!isDataLoaded) {
    return (
      <>
        <Alert>
          <AlertTitle>Hold on!</AlertTitle>
          <AlertDescription>
            We're just busy processing that scoreboard real quick
          </AlertDescription>
        </Alert>
        <Loader className=" h-15 w-15 animate-spin" />
      </>
    );
  }

  const playerStatsValue = form.getValues("player_stats");

  if (!playerStatsValue || Object.keys(playerStatsValue).length === 0) {
    return (
      <Alert variant="destructive" className="border-2 mb-2">
        <AlertTitle className="font-bold">No player data found</AlertTitle>
        <AlertDescription className="font-medium">
          Please try processing the scoreboard again.
        </AlertDescription>
      </Alert>
    );
  }

  const gameMode = form?.getValues("game_mode");
  if (!gameMode) {
    return (
      <Alert variant="destructive" className="border-2 mb-2">
        <AlertTitle className="font-bold">Game mode incorrect</AlertTitle>
        <AlertDescription className="font-medium">
          Please try processing the scoreboard again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Alert className="border-2 mb-2">
        <AlertTitle className="font-bold">Can you fix this for us?</AlertTitle>
        <AlertDescription className=" font-medium">
          Unfortunately our algorithms aren't perfect. Do you mind updating any
          incorrect values? We may have highlighted a few for you.
        </AlertDescription>
      </Alert>
      <Scoreboard
        gameMode={gameMode}
        playerData={playerStatsValue}
        caption="Scoreboard awaiting confirmation"
        form={form}
      />
      <div className="w-full flex gap-2">
        <Button type="button" onClick={handleConfirm}>
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
