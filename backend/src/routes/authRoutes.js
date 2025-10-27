import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  updateProfile,
  changePassword,
  wikimediaCallback,
  completeWikimediaSetup
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Local authentication routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Wikimedia OAuth routes - passport will be injected dynamically
router.get('/wikimedia', async (req, res, next) => {
  const { default: passport } = await import('../config/passport.js');
  passport.authenticate('wikimedia')(req, res, next);
});

router.get('/wikimedia/callback', async (req, res, next) => {
  const { default: passport } = await import('../config/passport.js');
  passport.authenticate('wikimedia', { 
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=authentication_failed`,
    session: false 
  })(req, res, next);
}, wikimediaCallback);

router.post('/wikimedia/setup', completeWikimediaSetup);

export default router;
