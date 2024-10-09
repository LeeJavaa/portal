import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import formatDate from "../../../../utils/dateHandling";

import { TriangleAlert } from "lucide-react";
import { CalendarDays, Map, Flag } from "lucide-react";

async function getAnalysis(id) {
  // Replace with your actual API endpoint
  const res = await fetch(`http://localhost/api/analysis/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch analysis");
  }
  return res.json();
}

export default async function Page({ params }) {
  const analysis = await getAnalysis(params.id);

  if (!analysis) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12">
        <div className="w-full max-w-4xl">
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No analysis data available. Please ensure you&apos;ve selected a
              valid analysis.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  let formatted_played_date = formatDate(analysis.played_date);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 md:px-6 py-12">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden">
        <Image
          src={`http://localhost/static/analysis/img/${analysis.map}.jpg`}
          alt={`Map: ${analysis.map}`}
          width={1000}
          height={500}
          layout="responsive"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="w-full max-w-4xl space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{analysis.title}</h1>
        </div>
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex gap-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>{formatted_played_date}</span>
          </div>
          <div className="flex gap-x-2">
            <Map className="w-5 h-5" />
            <span>{analysis.map}</span>
          </div>
          <div className="flex gap-x-2">
            <Flag className="w-5 h-5" />
            <span>T1: {analysis.team_one}</span>
          </div>
          <div className="flex gap-x-2">
            <Flag className="w-5 h-5" />
            <span>T2: {analysis.team_two}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
