import SellsModel from "../models/sells.model.js";

class VentasManager {
  async newSell(datos) {
    try {
      const nuevaVenta = new SellsModel(datos);
      return await nuevaVenta.save();
    } catch (error) {
      throw new Error('Error al guardar la venta: ' + error.message);
    }
  };

  async getSells() {
    try {
      const ventas = await SellsModel.find().populate('products');
      return ventas
    } catch (error) {
      throw new Error('Error al obtener las ventas: ' + error.message);
    }
  }
}

export default new VentasManager();
