import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ObjectiveKillsCTRL({ config, data }) {
  return (
    <Card className="bg-background">
      <CardHeader className="items-center">
        <CardTitle>Player Objective Kills</CardTitle>
        <CardDescription className="text-center">
          What was each player's OBJ kill count?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="player"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="ctrl_objectiveKills"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="ctrl_objectiveKills"
              fill="var(--color-deaths)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
