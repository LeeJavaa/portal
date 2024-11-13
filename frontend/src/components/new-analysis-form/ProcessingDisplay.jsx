import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Loader } from "lucide-react";

export default function ProcessingDisplay() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Loader className=" h-20 w-20 animate-spin" />
      <Alert>
        <AlertTitle>Hold on!</AlertTitle>
        <AlertDescription>
          We're just busy processing that scoreboard real quick
        </AlertDescription>
      </Alert>
    </div>
  );
}
