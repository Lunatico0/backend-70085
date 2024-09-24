import mongoose from "mongoose";

const cartSchemma = new mongoose.Schema({
  products:[
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

cartSchemma.pre(['find','findOne', 'findById'], function(next){
  this.populate('products.product');
  next();
})

const CartModel = mongoose.model("carts", cartSchemma);

export default CartModel;