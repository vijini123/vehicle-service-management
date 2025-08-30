import express from "express";
import { login, register } from "../Controllers/AuthController.js";
import AuthYup from "../Validations/AuthYup.js";
import validateSchema from "../Middleware/ValidateSchema.js";
import validateToken from "../Middleware/ValidateToken.js";
import refreshToken from "../Middleware/RefreshToken.js";

const router = express.Router()

router.post('/register', register, validateToken)
router.post('/login', login, validateToken)
router.get('/refresh', refreshToken, (req, res) => {
    res.status(200).json({ success: true, message: "Token refreshed" });
})

export default router;
