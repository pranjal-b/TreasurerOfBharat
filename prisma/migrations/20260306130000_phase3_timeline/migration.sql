-- CreateEnum
CREATE TYPE "TimelineItemType" AS ENUM ('NEWS', 'REGULATORY', 'MARKET', 'TECHNOLOGY');

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "link" TEXT,
    "type" "TimelineItemType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineItem_userId_createdAt_idx" ON "TimelineItem"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TimelineItem_type_createdAt_idx" ON "TimelineItem"("type", "createdAt");
