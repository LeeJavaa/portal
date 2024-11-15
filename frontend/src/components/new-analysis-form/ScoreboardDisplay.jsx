import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";

const initializePlayerStats = (players, gameMode) => {
  const stats = {};
  players.forEach((player) => {
    if (!player.name?.[0]) return;

    const playerStats = {};
    Object.entries(player).forEach(([key, value]) => {
      if (key !== "name") {
        playerStats[key] = Array.isArray(value) ? value[0] : value;
      }
    });

    stats[player.name[0]] = playerStats;
  });
  return stats;
};

export default function ScoreboardDisplay({ form, setFormStep, data }) {
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    if (data?.players) {
      const initialStats = initializePlayerStats(data.players);
      setPlayerStats(initialStats);
      form.setValue("player_stats", initialStats);
    }
  }, [data, form]);

  const handlePlayerDataChange = (playerName, key, value) => {
    setPlayerStats((prev) => ({
      ...prev,
      [playerName]: {
        ...prev[playerName],
        [key]: value,
      },
    }));
  };

  const handleConfirm = async () => {
    form.setValue("player_stats", playerStats);

    const valid = await form.trigger("player_stats");

    if (valid) {
      setFormStep(4);
    }
  };

  if (!data?.players || data.players.length === 0) {
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
        playerData={data.players}
        caption="Scoreboard awaiting confirmation"
        input={true}
        onPlayerDataChange={handlePlayerDataChange}
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
