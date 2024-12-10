"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CustomAnalysisBlock({ analysis }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/analysis/custom/${analysis.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group overflow-hidden *:border-muted cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="h-[105px] lg:h-[180px] w-full rounded-lg"
          style={{
            background: `linear-gradient(135deg, #${analysis.thumbnail_color} 0%, #${analysis.thumbnail_color}77 100%)`,
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-primary mb-1 truncate lg:whitespace-normal">
          {analysis.title}
        </h3>
      </div>
    </div>
  );
}
