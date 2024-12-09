import UserModel from "./models/user.model.js";

class userDao {
  async findById(id) {
    return await UserModel.findById(id);
  };

  async save(data) {
    const user = new UserModel(data);
    return await user.save();
  };

  async updateOne(query, updateData) {
    return await UserModel.updateOne(query, updateData);
  };

  async deleteOne(query) {
    return await UserModel.deleteOne(query);
  };

  async findByEmail(email) {
    return await UserModel.findOne({ email: email });
  }
};

export default new userDao();
