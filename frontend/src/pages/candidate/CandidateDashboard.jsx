import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";
import { Briefcase, FileText, Clock, CheckCircle, XCircle, Upload } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  applied: "bg-blue-100 text-blue-600",
  reviewed: "bg-yellow-100 text-yellow-600",
  shortlisted: "bg-purple-100 text-purple-600",
  rejected: "bg-red-100 text-red-600",
  hired: "bg-green-100 text-green-600",
};

const statusIcons = {
  applied: Clock,
  reviewed: Briefcase,
  shortlisted: CheckCircle,
  rejected: XCircle,
  hired: CheckCircle,
};

const CandidateDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "candidate") return navigate("/login");
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [appsRes, resumeRes] = await Promise.allSettled([
        axios.get("/applications/my"),
        axios.get("/resume/my"),
      ]);
      if (appsRes.status === "fulfilled") setApplications(appsRes.value.data);
      if (resumeRes.status === "fulfilled") setResume(resumeRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("Only PDF files allowed");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      const { data } = await axios.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(data.resume);
      toast.success("Resume uploaded successfully! ");
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { label: "Total Applied", value: applications.length, icon: Briefcase, color: "bg-blue-50 text-blue-600" },
    { label: "Shortlisted", value: applications.filter((a) => a.status === "shortlisted").length, icon: CheckCircle, color: "bg-purple-50 text-purple-600" },
    { label: "Hired", value: applications.filter((a) => a.status === "hired").length, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Rejected", value: applications.filter((a) => a.status === "rejected").length, icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="gradient-bg text-white rounded-3xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-indigo-100">Track your applications and manage your profile</p>
          </div>
          <Link
            to="/jobs"
            className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Applications */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">My Applications</h2>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-500">No applications yet</p>
                  <Link to="/jobs" className="text-primary font-medium text-sm mt-2 inline-block hover:underline">
                    Browse jobs and apply!
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {applications.map((app) => {
                    const Icon = statusIcons[app.status] || Clock;
                    return (
                      <div key={app.id} className="p-5 flex justify-between items-start hover:bg-gray-50 transition">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                            {app.job?.company?.name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{app.job?.title}</h3>
                            <p className="text-gray-500 text-sm">{app.job?.company?.name}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 ${statusColors[app.status]}`}>
                          <Icon className="w-3 h-3" />
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Resume</h2>
              {resume ? (
                <div>
                  <div className="bg-indigo-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <FileText className="text-primary w-8 h-8 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{resume.fileName}</p>
                      <p className="text-gray-400 text-xs">PDF Document</p>
                    </div>
                  </div>
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-primary border border-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-50 transition mb-3"
                  >
                    View Resume
                  </a>
                  <label className="block text-center gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition">
                    {uploading ? "Uploading..." : "Update Resume"}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                  </label>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-primary w-8 h-8" />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">No resume uploaded yet</p>
                  <label className="block gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition">
                    {uploading ? "Uploading..." : "Upload Resume (PDF)"}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                  </label>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="inline-block mt-2 bg-indigo-50 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Candidate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;