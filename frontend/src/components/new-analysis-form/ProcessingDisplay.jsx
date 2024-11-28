import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

export default function ProcessingDisplay() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Alert>
        <AlertTitle>Hold on!</AlertTitle>
        <AlertDescription>
          We're just busy processing that scoreboard real quick
        </AlertDescription>
      </Alert>
      <Loader className=" h-15 w-15 animate-spin" />
    </div>
  );
}
