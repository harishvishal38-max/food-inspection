import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await decrypt(sessionCookie)
    if (session.role !== 'OFFICER') {
      return NextResponse.json({ error: 'Forbidden. Only Food Safety Officers can record inspections.' }, { status: 403 })
    }

    const officer = await prisma.officer.findUnique({
      where: { userId: session.id }
    })

    if (!officer) {
      return NextResponse.json({ error: 'Officer profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      productId,
      actionTaken, // 'APPROVED' | 'REJECTED' | 'FLAGGED'
      comments,
      violationType,
      severity,
      violationDescription
    } = body

    if (!productId || !actionTaken) {
      return NextResponse.json({ error: 'Product ID and Action Taken are required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { hotel: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Determine new product status
    let newStatus = 'VERIFIED'
    if (actionTaken === 'REJECTED') {
      newStatus = 'REJECTED'
    } else if (actionTaken === 'FLAGGED') {
      newStatus = 'FLAGGED'
    }

    // Check if inspection already exists or create new
    const existingInspection = await prisma.inspection.findUnique({
      where: { productId }
    })

    let inspection: any
    if (existingInspection) {
      inspection = await prisma.inspection.update({
        where: { id: existingInspection.id },
        data: {
          officerId: officer.id,
          comments: comments || '',
          actionTaken
        }
      })
    } else {
      inspection = await prisma.inspection.create({
        data: {
          productId,
          officerId: officer.id,
          comments: comments || '',
          actionTaken
        }
      })
    }

    // Update Product status
    await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus }
    })

    // If violation is logged
    if (actionTaken === 'REJECTED' || actionTaken === 'FLAGGED' || violationType) {
      await prisma.violation.create({
        data: {
          inspectionId: inspection.id,
          officerId: officer.id,
          type: violationType || 'Food Safety Non-Compliance',
          severity: severity || 'HIGH',
          description: violationDescription || comments || 'Product failed safety standards inspection.',
          status: 'OPEN'
        }
      })
    }

    // Create or update inspection report
    const reportData = {
      inspectionId: inspection.id,
      officer: {
        name: officer.name,
        officerId: officer.officerId,
        department: officer.department,
        designation: officer.designation
      },
      product: {
        name: product.name,
        brand: product.brand,
        batchNumber: product.batchNumber,
        category: product.category,
        expiryDate: product.expiryDate
      },
      hotel: {
        name: product.hotel.name,
        fssaiNumber: product.hotel.fssaiNumber,
        city: product.hotel.city
      },
      actionTaken,
      comments: comments || 'Inspection completed successfully.',
      timestamp: new Date().toISOString()
    }

    await prisma.inspectionReport.upsert({
      where: { inspectionId: inspection.id },
      update: { reportData: JSON.stringify(reportData) },
      create: {
        inspectionId: inspection.id,
        reportData: JSON.stringify(reportData)
      }
    })

    // Notify the Hotel
    const notifTitle = actionTaken === 'APPROVED' 
      ? '✅ Product Inspection Approved' 
      : actionTaken === 'REJECTED' 
      ? '🚫 Inspection Failed / Violation Issued' 
      : '⚠️ Product Flagged for Review'

    const notifMessage = actionTaken === 'APPROVED'
      ? `Officer ${officer.name} approved your product "${product.name}" (${product.batchNumber}).`
      : `Officer ${officer.name} took action "${actionTaken}" on "${product.name}". Notes: ${comments || 'Check inspection details.'}`

    await prisma.notification.create({
      data: {
        userId: product.hotel.userId,
        title: notifTitle,
        message: notifMessage
      }
    })

    return NextResponse.json({ success: true, inspection, productStatus: newStatus })
  } catch (error: any) {
    console.error('Inspection error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
