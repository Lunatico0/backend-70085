import passport from 'passport';
import jwt from 'passport-jwt';
import { config } from "dotenv";

config();

const jwtSecret = process.env.JWT_SECRET;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = (users) => {
  passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }))
};

const cookieExtractor = (req) => {
  let token = null;
  if( req && req.cookies ) {
    token = req.cookies['token'];
  }
  return token
}

export default initializePassport;
