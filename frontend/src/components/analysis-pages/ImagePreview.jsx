import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image as ImageIcon } from "lucide-react";

export default function ImagePreview({ screenshot, scoreboardUrl }) {
  if (!screenshot) return null;

  return (
    <Dialog>
      <DialogTrigger className="hover:underline">View Original</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Original Scoreboard Screenshot</DialogTitle>
          <DialogDescription>For your viewing pleasure</DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-video">
          {scoreboardUrl ? (
            <>
              <Image
                src={scoreboardUrl}
                alt="Original Scoreboard"
                className="rounded-lg object-contain"
                fill
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
                unoptimized
              />
              <ImageIcon
                className="w-32 h-32 mx-auto hidden"
                aria-label="Image failed to load"
              />
            </>
          ) : (
            <ImageIcon className="w-32 h-32 mx-auto" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
