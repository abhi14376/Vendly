import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "@/utils/cn";
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline" | "default";
type ButtonSize = "default" | "icon" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  default: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "border border-primary-600 bg-white text-primary-700 hover:bg-primary-50 dark:bg-slate-950 dark:text-primary-300",
  outline: "border border-primary-600 bg-white text-primary-700 hover:bg-primary-50 dark:bg-slate-950 dark:text-primary-300",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-error text-white hover:opacity-90",
  success: "bg-success text-white hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-4",
  icon: "size-11 p-0",
  sm: "h-9 px-3 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  asChild = false,
  children,
  className = "",
  disabled,
  fullWidth = false,
  loading = false,
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: `${child.props.className ?? ""} ${classes}`.trim(),
    });
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
