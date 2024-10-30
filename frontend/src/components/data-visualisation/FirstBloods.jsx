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

export default function FirstBloods({ config, data }) {
  return (
    <Card className="bg-background">
      <CardHeader className="items-center">
        <CardTitle>Player First Bloods</CardTitle>
        <CardDescription className="text-center">
          How many first bloods did each player get?
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
              dataKey="snd_firstBloods"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="snd_firstBloods"
              fill="var(--color-kills)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
