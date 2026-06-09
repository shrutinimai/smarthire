const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysqlDB");
const User = require("./User");
const Job = require("./Job");

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("applied", "reviewed", "shortlisted", "rejected", "hired"),
    defaultValue: "applied",
  },
  coverLetter: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
}, {
  timestamps: true,
});

Application.belongsTo(User, { foreignKey: "candidateId", as: "candidate" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });
User.hasMany(Application, { foreignKey: "candidateId", as: "applications" });
Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });

module.exports = Application;