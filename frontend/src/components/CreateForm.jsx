"use client";
import { useState, useCallback } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DateTimePicker } from "./ui/datetime-picker";
import { useToast } from "@/hooks/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { analysisSchema } from "@/validators/newAnalysis.ts";

import { cn } from "@/lib/utils";

import {
  ArrowRight,
  CircleAlert,
  Image as ImageIcon,
  Loader,
  Plus,
  Upload,
} from "lucide-react";

export default function CreateForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formStepHistory, setFormStepHistory] = useState(0);
  const [scoreboardUploaded, setScoreboardUploaded] = useState(false);
  const [scoreboardProcessed, setScoreboardProcessed] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(66);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      title: "",
      played_date: "",
      tournament: "",
    },
  });

  // New function to reset the form and step
  const resetForm = useCallback(() => {
    form.reset();
    setScoreboardUploaded(false);
    setScoreboardProcessed(false);
    setFormStep(0);
    setFormStepHistory(0);
  }, [form, scoreboardProcessed, scoreboardUploaded]);

  const handleScoreboardUpload = () => {
    setScoreboardUploaded(true);
  };

  const handleScoreboardProcessing = () => {
    setScoreboardProcessed(true);
    setFormStep(1);
    setFormStepHistory(1);
  };

  // Updated function to handle dialog state change
  const handleDialogChange = useCallback(
    (open) => {
      if (
        (!open && form.formState.isDirty) ||
        (!open && scoreboardUploaded) ||
        (!open && scoreboardProcessed)
      ) {
        setFormStep(-1);
      } else {
        setModalOpen(open);
      }
    },
    [form, scoreboardUploaded, scoreboardProcessed]
  );

  const handleConfirmClose = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleCancelClose = () => {
    setFormStep(formStepHistory);
  };

  async function onSubmit(data) {
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      played_date: new Date(data.played_date).toISOString(),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minutes

      const response = await fetch("http://localhost/api/create_analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create analysis");
      }

      window.location.reload();
    } catch (error) {
      if (error.name === "AbortError") {
        toast({
          title: "Error",
          description:
            "The request timed out after 5 minutes. Please try again.",
          variant: "destructive",
          duration: Infinity,
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: Infinity,
        });
      }
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
      resetForm();
    }
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className={formStep == 2 ? "max-w-screen-2xl" : ""}>
        <DialogHeader>
          <DialogTitle>
            {formStep != -1 ? (
              "Create a new analysis"
            ) : (
              <span className="">Are you sure you want to close?</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {formStep != -1
              ? "Follow these steps to create a new analysis"
              : "If you close this form, you'll lose all entered data. Is that what you want to do?"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div
              className={cn("flex flex-col items-center space-y-4", {
                hidden: formStep != -1,
              })}
            >
              <CircleAlert className="h-24 w-24 text-destructive" />
            </div>
            <div
              className={cn("flex flex-col items-center space-y-4", {
                hidden: formStep != 0,
              })}
            >
              <ImageIcon className="h-24 w-24 text-muted-foreground" />
              <div className="flex flex-row justify-center space-x-6">
                <Button onClick={handleScoreboardUpload} type="button">
                  <Upload className="mr-2 h-4 w-4" /> Upload Scoreboard
                </Button>
                <Button
                  disabled={!scoreboardUploaded}
                  onClick={handleScoreboardProcessing}
                  type="button"
                >
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Process Scoreboard
                </Button>
              </div>
            </div>
            <div
              className={cn("flex flex-col items-center space-y-4", {
                hidden: formStep != 1,
              })}
            >
              <Progress value={processingProgress} className="w-full" />
              <Alert>
                <AlertTitle>Hold on!</AlertTitle>
                <AlertDescription>
                  We're just busy processing that scoreboard real quick
                </AlertDescription>
              </Alert>
            </div>
            <div
              className={cn("flex flex-col items-center space-y-4", {
                hidden: formStep != 2,
              })}
            >
              <Alert variant="destructive">
                <AlertTitle>Can you fix this for us?</AlertTitle>
                <AlertDescription>
                  Some data couldn't be processed correctly. Please fill it in
                  correctly.
                </AlertDescription>
              </Alert>
              <Table>
                <TableCaption>Scoreboard awaiting confirmation</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px] border-r relative flex">
                      <Input className=" w-2/3" defaultValue="OpTic Texas" />
                      <Input
                        className="absolute right-5 w-[55px]"
                        defaultValue="250"
                      />
                    </TableHead>
                    <TableHead className="text-center">Kills/Deaths</TableHead>
                    <TableHead className="text-center">Assists</TableHead>
                    <TableHead className="text-center">
                      Non-Traded Kills
                    </TableHead>
                    <TableHead className="text-center">
                      Highest Streak
                    </TableHead>
                    <TableHead className="text-center border-r">
                      Damage
                    </TableHead>
                    <TableHead className="text-right">Hill Time</TableHead>
                    <TableHead className="text-right">
                      Average Hill Time
                    </TableHead>
                    <TableHead className="text-right">
                      Objective Kills
                    </TableHead>
                    <TableHead className="text-right">
                      Contested Hill Time
                    </TableHead>
                    <TableHead className="text-right">Kills per hill</TableHead>
                    <TableHead className="text-right">
                      Damage per hill
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium border-r w-[250px]">
                      <Input defaultValue="Kenny" className="" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue="29/19" className="w-[65px]" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue="6" className="w-[45px]" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue="23" className="w-[45px]" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue="2" className="w-[45px]" />
                    </TableCell>
                    <TableCell className="text-center border-r">
                      <Input defaultValue="5173" className="w-[70px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input defaultValue="0:53" className="w-[60px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input defaultValue="0:04" className="w-[60px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input defaultValue="5" className="w-[55px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input defaultValue="0:04" className="w-[60px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input defaultValue="2.45" className="w-[60px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        defaultValue="436.81"
                        className="w-[60px] border-destructive"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground font-medium w-[250px] relative flex">
                      <Input
                        className=" w-2/3"
                        defaultValue="New York Subliners"
                      />
                      <Input
                        className="absolute right-5 w-[55px]"
                        defaultValue="250"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium border-r">
                      KENNY
                    </TableCell>
                    <TableCell className="text-center">29/19</TableCell>
                    <TableCell className="text-center">6</TableCell>
                    <TableCell className="text-center">23</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center border-r">5173</TableCell>
                    <TableCell className="text-right">0:53</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell className="text-right">0:04</TableCell>
                    <TableCell className="text-right">2.45</TableCell>
                    <TableCell className="text-right">436.81</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div
              className={cn("space-y-3", {
                hidden: formStep != 3,
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
                      <Input
                        placeholder="OpTic vs NYSL Champs GF Map 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Tournament */}
              <FormField
                control={form.control}
                name="tournament"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="What tourny was this?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">
                          Call of Duty Champs 2024
                        </SelectItem>
                        <SelectItem value="4">Major IV Finals</SelectItem>
                        <SelectItem value="3">Major III Finals</SelectItem>
                        <SelectItem value="2">Major II Finals</SelectItem>
                        <SelectItem value="1">Major I Finals</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
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
                  hidden: formStep != 3,
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
                  hidden: !(formStep == 1 || formStep == 2),
                })}
                variant={"ghost"}
                onClick={() => {
                  // Just a placeholder for now
                  if (formStep == 1) {
                    setFormStep(2);
                    setFormStepHistory(2);
                  }

                  if (formStep == 2) {
                    setFormStep(3);
                    setFormStepHistory(3);
                  }
                }}
              >
                Next step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                className={cn({
                  hidden: formStep < 2,
                })}
                variant={"ghost"}
                onClick={() => {
                  if (formStep == 2) {
                    setFormStep(0);
                    setFormStepHistory(0);
                  }

                  if (formStep == 3) {
                    setFormStep(2);
                    setFormStepHistory(2);
                  }
                }}
              >
                Go back
              </Button>
              <Button
                type="button"
                className={cn({
                  hidden: formStep != -1,
                })}
                onClick={handleConfirmClose}
              >
                Confirm
              </Button>
              <Button
                type="button"
                className={cn({
                  hidden: formStep != -1,
                })}
                variant={"ghost"}
                onClick={handleCancelClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
