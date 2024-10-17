import CartModel from './models/cart.model.js';

class cartDao {
  async findById(id){
    const cart = await CartModel.findById(id).populate('products.product', '_id title stock price');
    return cart;
  }

  async save(data) {
    const cart = new CartModel(data);
    return await cart.save();
  }

  async update(id, data){
    return await CartModel.findByIdAndUpdate(id, data);
  }

  async delete(id){
    return await CartModel.findByIdAndDelete(id);
  }
}

export default new cartDao();
