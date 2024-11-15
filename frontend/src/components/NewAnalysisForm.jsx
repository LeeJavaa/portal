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
import ProcessingDisplay from "./new-analysis-form/ProcessingDisplay";
import GameDataDisplay from "./new-analysis-form/GameDataDisplay";
import ScoreboardDisplay from "./new-analysis-form/ScoreboardDisplay";
import AnalysisData from "./new-analysis-form/AnalysisData";
import CloseDisplay from "./new-analysis-form/CloseDisplay";
import { generateUniqueFileName } from "@/utils/fileHandling";
import {
  getPresignedUploadUrl,
  initiateScoreboardProcessing,
  uploadScoreboardToS3,
  checkScoreboardProcessingStatus,
} from "@/api/newAnalysisForm";

export default function NewAnalysisForm() {
  const [formStep, setFormStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [scoreboard, setScoreboard] = useState(null);
  const [scoreboardData, setScoreboardData] = useState(null);
  const [isScoreboardUploading, setIsScoreboardUploading] = useState(false);
  const [scoreboardProcessed, setScoreboardProcessed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Error messages
  const [scoreboardUploadError, setScoreboardUploadError] = useState("");

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
    setScoreboardData(null);
    setFormStep(0);
    setScoreboardUploadError("");
  }, [
    form,
    scoreboardProcessed,
    scoreboard,
    scoreboardData,
    scoreboardUploadError,
  ]);

  const handleScoreboardChange = async (e) => {
    e.preventDefault();
    const scoreboardFile = e.target.files[0];

    if (!scoreboardFile) return;

    try {
      await validateImage(scoreboardFile);
      setScoreboard(scoreboardFile);
      setScoreboardUploadError("");
    } catch (err) {
      setScoreboardUploadError(err);
      setScoreboard(null);
      e.target.value = "";
    }
  };

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const allowedScoreboardFileTypes = ["image/jpeg", "image/png"];

      if (!allowedScoreboardFileTypes.includes(file.type)) {
        reject("Please upload a valid image file (JPEG or PNG)");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width === 1920 && img.height === 1080) {
          resolve(file);
        } else {
          reject("Image must be exactly 1920x1080 pixels");
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject("Failed to load image");
      };
    });
  };

  const handleScoreboardProcessing = async () => {
    if (!scoreboard) return;
    setIsScoreboardUploading(true);
    setScoreboardUploadError("");

    let url, fields, taskId;

    try {
      const uniqueFileName = generateUniqueFileName(scoreboard.name);

      try {
        const response = await getPresignedUploadUrl(uniqueFileName);
        url = response.url;
        fields = response.fields;
      } catch (error) {
        setScoreboardUploadError(
          "Can't authorise this upload. Please try again."
        );
        return;
      }

      try {
        await uploadScoreboardToS3(url, fields, scoreboard);
      } catch (error) {
        if (error.message.includes("413")) {
          setScoreboardUploadError(
            "File is too large. Please upload a smaller image."
          );
        } else if (error.message.includes("403")) {
          setScoreboardUploadError(
            "Upload authorization expired. Please try again."
          );
        } else {
          setScoreboardUploadError("Failed to upload image. Please try again.");
        }
        return;
      }

      try {
        const response = await initiateScoreboardProcessing(uniqueFileName);
        taskId = response.task_id;
      } catch (error) {
        setScoreboardUploadError(
          "Failed to begin scoreboard processing. Please try again."
        );
        return;
      }

      setFormStep(1);
      const pollInterval = setInterval(async () => {
        try {
          const response = await checkScoreboardProcessingStatus(taskId);

          if (response.status === "completed") {
            clearInterval(pollInterval);
            setScoreboardProcessed(true);
            setScoreboardData(response.data);
            setFormStep(2);
          } else if (response.status === "failed") {
            clearInterval(pollInterval);
            setFormStep(0);
            setScoreboardUploadError("Processing failed. Please try again.");
          }
        } catch (error) {
          clearInterval(pollInterval);
          setFormStep(0);
          setScoreboardUploadError("Processing failed. Please try again.");
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    } catch (error) {
      setScoreboardUploadError(
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsScoreboardUploading(false);
    }
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
        setScoreboardUploadError("");
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
            error={scoreboardUploadError}
          />
        )}
        {formStep == 1 && !confirmCloseOpen && <ProcessingDisplay />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {formStep == 2 && !confirmCloseOpen && (
              <GameDataDisplay
                form={form}
                setFormStep={setFormStep}
                data={scoreboardData}
              />
            )}
            {formStep == 3 && !confirmCloseOpen && (
              <ScoreboardDisplay
                form={form}
                setFormStep={setFormStep}
                data={scoreboardData}
              />
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
