import Link from "next/link";
import Image from "next/image";

export default function CustomAnalysisBlock({ analysis }) {
  return (
    <Link
      href={`/analysis/custom/${analysis.id}`}
      className="group overflow-hidden *:border-muted"
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={`http://localhost/static/analysis/img/${analysis.thumbnail}.jpg`}
          width={300}
          height={150}
          alt="Analysis Thumbnail Image"
          className="h-full w-full rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
          style={{ aspectRatio: "300/150", objectFit: "cover" }}
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
