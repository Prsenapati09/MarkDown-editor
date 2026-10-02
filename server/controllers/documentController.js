import xss from 'xss';
import Document from '../models/Document.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @route  GET /api/documents
// Returns only the logged-in user's documents (never another user's)
export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.userId })
    .select('title updatedAt createdAt') // don't send full content in list view
    .sort({ updatedAt: -1 });
  res.json(documents);
});

// @route  GET /api/documents/:id
export const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.userId });
  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }
  res.json(document);
});

// @route  POST /api/documents
export const createDocument = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const document = await Document.create({
    user: req.userId,
    title: title?.trim() || 'Untitled Document',
    // Strip any raw HTML/script tags before storing. react-markdown on the
    // frontend already escapes HTML by default, but sanitizing on write too
    // gives defense-in-depth for any other consumer of this data (API, export, etc.)
    content: xss(content || ''),
  });

  res.status(201).json(document);
});

// @route  PUT /api/documents/:id
export const updateDocument = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const document = await Document.findOne({ _id: req.params.id, user: req.userId });
  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  if (title !== undefined) document.title = title.trim();
  if (content !== undefined) document.content = xss(content);

  await document.save();
  res.json(document);
});

// @route  DELETE /api/documents/:id
export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }
  res.json({ message: 'Document deleted' });
});
