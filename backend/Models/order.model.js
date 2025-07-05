
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
     email: String,
      userId: String,
      clothId: String,
      payemntId: String,
      amount:Number,
      status: String,
});


export const Order = mongoose.model("Order", orderSchema);