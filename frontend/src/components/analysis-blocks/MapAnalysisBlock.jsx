"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import formatDate from "@/utils/dateHandling";
import { CircleCheck, Loader2 } from "lucide-react";

export default function MapAnalysisBlock({
  analysis,
  selectionMode,
  isSelected,
  onSelect,
  seriesGallery,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  let formatted_played_date = formatDate(analysis.played_date);

  const handleClick = (e) => {
    if (selectionMode) {
      e.preventDefault();
      onSelect();
      return;
    }

    if (!selectionMode) {
      e.preventDefault();
      setIsLoading(true);
      router.push(`/analysis/map/${analysis.id}`);
    }
  };

  return (
    <div
      className={`group overflow-hidden ${
        isSelected ? "border-primary" : "border-muted"
      } cursor-pointer`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className={`h-[180px] w-full rounded-lg transition-all duration-300 ${
            selectionMode ? "" : "group-hover:scale-105"
          }`}
          style={{
            background: `linear-gradient(135deg, #${analysis.thumbnail_color} 0%, #${analysis.thumbnail_color}77 100%)`,
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/70 ${
            isSelected ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ${
            selectionMode ? "" : "group-hover:opacity-100"
          }`}
        />
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CircleCheck className="h-7 w-7" />
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-semibold text-primary mb-1">
          {analysis.title}
        </h3>
        {!seriesGallery && (
          <div className="text-sm text-muted-foreground">
            <p>
              {analysis.team_one} vs {analysis.team_two}
            </p>
            <p>{formatted_played_date}</p>
          </div>
        )}
      </div>
    </div>
  );
}
