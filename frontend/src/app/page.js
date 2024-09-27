import AnalysisBlock from "@/components/AnalysisBlock";

export default async function Home() {
  let data = await fetch("http://localhost/api/analyses", {
    cache: "no-store",
  });
  let analyses = await data.json();
  return (
    <main className="container grid grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 md:grid-cols-4 md:px-6 lg:gap-6 max-w-screen-xl mx-auto">
      {analyses.map((analysis, idx) => (
        <AnalysisBlock key={idx} analysis={analysis} />
      ))}
    </main>
  );
}
