-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROVIDER', 'SEEKER');

-- CreateEnum
CREATE TYPE "FarmlandStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'MATCHED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "profile_image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'SEEKER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmlands" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "name" TEXT,
    "prefecture" VARCHAR(50) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "price" INTEGER,
    "available_from" TIMESTAMP(3) NOT NULL,
    "available_to" TIMESTAMP(3),
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "images" JSONB NOT NULL,
    "facilities" JSONB DEFAULT '{}',
    "status" "FarmlandStatus" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmlands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "farmland_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "farmland_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "farmlands_created_at_idx" ON "farmlands"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_farmland_id_key" ON "favorites"("user_id", "farmland_id");

-- AddForeignKey
ALTER TABLE "farmlands" ADD CONSTRAINT "farmlands_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_farmland_id_fkey" FOREIGN KEY ("farmland_id") REFERENCES "farmlands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_farmland_id_fkey" FOREIGN KEY ("farmland_id") REFERENCES "farmlands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
