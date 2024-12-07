import sellManager from "../dao/db/sellManager.js";

class sellController {
  async newSell(req, res) {
    try {
      const { products, client } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Debe incluir al menos un producto.' });
      }

      const productosInvalidos = products.filter(p => !p.productId || !p.quantity || !p.salePrice || !p.buyPrice);
      if (productosInvalidos.length > 0) {
        return res.status(400).json({ error: 'Los productos deben tener productId, quantity, sellPrice y buyPrice.' });
      }

      const venta = await sellManager.newSell({ products, client });
      res.status(201).json({ mensaje: 'Venta registrada con éxito.', venta });
    } catch (error) {
      console.error('Error al crear la venta:', error);
      res.status(500).json({ error: 'Hubo un error al guardar la venta.' });
    }
  };

  async getSells(req, res) {
    try {
      const ventas = await sellManager.getSells()
      res.send(ventas)
    } catch (error) {
      res.status(500).send(`Error al obtener las ventas: ${error}`);
    }
  }
}

export default new sellController();
