"use client";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { analysisSchema } from "@/validators/newAnalysis.ts";

import { cn } from "@/lib/utils";

import { CalendarDays, ArrowRight } from "lucide-react";

export default function CreateForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);

  const form = useForm({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      played_date: "",
      input_file: "",
      title: "",
      map: "",
      game_mode: "",
      start_time: 0.0,
      team_one: "",
      team_two: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
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
            Fill in the information below to create a new gameplay analysis
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div
              className={cn("space-y-3", {
                hidden: formStep != 0,
              })}
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="FaZe vs OpTic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Played Date */}
              <FormField
                control={form.control}
                name="played_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Pick a date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input File */}
              <FormField
                control={form.control}
                name="input_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="faze_optic_rio_2024_08_23"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={cn("space-y-3", {
                hidden: formStep != 1,
              })}
            >
              {/* Map */}
              <FormField
                control={form.control}
                name="map"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map</FormLabel>
                    <FormControl>
                      <Input placeholder="Select a map" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Game Mode */}
              <FormField
                control={form.control}
                name="game_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Mode</FormLabel>
                    <FormControl>
                      <Input placeholder="Select a game mode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Start Time */}
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input placeholder="20 seconds" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={cn("space-y-3", {
                hidden: formStep != 2,
              })}
            >
              {/* Team One */}
              <FormField
                control={form.control}
                name="team_one"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team One</FormLabel>
                    <FormControl>
                      <Input placeholder="Select a team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Team Two */}
              <FormField
                control={form.control}
                name="team_two"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Two</FormLabel>
                    <FormControl>
                      <Input placeholder="Select a team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className={cn({
                  hidden: formStep != 2,
                })}
              >
                Submit
              </Button>
              <Button
                type="button"
                className={cn({
                  hidden: formStep == 2,
                })}
                variant={"ghost"}
                onClick={() => {
                  if (formStep == 0) {
                    form.trigger(["title", "played_date", "input_file"]);
                    const titleState = form.getFieldState("title");
                    const playedDateState = form.getFieldState("played_date");
                    const inputFileState = form.getFieldState("input_file");
                    if (!titleState.isDirty || titleState.invalid) {
                      return;
                    }
                    if (!playedDateState.isDirty || playedDateState.invalid) {
                      return;
                    }
                    if (!inputFileState.isDirty || inputFileState.invalid) {
                      return;
                    }
                    setFormStep(1);
                  } else if (formStep == 1) {
                    form.trigger(["map", "game_mode", "start_time"]);
                    const mapState = form.getFieldState("map");
                    const gameModeState = form.getFieldState("game_mode");
                    const startTimeState = form.getFieldState("start_time");
                    if (!mapState.isDirty || mapState.invalid) {
                      return;
                    }
                    if (!gameModeState.isDirty || gameModeState.invalid) {
                      return;
                    }
                    if (!startTimeState.isDirty || startTimeState.invalid) {
                      return;
                    }
                    setFormStep(2);
                  } else {
                    //pass
                  }
                }}
              >
                Next step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                className={cn({
                  hidden: formStep == 0,
                })}
                variant={"ghost"}
                onClick={() => {
                  if (formStep == 1) {
                    setFormStep(0);
                  } else if (formStep == 2) {
                    setFormStep(1);
                  } else {
                    //pass
                  }
                }}
              >
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
