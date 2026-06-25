import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyJobs, createJob, deleteJob } from "../../store/jobSlice";
import { Briefcase, Plus, Trash2, Users, Eye, X } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const CompanyDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [applications, setApplications] = useState([]);

  const [form, setForm] = useState({
    title: "", description: "", location: "",
    salary: "", jobType: "full-time", skills: "", openings: 1,
  });

  useEffect(() => {
    if (!user || user.role !== "company") return navigate("/login");
    dispatch(fetchMyJobs());
  }, [user]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createJob(form)).unwrap();
      toast.success("Job posted successfully! 🎉");
      setShowForm(false);
      setForm({ title: "", description: "", location: "", salary: "", jobType: "full-time", skills: "", openings: 1 });
    } catch (err) {
      toast.error(err || "Failed to post job");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await dispatch(deleteJob(jobId)).unwrap();
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const viewApplications = async (job) => {
    try {
      const { data } = await axios.get(`/applications/job/${job.id}`);
      setApplications(data);
      setSelectedJobApps(job);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const totalApplications = myJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="gradient-bg text-white rounded-3xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name}! 🏢</h1>
            <p className="text-indigo-100">Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Jobs Posted", value: myJobs.length, icon: Briefcase, color: "bg-blue-50 text-blue-600" },
            { label: "Total Applications", value: totalApplications, icon: Users, color: "bg-purple-50 text-purple-600" },
            { label: "Active Jobs", value: myJobs.filter((j) => j.isActive).length, icon: Eye, color: "bg-green-50 text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">My Job Postings</h2>
          </div>
          {myJobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">No jobs posted yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-primary font-medium text-sm mt-2 hover:underline"
              >
                Post your first job!
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myJobs.map((job) => (
                <div key={job.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-500 text-sm">{job.location} • {job.jobType} • {job.salary}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {job.openings} openings • Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewApplications(job)}
                      className="flex items-center gap-1 text-sm text-primary border border-primary px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition"
                    >
                      <Users className="w-4 h-4" /> Applications
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Post a New Job</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostJob} className="space-y-4">
              {[
                { label: "Job Title", key: "title", placeholder: "e.g. Frontend Developer" },
                { label: "Location", key: "location", placeholder: "e.g. Bangalore" },
                { label: "Salary", key: "salary", placeholder: "e.g. 8-12 LPA" },
                { label: "Skills (comma separated)", key: "skills", placeholder: "React, Node.js, MySQL" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                <select
                  value={form.jobType}
                  onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="remote">Remote</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Openings</label>
                <input
                  type="number"
                  min={1}
                  value={form.openings}
                  onChange={(e) => setForm({ ...form, openings: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the role, responsibilities..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                {loading ? "Posting..." : "Post Job 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {selectedJobApps && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Applications for "{selectedJobApps.title}"
              </h2>
              <button onClick={() => setSelectedJobApps(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {applications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-100 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold">
                          {app.candidate?.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.candidate?.name}</h3>
                          <p className="text-gray-500 text-sm">{app.candidate?.email}</p>
                        </div>
                      </div>
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                    {app.coverLetter && (
                      <p className="text-gray-500 text-sm bg-gray-50 rounded-xl p-3">
                        {app.coverLetter}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;