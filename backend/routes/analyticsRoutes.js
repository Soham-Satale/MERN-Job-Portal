import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {getEmployerAnalytics} from "../Controllers/analyticsController.js";

const router = express.Router();

router.get('/overview',protect,getEmployerAnalytics)

export default router;