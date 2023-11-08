import express from "express";
import { Login, getUsers, register, registerAdmin, resetPassword, forgotPassword, Logout } from "../controllers/users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { adminOnly } from "../middleware/AdmnOnly.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/register', register);
router.post('/registeradm', registerAdmin);
router.post('/login', Login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router