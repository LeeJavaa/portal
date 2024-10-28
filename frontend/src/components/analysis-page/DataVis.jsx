import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import DonutChart from "../data-visualisation/DonutChart";

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

  return (
    <section className="mt-8 mb-8">
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        <DonutChart config={chartConfig} data={pieChartData} />
        <Card className="flex flex-col bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Kills vs Deaths</CardTitle>
            <CardDescription className="text-center">
              How each player stacked up with regards to kills and deaths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="kills"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="kills" fill="var(--color-kills)" radius={4} />
                <Bar dataKey="deaths" fill="var(--color-deaths)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player K/D ratio</CardTitle>
            <CardDescription>
              The kills to death ratio for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="kdRatio"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kdRatio">
                  {playerPerformanceData.map((item) => (
                    <Cell
                      key={item.player}
                      fill={
                        item.kdRatio > 1
                          ? "hsl(var(--chart-1))"
                          : "hsl(var(--chart-3))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Kills</CardTitle>
            <CardDescription>
              The total amount of kills each player got
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="kills"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kills" fill="var(--color-kills)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Deaths</CardTitle>
            <CardDescription>
              The total amount of deaths for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="deaths"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="deaths" fill="var(--color-deaths)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Assists</CardTitle>
            <CardDescription>
              The total amount of assists each player got
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="assists"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="assists" fill="var(--color-assists)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Non-Traded Kills</CardTitle>
            <CardDescription>
              The total amount of NTK each player got
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="ntk"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ntk" fill="var(--color-ntk)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Highest Streak</CardTitle>
            <CardDescription>
              The highest streak a player went on during the game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_highestStreak"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_highestStreak"
                  fill="var(--color-assists)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Damage</CardTitle>
            <CardDescription className="text-center">
              The total amount of damage a player dealt during the game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_damage"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hp_damage" fill="var(--color-ntk)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Hill Time</CardTitle>
            <CardDescription className="text-center">
              The total amount of hill time each player soaked during the game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_hillTime"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_hillTime"
                  fill="var(--color-kills)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Average Hill Time</CardTitle>
            <CardDescription className="text-center">
              The average hill time a player got per hill
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_averageHillTime"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_averageHillTime"
                  fill="var(--color-deaths)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Objective Kills</CardTitle>
            <CardDescription className="text-center">
              The total objective kills each player got during the game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_objectiveKills"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_objectiveKills"
                  fill="var(--color-kills)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Contested Time</CardTitle>
            <CardDescription className="text-center">
              How long did a player contest time for?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_contestedHillTime"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_contestedHillTime"
                  fill="var(--color-deaths)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Kills Per Hill</CardTitle>
            <CardDescription className="text-center">
              Average kills per hill for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_killsPerHill"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_killsPerHill"
                  fill="var(--color-kills)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="items-center">
            <CardTitle>Player Damage Per Hill</CardTitle>
            <CardDescription className="text-center">
              Average damage per hill for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={playerPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="player"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="hp_damagePerHill"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hp_damagePerHill"
                  fill="var(--color-deaths)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
