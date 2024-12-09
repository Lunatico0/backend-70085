import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password:{
    type: String,
  },
  age:{
    type: Number,
    required: true
  },
  role:{
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carts'
  }
});

const UserModel = mongoose.model('users', schema);

export default UserModel;
