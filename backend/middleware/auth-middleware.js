// backend/middleware/auth-middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Lấy Authorization header (chấp nhận cả viết hoa/thường)
    const authHeader =
      req.headers.authorization || req.header("Authorization") || "";

    // Yêu cầu đúng format: "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: false, message: "Missing or invalid Authorization header" });
    }

    // Lấy token an toàn (không dùng split trên undefined)
    const token = authHeader.slice(7).trim(); // bỏ "Bearer "
    if (!token) {
      return res.status(401).json({ status: false, message: "Token not found" });
    }

    // Cho phép dùng JWT_TOKEN hoặc JWT_SECRET (tuỳ bạn đặt trong .env)
    const secret = process.env.JWT_TOKEN || process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ status: false, message: "Server misconfigured: JWT secret missing" });
    }

    // Verify & decode token
    const decoded = jwt.verify(token, secret);
    // decoded.userId phải khớp với lúc bạn sign token
    if (!decoded?.userId) {
      return res.status(401).json({ status: false, message: "Invalid token payload" });
    }

    // Tìm user trong DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "User not found or unauthorized" });
    }

    // Gắn vào req để controller sau dùng
    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ status: false, message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
      return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export default authMiddleware;
