import cartDao from "../dao/cartDao.js";

class cartRepository{
  async createCart(){
    return await cartDao.create({products:[]});
  };

  async getCartById(id){
    const cart = await cartDao.findById(id);
    return cart
  };

  async updateCart(id, products){
    return await cartDao.update(id, products);
  };

  async deleteCart(id){
    return await cartDao.delete(id);
  };
};

export default new cartRepository();
