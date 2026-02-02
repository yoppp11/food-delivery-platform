/*
  Warnings:

  - A unique constraint covering the columns `[ticketId]` on the table `chatRooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,type]` on the table `chatRooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `chatMessages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatRoomStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('GENERAL', 'ORDER_ISSUE', 'PAYMENT_ISSUE', 'DELIVERY_ISSUE', 'REFUND_REQUEST', 'ACCOUNT_ISSUE', 'TECHNICAL', 'FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'WAITING_ADMIN', 'RESOLVED', 'CLOSED');

-- AlterEnum
ALTER TYPE "ChatRole" ADD VALUE 'ADMIN';

-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'ACTION';

-- AlterTable
ALTER TABLE "chatMessages" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "replyToId" TEXT,
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "chatParticipants" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReadAt" TIMESTAMP(3),
ADD COLUMN     "lastReadMsgId" TEXT,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3),
ADD COLUMN     "leftAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "chatRooms" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "closedReason" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastMessageId" TEXT,
ADD COLUMN     "status" "ChatRoomStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "ticketId" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "messageReadReceipts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messageReadReceipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supportTickets" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL DEFAULT 'GENERAL',
    "priority" "TicketPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "assignedAdminId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supportTickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messageReadReceipts_userId_idx" ON "messageReadReceipts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "messageReadReceipts_messageId_userId_key" ON "messageReadReceipts"("messageId", "userId");

-- CreateIndex
CREATE INDEX "supportTickets_customerId_idx" ON "supportTickets"("customerId");

-- CreateIndex
CREATE INDEX "supportTickets_assignedAdminId_idx" ON "supportTickets"("assignedAdminId");

-- CreateIndex
CREATE INDEX "supportTickets_status_idx" ON "supportTickets"("status");

-- CreateIndex
CREATE INDEX "chatMessages_chatRoomId_createdAt_idx" ON "chatMessages"("chatRoomId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "chatMessages_senderId_idx" ON "chatMessages"("senderId");

-- CreateIndex
CREATE INDEX "chatMessages_status_idx" ON "chatMessages"("status");

-- CreateIndex
CREATE INDEX "chatParticipants_userId_idx" ON "chatParticipants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "chatRooms_ticketId_key" ON "chatRooms"("ticketId");

-- CreateIndex
CREATE INDEX "chatRooms_orderId_idx" ON "chatRooms"("orderId");

-- CreateIndex
CREATE INDEX "chatRooms_ticketId_idx" ON "chatRooms"("ticketId");

-- CreateIndex
CREATE INDEX "chatRooms_status_idx" ON "chatRooms"("status");

-- CreateIndex
CREATE INDEX "chatRooms_lastMessageAt_idx" ON "chatRooms"("lastMessageAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "chatRooms_orderId_type_key" ON "chatRooms"("orderId", "type");

-- AddForeignKey
ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "supportTickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatMessages" ADD CONSTRAINT "chatMessages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "chatMessages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageReadReceipts" ADD CONSTRAINT "messageReadReceipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chatMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageReadReceipts" ADD CONSTRAINT "messageReadReceipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
