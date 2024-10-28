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
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

export default function DonutChart({ config, data }) {
  return (
    <Card className="flex flex-col bg-background">
      <CardHeader className="items-center pb-0">
        <CardTitle>Map Contention</CardTitle>
        <CardDescription>
          A visual description of how close this game was
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          This map was fairly close
        </div>
        <div className="leading-none text-muted-foreground">
          OpTic Texas won by 35 points
        </div>
      </CardFooter>
    </Card>
  );
}
