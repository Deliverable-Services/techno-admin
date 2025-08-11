import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const checkbox = checkboxRef.current;
      if (checkbox) {
        checkbox.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            "appearance-none cursor-pointer",
            className
          )}
          ref={(node) => {
            checkboxRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          {...props}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Check
            className={cn(
              "h-3 w-3 text-primary-foreground opacity-0 transition-opacity",
              "peer-checked:opacity-100",
              indeterminate ? "peer-indeterminate:opacity-100" : ""
            )}
          />
        </div>
        {indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={cn(
                "h-2 w-2 bg-primary-foreground rounded-sm opacity-0 transition-opacity",
                "peer-indeterminate:opacity-100"
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
