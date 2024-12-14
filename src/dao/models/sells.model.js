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
      salePrice: {
        type: Number,
        required: true
      },
      buyPrice: {
        type: Number,
        required: true
      }
    }
  ],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients',
    required: true
  },
  date: { type: Date, default: Date.now }
});

sellSchema.plugin(mongoosePaginate);

const SellsModel = mongoose.models.ventas || mongoose.model('ventas', sellSchema);

export default SellsModel;
