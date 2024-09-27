import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import AnalysisBlock from "@/components/AnalysisBlock";

export default async function Home() {
  let analyses = [];
  let error = null;

  try {
    const response = await fetch("http://localhost/api/analyses", {
      cache: "no-store",
    });

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch analyses")
    }

    analyses = await response.json()
  } catch (err) {
    error = err.message
  }
  
  return (
    <main className="container px-4 py-8 max-w-screen-xl mx-auto">
      {error ? (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:px-6 lg:gap-6">
          {analyses.map((analysis, idx) => (
            <AnalysisBlock key={idx} analysis={analysis} />
          ))}
        </div>
      )}
    </main>
  );
}
