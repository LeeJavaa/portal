import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleAlert,
  ChartNoAxesColumnIncreasing,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex justify-between mt-8">
      <div className="flex gap-x-2 items-center">
        <ChartNoAxesColumnIncreasing className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Visualise the Data</h1>
      </div>
      <div className="flex gap-x-5">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ot">OpTic Texas</SelectItem>
            <SelectItem value="nysl">New York Subliners</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Player" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kenny">Kenny</SelectItem>
            <SelectItem value="Dashy">Dashy</SelectItem>
            <SelectItem value="Shotzzy">Shotzzy</SelectItem>
            <SelectItem value="Pred">Pred</SelectItem>
            <SelectItem value="Hydra">Hydra</SelectItem>
            <SelectItem value="Sib">Sib</SelectItem>
            <SelectItem value="Skyz">Skyz</SelectItem>
            <SelectItem value="Kismet">Kismet</SelectItem>
          </SelectContent>
        </Select>
        <Button>Apply Filter</Button>
      </div>
      <div className="flex gap-x-5">
        <Dialog>
          <DialogTrigger className="hover:underline">
            View Original
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Original Scoreboard Screenshot</DialogTitle>
              <DialogDescription>Behold your eyes on heaven,</DialogDescription>
            </DialogHeader>
            <ImageIcon className="w-32 h-32 mx-auto" />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild className="hover:underline">
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
                Deleting this analysis means you will need to recreate it in
                order to see this data again.
              </DialogDescription>
            </DialogHeader>
            <CircleAlert className="w-32 h-32 mx-auto" />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
