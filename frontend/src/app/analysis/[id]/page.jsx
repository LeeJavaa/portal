"use client";
import Scoreboard from "@/components/Scoreboard";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import playerMapPerformances from "@/mock/playerMapPerformance.json";
import mapAnalyses from "@/mock/mapAnalysis.json";
import {
  Trash2,
  Image as ImageIcon,
  Crosshair,
  Skull,
  TrendingUp,
} from "lucide-react";
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

export default function Page() {
  const filteredData = playerMapPerformances.playerMapPerformances
    .filter((performance) => performance.mapAnalysis === 1)
    .map((performance) => ({
      player: performance.player,
      kills: performance.kills,
      deaths: performance.deaths,
      kdRatio: performance.kdRatio,
    }));

  const mapAnalysisData = mapAnalyses.mapAnalyses
    .filter((mapAnalysis) => mapAnalysis.id === 1)
    .map((mapAnalysis) => ({
      teamOne: mapAnalysis.teamOne,
      teamOneScore: mapAnalysis.teamOneScore,
      teamTwo: mapAnalysis.teamTwo,
      teamTwoScore: mapAnalysis.teamTwoScore,
    }));

  const pieChartData = [
    {
      name: mapAnalysisData[0].teamOne,
      value: mapAnalysisData[0].teamOneScore,
      fill: "var(--color-teamOne)",
    },
    {
      name: mapAnalysisData[0].teamTwo,
      value: mapAnalysisData[0].teamTwoScore,
      fill: "var(--color-teamTwo)",
    },
  ];

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

  const chartConfig = {
    kills: {
      label: "Kills",
      color: "hsl(var(--chart-2))",
    },
    deaths: {
      label: "Deaths",
      color: "hsl(var(--chart-4))",
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
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <main>
      <h1>Title</h1>
      <Scoreboard playerData={playerData} caption="" input={false} />
      <div className="flex">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ot">OpTic Texas</SelectItem>
            <SelectItem value="nysl">New York Subliners</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Player" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kenny">Kenny</SelectItem>
            <SelectItem value="Dashy">Dashy</SelectItem>
            <SelectItem value="Shotzzy">Shotzzy</SelectItem>
            <SelectItem value="Pred">Pred</SelectItem>
            <SelectItem value="Hydra">Hydra</SelectItem>
            <SelectItem value="Sib">Sib</SelectItem>
            <SelectItem value="Skyz">Skyz</SelectItem>
            <SelectItem value="Kismet">Kismet</SelectItem>
          </SelectContent>
        </Select>
        <Button>Apply Filter</Button>
        <Button variant="outline">
          <Trash2 className="w-4 h-4" />
        </Button>
        <Dialog>
          <DialogTrigger>View Original</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Original Scoreboard Screenshot</DialogTitle>
              <DialogDescription>Behold your eyes on heaven,</DialogDescription>
            </DialogHeader>
            <ImageIcon className="w-32 h-32" />
          </DialogContent>
        </Dialog>
      </div>
      <div>OpTic Texas 250 - 212 New York Subliners</div>
      <div>Karachi, Hardpoint</div>
      <div>OpTic Texas vs NYSL GF, Call of Duty Championships 2024</div>
      <div>21 July 2024, 6pm</div>
      <div className="flex justify-between">
        <Card>
          <CardHeader>
            <CardTitle>Player Kills / Deaths</CardTitle>
            <CardDescription>
              The amount of kills vs deaths for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={filteredData}>
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
        <Card>
          <CardHeader>
            <CardTitle>Player Kills</CardTitle>
            <CardDescription>
              The amount of kills vs deaths for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={filteredData}>
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
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Player Deaths</CardTitle>
            <CardDescription>
              The amount of kills vs deaths for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={filteredData}>
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="deaths" fill="var(--color-deaths)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <Card>
          <CardHeader>
            <CardTitle>Player K/D ratio</CardTitle>
            <CardDescription>
              The kills to death ratio for each player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={filteredData}>
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="kdRatio">
                  {filteredData.map((item) => (
                    <Cell
                      key={item.player}
                      fill={
                        item.kdRatio > 1
                          ? "hsl(var(--chart-1))"
                          : "hsl(var(--chart-2))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Domination analysis</CardTitle>
            <CardDescription>See how close the game was</CardDescription>
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
                <Pie data={pieChartData} dataKey="value" nameKey="name" />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
