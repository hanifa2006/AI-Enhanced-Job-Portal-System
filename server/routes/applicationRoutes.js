const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply to a job (candidate only)
router.post(
  "/",
  protect,
  authorizeRoles("candidate"),
  async (req, res) => {
    try {
      const { jobId, resumeUrl, coverLetter } = req.body;

      const job = await Job.findById(jobId);
      if (!job || !job.isActive) {
        return res.status(404).json({ message: "Job not found or inactive" });
      }

      const existingApp = await Application.findOne({
        job: jobId,
        candidate: req.user.userId,
      });

      if (existingApp) {
        return res.status(400).json({ message: "Already applied to this job" });
      }

      const application = await Application.create({
        job: jobId,
        candidate: req.user.userId,
        resumeUrl,
        coverLetter,
      });

      res.status(201).json({ message: "Application submitted", application });
    } catch (error) {
      console.error("Apply job error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get applications of logged-in candidate
router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        candidate: req.user.userId,
      })
        .populate("job")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      console.error("Get candidate applications error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get applications for a specific job (employer/admin)
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("employer", "admin"),
  async (req, res) => {
    try {
      const { jobId } = req.params;

      const applications = await Application.find({ job: jobId })
        .populate("candidate")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      console.error("Get job applications error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update application status (employer/admin)
router.put(
  "/:id/status",
  protect,
  authorizeRoles("employer", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body; // applied, shortlisted, rejected, hired

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      application.status = status;
      await application.save();

      res.json({ message: "Application status updated", application });
    } catch (error) {
      console.error("Update application status error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;