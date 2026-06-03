import express  from "express";
import {getSavedJobs,saveJob,unSaveJob} from "../controllers/savedJobController.js";
import protect from "../middlewares/authMiddleware.js";

const router=express.Router();

router.get('/my',protect,getSavedJobs);
router.post('/:jobId',protect,saveJob);
router.delete('/:jobId',protect,unSaveJob);

export default router;