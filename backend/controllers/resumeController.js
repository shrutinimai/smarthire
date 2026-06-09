const cloudinary = require("../config/cloudinary");
const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "smarthire/resumes",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        fileUrl: uploadResult.secure_url,
        fileName: req.file.originalname,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getResumeByUserId = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) {
      return res.status(404).json({ message: "No resume found for this user" });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateResumeDetails = async (req, res) => {
  try {
    const { skills, experience, education } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      { skills, experience, education },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found. Please upload first." });
    }

    res.status(200).json({ message: "Resume details updated", resume });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadResume,
  getMyResume,
  getResumeByUserId,
  updateResumeDetails,
  deleteResume,
};