import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewSection } from "./review-section";
import {
  useOrderReviewStatus,
  useCreateMerchantReview,
  useCreateDriverReview,
} from "@/hooks/use-reviews";
import { queryKeys } from "@/lib/query-keys";

interface OrderReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
}

export function OrderReviewDialog({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: OrderReviewDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [merchantRating, setMerchantRating] = useState(0);
  const [merchantComment, setMerchantComment] = useState("");
  const [skipMerchant, setSkipMerchant] = useState(false);

  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState("");
  const [skipDriver, setSkipDriver] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: reviewStatus,
    isLoading,
    error,
  } = useOrderReviewStatus(orderId);

  const createMerchantReview = useCreateMerchantReview();
  const createDriverReview = useCreateDriverReview();

  const hasDriver = !!reviewStatus?.driverId;
  const canReviewMerchant = reviewStatus?.canReviewMerchant ?? false;
  const canReviewDriver = reviewStatus?.canReviewDriver ?? false;
  const isReadonly = !canReviewMerchant && !canReviewDriver;

  const handleSubmit = async () => {
    setValidationError(null);

    if (!canReviewMerchant && !canReviewDriver) {
      onOpenChange(false);
      return;
    }

    const willReviewMerchant = canReviewMerchant && !skipMerchant;
    const willReviewDriver = canReviewDriver && !skipDriver;

    if (!willReviewMerchant && !willReviewDriver) {
      setValidationError(t("review.mustRateOne"));
      return;
    }

    if (willReviewMerchant && merchantRating === 0) {
      setValidationError(t("review.selectRating"));
      return;
    }

    if (willReviewDriver && driverRating === 0) {
      setValidationError(t("review.selectRating"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (willReviewMerchant && reviewStatus?.merchantId) {
        await createMerchantReview.mutateAsync({
          merchantId: reviewStatus.merchantId,
          rating: merchantRating,
          comment: merchantComment,
        });
      }

      if (willReviewDriver && reviewStatus?.driverId) {
        await createDriverReview.mutateAsync({
          driverId: reviewStatus.driverId,
          rating: driverRating,
          comment: driverComment,
        });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.orderStatus(orderId),
      });

      toast.success(t("review.success"));
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error(t("review.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMerchantRating(0);
    setMerchantComment("");
    setSkipMerchant(false);
    setDriverRating(0);
    setDriverComment("");
    setSkipDriver(false);
    setValidationError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            {isReadonly ? t("review.viewTitle") : t("review.title")}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground">
            {t("common.error")}
          </div>
        ) : (
          <div className="space-y-4">
            {!isReadonly && (
              <p className="text-sm text-muted-foreground">
                {t("review.subtitle")}
              </p>
            )}

            <ReviewSection
              type="merchant"
              name={reviewStatus?.merchantName || ""}
              rating={merchantRating}
              onRatingChange={setMerchantRating}
              comment={merchantComment}
              onCommentChange={setMerchantComment}
              skipped={skipMerchant}
              onSkipChange={setSkipMerchant}
              existingReview={reviewStatus?.merchantReview}
              disabled={isSubmitting}
            />

            {hasDriver && (
              <>
                <Separator />
                <ReviewSection
                  type="driver"
                  name={reviewStatus?.driverName || t("review.noDriverName")}
                  subtext={reviewStatus?.driverPlateNumber || undefined}
                  rating={driverRating}
                  onRatingChange={setDriverRating}
                  comment={driverComment}
                  onCommentChange={setDriverComment}
                  skipped={skipDriver}
                  onSkipChange={setSkipDriver}
                  existingReview={reviewStatus?.driverReview}
                  disabled={isSubmitting}
                />
              </>
            )}

            {validationError && (
              <p className="text-sm text-destructive text-center">
                {validationError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {isReadonly ? t("review.close") : t("review.skip")}
              </Button>
              {!isReadonly && (
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("review.submitting")}
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      {t("review.submit")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
