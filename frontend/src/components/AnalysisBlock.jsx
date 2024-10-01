import Link from "next/link";

import formatDate from "../../utils/dateHandling";

export default function AnalysisBlock({ analysis }) {
  let formatted_played_date = formatDate(analysis.played_date);
  return (
    <div className="group relative overflow-hidden rounded-lg border border-muted">
      <Link
        href={{
          pathname: `/analysis/${analysis.id}`,
          query: { analysis: JSON.stringify(analysis) },
        }}
        className="absolute inset-0 z-10"
        prefetch={false}
      />
      <img
        src={`http://localhost/static/analysis/img/${analysis.map}.jpg`}
        width={300}
        height={200}
        alt="Analysis Thumbnail Image"
        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        style={{ aspectRatio: "300/200", objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-black/70 p-4 transition-all duration-300 group-hover:bg-black/50">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {analysis.title}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted">
              {formatted_played_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
