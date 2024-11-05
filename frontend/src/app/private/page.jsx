"use client";
import AnalysisGrid from "@/components/AnalysisGrid";
import customAnalysis from "@/mock/customAnalysis.json";

export default function PrivatePage() {
  const analyses = customAnalysis.customAnalyses;
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Your Custom Analyses
      </h1>
      <AnalysisGrid analyses={analyses} showCustoms={true} />
    </main>
  );
}
