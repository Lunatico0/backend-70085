const validarVenta = (req, res, next) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Debe incluir al menos un producto.' });
  }

  const productosInvalidos = products.filter(p => !p.productId || !p.quantity || !p.price);
  if (productosInvalidos.length > 0) {
    return res.status(400).json({ error: 'Los productos deben tener productId, quantity y price.' });
  }

  next();
};

export default validarVenta;
