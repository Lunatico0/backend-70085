import cartDao from "../dao/cartDao.js";
import userDao from "../dao/userDao.js";

class userRepositorie {
  async createUser(data){
    return userDao.save(data);
  };

  async getUserById(id){
    const user = await userDao.findById(id);
    if(!user) throw new Error("Usuario no encontrado");
    return user;
  };

  async getUserByEmail(email) {
    return await userDao.findByEmail(email);
  }

  async updateUser(id, updateData) {
    return await userDao.updateOne({ _id: id }, updateData);
  };

  async deleteUser(id) {
    return await userDao.deleteOne({ _id: id });
  };

  async getUserCart(cartId) {
    return await cartDao.findById(cartId);
  };
};

export default new userRepositorie();
