import ContentionChart from "../data-visualisation/ContentionChart";
import KVDChart from "../data-visualisation/KVDChart";
import KDChart from "../data-visualisation/KDChart";
import KillsChart from "../data-visualisation/KillsChart";
import DeathsChart from "../data-visualisation/DeathsChart";
import AssistsChart from "../data-visualisation/AssistsChart";
import NTKChart from "../data-visualisation/NTKChart";
import HSChart from "../data-visualisation/HSChart";
import DamageChart from "../data-visualisation/DamageChart";
import HTChart from "../data-visualisation/HTChart";
import AHTChart from "../data-visualisation/AHTChart";
import OKChart from "../data-visualisation/OKChart";
import CTChart from "../data-visualisation/CTChart";
import KPHChart from "../data-visualisation/KPHChart";
import DPHChart from "../data-visualisation/DPHChart";
import BombsPlanted from "../data-visualisation/BombsPlanted";
import BombsDefused from "../data-visualisation/BombsDefused";
import FirstBloods from "../data-visualisation/FirstBloods";
import FirstDeaths from "../data-visualisation/FirstDeaths";
import KillsPerRoundSND from "../data-visualisation/KillsPerRoundSND";
import DamagePerRoundSND from "../data-visualisation/DamagePerRoundSND";
import TiersCaptured from "../data-visualisation/TiersCaptured";
import ObjectiveKillsCTRL from "../data-visualisation/ObjectiveKillsCTRL";
import OffenseKills from "../data-visualisation/OffenseKills";
import DefenseKills from "../data-visualisation/DefenseKills";
import KillsPerRoundCTRL from "../data-visualisation/KillsPerRoundCTRL";
import DamagePerRoundCTRL from "../data-visualisation/DamagePerRoundCTRL";

export default function DataVis({ playerPerformanceData, mapMetadata }) {
  const pieChartData = [
    {
      name: mapMetadata.teamOne,
      value: mapMetadata.teamOneScore,
      fill: "var(--color-teamOne)",
    },
    {
      name: mapMetadata.teamTwo,
      value: mapMetadata.teamTwoScore,
      fill: "var(--color-teamTwo)",
    },
  ];

  const chartConfig = {
    kills: {
      label: "Kills",
      color: "hsl(var(--chart-2))",
    },
    deaths: {
      label: "Deaths",
      color: "hsl(var(--chart-3))",
    },
    assists: {
      label: "Assists",
      color: "hsl(var(--chart-4))",
    },
    ntk: {
      label: "NTK",
      color: "hsl(var(--chart-5))",
    },
    kdRatio: {
      label: "KD",
      color: "hsl(var(--chart-5))",
    },
    teamOne: {
      label: "Team One",
      color: "hsl(var(--chart-2))",
    },
    teamTwo: {
      label: "Team Two",
      color: "hsl(var(--chart-3))",
    },
  };

  const hardpoint = playerPerformanceData.some(
    (data) => "hp_highestStreak" in data
  );
  const snd = playerPerformanceData.some((data) => "snd_bombsPlanted" in data);
  const control = playerPerformanceData.some(
    (data) => "ctrl_tiersCaptured" in data
  );

  return (
    <section className="mt-8 mb-8">
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        <ContentionChart config={chartConfig} data={pieChartData} />
        <KVDChart config={chartConfig} data={playerPerformanceData} />
        <KDChart config={chartConfig} data={playerPerformanceData} />
        <KillsChart config={chartConfig} data={playerPerformanceData} />
        <DeathsChart config={chartConfig} data={playerPerformanceData} />
        <AssistsChart config={chartConfig} data={playerPerformanceData} />
        <NTKChart config={chartConfig} data={playerPerformanceData} />
        {hardpoint && (
          <>
            <HSChart config={chartConfig} data={playerPerformanceData} />
            <DamageChart config={chartConfig} data={playerPerformanceData} />
            <HTChart config={chartConfig} data={playerPerformanceData} />
            <AHTChart config={chartConfig} data={playerPerformanceData} />
            <OKChart config={chartConfig} data={playerPerformanceData} />
            <CTChart config={chartConfig} data={playerPerformanceData} />
            <KPHChart config={chartConfig} data={playerPerformanceData} />
            <DPHChart config={chartConfig} data={playerPerformanceData} />
          </>
        )}
        {snd && (
          <>
            <BombsPlanted config={chartConfig} data={playerPerformanceData} />
            <BombsDefused config={chartConfig} data={playerPerformanceData} />
            <FirstBloods config={chartConfig} data={playerPerformanceData} />
            <FirstDeaths config={chartConfig} data={playerPerformanceData} />
            <KillsPerRoundSND
              config={chartConfig}
              data={playerPerformanceData}
            />
            <DamagePerRoundSND
              config={chartConfig}
              data={playerPerformanceData}
            />
          </>
        )}
        {control && (
          <>
            <TiersCaptured config={chartConfig} data={playerPerformanceData} />
            <ObjectiveKillsCTRL
              config={chartConfig}
              data={playerPerformanceData}
            />
            <OffenseKills config={chartConfig} data={playerPerformanceData} />
            <DefenseKills config={chartConfig} data={playerPerformanceData} />
            <KillsPerRoundCTRL
              config={chartConfig}
              data={playerPerformanceData}
            />
            <DamagePerRoundCTRL
              config={chartConfig}
              data={playerPerformanceData}
            />
          </>
        )}
      </div>
    </section>
  );
}
