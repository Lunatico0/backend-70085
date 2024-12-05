import sellManager from "../DAO/db/sellManager.js";

const crearVenta = async (req, res) => {
  try {
    const { products, client } = req.body;

    // Validación básica
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto.' });
    }

    // Validación de productos
    const productosInvalidos = products.filter(p => !p.productId || !p.quantity || !p.price);
    if (productosInvalidos.length > 0) {
      return res.status(400).json({ error: 'Los productos deben tener productId, quantity y price.' });
    }

    const venta = await sellManager.crearVenta({ products, client });
    res.status(201).json({ mensaje: 'Venta registrada con éxito.', venta });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ error: 'Hubo un error al guardar la venta.' });
  }
};

export default { crearVenta };
