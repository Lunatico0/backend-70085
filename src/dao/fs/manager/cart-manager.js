import { promises as fs } from "fs";

class CartManager {

  static lastId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  };

  async addCart() {    
    try {
      const arrayCarts = await this.readFile();

      if (arrayCarts.length > 0) {
        CartManager.lastId = arrayCarts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
      }

      const newCart = { id: ++CartManager.lastId, products: [] };

      arrayCarts.push(newCart);
      this.saveFile(arrayCarts);
      return newCart;

    } catch (error) {

      console.log(error);
      throw error;

    };
  };

  async getCartById(id) {
    const carts = await this.readFile();
    const cartById = carts.find((cart) => cart.id === id);
    return cartById;
  };

  async addProductToCart(idCart, idProduct) {
    const carts = await this.readFile();
    const cartIndex = carts.findIndex((cart) => cart.id === idCart);
    const prodIndex = carts[cartIndex].products.findIndex((product) => product.id === idProduct);

    if (cartIndex !== -1) {

      if (prodIndex !== -1) {

        carts[cartIndex].products[prodIndex].quantity++;
        this.saveFile(carts);
        return "Product quantity increased";

      } else {

        const newProduct = { id: idProduct, quantity: 1 };
        carts[cartIndex].products.push(newProduct);
        this.saveFile(carts);
        return "Product added to the cart";

      };
    };

    return "Cart not found";

  };

  async readFile() {
    const res = await fs.readFile(this.path, "utf-8");
    const arrayCart = JSON.parse(res);
    return arrayCart;
  };

  async saveFile(arrayCart) {
    await fs.writeFile(this.path, JSON.stringify(arrayCart, null, 2));
  };
};

export default CartManager;