import { createHash, isValidPassword } from "../utils/util.js";
import userRepository from '../repository/userRepository.js';

class UserServices {
  async getAllClients () {
    return await userRepository.getAllClients()
  }

  async createClient (clientData) {
    return await userRepository.createNewClient(clientData);
  }

  async getUserProfile(session) {
    if (!session || !session.user) throw new Error('User not authenticated');
    const user = await userRepository.getUserById(session.user._id);
    const cart = await userRepository.getUserCart(user.cart);
    return { user, cart };
  };

  async registerUser(data) {
    const userExists = await userRepository.getUserByEmail(data.email);
    if (userExists) throw new Error('El usuario ya existe');
    data.password = createHash(data.password);
    return await userRepository.createUser(data);
  };

  async loginUser(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user || !isValidPassword(password, user)) throw new Error('Credenciales incorrectas');
    return user;
  };

  async updateUser(id, updateData) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error('Usuario no encontrado');
    Object.assign(user, updateData);
    return await user.save();
  };

  async deleteUser(id) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error('Usuario no encontrado');
    return await userRepository.deleteUser(id);
  };

  async findByEmail(email) {
    return await userRepository.getUserByEmail(email);
  };
}

export default new UserServices();
