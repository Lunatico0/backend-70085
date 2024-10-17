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
}

export default configObject;
