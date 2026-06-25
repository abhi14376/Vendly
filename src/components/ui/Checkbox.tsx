import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, required, id, ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            required={required}
            className={cn(
              "peer size-5 shrink-0 appearance-none rounded-sm border border-slate-300 bg-white transition-all checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:checked:border-primary-600 dark:checked:bg-primary-600",
              error && "border-error focus-visible:ring-error",
              className
            )}
            {...props}
          />
          <svg
            className="pointer-events-none absolute left-0 hidden size-5 text-white peer-checked:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
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

Checkbox.displayName = "Checkbox";
