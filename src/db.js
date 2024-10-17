import mongoose from 'mongoose';
import configObject from "./config/general.config.js";

const { TOKEN } = configObject;

mongoose.connect(TOKEN)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));
