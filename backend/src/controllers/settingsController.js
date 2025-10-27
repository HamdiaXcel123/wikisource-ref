import UserSettings from '../models/UserSettings.js';

// Get user settings
export const getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user._id });

    // Create default settings if none exist
    if (!settings) {
      settings = await UserSettings.create({ user: req.user._id });
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const allowedUpdates = ['notifications', 'privacy', 'display', 'account'];
    const updates = {};

    // Filter only allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    let settings = await UserSettings.findOne({ user: req.user._id });

    if (!settings) {
      settings = await UserSettings.create({
        user: req.user._id,
        ...updates
      });
    } else {
      // Deep merge updates
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          settings[key] = { ...settings[key].toObject(), ...updates[key] };
        } else {
          settings[key] = updates[key];
        }
      });
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    await UserSettings.findOneAndDelete({ user: req.user._id });
    const settings = await UserSettings.create({ user: req.user._id });

    res.json({
      success: true,
      message: 'Settings reset to default',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};
