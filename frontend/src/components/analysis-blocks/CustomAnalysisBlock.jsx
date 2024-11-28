import Link from "next/link";

export default function CustomAnalysisBlock({ analysis }) {
  const generateRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <Link
      href={`/analysis/custom/${analysis.id}`}
      className="group overflow-hidden *:border-muted"
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="w-full rounded-lg transition-all duration-300 group-hover:scale-105"
          style={{
            backgroundColor: generateRandomPastelColor(),
            height: "150px",
            aspectRatio: "300/150",
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
