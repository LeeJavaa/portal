import Link from "next/link";

export default function AnalysisBlock({ title, play_date }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-muted dark:border-muted-foreground">
      <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
        <span className="sr-only">View gallery item</span>
      </Link>
      <img
        src="/media/bear.jpg"
        width={300}
        height={300}
        alt="Gallery item"
        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        style={{ aspectRatio: "300/300", objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-black/70 p-4 transition-all duration-300 group-hover:bg-black/50">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-muted-foreground dark:text-muted">
              {play_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
