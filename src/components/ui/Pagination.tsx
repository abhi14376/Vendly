import { forwardRef, HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({ className, currentPage, totalPages, onPageChange, children, ...props }: PaginationProps) => {
  if (currentPage !== undefined && totalPages !== undefined && onPageChange) {
    return (
      <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      >
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
            </PaginationItem>
          )}
          <PaginationItem>
            <span className="text-sm mx-4">
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
            </PaginationItem>
          )}
        </PaginationContent>
      </nav>
    );
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      {children}
    </nav>
  );
};

export const PaginationContent = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

type PaginationButtonProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

export const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    size={size}
    className={cn(
      "size-10 rounded-md",
      isActive && "border-slate-200 bg-white font-bold dark:border-slate-800 dark:bg-slate-900",
      className
    )}
    {...props}
  />
);

export const PaginationPrevious = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "children">) => (
  <PaginationLink
    size="default"
    className={cn("gap-1 pl-2.5 h-10 rounded-md", className)}
    {...props}
  >
    <ChevronLeft className="size-4" />
    <span>Previous</span>
  </PaginationLink>
);

export const PaginationNext = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "children">) => (
  <PaginationLink
    size="default"
    className={cn("gap-1 pr-2.5 h-10 rounded-md", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="size-4" />
  </PaginationLink>
);

export const PaginationEllipsis = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);
