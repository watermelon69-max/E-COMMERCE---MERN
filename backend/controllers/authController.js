import User from "../model/User.js";
import bcryptjs from "bcryptjs";
import generateJWTtoken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

//for registering a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      //generating otp
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      //writing message that i will send in mail to the new user
      const message = `Welcome to ShopNest , ${name} ! Your OTP for ShopNest registeration is ${otp}`;

      await sendEmail(
        email,
        "Welcome to ShopNest - Your OTP for registeration",
        message,
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateJWTtoken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in registerUser controller" });
  }
};

//when existing user want to login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcryptjs.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateJWTtoken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in loginUser controller" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error in getUsers controller" });
  }
};

export { registerUser, loginUser, getUsers };
