import ProductModel from '../models/product.model.js';

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

      const priceWithIVA = parseFloat((price * 1.21));

      const newProduct = new ProductModel({
        title,
        description,
        price: priceWithIVA,
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

  async getProducts(page, limit, sort, category, subcategory, subsubcategory, search = "") {
    const query = {};

    // Agregar filtro de búsqueda
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "description.value": { $regex: search, $options: "i" } }, // Buscamos en description.value
      ];
    }

    // Filtrar por categoría
    if (category && category !== "null") {
      query["category.categoriaId"] = category;
    }
    if (subcategory && subcategory !== "null") {
      query["category.subcategoria.subcategoriaId"] = subcategory;
    }
    if (subsubcategory && subsubcategory !== "null") {
      query["category.subcategoria.subsubcategoria.subsubcategoriaId"] = subsubcategory;
    }

    const options = {
      page,
      limit,
      sort, // Mongoose Paginate permite un objeto sort aquí
      lean: true, // Devuelve objetos JSON limpios en lugar de documentos Mongoose
    };

    try {
      const productsList = await ProductModel.paginate(query, options);

      return {
        prodRender: productsList.docs,
        productsList,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  async updateProduct(id, data) {
    try {
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        console.log("No se encontró el producto");
        return "No se encontró el producto";
      }
  
      data.price = parseFloat(data.price * 1.21).toFixed(2);
  
      const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true });
  
      console.log(`Producto actualizado correctamente. Nuevo precio con IVA: ${data.price}`);
      return updated;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
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
