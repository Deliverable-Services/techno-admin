import * as React from "react";
import { cn } from "../utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
};

export const Container: React.FC<ContainerProps> = ({
  className,
  fluid,
  ...props
}) => {
  return (
    <div
      className={cn(
        fluid
          ? "w-full px-4 sm:px-6 lg:px-8"
          : "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
};

type RowProps = React.HTMLAttributes<HTMLDivElement>;

export const Row: React.FC<RowProps> = ({ className, ...props }) => {
  return <div className={cn("flex flex-wrap -mx-2", className)} {...props} />;
};

type ColSizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ColProps = React.HTMLAttributes<HTMLDivElement> & {
  xs?: ColSizes;
  sm?: ColSizes;
  md?: ColSizes;
  lg?: ColSizes;
  xl?: ColSizes;
};

const widthClass = (span?: ColSizes) => {
  if (!span) return "";
  return `w-${span}/12`;
};

export const Col: React.FC<ColProps> = ({
  className,
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}) => {
  const base = widthClass(xs) || "w-full";
  const smClass = sm ? `sm:${widthClass(sm)}` : "";
  const mdClass = md ? `md:${widthClass(md)}` : "";
  const lgClass = lg ? `lg:${widthClass(lg)}` : "";
  const xlClass = xl ? `xl:${widthClass(xl)}` : "";
  return (
    <div
      className={cn(
        "px-2",
        base,
        smClass,
        mdClass,
        lgClass,
        xlClass,
        className
      )}
      {...props}
    />
  );
};
