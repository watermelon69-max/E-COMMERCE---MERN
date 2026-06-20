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
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      const message = `Welcome to ShopNest, ${name}! Your OTP for ShopNest registration is ${otp}`;

      await sendEmail(
        email,
        "Welcome to ShopNest - Your OTP for registration",
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

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    if (!user.otp || !user.otpExpires) {
      return res
        .status(400)
        .json({ message: "No OTP found. Request a new one" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in verifyEmail controller" });
  }
};

export { registerUser, loginUser, getUsers, verifyEmail };
