const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post("/", protect, authorizeRoles("company"), createJob);
router.get("/company/myjobs", protect, authorizeRoles("company"), getMyJobs);
router.put("/:id", protect, authorizeRoles("company"), updateJob);
router.delete("/:id", protect, authorizeRoles("company"), deleteJob);

module.exports = router;