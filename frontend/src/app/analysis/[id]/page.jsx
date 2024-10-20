"use client";
import Scoreboard from "@/components/Scoreboard";
import { Button } from "@/components/ui/button";
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
import { Trash2, Image as ImageIcon, Monitor } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function Page() {
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

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: Monitor,
      color: "hsl(var(--chart-2))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-3))",
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
      <div className="w-[500px] mb-7">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </main>
  );
}
