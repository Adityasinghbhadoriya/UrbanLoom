import { Order } from "../Models/order.model.js";
import { Purchase } from "../Models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    console.log(orderInfo);
    const userId = orderInfo?.userId;
    const clothId = orderInfo?.clothId;
    res.status(201).json({ message: "Order Details: ", orderInfo });
    if (orderInfo) {
      await Purchase.create({ userId, clothId });
    }
  } catch (error) {
    console.log("Error in order: ", error);
    res.status(401).json({ errors: "Error in order creation" });
  }
};