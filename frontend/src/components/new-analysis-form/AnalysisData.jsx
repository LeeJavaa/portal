import { Button } from "../ui/button";
import { DateTimePicker } from "../ui/datetime-picker";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Loader } from "lucide-react";

export default function AnalysisData({ form, setFormStep, isSubmitting }) {
  return (
    <>
      <div className="space-y-5 pb-5">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="OpTic vs NYSL Champs GF Map 1" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What tourny was this?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">Call of Duty Champs 2024</SelectItem>
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
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
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
