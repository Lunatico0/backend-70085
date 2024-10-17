import cartDao from "../DAO/cartDao.js";

class cartRepository{
  async createCart(){
    return await cartDao.create({products:[]});
  };

  async getCartById(id){
    return await cartDao.findById(id);
  };

  async updateCart(id, products){
    return await cartDao.update(id, products);
  };

  async deleteCart(id){
    return await cartDao.delete(id);
  };
};

export default new cartRepository();
