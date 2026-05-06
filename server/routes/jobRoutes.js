const express = require("express");
const Job = require("../models/Job");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a job (Employer only)
router.post(
  "/",
  protect,
  authorizeRoles("employer", "admin"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        companyName,
        location,
        employmentType,
        salaryRange,
        skills,
      } = req.body;

      const job = await Job.create({
        title,
        description,
        companyName,
        location,
        employmentType,
        salaryRange,
        skills,
        postedBy: req.user.userId, // employer id from token
      });

      res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
      console.error("Create job error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all active jobs (Any logged-in user, later even public)
router.get("/", async (req, res) => {
  try {
    const { keyword, location, employmentType } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { companyName: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error("Get job error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update job (only the employer who posted it or admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("employer", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // If employer, ensure they own the job
      if (req.user.role === "employer" && job.postedBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not allowed to update this job" });
      }

      const updates = req.body;
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      res.json({ message: "Job updated", job: updatedJob });
    } catch (error) {
      console.error("Update job error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete / deactivate job (employer or admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("employer", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });

      if (req.user.role === "employer" && job.postedBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not allowed to delete this job" });
      }

      job.isActive = false;
      await job.save();

      res.json({ message: "Job deactivated" });
    } catch (error) {
      console.error("Delete job error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;