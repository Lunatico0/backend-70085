import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from "dotenv";
config();

const jwtSecret = process.env.JWT_SECRET;

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
  passport.use("current", new JwtStrategy( JWTOpctions, async (jwt_payload, done) => {
      try {
          return done(null, jwt_payload);
      } catch (error) {
          return done(error);
      }
  }))
};

export default initializePassport;
