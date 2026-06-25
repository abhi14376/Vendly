import { forwardRef, ImgHTMLAttributes, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const sizeStyles = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
};

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const containerClasses = cn(
      "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
      sizeStyles[size],
      className
    );

    if (hasError || !src) {
      return (
        <div className={cn(containerClasses, "items-center justify-center")}>
          {fallback ? (
            <span className="font-medium uppercase text-slate-600 dark:text-slate-300">
              {fallback.slice(0, 2)}
            </span>
          ) : (
            <User className="size-1/2 text-slate-400" />
          )}
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <img
          ref={ref}
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square size-full object-cover"
          onError={() => setHasError(true)}
          {...props}
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
