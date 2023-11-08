import express from "express";
import { createPengajuan } from "../controllers/Pengajuan dan ProfilController.js";
import { verifyTokens } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/pengajuan', verifyTokens, createPengajuan)

export default router;