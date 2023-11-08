import express from "express";
import { jsonData } from "../controllers/article.js";

const router = express.Router();

router.get('/blog',(req, res) => {
    res.json(jsonData);
});

export default router;