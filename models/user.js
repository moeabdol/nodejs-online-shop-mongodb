const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          requird: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product, cb) {
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  const cartProductIndex = this.cart.items.findIndex(cartProduct => {
    return cartProduct.productId.toString() === product._id.toString();
  });

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;

  return this.save(cb);
};

userSchema.methods.removeFromCart = function(productId, cb) {
  const updatedCartItems = this.cart.items.filter(product => {
    return product._id.toString() === productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save(cb);
};

userSchema.methods.clearCart = function(cb) {
  this.cart = { items: [] };
  return this.save(cb);
};

module.exports = mongoose.model('User', userSchema);
