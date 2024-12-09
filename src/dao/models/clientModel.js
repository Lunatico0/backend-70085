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
  dni:{
    type: Number,
    required: true
  },
  email:{
    type: String,
    required: true,
    index: true,
    unique: true
  },
  phone:{
    type: Number,
    required: true
  },
  address:{
    steet:{
      type: String,
      required: true
    },
    number:{
      type: Number,
      required: true
    },
    city:{
      type: String,
      required: true
    },
    province:{
      type: String,
      required: true
    },
    country:{
      type: String,
      default: "Argentina"
    },
    zipCode:{
      type: Number,
      required: true
    }
  }
});

const ClientModel = mongoose.model('clients', schema);

export default ClientModel;
