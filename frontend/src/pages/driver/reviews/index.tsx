import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewCard } from '@/components/driver/review-card';
import { useDriverProfile } from '@/hooks/use-driver';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { DriverReviewsResponse } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function DriverReviewsPage() {
  const { data: driver, isLoading: driverLoading } = useDriverProfile();

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: queryKeys.driver.reviews(driver?.id || '', 1, 20),
    queryFn: () => apiClient.get<DriverReviewsResponse>(`/reviews/drivers/${driver?.id}`, { page: 1, limit: 20 }),
    enabled: !!driver?.id,
  });

  if (driverLoading || reviewsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-32" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  const averageRating = reviews?.averageRating || 0;
  const totalReviews = reviews?.total || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">
          See what customers say about your service
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Rating Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <div className="text-muted-foreground">
                <p className="font-medium">{totalReviews} reviews</p>
                <p className="text-sm">Overall rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
        {reviews && reviews.data.length > 0 ? (
          <div className="space-y-4">
            {reviews.data.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No reviews yet</h3>
              <p className="text-muted-foreground mt-1">
                Complete more deliveries to receive customer reviews!
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
