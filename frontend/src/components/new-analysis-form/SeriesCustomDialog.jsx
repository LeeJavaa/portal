import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { newSeriesCustomAnalysisSchema } from "@/validators/newSeriesCustomAnalysis";
import { useForm } from "react-hook-form";

const AnalysisDialog = ({ isOpen, onClose, onSubmit, type, selectedIds }) => {
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(newSeriesCustomAnalysisSchema),
    defaultValues: {
      title: "",
      ids: selectedIds,
    },
  });

  const handleSubmit = async (values) => {
    const isValid = await form.trigger();
    if (isValid) {
      const result = await onSubmit(values);
      if (result?.error) {
        setError(result.error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create {type === "series" ? "Series" : "Custom"} Analysis
          </DialogTitle>
          <DialogDescription className="pt-2">
            Give us a title for your new{" "}
            {type === "series" ? "series" : "custom"} analysis and we&apos;ll do
            the rest for you.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter analysis title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
