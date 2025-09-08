import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  try {
    // console.log(`I'm inside authMiddleware!`);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header with Bearer token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET_KEY);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired!",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
  } catch (error) {
    console.error("Error while validating token:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export default authMiddleware;
