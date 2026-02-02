import { useTranslation } from "react-i18next";
import { Store, Truck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

interface ExistingReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewSectionProps {
  type: "merchant" | "driver";
  name: string;
  subtext?: string;
  rating: number;
  onRatingChange: (value: number) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  skipped: boolean;
  onSkipChange: (skipped: boolean) => void;
  existingReview?: ExistingReview | null;
  disabled?: boolean;
}

export function ReviewSection({
  type,
  name,
  subtext,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  skipped,
  onSkipChange,
  existingReview,
  disabled = false,
}: ReviewSectionProps) {
  const { t } = useTranslation();
  const Icon = type === "merchant" ? Store : Truck;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (existingReview) {
    return (
      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            {subtext && (
              <p className="text-sm text-muted-foreground">{subtext}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <StarRating value={existingReview.rating} readonly showValue />
          {existingReview.comment && (
            <p className="text-sm text-muted-foreground italic">
              "{existingReview.comment}"
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {t("review.reviewedOn", {
              date: formatDate(existingReview.createdAt),
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-opacity",
        skipped && "opacity-50"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">
            {type === "merchant"
              ? t("review.merchantSection")
              : t("review.driverSection")}
            : {name}
          </p>
          {subtext && (
            <p className="text-sm text-muted-foreground">{subtext}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center py-2">
          <StarRating
            value={rating}
            onChange={onRatingChange}
            readonly={skipped || disabled}
            size="lg"
          />
        </div>

        <Textarea
          placeholder={
            type === "merchant"
              ? t("review.commentPlaceholder.merchant")
              : t("review.commentPlaceholder.driver")
          }
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={skipped || disabled}
          maxLength={500}
          className="resize-none"
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`skip-${type}`}
            checked={skipped}
            onCheckedChange={(checked) => onSkipChange(checked === true)}
            disabled={disabled}
          />
          <Label
            htmlFor={`skip-${type}`}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {type === "merchant"
              ? t("review.skipMerchant")
              : t("review.skipDriver")}
          </Label>
        </div>
      </div>
    </div>
  );
}
