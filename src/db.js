import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const TOKEN = process.env.URI;

mongoose.connect(TOKEN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));
