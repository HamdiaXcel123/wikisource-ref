import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import axios from 'axios';
import User from '../models/User.js';

// Validate required environment variables
if (!process.env.WIKIMEDIA_CONSUMER_KEY) {
  throw new Error('WIKIMEDIA_CONSUMER_KEY is not set in environment variables. Please check your .env file.');
}
if (!process.env.WIKIMEDIA_CONSUMER_SECRET) {
  throw new Error('WIKIMEDIA_CONSUMER_SECRET is not set in environment variables. Please check your .env file.');
}
if (!process.env.WIKIMEDIA_CALLBACK_URL) {
  throw new Error('WIKIMEDIA_CALLBACK_URL is not set in environment variables. Please check your .env file.');
}

// Wikimedia OAuth2 configuration
const wikimediaStrategy = new OAuth2Strategy(
  {
    authorizationURL: 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize',
    tokenURL: 'https://meta.wikimedia.org/w/rest.php/oauth2/access_token',
    clientID: process.env.WIKIMEDIA_CONSUMER_KEY,
    clientSecret: process.env.WIKIMEDIA_CONSUMER_SECRET,
    callbackURL: process.env.WIKIMEDIA_CALLBACK_URL,
    scope: 'basic',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Get user info from Wikimedia
      const response = await axios.get('https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const wikimediaProfile = response.data;

      // Find or create user
      let user = await User.findOne({ wikimediaId: wikimediaProfile.sub });

      if (!user) {
        // Check if username already exists
        const existingUser = await User.findOne({ username: wikimediaProfile.username });
        
        if (existingUser) {
          // If user exists with same username but different auth, link accounts
          if (!existingUser.wikimediaId) {
            existingUser.wikimediaId = wikimediaProfile.sub;
            existingUser.wikimediaUsername = wikimediaProfile.username;
            existingUser.authProvider = 'wikimedia';
            await existingUser.save();
            return done(null, existingUser);
          }
          // Username conflict - append suffix
          const newUsername = `${wikimediaProfile.username}_wiki`;
          user = await User.create({
            username: newUsername,
            wikimediaId: wikimediaProfile.sub,
            wikimediaUsername: wikimediaProfile.username,
            authProvider: 'wikimedia',
            country: 'Unknown', // Will be updated by user
            email: wikimediaProfile.email || undefined,
          });
        } else {
          // Create new user
          user = await User.create({
            username: wikimediaProfile.username,
            wikimediaId: wikimediaProfile.sub,
            wikimediaUsername: wikimediaProfile.username,
            authProvider: 'wikimedia',
            country: 'Unknown', // Will be updated by user
            email: wikimediaProfile.email || undefined,
          });
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

passport.use('wikimedia', wikimediaStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
