import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import configObject from "./general.config.js";
import UserModel from '../DAO/models/user.model.js';

const { jwtSecret } = configObject;

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
};

export default initializePassport;
