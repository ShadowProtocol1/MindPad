const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Strategy - Processing profile:', profile.id, profile.emails?.[0]?.value);
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('Google Strategy - Existing user found:', user.email);
      return done(null, user);
    }
    
    // Check if user exists with the same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      console.log('Google Strategy - Linking Google account to existing user:', user.email);
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = profile.photos?.[0]?.value;
      user.isVerified = true;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    console.log('Google Strategy - Creating new user:', profile.emails[0].value);
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos?.[0]?.value,
      isVerified: true,
      loginMethod: 'google'
    });
    
    await user.save();
    console.log('Google Strategy - New user created:', user.email);
    done(null, user);
  } catch (error) {
    console.error('Google Strategy error:', error);
    done(error, null);
  }
}));

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
