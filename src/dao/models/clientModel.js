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
  },
  email:{
    type: String,
  },
  phone:{
    type: Number,
  },
  address:{
    street:{
      type: String,
    },
    number:{
      type: Number,
    },
    city:{
      type: String,
    },
    province:{
      type: String,
    },
    country:{
      type: String,
      default: "Argentina"
    },
    zipCode:{
      type: Number,
    }
  }
});

const ClientModel = mongoose.model('clients', schema);

export default ClientModel;
