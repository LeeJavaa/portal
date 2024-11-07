import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newSeriesCustomAnalysisSchema } from "@/validators/newSeriesCustomAnalysis";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const AnalysisDialog = ({ isOpen, onClose, onSubmit, type, selectedIds }) => {
  const form = useForm({
    resolver: zodResolver(newSeriesCustomAnalysisSchema),
    defaultValues: {
      title: "",
      ids: selectedIds,
    },
  });

  const handleSubmit = (values) => {
    onSubmit(values);
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
            {type === "series" ? "series" : "custom"} analysis and we'll do the
            rest for you.
          </DialogDescription>
        </DialogHeader>

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
