import type { Request, Response, NextFunction } from 'express';
import { documentsService } from './documents.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getDocuments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const documents = await documentsService.listDocuments(tripId, userId);
    sendSuccess(res, documents);
  } catch (error) {
    next(error);
  }
}

export async function getDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId } = req.params;
    const userId = req.user!.id;
    const document = await documentsService.getDocument(documentId, userId);
    sendSuccess(res, document);
  } catch (error) {
    next(error);
  }
}

export async function createDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const document = await documentsService.createDocument(tripId, userId, req.body);
    sendSuccess(res, document, 'Document uploaded to trip vault', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId } = req.params;
    const userId = req.user!.id;
    const document = await documentsService.updateDocument(documentId, userId, req.body);
    sendSuccess(res, document, 'Document updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId } = req.params;
    const userId = req.user!.id;
    const result = await documentsService.deleteDocument(documentId, userId);
    sendSuccess(res, result, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
}
