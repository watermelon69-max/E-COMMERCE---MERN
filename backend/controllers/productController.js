import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const savedProduct = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    });
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
    // console.error(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category, stock } = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.imageUrl = result.secure_url;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
