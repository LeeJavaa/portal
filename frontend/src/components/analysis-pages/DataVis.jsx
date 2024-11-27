"use client";
import { chartConfigObject } from "@/data/visualisations";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export default function DataVis({ data }) {
  return (
    <section className="mt-8 mb-8">
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Donut</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

// <section className="mt-8 mb-8">
//   <div className="grid grid-cols-3 gap-x-2 gap-y-3">
//     <ContentionChart config={chartConfig} data={pieChartData} />
//     <KVDChart config={chartConfig} data={playerPerformanceData} />
//     <KDChart config={chartConfig} data={playerPerformanceData} />
//     <KillsChart config={chartConfig} data={playerPerformanceData} />
//     <DeathsChart config={chartConfig} data={playerPerformanceData} />
//     <AssistsChart config={chartConfig} data={playerPerformanceData} />
//     <NTKChart config={chartConfig} data={playerPerformanceData} />
//     {hardpoint && (
//       <>
//         <HSChart config={chartConfig} data={playerPerformanceData} />
//         <DamageChart config={chartConfig} data={playerPerformanceData} />
//         <HTChart config={chartConfig} data={playerPerformanceData} />
//         <AHTChart config={chartConfig} data={playerPerformanceData} />
//         <OKChart config={chartConfig} data={playerPerformanceData} />
//         <CTChart config={chartConfig} data={playerPerformanceData} />
//         <KPHChart config={chartConfig} data={playerPerformanceData} />
//         <DPHChart config={chartConfig} data={playerPerformanceData} />
//       </>
//     )}
//     {snd && (
//       <>
//         <BombsPlanted config={chartConfig} data={playerPerformanceData} />
//         <BombsDefused config={chartConfig} data={playerPerformanceData} />
//         <FirstBloods config={chartConfig} data={playerPerformanceData} />
//         <FirstDeaths config={chartConfig} data={playerPerformanceData} />
//         <KillsPerRoundSND
//           config={chartConfig}
//           data={playerPerformanceData}
//         />
//         <DamagePerRoundSND
//           config={chartConfig}
//           data={playerPerformanceData}
//         />
//       </>
//     )}
//     {control && (
//       <>
//         <TiersCaptured config={chartConfig} data={playerPerformanceData} />
//         <ObjectiveKillsCTRL
//           config={chartConfig}
//           data={playerPerformanceData}
//         />
//         <OffenseKills config={chartConfig} data={playerPerformanceData} />
//         <DefenseKills config={chartConfig} data={playerPerformanceData} />
//         <KillsPerRoundCTRL
//           config={chartConfig}
//           data={playerPerformanceData}
//         />
//         <DamagePerRoundCTRL
//           config={chartConfig}
//           data={playerPerformanceData}
//         />
//       </>
//     )}
//   </div>
// </section>
