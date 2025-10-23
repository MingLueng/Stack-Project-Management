import express from "express";
import {string, z} from "zod";
import {validateRequest} from "zod-express-middleware";
import { registerSchema,loginSchema,verifyEmailSchema,resetPasswordSchema,resetPasswordRequestSchema } from "../libs/validate-schema.js";
import { registerUser } from "../controllers/auth-controller.js";
import { loginUser } from "../controllers/auth-controller.js";
import { verifyEmail } from "../controllers/auth-controller.js";
import { resetPasswordRequest } from "../controllers/auth-controller.js";
import { verifyResetPasswordTokenAndResetPassword } from "../controllers/auth-controller.js";
const router = express.Router();

router.post("/register",validateRequest({body:registerSchema}),registerUser);
router.post("/login",validateRequest({body:loginSchema}),loginUser);
router.post("/verify-email",validateRequest({body:verifyEmailSchema}),verifyEmail);
router.post("/reset-password",validateRequest({body:resetPasswordSchema}),verifyResetPasswordTokenAndResetPassword);
router.post("/reset-password-request",validateRequest({body:resetPasswordRequestSchema }),resetPasswordRequest);

export default router;