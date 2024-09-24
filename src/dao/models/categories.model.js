import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  subcategoriaId: {
    type: String,
    required: true
  },
  subcategoriaNombre: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema({
  categoriaId: {
    type: String,
    required: true,
    unique: true
  },
  categoriaNombre: {
    type: String,
    required: true
  },
  subcategorias: [subCategorySchema]
});

const CategoryModel = mongoose.model('categories', categorySchema);

export default CategoryModel;