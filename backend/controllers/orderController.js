import Order from "../model/Order.js";
import sendEmail from "../utils/sendEmail.js";

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0 || !totalAmount || !address) {
      res.status(400).json({ message: "Invalid order data" });
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentId,
      });

      await order.save();
      //for sending order cofirmation email to user
      await sendEmail({
        to: req.user.email,
        subject: "Order Confirmation",
        text: `Your order with ID ${order._id} has been successfully placed. Total Amount: ${totalAmount}. Thank you for shopping with us!`,
      });
      res.status(201).json({ message: "Order created successfully", order });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.productId",
      "name price",
    );
    res.json(orders);
  } catch (error) {
    res.staus(500).json({ message: "Error fetchinh orders" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrder = async(req,res)=>{

}
