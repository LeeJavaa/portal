import Link from "next/link";

export default function CustomAnalysisBlock({ analysis }) {
  return (
    <Link
      href={`/analysis/custom/${analysis.id}`}
      className="group overflow-hidden *:border-muted"
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="h-[180px] w-full rounded-lg "
          style={{
            background: `linear-gradient(135deg, #${analysis.thumbnail_color} 0%, #${analysis.thumbnail_color}77 100%)`,
          }}
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-primary mb-1">
          {analysis.title}
        </h3>
      </div>
    </Link>
  );
}
