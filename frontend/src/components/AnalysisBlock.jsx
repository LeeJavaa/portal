import Link from "next/link";
import formatDate from "../../utils/dateHandling";

export default function AnalysisBlock({ analysis }) {
  let formatted_played_date = formatDate(analysis.playedDate);

  return (
    <div className="group overflow-hidden rounded-lg border border-muted">
      <div className="relative">
        <Link href={`/analysis/${analysis.id}`}>
          <img
            src={`http://localhost/static/analysis/img/${analysis.map}.jpg`}
            width={300}
            height={200}
            alt="Analysis Thumbnail Image"
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            style={{ aspectRatio: "300/200", objectFit: "cover" }}
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2">
          {analysis.title}
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          {analysis.seriesAnalysis && (
            <p>Series: {analysis.seriesAnalysis}</p>
          )}
          <p>Played: {formatted_played_date}</p>
          <p>Teams: {analysis.teamOne} vs {analysis.teamTwo}</p>
        </div>
      </div>
    </div>
  );
}