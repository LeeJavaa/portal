import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Cpu, Image as ImageIcon, Loader, Upload } from "lucide-react";

export default function UploadDisplay({
  scoreboard,
  onChange,
  onProcess,
  isUploading,
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {!scoreboard ? (
        <ImageIcon className="h-24 w-24 text-muted-foreground" />
      ) : (
        <Image
          src={URL.createObjectURL(scoreboard)}
          height={400}
          width={400}
          className="w-auto"
          alt="Scoreboard preview"
        />
      )}
      <div className="flex flex-row justify-center space-x-6">
        <label
          htmlFor="scoreboardInput"
          className="cursor-pointer h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Scoreboard
        </label>
        <Input
          id="scoreboardInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
        <Button
          disabled={!scoreboard || isUploading}
          onClick={onProcess}
          type="button"
        >
          {isUploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Cpu className="mr-2 h-4 w-4" />
              Process Scoreboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
