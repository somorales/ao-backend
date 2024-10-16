const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  price: Number, // the price of the transaction at the moment of purchase, in cents.
  paymentIntentId: String, // used for updating the status securely
  clientSecret: String, // used for updating the status securely
  status: {
    type: String,
    enum: ["incomplete", "succeeded"],
    default: "incomplete",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

const Payment = model("Payment", paymentSchema);

module.exports = Payment;