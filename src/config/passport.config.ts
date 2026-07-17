import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../modules/user/user.model.js';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile.emails?.[0].value });
            if (!user) {
                user = await UserModel.create({
                    userName: profile.displayName,
                    email: profile.emails?.[0].value,
                    password: Math.random().toString(36),
                    profileImage: profile.photos?.[0].value
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
}

export default passport;