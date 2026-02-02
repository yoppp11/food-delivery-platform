import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value,
      onChange,
      readonly = false,
      size = "md",
      showValue = false,
      className,
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState(0);

    const handleClick = (starValue: number) => {
      if (!readonly && onChange) {
        onChange(starValue);
      }
    };

    const handleMouseEnter = (starValue: number) => {
      if (!readonly) {
        setHoverValue(starValue);
      }
    };

    const handleMouseLeave = () => {
      setHoverValue(0);
    };

    const displayValue = hoverValue || value;

    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)}>
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= displayValue;
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "transition-all duration-150",
                readonly
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-110 active:scale-95"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-150",
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-muted-foreground/50"
                )}
              />
            </button>
          );
        })}
        {showValue && value > 0 && (
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            ({value.toFixed(1)})
          </span>
        )}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

export { StarRating };
