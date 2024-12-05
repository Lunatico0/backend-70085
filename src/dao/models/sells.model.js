import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const sellSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  client: {
    name: { type: String, default: null },
    lastName: { type: String, default: null }, // Corregido
    email: { type: String, default: null },
    address: { type: String, default: null }
  },
  date: { type: Date, default: Date.now } // Simplificado
});

sellSchema.plugin(mongoosePaginate);

const SellsModel = mongoose.models.ventas || mongoose.model('ventas', sellSchema);

export default SellsModel;
