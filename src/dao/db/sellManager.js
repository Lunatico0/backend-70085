import SellsModel from "../models/sells.model.js";

class VentasManager {
  async crearVenta(datos) {
    try {
      const nuevaVenta = new SellsModel(datos);
      return await nuevaVenta.save();
    } catch (error) {
      throw new Error('Error al guardar la venta: ' + error.message);
    }
  }
}

export default new VentasManager();
