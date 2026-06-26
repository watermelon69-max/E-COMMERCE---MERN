import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDb from "./config/db.js";
import User from "./model/User.js";
import Product from "./model/Product.js";
import Order from "./model/Order.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDb();

    // Clear existing data
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // ── Users ──
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: hashedPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "Anurag Mourya",
        email: "anurag@example.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Rahul Verma",
        email: "rahul@example.com",
        password: hashedPassword,
        role: "user",
        verified: false,
      },
    ]);
    console.log(`Seeded ${users.length} users`);

    // ── Products ──
    const products = await Product.create([
      {
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass sound.",
        price: 2499,
        category: "Electronics",
        stock: 50,
        imageUrl: "https://via.placeholder.com/400x400?text=Headphones",
        rating: 4.5,
        numReviews: 128,
      },
      {
        name: "Men's Casual Cotton Shirt",
        description: "Breathable 100% cotton shirt, perfect for casual outings. Available in multiple colors.",
        price: 899,
        category: "Clothing",
        stock: 120,
        imageUrl: "https://via.placeholder.com/400x400?text=Cotton+Shirt",
        rating: 4.2,
        numReviews: 85,
      },
      {
        name: "Smartphone Stand Holder",
        description: "Adjustable aluminum stand compatible with all phones and tablets. Foldable and portable.",
        price: 349,
        category: "Accessories",
        stock: 200,
        imageUrl: "https://via.placeholder.com/400x400?text=Phone+Stand",
        rating: 4.0,
        numReviews: 210,
      },
      {
        name: "Organic Green Tea (100 Bags)",
        description: "Premium organic green tea sourced from Darjeeling. Rich in antioxidants.",
        price: 499,
        category: "Groceries",
        stock: 75,
        imageUrl: "https://via.placeholder.com/400x400?text=Green+Tea",
        rating: 4.7,
        numReviews: 310,
      },
      {
        name: "Leather Wallet for Men",
        description: "Genuine leather bifold wallet with RFID blocking technology and 8 card slots.",
        price: 1299,
        category: "Accessories",
        stock: 60,
        imageUrl: "https://via.placeholder.com/400x400?text=Leather+Wallet",
        rating: 4.3,
        numReviews: 95,
      },
      {
        name: "Running Shoes - Men",
        description: "Lightweight cushioned running shoes with breathable mesh upper and responsive sole.",
        price: 3999,
        category: "Footwear",
        stock: 40,
        imageUrl: "https://via.placeholder.com/400x400?text=Running+Shoes",
        rating: 4.6,
        numReviews: 175,
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Double-wall vacuum insulated, keeps drinks cold 24hrs or hot 12hrs. 750ml capacity.",
        price: 599,
        category: "Accessories",
        stock: 90,
        imageUrl: "https://via.placeholder.com/400x400?text=Water+Bottle",
        rating: 4.4,
        numReviews: 420,
      },
      {
        name: "Women's Silk Scarf",
        description: "Elegant pure silk scarf with hand-rolled edges. Perfect accessory for any outfit.",
        price: 799,
        category: "Clothing",
        stock: 35,
        imageUrl: "https://via.placeholder.com/400x400?text=Silk+Scarf",
        rating: 4.1,
        numReviews: 62,
      },
    ]);
    console.log(`Seeded ${products.length} products`);

    // ── Orders ──
    const orders = await Order.create([
      {
        user: users[1]._id,
        items: [
          { productId: products[0]._id, quantity: 1, price: products[0].price },
          { productId: products[2]._id, quantity: 2, price: products[2].price },
        ],
        totalAmount: products[0].price + 2 * products[2].price,
        address: {
          fullName: "Anurag Mourya",
          street: "42, MG Road",
          city: "Indore",
          postalCode: "452001",
          country: "India",
        },
        paymentId: "pay_test_001",
        status: "delivered",
      },
      {
        user: users[2]._id,
        items: [
          { productId: products[1]._id, quantity: 3, price: products[1].price },
          { productId: products[4]._id, quantity: 1, price: products[4].price },
        ],
        totalAmount: 3 * products[1].price + products[4].price,
        address: {
          fullName: "Priya Sharma",
          street: "88, Park Avenue",
          city: "Mumbai",
          postalCode: "400001",
          country: "India",
        },
        paymentId: "pay_test_002",
        status: "shipped",
      },
      {
        user: users[1]._id,
        items: [
          { productId: products[5]._id, quantity: 1, price: products[5].price },
          { productId: products[6]._id, quantity: 2, price: products[6].price },
        ],
        totalAmount: products[5].price + 2 * products[6].price,
        address: {
          fullName: "Anurag Mourya",
          street: "42, MG Road",
          city: "Indore",
          postalCode: "452001",
          country: "India",
        },
        status: "pending",
      },
    ]);
    console.log(`Seeded ${orders.length} orders`);

    console.log("\n✅ Database seeded successfully!");
    console.log("─── Login Credentials ───");
    console.log("Admin: admin@shopnest.com / password123");
    console.log("User:  anurag@example.com / password123");
    console.log("User:  priya@example.com  / password123");
    console.log("User:  rahul@example.com  / password123 (unverified)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
