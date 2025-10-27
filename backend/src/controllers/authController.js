import User from '../models/User.js';
import { sendTokenResponse, verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password, country } = req.body;

    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Country:', country);
    console.log('Password length:', password ? password.length : 0);

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      country
    });

    console.log('✅ User created successfully:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    if (error.code === 11000) {
      console.log('Duplicate key error. Field:', Object.keys(error.keyPattern));
    }
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Received username:', username);
    console.log('Received password length:', password ? password.length : 0);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Find user and include password
    const user = await User.findOne({ username }).select('+password');

    console.log('User found in database:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User details:', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        hasPassword: !!user.password
      });
    }

    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('❌ Login failed: Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ Login failed: Account deactivated');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    console.log('✅ Login successful for user:', username);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log('❌ Login error:', error.message);
    console.log('Error stack:', error.stack);
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      })
      .cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      })
      .json({
        success: true,
        message: 'Logged out successfully'
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken,
      user: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { email, country } = req.body;

    const fieldsToUpdate = {};
    if (email) fieldsToUpdate.email = email;
    if (country) fieldsToUpdate.country = country;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check if user uses local auth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for OAuth users'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Wikimedia OAuth callback
// @route   GET /api/auth/wikimedia/callback
// @access  Public
export const wikimediaCallback = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=authentication_failed`);
    }

    // Check if user needs to set country
    if (user.country === 'Unknown') {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?setup=true&userId=${user._id}`);
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Complete Wikimedia OAuth setup
// @route   POST /api/auth/wikimedia/setup
// @access  Public
export const completeWikimediaSetup = async (req, res, next) => {
  try {
    const { userId, country } = req.body;

    if (!userId || !country) {
      return res.status(400).json({
        success: false,
        message: 'User ID and country are required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.country = country;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
