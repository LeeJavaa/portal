export default async function Page({ params }) {
  let data = await fetch(`http://localhost:8000/api/analysis/${params.id}`, {
    cache: "no-store",
  });
  let analysis = await data.json();

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 md:px-6 py-12">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden aspect-video">
        <video
          className="w-full h-full object-cover"
          controls
          poster="/media/breakingbad.jpg"
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </main>
  );
}
