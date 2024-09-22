"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format, formatDate } from "date-fns";

import { CalendarDays } from "lucide-react";

export default function CreateForm() {
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    let title = formRef.current.title.value;
    let formattedDate = convertDateFormat(date).toString();
    await fetch("http://localhost:8000/api/create_analysis", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        play_date: formattedDate,
      }),
    });

    setModalOpen(false);
    router.refresh();
  }

  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    return date.toISOString();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">New Analysis</Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Create a new analysis</DialogTitle>
          <DialogDescription>
            <form ref={formRef} action="">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title of Analysis</Label>
                  <Input id="title" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">Played date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button variant="outline" type="button" onClick={handleSubmit}>
                  Create
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
