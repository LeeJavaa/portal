import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomAnalysisLoading() {
  return (
    <main className="w-full max-w-screen-xl mx-auto">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-[60%] mx-auto mt-5 mb-8" />

      {/* MapsetTable skeleton */}
      <div className="w-full">
        <Table className="border-t border-border">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="w-1/3">Tournaments</TableHead>
              <TableHead className="w-1/3">Series</TableHead>
              <TableHead className="w-1/3">Maps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* First tournament group */}
            {[...Array(3)].map((_, tIndex) => (
              <React.Fragment key={`tournament-${tIndex}`}>
                {/* Series and maps within each tournament */}
                {[...Array(2)].map((_, sIndex) =>
                  [...Array(2)].map((_, mIndex) => (
                    <TableRow
                      key={`row-${tIndex}-${sIndex}-${mIndex}`}
                      className={`border-0 ${
                        sIndex === 1 && mIndex === 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <TableCell>
                        {sIndex === 0 && mIndex === 0 && (
                          <Skeleton className="h-4 w-[80%]" />
                        )}
                      </TableCell>
                      <TableCell>
                        {mIndex === 0 && <Skeleton className="h-4 w-[70%]" />}
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60%]" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Separator skeleton */}
      <Skeleton className="h-[1px] w-full mt-8" />

      {/* FilterBar skeleton */}
      <div className="flex justify-between mt-8">
        <div className="flex gap-x-2 items-center">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-x-5">
          {/* Team and Player select skeletons */}
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          {/* Filter buttons skeleton */}
          <div className="flex gap-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="flex gap-x-5">
          {/* Preview and Delete button skeletons */}
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </main>
  );
}
