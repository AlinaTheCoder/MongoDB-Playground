import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    // Basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    //  do not save the plain text password in production apps
    // let's hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    // Create new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.log(`Error in Register User: ${error.message}`);
    return res.status(500).json({ message: "Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide  email and password" });
    }
    // Check if user  exists
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res
        .status(401)
        .json({ message: "The login information you entered is incorrect." });
    }

    // validates the password now if it's correct
    // get the stored password in db for this user
    const user = await userModel.findOne({ email }, { password: 1 });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: `Invalid Password!` });
    }
    // payload for the token
    let payload = {
      user_id: user._id,
      role: user.role,
    };
    // create and return jwt token short lived for the next authentication
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({
      message: `Login Successfull!`,
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.log(`Error in Login User: ${error.message}`);
    return res.status(500).json({ message: "Server Error" });
  }
}

export { registerUser, loginUser };
