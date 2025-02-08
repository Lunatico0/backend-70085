import ProductManager from "../dao/db/productManagerDb.js";
import CategoryModel from '../dao/models/categories.model.js'
const manager = new ProductManager();

class productController {
  async getAllProducts(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    const querySort = req.query.sort || "defa";
    const category = req.query.category || null;
    const subcategory = req.query.subcategory || null;
    const subsubcategory = req.query.subsubcategory || null;
    let sort = {};

    switch (querySort) {
      case "price_asc": sort = { price: 1 }; break;
      case "price_desc": sort = { price: -1 }; break;
      case "alpha_asc": sort = { title: 1 }; break;
      case "alpha_desc": sort = { title: -1 }; break;
      case "defa": sort = { createdAt: 1 }; break;
      default: break;
    }

    try {
      const { prodRender, productsList } = await manager.getProducts(page, limit, sort, category, subcategory, subsubcategory);

      res.json({
        status: "success",
        payload: prodRender,
        totalPages: productsList.totalPages,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        page: productsList.page,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevLink: productsList.hasPrevPage
          ? `/api/products?page=${productsList.prevPage}&limit=${limit}&sort=${querySort}&category=${category}&subcategory=${subcategory}&subsubcategory=${subsubcategory}`
          : null,
        nextLink: productsList.hasNextPage
          ? `/api/products?page=${productsList.nextPage}&limit=${limit}&sort=${querySort}&category=${category}&subcategory=${subcategory}&subsubcategory=${subsubcategory}`
          : null,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.find().lean();
      res.json({
        status: "success",
        categories: categories
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(req, res) {
    let id = req.params.pid;
    try {
      const product = await manager.getProductsById(id);
      !product ? res.send("No se encuentra el producto deseado") : res.send({ product });
    } catch (error) {
      console.log(error)
    }
  };

  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      await manager.addProduct(newProduct);
      res.status(201).send({ message: "Producto agregado exitosamente", newProduct });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  async updateProduct(req, res) {
    const id = req.params.pid;
    const newData = req.body;

    if (newData.category && newData.category.categoriaId && newData.category.subcategoria) {
      const { categoriaId, subcategoria } = newData.category;
      newData.category = {
        categoriaId,
        categoriaNombre: categoriaId.charAt(0).toUpperCase() + categoriaId.slice(1),
        subcategoria: {
          subcategoriaId: subcategoria.subcategoriaId,
          subcategoriaNombre: subcategoria.subcategoriaNombre
        }
      };
    }

    try {
      const updatedProduct = await manager.updateProduct(id, newData);
      !updatedProduct ? res.status(404).send({ message: "Error al actualizar el producto" }) : res.status(200).send(`Se ha actualizado el producto ${newData.title} correctamente`);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      const deletedProd = await manager.deleteProduct(id);
      !deletedProd ? res.status(404).send({ message: "Error al eliminar el producto", error: "Producto no encontrado" }) : res.status(200).send(`Se ha eliminado ${deletedProd.title} correctamente`);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };
}

export default productController;
