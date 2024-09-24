import ProductModel from '../models/product.model.js';
import mongoose from 'mongoose';

class ProductManager {
  async addProduct({ title, description, price, code, stock, category, thumbnails }) {
    try {
      if (!title || !Array.isArray(description) || description.length === 0 || !price || !code || !category || !stock) {
        console.log("Todos los campos son obligatorios");
        return "Todos los campos son obligatorios";
      }

      const existProduct = await ProductModel.findOne({ code });

      if (existProduct) {
        console.log("El código del producto ya existe, el codigo deve ser unico");
        return "El código del producto ya existe, el codigo deve ser unico";
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      });

      await newProduct.save();
      console.log("Producto agregado correctamente");
      return newProduct;

    } catch (error) {
      console.log("Error al agregar productos");
      throw error;
    }
  };

  async getProducts(page, limit, sort, category = null, subcategory = null) {
    const query = {};

    if (category) {
      query["category.categoriaId"] = category;
    }

    if (subcategory) {
      query["category.subcategoria.subcategoriaId"] = subcategory;
    }
  
    const options = {
      page,
      limit,
      sort,
    };
  
    try {
      const productsList = await ProductModel.paginate(query, options);
      return {
        prodRender: productsList.docs,
        productsList,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async updateProduct(id, data) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(id, data);
      if (!updated) {
        console.log("No se encontró el producto");
        return "No se encontró el producto";
      }
      return updated;
    } catch (error) {
      console.error(error);
    }
  };

  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);
      if (!deleted) {
        console.log("No se encontró el producto");
        return "No se encontró el producto";
      }
      return deleted;
    } catch (error) {
      console.error(error);
    }
  };

  async getProductsById(id) {
    try {
      const searchProduct = await ProductModel.findById(id);

      if (!searchProduct) {
        console.log("No se encuentra el producto");
        return "No se encuentra el producto";
      }

      return searchProduct;
    } catch (error) {
      console.error("Error al buscar el producto: ", error);
    }
  };
};

export default ProductManager;