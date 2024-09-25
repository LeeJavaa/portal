"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { analysisSchema } from "@/validators/newAnalysis.ts";

import { cn } from "@/lib/utils";

import { CalendarDays, ArrowRight, Loader } from "lucide-react";

export default function CreateForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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

  async function onSubmit(data) {
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      played_date: new Date(data.played_date).toISOString(),
      start_time: parseFloat(data.start_time),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/create_analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create analysis");
      }

      const result = await response.json();
      console.log("Analysis created successfully:", result);
    } catch (error) {
      console.error("Error creating analysis:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
    }
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the map this was played on" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6 star">6 Star</SelectItem>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="rio">Rio</SelectItem>
                        <SelectItem value="sub base">Sub Base</SelectItem>
                        <SelectItem value="vista">Vista</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the game mode of this game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hardpoint">Hardpoint</SelectItem>
                        <SelectItem value="snd">SND</SelectItem>
                        <SelectItem value="control">Control</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="3.142" {...field} />
                    </FormControl>
                    <FormDescription>
                      How far into the VOD did the actual game start?
                    </FormDescription>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the game mode of this game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="atlanta faze">
                          Atlanta FaZe
                        </SelectItem>
                        <SelectItem value="optic texas">OpTic Texas</SelectItem>
                        <SelectItem value="nysl">New York Subliners</SelectItem>
                        <SelectItem value="toronto ultra">
                          Toronto Ultra
                        </SelectItem>
                        <SelectItem value="lat">LA Thieves</SelectItem>
                        <SelectItem value="vancouver surge">
                          Vancouver Surge
                        </SelectItem>
                        <SelectItem value="miami heretics">
                          Miami Heretics
                        </SelectItem>
                        <SelectItem value="minnesota rokkr">
                          Minnesota Rokkr
                        </SelectItem>
                        <SelectItem value="lag">
                          Los Angeles Guerrillas
                        </SelectItem>
                        <SelectItem value="royal ravens">
                          Carolina Royal Ravens
                        </SelectItem>
                        <SelectItem value="boston breach">
                          Boston Breach
                        </SelectItem>
                        <SelectItem value="vegas falcons">
                          Vegas Falcons
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the game mode of this game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="atlanta faze">
                          Atlanta FaZe
                        </SelectItem>
                        <SelectItem value="optic texas">OpTic Texas</SelectItem>
                        <SelectItem value="nysl">New York Subliners</SelectItem>
                        <SelectItem value="toronto ultra">
                          Toronto Ultra
                        </SelectItem>
                        <SelectItem value="lat">LA Thieves</SelectItem>
                        <SelectItem value="vancouver surge">
                          Vancouver Surge
                        </SelectItem>
                        <SelectItem value="miami heretics">
                          Miami Heretics
                        </SelectItem>
                        <SelectItem value="minnesota rokkr">
                          Minnesota Rokkr
                        </SelectItem>
                        <SelectItem value="lag">
                          Los Angeles Guerrillas
                        </SelectItem>
                        <SelectItem value="royal ravens">
                          Carolina Royal Ravens
                        </SelectItem>
                        <SelectItem value="boston breach">
                          Boston Breach
                        </SelectItem>
                        <SelectItem value="vegas falcons">
                          Vegas Falcons
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn({
                  hidden: formStep != 2,
                })}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
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
