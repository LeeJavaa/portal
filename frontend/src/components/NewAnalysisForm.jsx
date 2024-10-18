"use client";
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { analysisSchema } from "@/validators/newAnalysis.ts";

import { Plus } from "lucide-react";
import FormHeader from "./new-analysis-form/FormHeader";
import UploadDisplay from "./new-analysis-form/UploadDisplay";
import ProgressDisplay from "./new-analysis-form/ProgressDisplay";
import GameDataDisplay from "./new-analysis-form/GameDataDisplay";
import ScoreboardDisplay from "./new-analysis-form/ScoreboardDisplay";
import AnalysisData from "./new-analysis-form/AnalysisData";
import CloseDisplay from "./new-analysis-form/CloseDisplay";
import { generateUniqueFileName } from "@/utils/fileHandling";
import {
  getPresignedUploadUrl,
  initiateScoreboardProcessing,
  uploadScoreboardToS3,
} from "@/api/newAnalysisForm";

export default function NewAnalysisForm() {
  const [formStep, setFormStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [scoreboard, setScoreboard] = useState(null);
  const [isScoreboardUploading, setIsScoreboardUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [scoreboardProcessed, setScoreboardProcessed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      game_mode: "",
      map: "",
      team_one: "",
      team_one_score: "",
      team_two: "",
      team_two_score: "",
      title: "",
      played_date: "",
      tournament: "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setScoreboard(null);
    setScoreboardProcessed(false);
    setFormStep(0);
  }, [form, scoreboardProcessed, scoreboard]);

  const handleScoreboardChange = (e) => {
    e.preventDefault();
    const scoreboardFile = e.target.files[0];
    const allowedScoreboardFileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (
      scoreboardFile &&
      allowedScoreboardFileTypes.includes(scoreboardFile.type)
    ) {
      setScoreboard(scoreboardFile);
    } else {
      setScoreboard(null);
    }
  };

  const handleScoreboardProcessing = async () => {
    if (!scoreboard) return;
    setIsScoreboardUploading(true);
    try {
      const uniqueFileName = generateUniqueFileName(scoreboard.name);
      const { url, fields } = await getPresignedUploadUrl(
        uniqueFileName,
        scoreboard.type
      );
      await uploadScoreboardToS3(url, fields, scoreboard);
      const processingResult = await initiateScoreboardProcessing(
        uniqueFileName
      );
      console.log(processingResult);
    } catch (error) {
      console.error("Error processing scoreboard:", error);
    } finally {
      setIsScoreboardUploading(false);
    }

    setFormStep(1);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setScoreboardProcessed(true);
        setFormStep(2);
        setProcessingProgress(0);
      }
    }, 30);
  };

  const handleDialogChange = useCallback(
    (open) => {
      if (
        (!open && form.formState.isDirty) ||
        (!open && scoreboard) ||
        (!open && scoreboardProcessed)
      ) {
        setConfirmCloseOpen(true);
      } else {
        setModalOpen(open);
      }
    },
    [form, scoreboard, scoreboardProcessed]
  );

  const handleConfirmClose = () => {
    setModalOpen(false);
    setConfirmCloseOpen(false);
    resetForm();
  };

  const handleCancelClose = () => {
    setConfirmCloseOpen(false);
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
      <DialogContent
        className={formStep == 3 && !confirmCloseOpen ? "max-w-screen-2xl" : ""}
      >
        <FormHeader confirmCloseOpen={confirmCloseOpen} formStep={formStep} />
        {confirmCloseOpen && (
          <CloseDisplay
            closeModalOpen={confirmCloseOpen}
            onClose={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        )}
        {formStep == 0 && !confirmCloseOpen && (
          <UploadDisplay
            scoreboard={scoreboard}
            onChange={handleScoreboardChange}
            onProcess={handleScoreboardProcessing}
            isUploading={isScoreboardUploading}
          />
        )}
        {formStep == 1 && !confirmCloseOpen && (
          <ProgressDisplay progress={processingProgress} />
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {formStep == 2 && !confirmCloseOpen && (
              <GameDataDisplay form={form} setFormStep={setFormStep} />
            )}
            {formStep == 3 && !confirmCloseOpen && (
              <ScoreboardDisplay setFormStep={setFormStep} />
            )}
            {formStep == 4 && !confirmCloseOpen && (
              <AnalysisData
                form={form}
                isSubmitting={isSubmitting}
                setFormStep={setFormStep}
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
