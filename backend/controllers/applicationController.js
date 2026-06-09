const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { getIO } = require("../config/socket");
const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = await Application.findOne({
      where: { candidateId: req.user.id, jobId },
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    const application = await Application.create({
      candidateId: req.user.id,
      jobId,
      coverLetter,
    });

    getIO().emit(`company_${job.companyId}`, {
  message: `New application received for ${job.title}`,
  application,
});

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [
        {
          model: Job,
          as: "job",
          include: [
            {
              model: User,
              as: "company",
              attributes: ["id", "name", "profilePic"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.companyId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        {
          model: User,
          as: "candidate",
          attributes: ["id", "name", "email", "profilePic"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: "job" }],
    });

    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.job.companyId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await application.update({ status });

    getIO().emit(`candidate_${application.candidateId}`, {
  message: `Your application status updated to: ${status}`,
  application,
});

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { applyJob, getMyApplications, getJobApplications, updateApplicationStatus };