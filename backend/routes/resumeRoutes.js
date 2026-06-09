const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getMyResume,
  getResumeByUserId,
  updateResumeDetails,
  deleteResume,
} = require("../controllers/resumeController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

router.post(
  "/upload",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);
router.get("/my", protect, authorizeRoles("candidate"), getMyResume);
router.put("/update", protect, authorizeRoles("candidate"), updateResumeDetails);
router.delete("/delete", protect, authorizeRoles("candidate"), deleteResume);

router.get("/:userId", protect, authorizeRoles("company"), getResumeByUserId);

module.exports = router;