import mongoose from 'mongoose';


const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    qualtity: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now()
    }
})

const Cart =  mongoose.model('Cart', cartSchema);

export default Cart;