import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TOURNAMENTS } from "@/data/general";
import { Loader } from "lucide-react";

export default function AnalysisData({
  form,
  setFormStep,
  isSubmitting,
  handleSubmit,
  error,
}) {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="border-2 mb-2">
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-5 pb-5">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Some title for your analysis here"
                  value={field.value}
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
              <FormLabel>Tournament</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What tourny was this?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TOURNAMENTS).map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </SelectItem>
                  ))}
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
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            "Create"
          )}
        </Button>
        <Button type="button" variant={"ghost"} onClick={() => setFormStep(3)}>
          Go back
        </Button>
      </div>
    </>
  );
}
