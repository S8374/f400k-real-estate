-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'BUYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'INACTIVE', 'DELETED', 'BANNED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('ACTIVE', 'SOLD', 'PENDING');

-- CreateEnum
CREATE TYPE "ListingPurpose" AS ENUM ('SELL', 'RENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'UNDER_CONSTRUCTION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('GOLDEN_VISA', 'HIGH_YIELD', 'GIGA_PROJECT', 'OFF_PLAN', 'LUXURY', 'COMMERCIAL', 'RESIDENTIAL', 'KAFD_ELITE', 'MADINAH', 'MAKKAH');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'VR_TOUR');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'OFF_MARKET', 'UNDER_OFFER');

-- CreateEnum
CREATE TYPE "MilestoneTrigger" AS ENUM ('DATE_BASED', 'CONSTRUCTION_MILESTONE');

-- CreateEnum
CREATE TYPE "MilestonePaymentStatus" AS ENUM ('PENDING', 'AGENT_REVIEWED', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone_number" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "nationality" CHAR(50),
    "role" "Role" NOT NULL DEFAULT 'BUYER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMPTZ,
    "lastLogin" TIMESTAMPTZ,
    "lastActive" TIMESTAMPTZ,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_profiles" (
    "userId" UUID NOT NULL,
    "licenseId" TEXT,
    "agencyName" TEXT,
    "isRegaVerified" BOOLEAN NOT NULL DEFAULT false,
    "isNafathVerified" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bio" TEXT,
    "yearsExperience" INTEGER,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "agent_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "buyer_profiles" (
    "userId" UUID NOT NULL,
    "investmentBudgetMin" DOUBLE PRECISION,
    "investmentField" TEXT,
    "investmentBudgetMax" DOUBLE PRECISION,
    "isNafathVerified" BOOLEAN NOT NULL DEFAULT false,
    "preferredPropertyTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "buyer_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "kyc_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "verificationStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "listingAgentId" UUID NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "listingPurpose" "ListingPurpose" NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'OFF_PLAN',
    "developerId" UUID,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalUnits" INTEGER,
    "availableUnits" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "addressLine" TEXT,
    "mapEmbedUrl" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'SAR',
    "areaSqm" DOUBLE PRECISION,
    "areaSqFt" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "balconies" INTEGER,
    "floorNumber" INTEGER,
    "yearBuilt" INTEGER,
    "parkingSlots" INTEGER DEFAULT 1,
    "furnished" BOOLEAN DEFAULT false,
    "isBooked" BOOLEAN DEFAULT false,
    "isRegaVerified" BOOLEAN DEFAULT false,
    "sakNumber" TEXT,
    "roiProjectionPercent" DOUBLE PRECISION,
    "estimatedRentalIncome" DOUBLE PRECISION,
    "estimatedRentalCurrency" CHAR(3) DEFAULT 'SAR',
    "valueApproximate" DOUBLE PRECISION,
    "valueApproximateCurrency" CHAR(3) DEFAULT 'NGN',
    "views" INTEGER NOT NULL DEFAULT 0,
    "featuredUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_attributes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "property_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "floorNumber" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'SAR',
    "areaSqm" DOUBLE PRECISION NOT NULL,
    "areaSqFt" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "balconies" INTEGER,
    "parkingSlots" INTEGER DEFAULT 1,
    "status" "UnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPricedOnRequest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "property_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID,
    "unitId" UUID,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "totalInstallments" INTEGER,
    "description" TEXT,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planId" UUID NOT NULL,
    "tittle" TEXT,
    "milestoneOrder" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "constructionProgress" DOUBLE PRECISION,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "milestoneId" UUID NOT NULL,
    "buyerId" UUID NOT NULL,
    "agentId" UUID,
    "adminId" UUID,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "proofUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MilestonePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "agentReviewedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "notes" TEXT,
    "isReadByBuyer" BOOLEAN NOT NULL DEFAULT false,
    "isReadByAgent" BOOLEAN NOT NULL DEFAULT false,
    "isReadByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "agentDocumentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "agentDocumentNote" TEXT,
    "agentUploadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_listings" (
    "userId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_listings_pkey" PRIMARY KEY ("userId","propertyId")
);

-- CreateTable
CREATE TABLE "property_views" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "userId" UUID,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,

    CONSTRAINT "property_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT,
    "attachmentUrl" TEXT,
    "attachmentType" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_payment_banks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "swiftCode" TEXT,
    "branchAddress" TEXT,
    "additionalInfo" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_payment_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_invisitors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "userId" UUID,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "relationship" TEXT,
    "idNumber" TEXT,
    "idType" TEXT,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_invisitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nearby_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "distanceKm" DOUBLE PRECISION,
    "category" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "nearby_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plan_acceptances" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "buyerId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "paymentPlanId" UUID NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedById" UUID,

    CONSTRAINT "payment_plan_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserConversations" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserConversations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profiles_licenseId_key" ON "agent_profiles"("licenseId");

-- CreateIndex
CREATE INDEX "kyc_documents_userId_idx" ON "kyc_documents"("userId");

-- CreateIndex
CREATE INDEX "kyc_documents_verificationStatus_idx" ON "kyc_documents"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "developers_name_key" ON "developers"("name");

-- CreateIndex
CREATE INDEX "developers_name_idx" ON "developers"("name");

-- CreateIndex
CREATE INDEX "properties_listingAgentId_idx" ON "properties"("listingAgentId");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_listingPurpose_idx" ON "properties"("listingPurpose");

-- CreateIndex
CREATE INDEX "properties_price_idx" ON "properties"("price");

-- CreateIndex
CREATE INDEX "properties_createdAt_idx" ON "properties"("createdAt");

-- CreateIndex
CREATE INDEX "properties_developerId_idx" ON "properties"("developerId");

-- CreateIndex
CREATE UNIQUE INDEX "property_attributes_propertyId_key_key" ON "property_attributes"("propertyId", "key");

-- CreateIndex
CREATE INDEX "property_units_propertyId_idx" ON "property_units"("propertyId");

-- CreateIndex
CREATE INDEX "property_units_status_idx" ON "property_units"("status");

-- CreateIndex
CREATE INDEX "property_units_price_idx" ON "property_units"("price");

-- CreateIndex
CREATE INDEX "media_propertyId_idx" ON "media"("propertyId");

-- CreateIndex
CREATE INDEX "media_unitId_idx" ON "media"("unitId");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "payment_plans_propertyId_idx" ON "payment_plans"("propertyId");

-- CreateIndex
CREATE INDEX "payment_plans_createdById_idx" ON "payment_plans"("createdById");

-- CreateIndex
CREATE INDEX "milestones_planId_idx" ON "milestones"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "milestones_planId_milestoneOrder_key" ON "milestones"("planId", "milestoneOrder");

-- CreateIndex
CREATE INDEX "milestone_payments_milestoneId_idx" ON "milestone_payments"("milestoneId");

-- CreateIndex
CREATE INDEX "milestone_payments_buyerId_idx" ON "milestone_payments"("buyerId");

-- CreateIndex
CREATE INDEX "milestone_payments_agentId_idx" ON "milestone_payments"("agentId");

-- CreateIndex
CREATE INDEX "milestone_payments_adminId_idx" ON "milestone_payments"("adminId");

-- CreateIndex
CREATE INDEX "milestone_payments_status_idx" ON "milestone_payments"("status");

-- CreateIndex
CREATE INDEX "property_views_propertyId_idx" ON "property_views"("propertyId");

-- CreateIndex
CREATE INDEX "property_views_userId_idx" ON "property_views"("userId");

-- CreateIndex
CREATE INDEX "property_views_viewedAt_idx" ON "property_views"("viewedAt");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "conversations_propertyId_idx" ON "conversations"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_payment_banks_propertyId_key" ON "property_payment_banks"("propertyId");

-- CreateIndex
CREATE INDEX "property_payment_banks_userId_idx" ON "property_payment_banks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "property_invisitors_propertyId_key" ON "property_invisitors"("propertyId");

-- CreateIndex
CREATE INDEX "property_invisitors_userId_idx" ON "property_invisitors"("userId");

-- CreateIndex
CREATE INDEX "nearby_projects_propertyId_idx" ON "nearby_projects"("propertyId");

-- CreateIndex
CREATE INDEX "nearby_projects_category_idx" ON "nearby_projects"("category");

-- CreateIndex
CREATE INDEX "nearby_projects_isActive_idx" ON "nearby_projects"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "payment_plan_acceptances_buyerId_propertyId_paymentPlanId_key" ON "payment_plan_acceptances"("buyerId", "propertyId", "paymentPlanId");

-- CreateIndex
CREATE INDEX "_UserConversations_B_index" ON "_UserConversations"("B");

-- AddForeignKey
ALTER TABLE "agent_profiles" ADD CONSTRAINT "agent_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_profiles" ADD CONSTRAINT "buyer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_listingAgentId_fkey" FOREIGN KEY ("listingAgentId") REFERENCES "agent_profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_attributes" ADD CONSTRAINT "property_attributes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_units" ADD CONSTRAINT "property_units_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "property_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "payment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_payments" ADD CONSTRAINT "milestone_payments_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_payments" ADD CONSTRAINT "milestone_payments_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_payments" ADD CONSTRAINT "milestone_payments_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_payments" ADD CONSTRAINT "milestone_payments_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_views" ADD CONSTRAINT "property_views_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_views" ADD CONSTRAINT "property_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_payment_banks" ADD CONSTRAINT "property_payment_banks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_payment_banks" ADD CONSTRAINT "property_payment_banks_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_invisitors" ADD CONSTRAINT "property_invisitors_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_invisitors" ADD CONSTRAINT "property_invisitors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nearby_projects" ADD CONSTRAINT "nearby_projects_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_acceptances" ADD CONSTRAINT "payment_plan_acceptances_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_acceptances" ADD CONSTRAINT "payment_plan_acceptances_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_acceptances" ADD CONSTRAINT "payment_plan_acceptances_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_acceptances" ADD CONSTRAINT "payment_plan_acceptances_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
