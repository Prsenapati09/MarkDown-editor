import express from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { documentValidation, validate } from '../middleware/validators.js';

const router = express.Router();

// Every document route requires a logged-in user
router.use(protect);

router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', writeLimiter, documentValidation, validate, createDocument);
router.put('/:id', writeLimiter, documentValidation, validate, updateDocument);
router.delete('/:id', deleteDocument);

export default router;
