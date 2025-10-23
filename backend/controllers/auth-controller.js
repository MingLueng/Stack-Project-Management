import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Verification from "../models/verification.js"; 
import {sendEmail} from "../libs/send-email.js";
import aj from "../libs/arcjet.js";


export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Arcjet check
    const decision = await aj.protect(req, { email });
    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
    }

    // 2. Check email tồn tại
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "Email address already in use",
      });
    }

    // 3. Tạo user
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name,
    });

    // 4. Tạo token xác minh
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expireAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });
    

    // 5. Gửi email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`;

    const emailSubject = "Verify your email address";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody); // Đúng thứ tự

    if (!isEmailSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Verification email sent. Please check and verify your account.",
    });

  } catch (error) {
    console.error("❌ Error in registerUser:", error);

    // ✅ Bắt buộc check headersSent trước khi trả response lần 2
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email }).select("+password");
    if (!existUser) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }

    if (!existUser.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: existUser._id,
      });

      if (existingVerification && existingVerification.expireAt > new Date()) {
        return res.status(400).json({
          message: "Email not verified. Please check your email for the verification link.",
        });
      }

      // Nếu vẫn tồn tại verification cũ, xóa đi
      if (existingVerification) {
        await Verification.findByIdAndDelete(existingVerification._id);
      }

      // Gửi lại email xác minh
      const verificationToken = jwt.sign(
        { userId: existUser._id, purpose: "email-verification" },
        process.env.JWT_TOKEN,
        { expiresIn: "1h" }
      );

      await Verification.create({
        userId: existUser._id,
        token: verificationToken,
        expireAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      });

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
      const emailSubject = "Verify your email";

      const isEmailSent = await sendEmail(email, emailSubject, emailBody);

      if (!isEmailSent) {
        return res.status(500).json({
          message: "Failed to send verification email",
        });
      }

      return res.status(201).json({
        message: "Verification email sent to your email. Please check and verify your account.",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: existUser._id, purpose: "login" },
      process.env.JWT_TOKEN,
      { expiresIn: "7d" }
    );

    existUser.lastLogin = new Date();
    await existUser.save();

    const userData = existUser.toObject();
    delete userData.password;

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: userData, // ✅ đặt tên user đúng thay vì `existUser`
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_TOKEN);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload // ✅ dùng verify token đúng

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const isTokenExpired = verification.expireAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id); // Xoá token sau khi xác minh thành công
    // ✅ Trả kết quả xong mới cleanup
    res.status(200).json({
      status: true,
      message: "Email verified successfully. You can now login to your account",
    });

  }
   catch (error) {
    console.error("❌ Error in verifyEmail:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {  
      return res.status(404).json({ status: false, message: "User not found" });
    } 
    if (!user.isEmailVerified) {
      return res.status(400).json({ status: false, message: "Email not verified" });
    }
    const existingVerification = await Verification.findOne({ userId: user._id });
    if (existingVerification && existingVerification.expireAt > new Date()) {
      return res.status(400).json({ status: false, message: "Reset password request already exists. Please check your email."});    
    }
    if (existingVerification && existingVerification.expireAt < new Date()) {
      // Xoá token cũ (nếu có)
      await Verification.findByIdAndDelete(existingVerification._id);
    }
    // Tạo token mới
    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_TOKEN,
      { expiresIn: "15m" }
    );
    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expireAt: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours
    });
    // Gửi email
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`;
    const emailSubject = "Reset your password";
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to send reset password email. Please try again later.",
      });
    }
    return res.status(200).json({
        status: true,
        message: "Reset password email sent successfully",
      });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
}
export const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_TOKEN);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expireAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


