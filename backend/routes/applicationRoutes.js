const express = require("express");
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/apply", protect, authorizeRoles("candidate"), applyJob);
router.get("/my", protect, authorizeRoles("candidate"), getMyApplications);

router.get("/job/:jobId", protect, authorizeRoles("company"), getJobApplications);
router.put("/:id/status", protect, authorizeRoles("company"), updateApplicationStatus);

module.exports = router;