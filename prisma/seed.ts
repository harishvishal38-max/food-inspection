import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.violation.deleteMany()
  await prisma.inspectionReport.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.verificationResult.deleteMany()
  await prisma.bill.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.officer.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Users
  const hotelUser = await prisma.user.create({
    data: {
      email: 'hotel@example.com',
      password: passwordHash,
      role: 'HOTEL',
    }
  })

  const officerUser = await prisma.user.create({
    data: {
      email: 'officer@example.com',
      password: passwordHash,
      role: 'OFFICER',
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash,
      role: 'ADMIN',
    }
  })

  // 2. Create Hotel
  const hotel = await prisma.hotel.create({
    data: {
      userId: hotelUser.id,
      name: 'Green Leaf Restaurant',
      ownerName: 'John Doe',
      fssaiNumber: 'FSSAI1234567890',
      phone: '9876543210',
      address: '123 MG Road',
      city: 'Bangalore',
      isVerified: true
    }
  })

  await prisma.hotel.create({
    data: {
      userId: adminUser.id, // Just creating more hotels without separate users for now, or fake users
      name: 'Spice Garden Hotel',
      ownerName: 'Jane Smith',
      fssaiNumber: 'FSSAI0987654321',
      phone: '9876543211',
      address: '456 Brigade Road',
      city: 'Bangalore',
      isVerified: false
    }
  })

  // 3. Create Officer
  const officer = await prisma.officer.create({
    data: {
      userId: officerUser.id,
      name: 'Inspector Ramesh',
      officerId: 'OFF-KA-001',
      phone: '9876543212',
      department: 'Food Safety Division',
      designation: 'Senior Inspector',
      assignedArea: 'Central Bangalore'
    }
  })

  // 4. Create Products
  const product1 = await prisma.product.create({
    data: {
      hotelId: hotel.id,
      name: 'Tomato Sauce',
      brand: 'ABC',
      category: 'Condiments',
      batchNumber: 'B1023',
      manufacturingDate: new Date('2023-01-10'),
      expiryDate: new Date('2024-01-10'), // Expired
      purchaseDate: new Date('2023-05-15'),
      supplierName: 'XYZ Foods',
      quantity: 10,
      description: 'Used for pasta and pizza',
      status: 'EXPIRED'
    }
  })

  const product2 = await prisma.product.create({
    data: {
      hotelId: hotel.id,
      name: 'Milk',
      brand: 'FreshCow',
      category: 'Dairy',
      batchNumber: 'M234',
      manufacturingDate: new Date(),
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Expires in 5 days
      purchaseDate: new Date(),
      supplierName: 'Local Dairy Co',
      quantity: 50,
      description: 'Daily usage',
      status: 'VERIFIED'
    }
  })

  // 5. Verification Results
  await prisma.verificationResult.create({
    data: {
      productId: product1.id,
      isExpired: true,
      billMatch: true,
      overallConfidence: 94.5,
      ocrData: JSON.stringify({ extractedExpiry: '2024-01-10' })
    }
  })

  await prisma.verificationResult.create({
    data: {
      productId: product2.id,
      isExpired: false,
      billMatch: true,
      overallConfidence: 98.2,
      ocrData: JSON.stringify({ extractedExpiry: '2024-12-31' })
    }
  })

  // 6. Inspections & Violations
  const inspection1 = await prisma.inspection.create({
    data: {
      productId: product1.id,
      officerId: officer.id,
      comments: 'Product found expired during digital review. Please discard immediately.',
      actionTaken: 'FLAGGED'
    }
  })

  await prisma.violation.create({
    data: {
      inspectionId: inspection1.id,
      officerId: officer.id,
      type: 'Expired Food Product',
      severity: 'HIGH',
      description: 'Tomato sauce was expired by several months.',
      status: 'OPEN'
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
