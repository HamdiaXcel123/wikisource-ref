import Activity from '../models/Activity.js';

// Get user activities
export const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// Get community activities (public feed)
export const getCommunityActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const query = {};
    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .populate('user', 'username country role badges')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching community activities',
      error: error.message
    });
  }
};

// Log activity (internal use)
export const logActivity = async (userId, type, description, metadata = {}, req = null) => {
  try {
    const activityData = {
      user: userId,
      type,
      description,
      metadata
    };

    if (req) {
      activityData.ipAddress = req.ip;
      activityData.userAgent = req.get('user-agent');
    }

    const activity = await Activity.create(activityData);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};
