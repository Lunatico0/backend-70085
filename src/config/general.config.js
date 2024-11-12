import { config } from "dotenv";
import program from "../utils/commander.js";

const { mode } = program.opts();

config({
  path: mode === 'dev' ? './.env.dev' : './.env.prod',
});

const configObject = {
  PORT: process.env.PORT,
  TOKEN: process.env.URI,
  jwtSecret: process.env.JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  mailerPassword: process.env.MAILER_PASSWORD,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  githubClientID: process.env.GitHub_CLIENT_ID,
  githubClientSecret: process.env.GitHub_CLIENT_SECRET
}

export default configObject;
