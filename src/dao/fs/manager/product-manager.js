import { promises as fs } from "fs";

class ProductManager {

  static lastId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  };

  async addProduct( { title, description, price, code, stock, category, thumbnails, status } ) {

    try {
      const arrayProducts = await this.readFile();

      if (!title || !description || !price || !code || !category ) {
        console.log("Todos los campos son obligatorios");
        return "Todos los campos son obligatorios";
      }

      if (arrayProducts.some(item => item.code === code)) {
        console.log("El codigo debe ser unico..");
        return "El codigo debe ser unico..";
      }

      const newProduct = {
        id: ++ProductManager.lastId,
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      }

      if (arrayProducts.length > 0) {
        ProductManager.lastId = arrayProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.lastId;

      arrayProducts.push(newProduct);

      await this.saveFile(arrayProducts);

    } catch (error) {
      console.log("Error al agregar productos");
      throw error;
    }
  }

  async getProducts() {
    const newArray = await this.readFile();
    return newArray;
  };

  async updateProduct(id, data) {
    const arrayProd = await this.readFile();
    const indexProd = arrayProd.findIndex((item) => item.id === id);

    try {

      if (indexProd !== -1) {

        arrayProd[indexProd].title = data.title || arrayProd[indexProd].title;
        arrayProd[indexProd].description = data.description || arrayProd[indexProd].description;
        arrayProd[indexProd].price = data.price || arrayProd[indexProd].price;
        arrayProd[indexProd].img = data.img || arrayProd[indexProd].img;
        arrayProd[indexProd].code = data.code || arrayProd[indexProd].code;
        arrayProd[indexProd].stock = data.stock || arrayProd[indexProd].stock;
        arrayProd[indexProd].category = data.category || arrayProd[indexProd].category;
        arrayProd[indexProd].status = data.status || arrayProd[indexProd].status;
        arrayProd[indexProd].thumbnails = data.thumbnails || arrayProd[indexProd].thumbnails;

        await this.saveFile(arrayProd);
        return true;

      } else {

        console.error("No se encuentra el producto");
        return (false, "No se encuentra el producto")

      };

    } catch (error) {

      console.error(error);

    }

  };

  async deleteProduct(id) {
    const arrayProd = await this.readFile();
    const indexProd = arrayProd.findIndex((item) => item.id === id);

    const deletedProd = await this.getProductsById(id);

    if (indexProd !== -1) {
      arrayProd.splice(indexProd, 1);
      console.log("Se elimino correctamente " + deletedProd.title);
      await this.saveFile(arrayProd);
      return deletedProd;
    } else {
      console.log("No se encuentra el producto");
      return "No se encuentra el producto";
    }
  };

  async getProductsById(id) {
    const arrayProd = await this.readFile();
    const found = arrayProd.find((item) => item.id === id);

    if (!found) {
      return console.error("El producto no existe");
    } else {
      return found;
    };

  };

  async readFile() {
    const res = await fs.readFile(this.path, "utf-8");
    const arrayProd = JSON.parse(res);
    return arrayProd;
  }

  async saveFile(arrayProd) {
    await fs.writeFile(this.path, JSON.stringify(arrayProd, null, 2));
  }

};

export default ProductManager;