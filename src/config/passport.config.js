import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import configObject from "./general.config.js";
import UserModel from '../DAO/models/user.model.js';

const { jwtSecret, googleClientID, googleClientSecret, githubClientID, githubClientSecret } = configObject;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const JWTOpctions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: jwtSecret
};

const initializePassport = () => {
  // Current Strategy
  passport.use("current", new JwtStrategy(JWTOpctions, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google strategy
  passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "http://localhost:8080/api/sessions/googlecallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ email: profile.emails[0].value });
      console.log(user)
      if (!user) {
        user = new UserModel({
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password: null
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  // GitHub strategy
  passport.use(new GitHubStrategy({
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ email: profile.emails[0].value });
      console.log(user)
      if (!user) {
        user = new UserModel({
          name: profile.username,
          lastName: '',
          email: profile.emails[0].value,
          password: null
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};



export default initializePassport;
