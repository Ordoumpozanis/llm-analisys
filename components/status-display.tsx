"use client";
import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IconType } from "react-icons/lib";
interface StatusDisplayProps {
  icon: IconType | null;
  message: string;
  progress?: number;
  showProgress?: boolean;
}

export function StatusDisplay({
  icon: Icon,
  message,
  progress,
  showProgress,
}: StatusDisplayProps) {
  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-10/12 lg:w-[300px] flex items-center p-4 z-50 h-fit">
      <CardContent className="flex flex-row items-center gap-4">
        {/* Render the passed icon */}
        {Icon && <Icon className="text-2xl text-neutral-500" />}
        <p className="text-base text-neutral-200">{message}</p>
      </CardContent>
      {showProgress && (
        <CardFooter className="flex items-center gap-2">
          <Progress className="w-full" value={progress} max={100} />
        </CardFooter>
      )}
    </Card>
  );
}
