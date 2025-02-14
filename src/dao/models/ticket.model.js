import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  purchaser: {
    email: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    telefono: {
      type: String
    },
    direccion: {
      type: String
    },
    localidad: {
      type: String
    },
    comentarios: {
      type: String
    }
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  amount: {
    type: Number,
    required: true,
    min: 0

  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'

  },
  purchase_datetime: {
    type: Date,
    default: Date.now

  },
  updatedAt: {
    type: Date,
    default: Date.now

  }
});

ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TicketModel = mongoose.model('tickets', ticketSchema);

export default TicketModel;
