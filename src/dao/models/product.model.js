import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: [
    {
      label: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
  ],
  price: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    categoriaId: {
      type: String,
      required: true
    },
    categoriaNombre: {
      type: String,
      required: true
    },
    subcategoria: {
      subcategoriaId: {
        type: String,
        required: false
      },
      subcategoriaNombre: {
        type: String,
        required: false
      },
      subsubcategoria:{
        subsubcategoriaId: {
          type: String,
          required: false
        },
        subsubcategoriaNombre: {
          type: String,
          required: false
        },
      },
    }
  },
  thumbnails: {
    type: [String]
  },
  status: {
    type: Boolean,
    required: true
  }
});

productSchema.plugin(mongoosePaginate);
productSchema.index({ "description.value": "text" });

const ProductModel = mongoose.models.products || mongoose.model('products', productSchema);

export default ProductModel;
