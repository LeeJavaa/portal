"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import formatDate from "../../../../utils/dateHandling";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  CalendarDays,
  Map,
  Flag,
} from "lucide-react";

export default function Page({ params }) {
  const searchParams = useSearchParams();
  const analysisParam = searchParams.get("analysis");
  const analysis = analysisParam ? JSON.parse(analysisParam) : null;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipFrames = (frames) => {
    const frameTime = 1 / 30; // Assuming 30 fps
    videoRef.current.currentTime += frames * frameTime;
  };

  const skipSeconds = (seconds) => {
    videoRef.current.currentTime += seconds;
  };

  if (!analysis) return <div>No analysis data available</div>;

  let formatted_played_date = formatDate(analysis.played_date);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 md:px-6 py-12">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          poster="/media/breakingbad.jpg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source
            src="/media/optic_nysl_karachi_2024_07_21.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="w-full max-w-4xl space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{analysis.title}</h1>
          <div className="flex space-x-4 mt-4">
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={() => skipSeconds(-5)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                <SkipBack size={24} />
              </Button>
              <span className="text-center text-[9px]">5 seconds</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={() => skipFrames(-10)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                <SkipBack size={24} />
              </Button>
              <span className="text-center text-[9px]">10 frames</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={togglePlayPause}
                className="px-4 py-1 bg-orange-700 hover:bg-orange-400 text-white rounded"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              <span className="text-center text-[9px]">play / pause</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={() => skipFrames(10)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                <SkipForward size={24} />
              </Button>
              <span className="text-center text-[9px]">10 frames</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={() => skipSeconds(5)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                <SkipForward size={24} />
              </Button>
              <span className="text-center text-[9px]">5 seconds</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex gap-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>{formatted_played_date}</span>
          </div>
          <div className="flex gap-x-2">
            <Map className="w-5 h-5" />
            <span>{analysis.map}</span>
          </div>
          <div className="flex gap-x-2">
            <Flag className="w-5 h-5" />
            <span>T1: {analysis.team_one}</span>
          </div>
          <div className="flex gap-x-2">
            <Flag className="w-5 h-5" />
            <span>T2: {analysis.team_two}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
