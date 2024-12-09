import ClientModel from "./models/clientModel.js";

class ClientDAO {
  async findAll() {
    return await ClientModel.find();
  }

  async create(clientData) {
    const newClient = new ClientModel(clientData);
    return await newClient.save();
  }

  async findClientById(id) {
    return await ClientModel.findById(id);
  }
}

export default new ClientDAO();
