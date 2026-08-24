import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      phone: String,
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ['COD', 'CARD', 'UPI', 'NETBANKING'],
        default: 'COD',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      // --- Cashfree-specific fields, see note below ---
      cfOrderId: String,        // Cashfree's order_id
      cfPaymentId: String,      // Cashfree's cf_payment_id after payment
      paymentSessionId: String, // needed to init checkout on frontend
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;