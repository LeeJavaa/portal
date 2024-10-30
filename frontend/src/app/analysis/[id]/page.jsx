"use client";
import Scoreboard from "@/components/Scoreboard";
import FilterBar from "@/components/analysis-page/FilterBar";
import MetaDescription from "@/components/analysis-page/MetaDescription";
import playerMapPerformances from "@/mock/playerMapPerformance.json";
import mapAnalyses from "@/mock/mapAnalysis.json";
import DataVis from "@/components/analysis-page/DataVis";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const combinePlayerPerformanceData = (data) => {
    return data.playerMapPerformances
      .filter((performance) => performance.mapAnalysis === 2)
      .map((performance) => {
        // Find corresponding game mode performance data
        const hpPerformance = performance.playerPerformanceHP
          ? data.playerMapPerformanceHPs.find(
              (hp) => hp.playerPerformance === performance.playerPerformanceHP
            )
          : null;

        const sndPerformance = performance.playerPerformanceSND
          ? data.playerMapPerformanceSNDs.find(
              (snd) =>
                snd.playerPerformance === performance.playerPerformanceSND
            )
          : null;

        const controlPerformance = performance.playerPerformanceControl
          ? data.playerMapPerformanceControls.find(
              (ctrl) =>
                ctrl.playerPerformance === performance.playerPerformanceControl
            )
          : null;

        return {
          // Base performance data
          player: performance.player,
          kills: performance.kills,
          deaths: performance.deaths,
          kdRatio: performance.kdRatio,
          assists: performance.assists,
          ntk: performance.ntk,

          // Hardpoint stats
          ...(hpPerformance && {
            hp_highestStreak: hpPerformance.highestStreak,
            hp_damage: hpPerformance.damage,
            hp_hillTime: hpPerformance.hillTime,
            hp_averageHillTime: hpPerformance.averageHillTime,
            hp_objectiveKills: hpPerformance.objectiveKills,
            hp_contestedHillTime: hpPerformance.contestedHillTime,
            hp_killsPerHill: hpPerformance.killsPerHill,
            hp_damagePerHill: hpPerformance.damagePerHill,
          }),

          // Search and Destroy stats
          ...(sndPerformance && {
            snd_bombsPlanted: sndPerformance.bombsPlanted,
            snd_bombsDefused: sndPerformance.bombsDefused,
            snd_firstBloods: sndPerformance.firstBloods,
            snd_firstDeaths: sndPerformance.firstDeaths,
            snd_killsPerRound: sndPerformance.killsPerRound,
            snd_damagePerRound: sndPerformance.damagePerRound,
          }),

          // Control stats
          ...(controlPerformance && {
            ctrl_tiersCaptured: controlPerformance.tiersCaptured,
            ctrl_objectiveKills: controlPerformance.objectiveKills,
            ctrl_offenseKills: controlPerformance.offenseKills,
            ctrl_defenseKills: controlPerformance.defenseKills,
            ctrl_killsPerRound: controlPerformance.killsPerRound,
            ctrl_damagePerRound: controlPerformance.damagePerRound,
          }),
        };
      });
  };

  const playerPerformanceData = combinePlayerPerformanceData(
    playerMapPerformances
  );

  const mapMetadata = mapAnalyses.mapAnalyses.filter(
    (mapAnalysis) => mapAnalysis.id === 2
  )[0];

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

  return (
    <main className="w-full max-w-screen-xl mx-auto">
      <h1 className="text-center text-3xl font-bold mt-5 mb-8">
        OpTic vs NYSL Champs GF Game 1
      </h1>
      <MetaDescription />
      <Scoreboard playerData={playerData} caption="" input={false} />
      <Separator className="mt-8" />
      <FilterBar />
      <DataVis
        playerPerformanceData={playerPerformanceData}
        mapMetadata={mapMetadata}
      />
    </main>
  );
}
