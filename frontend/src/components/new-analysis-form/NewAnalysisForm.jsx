"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getPresignedUploadUrl,
  initiateScoreboardProcessing,
  uploadScoreboardToS3,
  checkScoreboardProcessingStatus,
  createMapAnalysis,
} from "@/api/newAnalysisForm";
import FormHeader from "@/components/new-analysis-form/FormHeader";
import UploadDisplay from "@/components/new-analysis-form/UploadDisplay";
import LoadingRedirect from "./LoadingRedirect";
import ProcessingDisplay from "@/components/new-analysis-form/ProcessingDisplay";
import GameDataDisplay from "@/components/new-analysis-form/GameDataDisplay";
import ScoreboardDisplay from "@/components/new-analysis-form/ScoreboardDisplay";
import AnalysisData from "@/components/new-analysis-form/AnalysisData";
import CloseDisplay from "@/components/new-analysis-form/CloseDisplay";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateUniqueFileName } from "@/utils/fileHandling";
import { analysisSchema } from "@/validators/newAnalysis.ts";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

export default function NewAnalysisForm() {
  const [formStep, setFormStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [scoreboard, setScoreboard] = useState(null);
  const [scoreboardFileName, setScoreboardFileName] = useState("");
  const [scoreboardData, setScoreboardData] = useState(null);
  const [isScoreboardUploading, setIsScoreboardUploading] = useState(false);
  const [scoreboardProcessed, setScoreboardProcessed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

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
      scoreboard_file_name: "",
      playerStats: {},
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setScoreboard(null);
    setScoreboardFileName("");
    setScoreboardProcessed(false);
    setScoreboardData(null);
    setFormStep(0);
    setScoreboardUploadError("");
  }, [form]);

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

  const removeStatsConfidence = (playerStats) => {
    return playerStats.map((player) => {
      const transformedPlayer = {};
      for (const [key, value] of Object.entries(player)) {
        if (Array.isArray(value) && value.length === 2) {
          transformedPlayer[key] = value[0];
        } else {
          transformedPlayer[key] = value;
        }
      }
      return transformedPlayer;
    });
  };

  const handleScoreboardProcessing = async () => {
    if (!scoreboard) return;
    setIsScoreboardUploading(true);
    setScoreboardUploadError("");

    let url, fields, taskId;

    try {
      const uniqueFileName = generateUniqueFileName(scoreboard.name);
      setScoreboardFileName(uniqueFileName);

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

  const onSubmit = async () => {
    setIsSubmitting(true);
    setScoreboardUploadError("");

    form.setValue("scoreboard_file_name", scoreboardFileName);

    const result = await form.trigger([
      "title",
      "tournament",
      "played_date",
      "scoreboard_file_name",
    ]);

    if (!result) {
      setIsSubmitting(false);
      return;
    }

    const formData = form.getValues();

    if (formData.player_stats) {
      formData.player_stats = removeStatsConfidence(formData.player_stats);
    }

    try {
      const response = await createMapAnalysis(formData);

      router.push(`/analysis/map/${response.id}`);

      setIsSubmitting(false);
      setModalOpen(false);
      setIsRedirecting(true);
      setScoreboardUploadError("");
      resetForm();
    } catch (error) {
      setIsSubmitting(false);

      if (error.message.includes("timeout")) {
        setScoreboardUploadError("Request timed out. Please try again.");
      } else if (error.message.includes("validation")) {
        setScoreboardUploadError(
          "Please check all fields are filled correctly."
        );
      } else {
        setScoreboardUploadError(
          "Failed to create analysis. Please try again."
        );
      }
    }
  };

  return (
    <div>
      <LoadingRedirect isLoading={isRedirecting} />
      <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </DialogTrigger>
        <DialogContent
          className={
            formStep == 3 && !confirmCloseOpen ? "max-w-screen-2xl" : ""
          }
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
                  handleSubmit={onSubmit}
                  setFormStep={setFormStep}
                  error={scoreboardUploadError}
                />
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
