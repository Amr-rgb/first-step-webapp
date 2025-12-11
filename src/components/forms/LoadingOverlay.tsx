import { Skeleton } from "@/components/ui/skeleton";

const LoadingOverlay = ({ content }: { content: string }) => {
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white mx-4 p-6 sm:min-w-96 rounded-lg shadow-md flex flex-col items-center space-y-4">
        <span dir="ltr" className="text-lg font-medium">
          {content}
        </span>
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
