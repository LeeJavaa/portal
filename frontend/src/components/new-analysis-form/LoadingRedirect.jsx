import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const LoadingRedirect = ({ isLoading }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    if (isLoading) {
      toast({
        title: "Redirecting to analysis...",
        description: "Please wait while we prepare your analysis page.",
        duration: 1500,
        className: "bg-primary text-primary-foreground",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
      });
    }
  }, [isLoading, toast]);

  return <Toaster />;
};

export default LoadingRedirect;
