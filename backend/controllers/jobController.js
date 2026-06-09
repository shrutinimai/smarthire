const Job = require("../models/Job");
const User = require("../models/User");

const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, jobType, skills, openings } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      jobType,
      skills,
      openings,
      companyId: req.user.id,
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { location, jobType, search } = req.query;

    const where = { isActive: true };

    if (location) where.location = location;
    if (jobType) where.jobType = jobType;

    let jobs = await Job.findAll({
      where,
      include: [
        {
          model: User,
          as: "company",
          attributes: ["id", "name", "email", "profilePic"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.skills.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "company",
          attributes: ["id", "name", "email", "profilePic"],
        },
      ],
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.companyId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    await job.update(req.body);
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.companyId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob };