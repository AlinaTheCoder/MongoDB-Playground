import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import refreshTokenModel from "../models/Token.js";

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { user_id: user._id, role: user.role };

    const access_token = jwt.sign(payload, process.env.ACESS_TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });
    const refresh_token = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Store refresh token in DB
    await refreshTokenModel.create({
      user_id: user._id,
      refresh_token: refresh_token,
    });

    return res.json({
      message: "Login successful",
      data: {
        access_token,
        refresh_token,
      },
    });
  } catch (error) {
    console.log(`Error in Login User: ${error.message}`);
    return res.status(500).json({ message: "Server Error" });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { refresh_token: received_refresh_token } = req.body;
    if (!received_refresh_token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(
        received_refresh_token,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Check refresh token in DB
    const refreshTokenInDB = await refreshTokenModel.findOne({
      user_id: decodedUser.user_id,
    });
    if (
      !refreshTokenInDB ||
      refreshTokenInDB.refresh_token !== received_refresh_token
    ) {
      return res
        .status(401)
        .json({ message: "Invalid or revoked refresh token" });
    }

    // Rotate tokens (delete old one)
    await refreshTokenModel.deleteOne({ user_id: decodedUser.user_id });

    // Create new tokens
    const payload = { user_id: decodedUser.user_id, role: decodedUser.role };

    const new_access_token = jwt.sign(
      payload,
      process.env.ACESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const new_refresh_token = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    await refreshTokenModel.create({
      user_id: decodedUser.user_id,
      refresh_token: new_refresh_token,
    });

    return res.json({
      message: "Access token refreshed successfully",
      data: {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      },
    });
  } catch (error) {
    console.log(`Error while refreshing access token: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error while refreshing the token" });
  }
}

async function logout(req, res) {
  try {
    // console.log(`I'm inside the logout function`);

    const user = req.user; // comes from authMiddleware (decoded JWT)
    // console.log(user);

    // Delete refresh token(s) for this user
    const deletedTokens = await refreshTokenModel.deleteMany({
      user_id: user.user_id,
    });

    if (deletedTokens.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this user",
      });
    }

    return res.json({
      success: true,
      message: `Successfully logged out. Deleted ${deletedTokens.deletedCount} session(s).`,
    });
  } catch (error) {
    console.error(`Error while logout: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
}

export { registerUser, loginUser, refreshAccessToken, logout };
