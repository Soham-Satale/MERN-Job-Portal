import express from "express"
import {applyToJob,getMyApplications,getApplicantsForJob,getApplicationById,updateStatus} from "../Controllers/ApplicationController.js";
import protect from "../middlewares/authMiddleware.js";

const router=express.Router();


router.get('/my',protect,getMyApplications);
router.post('/:jobId',protect,applyToJob);
router.get('/job/:jobId',protect,getApplicantsForJob);
router.get('/:Id',protect,getApplicationById);
router.put('/:Id/status',protect,updateStatus);

export default router;
