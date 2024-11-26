import React from "react";
import { cn } from "@/lib/utils";
import GridLoader from "react-spinners/GridLoader";

type SpinnerProps = {
  className?: string;
  message?: string;
};

const Spinner = ({ className, message, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-2",
        className
      )}
      {...props}
    >
      <GridLoader
        loading
        margin={0}
        size={10}
        color="#bbbbbb"
        className="animate-pulse"
      />
      <p className="text-sm text-gray-500 animate-pulse">
        {message && message}
      </p>
    </div>
  );
};

export default Spinner;
