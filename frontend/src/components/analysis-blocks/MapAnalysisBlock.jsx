"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import formatDate from "@/utils/dateHandling";
import { CircleCheck } from "lucide-react";

export default function MapAnalysisBlock({
  analysis,
  selectionMode,
  isSelected,
  onSelect,
  seriesGallery,
}) {
  const [imageError, setImageError] = useState(false);
  let formatted_played_date = formatDate(analysis.played_date);
  let thumbnail = analysis.thumbnail ? analysis.thumbnail : analysis.map;

  const handleClick = (e) => {
    if (selectionMode) {
      e.preventDefault();
      onSelect();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const content = (
    <div
      className={`group overflow-hidden ${
        isSelected ? "border-primary" : "border-muted"
      } cursor-pointer`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={
            imageError
              ? "https://portal-web-public.s3.us-east-1.amazonaws.com/thumbnails/placeholder.png"
              : `https://portal-web-public.s3.us-east-1.amazonaws.com/thumbnails/${thumbnail}.png`
          }
          width={300}
          height={150}
          alt="Analysis Thumbnail Image"
          className={`h-full w-full rounded-lg object-cover transition-all duration-300 ${
            selectionMode ? "" : "group-hover:scale-105"
          }`}
          style={{ aspectRatio: "300/150", objectFit: "cover" }}
          onError={handleImageError}
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

  if (selectionMode) {
    return content;
  }

  return <Link href={`/analysis/map/${analysis.id}`}>{content}</Link>;
}
