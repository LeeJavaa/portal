"use client";
import playerMapPerformances from "@/mock/playerMapPerformance.json";
import mapAnalyses from "@/mock/mapAnalysis.json";
import FilterBar from "@/components/analysis-page/FilterBar";
import DataVis from "@/components/analysis-page/DataVis";
import { Separator } from "@/components/ui/separator";

export default function () {
  const combinePlayerPerformanceData = (data) => {
    return data.playerMapPerformances
      .filter((performance) => performance.mapAnalysis === 3)
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
                snd.playerPerformance - 8 === performance.playerPerformanceSND
            )
          : null;

        const controlPerformance = performance.playerPerformanceControl
          ? data.playerMapPerformanceControls.find(
              (ctrl) =>
                ctrl.playerPerformance - 16 ===
                performance.playerPerformanceControl
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

  return (
    <main className="w-full max-w-screen-xl mx-auto">
      <h1 className="text-center text-3xl font-bold mt-5 mb-8">
        OpTic vs NYSL Champs GF
      </h1>
      <Separator className="mt-8" />
      <FilterBar />
      <DataVis
        playerPerformanceData={playerPerformanceData}
        mapMetadata={mapMetadata}
      />
    </main>
  );
}
