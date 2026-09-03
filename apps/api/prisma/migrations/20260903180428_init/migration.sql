-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "VehicleOverallStatus" AS ENUM ('REGULAR', 'ATTENTION', 'IRREGULAR', 'PROCESSING', 'MANUAL_REVIEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "FineStatus" AS ENUM ('OPEN', 'PAYMENT_PENDING', 'PAID', 'CLEARANCE_PROCESSING', 'CLEARED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LicensingStatus" AS ENUM ('ELIGIBLE', 'BLOCKED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'DOCUMENT_READY', 'FAILED');

-- CreateEnum
CREATE TYPE "GovernmentSubmissionStatus" AS ENUM ('NOT_REQUESTED', 'QUEUED', 'PROCESSING', 'CONFIRMED', 'FAILED', 'MANUAL_REVIEW');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "dispatcher_id" TEXT,
    "plate_normalized" TEXT NOT NULL,
    "renavam_encrypted" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "overall_status" "VehicleOverallStatus" NOT NULL DEFAULT 'UNKNOWN',
    "last_checked_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fines" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "external_reference" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "discount_amount" DECIMAL(12,2),
    "agency" TEXT NOT NULL,
    "status" "FineStatus" NOT NULL DEFAULT 'OPEN',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licensings" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "LicensingStatus" NOT NULL DEFAULT 'ELIGIBLE',
    "government_submission_status" "GovernmentSubmissionStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "document_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licensings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_normalized_key" ON "vehicles"("plate_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "fines_vehicle_id_external_reference_key" ON "fines"("vehicle_id", "external_reference");

-- CreateIndex
CREATE UNIQUE INDEX "licensings_vehicle_id_year_key" ON "licensings"("vehicle_id", "year");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_dispatcher_id_fkey" FOREIGN KEY ("dispatcher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licensings" ADD CONSTRAINT "licensings_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
