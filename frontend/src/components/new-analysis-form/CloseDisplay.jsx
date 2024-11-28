import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

export default function CloseDisplay({ onClose, onCancel }) {
  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <CircleAlert className="h-24 w-24 text-destructive" />
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={onClose}>
          Close
        </Button>
        <Button type="button" variant={"ghost"} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
}
