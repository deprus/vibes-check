import { Skeleton } from "./ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center space-x-4 self-center w-full h-full">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
