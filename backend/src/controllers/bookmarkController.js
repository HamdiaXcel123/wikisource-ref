import Bookmark from '../models/Bookmark.js';
import Submission from '../models/Submission.js';

// Get user bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 20, folder } = req.query;
    
    const query = { user: req.user._id };
    if (folder) {
      query.folder = folder;
    }

    const bookmarks = await Bookmark.find(query)
      .populate({
        path: 'submission',
        populate: {
          path: 'submitter',
          select: 'username country'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bookmark.countDocuments(query);

    // Get all folders
    const folders = await Bookmark.distinct('folder', { user: req.user._id });

    res.json({
      success: true,
      bookmarks,
      folders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookmarks',
      error: error.message
    });
  }
};

// Add bookmark
export const addBookmark = async (req, res) => {
  try {
    const { submissionId, notes, tags, folder } = req.body;

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      user: req.user._id,
      submission: submissionId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already bookmarked'
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      submission: submissionId,
      notes,
      tags,
      folder: folder || 'default'
    });

    const populatedBookmark = await Bookmark.findById(bookmark._id)
      .populate({
        path: 'submission',
        populate: {
          path: 'submitter',
          select: 'username country'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Bookmark added',
      bookmark: populatedBookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding bookmark',
      error: error.message
    });
  }
};

// Update bookmark
export const updateBookmark = async (req, res) => {
  try {
    const { notes, tags, folder } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes, tags, folder },
      { new: true, runValidators: true }
    ).populate({
      path: 'submission',
      populate: {
        path: 'submitter',
        select: 'username country'
      }
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.json({
      success: true,
      message: 'Bookmark updated',
      bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bookmark',
      error: error.message
    });
  }
};

// Delete bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.json({
      success: true,
      message: 'Bookmark removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bookmark',
      error: error.message
    });
  }
};

// Check if submission is bookmarked
export const checkBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      submission: req.params.submissionId
    });

    res.json({
      success: true,
      bookmarked: !!bookmark,
      bookmark: bookmark || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking bookmark',
      error: error.message
    });
  }
};
