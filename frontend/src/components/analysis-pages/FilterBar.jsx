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
    router.push(`/analysis/map/${data.id}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    form.reset({ team: "", players: [] });
    if (seriesAnalysis) {
      router.push(`/analysis/series/${data.id}`);
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
    <div className="flex justify-between mt-8">
      <div className="flex gap-x-2 items-center">
        <ChartNoAxesColumnIncreasing className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Visualise the Data</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-5">
          <TeamSelect form={form} data={data} />
          <PlayerSelect form={form} data={data} />

          <div className="flex gap-x-2">
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

      <div className="flex gap-x-5">
        <ImagePreview
          screenshot={data.screenshot}
          scoreboardUrl={scoreboardUrl}
        />
        <DeleteDialog id={data.id} />
      </div>
    </div>
  );
}
