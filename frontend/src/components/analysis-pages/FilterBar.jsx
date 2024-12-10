"use client";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteDialog from "@/components/analysis-pages/DeleteDialog";
import ImagePreview from "@/components/analysis-pages/ImagePreview";
import PlayerSelect from "@/components/analysis-pages/PlayerSelect";
import TeamSelect from "@/components/analysis-pages/TeamSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisFiltersSchema } from "@/validators/analysisFilters";
import { useForm } from "react-hook-form";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function FilterBar({
  data,
  scoreboardUrl = null,
  seriesAnalysis = false,
  customAnalysis = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (values) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== "";
      })
    );

    if (filteredValues.players) {
      filteredValues.players = filteredValues.players.join(",");
    }

    const params = new URLSearchParams(filteredValues);

    if (seriesAnalysis) {
      router.push(`/analysis/series/${data.id}?${params.toString()}`);
      return;
    }

    if (customAnalysis) {
      router.push(`/analysis/custom/${data.id}?${params.toString()}`);
      return;
    }

    router.push(`/analysis/map/${data.id}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    form.reset({ team: "", players: [] });

    if (seriesAnalysis) {
      router.push(`/analysis/series/${data.id}`);
      return;
    }

    if (customAnalysis) {
      router.push(`/analysis/custom/${data.id}`);
      return;
    }

    router.push(`/analysis/map/${data.id}`);
  };

  const form = useForm({
    resolver: zodResolver(analysisFiltersSchema),
    defaultValues: {
      team: searchParams.get("team") || "",
      players: searchParams.get("players")?.split(",") || [],
    },
  });

  const activeFilters = ["team", "players"].reduce(
    (count, param) => (searchParams.get(param) ? count + 1 : count),
    0
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-y-4 lg:gap-y-0 mt-8 mb-8">
      <div className="flex gap-x-2 justify-center lg:justify-normal items-center w-full lg:w-auto">
        <ChartNoAxesColumnIncreasing className="w-6 h-6 hidden lg:block" />
        <h1 className="text-2xl font-bold text-center lg:text-left">
          Visualise the Data
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row gap-4 lg:gap-x-5"
        >
          <div className="flex flex-col items-center lg:flex-row gap-2 lg:gap-y-0 lg:gap-x-4">
            <TeamSelect
              form={form}
              data={data}
              customAnalysis={customAnalysis}
            />
            <PlayerSelect form={form} data={data} />
          </div>

          <div className="flex justify-center lg:justify-normal gap-x-2">
            {activeFilters > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button type="submit">
              {activeFilters > 0 ? `Filter (${activeFilters})` : "Apply Filter"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex justify-center lg:justify-normal gap-x-5">
        <ImagePreview
          screenshot={data.screenshot}
          scoreboardUrl={scoreboardUrl}
        />
        <DeleteDialog
          id={data.id}
          customAnalysis={customAnalysis}
          seriesAnalysis={seriesAnalysis}
        />
      </div>
    </div>
  );
}
