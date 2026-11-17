import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from '@waylo/shared';

export class DocumentsService {
  /**
   * List trip documents accessible to current user (shared or uploaded by user)
   */
  async listDocuments(tripId: string, currentUserId: string) {
    return prisma.tripDocument.findMany({
      where: {
        tripId,
        OR: [{ isShared: true }, { uploadedById: currentUserId }],
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single document details
   */
  async getDocument(documentId: string, currentUserId: string) {
    const document = await prisma.tripDocument.findUnique({
      where: { id: documentId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw AppError.notFound('Document not found');
    }

    if (!document.isShared && document.uploadedById !== currentUserId) {
      throw AppError.forbidden('You do not have permission to view this private document');
    }

    return document;
  }

  /**
   * Create document record
   */
  async createDocument(tripId: string, userId: string, data: CreateDocumentInput) {
    return prisma.tripDocument.create({
      data: {
        tripId,
        uploadedById: userId,
        title: data.title,
        documentType: data.documentType || 'OTHER',
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileSize: data.fileSize || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isShared: data.isShared ?? true,
        notes: data.notes || null,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Update document record
   */
  async updateDocument(documentId: string, userId: string, data: UpdateDocumentInput) {
    const existing = await prisma.tripDocument.findUnique({
      where: { id: documentId },
    });

    if (!existing) {
      throw AppError.notFound('Document not found');
    }

    return prisma.tripDocument.update({
      where: { id: documentId },
      data: {
        title: data.title ?? undefined,
        documentType: data.documentType ?? undefined,
        fileUrl: data.fileUrl !== undefined ? data.fileUrl : undefined,
        fileName: data.fileName !== undefined ? data.fileName : undefined,
        fileSize: data.fileSize !== undefined ? data.fileSize : undefined,
        expiryDate: data.expiryDate !== undefined ? (data.expiryDate ? new Date(data.expiryDate) : null) : undefined,
        isShared: data.isShared !== undefined ? data.isShared : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete document record
   */
  async deleteDocument(documentId: string, userId: string) {
    const existing = await prisma.tripDocument.findUnique({
      where: { id: documentId },
    });

    if (!existing) {
      throw AppError.notFound('Document not found');
    }

    await prisma.tripDocument.delete({ where: { id: documentId } });
    return { success: true, message: 'Document deleted successfully' };
  }
}

export const documentsService = new DocumentsService();
