import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, error, required, id, ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={id}
            ref={ref}
            type="radio"
            required={required}
            className={cn(
              "peer size-5 shrink-0 appearance-none rounded-full border border-slate-300 bg-white transition-all checked:border-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900",
              error && "border-error focus-visible:ring-error",
              className
            )}
            {...props}
          />
          <span className="pointer-events-none absolute left-[5px] top-[9px] hidden size-2.5 rounded-full bg-primary-600 peer-checked:block" />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label htmlFor={id} className="font-medium text-slate-700 dark:text-slate-200">
                {label}
                {required && <span className="ml-1 text-error">*</span>}
              </label>
            )}
            {description && <p className="text-slate-500 dark:text-slate-400">{description}</p>}
            {error && <p className="mt-1 text-error" role="alert">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";
