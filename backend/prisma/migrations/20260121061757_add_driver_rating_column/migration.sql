-- AlterTable
ALTER TABLE "driverReviews" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "rating" DECIMAL(65,30);

-- CreateIndex
CREATE INDEX "driverLocations_driverId_recordedAt_idx" ON "driverLocations"("driverId", "recordedAt" DESC);
