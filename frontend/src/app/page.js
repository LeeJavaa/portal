import AnalysisBlock from "@/components/AnalysisBlock";

export default async function Home() {
  //   let data = await fetch("http://localhost:8000/api/analyses", {
  //     cache: "no-store",
  //   });
  //   let analyses = await data.json();
  return (
    <main className="container grid grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 md:grid-cols-4 md:px-6 lg:gap-6 max-w-screen-xl mx-auto">
      {/* {analyses.map((analysis) => (
        <AnalysisBlock
          key={analysis.id}
          title={analysis.title}
          play_date={analysis.play_date}
        />
      ))} */}
      <AnalysisBlock key="1" title="FaZe vs OpTic" play_date="2024 July 21" />
    </main>
  );
}
