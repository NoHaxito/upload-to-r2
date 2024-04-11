import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    if (type === "password") {
      return (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "ease box-border flex h-10 w-full rounded-md border-2 border-input/60 bg-background px-3 py-2 text-sm outline-none transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:items-center placeholder:text-muted-foreground focus:border-2 focus:border-input disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            ref={ref}
            {...props}
          />
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
            <Button
              disabled={!props.value}
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              variant={!props.value ? 'ghost' : 'secondary'}
              size="icon"
              className="size-6"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle password</span>
            </Button>
          </span>
        </div>
      );
    }
    return (
      <input
        type={type}
        className={cn(
          "ease box-border flex h-10 w-full rounded-md border-2 border-input/40 bg-background px-3 py-2 text-sm outline-none transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:items-center placeholder:text-muted-foreground focus:border-2 focus:border-input disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };