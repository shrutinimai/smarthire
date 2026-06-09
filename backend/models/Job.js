const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysqlDB");
const User = require("./User");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    defaultValue: "Not disclosed",
  },
  jobType: {
    type: DataTypes.ENUM("full-time", "part-time", "remote", "internship"),
    defaultValue: "full-time",
  },
  skills: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Job.belongsTo(User, { foreignKey: "companyId", as: "company" });
User.hasMany(Job, { foreignKey: "companyId", as: "jobs" });

module.exports = Job;