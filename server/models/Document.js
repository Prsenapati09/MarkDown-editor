import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
      default: 'Untitled Document',
    },
    content: {
      // Raw markdown text as typed by the user.
      // NOTE: this is sanitized on write (see documentController) and
      // MUST be sanitized again on render in the frontend (DOMPurify /
      // react-markdown's built-in escaping) before being shown as HTML.
      type: String,
      default: '',
      maxlength: [200000, 'Document is too large'],
    },
  },
  { timestamps: true }
);

// Common query pattern: fetch all docs for a user, most recently updated first
documentSchema.index({ user: 1, updatedAt: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
