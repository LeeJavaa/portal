import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCustomAnalysis,
  deleteMapAnalysis,
  deleteSeriesAnalysis,
} from "@/api/analysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleAlert, Trash2 } from "lucide-react";

export default function DeleteDialog({ id, seriesAnalysis, customAnalysis }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      if (seriesAnalysis) {
        await deleteSeriesAnalysis;
      } else if (customAnalysis) {
        await deleteCustomAnalysis;
      } else {
        await deleteMapAnalysis(id);
      }
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const onOpenChange = (open) => {
    setIsOpen(open);
    if (!open) setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this analysis?
          </DialogTitle>
          <DialogDescription>
            Deleting this analysis means you will need to recreate it in order
            to see this data again.
          </DialogDescription>
        </DialogHeader>
        <CircleAlert className="w-32 h-32 mx-auto" />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to delete analysis: {error}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter className="flex gap-x-2 justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
