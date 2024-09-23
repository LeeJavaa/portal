import Link from "next/link";

import formatDate from "../../utils/dateHandling";

export default function AnalysisBlock({ analysis_id, title, played_date }) {
  let formated_played_date = formatDate(played_date);
  return (
    <div className="group relative overflow-hidden rounded-lg border border-muted">
      <Link
        href={`/analysis/${analysis_id}`}
        className="absolute inset-0 z-10"
        prefetch={false}
      />
      <img
        src="/media/bear.jpg"
        width={300}
        height={300}
        alt="Analysis Thumbnail Image"
        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        style={{ aspectRatio: "300/300", objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-black/70 p-4 transition-all duration-300 group-hover:bg-black/50">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            <p className="text-sm text-muted-foreground dark:text-muted">
              {formated_played_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
