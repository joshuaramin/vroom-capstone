-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'customer');

-- CreateEnum
CREATE TYPE "scheduleStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Archive" (
    "archieveID" TEXT NOT NULL,
    "archive" BOOLEAN NOT NULL,
    "userID" TEXT,
    "orderID" TEXT,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("archieveID")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profileID" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressID" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileID" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressID")
);

-- CreateTable
CREATE TABLE "Product" (
    "productID" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productID")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderID" TEXT,
    "receiverID" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageID")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "scheduleID" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "service" TEXT[],
    "status" "scheduleStatus" NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleID")
);

-- CreateTable
CREATE TABLE "Logs" (
    "logsID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIME NOT NULL,
    "userID" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("logsID")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderID" TEXT NOT NULL,
    "orders" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "payment" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderID")
);

-- CreateTable
CREATE TABLE "OTP" (
    "otpID" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "userID" TEXT,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("otpID")
);

-- CreateTable
CREATE TABLE "_ProductToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ScheduleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrdersToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrdersToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToUser_AB_unique" ON "_ProductToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToUser_B_index" ON "_ProductToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ScheduleToUser_AB_unique" ON "_ScheduleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ScheduleToUser_B_index" ON "_ScheduleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrdersToProduct_AB_unique" ON "_OrdersToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrdersToProduct_B_index" ON "_OrdersToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrdersToUser_AB_unique" ON "_OrdersToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrdersToUser_B_index" ON "_OrdersToUser"("B");

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Orders"("orderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profileID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("productID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToUser" ADD CONSTRAINT "_ScheduleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("scheduleID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToUser" ADD CONSTRAINT "_ScheduleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToProduct" ADD CONSTRAINT "_OrdersToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Orders"("orderID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToProduct" ADD CONSTRAINT "_OrdersToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("productID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToUser" ADD CONSTRAINT "_OrdersToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Orders"("orderID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToUser" ADD CONSTRAINT "_OrdersToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
