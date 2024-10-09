import Link from "next/link";
import Image from "next/image";
import formatDate from "../../utils/dateHandling";

export default function AnalysisBlock({
  analysis,
  selectionMode,
  isSelected,
  onSelect,
}) {
  let formatted_played_date = formatDate(analysis.playedDate);
  let thumbnail = analysis.map ? analysis.map : analysis.thumbnail;

  const handleClick = (e) => {
    if (selectionMode) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`group overflow-hidden rounded-lg border ${
        isSelected ? "border-primary" : "border-muted"
      } ${selectionMode ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <div className="relative">
        <Link href={`/analysis/${analysis.id}`} onClick={handleClick}>
          <Image
            src={`http://localhost/static/analysis/img/${thumbnail}.jpg`}
            width={300}
            height={200}
            alt="Analysis Thumbnail Image"
            className={`h-full w-full object-cover transition-all duration-300 ${
              selectionMode ? "" : "group-hover:scale-105"
            }`}
            style={{ aspectRatio: "300/200", objectFit: "cover" }}
          />
        </Link>
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/70 ${
            isSelected ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ${
            selectionMode ? "" : "group-hover:opacity-100"
          }`}
        ></div>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2">
          {analysis.title}
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          {analysis.seriesAnalysis && <p>Series: {analysis.seriesAnalysis}</p>}
          <p>Played: {formatted_played_date}</p>
          <p>
            Teams: {analysis.teamOne} vs {analysis.teamTwo}
          </p>
        </div>
      </div>
    </div>
  );
}
