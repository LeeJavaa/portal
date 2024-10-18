import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";

export default function ProgressDisplay({ progress }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Progress value={progress} className="w-full" />
      <Alert>
        <AlertTitle>Hold on!</AlertTitle>
        <AlertDescription>
          We're just busy processing that scoreboard real quick
        </AlertDescription>
      </Alert>
    </div>
  );
}
