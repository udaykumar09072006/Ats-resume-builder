import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  atsScoreCheck,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/ats-score", protect, atsScoreCheck);
// Temporary public endpoint for debugging (no auth) — remove or secure later
aiRouter.post("/ats-score-public", atsScoreCheck);

export default aiRouter;
