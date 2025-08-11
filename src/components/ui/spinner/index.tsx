import * as React from "react";
import { cn } from "../utils";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "xs" | "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
};

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = "md",
  ...props
}) => {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-current border-r-transparent text-primary",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};
