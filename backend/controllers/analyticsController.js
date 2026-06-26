import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const order = await Order.find({});

    const totalRevenueData = order.reduce(
      (acc, order) => acc + order.totalAmount,
      0,
    );

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenueData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { getAdminStats };
